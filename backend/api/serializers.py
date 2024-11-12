from rest_framework import serializers
from .models import Producto
from django.contrib.auth import get_user_model
from .models import Compra, DetalleCompra, Profile, Mensaje

class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = ['id', 'remitente', 'destinatario', 'contenido', 'timestamp']

class ProductoSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'titulo', 'precio']

class DetalleCompraSerializer(serializers.ModelSerializer):
    producto = ProductoSimpleSerializer(read_only=True)

    class Meta:
        model = DetalleCompra
        fields = ['id', 'compra', 'producto', 'cantidad', 'precio','stock_restante']


class CompraSerializer(serializers.ModelSerializer):
    detalles = DetalleCompraSerializer(many=True)

    class Meta:
        model = Compra
        fields = ['id', 'customer', 'total', 'fecha', 'detalles']

    
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ["id", "titulo", "descripcion", "precio", "imagen", "vendedor", "fecha_creacion", "stock"]


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_admin', 'is_employee', 'is_customer']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['ubicacion', 'numero_contacto', 'descripcion', 'rubro', 'experiencia', 'foto']
        extra_kwargs = {
            'rubro': {'required': False},
            'experiencia': {'required': False},
            'foto': {'required': False},
        }

class CustomerWithLowStockSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source='compra.customer.username')  # Nombre del cliente
    customer_id = serializers.IntegerField(source='compra.customer.id')  # ID del cliente
    producto = serializers.CharField(source='producto.titulo')  # Nombre del producto
    stock_restante = serializers.IntegerField()

    class Meta:
        model = DetalleCompra
        fields = ['customer', 'customer_id', 'producto', 'stock_restante']

