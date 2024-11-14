from rest_framework import serializers
from .models import Producto
from django.contrib.auth import get_user_model
from .models import Compra, DetalleCompra, Profile, Mensaje, CalificacionProveedor, Pedido

class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = ['id', 'remitente', 'destinatario', 'contenido', 'timestamp']

class ProductoSimpleSerializer(serializers.ModelSerializer):
    vendedor = serializers.CharField(source='vendedor.username')

    class Meta:
        model = Producto
        fields = ['id', 'titulo', 'precio', 'vendedor']



    
class ProductoSerializer(serializers.ModelSerializer):
    vendedor = serializers.CharField(source='vendedor.username')  # Nombre del vendedor

    class Meta:
        model = Producto
        fields = ["id", "titulo", "descripcion", "precio", "imagen", "vendedor", "fecha_creacion", "stock"]

class DetalleCompraSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer()

    class Meta:
        model = DetalleCompra
        fields = ['producto', 'cantidad', 'precio']

class CompraSerializer(serializers.ModelSerializer):
    detalles = DetalleCompraSerializer(many=True, read_only=True)  # Utilizamos el related_name correcto

    class Meta:
        model = Compra
        fields = ['id', 'customer', 'total', 'fecha', 'detalles']




User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_admin', 'is_employee', 'is_customer']

class PedidoSerializer(serializers.ModelSerializer):
    cliente = UserSerializer()  # Para mostrar información del cliente
    proveedor = serializers.SerializerMethodField()  # Campo calculado para mostrar información del proveedor
    compra = CompraSerializer()
    detalles = DetalleCompraSerializer(many=True, source='compra.detalles')

    class Meta:
        model = Pedido
        fields = ['id', 'fecha', 'total', 'estado', 'pagado', 'cliente', 'proveedor', 'compra', 'detalles']

    def get_proveedor(self, obj):
        # Tomamos el primer detalle para obtener al vendedor asociado
        if obj.compra and obj.compra.detalles.exists():
            primer_detalle = obj.compra.detalles.first()
            return {
                'id': primer_detalle.producto.vendedor.id,
                'username': primer_detalle.producto.vendedor.username,
            }
        return None




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


class CalificacionProveedorSerializer(serializers.ModelSerializer):
    cliente = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), default=serializers.CurrentUserDefault())

    class Meta:
        model = CalificacionProveedor
        fields = ['id', 'proveedor', 'cliente', 'puntuacion', 'comentario', 'fecha']
        read_only_fields = ['fecha']


