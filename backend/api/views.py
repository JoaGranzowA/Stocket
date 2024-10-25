from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from .models import User
from rest_framework import status
from django.http import JsonResponse
from .models import Producto, Compra, DetalleCompra, Profile
from .serializers import ProductoSerializer, CompraSerializer, ProfileSerializer
import json



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
    

# Vista para listar y crear productos
class ProductosListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        productos = Producto.objects.filter(vendedor=request.user)  # Filtrar productos del usuario autenticado
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        data['vendedor'] = request.user.id  # Asignar al usuario autenticado como vendedor
        serializer = ProductoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vista para detalles, actualización y eliminación de un producto específico
class ProductoDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, id, user):
        try:
            return Producto.objects.get(pk=id, vendedor=user)  # Asegurarse de que el producto pertenece al usuario autenticado
        except Producto.DoesNotExist:
            return None

    def get(self, request, id):
        producto = self.get_object(id, request.user)
        if producto is None:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductoSerializer(producto)
        return Response(serializer.data)

    def put(self, request, id):
        producto = self.get_object(id, request.user)
        if producto is None:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductoSerializer(producto, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
    def delete(self, request, id):
        producto = self.get_object(id, request.user)
        if producto is None:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        producto.delete()
        return Response({'message': 'Producto eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)

class ProductosDisponiblesView(APIView):
    def get(self, request):
        productos = Producto.objects.all()  # No filtrar por usuario
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class RealizarCompraView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        customer = request.user
        productos_data = request.data.get('productos', [])
        total = request.data.get('total', 0)

        if not productos_data:
            return Response({"error": "No hay productos en la compra"}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la compra
        compra = Compra.objects.create(customer=customer, total=total)

        # Crear los detalles de la compra
        for producto_data in productos_data:
            producto_id = producto_data.get('id')
            cantidad = producto_data.get('cantidad')
            try:
                producto = Producto.objects.get(id=producto_id)
                DetalleCompra.objects.create(
                    compra=compra,
                    producto=producto,
                    cantidad=cantidad,
                    precio=producto.precio
                )
            except Producto.DoesNotExist:
                return Response({"error": f"Producto con id {producto_id} no encontrado"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CompraSerializer(compra)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class HistorialComprasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filtrar las compras realizadas por el usuario autenticado
        compras = Compra.objects.filter(customer=request.user)
        serializer = CompraSerializer(compras, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = UserSerializer(user).data
        try:
            profile = Profile.objects.get(user=user)
            profile_data = ProfileSerializer(profile).data
        except Profile.DoesNotExist:
            profile_data = {}

        return Response({'user': user_data, 'profile': profile_data})
    
class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
