from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import NotFound, PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Max, F, Q
from ..services.status_mapping_service import get_status_mapping
from ..services.calcular_checklist_tcc import calcular_checklist_tcc
from ..services.cta_tcc import get_cta
from app.enums import StatusTccEnum, UsuarioTipoEnum, RegraSessaoPublicaEnum
from app.models import Tcc, TccStatus, ProfessorInterno, Usuario, Estudante, Semestre, Professor, Coordenador, Sessao, Banca, Tema, Curso
from app.serializers import TccSerializer, TccCreateSerializer, TccStatusResponderPropostaSerializer, TemaSerializer, TccEditSerializer, TccPublicSerializer, DetalhesTccPublicSerializer, TCCPendentesSerializer
from app.services.proposta import PropostaService
from app.services.tcc import TccService
from app.services.notificacoes import notificacaoService
from .custom_api_view import CustomAPIView

class ListarTccPendente(CustomAPIView):
    """
    API para listar TCCs pendentes de aprovação.

    Métodos:
        get(request): Retorna os TCCs pendentes de aprovação.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna os TCCs pendentes de aprovação.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com os TCCs pendentes ou mensagem de erro.
        """
        usuario = Usuario.objects.get(user=request.user)
        semestreAtual = Semestre.objects.latest('id')
        tccs = None
        if usuario.tipo == UsuarioTipoEnum.COORDENADOR: 
            tccs = Tcc.objects.all().annotate(max_id=Max('tccstatus__id')).filter(
                tccstatus__id=F('max_id'),
                curso = usuario.curso,
                semestre=semestreAtual, 
                tccstatus__status=StatusTccEnum.PROPOSTA_ANALISE_COORDENADOR)
        elif usuario.isProfessor():
            tccs = Tcc.objects.all().annotate(max_id=Max('tccstatus__id')).filter(
                Q(orientador=usuario) | Q(coorientador=usuario),
                tccstatus__id=F('max_id'), 
                semestre=semestreAtual,
                tccstatus__status=StatusTccEnum.PROPOSTA_ANALISE_PROFESSOR
            )

        serializer = TCCPendentesSerializer(tccs, many=True)
        return Response(serializer.data)
    
