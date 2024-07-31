from .base import BaseModel
from django.db import models

class Credenciais(BaseModel):
    
    access_token = models.TextField()
    refresh_token = models.TextField()
    expires_in = models.DateTimeField()
    
    class Meta:
        abstract = False