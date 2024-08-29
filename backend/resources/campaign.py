from flask_restful import Resource, reqparse
from models.campaign import Campaign as CampaignModel
from models.company import Company as CompanyModel
from models.user import User as UserModel
from models.task import Task as TaskModel
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from functions.get_twitter_post_insights import get_tweet_info
import datetime
from flask import request
import json

from aptos_sdk.account import Account
from aptos_sdk.account_address import AccountAddress
from aptos_sdk.aptos_cli_wrapper import AptosCLIWrapper
from aptos_sdk.async_client import FaucetClient, ResourceNotFound, RestClient
from aptos_sdk.bcs import Serializer
from aptos_sdk.package_publisher import PackagePublisher
from aptos_sdk.transactions import (
    EntryFunction,
    TransactionArgument,
    TransactionPayload,
)
import requests
import json

scheduler = BackgroundScheduler()
scheduler.start()

class Campaign(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("campaign_name", type=str, required=True)
        parser.add_argument("campaign_description", type=str, required=True)
        parser.add_argument("company_name", type=str, required=True)
        parser.add_argument("start_time", type=str, required=True)
        parser.add_argument("end_time", type=str, required=True)
        parser.add_argument("payout_time", type=str, required=True)
        parser.add_argument("prize_pool", type=float, required=True)
        parser.add_argument("post", type=str, required=True)
        parser.add_argument("likes", type=str, required=True)
        parser.add_argument("minimum_likes", type=int)
        parser.add_argument("followers", type=str, required=True)
        parser.add_argument("minimum_followers", type=int)
        args = parser.parse_args()

        args["campaign_id"] = str(CampaignModel.objects().count() + 1).zfill(4)

        response = CampaignModel.add_campaign(args)

        if response["error"]:
            return {"error": True, "data": response["data"]}, 400
        
        payout_time = datetime.datetime.strptime(args["payout_time"], '%Y-%m-%d %H:%M:%S')
        job = scheduler.add_job(
            distribute_funds,
            trigger=DateTrigger(run_date=payout_time),
            args=[args["campaign_id"]]
        )
        
        return {"error": False, "data": args["campaign_id"]}, 201
    
    def get(self):
        campaign_id = request.args.get("campaign_id")
        company_name = request.args.get("company_name")
        
        if campaign_id:
            response = CampaignModel.get_campaign(campaign_id)
            if response["error"]:
                return {"error": True, "data": response["data"]}, 400

            campaign_data = json.loads(response["data"].to_json())

            response = CompanyModel.get_company_by_name(campaign_data['company_name'])
            if response["error"]:
                return {"error": True, "data": response["data"]}, 400
            
            company_data = json.loads(response["data"].to_json())

            response = TaskModel.get_task_by_id(campaign_data['task_id'])
            if response["error"]:
                return {"error": True, "data": response["data"]}, 400

            campaign_data["company_twitter"] = company_data["company_twitter"]
            campaign_data["company_website"] = company_data["company_website"]
            campaign_data["task"] = json.loads(response["data"].to_json())
            
            return {"error": False, "data": campaign_data}, 200

        elif company_name:
            response = CampaignModel.get_campaigns_by_company(company_name)
            if response["error"]:
                return {"error": True, "data": response["data"]}, 400
            
            campaign_data = json.loads(response["data"].to_json())
            
            response = CompanyModel.get_company_by_name(company_name)
            if response["error"]:
                return {"error": True, "data": response["data"]}, 400
            
            company_data = json.loads(response["data"].to_json())
            
            data = []
            for campaign in campaign_data:
                campaign["company_twitter"] = company_data["company_twitter"]
                campaign["company_website"] = company_data["company_website"]
                data.append(campaign)

            return {"error": False, "data": data}, 200
        
        else:
            response = CampaignModel.get_all_campaigns()
            if response["error"]:
                return {"error": True, "data": response["data"]}, 400
            
            campaign_data = json.loads(response["data"].to_json())

            data = []
            for campaign in campaign_data:
                response = CompanyModel.get_company_by_name(campaign['company_name'])
                if response["error"]:
                    return {"error": True, "data": response["data"]}, 400
                
                company_data = json.loads(response["data"].to_json())

                campaign["company_twitter"] = company_data["company_twitter"]
                campaign["company_website"] = company_data["company_website"]
                data.append(campaign)
        
            return {"error": False, "data": data}, 200

class AddParticipantToCampaign(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("campaign_id", type=str, required=True, help="Campaign ID is required")
        parser.add_argument("wallet_address", type=str, required=True, help="Wallet address is required")
        parser.add_argument("instagram_post_id", type=str)
        parser.add_argument("twitter_post_id", type=str)
        args = parser.parse_args()

        # pop out campaign_id from args
        campaign_id = args.pop("campaign_id")

        response = CampaignModel.add_participant(campaign_id, args)

        if response["error"]:
            return {"error": True, "data": response["data"]}, 400
        
        return {"error": False, "data": response["data"]}, 200
    
# async def distribute_funds(self, campaign_id=None):
#     eligible_participants = check_likes_count(campaign_id)
#     print("eligible participants: ", eligible_participants)

#     contract_address = "0xf0c37761c0d644014c98bec8255d5836f13b4120b9059a0dab21a49355dded53"

#     message = [
#         campaign_id,
#         eligible_participants["eligible_participants"],
#         eligible_participants["number_of_likes"]
#     ]


#     payload = EntryFunction.natural(
#         f"{contract_address}::stream",
#         "distribute_rewards",
#         [],
#         [TransactionArgument(message, Serializer.str)],
#     )

#     sender = {"address": "0xf0c37761c0d644014c98bec8255d5836f13b4120b9059a0dab21a49355dded53", "publicKey": "0xc7c64e5cbd60cf112b105c4b965539b210831e79bb09a1e4a89207bbe6f1d142"}


#     signed_transaction = await self.create_bcs_signed_transaction(
#         sender, TransactionPayload(payload)
#     )
#     return await self.submit_bcs_transaction(signed_transaction)

#     return {"message": "Funds distributed"}

async def distribute_funds(self, campaign_id=None):
    eligible_participants = check_likes_count(campaign_id)

    message = {
        "campaign_id": campaign_id,
        "eligible_participants": eligible_participants["eligible_participants"],
        "number_of_likes": eligible_participants["number_of_likes"]
    }

    url = "localhost:5001/campaign"
    payload = json.dumps(message)
    headers = {'Content-Type': 'application/json'}
    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.json())

def check_likes_count(campaign_id):
    response = CampaignModel.get_campaign(campaign_id)
    if response["error"]:
        return {"error": True, "data": response["data"]}
    
    minimum_likes = response["data"]["minimum_likes"]

    response = CampaignModel.get_participants(campaign_id)
    if response["error"]:
        return {"error": True, "data": response["data"]}
    
    participants = response["data"]
    eligible_participants = []
    number_of_likes = []

    for participant in participants:
        response = get_tweet_info(participant["twitter_post_id"])
        if response["error"] == "true":
            continue

        likes_count = response["likes_count"]
        if likes_count >= minimum_likes:
            eligible_participants.append(participant["wallet_address"])
            number_of_likes.append(likes_count)

    data = {
        "eligible_participants": eligible_participants,
        "number_of_likes": number_of_likes
    }

    return data


class GetCampaignParticipants(Resource):
    def get(self):
        campaign_id = request.args.get("campaign_id")
        
        response = CampaignModel.get_participants(campaign_id)
        if response["error"]:
            return {"error": True, "data": response["data"]}, 400
        
        participants = response["data"]
        print("participants: ", participants)
        final_data = []

        for participant in participants:
            data = {
                "twitter_post_id": participant["twitter_post_id"],
                "likes_count": 0,
                "comment_count": 0,
                "retweet_count": 0,
                "quote_count": 0
            }
            response = get_tweet_info(participant["twitter_post_id"])
            if response["error"] == "true":
                continue
            data["likes_count"] = response["likes_count"]
            data["comment_count"] = response["comment_count"]
            data["retweet_count"] = response["retweet_count"]
            data["quote_count"] = response["quote_count"]

            final_data.append(data)

        print("final_data: ", final_data)

        
        return {"error": False, "data": final_data}, 200

print(distribute_funds("0001"))