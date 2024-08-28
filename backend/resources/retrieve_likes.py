import requests
from flask_restful import Resource
from flask import jsonify, request

class RetrieveLike(Resource):
    def get(self):
        post_id = 'post_id_here'  # Replace with actual post_id
        access_token = 'token_here'
        fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,comments_count,like_count'
        
        media_url =  f"https://graph.facebook.com/v20.0/{post_id}?fields=like_count&access_token={access_token}"
        print(f"Media URL: {media_url}")
        
        try:
            print("before")
            response = requests.get(media_url)
            print("after")
            print(response.json())
            # response.raise_for_status()  # Raise an error for bad responses
            
            # print(f"Response Status Code: {response.status_code}")
            # print(f"Response URL: {media_url}")
            # print(f"Response Text: {response.text}")
            
            try:
                # data = response.json()
                print(response)
                return {"data": response.json()}
            except ValueError:
                return jsonify({'error': 'Response is not valid JSON'}), 500
        except requests.HTTPError as e:
            return jsonify({
                'error': 'Failed to retrieve data from Instagram API',
                'details': str(e)  # Provide error details for debugging
            }), 500
        except requests.RequestException as e:
            return jsonify({'error': str(e)}), 500
