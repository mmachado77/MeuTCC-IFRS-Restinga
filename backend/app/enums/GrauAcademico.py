from enum import Enum

class GrauAcademico(Enum):
    TECNICO = 'Técnico'
    GRADUACAO = 'Graduação'
    POSGRADUACAO = 'Pós-Graduação'
    MESTRADO = 'Mestrado'
    DOUTORADO = 'Doutorado'
    POSDOUTORADO = 'Pós-Doutorado'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]