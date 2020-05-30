from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

@csrf_exempt
def image(request):
    print(request)
    if request.method == 'POST':
        data = {
            'name': ''
        }
    else:
        data = {
            'error': 'error'
        }
    return JsonResponse(data)
