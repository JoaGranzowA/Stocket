# Generated by Django 5.1.1 on 2024-10-25 01:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_compra_detallecompra_compra_productos'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ubicacion', models.CharField(blank=True, max_length=255, null=True)),
                ('foto', models.ImageField(blank=True, null=True, upload_to='profiles/')),
                ('numero_contacto', models.CharField(blank=True, max_length=15, null=True)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('rubro', models.CharField(blank=True, max_length=255, null=True)),
                ('experiencia', models.PositiveIntegerField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]