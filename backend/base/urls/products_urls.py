from django.urls import path
from ..views import products_views as views
from rest_framework_simplejwt.views import TokenObtainPairView
 


urlpatterns = [
    path('', views.getProducts, name="products"),
    path('create/', views.createProduct, name="createProduct"),
    path('upload/', views.uploadImage, name="uploadImage"),
    path('<str:pk>/reviews/', views.createProductReview, name="createProductReview"),
    path('<str:pk>', views.getProduct, name="getProduct"),
    path('delete/<str:pk>/', views.deleteProduct, name="deleteProduct"),
    path('update/<str:pk>/', views.updateProduct, name="updateProduct"),
]
