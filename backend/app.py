from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from flask_restful import Api
from mongo_engine import db
from flask_cors import CORS
import os
import json
from flask import Flask, jsonify, redirect, request, session
from requests_oauthlib import OAuth1Session
import time
import uuid
import hmac
import tweepy
import hashlib
import urllib.parse
import requests

from resources.company import Company
from resources.user import User
from resources.campaign import Campaign, AddParticipantToCampaign
from resources.insta_post import Posts
from resources.cloudinary import Cloudinary
from resources.retrieve_likes import  RetrieveLike
from resources.hastag_generation import  Hashtags
from resources.hastag_generation import  Caption



app = Flask(__name__)
api = Api(app)
CORS(app)

app.config["MONGODB_HOST"] = os.getenv("FLASK_MONGODB_URI")
db.init_app(app)

api.add_resource(Company, '/company')
api.add_resource(User, '/user')
api.add_resource(Campaign, '/campaign')
api.add_resource(AddParticipantToCampaign,'/campaign/add_participant')
api.add_resource(Posts,'/posts')
api.add_resource(Cloudinary, "/cloudinary")
api.add_resource(RetrieveLike, "/retrieve_likes")
api.add_resource(Hashtags, "/hashtag")
api.add_resource(Caption, "/caption")











CONSUMER_KEY = os.getenv('CONSUMER_KEY')
CONSUMER_SECRET = os.getenv('CONSUMER_SECRET')
REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
AUTHENTICATE_URL = 'https://api.twitter.com/oauth/authenticate'
ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'
MEDIA_UPLOAD_URL = 'https://upload.twitter.com/1.1/media/upload.json'
TWEET_CREATE_URL = 'https://api.twitter.com/1.1/statuses/update.json'
RETWEET_URL = 'https://api.twitter.com/2/tweets/:id/retweets'
QUOTE_TWEET_URL_TEMPLATE = 'https://api.twitter.com/2/tweets/{}/quote_tweets'

@app.route('/login')
def login():
    oauth = OAuth1Session(CONSUMER_KEY, client_secret=CONSUMER_SECRET)
    try:
        fetch_response = oauth.fetch_request_token(REQUEST_TOKEN_URL)
    except ValueError:
        return 'There was an error obtaining the request token from Twitter.'

    session['oauth_token'] = fetch_response.get('oauth_token')
    session['oauth_token_secret'] = fetch_response.get('oauth_token_secret')

    authorization_url = oauth.authorization_url(AUTHENTICATE_URL)
    return redirect(authorization_url)

@app.route('/callback')
def callback():
    oauth_token = request.args.get('oauth_token')
    oauth_verifier = request.args.get('oauth_verifier')

    if not oauth_token or not oauth_verifier:
        return 'Error: Missing oauth_token or oauth_verifier.'

    oauth = OAuth1Session(CONSUMER_KEY,
                          client_secret=CONSUMER_SECRET,
                          resource_owner_key=session.get('oauth_token'),
                          resource_owner_secret=session.get('oauth_token_secret'))

    try:
        oauth_response = oauth.fetch_access_token(ACCESS_TOKEN_URL, verifier=oauth_verifier)
    except ValueError as e:
        return f'Error fetching access token: {str(e)}'

    session['access_token'] = oauth_response.get('oauth_token')
    session['access_token_secret'] = oauth_response.get('oauth_token_secret')

    return 'You are logged in! <a href="/tweet">Post a Tweet</a> | <a href="/quote-tweet">Quote a Tweet</a> | <a href="/retweet">Retweet</a> | <a href="/tweet_with_media">Post a Tweet with Media</a> | <a href="/get_likes">Get Likes</a>'

def generate_oauth_signature(method, url, params):
    """Generate OAuth 1.0a signature."""
    # Create signature base string
    sorted_params = sorted(params.items())
    encoded_params = urllib.parse.urlencode(sorted_params, quote_via=urllib.parse.quote)
    base_string = '&'.join([
        method.upper(),
        urllib.parse.quote(url, safe=''),
        urllib.parse.quote(encoded_params, safe='')
    ])

    # Create signing key
    signing_key = '&'.join([
        urllib.parse.quote(CONSUMER_SECRET, safe=''),
        urllib.parse.quote(session.get('access_token_secret'), safe='')
    ])

    # Generate the signature
    hashed = hmac.new(signing_key.encode('utf-8'), base_string.encode('utf-8'), hashlib.sha1)
    signature = hashed.digest().hex()
    
    print(f"Base String: {base_string}")
    print(f"Signing Key: {signing_key}")
    print(f"Signature: {signature}")

    return urllib.parse.quote(signature, safe='')


def build_auth_header(oauth_params):
    return 'OAuth ' + ', '.join([
        f'{key}="{value}"' for key, value in sorted(oauth_params.items())
    ])

