from django.urls import path
from ..views import orders_views as views

urlpatterns = [
    path('', views.getMyOrders, name='getMyOrders'),
    path('add/', views.addOrderItems, name='order-add'),
    path('myOrders/', views.getMyOrders, name='getMyOrders'),
    path('<str:pk>/delivered/', views.updateOrderToDelivered, name='updateOrderToDelivered'),
    path('<str:pk>/', views.getOrderById, name='getOrderById'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='updateOrderToPaid'),
]
