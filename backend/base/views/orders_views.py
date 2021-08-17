from datetime import datetime
# REST_FRAMEWORK
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
# SERIALIZERS
from ..serializers import *


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']
    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No hay Productos en el carrito'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        """ Create the Order """
        order = Order(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice'],
        )
        order.save()
        """ Create Shipping Adress """
        shippingAdress = ShippingAdress(
            order=order,
            adress=data['shippingAdress']['adress'],
            city=data['shippingAdress']['city'],
            postalCode=data['shippingAdress']['postalCode'],
            country=data['shippingAdress']['country'],
        )
        shippingAdress.save()
        """ Create Order Items """
        for i in orderItems:
            productItem = Product.objects.get(_id=i['product'])

            item = OrderItem(
                product=productItem,
                order=order,
                name=productItem.name,
                qty=i['qty'],
                price=i['price'],
                image=productItem.image.url,
            )
            item.save()
            """ Update Stock """
            productItem.countInStock -= item.qty
            productItem.save()

        serializer = OrderSerializer(order, many=False).data
        return Response(serializer, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'detail': e.args[0]}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user 
    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'No esta autorizado a ver esta orden'}, status=status.HTTP_400_BAD_REQUEST)    
    except Exception as e:
        return Response({'detail': e.args[0]}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)
    order.isPaid = True 
    order.paidAt = datetime.now()
    order.save()
    return Response({'Order was paid'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user 
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getMyOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
    

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)
    order.isDelivered = True 
    order.deliveredAt = datetime.now()
    order.save()
    return Response({'Order was delivered'}, status=status.HTTP_200_OK)