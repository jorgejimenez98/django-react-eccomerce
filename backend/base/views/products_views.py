from django.core.paginator import Paginator, EmptyPage, Page, PageNotAnInteger
from ..models import Product, Review
from ..serializers import ProductSerializer
# REST_FRAMEWORK
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime


@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query is None:
        query = '';
    products = Product.objects.filter(name__icontains=query)
    # Pagination for the products 
    page = request.query_params.get('page')
    paginator = Paginator(products, 5)
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)
    
    if page is None:
        page = 1
    page = int(page) 
    # Response
    serializer = ProductSerializer(products, many=True)
    response = {'products': serializer.data, 'page': page, 'pages': paginator.num_pages}
    return Response(response, status=status.HTTP_200_OK)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(pk=pk)
    return Response(ProductSerializer(product, many=False).data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(pk=pk)
    product.delete()
    return Response({'Producto Eliminado satisfactoriamente'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user 
    try:
        product = Product.objects.create(
            user=user,
            name='Sample Name',
            price=0,
            brand='Simple Brand',
            countInStock=0,
            category='Category Simple',
            description='',
        )
        return Response(ProductSerializer(product, many=False).data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({e.args[0]}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data['product'] 
    product = Product.objects.get(pk=pk)
    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']
    product.save()
    return Response(ProductSerializer(product, many=False).data, status=status.HTTP_200_OK)

""" CARGAR UNA IMAGEN DESDE EL FRONTEND """

@api_view(['POST'])
def uploadImage(request):
    data = request.data 
    productId = data['product_id']
    product = Product.objects.get(_id=productId)
    product.image = request.FILES.get('image')
    product.save()
    return Response({'Image Uploaded'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user 
    product = Product.objects.get(_id=pk)
    data = request.data 

    try:
        # Review already exist 
        alreadyExists = product.review_set.filter(user=user).exists()
        if alreadyExists:
            content = {'detail': 'Product already review'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        # No rating or 0 
        elif data['rating'] == 0:
            content = {'detail': 'Plase select a rating'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        # Create the review 
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
            createdAt=datetime.now(),
        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating 
        product.rating = total
        product.save()
        return Response({'Review Added'}, status=status.HTTP_200_OK) 
    except Exception as e:      
        return Response( {'detail': e.args[0]}, status=status.HTTP_400_BAD_REQUEST)