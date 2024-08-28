from flask import Flask, redirect, request, session
from requests_oauthlib import OAuth1Session
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Twitter API credentials
CONSUMER_KEY = os.getenv('CONSUMER_KEY')
CONSUMER_SECRET = os.getenv('CONSUMER_SECRET')
REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
AUTHENTICATE_URL = 'https://api.twitter.com/oauth/authenticate'
ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'
POST_TWEET_URL = 'https://api.twitter.com/1.1/statuses/update.json'

@app.route('/')
def home():
    return 'Welcome to the Twitter OAuth example! <a href="/login">Login with Twitter</a>'

@app.route('/login')
def login():
    # Step 1: Get a request token
    oauth = OAuth1Session(CONSUMER_KEY, client_secret=CONSUMER_SECRET)
    try:
        fetch_response = oauth.fetch_request_token(REQUEST_TOKEN_URL)
    except ValueError:
        return 'There was an error obtaining the request token from Twitter.'

    # Store the request token in session
    session['oauth_token'] = fetch_response.get('oauth_token')
    session['oauth_token_secret'] = fetch_response.get('oauth_token_secret')

    # Step 2: Redirect the user to Twitter for authorization
    authorization_url = oauth.authorization_url(AUTHENTICATE_URL)
    return redirect(authorization_url)

@app.route('/callback')
def callback():
    # Step 3: Get the OAuth verifier from the request
    oauth_token = request.args.get('oauth_token')
    oauth_verifier = request.args.get('oauth_verifier')

    if not oauth_token or not oauth_verifier:
        return 'Error: Missing oauth_token or oauth_verifier.'

    # Re-create the OAuth session using the request token
    oauth = OAuth1Session(CONSUMER_KEY,
                          client_secret=CONSUMER_SECRET,
                          resource_owner_key=session.get('oauth_token'),
                          resource_owner_secret=session.get('oauth_token_secret'))

    try:
        # Fetch the access token using the verifier
        oauth_response = oauth.fetch_access_token(ACCESS_TOKEN_URL, verifier=oauth_verifier)
    except ValueError as e:
        return f'Error fetching access token: {str(e)}'

    # Store the access token in session
    session['access_token'] = oauth_response.get('oauth_token')
    session['access_token_secret'] = oauth_response.get('oauth_token_secret')

    return 'You are logged in! <a href="/tweet">Post a Tweet</a>'

@app.route('/tweet')
def tweet():
    # Step 4: Post a tweet on behalf of the user
    oauth = OAuth1Session(CONSUMER_KEY,
                          client_secret=CONSUMER_SECRET,
                          resource_owner_key=session.get('access_token'),
                          resource_owner_secret=session.get('access_token_secret'))
    response = oauth.post(POST_TWEET_URL, data={'status': 'Hello, world!'})
    
    if response.status_code == 200:
        return 'Tweet posted successfully!'
    else:
        return 'Failed to post tweet. Status code: ' + str(response.status_code)

if __name__ == '__main__':
    app.run(debug=True)
