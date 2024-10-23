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
            # Determinar la URL de redirección según el tipo de usuario
            redirect_url = '/default/home'  # URL predeterminada
            if user.is_employee:
                redirect_url = '/proveedor/home'
            elif user.is_customer:
                redirect_url = '/vendedor/home'

            # Crear manualmente la respuesta con todos los datos necesarios
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_admin,
                'is_employee': user.is_employee,
                'is_customer': user.is_customer,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'redirect_url': redirect_url,
            }


            return Response(user_data)

        return Response({'error': 'Invalid credentials'}, status=400)


# Vista para obtener datos de usuario autenticado
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(UserSerializer(user).data)

