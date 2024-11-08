from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from .models import User
from rest_framework import status
from django.db import models
from django.http import JsonResponse
from .models import Producto, Compra, DetalleCompra, Profile, Mensaje
from .serializers import ProductoSerializer, CompraSerializer, ProfileSerializer, MensajeSerializer
import json
from django.db.models import Q
from django.db.models import Count



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
            # Asegúrate de que el producto pertenece al usuario autenticado
            return Producto.objects.get(pk=id, vendedor=user)
        except Producto.DoesNotExist:
            return None

    def get(self, request, id):
        producto = self.get_object(id, request.user)
        if producto is None:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductoSerializer(producto)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        producto = self.get_object(id, request.user)
        if producto is None:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductoSerializer(producto, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        producto = self.get_object(id, request.user)
        if producto is None:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        producto.delete()
        return Response({'message': 'Producto eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)
        
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
    

    
class EmpleadosListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        empleados = User.objects.filter(is_employee=True)
        serializer = UserSerializer(empleados, many=True)
        return Response(serializer.data)
    
class EnviarMensajeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        remitente = request.user
        destinatario_id = data.get('destinatario')
        contenido = data.get('contenido')

        if not destinatario_id or not contenido:
            return Response({'error': 'Todos los campos son requeridos.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            destinatario = User.objects.get(id=destinatario_id)
        except User.DoesNotExist:
            return Response({'error': 'Destinatario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        mensaje = Mensaje.objects.create(
            remitente=remitente,
            destinatario=destinatario,
            contenido=contenido
        )

        serializer = MensajeSerializer(mensaje)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class MensajesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Obtén todos los mensajes donde el usuario es remitente o destinatario
        mensajes = Mensaje.objects.filter(Q(remitente=user) | Q(destinatario=user)).order_by('timestamp')

        # Agrupar mensajes por destinatario o remitente para obtener los chats anteriores
        chats = {}
        for mensaje in mensajes:
            if mensaje.remitente == user:
                otro_usuario = mensaje.destinatario
            else:
                otro_usuario = mensaje.remitente

            if otro_usuario.id not in chats:
                chats[otro_usuario.id] = {
                    'usuario': otro_usuario.username,
                    'mensajes': []
                }

            chats[otro_usuario.id]['mensajes'].append({
                'remitente': mensaje.remitente.username,
                'contenido': mensaje.contenido,
                'timestamp': mensaje.timestamp
            })

        return Response(chats, status=status.HTTP_200_OK)
    
class EmployeesListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtener todos los empleados que sean 'is_employee=True'
        employees = User.objects.filter(is_employee=True).select_related('profile')
        data = []

        for employee in employees:
            user_data = UserSerializer(employee).data
            
            # Verificar si el empleado tiene un perfil asociado
            try:
                profile_data = ProfileSerializer(employee.profile).data
            except Profile.DoesNotExist:
                profile_data = {
                    'ubicacion': 'No especificada',
                    'numero_contacto': 'No especificado',
                    'descripcion': 'No especificada',
                }

            data.append({'user': user_data, 'profile': profile_data})

        return Response(data, status=200)

class ProveedorProfileView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, id):
        try:
            proveedor = User.objects.get(id=id, is_employee=True)
        except User.DoesNotExist:
            return Response({"error": "Proveedor no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Serializar datos del proveedor y sus productos
        user_data = UserSerializer(proveedor).data
        profile_data = ProfileSerializer(proveedor.profile).data
        productos = Producto.objects.filter(vendedor=proveedor)
        productos_data = ProductoSerializer(productos, many=True).data

        return Response({
            "user": user_data,
            "profile": profile_data,
            "productos": productos_data
        }, status=status.HTTP_200_OK)

class ProductosMasCompradosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Ordenar los productos por la cantidad total comprada
        productos = Producto.objects.annotate(total_compras=Count('detallecompra')).order_by('-total_compras')[:10]
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ProductosDeProveedoresHabitualesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtener las compras del usuario actual
        compras = Compra.objects.filter(customer=request.user)
        
        # Encontrar los proveedores de los productos comprados
        proveedores = Producto.objects.filter(compra__in=compras).values('vendedor').distinct()
        
        # Obtener los productos ofrecidos por estos proveedores
        productos = Producto.objects.filter(vendedor__in=proveedores).distinct()[:10]
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)