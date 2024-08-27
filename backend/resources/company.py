from flask_restful import Resource, reqparse
from models.company import Company as CompanyModel
from flask import request


class Company(Resource):
    def post(slef):
        parser = reqparse.RequestParser()
        parser.add_argument('company_name', required=True, help='company_name is required')
        parser.add_argument('company_logo')
        parser.add_argument('company_twitter')
        parser.add_argument('company_website')

        args = parser.parse_args()
        response = CompanyModel.add_company(args)

        if response['error']:
            return {'error': True, 'message': response['message']}
        return response['data']
    
    def get(self):
        company_name = request.args.get('company_name')
        
        if company_name:
            response = CompanyModel.get_company(company_name)
        else:
            response = CompanyModel.get_all_companies()
            
        if response['error']:
            return {'error': True, 'message': response['message']}
        
        return response['data']
