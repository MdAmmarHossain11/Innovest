from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, BasePermission
from .models import CompanyEvent
from .serializers import CompanyEventSerializer
import logging

logger = logging.getLogger(__name__)


class EventAdminPermission(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                request.user.is_staff
                or request.user.is_superuser
                or request.user.user_type == 'admin'
            )
        )

# Create your views here.


class CompanyEventViewSet(viewsets.ModelViewSet):
    queryset = CompanyEvent.objects.all()
    serializer_class = CompanyEventSerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action in {'create', 'update', 'partial_update', 'destroy'}:
            return [EventAdminPermission()]
        return [AllowAny()]

    def get_queryset(self):
        queryset = CompanyEvent.objects.all().order_by('-start_at')
        user = self.request.user
        is_admin = (
            user.is_authenticated
            and (user.is_staff or user.is_superuser or user.user_type == 'admin')
        )
        if not is_admin:
            queryset = queryset.filter(privacy='publish')
        # Only filter by company_id if provided
        company_id = self.request.query_params.get('company', None)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            logger.info(f"Successfully fetched all events")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in list view: {str(e)}")
            return Response(
                {"error": f"Failed to fetch events: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request, *args, **kwargs):
        serializer = None
        try:
            # Automatically set the user ID from the authenticated user
            mutable_data = request.data.copy()
            mutable_data['user'] = request.user.id
            serializer = self.get_serializer(data=mutable_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            logger.info(
                f"Successfully created event for user {request.user.id}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating event: {str(e)}")
            error_detail = serializer.errors if serializer is not None and serializer.errors else str(
                e)
            return Response(
                {"error": "Failed to create event", "detail": error_detail},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
