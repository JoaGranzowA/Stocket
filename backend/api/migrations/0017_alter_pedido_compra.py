# Generated by Django 5.1.1 on 2024-11-14 04:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_alter_pedido_compra'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pedido',
            name='compra',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='pedido', to='api.compra'),
        ),
    ]
