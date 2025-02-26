from django.db import models
from . import Professor, Curso

class ProfessorExterno(Professor):
    """
    Modelo que representa um Professor Externo, herdando do modelo Professor.

    Atributos:
        identidade (FileField): Arquivo de identidade do professor externo. Pode ser null ou blank. O arquivo é enviado para o diretório 'media/professoresExterno/identidade'.
        diploma (FileField): Arquivo do diploma do professor externo. Pode ser null ou blank. O arquivo é enviado para o diretório 'media/professoresExterno/diploma'.
        dataStatus (DateTimeField): Data e hora da última alteração do status. Atualizado automaticamente.
    """
    # TODO - Verificar como será feito os campos de arquivo "identidade" e "diploma"
    # TODO - Modificar para que seja obrigatório anexar um arquivo
    identidade = models.FileField(blank=True, null=True, upload_to='media/professoresExterno/identidade')
    diploma = models.FileField(blank=True, null=True, upload_to='media/professoresExterno/diploma')
    dataStatus = models.DateTimeField(auto_now=True)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='professores_externos', default=1)

    class Meta:
        abstract = False