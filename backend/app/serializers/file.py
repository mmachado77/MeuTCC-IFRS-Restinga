from rest_framework import serializers
import json

class FileDetailSerializer(serializers.Serializer):
    dataModificacao = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()  # Adicionado o campo "id"

    def get_dataModificacao(self, obj):
        if isinstance(obj, str):
            try:
                parsed = json.loads(obj)
                return parsed.get("dataModificacao", None)
            except Exception:
                return None
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
    
    def get_id(self, obj):
        if isinstance(obj, str):
            try:
                parsed = json.loads(obj)
                return parsed.get("id", None)
            except Exception:
                return None
        return getattr(obj, "id", None)