class TCCs(CustomAPIView):
    """
    API para listar os TCCs de um curso.

    Esta API retorna todos os TCCs pertencentes ao curso do coordenador autenticado.

    Permissões:
        - Apenas usuários autenticados que sejam coordenadores de curso podem acessar.

    Métodos:
        - GET: Retorna todos os TCCs do curso do coordenador autenticado.

    Respostas:
        - 200 OK: Lista de TCCs do curso.
        - 403 Forbidden: Usuário não tem permissão para acessar os TCCs.
        - 404 Not Found: Coordenador ou curso não encontrados.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todos os TCCs do curso do coordenador autenticado.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Lista de TCCs do curso ou erro apropriado.
        """
        try:
            # Obtém o coordenador autenticado
            coordCurso = get_object_or_404(Coordenador, user=request.user)
            
            # Obtém o curso do coordenador
            curso = get_object_or_404(Curso, pk=coordCurso.curso.id)

            # Filtra os TCCs do curso
            tccs = Tcc.objects.filter(curso=curso)

            # Serializa os dados
            serializer = TCCPendentesSerializer(tccs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except PermissionDenied:
            return Response(
                {"detail": "Você não tem permissão para acessar esta lista de TCCs."},
                status=status.HTTP_403_FORBIDDEN
            )
        except Exception as e:
            return Response(
                {"detail": "Erro ao buscar os TCCs.", "erro": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    
class TCCsByAluno(CustomAPIView):
    """
    API para listar todos os TCCs de um aluno.

    Métodos:
        get(request): Retorna todos os TCCs do aluno autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todos os TCCs do aluno autenticado.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com todos os TCCs do aluno ou mensagem de erro.
        """
        usuario = Usuario.objects.get(user=request.user)
        tccs = Tcc.objects.filter(autor = usuario)
        
        serializer = TCCPendentesSerializer(tccs, many=True)
        return Response(serializer.data)
    

class TCCsByOrientador(CustomAPIView):
    """
    API para listar todos os TCCs relacionados ao professor autenticado.
    Isso inclui TCCs em que ele atua como orientador, coorientador ou avaliador.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todos os TCCs relacionados ao professor autenticado.
        Filtra TCCs onde:
          - o professor é orientador (campo 'orientador'),
          - o professor é coorientador (campo 'coorientador') ou
          - o professor é avaliador, isto é, consta na lista de professores da banca associada
            a alguma sessão do TCC (usando os related_names 'sessoes' em Tcc e 'bancas' em Sessao).
        """
        usuario = Usuario.objects.get(user=request.user)
        tccs = Tcc.objects.filter(
            Q(orientador=usuario) |
            Q(coorientador=usuario) |
            Q(sessoes__bancas__professores=usuario)
        ).distinct()

        serializer = TCCPendentesSerializer(tccs, many=True)
        return Response(serializer.data)


    
class PossuiProposta(CustomAPIView):
    """
    API para verificar se um estudante possui proposta de TCC.

    Métodos:
        get(request): Verifica se o estudante autenticado possui proposta de TCC.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Verifica se o estudante autenticado possui proposta de TCC.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com a verificação ou mensagem de erro.
        """
        usuario = Estudante.objects.get(user=request.user)
        possuiProposta = TccService().possuiProposta(usuario)
        
        return Response({'possuiProposta': possuiProposta})
        
class CriarTCCView(CustomAPIView):
    """
    API para criar um novo TCC.

    Métodos:
        post(request): Cria um novo TCC.
    """
    permission_classes = [IsAuthenticated]
    tccService = TccService()
    notificacaoService = notificacaoService()

    def post(self, request):
        """
        Cria um novo TCC.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP confirmando a criação ou mensagem de erro.
        """
        
        # Validar "afirmo que conversei com o orientador e coorientador sobre o tema do TCC."
        try:
            usuario = Estudante.objects.get(user=request.user)
            curso = usuario.curso  # Obtém o curso do estudante autenticado
            
            # Criar um dicionário mutável para adicionar o curso ao payload
            dados_tcc = request.data.copy()
            dados_tcc['curso'] = curso.id  # Adiciona o ID do curso ao payload
            
            serializer = TccCreateSerializer(data=dados_tcc)

            if not serializer.is_valid():
                print (serializer.errors)
                return Response(serializer.errors, status=400) 
            
            if not request.data.get('afirmoQueConversei'):
                return Response({'message': 'Você deve afirmar que conversou com o orientador e coorientador sobre o tema do TCC.'}, status=400) 
                
            self.tccService.criarTcc(usuario, serializer)
            self.notificacaoService.enviarNotificacaoProposta(request.user, request.data)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Estudante.DoesNotExist:
            return Response({'status': 'error', 'message': 'Usuário não é um estudante!'}, status=403)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=400)
        

class TccStatusResponderPropostaView(CustomAPIView):
    """
    API para responder a uma proposta de TCC.

    Métodos:
        post(request, tccId): Responde a uma proposta de TCC.
    """
    permission_classes = [IsAuthenticated]
    propostaService = PropostaService()

    def post(self, request, tccId):
        """
        Responde a uma proposta de TCC.

        Args:
            request (Request): A requisição HTTP.
            tccId (int): ID do TCC.

        Retorna:
            Response: Resposta HTTP confirmando a resposta ou mensagem de erro.
        """
        serializer = TccStatusResponderPropostaSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        usuario = Usuario.objects.get(user=request.user)

        self.propostaService.responderProposta(tccId, usuario, serializer)
        
        return Response({'status': 'success', 'message': 'Status atualizado com sucesso!'})


class EditarTCCView(CustomAPIView):
    """
    API para editar um TCC existente com suporte a PATCH.
    """

    permission_classes = [IsAuthenticated]

    def patch(self, request, tccid):
        """
        Edita parcialmente um TCC existente.
        """
        try:
            # Recupera o TCC pelo ID
            tcc = Tcc.objects.get(id=tccid)
        except Tcc.DoesNotExist:
            return Response({'detail': 'TCC não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        # Obtém o perfil do usuário logado
        try:
            usuario = Usuario.objects.get(user=request.user)
        except Usuario.DoesNotExist:
            return Response(
                {'detail': 'Perfil de usuário não encontrado.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verifica permissões de edição
        if usuario.id == tcc.autor.id or usuario.id == tcc.orientador.id:
            # Permite apenas edição de "tema" e "resumo" para autores e orientadores
            allowed_fields = {"tema", "resumo"}
        elif usuario.tipo == UsuarioTipoEnum.COORDENADOR:
            # Coordenadores podem editar todos os campos
            allowed_fields = {"tema", "resumo", "orientador", "coorientador"}
        else:
            # Caso não seja autor, orientador ou coordenador
            return Response(
                {'detail': 'Você não tem permissão para editar este TCC.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Filtra o payload para incluir apenas os campos permitidos
        filtered_data = {key: value for key, value in request.data.items() if key in allowed_fields}

        # Serializa os dados recebidos
        serializer = TccEditSerializer(instance=tcc, data=filtered_data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(
                {'status': 'success', 'message': 'TCC atualizado com sucesso.', 'data': serializer.data},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DetalhesTCCView(CustomAPIView):
    """
    API para visualizar os detalhes de um TCC.

    Permite acesso público com dados limitados e acesso completo para usuários relacionados.

    Métodos:
        get(request, tccid, format=None): Retorna os detalhes de um TCC.
    """
    permission_classes = [AllowAny]

    def get(self, request, tccid, format=None):
        """
        Retorna os detalhes de um TCC.

        Args:
            request (Request): A requisição HTTP.
            tccid (int): ID do TCC.

        Retorna:
            Response: Resposta HTTP com os detalhes do TCC (completo para usuários relacionados,
                      limitado para demais usuários).
        """
        bancas = []
        users_banca = []

        try:
            # Busca o TCC pelo ID
            tcc = Tcc.objects.get(id=tccid)
        except Tcc.DoesNotExist:
            return Response({'status': 'error', "message": "TCC não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Obtém o último status do TCC
        ultimo_status = TccStatus.objects.filter(tcc=tcc).order_by('-dataStatus').first()
        status_atual = ultimo_status.status if ultimo_status else None

        # Determina as flags concluído e reprovado
        concluido = status_atual in StatusTccEnum.statusTccConcluido()
        reprovado = status_atual in StatusTccEnum.statusTccCancelado()

        user = request.user
        if user.is_authenticated:
            coord = Coordenador.objects.filter(user=user)

            # Verifica se o usuário está relacionado ao TCC
            if (str(user) == 'admin') or (user == tcc.autor.user) or (user == tcc.orientador.user) or (
                tcc.coorientador and user == tcc.coorientador.user) or (coord.exists()):
                # Usuário relacionado ao TCC - retorna detalhes completos
                serializer = TccSerializer(tcc)
                data = serializer.data
                data.update({'concluido': concluido, 'reprovado': reprovado})
                return Response(data, status=status.HTTP_200_OK)

            # Verifica se o usuário faz parte da banca
            if Sessao.objects.filter(tcc=tcc).exists():
                sessoes = Sessao.objects.filter(tcc=tcc)
                for sessao in sessoes:
                    if Banca.objects.filter(sessao=sessao).exists():
                        bancas.append(Banca.objects.get(sessao=sessao))
                for banca in bancas:
                    for professor in banca.professores.all():
                        users_banca.append(professor.user)

            if user in users_banca:
                serializer = TccSerializer(tcc)
                data = serializer.data
                data.update({'concluido': concluido, 'reprovado': reprovado})
                return Response(data, status=status.HTTP_200_OK)

        # Verifica se o status permite acesso público
        if status_atual in [StatusTccEnum.FINAL_AGENDADA, StatusTccEnum.APROVADO]:
            serializer = DetalhesTccPublicSerializer(tcc)
            data = serializer.data
            data.update({'concluido': concluido, 'reprovado': reprovado})
            return Response(data, status=status.HTTP_200_OK)

        # Caso contrário, retorna uma mensagem de permissão negada
        return Response({'status': 'alert', "message": "Você não tem permissão para visualizar este TCC."},
                        status=status.HTTP_403_FORBIDDEN)



            
class TCCsPublicadosView(CustomAPIView):
    """
    API para listar todos os TCCs aprovados.

    Esta view retorna apenas os dados públicos dos TCCs que foram aprovados
    para exibição na página inicial ou em outras áreas públicas do sistema.

    Permissões:
        - Qualquer usuário (autenticado ou não) pode acessar esta view.

    Métodos:
        get(request): Retorna uma lista de TCCs aprovados com dados públicos.

    Args:
        request (Request): A requisição HTTP.

    Retorna:
        Response: Uma lista de TCCs aprovados com os campos especificados no
        serializer público (TccPublicSerializer).
    """

    permission_classes = [AllowAny]  # Permite acesso público

    def get(self, request):
        """
        Retorna uma lista de TCCs aprovados.

        Recupera os TCCs que possuem o status de "Aprovado" no sistema e os serializa
        utilizando o TccPublicSerializer, que retorna apenas os campos públicos.

        Retorna:
            Response: JSON com os dados públicos dos TCCs aprovados.
        """
        try:
            # Filtra os TCCs com status "Aprovado"
            tccs = Tcc.objects.filter(tccstatus__status=StatusTccEnum.APROVADO)
            
            # Serializa os TCCs utilizando o serializer público
            serializer = TccPublicSerializer(tccs, many=True)
            
            # Retorna a resposta com os dados serializados
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            # Trata possíveis erros na execução
            return Response(
                {'detail': 'Erro ao listar os TCCs aprovados.', 'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TemasSugeridosView(CustomAPIView):
    """
    API para listar os temas sugeridos filtrados pelo curso do usuário.

    Métodos:
        get(request): Retorna os temas sugeridos filtrados conforme o tipo de usuário.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna os temas sugeridos conforme o curso do usuário.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com os temas sugeridos filtrados.
        """
        # Recupera a instância do usuário customizado a partir do usuário autenticado.
        usuario = Usuario.objects.get(user=request.user)
        temas = Tema.objects.none()  # Inicializa sem temas

        if usuario.tipo == UsuarioTipoEnum.ESTUDANTE:
            # Se for estudante, pega os temas do curso do estudante.
            estudante = Estudante.objects.filter(user=request.user).first()
            if estudante:
                temas = Tema.objects.filter(curso=estudante.curso)

        elif usuario.tipo == UsuarioTipoEnum.COORDENADOR:
            # Se for coordenador, pega os temas do curso que coordena.
            coordenador = Coordenador.objects.filter(user=request.user).first()
            if coordenador:
                temas = Tema.objects.filter(curso=coordenador.curso)

        elif usuario.tipo == UsuarioTipoEnum.PROFESSOR_INTERNO:
            # Se for professor, pega os temas de todos os cursos em que ele atua.
            professor = ProfessorInterno.objects.filter(user=request.user).first()
            if professor:
                temas = Tema.objects.filter(curso__in=professor.cursos.all())

        serializer = TemaSerializer(temas, many=True)
        return Response(serializer.data)


class MeusTemasSugeridosView(CustomAPIView):
    """
    API para listar todos os temas sugeridos por um professor.

    Métodos:
        get(request): Retorna todos os temas sugeridos pelo professor autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todos os temas sugeridos pelo professor autenticado.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com todos os temas sugeridos pelo professor ou mensagem de erro.
        """
        # Recupera o usuário customizado a partir do request.
        professor = Usuario.objects.get(user=request.user)
        temas = Tema.objects.filter(professor=professor)
        serializer = TemaSerializer(temas, many=True)
        return Response(serializer.data)

    
class CriarTemaView(CustomAPIView):
    """
    API para criar um novo tema.

    Métodos:
        post(request): Cria um novo tema.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Cria um novo tema.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP confirmando a criação ou mensagem de erro.
        """
        perfil = request.user.perfil
        if isinstance(perfil, Coordenador) or isinstance(perfil, Professor):
            usuario_id = request.user.id
        else:
            return Response(
                {'status': 'error', "message": "Usuário não autorizado para criar um tema."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Copia os dados enviados na requisição
        dados = request.data.copy()

        # Se o campo 'curso' for um objeto (dict) com os dados do curso, extrai o seu id.
        if 'curso' in dados and isinstance(dados['curso'], dict):
            curso_obj = dados.get('curso')
            dados['curso'] = curso_obj.get('id')

        # Preenche o campo professor com o usuário autenticado (assumindo que request.user seja uma instância de Usuario)
        dados['professor'] = usuario_id

        serializer = TemaSerializer(data=dados, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AtualizarTemaView(CustomAPIView):
    """
    API para atualizar um tema existente.

    Métodos:
        put(request, pk): Atualiza um tema existente.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        """
        Atualiza um tema existente.

        Args:
            request (Request): A requisição HTTP.
            pk (int): ID do tema.

        Retorna:
            Response: Resposta HTTP confirmando a atualização ou mensagem de erro.
        """
        try:
            tema = Tema.objects.get(pk=pk)
        except Tema.DoesNotExist:
            return Response({'status': 'error', "message": "Erro no servidor ao tentar encontrar tema."}, status=status.HTTP_404_NOT_FOUND)

        if tema.professor.user != request.user and not isinstance(request.user.perfil, Coordenador):
            return Response({'status': 'error', "message": "Usuário não autorizado.", "usuario": request.user}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = TemaSerializer(tema, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExcluirTemaView(CustomAPIView):
    """
    API para excluir um tema existente.

    Métodos:
        delete(request, pk): Exclui um tema existente.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        """
        Exclui um tema existente.

        Args:
            request (Request): A requisição HTTP.
            pk (int): ID do tema.

        Retorna:
            Response: Resposta HTTP confirmando a exclusão ou mensagem de erro.
        """
        try:
            tema = Tema.objects.get(pk=pk)
        except Tema.DoesNotExist:
            return Response({'status': 'error', "message": "Tema não encontrado no sistema."}, status=status.HTTP_404_NOT_FOUND)

        if tema.professor.user != request.user and not isinstance(request.user.perfil, Coordenador):
            return Response({'status': 'error', "message": "Usuário não autorizado."}, status=status.HTTP_401_UNAUTHORIZED)

        tema.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class TccProximosPassos(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Espera-se um DTO com, ao menos, o ID do TCC.
        tccid = request.data.get("tccid")
        if not tccid:
            return Response(
                {'status': 'error', "message": "TCC ID não fornecido."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Encontra o objeto Tcc
        try:
            tcc = Tcc.objects.get(id=tccid)
        except Tcc.DoesNotExist:
            return Response(
                {'status': 'error', "message": "TCC não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Busca o status atual do TCC (o mais recente, ordenado por dataStatus)
        status_atual = TccStatus.objects.filter(tcc=tcc).order_by('-dataStatus').first()
        if not status_atual:
            return Response(
                {'status': 'error', "message": "Status do TCC não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            curso = Curso.objects.get(id=tcc.curso.id)
        except Curso.DoesNotExist:
            return Response(
                {'status': 'error', "message": "Curso não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtém a regra de sessão do curso e converte para o enum adequado.
        try:
            regra_sessao = RegraSessaoPublicaEnum(curso.regra_sessao_publica)
        except ValueError:
            return Response(
                {'status': 'error', "message": "Regra de sessão inválida no curso."},
                status=status.HTTP_400_BAD_REQUEST
            )
        status_objects = TccStatus.objects.filter(tcc=tcc)
        for status_obj in status_objects:
            if status_obj.status == StatusTccEnum.PREVIA_ORIENTADOR:
                regra_sessao = RegraSessaoPublicaEnum.OBRIGATORIO
                break

        # Obtém o mapping de status para o TCC conforme a regra do curso
        mapping = get_status_mapping(regra_sessao)
        
        # Determina o status e a mensagem do status atual, bem como o próximo status obrigatório
        current_status_value = status_atual.status  # Ex: "DESENVOLVIMENTO"
        current_index = None
        current_message = ""
        instrucoes = None

        for item in mapping:
            if item["status"] == current_status_value:
                current_index = item["index"]
                current_message = item.get("mensagem", None)
                break

        if current_index is not None:
            for item in mapping:
                if item["index"] > current_index and item["required"]:
                    instrucoes = item.get("instrucoes", None)
                    break
        # Sinaliza se o status atual for 'DESENVOLVIMENTO' e a sessão prévia for opcional (Regra OPCIONAL)
        previa_opcional = False
        if status_atual.status == StatusTccEnum.DESENVOLVIMENTO and regra_sessao == RegraSessaoPublicaEnum.OPCIONAL:
            previa_opcional = True
        
        checklist = calcular_checklist_tcc(tcc)

        try:
            cta_result = get_cta(checklist, status_atual) or {}  # Garante que cta_result é um dicionário
            cta_key = cta_result.get("chave")  # Acessa diretamente as chaves sem nível extra
            cta_value = cta_result.get("valor")
        except Exception as e:
            # Log do erro inesperado para facilitar o debug
            print(f"Erro inesperado: {e}")
            cta_key = None
            cta_value = None
        # Monta e retorna a resposta, incluindo a mensagem do status atual, as instruções do próximo status e o checklist
        return Response({
            "status_atual": {
                "status": status_atual.status,
                "dataStatus": status_atual.dataStatus,
                "mensagem": current_message,
                "instrucoes": instrucoes,
            },
            "previa_opcional": previa_opcional,
            "checklist": checklist,
            "cta": {
                "chave": cta_key,
                "valor": cta_value
            }
            }, status=status.HTTP_200_OK)
