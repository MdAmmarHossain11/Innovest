from rest_framework import generics
from .models import CompanyTrackProgress, CompanyUpdate
from .serializers import CompanyTrackProgressSerializer, CompanyUpdateSerializer

class CompanyTrackProgressListCreateView(generics.ListCreateAPIView):
    serializer_class = CompanyTrackProgressSerializer

    def get_queryset(self):
        company_id = self.request.query_params.get('company_id')
        return CompanyTrackProgress.objects.filter(company_id=company_id).order_by('-created_at')

class CompanyTrackProgressRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = CompanyTrackProgress.objects.all()
    serializer_class = CompanyTrackProgressSerializer

class CompanyUpdateListCreateView(generics.ListCreateAPIView):
    serializer_class = CompanyUpdateSerializer

    def get_queryset(self):
        company_id = self.request.query_params.get('company_id')
        return CompanyUpdate.objects.filter(company_id=company_id)

class CompanyUpdateRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = CompanyUpdate.objects.all()
    serializer_class = CompanyUpdateSerializer 