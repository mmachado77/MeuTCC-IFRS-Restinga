import logging
import pytz
from django.core.management.base import BaseCommand
from apscheduler.schedulers.background import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger
from django_apscheduler.jobstores import DjangoJobStore
from django_apscheduler.models import DjangoJobExecution
from django_apscheduler import util
from app.tasks import NotificaSessoesProximas

logger = logging.getLogger(__name__)

@util.close_old_connections
def delete_old_job_executions(max_age=604_800):
    DjangoJobExecution.objects.delete_old_job_executions(max_age)

class Command(BaseCommand):
    help = "Runs APScheduler."

    def handle(self, *args, **options):
        scheduler = BlockingScheduler()
        scheduler.add_jobstore(DjangoJobStore(), "default")
        mail = NotificaSessoesProximas()

        scheduler.add_job(
            mail.notificaSessaoDia,
            trigger=IntervalTrigger(minutes=1, timezone=pytz.timezone('America/Sao_Paulo')), # TESTE (Intervalo de execução a cada 1 minuto)
            #trigger=CronTrigger(hour=8, minute=0, timezone=pytz.timezone('America/Sao_Paulo')), # PRODUÇÃO (Execução todos os dias às 08:00 AM)
            id="notifica_sessao_dia",
            max_instances=1,
            replace_existing=True,
        )
        logger.info("Added job 'notifica_sessao_dia'.")

        scheduler.add_job(
            mail.notificaSessaoSemana,
            trigger=IntervalTrigger(minutes=1, timezone=pytz.timezone('America/Sao_Paulo')), # TESTE (Intervalo de execução a cada 1 minuto)
            #trigger=CronTrigger(hour=8, minute=0, timezone=pytz.timezone('America/Sao_Paulo')), # PRODUÇÃO (Execução todos os dias às 08:00 AM)
            id="notifica_sessao_semana",
            max_instances=1,
            replace_existing=True,
        )
        logger.info("Added job 'notifica_sessao_semana'.")

        scheduler.add_job(
            delete_old_job_executions,
            trigger=CronTrigger(hour=8, minute=0, timezone=pytz.timezone('America/Sao_Paulo')),
            id="delete_old_job_executions",
            max_instances=1,
            replace_existing=True,
        )

        logger.info("Added weekly job: 'delete_old_job_executions'.")

        try:
            scheduler.start()
        except (KeyboardInterrupt, SystemExit):
            logger.info("Interrupt received, stopping scheduler...")
            scheduler.shutdown()
            logger.info("Scheduler shut down successfully!")
