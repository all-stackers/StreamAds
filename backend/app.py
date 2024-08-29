from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from flask_restful import Api
from mongo_engine import db
from flask_cors import CORS
import os
import json
from flask import Flask, jsonify, redirect, request, session
from requests_oauthlib import OAuth1, OAuth1Session
import time
import uuid
import hmac
import tweepy
import hashlib
import urllib.parse
import requests

from resources.company import Company
# from resources.user import User
from resources.campaign import Campaign
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
# api.add_resource(AddParticipantToCampaign,'/campaign/add_participant')
# api.add_resource(Posts,'/posts')
# api.add_resource(Cloudinary, "/cloudinary")
# api.add_resource(RetrieveLike, "/retrieve_likes")
# api.add_resource(Hashtags, "/hashtag")
# api.add_resource(Caption, "/caption")
api.add_resource(Task, '/task')





app.secret_key = os.urandom(24)

# Twitter API credentials
APTOS_CONSUMER_KEY = os.getenv('APTOS_CONSUMER_KEY')
APTOS_CONSUMER_SECRET = os.getenv('APTOS_CONSUMER_SECRET')
REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
AUTHENTICATE_URL = 'https://api.twitter.com/oauth/authenticate'
ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'
MEDIA_UPLOAD_URL = 'https://upload.twitter.com/1.1/media/upload.json'
TWEET_CREATE_URL = 'https://api.twitter.com/1.1/statuses/update.json'
RETWEET_URL = 'https://api.twitter.com/2/tweets/:id/retweets'
QUOTE_TWEET_URL_TEMPLATE = 'https://api.twitter.com/2/tweets/{}/quote_tweets'

@app.route('/login')
def login():
    oauth = OAuth1Session(APTOS_CONSUMER_KEY, client_secret=APTOS_CONSUMER_SECRET)
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

    oauth = OAuth1Session(APTOS_CONSUMER_KEY,
                          client_secret=APTOS_CONSUMER_SECRET,
                          resource_owner_key=session.get('oauth_token'),
                          resource_owner_secret=session.get('oauth_token_secret'))

    try:
        oauth_response = oauth.fetch_access_token(ACCESS_TOKEN_URL, verifier=oauth_verifier)
    except ValueError as e:
        return f'Error fetching access token: {str(e)}'

    session['access_token'] = oauth_response.get('oauth_token')
    session['access_token_secret'] = oauth_response.get('oauth_token_secret')

    #DB code to store the access token and secret


    #After that replace session.get('access_token') session.get('access_token_secret') with the db values respectively

    return 'You are logged in! <a href="/tweet">Post a Tweet</a> | <a href="/quote-tweet">Quote a Tweet</a> | <a href="/retweet">Retweet</a> | <a href="/tweet_with_media">Post a Tweet with Media</a> | <a href="/get_tweet_info">Get Likes</a>'

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
        urllib.parse.quote(APTOS_CONSUMER_SECRET, safe=''),
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
        APTOS_CONSUMER_KEY,
        client_secret=APTOS_CONSUMER_SECRET,
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
    quote_tweet_id_here = "1828775378380324889"  # The tweet ID you want to quote
    client = tweepy.Client(
        bearer_token=os.getenv('bearer_token'),
        CONSUMER_KEY=APTOS_CONSUMER_KEY,
        CONSUMER_SECRET=APTOS_CONSUMER_SECRET,
        access_token=session.get('access_token'),
        access_token_secret=session.get('access_token_secret')
    )
    print(client)
    try:
        quote_text = "Get a Look! 🚀"
        quote_tweet_response = client.create_tweet(text=quote_text, quote_tweet_id=quote_tweet_id_here)
        # Post a tweet using the API v2
        response = quote_tweet_response
        return f"Tweet posted successfully! Tweet ID: {response.data['id']}"
    except tweepy.TweepyException as e:
        return f"Failed to post tweet. Error: {e}"
    

def get_tweet_details(tweet_id, auth):
    url = f"https://api.twitter.com/2/tweets/{tweet_id}?tweet.fields=public_metrics"
    headers = {"User-Agent": "v2TweetLookupPython"}
    
    response = requests.get(url, auth=auth, headers=headers)
    response.raise_for_status()
    
    return response.json()

