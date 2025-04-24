from app.models import Usuario
from notifications.signals import notify
from django.core.mail import send_mail
from datetime import datetime
from dateutil.parser import parse
from app.models import Coordenador, Mensagem, Banca

class notificacaoService:
    """
    Service para enviar notificações relacionadas ao TCC.

    Métodos:
        enviarNotificacaoProposta(estudante_user, data): Envia notificação de proposta para orientador e coorientador.
        enviarNotificacaoCadastroExterno(request_user, cadastro_data): Envia notificação de cadastro externo.
        enviarNotificacaoCadastroExternoAprovado(professor): Envia notificação de aprovação de cadastro externo.
        enviarNotificacaoCadastroExternoNegado(professor, justificativa): Envia notificação de negação de cadastro externo.
        enviarNotificacaoAgendamentoBanca(coord, sessao, banca): Envia notificação de agendamento de banca.
        enviarNotificacaoLembreteSessaoSemana(user, sessao): Envia notificação de lembrete de sessão uma semana antes.
        enviarNotificacaoLembreteSessaoDia(user, sessao): Envia notificação de lembrete de sessão no dia anterior.
    """

    def enviarNotificacaoProposta(self, estudante_user, data):
        return
        """
        Envia notificação de proposta para orientador e coorientador.

        Args:
            estudante_user (User): O usuário do estudante que está enviando a proposta.
            data (dict): Dados da proposta contendo orientador, coorientador, tema e resumo.

        Raises:
            Usuario.DoesNotExist: Se o orientador não for encontrado.
            Exception: Para outros erros ao enviar notificações.
        """
        mensagem_orientador = Mensagem.objects.get(identificador="PROP001")
        mensagem_coorientador = Mensagem.objects.get(identificador="PROP002")
        try:
            estudante = Usuario.objects.get(user=estudante_user)
            orientador_id = data.get('orientador')
            orientador = Usuario.objects.get(id=orientador_id)

            if not orientador:
                raise Usuario.DoesNotExist("Orientador não encontrado.")

            replacements_orientador = {
                "{ORIENTADOR_NOME}": orientador.nome,
                "{ESTUDANTE_NOME}": estudante.nome,
                "{TCC_TEMA}": data['tema'],
                "{TCC_RESUMO}": data['resumo'],
            }

            corpo_email = substituirParametros(mensagem_orientador.mensagem, replacements_orientador)

            # Enviando a notificação para o orientador
            notify.send(
                estudante_user,
                recipient=orientador.user,
                verb=mensagem_orientador.notificacao,
                description=mensagem_orientador.url_destino
            )

            # Enviando e-mail para o orientador
            send_mail(subject=mensagem_orientador.assunto,
                      message= corpo_email,
                      from_email="sistema.tcc@restinga.ifrs.edu.br",
                      recipient_list=[orientador.email],
                      fail_silently=False)

            coorientador_id = data.get('coorientador')

            if coorientador_id:
                coorientador = Usuario.objects.get(id=coorientador_id)

                if coorientador:

                    replacements_coorientador = {
                        "{COORIENTADOR_NOME}": coorientador.nome,
                        "{ESTUDANTE_NOME}": estudante.nome,
                        "{TCC_TEMA}": data['tema'],
                        "{TCC_RESUMO}": data['resumo'],
                    }

                    corpo_email = substituirParametros(mensagem_coorientador.mensagem, replacements_coorientador)

                    # Enviando a notificação para o coorientador
                    notify.send(
                        estudante_user,
                        recipient=coorientador.user,
                        verb=mensagem_coorientador.notificacao,
                        description=mensagem_coorientador.url_destino
                    )
                    # Enviando e-mail para o coorientador
                    send_mail(subject=mensagem_coorientador.assunto,
                              message= corpo_email,
                              from_email="sistema.tcc@restinga.ifrs.edu.br",
                              recipient_list=[coorientador.email],
                              fail_silently=False)

        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")

    def enviarNotificacaoCadastroExterno(self, request_user, cadastro_data):
        return
        """
        Envia notificação de cadastro externo para o coordenador.

        Args:
            request_user (User): O usuário que está solicitando o cadastro.
            cadastro_data (obj): Dados do cadastro.

        Raises:
            Usuario.DoesNotExist: Se o coordenador não for encontrado.
            Exception: Para outros erros ao enviar notificações.
        """
        vinculo = "Externo"
        mensagem = Mensagem.objects.get(identificador="CAD001")
        try:
            if cadastro_data.isProfessor:
                if cadastro_data.IsInterno:
                    vinculo = "Interno"

                coord = Coordenador.objects.first()
                if not coord:
                    raise Usuario.DoesNotExist("Coordenador não encontrado.")

                replacements = {
                    "{COORDENADOR_NOME}": coord.nome,
                    "{PROFESSOR_NOME}": cadastro_data.nome,
                    "{PROFESSOR_EMAIL}": cadastro_data.email,
                    "{PROFESSOR_VINCULO}": vinculo,
                }

                corpo_email = substituirParametros(mensagem.mensagem, replacements)

                # Enviando a notificação para o orientador
                notify.send(
                    request_user,
                    recipient=coord.user,
                    verb=mensagem.notificacao,
                    description=mensagem.url_destino
                )

                # Enviando e-mail para o orientador
                send_mail(subject=mensagem.assunto,
                          message= corpo_email,
                          from_email="sistema.tcc@restinga.ifrs.edu.br",
                          recipient_list=[coord.email],
                          fail_silently=False)
        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")

    def enviarNotificacaoCadastroExternoAprovado(self, professor):
        return
        """
        Envia notificação de aprovação de cadastro externo.

        Args:
            professor (Usuario): O professor cujo cadastro foi aprovado.

        Raises:
            Exception: Para erros ao enviar notificações.
        """

        mensagem = Mensagem.objects.get(identificador="CAD002")

        replacements = {
            "{PROFESSOR_NOME}": professor.nome,
        }

        corpo_email = substituirParametros(mensagem.mensagem, replacements)

        try:
            send_mail(subject=mensagem.assunto,
                      message=corpo_email,
                      from_email="sistema.tcc@restinga.ifrs.edu.br",
                      recipient_list=[professor.email],
                      fail_silently=False)
        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")

    def enviarNotificacaoCadastroExternoNegado(self, professor, justificativa):
        return
        """
        Envia notificação de negação de cadastro externo.

        Args:
            professor (Usuario): O professor cujo cadastro foi negado.
            justificativa (str): A justificativa para a negação do cadastro.

        Raises:
            Exception: Para erros ao enviar notificações.
        """

        mensagem = Mensagem.objects.get(identificador="CAD003")

        replacements = {
            "{PROFESSOR_NOME}": professor.nome,
            "{JUSTIFICATIVA}": justificativa
        }

        corpo_email = substituirParametros(mensagem.mensagem, replacements)

        try:
            send_mail(subject=mensagem.assunto,
                      message=corpo_email,
                      from_email="sistema.tcc@restinga.ifrs.edu.br",
                      recipient_list=[professor.email],
                      fail_silently=False)
        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")

    def enviarNotificacaoAgendamentoBanca(self, coord, sessao, banca):
        return
        """
        Envia notificação de agendamento de banca.

        Args:
            coord (Usuario): O coordenador responsável pelo agendamento.
            sessao (Sessao): A sessão agendada.
            banca (Banca): A banca associada à sessão.

        Raises:
            Exception: Para erros ao enviar notificações.
        """

        mensagem_professores = Mensagem.objects.get(identificador="SESSAO002") 
        mensagem_estudante = Mensagem.objects.get(identificador="SESSAO003")

        try:
            professores = list(banca.professores.all())
            professores.append(sessao.tcc.orientador)
            if sessao.tcc.coorientador:
                professores.append(sessao.tcc.coorientador)
            professores = list(set(professor for professor in professores if professor))
            estudante = sessao.tcc.autor
            data_inicio_datetime = parse(sessao.data_inicio)

            replacements = {
                "{id}": str(sessao.tcc.id),
                "{PROFESSOR_NOME}": "",
                "{ESTUDANTE_NOME}": estudante.nome,
                "{SESSAO_DATA}": data_inicio_datetime.strftime('%d/%m/%Y'),
                "{SESSAO_HORA}": data_inicio_datetime.strftime('%H:%M:%S'),
                "{SESSAO_LOCAL}": sessao.local,
                "{SESSAO_TIPO}": sessao.get_tipo,
                "{TCC_TEMA}": sessao.tcc.tema,
            }

            notificacao = substituirParametros(mensagem_professores.notificacao, replacements)
            url_destino = substituirParametros(mensagem_professores.url_destino, replacements)
            assunto = substituirParametros(mensagem_professores.assunto, replacements)

            # Enviando a notificação para cada professor relacionado (Orientador, Coorientador e membros da banca)
            for professor in professores:
                replacements["{PROFESSOR_NOME}"] = professor.nome
                corpo_email = substituirParametros(mensagem_professores.mensagem, replacements)

                # Enviando a notificação para o professor
                notify.send(
                    coord,
                    recipient=professor.user,
                    verb=notificacao,
                    description=url_destino
                )

                # Enviando e-mail para o professor
                send_mail(
                    subject=assunto,
                    message= corpo_email,
                    from_email="sistema.tcc@restinga.ifrs.edu.br",
                    recipient_list=[professor.email],
                    fail_silently=False
                )

            notificacao = substituirParametros(mensagem_estudante.notificacao, replacements)
            url_destino = substituirParametros(mensagem_estudante.url_destino, replacements)
            assunto = substituirParametros(mensagem_estudante.assunto, replacements)
            corpo_email = substituirParametros(mensagem_estudante.mensagem, replacements)

            # Enviando a notificação para o estudante
            notify.send(
                coord,
                recipient=estudante.user,
                verb=notificacao,
                description=url_destino
            )

            # Enviando e-mail para o professor
            send_mail(
                subject=assunto,
                message=corpo_email,
                from_email="sistema.tcc@restinga.ifrs.edu.br",
                recipient_list=[estudante.email],
                fail_silently=False
            )

        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")

    def enviarNotificacaoLembreteSessaoSemana(self, user, sessao):
        return
        """
        Envia notificação de lembrete de sessão uma semana antes.

        Args:
            user (User): O usuário que está enviando a notificação.
            sessao (Sessao): A sessão para a qual o lembrete está sendo enviado.

        Raises:
            Exception: Para erros ao enviar notificações.
        """
        try:
            mensagem_professores = Mensagem.objects.get(identificador="LEMBRETE001")
            mensagem_estudante = Mensagem.objects.get(identificador="LEMBRETE002")
            banca = Banca.objects.get(sessao=sessao)
            professores = list(banca.professores.all())
            professores.append(sessao.tcc.orientador)
            if sessao.tcc.coorientador:
                professores.append(sessao.tcc.coorientador)
            professores = list(set(professor for professor in professores if professor))
            estudante = sessao.tcc.autor

            replacements = {
                "{id}": str(sessao.tcc.id),
                "{PROFESSOR_NOME}": "",
                "{ESTUDANTE_NOME}": estudante.nome,
                "{SESSAO_DATA}": sessao.data_inicio.strftime('%d/%m/%Y'),
                "{SESSAO_HORA}": sessao.data_inicio.strftime('%H:%M:%S'),
                "{SESSAO_LOCAL}": sessao.local,
                "{SESSAO_TIPO}": sessao.get_tipo,
                "{TCC_TEMA}": sessao.tcc.tema,
            }

            notificacao = substituirParametros(mensagem_professores.notificacao, replacements)
            url_destino = substituirParametros(mensagem_professores.url_destino, replacements)
            assunto = substituirParametros(mensagem_professores.assunto, replacements)

            # Enviando a notificação para cada professor relacionado (Orientador, Coorientador e membros da banca)
            for professor in professores:
                replacements["{PROFESSOR_NOME}"] = professor.nome
                corpo_email = substituirParametros(mensagem_professores.mensagem, replacements)

                # Enviando a notificação para o professor
                notify.send(
                    user,
                    recipient=professor.user,
                    verb=notificacao,
                    description=url_destino
                )

                # Enviando e-mail para o professor
                send_mail(
                    subject=assunto,
                    message=corpo_email,
                    from_email="sistema.tcc@restinga.ifrs.edu.br",
                    recipient_list=[professor.email],
                    fail_silently=False
                )

            notificacao = substituirParametros(mensagem_estudante.notificacao, replacements)
            url_destino = substituirParametros(mensagem_estudante.url_destino, replacements)
            assunto = substituirParametros(mensagem_estudante.assunto, replacements)
            corpo_email = substituirParametros(mensagem_estudante.mensagem, replacements)

            # Enviando a notificação para o estudante
            notify.send(
                user,
                recipient=estudante.user,
                verb=notificacao,
                description=url_destino
            )

            # Enviando e-mail para o professor
            send_mail(
                subject=assunto,
                message=corpo_email,
                from_email="sistema.tcc@restinga.ifrs.edu.br",
                recipient_list=[estudante.email],
                fail_silently=False
            )

        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")

    def enviarNotificacaoLembreteSessaoDia(self, user, sessao):
        return
        """
        Envia notificação de lembrete de sessão no dia anterior.

        Args:
            user (User): O usuário que está enviando a notificação.
            sessao (Sessao): A sessão para a qual o lembrete está sendo enviado.

        Raises:
            Exception: Para erros ao enviar notificações.
        """
        try:
            mensagem_professores = Mensagem.objects.get(identificador="LEMBRETE003")
            mensagem_estudante = Mensagem.objects.get(identificador="LEMBRETE004")
            banca = Banca.objects.get(sessao=sessao)
            professores = list(banca.professores.all())
            professores.append(sessao.tcc.orientador)
            if sessao.tcc.coorientador:
                professores.append(sessao.tcc.coorientador)
            professores = list(set(professor for professor in professores if professor))
            estudante = sessao.tcc.autor

            replacements = {
                "{id}": str(sessao.tcc.id),
                "{PROFESSOR_NOME}": "",
                "{ESTUDANTE_NOME}": estudante.nome,
                "{SESSAO_DATA}": sessao.data_inicio.strftime('%d/%m/%Y'),
                "{SESSAO_HORA}": sessao.data_inicio.strftime('%H:%M:%S'),
                "{SESSAO_LOCAL}": sessao.local,
                "{SESSAO_TIPO}": sessao.get_tipo,
                "{TCC_TEMA}": sessao.tcc.tema,
            }

            notificacao = substituirParametros(mensagem_professores.notificacao, replacements)
            url_destino = substituirParametros(mensagem_professores.url_destino, replacements)
            assunto = substituirParametros(mensagem_professores.assunto, replacements)

            # Enviando a notificação para cada professor relacionado (Orientador, Coorientador e membros da banca)
            for professor in professores:
                replacements["{PROFESSOR_NOME}"] = professor.nome
                corpo_email = substituirParametros(mensagem_professores.mensagem, replacements)

                # Enviando a notificação para o professor
                notify.send(
                    user,
                    recipient=professor.user,
                    verb=notificacao,
                    description=url_destino
                )

                # Enviando e-mail para o professor
                send_mail(
                    subject=assunto,
                    message=corpo_email,
                    from_email="sistema.tcc@restinga.ifrs.edu.br",
                    recipient_list=[professor.email],
                    fail_silently=False
                )

            notificacao = substituirParametros(mensagem_estudante.notificacao, replacements)
            url_destino = substituirParametros(mensagem_estudante.url_destino, replacements)
            assunto = substituirParametros(mensagem_estudante.assunto, replacements)
            corpo_email = substituirParametros(mensagem_estudante.mensagem, replacements)

            # Enviando a notificação para o estudante
            notify.send(
                user,
                recipient=estudante.user,
                verb=notificacao,
                description=url_destino
            )

            # Enviando e-mail para o professor
            send_mail(
                subject=assunto,
                message=corpo_email,
                from_email="sistema.tcc@restinga.ifrs.edu.br",
                recipient_list=[estudante.email],
                fail_silently=False
            )

        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")


def substituirParametros(text, replacements):
    return
    """
    Substitui os parâmetros no texto com os valores fornecidos.

    Args:
        text (str): O texto contendo os parâmetros a serem substituídos.
        replacements (dict): Dicionário com os parâmetros e seus respectivos valores.
    """
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text