@app.route('/tweet')
def tweet():
    payload = {"text": "Hello Deep Here"}
    oauth = OAuth1Session(
        CONSUMER_KEY,
        client_secret=CONSUMER_SECRET,
        resource_owner_key=os.getenv('access_token'),
        resource_owner_secret=os.getenv('access_token_secret'),
    )

    # Making the request
    response = oauth.post(
        "https://api.twitter.com/2/tweets",
        json=payload,
    )

    if response.status_code != 201:
        error_message = "Request returned an error: {} {}".format(response.status_code, response.text)
        return jsonify({"error": error_message}), response.status_code

    # Saving the response as JSON
    json_response = response.json()
    print(json.dumps(json_response, indent=4, sort_keys=True))
    
    # Return the tweet ID or a success message
    tweet_id = json_response.get('data', {}).get('id')
    if tweet_id:
        return jsonify({"message": "Tweet posted successfully!", "tweet_id": tweet_id}), 201
    else:
        return jsonify({"error": "Tweet posting failed, no tweet ID in response"}), 500

    
@app.route('/quote-tweet')
def quotetweet():
    client = tweepy.Client(
        bearer_token=os.getenv('bearer_token'),
        consumer_key=CONSUMER_KEY,
        consumer_secret=CONSUMER_SECRET,
        access_token=session.get('access_token'),
        access_token_secret=session.get('access_token_secret')
    )
    print(client)
    try:
        quote_text = "Get a Look! 🚀"
        quote_tweet_response = client.create_tweet(text=quote_text, quote_tweet_id="1828775378380324889")
        # Post a tweet using the API v2
        response = quote_tweet_response
        return f"Tweet posted successfully! Tweet ID: {response.data['id']}"
    except tweepy.TweepyException as e:
        return f"Failed to post tweet. Error: {e}"
    

@app.route('/get_likes')
def get_liking_users():
    tweet_id="1828775378380324889"
    client = tweepy.Client(
        bearer_token=os.getenv('bearer_token'),
        consumer_key=CONSUMER_KEY,
        consumer_secret=CONSUMER_SECRET,
        access_token=session.get('access_token'),
        access_token_secret=session.get('access_token_secret')
    )
    try:
        # Get the users who liked the tweet
        response = client.get_liking_users(tweet_id)
        print(response.json)
        if response.data:
            likes = response.data
            for user in likes:
                print(f"User ID: {user.id}, Username: {user.username}")
        else:
            print("No users found.")
    except Exception as e:
        print(f"Error: {e}")
    

MEDIA_UPLOAD_URL = "https://upload.twitter.com/1.1/media/upload.json"
TWEET_CREATE_URL = "https://api.twitter.com/1.1/statuses/update.json"

@app.route('/tweet_with_media')
def tweet_with_media():
    media_url = "https://apricot-big-hookworm-563.mypinata.cloud/ipfs/bafkreihgb32abtzuep7vagiiusc3nufuxy4h6vaopvhehu42lsuhfztat4"

    # Create OAuth1 session
    oauth = OAuth1Session(
        CONSUMER_KEY,
        client_secret=CONSUMER_SECRET,
        resource_owner_key=session.get('access_token'),
        resource_owner_secret=session.get('access_token_secret'),
    )

    # Upload media
    media_response = oauth.post(
        MEDIA_UPLOAD_URL,
        files={'media': requests.get(media_url).content},
        params={'media_category': 'tweet_image'}  # Adjust as needed
    )

    if media_response.status_code != 200:
        return jsonify({
            "error": "Failed to upload media.",
            "status_code": media_response.status_code,
            "response_text": media_response.text
        }), media_response.status_code

    media_id = media_response.json().get('media_id_string')
    
    # Post a tweet with the media
    tweet_payload = {
        'status': 'Here is a tweet with media!',
        'media_ids': media_id
    }
    tweet_response = oauth.post(
        TWEET_CREATE_URL,
        params=tweet_payload
    )

    if tweet_response.status_code != 200:
        return jsonify({
            "error": "Failed to post tweet.",
            "status_code": tweet_response.status_code,
            "response_text": tweet_response.text
        }), tweet_response.status_code

    # Saving the response as JSON
    json_response = tweet_response.json()
    print(json.dumps(json_response, indent=4, sort_keys=True))
    
    # Return the tweet ID or a success message
    tweet_id = json_response.get('id_str')
    if tweet_id:
        return jsonify({"message": "Tweet posted successfully!", "tweet_id": tweet_id}), 201
    else:
        return jsonify({"error": "Tweet posting failed, no tweet ID in response"}), 500

    
    

@app.route('/retweet')
def retweet():
    tweet_id_to_retweet = "1828775378380324889"  # Replace with the tweet ID you want to retweet

    oauth_params = {
        'oauth_consumer_key': CONSUMER_KEY,
        'oauth_nonce': str(uuid.uuid4().hex),
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_timestamp': str(int(time.time())),
        'oauth_token': session.get('access_token'),
        'oauth_version': '1.0'
    }

    retweet_url = f'https://api.twitter.com/2/tweets/{tweet_id_to_retweet}/retweets'
    oauth_params['oauth_signature'] = generate_oauth_signature('POST', retweet_url, oauth_params)
    auth_header = build_auth_header(oauth_params)

    response = requests.post(retweet_url, headers={
        'Authorization': auth_header
    })

    print(f"Retweet response status code: {response.status_code}")
    print(f"Retweet response text: {response.text}")

    if response.status_code == 200:
        return f'Successfully retweeted! Tweet ID: {response.json()["data"]["id"]}'
    else:
        return f'Failed to retweet. Status code: {response.status_code}. Response: {response.text}'



if __name__ == "__main__":
   app.run(host='0.0.0.0', port=5000, debug=True)
