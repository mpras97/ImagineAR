from django.db import models
from django.contrib.auth.models import User


class Template(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    template = models.ImageField(upload_to="images/")
    material = models.FileField(upload_to="materials/", null=True, blank=True)
    model = models.FileField(upload_to="models/", null=True, blank=True)
    result_img = models.ImageField(upload_to="result_imgs/", null=True, blank=True)
    result_vid = models.FileField(upload_to="result_vids/", null=True, blank=True)
    result_text = models.TextField()
