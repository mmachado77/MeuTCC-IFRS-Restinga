from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User
from app.models import Sessao
from app.services.notificacoes import notificacaoService
from django_apscheduler import util

class NotificaSessoesProximas:
    notificacaoService = notificacaoService()

    @util.close_old_connections
    def notificaSessaoDia(self):
        now = timezone.now()
        notifyuser = User.objects.get(username='notifyuser')

        lembrete_dia_data = now + timedelta(days=1)
        sessoes_lembrete_dia = Sessao.objects.filter(
            data_inicio__date=lembrete_dia_data.date(),
            data_agendamento__lte=now - timedelta(days=2),
            validacaoOrientador=True,
            validacaoCoordenador=True,
            lembrete_dia=False
        )

        for sessao in sessoes_lembrete_dia:
            self.notificacaoService.enviarNotificacaoLembreteSessaoDia(notifyuser, sessao)
            sessao.lembrete_dia = True
            sessao.save()

    @util.close_old_connections
    def notificaSessaoSemana(self):
        now = timezone.now()
        notifyuser = User.objects.get(username='notifyuser')
        lembrete_semana_data = now + timedelta(days=7)
        sessoes_lembrete_semana = Sessao.objects.filter(
            data_inicio__date=lembrete_semana_data.date(),
            data_agendamento__lte=now - timedelta(days=5),
            validacaoOrientador=True,
            validacaoCoordenador=True,
            lembrete_semana=False,
            lembrete_dia=False
        )

        for sessao in sessoes_lembrete_semana:
            self.notificacaoService.enviarNotificacaoLembreteSessaoSemana(notifyuser, sessao)
            sessao.lembrete_semana = True
            sessao.save()

