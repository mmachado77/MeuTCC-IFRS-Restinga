from django.db import models
from polymorphic.models import PolymorphicModel
from datetime import datetime
from . import Tcc

class Sessao(PolymorphicModel):
    """
    Modelo que representa uma sessão de apresentação de TCC.

    Atributos:
        local (CharField): Local da sessão. Comprimento máximo de 255 caracteres.
        forma_apresentacao (CharField): Forma de apresentação. Pode ser null.
        parecer_orientador (TextField): Parecer do orientador. Pode ser null ou blank.
        parecer_coordenador (TextField): Parecer do coordenador. Pode ser null ou blank.
        data_inicio (DateTimeField): Data e hora de início da sessão.
        tcc (ForeignKey): Relacionamento com o TCC associado. Protegido contra exclusão.
        documentoTCCSessao (FileField): Documento da sessão do TCC. O arquivo é enviado para o diretório 'sessao/documento'. Pode ser null ou blank.
        prazoEntregaDocumento (DateTimeField): Prazo para entrega do documento. Valor padrão é a data e hora atuais. Pode ser null ou blank.
        validacaoOrientador (BooleanField): Indica se a sessão foi validada pelo orientador. Valor padrão é False.
        validacaoCoordenador (BooleanField): Indica se a sessão foi validada pelo coordenador. Valor padrão é False.
        lembrete_semana (BooleanField): Indica se um lembrete semanal foi enviado. Valor padrão é False.
        lembrete_dia (BooleanField): Indica se um lembrete diário foi enviado. Valor padrão é False.
        data_agendamento (DateTimeField): Data e hora do agendamento. Pode ser null ou blank.

    Propriedades:
        get_tipo: Retorna o tipo da sessão com base na classe.

    Métodos:
        getSessoesFuturas(): Retorna as sessões futuras validadas pelo orientador, ordenadas pela validação do coordenador e data de início.
    """
    local = models.CharField(max_length=255)
    forma_apresentacao = models.CharField(max_length=255, null=True) # NULL = Status temporário
    # TODO - Verificar propriedades dos atributos "parecer_orientador" e "parecer_coordenador"
    parecer_orientador = models.TextField(null=True, blank=True)
    parecer_coordenador = models.TextField(null=True, blank=True)
    data_inicio = models.DateTimeField()
    tcc = models.ForeignKey(Tcc, on_delete=models.PROTECT, related_name='sessoes')
    documentoTCCSessao = models.TextField(null=True, blank=True)
    prazoEntregaDocumento = models.DateTimeField(default=datetime.now, null=True, blank=True)
    validacaoOrientador = models.BooleanField(default=False)
    validacaoCoordenador = models.BooleanField(default=False)
    lembrete_semana = models.BooleanField(default=False)
    lembrete_dia = models.BooleanField(default=False)
    data_agendamento = models.DateTimeField(null=True, blank=True)

    @property
    def get_tipo(self):
        """
        Retorna o tipo da sessão com base na classe.

        Retorna:
            str: Tipo da sessão ('Sessão Prévia' ou 'Sessão Final').
        """
        return {
            'SessaoPrevia': 'Sessão Prévia',
            'SessaoFinal': 'Sessão Final',
        }[self.__class__.__name__]
    
    def getSessoesFuturas():
        """
        Retorna as sessões futuras validadas pelo orientador, ordenadas pela validação do coordenador e data de início.

        Retorna:
            QuerySet: Sessões futuras validadas pelo orientador.
        """
        data_consulta = datetime.today().date()
        sessoes = Sessao.objects.filter(
            data_inicio__gt=data_consulta,
            validacaoOrientador=True
            ).order_by(
                'validacaoCoordenador',
                'data_inicio'
            )
        if sessoes.exists():
            return sessoes
        else:
            return None

    

    class Meta:
        abstract = False