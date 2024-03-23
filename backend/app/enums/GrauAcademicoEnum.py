from django.db import models

class GrauAcademico(models.Model):
    
    class GrauAcademico(models.TextChoices):
        TECNICO = ("Técnico")
        GRADUACAO = ("Graduação")
        POSGRADUACAO = ("Pós-Graduação")
        MESTRADO = ("Mestrado")
        DOUTORADO = ("Doutorado")
        POSDOUTORADO = ("Pós-Doutorado")