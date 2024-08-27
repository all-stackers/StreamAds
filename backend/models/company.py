from mongo_engine import db

class Company(db.Document):
    company_name = db.StringField(required=True, unique=True)
    company_logo = db.StringField()
    company_twitter = db.StringField()
    company_website = db.StringField()

    @classmethod
    def add_company(cls, args):
        try:
            company = cls(
                company_name=args['company_name'],
                company_logo=args['company_logo'],
                company_twitter=args['company_twitter'],
                company_website=args['company_website']
            )
            company.save()
            return {'error': False, 'data': company.to_json()}
        except Exception as e:
            return {'error': True, 'message': str(e)}
        
    @classmethod
    def get_all_companies(cls):
        try:
            companies = cls.objects()
            return {'error': False, 'data': companies.to_json()}
        except Exception as e:
            return {'error': True, 'message': str(e)}
        
    @classmethod
    def get_company(cls, company_name):
        try:
            company = cls.objects(company_name=company_name).first()
            return {'error': False, 'data': company}
        except Exception as e:
            return {'error': True, 'message': str(e)}