from django.db import models

class GrauAcademicoEnum(models.TextChoices):
    TECNICO = "TECNICO"
    GRADUACAO = "GRADUACAO"
    POSGRADUACAO = "POSGRADUACAO"
    MESTRADO = "MESTRADO"
    DOUTORADO = "DOUTORADO"
    POSDOUTORADO = "POSDOUTORADO"

    def __str__(self):
        if self == GrauAcademicoEnum.TECNICO:
            return "Técnico"
        if self == GrauAcademicoEnum.GRADUACAO:
            return "Graduação"
        if self == GrauAcademicoEnum.POSGRADUACAO:
            return "Pós-Graduação"
        if self == GrauAcademicoEnum.MESTRADO:
            return "Mestrado"
        if self == GrauAcademicoEnum.DOUTORADO:
            return "Doutorado"
        if self == GrauAcademicoEnum.POSDOUTORADO:
            return "Pós-Doutorado"
        return self
