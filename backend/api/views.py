from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from .models import User, CalificacionProveedor
from rest_framework import status
from django.db import models
from django.http import JsonResponse
from .models import Producto, Compra, DetalleCompra, Profile, Mensaje, Pedido
from .serializers import ProductoSerializer, CompraSerializer, ProfileSerializer, MensajeSerializer, DetalleCompraSerializer, CustomerWithLowStockSerializer, CalificacionProveedorSerializer, PedidoSerializer
import json
from django.db.models import Q
from django.db.models import Count
from django.db import transaction
from django.db.models import Sum
from django.utils.timezone import now
from datetime import timedelta, datetime
from django.db.models import Avg
from rest_framework.exceptions import NotFound
from django.db.models.functions import TruncMonth




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
    
from collections import defaultdict

class RealizarCompraView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        data = request.data
        productos_data = data.get('productos', [])
        if not productos_data:
            return Response({"error": "No se especificaron productos para la compra."}, status=status.HTTP_400_BAD_REQUEST)

        # Agrupar los productos por proveedor
        productos_por_proveedor = defaultdict(list)
        for producto_data in productos_data:
            producto_id = producto_data.get('id')
            cantidad = producto_data.get('cantidad', 1)

            try:
                producto = Producto.objects.get(id=producto_id)
                if producto.stock < cantidad:
                    return Response(
                        {"error": f"No hay suficiente stock para el producto {producto.titulo}."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Agrupar producto por proveedor (vendedor)
                productos_por_proveedor[producto.vendedor.id].append({
                    'producto': producto,
                    'cantidad': cantidad,
                    'precio': producto.precio
                })

                # Reducir el stock del producto
                producto.stock -= cantidad
                producto.save()

            except Producto.DoesNotExist:
                return Response({"error": f"Producto con id {producto_id} no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Crear compras y pedidos separados para cada proveedor
        compras = []
        for proveedor_id, detalles in productos_por_proveedor.items():
            # Calcular el total para cada proveedor
            total_proveedor = sum(detalle['precio'] * detalle['cantidad'] for detalle in detalles)

            # Crear la Compra para el proveedor específico
            compra = Compra.objects.create(customer=request.user, total=total_proveedor)
            compras.append(compra)

            # Crear un DetalleCompra para cada producto en la compra
            for detalle in detalles:
                DetalleCompra.objects.create(
                    compra=compra,
                    producto=detalle['producto'],
                    cantidad=detalle['cantidad'],
                    precio=detalle['precio'],
                    stock_restante=detalle['cantidad']
                )

            # Crear el Pedido vinculado a la compra
            Pedido.objects.create(
                cliente=request.user,
                total=total_proveedor,
                estado='pagado',  # Estado inicial del pedido
                pagado=True,
                compra=compra  # Vincular la compra al pedido
            )

        # Serializar todas las compras realizadas
        serializer = CompraSerializer(compras, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)




class HistorialComprasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filtrar las compras realizadas por el usuario autenticado y prefetch los detalles de cada compra
        compras = Compra.objects.filter(customer=request.user).prefetch_related('detalles__producto')

        # Incluir los pedidos relacionados con cada compra
        compras_data = []
        for compra in compras:
            # Obtener todos los pedidos relacionados con la compra actual
            pedidos = Pedido.objects.filter(compra=compra)
            pedidos_data = PedidoSerializer(pedidos, many=True).data

            compra_data = CompraSerializer(compra).data
            compra_data['pedidos'] = pedidos_data  # Agregar los pedidos relacionados
            compras_data.append(compra_data)

        return Response(compras_data, status=status.HTTP_200_OK)





    
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

            # Calcular el promedio de calificación para cada empleado
            promedio_calificacion = (
                CalificacionProveedor.objects.filter(proveedor=employee)
                .aggregate(Avg('puntuacion'))
                .get('puntuacion__avg')
            )

            if promedio_calificacion is None:
                promedio_calificacion = 0.0

            data.append({
                'user': user_data,
                'profile': profile_data,
                'promedio_calificacion': promedio_calificacion,
            })

        return Response(data, status=200)

class ProveedorProfileView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, id):
        try:
            proveedor = User.objects.get(id=id, is_employee=True)
        except User.DoesNotExist:
            return Response({"error": "Proveedor no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Serializar datos del proveedor, perfil, y sus productos
        user_data = UserSerializer(proveedor).data
        profile_data = ProfileSerializer(proveedor.profile).data
        productos = Producto.objects.filter(vendedor=proveedor)
        productos_data = ProductoSerializer(productos, many=True).data

        # Obtener las calificaciones del proveedor
        calificaciones = CalificacionProveedor.objects.filter(proveedor=proveedor)
        calificaciones_data = CalificacionProveedorSerializer(calificaciones, many=True).data

        return Response({
            "user": user_data,
            "profile": profile_data,
            "productos": productos_data,
            "calificaciones": calificaciones_data
        }, status=status.HTTP_200_OK)


class ProductosMasCompradosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Ordenar los productos por la cantidad total comprada, usando el campo relacionado correcto
        productos = Producto.objects.annotate(total_compras=Count('detalles')).order_by('-total_compras')[:10]
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
    
class StockDisponibleView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DetalleCompraSerializer

    def get_queryset(self):
        return DetalleCompra.objects.filter(compra__customer=self.request.user, stock_restante__gt=0)

    
class ActualizarStockView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            detalle = DetalleCompra.objects.get(pk=pk, compra__customer=request.user)
        except DetalleCompra.DoesNotExist:
            return Response({"error": "Producto no encontrado o no pertenece al usuario."}, status=status.HTTP_404_NOT_FOUND)

        cantidad_disminuir = request.data.get('cantidad', None)
        
        # Validación para asegurarse de que se proporciona la cantidad
        if cantidad_disminuir is None:
            return Response({"error": "La cantidad es requerida."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cantidad_disminuir = int(cantidad_disminuir)
        except ValueError:
            return Response({"error": "La cantidad debe ser un número entero."}, status=status.HTTP_400_BAD_REQUEST)

        if cantidad_disminuir <= 0:
            return Response({"error": "La cantidad a disminuir debe ser mayor a cero."}, status=status.HTTP_400_BAD_REQUEST)

        if detalle.stock_restante < cantidad_disminuir:
            return Response({"error": "No hay suficiente stock para disminuir la cantidad solicitada."}, status=status.HTTP_400_BAD_REQUEST)

        # Actualizar el stock restante
        detalle.stock_restante -= cantidad_disminuir
        detalle.save()

        serializer = DetalleCompraSerializer(detalle)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ClientesBajoStockView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Filtra solo los detalles de compra que pertenecen a los productos vendidos por el empleado autenticado
            productos_vendidos = Producto.objects.filter(vendedor=request.user)
            detalles_bajo_stock = DetalleCompra.objects.filter(
                producto__in=productos_vendidos,
                stock_restante__lt=20
            ).select_related('compra__customer')

            # Serializar los datos usando el serializador actualizado
            serializer = CustomerWithLowStockSerializer(detalles_bajo_stock, many=True)
            data = serializer.data

            return Response(data, status=200)
        except ValueError as e:
            # Manejar el error para que sea más informativo
            return Response({"error": str(e)}, status=400)
        
class StockAgrupadoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Agrupar productos y sumar el stock restante
            stock_agrupado = DetalleCompra.objects.values('producto__id', 'producto__titulo', 'producto__precio').annotate(
                stock_restante_total=Sum('stock_restante')
            ).filter(stock_restante_total__gt=0)  # Filtrar para mostrar solo productos con stock restante > 0

            # Preparar los datos para la respuesta
            data = [
                {
                    'producto_id': item['producto__id'],
                    'titulo': item['producto__titulo'],
                    'precio': item['producto__precio'],
                    'stock_restante': item['stock_restante_total'],
                }
                for item in stock_agrupado
            ]

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class ActualizarStockView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            # Buscar un detalle de compra del producto para el cliente autenticado, con stock restante mayor a 0
            detalle = DetalleCompra.objects.filter(producto_id=pk, compra__customer=request.user, stock_restante__gt=0).first()
            
            if not detalle:
                return Response({"error": "Producto no encontrado o sin stock suficiente para este usuario."}, status=status.HTTP_404_NOT_FOUND)

            cantidad_disminuir = request.data.get('cantidad', None)

            # Validación para asegurarse de que se proporciona la cantidad
            if cantidad_disminuir is None:
                return Response({"error": "La cantidad es requerida."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                cantidad_disminuir = int(cantidad_disminuir)
            except ValueError:
                return Response({"error": "La cantidad debe ser un número entero."}, status=status.HTTP_400_BAD_REQUEST)

            if cantidad_disminuir <= 0:
                return Response({"error": "La cantidad a disminuir debe ser mayor a cero."}, status=status.HTTP_400_BAD_REQUEST)

            if detalle.stock_restante < cantidad_disminuir:
                return Response({"error": "No hay suficiente stock para disminuir la cantidad solicitada."}, status=status.HTTP_400_BAD_REQUEST)

            # Actualizar el stock restante
            detalle.stock_restante -= cantidad_disminuir
            detalle.save()

            serializer = DetalleCompraSerializer(detalle)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProductoDetailViewParaCliente(APIView):
    permission_classes = [AllowAny]  # Permitir que cualquier persona autenticada pueda ver el producto

    def get(self, request, id):
        try:
            producto = Producto.objects.get(pk=id)
            serializer = ProductoSerializer(producto)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
class CrearCalificacionProveedorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, proveedor_id):
        cliente = request.user

        # Verificar si el proveedor existe y es un empleado
        try:
            proveedor = User.objects.get(pk=proveedor_id, is_employee=True)
        except User.DoesNotExist:
            return Response({'error': 'Proveedor no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        # Crear los datos del serializer con cliente y proveedor
        puntuacion = request.data.get('puntuacion')
        comentario = request.data.get('comentario', '')

        if not puntuacion:
            return Response({'error': 'Puntuación es requerida.'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear el diccionario con los datos completos
        data = {
            'proveedor': proveedor.id,
            'puntuacion': puntuacion,
            'comentario': comentario
        }

        # Asignar el cliente en el serializer
        serializer = CalificacionProveedorSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(cliente=cliente)  # Guardar con el cliente asignado
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Mostrar los errores de validación del serializer
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PromedioCalificacionProveedorView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, proveedor_id):
        proveedor = User.objects.filter(pk=proveedor_id, is_employee=True).first()

        if not proveedor:
            return Response({'error': 'Proveedor no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        promedio = CalificacionProveedor.calcular_promedio_calificacion(proveedor_id)
        return Response({'proveedor': proveedor.username, 'promedio_calificacion': promedio}, status=status.HTTP_200_OK)
    
class VerificarCompraProveedorView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            # Use `DetalleCompra` to verify if the customer has purchased from the given supplier
            ha_comprado = DetalleCompra.objects.filter(
                compra__customer=request.user,
                producto__vendedor_id=id
            ).exists()

            return Response({"ya_comprado": ha_comprado}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class SupplierPurchaseAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all purchases made by the current seller
        compras = Compra.objects.filter(customer=request.user)
        supplier_purchases = {}

        for compra in compras:
            for detalle in compra.detalles.all():
                supplier = detalle.producto.vendedor.username
                supplier_purchases[supplier] = supplier_purchases.get(supplier, 0) + detalle.cantidad

        return Response(supplier_purchases, status=status.HTTP_200_OK)
    

class MonthlyExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtiene todas las compras realizadas por el usuario actual
        compras = Compra.objects.filter(customer=request.user)
        
        # Agrupa por año y mes, y suma el total gastado
        gastos_mensuales = (
            compras
            .annotate(month=models.functions.TruncMonth('fecha'))
            .values('month')
            .annotate(total_gasto=Sum('total'))
            .order_by('month')
        )

        # Formatear los datos para la respuesta
        response_data = [
            {
                'month': gasto['month'].strftime('%B %Y'),
                'total_gasto': gasto['total_gasto']
            }
            for gasto in gastos_mensuales
        ]

        return Response(response_data, status=status.HTTP_200_OK)
    
class PedidoListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            # Filtrar todos los pedidos asociados al usuario autenticado
            pedidos = Pedido.objects.filter(cliente=request.user)

            if not pedidos.exists():
                return Response({"message": "No se encontraron pedidos para este usuario."}, status=status.HTTP_404_NOT_FOUND)

            # Serializar todos los pedidos encontrados
            serializer = PedidoSerializer(pedidos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    
class PedidoDetailView(APIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Pedido.objects.select_related('cliente').get(pk=pk)
        except Pedido.DoesNotExist:
            raise NotFound("Pedido no encontrado.")

    def get(self, request, pk):
        pedido = self.get_object(pk)
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        pedido = self.get_object(pk)
        # Actualizamos solo el estado del pedido
        nuevo_estado = request.data.get('estado')
        if nuevo_estado not in ['entregado', 'camino', 'preparacion', 'pagado']:
            return Response({"error": "Estado inválido."}, status=status.HTTP_400_BAD_REQUEST)

        pedido.estado = nuevo_estado
        pedido.save()

        serializer = PedidoSerializer(pedido)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
class PedidosProveedorView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Obtener todos los productos vendidos por el proveedor autenticado
            productos_vendidos = Producto.objects.filter(vendedor=request.user)

            # Obtener todos los detalles de compra que contienen esos productos
            detalles = DetalleCompra.objects.filter(producto__in=productos_vendidos)

            # Obtener los pedidos relacionados con estos detalles de compra
            pedidos = Pedido.objects.filter(compra__detalles__in=detalles).distinct().select_related('cliente', 'compra')

            # Serializar los pedidos encontrados
            serializer = PedidoSerializer(pedidos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        try:
            # Obtener el pedido que el proveedor desea actualizar
            pedido = Pedido.objects.get(pk=pk)

            # Verificar si el usuario autenticado es el vendedor de algún producto en el pedido
            productos_vendidos = Producto.objects.filter(vendedor=request.user)
            detalles = DetalleCompra.objects.filter(compra=pedido.compra, producto__in=productos_vendidos)

            if not detalles.exists():
                return Response({"error": "No tienes permiso para actualizar este pedido."}, status=status.HTTP_403_FORBIDDEN)

            # Obtener el nuevo estado del pedido del request
            nuevo_estado = request.data.get('estado')
            if nuevo_estado not in ['entregado', 'camino', 'preparacion', 'pagado']:
                return Response({"error": "Estado inválido."}, status=status.HTTP_400_BAD_REQUEST)

            # Actualizar el estado del pedido
            pedido.estado = nuevo_estado
            pedido.save()

            # Serializar el pedido actualizado
            serializer = PedidoSerializer(pedido)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Pedido.DoesNotExist:
            return Response({"error": "Pedido no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class TopProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filtrar productos que pertenecen al proveedor autenticado
        productos_mas_vendidos = (
            DetalleCompra.objects
            .filter(producto__vendedor=request.user)  # Filtrar por proveedor autenticado
            .values('producto__titulo')
            .annotate(quantity_sold=Count('producto'))
            .order_by('-quantity_sold')[:10]  # Los 10 productos más vendidos
        )

        # Formatear los datos para el frontend
        data = [
            {
                'name': producto['producto__titulo'],
                'quantitySold': producto['quantity_sold']
            }
            for producto in productos_mas_vendidos
        ]

        return Response({'topProducts': data})


class SalesDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtener el año actual
        current_year = datetime.now().year

        # Obtener las ventas mensuales actuales en la base de datos para el año actual
        ventas_mensuales = (
            Compra.objects
            .filter(fecha__year=current_year)  # Filtrar solo ventas del año actual
            .annotate(month=TruncMonth('fecha'))
            .values('month')
            .annotate(total_sales=Sum('total'))
            .order_by('month')
        )

        # Diccionario que almacena el total de ventas por mes en formato numérico (1=Enero, 2=Febrero, etc.)
        ventas_dict = {venta['month'].month: venta['total_sales'] for venta in ventas_mensuales}

        # Lista de todos los meses del año en formato numérico para asegurar el orden
        meses_nombres = [
            (1, 'Enero'), (2, 'Febrero'), (3, 'Marzo'), (4, 'Abril'),
            (5, 'Mayo'), (6, 'Junio'), (7, 'Julio'), (8, 'Agosto'),
            (9, 'Septiembre'), (10, 'Octubre'), (11, 'Noviembre'), (12, 'Diciembre')
        ]
        
        # Rellenar los meses sin ventas con 0 y conservar los meses con ventas existentes
        data = [
            {'month': nombre, 'totalSales': ventas_dict.get(numero, 0)}
            for numero, nombre in meses_nombres
        ]

        return Response({'salesMonthly': data})





