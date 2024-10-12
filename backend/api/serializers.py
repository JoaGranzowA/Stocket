from rest_framework import serializers
from .models import Producto
from django.contrib.auth import get_user_model

    
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ["id", "titulo", "descripcion", "precio", "imagen", "vendedor","fecha_creacion"]

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_admin', 'is_employee', 'is_customer']