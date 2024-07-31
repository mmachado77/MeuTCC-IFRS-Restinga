from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework import exceptions

def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is not None:
        if isinstance(exc, exceptions.NotFound):
            response.data = {'mensagem': 'O recurso solicitado não foi encontrado.'}
        elif isinstance(exc, exceptions.PermissionDenied):
            response.data = {'mensagem': 'Você não tem permissão para realizar esta ação.'}
        elif isinstance(exc, exceptions.ValidationError):
            response.data = {'mensagem': 'Os dados enviados são inválidos.'}
        elif isinstance(exc, exceptions.AuthenticationFailed):
            response.data = {'mensagem': 'Falha na autenticação.'}
        elif isinstance(exc, exceptions.NotAuthenticated):
            response.data = {'mensagem': 'Autenticação necessária.'}
        elif isinstance(exc, exceptions.ParseError):
            response.data = {'mensagem': 'Erro ao analisar a solicitação.'}
        elif isinstance(exc, exceptions.MethodNotAllowed):
            response.data = {'mensagem': 'Método HTTP não permitido.'}
        elif isinstance(exc, exceptions.NotAcceptable):
            response.data = {'mensagem': 'O cliente não aceita as representações de conteúdo disponíveis.'}
        elif isinstance(exc, exceptions.UnsupportedMediaType):
            response.data = {'mensagem': 'Tipo de mídia não suportado.'}
        elif isinstance(exc, exceptions.Throttled):
            response.data = {'mensagem': 'Excedeu a taxa de solicitações permitida.'}
        else:
            response.data = {'mensagem': 'Ocorreu um erro inesperado.'}

        response.data['status_code'] = response.status_code

    return response