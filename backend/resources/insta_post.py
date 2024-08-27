from flask_restful import Resource
from flask import json, request, jsonify
import time
import requests

class Posts(Resource):
    def post(self):
        data = request.json

        media_type = data.get('media_type', '').upper()
        media_url = data.get('media_url', '')
        access_token = 'EAANArrNOQckBOyMs9F4n2p3ZBGE4jlf5B4MYmv3XW89bkN0okJjaWQJSxv5TqqEjykxfPB8339GEFWnOFBihs4p3OlWr3FLDvAGXP26CHkkindnmcs2xjU3BxzV4QZAKlIUWtiYcQFsGwTYhubNmCTNm2p3xkfw8DY7pZBYG42pNKX7xZBRX7oZAKgZA5NXgZABvMuhRVon4ZCAGFgKyOjDGrx8UQAZDZD'
        insta_user_id = '17841464682383816'
        caption = data.get('caption', '')

        if not media_type or not media_url or not access_token or not insta_user_id:
            return jsonify({'error': 'Missing required parameters'}), 400

        results = self.upload_media(media_url, media_type, access_token, insta_user_id, caption)

        if results is not None:
            time.sleep(10)
            ig_container_id = results.get('id')
            if ig_container_id:
                s = self.status_code(ig_container_id, access_token)
                if s == 'FINISHED':
                    self.publish_media(results, access_token, insta_user_id)
                    return jsonify({'status': 'success', 'message': 'Media uploaded and published successfully'})
                else:
                    time.sleep(60)
                    self.publish_media(results, access_token, insta_user_id)
                    return jsonify({'status': 'success', 'message': 'Media uploaded successfully. Still waiting for publishing'})
            else:
                return jsonify({'error': 'Error uploading media. Please check your request'}), 500
        else:
            return jsonify({'error': 'Error uploading media. Please check your request'}), 500

    @staticmethod
    def upload_media(media_url, media_type, access_token, insta_user_id, caption):
        post_url = f"https://graph.facebook.com/v19.0/{insta_user_id}/media"
        payload = {'media_type': media_type, 'caption': caption}

        if media_type == 'IMAGE':
            payload['image_url'] = media_url
        elif media_type == 'REELS':
            payload['video_url'] = media_url
        else:
            print("Invalid media type. Supported types are 'IMAGE' and 'REELS'.")
            return None

        r = requests.post(post_url, params={'access_token': access_token}, data=payload)

        try:
            result = r.json()
            print(result)
            return result
        except json.decoder.JSONDecodeError:
            print("Error decoding JSON. Response might not be in JSON format.")
            print("HTTP Status Code:", r.status_code)
            print("Response Text:", r.text)
            return None

    @staticmethod
    def status_code(ig_container_id, access_token):
        graph_url = f"https://graph.facebook.com/v19.0/{ig_container_id}/"
        params = {'access_token': access_token, 'fields': 'status_code'}
        response = requests.get(graph_url, params=params)

        try:
            response_json = response.json()
            return response_json['status_code']
        except json.decoder.JSONDecodeError:
            print("Error decoding JSON. Response might not be in JSON format.")
            print("HTTP Status Code:", response.status_code)
            print("Response Text:", response.text)
            return None

    @staticmethod
    def publish_media(results, access_token, insta_user_id):
        if results and 'id' in results:
            creation_id = results['id']
            second_url = f"https://graph.facebook.com/v19.0/{insta_user_id}/media_publish"
            second_payload = {'creation_id': creation_id, 'access_token': access_token}
            r = requests.post(second_url, data=second_payload)
            print(r.text)
            print('Media published to Instagram')
        else:
            print("Media posting not possible")
