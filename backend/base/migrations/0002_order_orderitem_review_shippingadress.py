# Generated by Django 3.1.7 on 2021-04-16 03:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('_id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('paymentMethod', models.CharField(blank=True, max_length=36, null=True)),
                ('taxPrice', models.DecimalField(decimal_places=2, max_digits=7)),
                ('shippingPrice', models.DecimalField(decimal_places=2, max_digits=7)),
                ('totalPrice', models.DecimalField(decimal_places=2, max_digits=7)),
                ('isPaid', models.BooleanField(default=False)),
                ('paidAt', models.DateField(blank=True, null=True)),
                ('isDelivered', models.BooleanField(default=False)),
                ('deliveredAt', models.DateField(blank=True, null=True)),
                ('createdAt', models.DateField(auto_now_add=True, null=True)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ShippingAdress',
            fields=[
                ('_id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('adress', models.CharField(blank=True, max_length=36, null=True)),
                ('city', models.CharField(blank=True, max_length=136, null=True)),
                ('postalCode', models.CharField(blank=True, max_length=36, null=True)),
                ('country', models.CharField(blank=True, max_length=36, null=True)),
                ('shippingPrice', models.DecimalField(decimal_places=2, max_digits=7)),
                ('order', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='base.order')),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('_id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=36, null=True)),
                ('rating', models.DecimalField(decimal_places=2, max_digits=7)),
                ('comment', models.TextField(blank=True, null=True)),
                ('product', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.product')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('_id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=36, null=True)),
                ('qty', models.IntegerField(blank=True, default=0, null=True)),
                ('price', models.DecimalField(decimal_places=2, max_digits=7)),
                ('order', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.order')),
                ('product', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.product')),
            ],
        ),
    ]