from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_admin= models.BooleanField('Is admin', default=False)
    is_customer = models.BooleanField('Is customer', default=False)
    is_employee = models.BooleanField('Is employee', default=False)

class Producto(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.IntegerField(default=0)  
    imagen = models.ImageField(upload_to='media/', null=True, blank=True)  # 'upload_to' define la carpeta donde se guardarán las imágenes
    vendedor = models.CharField(max_length=50, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)  # Guarda la fecha en que se crea el producto

    def __str__(self):
        return self.titulo
    