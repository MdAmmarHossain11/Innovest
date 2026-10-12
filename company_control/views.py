from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from rest_framework.decorators import action, api_view, permission_classes
from django.db import connection
from django.db.models.deletion import Collector
from companies.models import Company
from company_permission.models import CompanyNotification
from .serializers import CompanyControlSerializer
from .models import AdminNotification
from rest_framework.permissions import IsAuthenticated
import logging
import traceback

logger = logging.getLogger(__name__)


class IsPlatformAdmin(BasePermission):
    """Restrict company-management actions to platform administrators."""

    message = 'Only administrators can manage companies.'

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (
                user.is_superuser
                or user.is_staff
                or getattr(user, 'user_type', None) == 'admin'
            )
        )


class CompanyControlViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanyControlSerializer
    permission_classes = [IsPlatformAdmin]

    def get_queryset(self):
        try:
            queryset = Company.objects.all()
            logger.info(f"Initial queryset count: {queryset.count()}")

            # Apply filters
            industry = self.request.query_params.get('industry', None)
            if industry:
                queryset = queryset.filter(industry=industry)
                logger.info(f"After industry filter: {queryset.count()}")

            status = self.request.query_params.get('status', None)
            if status:
                queryset = queryset.filter(company_status=status)
                logger.info(f"After status filter: {queryset.count()}")

            return queryset
        except Exception as e:
            logger.error(f"Error in get_queryset: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Company.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            logger.info("Starting list view")
            logger.info(f"User: {request.user}")
            logger.info(f"Auth header: {request.headers.get('Authorization')}")

            companies = self.get_queryset()
            logger.info(f"Companies count: {companies.count()}")

            serializer = self.get_serializer(companies, many=True)
            logger.info("Serialization successful")

            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in list view: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        try:
            company = self.get_object()
            new_status = request.data.get('status')

            if not new_status:
                return Response({
                    'status': 'error',
                    'message': 'Status is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            company.company_status = new_status
            company.save()

            if company.user_id:
                CompanyNotification.objects.create(
                    company=company,
                    recipient_id=company.user_id,
                    message=f"Admin changed {company.product_name}'s status to {new_status}."
                )

            serializer = self.get_serializer(company)
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error updating company status: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        try:
            request.data['user'] = request.user.id
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error in create view: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error in update view: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            company = self.get_object()
            company_name = company.product_name
            creator_id = company.user_id

            # Preserve this notice after the company is removed.  The nullable
            # relation is intentionally cleared by the deletion collector.
            if creator_id:
                CompanyNotification.objects.create(
                    company=company,
                    recipient_id=creator_id,
                    message=f"Your company {company_name} was deleted by an administrator."
                )

            # Some installations retain legacy payment model definitions even
            # though their ``companies_payment`` table no longer exists. The
            # normal Django cascade then fails before the company is removed.
            # Keep its normal cascade for every existing table and skip only
            # absent legacy tables.
            collector = Collector(using=company._state.db)
            collector.collect([company])
            existing_tables = set(connection.introspection.table_names())
            collector.fast_deletes = [
                queryset
                for queryset in collector.fast_deletes
                if queryset.model._meta.db_table in existing_tables
            ]
            collector.delete()

            return Response({'status': 'success', 'message': 'Company deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error deleting company: {str(e)}", exc_info=True)
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsPlatformAdmin])
def admin_notifications(request):
    """List and mark read the notifications shown across the admin console."""
    notifications = AdminNotification.objects.filter(
        recipient__isnull=True
    ) | AdminNotification.objects.filter(recipient=request.user)
    notifications = notifications.order_by('-created_at').distinct()

    if request.method == 'POST' or request.query_params.get('mark_read') in ('true', '1', 'yes'):
        notifications.filter(read=False).update(read=True)

    data = [{
        'id': notification.id,
        'category': notification.category,
        'message': notification.message,
        'target_url': notification.target_url,
        'read': notification.read,
        'created_at': notification.created_at,
    } for notification in notifications[:50]]
    return Response({
        'results': data,
        'unread_count': notifications.filter(read=False).count(),
    })
