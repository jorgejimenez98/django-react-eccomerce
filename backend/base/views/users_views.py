from django.contrib.auth.hashers import make_password
from ..models import *
# REST_FRAMEWORK
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
# SERIALIZERS
from ..serializers import UserSerializer, UserSerializerWithToken
# JWT
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

""" RECOGER DATOS DEL USUARIO CUANDO SE AUTOENTICA """


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


""" USER VIEWS """

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    return Response(UserSerializer(users, many=True).data, status=status.HTTP_200_OK)


@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            email=data['email'],
            username=data['email'],
            password=make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False).data
        return Response(serializer, status=status.HTTP_200_OK)
    except:
        message = {'detail': 'User with this email already exist'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)



""" PROFILE VIEWS """

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    print('Perfik')
    user = request.user
    serializer = UserSerializer(user, many=False).data
    return Response(serializer)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data 
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password']:
        user.password = make_password(data['password'])
    
    user.save()
    serializer = UserSerializerWithToken(user, many=False).data
    return Response(serializer)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userToDelete = User.objects.get(pk=pk)
    userToDelete.delete()
    return Response({'Usuario Eliminado satisfactoriamente'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    print('Editaaar')
    user = User.objects.get(pk=pk)
    return Response(UserSerializer(user, many=False).data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    user = User.objects.get(pk=pk)
    data = request.data 
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()
    serializer = UserSerializer(user, many=False).data
    return Response(serializer)