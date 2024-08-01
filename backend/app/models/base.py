from django.db import models


class BaseModel (models.Model):
    """
    Modelo base abstrato para ser herdado por outros modelos do aplicativo.

    Meta:
        abstract (Boolean): Indica se este modelo é abstrato. Definido como True, o que significa que este modelo não criará uma tabela no banco de dados.
        app_label (str): Define o rótulo do aplicativo ao qual este modelo pertence.
    """
    class Meta:
        abstract = True
        app_label = 'app'