from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from flask_restful import Api
from mongo_engine import db
from flask_cors import CORS
import os

from resources.company import Company
# from resources.user import User
from resources.campaign import Campaign, AddParticipantToCampaign
from resources.task import Task
# from resources.insta_post import Posts
# from resources.cloudinary import Cloudinary
# from resources.retrieve_likes import  RetrieveLike
# from resources.hastag_generation import  Hashtags
# from resources.hastag_generation import  Caption



app = Flask(__name__)
api = Api(app)
CORS(app)

app.config["MONGODB_HOST"] = os.getenv("FLASK_MONGODB_URI")
db.init_app(app)

api.add_resource(Company, '/company')
# api.add_resource(User, '/user')
api.add_resource(Campaign, '/campaign')
api.add_resource(AddParticipantToCampaign,'/campaign/add_participant')
# api.add_resource(Posts,'/posts')
# api.add_resource(Cloudinary, "/cloudinary")
# api.add_resource(RetrieveLike, "/retrieve_likes")
# api.add_resource(Hashtags, "/hashtag")
# api.add_resource(Caption, "/caption")
api.add_resource(Task, '/task')


if __name__ == "__main__":
   app.run(host='0.0.0.0', port=5000, debug=True)
