from companies.models import Company
from backend.models import CompanyBusinessPlan as BusinessPlan, CompanyFundraiseTerms as FundraiseTerms

# Re-export the models with the names we want to use
__all__ = ['Company', 'BusinessPlan', 'FundraiseTerms'] 