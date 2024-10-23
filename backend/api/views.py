from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from .models import User
from .serializers import ProductoSerializer
from .models import Producto



class ProductoView(generics.ListAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [AllowAny]


class ProductoCrear(generics.CreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [AllowAny]


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password1')
        is_admin = data.get('is_admin', False)
        is_employee = data.get('is_employee', False)
        is_customer = data.get('is_customer', False)

        user = User.objects.create_user(
            username=username, email=email, password=password,
            is_admin=is_admin, is_employee=is_employee, is_customer=is_customer
        )

        return Response(UserSerializer(user).data)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            
            # Create the response data including tokens
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_admin,
                'is_employee': user.is_employee,
                'is_customer': user.is_customer,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

            # Optionally redirect based on user type
            redirect_url = '/default/home'
            if user.is_employee:
                redirect_url = '/proveedor/home'
            elif user.is_customer:
                redirect_url = '/vendedor/home'
            
            user_data['redirect_url'] = redirect_url

            # Return tokens and user info
            return Response(user_data)

        return Response({'error': 'Invalid credentials'}, status=400)

# Optionally, add a LogoutView to invalidate tokens
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Blacklist or invalidate the refresh token
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=205)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


# Vista para obtener datos de usuario autenticado
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(UserSerializer(user).data)

