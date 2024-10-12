from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import ProductoView, ProductoCrear, RegisterView, LoginView, UserProfileView

urlpatterns = [
    path("producto/", ProductoView.as_view()),
    path("productocrear/", ProductoCrear.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
]
