from flask_restful import Resource, reqparse
from models.campaign import Campaign as CampaignModel
from models.company import Company as CompanyModel
from flask import request
import json

class Campaign(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("campaign_name", type=str, required=True)
        parser.add_argument("campaign_description", type=str, required=True)
        parser.add_argument("company_name", type=str, required=True)
        parser.add_argument("media_url", type=str, required=True)
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
        
        return {"error": False, "data": response["data"]}, 201
    
    def get(self):
        campaign_id = request.args.get("campaign_id")
        
        if campaign_id:
            response = CampaignModel.get_campaign(campaign_id)
            if response["error"]:
                return {"error": True, "data": response["data"]}, 400

            campaign_data = response["data"]

            response = CompanyModel.get_company(campaign_data['company_name'])
            if response["error"]:
                return {"error": True, "data": response["data"]}, 400
            
            company_data = response["data"]

            data = {
                "campaign_id": campaign_data["campaign_id"],
                "campaign_name": campaign_data["campaign_name"],
                "campaign_description": campaign_data["campaign_description"],
                "company_name": campaign_data["company_name"],
                "company_logo": company_data["company_logo"],
                "company_twitter": company_data["company_twitter"],
                "company_website": company_data["company_website"],
                "media_url": campaign_data["media_url"],
                "start_time": campaign_data["start_time"],
                "end_time": campaign_data["end_time"],
                "payout_time": campaign_data["payout_time"],
                "prize_pool": campaign_data["prize_pool"],
                "post": campaign_data["post"],
                "likes": campaign_data["likes"],
                "minimum_likes": campaign_data["minimum_likes"],
                "followers": campaign_data["followers"],
                "minimum_followers": campaign_data["minimum_followers"],
                "participants": campaign_data["participants"]
            }

            return {"error": False, "data": json.dumps(data)}, 200

        else:
            response = CampaignModel.get_all_campaigns()
            if response["error"]:
                return {"error": True, "data": response["data"]}, 400
            
            data = []
            for campaign in response["data"]:
                response = CompanyModel.get_company(campaign['company_name'])
                if response["error"]:
                    return {"error": True, "data": response["data"]}, 400
                
                company_data = response["data"]

                data.append({
                    "campaign_id": campaign["campaign_id"],
                    "campaign_name": campaign["campaign_name"],
                    "campaign_description": campaign["campaign_description"],
                    "company_name": campaign["company_name"],
                    "company_logo": company_data["company_logo"],
                    "company_twitter": company_data["company_twitter"],
                    "company_website": company_data["company_website"],
                    "media_url": campaign["media_url"],
                    "start_time": campaign["start_time"],
                    "end_time": campaign["end_time"],
                    "payout_time": campaign["payout_time"],
                    "prize_pool": campaign["prize_pool"],
                    "post": campaign["post"],
                    "likes": campaign["likes"],
                    "minimum_likes": campaign["minimum_likes"],
                    "followers": campaign["followers"],
                    "minimum_followers": campaign["minimum_followers"],
                    "participants": campaign["participants"]
                })
        
            return {"error": False, "data": json.dumps(data)}, 200


class AddParticipantToCampaign(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("campaign_id", type=str, required=True)
        parser.add_argument("wallet_address", type=str, required=True)
        args = parser.parse_args()

        response = CampaignModel.add_participant(args)

        if response["error"]:
            return {"error": True, "data": response["data"]}, 400
        
        return {"error": False, "data": response["data"]}, 200