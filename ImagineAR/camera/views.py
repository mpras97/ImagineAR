# Create your views here.
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from camera.models import *
import os
import base64
import cv2
from cv.template_match import *
from shutil import copy

from .models import Template
from .serializers import UserSerializer, UserSerializerWithToken, TemplateSerializer


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

# @csrf_exempt
# def image(request):
#     print(request)
#     if request.method == 'POST':
#         data = {
#             'name': ''
#         }
#     else:
#         data = {
#             'error': 'error'
#         }
#     return JsonResponse(data)


@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TemplateView(viewsets.ModelViewSet):
    """
    Template Viewset
    """
    serializer_class = TemplateSerializer
    permission_classes = []

    def get_queryset(self):
        # print(kwargs)
        return Template.objects.all()

    def create(self, request, *args, **kwargs):
        """Create method"""

        username = request.data.get("username")
        user = User.objects.get(username=username)
        request.data["user_id"] = user.id
        request.data["user"] = user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_template(self, request, username):
        """
        Get template by username.
        :param request:
        :param username:
        :return:
        """

        try:
            user = User.objects.get(username=username)
            template = Template.objects.filter(user=user)
            print(template)
            serializer = TemplateSerializer(template, many=True)
            return Response(serializer.data)
        except Template.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class CapturePhoto(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)

    def capture_photo(self, request):
        # print(request.data['image'])
        image = request.data['image']
        block = image.split(";")
        contentType = block[0].split(":")[1]
        realData = block[1].split(",")[1]
        import base64
        imgdata = base64.b64decode(realData)
        filename = 'some_image.jpg'
        with open(filename, 'wb') as f:
            f.write(imgdata)

        req_temp = False

        dest = "/Users/mayankprasoon/personal/ImagineAR/ImagineAR/camera/react_frontend/src/batman.obj"

        for temp in Template.objects.all():
            print("In loop")
            image = cv2.imread(filename)
            template = cv2.imread(temp.template.name)
            if find_normal_template(template, image):
                print("In if")
                req_temp = True

                print(temp.model)

                if temp.model:
                    print("H2")
                    # print(tem)
                    print(temp.model.name)
                    print(os.path.isfile(temp.model.name))
                    print(os.path.isfile(dest))
                    copy(temp.model.name, dest)
                break

        print(req_temp)
        return Response({'present': req_temp}, status=status.HTTP_200_OK)

