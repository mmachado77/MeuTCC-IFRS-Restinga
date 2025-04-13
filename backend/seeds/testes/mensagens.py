from app.models import Mensagem

# ==========================
# 💬 Criação de Mensagens
# ==========================

mensagens = [
    ("PROP001", "[Meus TCCs - Restinga] Nova solicitação de orientação", "Notificação de nova proposta para o orientador", "/proposta-pendente", "Você recebeu uma solicitação de orientação"),
    ("PROP002", "[Meus TCCs - Restinga] Nova solicitação de coorientação", "Notificação de nova proposta para o coorientador", "/proposta-pendente", "Você recebeu uma solicitação de coorientação"),
    ("CAD001", "[Meus TCCs - Restinga] Nova solicitação de cadastro", "Notificação de novo cadastro para o coordenador", "/atualizar-permissoes", "Há uma nova solicitação de cadastro aguardando aprovação"),
    ("CAD002", "[Meus TCCs - Restinga] Solicitação de cadastro aprovada", "Notificação de cadastro aprovado para o professor", None, None),
    ("CAD003", "[Meus TCCs - Restinga] Solicitação de cadastro negada", "Notificação de cadastro negado para o professor", None, None),
]

for identificador, assunto, descricao, url, notificacao in mensagens:
    Mensagem.objects.create(
        identificador=identificador,
        assunto=assunto,
        mensagem="(corpo completo omitido para simplificação)",
        descricao=descricao,
        url_destino=url,
        notificacao=notificacao
    )

print("Mensagens criadas com sucesso!")