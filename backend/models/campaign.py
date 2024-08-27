from mongo_engine import db

class Campaign(db.Document):
    campaign_id = db.StringField(required=True, unique=True)
    campaign_name = db.StringField(required=True)
    campaign_description = db.StringField(required=True)
    company_name = db.StringField(required=True)
    media_type = db.StringField(required=True)
    media_url = db.StringField(required=True)
    start_time = db.StringField(required=True)
    end_time = db.StringField(required=True)
    payout_time = db.StringField(required=True)
    prize_pool = db.FloatField(required=True)
    post = db.StringField(required=True)
    likes = db.StringField(required=True)
    minimum_likes = db.IntField()
    followers = db.StringField(required=True)
    minimum_followers = db.IntField()
    participants = db.ListField(db.StringField())

    @classmethod
    def add_campaign(cls, args):
        try:
            campaign = cls(
                campaign_id=args["campaign_id"],
                campaign_name=args["campaign_name"],
                campaign_description=args["campaign_description"],
                company_name=args["company_name"],
                media_type=args["media_type"],
                media_url=args["media_url"],
                start_time=args["start_time"],
                end_time=args["end_time"],
                payout_time=args["payout_time"],
                prize_pool=args["prize_pool"],
                post=args["post"],
                likes=args["likes"],
                minimum_likes=args["minimum_likes"],
                followers=args["followers"],
                minimum_followers=args["minimum_followers"],
                participants=[]
            )
            campaign.save()
            return {'error': False, 'data': campaign.to_json()}

        except Exception as e:
            return {'error': True, 'data': str(e)}
        
    @classmethod
    def get_all_campaigns(cls):
        try:
            campaigns = cls.objects()
            return {'error': False, 'data': campaigns}

        except Exception as e:
            return {'error': True, 'data': str(e)}
        
    @classmethod
    def get_campaign(cls, campaign_id):
        try:
            campaign = cls.objects(campaign_id=campaign_id).first()
            return {'error': False, 'data': campaign}

        except Exception as e:
            return {'error': True, 'data': str(e)}
        
    @classmethod
    def get_campaigns_by_company(cls, company_name):
        try:
            campaigns = cls.objects(company_name=company_name)
            return {'error': False, 'data': campaigns}

        except Exception as e:
            return {'error': True, 'data': str(e)}
        
    @classmethod
    def add_participant(cls, args):
        try:
            campaign = cls.objects(campaign_id=args["campaign_id"]).first()
            campaign.update(push__participants=args["wallet_address"])
            return {'error': False, 'data': campaign.to_json()}

        except Exception as e:
            return {'error': True, 'data': str(e)}

    
