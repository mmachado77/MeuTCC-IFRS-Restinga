import os
import json
from django.core.management.base import BaseCommand
from django.conf import settings
from app.models import Credenciais

class Command(BaseCommand):
    help = "Popula o sistema com dados de exemplo para testes locais."

    def handle(self, *args, **kwargs):
        self.stdout.write("🚀 Iniciando seed de dados para testes...\n")

        # 🔐 Criar credencial do Google Drive a partir do settings, se não existir
        if not Credenciais.objects.exists():
            creds_dict = getattr(settings, "GOOGLE_DRIVE_CREDENTIALS_JSON", None)
            if creds_dict:
                try:
                    import json
                    Credenciais.objects.create(access_token=json.dumps(creds_dict))
                    self.stdout.write(self.style.SUCCESS("✅ Credencial de Drive criada a partir do settings."))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"❌ Erro ao salvar credencial: {e}"))
            else:
                self.stdout.write(self.style.WARNING("⚠️ Nenhuma variável GOOGLE_DRIVE_CREDENTIALS_JSON encontrada."))


        # 📦 Executar testBase.py
        try:
            self.stdout.write("📂 Executando seeds/testes/testBase.py...")
            exec(open("seeds/testes/testBase.py", encoding="utf-8").read())
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Erro ao executar testBase.py: {e}"))

        # 💬 Executar mensagens.py
        try:
            self.stdout.write("💬 Executando seeds/testes/mensagens.py...")
            exec(open("seeds/testes/mensagens.py", encoding="utf-8").read())
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Erro ao executar mensagens.py: {e}"))

        self.stdout.write(self.style.SUCCESS("\n🎉 Sistema populado com sucesso para testes!"))
