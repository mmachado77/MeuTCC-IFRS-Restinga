from django.db import models
from . import Professor

class ProfessorExterno(Professor):

    # TODO - Verificar como será feito os campos de arquivo "identidade" e "diploma"
    identidade = models.FileField(upload_to='professoresExterno/identidade')
    diploma = models.FileField(upload_to='professoresExterno/diploma')

    statusCadastro = models.BooleanField()
    dataStatus = models.DateTimeField(auto_now=True)

    class meta:
        abstract = False