from enum import Enum

USUARIO_MAPA_TIPOS = {
    'Estudante': 'Estudante',
    'Professor': 'Professor',
    'ProfessorInterno': 'Professor Interno',
    'ProfessorExterno': 'Professor Externo',
    'Coordenador': 'Coordenador'
}

class UsuarioTipoEnum(Enum):
    ESTUDANTE = 'Estudante'
    PROFESSOR = 'Professor'
    PROFESSOR_INTERNO = 'ProfessorInterno'
    PROFESSOR_EXTERNO = 'ProfessorExterno'
    COORDENADOR = 'Coordenador'

    def getTipoString(self):
        if self.value not in USUARIO_MAPA_TIPOS:
            raise Exception('Tipo de usuário não mapeado!')
        return USUARIO_MAPA_TIPOS[self.value]
    
    def __eq__(self, value: object) -> bool:
        return super().__eq__(value) or self.value == value

    def __repr__(self) -> str:
        return super().__repr__()