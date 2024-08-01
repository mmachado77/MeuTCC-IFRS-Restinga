from app.enums import CriteriosEnum
from datetime import datetime
from django.db.models import Sum
from django.http import HttpResponse
from app.models import Avaliacao, Nota, SessaoFinal, Banca
import locale
import pdfrw
import os
from django.conf import settings

TEMPLATE_PATH = os.path.join(settings.STATIC_ROOT, 'pdf', 'modelo_ficha_avaliacao.pdf')
ANNOT_KEY = '/Annots'
ANNOT_FIELD_KEY = '/T'
SUBTYPE_KEY = '/Subtype'
WIDGET_SUBTYPE_KEY = '/Widget'

class AvaliacaoService:
    """
    Service para preencher a ficha de avaliação de um TCC.

    Métodos:
        preencherFichaAvaliacao(avaliacao): Preenche a ficha de avaliação com os dados da avaliação.
        write_pdf(data_dict): Escreve os dados no template PDF e retorna o arquivo preenchido.
    """

    def preencherFichaAvaliacao(self, avaliacao):
        """
        Preenche a ficha de avaliação com os dados da avaliação.

        Args:
            avaliacao (Avaliacao): A instância do modelo Avaliacao.

        Retorna:
            HttpResponse: Resposta HTTP com o PDF preenchido.
        """
        try:
            locale.setlocale(locale.LC_TIME, 'pt_BR.UTF-8')
            sessao = SessaoFinal.objects.get(avaliacao=avaliacao)
            banca = Banca.objects.get(sessao=sessao)
            avaliadores = banca.professores.all()
            soma_orientador = Nota.objects.filter(avaliacao=avaliacao, professor=sessao.tcc.orientador).aggregate(Sum('nota'))['nota__sum']
            soma_avaliador1 = Nota.objects.filter(avaliacao=avaliacao, professor=avaliadores[0]).aggregate(Sum('nota'))['nota__sum']
            soma_avaliador2 = Nota.objects.filter(avaliacao=avaliacao, professor=avaliadores[1]).aggregate(Sum('nota'))['nota__sum']
            media_final = (soma_orientador + soma_avaliador1 + soma_avaliador2) / 3
            resultado = "APROVADO" if media_final >= 7 else "REPROVADO"

            data_dict = {
                '[nome_aluno]': str(sessao.tcc.autor.nome),
                '[nome_trabalho]': str(sessao.tcc.tema),
                '[nome_orientador]': str(sessao.tcc.orientador.nome),
                '[nota1_orientador]': str(Nota.objects.get(avaliacao=avaliacao, professor=sessao.tcc.orientador, criterio=CriteriosEnum.ESTRUTURA_TRABALHO).nota),
                '[nota1_avaliador1]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[0], criterio=CriteriosEnum.ESTRUTURA_TRABALHO).nota),
                '[nota1_avaliador2]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[1], criterio=CriteriosEnum.ESTRUTURA_TRABALHO).nota),
                '[nota2_orientador]': str(Nota.objects.get(avaliacao=avaliacao, professor=sessao.tcc.orientador, criterio=CriteriosEnum.RELEVANCIA_ORIGINALIDADE_QUALIDADE).nota),
                '[nota2_avaliador1]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[0], criterio=CriteriosEnum.RELEVANCIA_ORIGINALIDADE_QUALIDADE).nota),
                '[nota2_avaliador2]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[1], criterio=CriteriosEnum.RELEVANCIA_ORIGINALIDADE_QUALIDADE).nota),
                '[nota3_orientador]': str(Nota.objects.get(avaliacao=avaliacao, professor=sessao.tcc.orientador, criterio=CriteriosEnum.GRAU_CONHECIMENTO).nota),
                '[nota3_avaliador1]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[0], criterio=CriteriosEnum.GRAU_CONHECIMENTO).nota),
                '[nota3_avaliador2]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[1], criterio=CriteriosEnum.GRAU_CONHECIMENTO).nota),
                '[nota4_orientador]': str(Nota.objects.get(avaliacao=avaliacao, professor=sessao.tcc.orientador, criterio=CriteriosEnum.BIBLIOGRAFIA_APRESENTADA).nota),
                '[nota4_avaliador1]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[0], criterio=CriteriosEnum.BIBLIOGRAFIA_APRESENTADA).nota),
                '[nota4_avaliador2]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[1], criterio=CriteriosEnum.BIBLIOGRAFIA_APRESENTADA).nota),
                '[nota5_orientador]': str(Nota.objects.get(avaliacao=avaliacao, professor=sessao.tcc.orientador, criterio=CriteriosEnum.UTILIZACAO_RECURSOS_DIDATICOS).nota),
                '[nota5_avaliador1]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[0], criterio=CriteriosEnum.UTILIZACAO_RECURSOS_DIDATICOS).nota),
                '[nota5_avaliador2]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[1], criterio=CriteriosEnum.UTILIZACAO_RECURSOS_DIDATICOS).nota),
                '[nota6_orientador]': str(Nota.objects.get(avaliacao=avaliacao, professor=sessao.tcc.orientador, criterio=CriteriosEnum.CONTEUDO_APRESENTACAO).nota),
                '[nota6_avaliador1]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[0], criterio=CriteriosEnum.CONTEUDO_APRESENTACAO).nota),
                '[nota6_avaliador2]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[1], criterio=CriteriosEnum.CONTEUDO_APRESENTACAO).nota),
                '[nota7_orientador]': str(Nota.objects.get(avaliacao=avaliacao, professor=sessao.tcc.orientador, criterio=CriteriosEnum.UTILIZACAO_TEMPO_SINTESE).nota),
                '[nota7_avaliador1]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[0], criterio=CriteriosEnum.UTILIZACAO_TEMPO_SINTESE).nota),
                '[nota7_avaliador2]': str(Nota.objects.get(avaliacao=avaliacao, professor=avaliadores[1], criterio=CriteriosEnum.UTILIZACAO_TEMPO_SINTESE).nota),
                '[media_final1]': str(round(media_final, 2)),
                '[resultado]': str(resultado),
                '[media_final2]': str(round(media_final, 2)),
                '[dia_ajuste]': str(avaliacao.data_entrega_ajuste.day) if avaliacao.data_entrega_ajuste else '',
                '[mes_ajuste]': str(avaliacao.data_entrega_ajuste.month) if avaliacao.data_entrega_ajuste else '',
                '[ano_ajuste]': str(avaliacao.data_entrega_ajuste.year) if avaliacao.data_entrega_ajuste else '',
                '[dia_atual]': str(datetime.now().day),
                '[mes_atual]': str(datetime.now().strftime('%B')).capitalize(),
                '[ano_atual]':  str(datetime.now().year)[-2:],
                '[nome_orientador2]': str(sessao.tcc.orientador.nome),
                '[nome_orientador3]': str(sessao.tcc.orientador.nome),
                '[nome_avaliador1]': str(avaliadores[0].nome),
                '[nome_avaliador2]': str(avaliadores[1].nome),
            }
        except Exception as e:
            print(e)
        return self.write_pdf(data_dict)

    def write_pdf(self, data_dict):
        """
        Escreve os dados no template PDF e retorna o arquivo preenchido.

        Args:
            data_dict (dict): Dicionário contendo os dados a serem preenchidos no PDF.

        Retorna:
            HttpResponse: Resposta HTTP com o PDF preenchido.
        """
        try:
            template_pdf = pdfrw.PdfReader(TEMPLATE_PATH)  # [1]
            template_pdf.keys()
            annotations = template_pdf.pages[0][ANNOT_KEY]  # [2]
            for annotation in annotations:  # [3]
                if annotation[SUBTYPE_KEY] == WIDGET_SUBTYPE_KEY:
                    if annotation[ANNOT_FIELD_KEY]:  # [4]
                        key = annotation[ANNOT_FIELD_KEY][1:-1]  # [5]
                        if key in data_dict.keys():  # [6]
                            update = {
                                'V': data_dict[key],  # [7]
                            }
                            annotation.update(pdfrw.PdfDict(**update))  # [8]
                annotation.update(pdfrw.PdfDict(Ff=1))  # [9]

            template_pdf.Root.AcroForm.update(  # [10]
                pdfrw.PdfDict(NeedAppearances=pdfrw.PdfObject('true'))
            )

            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="ficha-avaliacao-preenchida.pdf"'

            pdfrw.PdfWriter().write(response, template_pdf)

        except Exception as e:
            print(e)

        return response