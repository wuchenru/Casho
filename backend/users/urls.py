from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, logout

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', logout, name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
] 