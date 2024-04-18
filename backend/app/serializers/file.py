from rest_framework import serializers
class FileDetailSerializer(serializers.Serializer):
    url = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    def get_url(self, obj):
        if obj and hasattr(obj, 'url'):
            return obj.url
        return None

    def get_name(self, obj):
        if obj and hasattr(obj, 'name'):
            return obj.name.split("/")[-1]
        return None

    def get_size(self, obj):
        if obj and hasattr(obj, 'size'):
            return obj.size
        return None