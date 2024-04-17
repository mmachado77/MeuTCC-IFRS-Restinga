from django.db import models
from . import Professor

class ProfessorExterno(Professor):

    # TODO - Verificar como será feito os campos de arquivo "identidade" e "diploma"
    # TODO - Modificar para que seja obrigatório anexar um arquivo
    identidade = models.FileField(blank=True, null=True, upload_to='media/professoresExterno/identidade')
    diploma = models.FileField(blank=True, null=True, upload_to='media/professoresExterno/diploma')
    dataStatus = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = False