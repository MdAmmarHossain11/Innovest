from rest_framework import viewsets, permissions
from .models import CompanyEvent
from .serializers import CompanyEventSerializer
from rest_framework.response import Response

class CompanyEventViewSet(viewsets.ModelViewSet):
    queryset = CompanyEvent.objects.all()
    serializer_class = CompanyEventSerializer
    permission_classes = [permissions.AllowAny]  # Allow anyone to view events

    def get_queryset(self):
        queryset = CompanyEvent.objects.all().order_by('-date')
        company_id = self.request.query_params.get('company', None)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            # Set the user ID to 1 as requested
            request.data['user'] = 1
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': f'Failed to create event: {str(e)}'}, status=400) 