from rest_framework import serializers

class FileDetailSerializer(serializers.Serializer):
    """
    Serializer para detalhes de arquivos.

    Atributos:
        url (SerializerMethodField): Campo que utiliza um método para obter a URL do arquivo.
        name (SerializerMethodField): Campo que utiliza um método para obter o nome do arquivo.
        size (SerializerMethodField): Campo que utiliza um método para obter o tamanho do arquivo.

    Métodos:
        get_url(obj): Retorna a URL do arquivo, se disponível.
        get_name(obj): Retorna o nome do arquivo, se disponível.
        get_size(obj): Retorna o tamanho do arquivo, se disponível.
    """
    url = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    def get_url(self, obj):
        """
        Retorna a URL do arquivo, se disponível.

        Args:
            obj: O objeto do arquivo.

        Retorna:
            str: A URL do arquivo, ou None se não disponível.
        """
        if obj and hasattr(obj, 'url'):
            return obj.url
        return None

    def get_name(self, obj):
        """
        Retorna o nome do arquivo, se disponível.

        Args:
            obj: O objeto do arquivo.

        Retorna:
            str: O nome do arquivo, ou None se não disponível.
        """
        if obj and hasattr(obj, 'name'):
            return obj.name.split("/")[-1]
        return None

    def get_size(self, obj):
        """
        Retorna o tamanho do arquivo, se disponível.

        Args:
            obj: O objeto do arquivo.

        Retorna:
            int: O tamanho do arquivo, ou None se não disponível.
        """
        if obj and hasattr(obj, 'size'):
            return obj.size
        return None