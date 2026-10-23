from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """Only users with role == 'admin' (or superuser) can use this endpoint."""

    message = "Admin access required."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_admin_role)
