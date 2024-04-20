from app.enums import StatusTccEnum
from app.models import Professor, Estudante, Usuario, ProfessorInterno, ProfessorExterno, StatusCadastro


class UsuarioService:
    
    def criarUsuario(self, usuario, serializer):

        if(serializer.validated_data['isProfessor']):
            status = StatusCadastro.objects.create(aprovacao = False)

        if(not self.IsInterno(usuario.email)):
            status = StatusCadastro.objects.create(aprovacao=False)
            return ProfessorExterno.objects.create(
                nome = serializer.validated_data['nome'],
                cpf= serializer.validated_data['cpf'], 
                email = usuario.email,
                area = serializer.validated_data['area'],
                grau_academico = serializer.validated_data['grau'],
                titulos = serializer.validated_data['titulo'],
                identidade = serializer.validated_data.get('identidade', None),
                diploma = serializer.validated_data.get('diploma', None),
                status = status,
                user = usuario
            )

        if(serializer.validated_data['isProfessor']):
            print("User :", usuario)
            print("Email User :", usuario.email)
            status = StatusCadastro.objects.create(aprovacao=False)
            return ProfessorInterno.objects.create(
                nome = serializer.validated_data['nome'],
                cpf = serializer.validated_data['cpf'], 
                email = str(usuario.email),
                area = serializer.validated_data['area'],
                grau_academico = serializer.validated_data['grau'],
                titulos = serializer.validated_data['titulo'],
                matricula = serializer.validated_data['matricula'],
                status = status,
                user = usuario
            )
        
        return Estudante.objects.create(
            nome = serializer.validated_data['nome'],
            cpf = serializer.validated_data['cpf'], 
            email = usuario.email,
            matricula = serializer.validated_data['matricula'],
            user = usuario
        )

    def IsInterno(self, email):
        emailsInternos = ["@restinga.ifrs.edu.br", "@aluno.restinga.ifrs.edu.br"]
        return any(email.endswith(emails) for emails in emailsInternos)
        