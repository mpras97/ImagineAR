from django.urls import path

from . import views
from .views import current_user, UserList

urlpatterns = [
    path('', views.index, name='index'),
    path('image/', views.image, name='image'),
    path('current_user/', current_user),
    path('users/', UserList.as_view())
]
