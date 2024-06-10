from app.models import Usuario
from notifications.signals import notify
from django.core.mail import send_mail
from app.models import Coordenador

class notificacaoService:
    def enviarNotificacaoProposta(self, estudante_user, data):
        url = "/proposta-pendente"
        try:
            estudante = Usuario.objects.get(user=estudante_user)
            orientador_id = data.get('orientador')
            orientador = Usuario.objects.get(id=orientador_id)

            if not orientador:
                raise Usuario.DoesNotExist("Orientador não encontrado.")

            # Enviando a notificação para o orientador
            notify.send(
                estudante_user,
                recipient=orientador.user,
                verb=f"Você recebeu uma solicitação de orientação.",
                description=url
            )

            # Enviando e-mail para o orientador
            send_mail(subject="[Meus TCCs - Restinga] Nova solicitação de orientação",
                      message=f"""Olá {orientador.nome},

Você recebeu uma nova solicitação de orientação no sistema Meus TCCs. Seguem os detalhes:

    • **Estudante:** {estudante.nome}
    • **Tema:** {data['tema']}
    • **Resumo:** {data['resumo']}

Por favor, acesse o sistema para revisar a solicitação e tomar as devidas ações.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
                      from_email="meustccs@restinga.ifrs.edu.br",
                      recipient_list=[orientador.email],
                      fail_silently=False)

            coorientador_id = data.get('coorientador')

            if coorientador_id:
                coorientador = Usuario.objects.get(id=coorientador_id)

                if coorientador:
                    # Enviando a notificação para o coorientador
                    notify.send(
                        estudante_user,
                        recipient=coorientador.user,
                        verb=f"Você recebeu uma solicitação de coorientação.",
                        description=url
                    )
                    # Enviando e-mail para o coorientador
                    send_mail(subject="[Meus TCCs - Restinga] Nova solicitação de coorientação",
                              message=f"""Olá {coorientador.nome},

Você recebeu uma nova solicitação de coorientação no sistema Meu TCC Restinga. Seguem os detalhes:

    • **Estudante:** {estudante.nome}
    • **Tema:** {data['tema']}
    • **Resumo:** {data['resumo']}

Por favor, acesse o sistema para revisar a solicitação e tomar as devidas ações.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
                              from_email="meustccs@restinga.ifrs.edu.br",
                              recipient_list=[coorientador.email],
                              fail_silently=False)

        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")

    def enviarNotificacaoCadastroExterno(self, request_user, cadastro_data):
        url = "/atualizar-permissoes"
        vinculo = "Externa"
        print(cadastro_data)
        try:
            if cadastro_data.isProfessor:
                if cadastro_data.IsInterno:
                    vinculo = "Interna"

                coord = Coordenador.objects.first()
                if not coord:
                    raise Usuario.DoesNotExist("Coordenador não encontrado.")

                # Enviando a notificação para o orientador
                notify.send(
                    request_user,
                    recipient=coord.user,
                    verb=f"Há uma nova solicitação de cadastro aguardando aprovação.",
                    description=url
                )

                # Enviando e-mail para o orientador
                send_mail(subject="[Meus TCCs - Restinga] Nova solicitação de cadastro",
                          message=f"""Olá {coord.nome},

Gostaríamos de informar que há uma nova solicitação de cadastro no sistema Meus TCCs aguardando sua aprovação. 

Por favor, acesse o sistema para revisar a solicitação e tomar as devidas ações.

Detalhes das solicitações pendentes:

  • Nome do Solicitante: {cadastro_data.nome}
  • E-mail do Solicitante: {cadastro_data.email}
  • Tipo do Solicitação: {vinculo}

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
                          from_email="meustccs@restinga.ifrs.edu.br",
                          recipient_list=[coord.email],
                          fail_silently=False)
        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")

    def enviarNotificacaoCadastroExternoAprovado(self, professor):
        try:
            send_mail(subject="[Meus TCCs - Restinga] Solicitação de cadastro aprovada",
                      message=f"""Olá {professor.nome},

É com prazer que informamos que seu cadastro no sistema Meu TCC Restinga foi aprovado com sucesso!          

Agora você pode acessar todas as funcionalidades disponíveis para realizar o acompanhamento do seu TCC.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
                      from_email="meustccs@restinga.ifrs.edu.br",
                      recipient_list=[professor.email],
                      fail_silently=False)
        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")

    def enviarNotificacaoCadastroExternoNegado(self, professor, justificativa):
        try:
            send_mail(subject="[Meus TCCs - Restinga] Solicitação de cadastro negada",
                      message=f"""Olá {professor.nome},

Lamentamos informar que seu cadastro no sistema Meus TCCs foi negado. Abaixo está a justificativa para a negativa:

    • {justificativa}

Por favor, verifique as informações fornecidas e tente novamente.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
                      from_email="meustccs@restinga.ifrs.edu.br",
                      recipient_list=[professor.email],
                      fail_silently=False)
        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")