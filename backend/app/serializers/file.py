from rest_framework import serializers
import json

class FileDetailSerializer(serializers.Serializer):
    """
    Serializer para detalhes de arquivos.

    Atributos:
        dataModificacao (SerializerMethodField): Obtém a data de modificação do arquivo, definida no momento do upload.
        name (SerializerMethodField): Obtém o nome do arquivo.
        size (SerializerMethodField): Obtém o tamanho do arquivo.
    
    Métodos:
        get_dataModificacao(obj): Retorna a data de modificação do arquivo, extraída do JSON armazenado.
        get_name(obj): Retorna o nome do arquivo, extraído do JSON armazenado ou do atributo 'name' caso obj não seja uma string.
        get_size(obj): Retorna o tamanho do arquivo, extraído do JSON armazenado ou do atributo 'size' caso obj não seja uma string.
    """
    dataModificacao = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    def get_dataModificacao(self, obj):
        if isinstance(obj, str):
            try:
                parsed = json.loads(obj)
                return parsed.get("dataModificacao", None)
            except Exception:
                return None
        # Se não for string (por exemplo, FieldFile), não há data de modificação armazenada
        return None

    def get_name(self, obj):
        if isinstance(obj, str):
            try:
                parsed = json.loads(obj)
                return parsed.get("name", None)
            except Exception:
                return None
        return getattr(obj, "name", None)

    def get_size(self, obj):
        if isinstance(obj, str):
            try:
                parsed = json.loads(obj)
                return parsed.get("size", None)
            except Exception:
                return None
        return getattr(obj, "size", None)
