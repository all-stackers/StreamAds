import requests
from flask_restful import Resource
from flask import jsonify, request

class RetrieveLike(Resource):
    def get(self):
        # post_id = '18125537296335167'  # Replace with actual post_id
        post_id = request.args.get('post_id')
        if not post_id:
            return jsonify({'error': 'Missing required parameter "post_id"'}), 400

        access_token = 'EAANArrNOQckBOzu0VUfWN3ZBDWZAgc1IIRj1Lk537dORGI7tHdEZCZA9dEEbOBELFIxqLFKqfy7OT2D7V0llfgJCesDJlEsoCTq1uBhiPOiZBaJW6jlpHlZACWsY1JZCSk2H1I6KhgLjxySpDHxk01JZCfzkI2hRzsL7lP8fgfBhGBIkQiG0jZA3MCDbms5gt1jwvZAJdrViZBAufqBNwWejuagHJNZAGZCedfqvmZCChS'
        fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,comments_count,like_count'
        
        media_url = f'https://graph.instagram.com/{post_id}?fields={fields}&access_token={access_token}'
        
        try:
            response = requests.get(media_url)
            print(response.__dict__)
            # print(f"Response Status Code: {response.status_code}")
            # print(f"Response URL: {media_url}")
            # print(f"Response Text: {response.text}")

            return {"error": False, "data": "testing"}

            
            # if response.status_code == 200:
            #     try:
            #         data = response.json()
            #         return jsonify({
            #             'post_id': data.get('id'),
            #             'caption': data.get('caption'),
            #             'media_type': data.get('media_type'),
            #             'media_url': data.get('media_url'),
            #             'thumbnail_url': data.get('thumbnail_url'),
            #             'permalink': data.get('permalink'),
            #             'comments_count': data.get('comments_count'),
            #             'like_count': data.get('like_count')
            #         })
            #     except ValueError:
            #         return jsonify({'error': 'Response is not valid JSON'}), response.status_code
            # else:
            #     return jsonify({
            #         'error': 'Failed to retrieve data from Instagram API',
            #         'details': response.text  # Provide raw response text for debugging
            #     }), response.status_code
        except requests.RequestException as e:
            return jsonify({'error': str(e)}), 500
