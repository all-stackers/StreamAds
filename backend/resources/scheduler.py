from flask_restful import Resource, reqparse
from models.campaign import Campaign as CampaignModel
from models.task import Task as TaskModel
from flask import request
import json
from flask import Flask, request, jsonify
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
import datetime

scheduler = BackgroundScheduler()
scheduler.start()

class Scheduler(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("campaign_id", type=str, required=True, help="Campaign ID is required")
        parser.add_argument("payout_time", type=str, required=True, help="Payout time is required")
        args = parser.parse_args()

        payout_time = datetime.datetime.strptime(args["payout_time"], '%Y-%m-%d %H:%M:%S')
        job = scheduler.add_job(
            distribute_funds,
            trigger=DateTrigger(run_date=payout_time),
            args=[args["campaign_id"]]
        )

        return jsonify({"message": "Funds distribution scheduled", "job_id": job.id})

def distribute_funds(payload=None):
    response = {"message": "Funds distributed", "data": payload}
    check_likes_count(10, "0001")
    print(response)  # Print the response to the console for confirmation
    return response

def check_likes_count(minimum_likes, campaign_id):
    response = CampaignModel.get_participants(campaign_id)

    if response["error"]:
        return {"error": True, "data": response["data"]}
    
    participants = response["data"]

    for participant in participants:
        print(participant)


def retrieve_likes_count():
    





        