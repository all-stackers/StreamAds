import requests
from flask_restful import Resource
from flask import jsonify

class RetrieveLike(Resource):
    def get(self):
        post_id = '18125537296335167'  # Replace with actual post_id
        access_token = 'EAANArrNOQckBOyMs9F4n2p3ZBGE4jlf5B4MYmv3XW89bkN0okJjaWQJSxv5TqqEjykxfPB8339GEFWnOFBihs4p3OlWr3FLDvAGXP26CHkkindnmcs2xjU3BxzV4QZAKlIUWtiYcQFsGwTYhubNmCTNm2p3xkfw8DY7pZBYG42pNKX7xZBRX7oZAKgZA5NXgZABvMuhRVon4ZCAGFgKyOjDGrx8UQAZDZD'
        fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,comments_count,like_count'
        
        media_url = f'https://graph.instagram.com/{post_id}?fields={fields}&access_token={access_token}'
        
        try:
            response = requests.get(media_url)
            print(f"Response Status Code: {response.status_code}")
            print(f"Response URL: {media_url}")
            print(f"Response Text: {response.text}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    return jsonify({
                        'post_id': data.get('id'),
                        'caption': data.get('caption'),
                        'media_type': data.get('media_type'),
                        'media_url': data.get('media_url'),
                        'thumbnail_url': data.get('thumbnail_url'),
                        'permalink': data.get('permalink'),
                        'comments_count': data.get('comments_count'),
                        'like_count': data.get('like_count')
                    })
                except ValueError:
                    return jsonify({'error': 'Response is not valid JSON'}), response.status_code
            else:
                return jsonify({
                    'error': 'Failed to retrieve data from Instagram API',
                    'details': response.text  # Provide raw response text for debugging
                }), response.status_code
        except requests.RequestException as e:
            return jsonify({'error': str(e)}), 500
