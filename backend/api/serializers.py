from rest_framework import serializers
from .models import Producto
from django.contrib.auth import get_user_model
from .models import Compra, DetalleCompra, Profile

class ProductoSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'titulo', 'precio']

class DetalleCompraSerializer(serializers.ModelSerializer):
    producto = ProductoSimpleSerializer(read_only=True)

    class Meta:
        model = DetalleCompra
        fields = ['producto', 'cantidad', 'precio']


class CompraSerializer(serializers.ModelSerializer):
    detalles = DetalleCompraSerializer(many=True)

    class Meta:
        model = Compra
        fields = ['id', 'customer', 'total', 'fecha', 'detalles']

    
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ["id", "titulo", "descripcion", "precio", "imagen", "vendedor", "fecha_creacion"]

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
