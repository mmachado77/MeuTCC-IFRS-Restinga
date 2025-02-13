from .base import BaseModel
from django.db import models

class Avaliacao(BaseModel):
    """
    Modelo que representa a avaliação de um TCC (Trabalho de Conclusão de Curso).
    
    Atributos:
        avaliado_orientador (BooleanField): Indica se a avaliação pelo orientador foi concluída. Valor padrão é False.
        avaliado_avaliador1 (BooleanField): Indica se a avaliação pelo primeiro avaliador foi concluída. Valor padrão é False.
        avaliado_avaliador2 (BooleanField): Indica se a avaliação pelo segundo avaliador foi concluída. Valor padrão é False.
        comentarios_orientador (TextField): Armazena os comentários do orientador. Pode ser null ou blank.
        comentarios_avaliador1 (TextField): Armazena os comentários do primeiro avaliador. Pode ser null ou blank.
        comentarios_avaliador2 (TextField): Armazena os comentários do segundo avaliador. Pode ser null ou blank.
        ajuste (BooleanField): Indica se um ajuste é necessário. Valor padrão é False.
        descricao_ajuste (TextField): Descrição do ajuste necessário. Pode ser null ou blank.
        data_entrega_ajuste (DateTimeField): Data e hora de entrega do ajuste. Pode ser null ou blank.
        tcc_definitivo (FileField): Armazena o documento final do TCC. O arquivo é enviado para o diretório 'tcc/documento'. Pode ser null ou blank.
        ficha_avaliacao (FileField): Armazena a ficha de avaliação. O arquivo é enviado para o diretório 'avaliacoes/fichas'. Pode ser null ou blank.
        data_avaliacao (DateTimeField): Data e hora da avaliação. Pode ser null ou blank.
        parecer_orientador (TextField): Parecer final do orientador. Pode ser null ou blank.
    """

    avaliado_orientador = models.BooleanField(default=False)
    avaliado_avaliador1 = models.BooleanField(default=False)
    avaliado_avaliador2 = models.BooleanField(default=False)
    comentarios_orientador = models.TextField(null=True, blank=True)
    comentarios_avaliador1 = models.TextField(null=True, blank=True)
    comentarios_avaliador2 = models.TextField(null=True, blank=True)
    ajuste = models.BooleanField(default=False)
    descricao_ajuste = models.TextField(null=True, blank=True)
    data_entrega_ajuste = models.DateTimeField(null=True, blank=True)
    tcc_definitivo = models.TextField(null=True, blank=True)
    ficha_avaliacao = models.TextField(null=True, blank=True)
    data_avaliacao = models.DateTimeField(null=True, blank=True)
    parecer_orientador = models.TextField(null=True, blank=True)

    class meta:
        abstract = False