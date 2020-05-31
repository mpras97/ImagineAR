from django.urls import path
from django.conf.urls import url, include
from . import views
from .views import current_user, UserList, TemplateView, CapturePhoto
from rest_framework.routers import DefaultRouter

template_view = DefaultRouter()
template_view.register(r'', TemplateView, basename='template')

get_template = TemplateView.as_view({
    'get': 'get_template'
})

capture_photo = CapturePhoto.as_view({
    'post': 'capture_photo'
})

urlpatterns = [
    path('', views.index, name='index'),
    # path('image/', views.image, name='image'),
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    url(r'^template/', include(template_view.urls)),
    url(r'^gettemplate/(?P<username>.*)/$', get_template, name='get_template'),
    url(r'^image/', capture_photo, name='capture_photo'),

]
