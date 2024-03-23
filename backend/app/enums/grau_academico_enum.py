from django.db import models

class GrauAcademicoEnum(models.TextChoices):
    TECNICO = ("Técnico")
    GRADUACAO = ("Graduação")
    POSGRADUACAO = ("Pós-Graduação")
    MESTRADO = ("Mestrado")
    DOUTORADO = ("Doutorado")
    POSDOUTORADO = ("Pós-Doutorado")