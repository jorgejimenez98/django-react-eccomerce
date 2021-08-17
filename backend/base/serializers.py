from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *

""" USERS """


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['_id', 'username', 'email', 'name', 'isAdmin']

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


""" PRODUCTS """


class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Product
        fields = '__all__'
    
    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data 


""" SHIPPING ADRESS """


class ShippingAdressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAdress
        fields = '__all__'


""" ORDER ITEM """


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


""" ORDER """


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAdress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = OrderItem.objects.filter(order___id=obj.pk)
        # obj.order_set.all() el tipo de curso lo hace asi pero a mi me da error, entonces improvise esto
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAdress(self, obj):
        try:
            adress = ShippingAdress.objects.get(order=obj)
            adress = ShippingAdressSerializer(adress, many=False).data 
        except:
            adress = False
        return adress

    def get_user(self, obj):
        items = obj.user
        serializer = UserSerializer(items, many=False)
        return serializer.data

""" Review """
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'