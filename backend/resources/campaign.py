from flask_restful import Resource, reqparse
from models.campaign import Campaign as CampaignModel
from models.company import Company as CompanyModel
from models.user import User as UserModel
from models.task import Task as TaskModel
from flask import request
import json

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
        


        response = CampaignModel.add_participant()

        if response["error"]:
            return {"error": True, "data": response["data"]}, 400
        
        return {"error": False, "data": response["data"]}, 200