def get_liking_users(tweet_id):
    auth = OAuth1(
        os.environ.get("APTOS_CONSUMER_KEY"),
        os.environ.get("APTOS_CONSUMER_SECRET"),
        session.get('access_token'),
        session.get('access_token_secret')
    )
    
    likes_url = f"https://api.twitter.com/2/tweets/{tweet_id}/liking_users"
    likes_headers = {"User-Agent": "v2LikingUsersPython"}
    
    try:
        # Get tweet details first
        tweet_details = get_tweet_details(tweet_id, auth)
        
        # Check if 'data' key exists in tweet details
        if 'data' not in tweet_details:
            return {"error": "true", "message": "Invalid post ID"}
        
        # Then get liking users
        likes_response = requests.get(likes_url, auth=auth, headers=likes_headers)
        likes_response.raise_for_status()
        
        likes_json = likes_response.json()
        
        # Extract metrics from tweet details
        metrics = tweet_details['data'].get('public_metrics', {})
        
        return {
            "error": "false",
            "tweet_id": tweet_id,
            "likes_count": metrics.get('like_count', 0),
            "comment_count": metrics.get('reply_count', 0),
            "retweet_count": metrics.get('retweet_count', 0),
            "quote_count": metrics.get('quote_count', 0),
        }
        
    except requests.exceptions.HTTPError as http_err:
        if http_err.response.status_code == 404:
            return {"error": "true", "message": "Invalid post ID"}
        print(f"HTTP error occurred: {http_err}")
        return {"error": "HTTP error", "details": str(http_err)}
    except requests.exceptions.RequestException as req_err:
        print(f"Request error occurred: {req_err}")
        return {"error": "Request error", "details": str(req_err)}
    except ValueError as json_err:
        print(f"JSON decoding error: {json_err}")
        return {"error": "JSON decoding error", "details": str(json_err)}
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {"error": "Unexpected error", "details": str(e)}

@app.route('/get_tweet_info')
def get_tweet_info():
    tweet_id = "1786444853103964240"  # The tweet ID you're interested in
    result = get_liking_users(tweet_id)
    return jsonify(result)


    

MEDIA_UPLOAD_URL = "https://upload.twitter.com/1.1/media/upload.json"
TWEET_CREATE_URL = "https://api.twitter.com/2/tweets"

@app.route('/tweet_with_media')
def tweet_with_media():
    media_url = "https://apricot-big-hookworm-563.mypinata.cloud/ipfs/bafkreihgb32abtzuep7vagiiusc3nufuxy4h6vaopvhehu42lsuhfztat4"
    tweet_text = "Here is a tweet with media!"

    # Create OAuth1 session
    oauth = OAuth1Session(
        os.environ.get("APTOS_CONSUMER_KEY"),
        client_secret=os.environ.get("APTOS_CONSUMER_SECRET"),
        resource_owner_key=session.get('access_token'),
        resource_owner_secret=session.get('access_token_secret'),
    )

    try:
        # Download the image
        image_response = requests.get(media_url)
        image_response.raise_for_status()
        image_content = image_response.content

        # Upload media
        files = {'media': image_content}
        media_response = oauth.post(
            MEDIA_UPLOAD_URL,
            files=files,
        )
        media_response.raise_for_status()
        media_id = media_response.json()['media_id_string']

        # Post a tweet with the media
        tweet_payload = {
            "text": tweet_text,
            "media": {"media_ids": [media_id]}
        }
        tweet_response = oauth.post(
            TWEET_CREATE_URL,
            json=tweet_payload
        )
        tweet_response.raise_for_status()

        # Extract tweet ID from response
        tweet_data = tweet_response.json()['data']
        tweet_id = tweet_data['id']

        return jsonify({
            "message": "Tweet posted successfully!",
            "tweet_id": tweet_id
        }), 201

    except requests.exceptions.RequestException as e:
        error_message = f"An error occurred: {str(e)}"
        if hasattr(e, 'response') and e.response is not None:
            error_message += f"\nStatus code: {e.response.status_code}"
            error_message += f"\nResponse text: {e.response.text}"
        return jsonify({"error": error_message}), 500
    
    

@app.route('/retweet')
def retweet():
    tweet_id_to_retweet = "1828775378380324889"  # Replace with the tweet ID you want to retweet

    oauth_params = {
        'oauth_APTOS_CONSUMER_KEY': APTOS_CONSUMER_KEY,
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
