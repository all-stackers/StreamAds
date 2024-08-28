from mongo_engine import db

class User(db.Document):
    wallet_address = db.StringField(required=True, unique=True)
    instagram_username = db.StringField(required=True, unique=True)
    instagram_access_token = db.StringField(required=True)
    instagram_business_profile_id = db.StringField(required=True)
    participated_campaigns = db.ListField(db.StringField())

    @classmethod
    def add_user(cls, args):
        try:
            user = cls(
                wallet_address=args['wallet_address'],
                instagram_username=args['instagram_username'],
                instagram_access_token=args['instagram_access_token'],
                instagram_business_profile_id=args['instagram_business_profile_id']
            )
            user.save()
            return {'error': False, 'data': user.to_json()}
        except Exception as e:
            return {'error': True, 'message': str(e)}
        
    @classmethod
    def get_all_users(cls):
        try:
            users = cls.objects()
            return {'error': False, 'data': users.to_json()}
        except Exception as e:
            return {'error': True, 'message': str(e)}
        
    @classmethod
    def get_user_by_wallet_address(cls, wallet_address):
        try:
            user = cls.objects(wallet_address=wallet_address).first()
            return {'error': False, 'data': user}
        except Exception as e:
            return {'error': True, 'message': str(e)}
