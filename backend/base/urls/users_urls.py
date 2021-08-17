from django.urls import path
from ..views import users_views as views

urlpatterns = [
    path('', views.getUsers, name="users"),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('profile/', views.getUserProfile, name='user-profile'),
    path('profile/update/', views.updateUserProfile, name='user-profile-update'),
    path('register/', views.registerUser, name="users-register"),
    path('<str:pk>/', views.getUserById, name="getUserById"),
    path('update/<str:pk>/', views.updateUser, name="updateUser"),
    path('delete/<str:pk>/', views.deleteUser, name="deleteUser"),
]
