from django.db import models
from . import Usuario, Curso

class Coordenador(Usuario):
    """
    Modelo que representa um Coordenador, responsável por gerenciar as atividades acadêmicas de um curso específico. Herda do modelo Usuario.

    Atributos:
        curso (ForeignKey): Curso associado ao coordenador. Relacionamento com o modelo Curso. Excluído em cascata caso o curso seja removido.
    """
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='coordenadores')

    def save(self, *args, **kwargs):
        # Verifica se o curso não foi definido
        if not self.curso:
            # Tenta obter o curso padrão, cria um novo se não existir
            curso_padrao = Curso.objects.get_or_create(
                nome="Curso Padrão",
                sigla="PAD",
                descricao="Este é um curso padrão criado automaticamente.",
            )
            self.curso = curso_padrao
        super().save(*args, **kwargs)

    class Meta:
        abstract = False
