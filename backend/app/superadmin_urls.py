from django.urls import path
from app.views.superadmin import *

urlpatterns = [
    path('login/', SuperAdminLoginView.as_view(), name='superadmin-login'),
    #path('dashboard/', SuperAdminDashboardView.as_view(), name='superadmin-dashboard'),
]
