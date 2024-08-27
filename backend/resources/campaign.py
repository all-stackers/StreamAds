from flask_restful import Resource, reqparse
from models.campaign import Campaign as CampaignModel
from flask import request

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
        else:
            response = CampaignModel.get_all_campaigns()
            
        if response["error"]:
            return {"error": True, "data": response["data"]}, 400
        
        return {"error": False, "data": response["data"]}, 200


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