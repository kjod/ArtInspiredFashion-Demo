from django.urls import path, include
from generate_clothing.generate import create

urlpatterns = [
    path('', create),
]