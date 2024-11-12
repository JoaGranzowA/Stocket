from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(AbstractUser):
    is_admin= models.BooleanField('Is admin', default=False)
    is_customer = models.BooleanField('Is customer', default=False)
    is_employee = models.BooleanField('Is employee', default=False)

class Producto(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.IntegerField(default=0)
    imagen = models.ImageField(upload_to='media/', null=True, blank=True)
    vendedor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='productos')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    stock = models.IntegerField(default=0)  # Nuevo campo para gestionar el stock del producto

    def __str__(self):
        return self.titulo
    
class Compra(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='compras')
    productos = models.ManyToManyField(Producto, through='DetalleCompra')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)

class DetalleCompra(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='detalles')
    cantidad = models.IntegerField(default=1)  # Cantidad de productos comprados
    precio = models.IntegerField()  # Precio del producto al momento de la compra
    stock_restante = models.IntegerField(default=0)  # Cantidad restante del producto comprado

    def __str__(self):
        return f'{self.cantidad} x {self.producto.titulo} en Compra {self.compra.id}'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    ubicacion = models.CharField(max_length=255, blank=True, null=True)
    foto = models.ImageField(upload_to='profiles/', null=True, blank=True)
    numero_contacto = models.CharField(max_length=15, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)

    # Atributos específicos para empleados
    rubro = models.CharField(max_length=255, blank=True, null=True)  # Solo para empleados
    experiencia = models.PositiveIntegerField(blank=True, null=True)  # Años de experiencias

    def __str__(self):
        return f'Perfil de {self.user.username}'
    
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Mensaje(models.Model):
    remitente = models.ForeignKey(User, related_name='mensajes_enviados', on_delete=models.CASCADE)
    destinatario = models.ForeignKey(User, related_name='mensajes_recibidos', on_delete=models.CASCADE)
    contenido = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"De {self.remitente.username} a {self.destinatario.username}"


    