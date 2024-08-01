from .base import BaseModel
from django.db import models

class Credenciais(BaseModel):    
    access_token = models.TextField()
    
    class Meta:
        abstract = False