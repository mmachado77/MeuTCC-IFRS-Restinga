import { useTccContext } from '../context/TccContext'; // Contexto do TCC
import CardEdit from './CardEdit';

const CardTccDetalhes = ({isEditable}) => {
  const { tccData } = useTccContext();
  const {
    tema,
    autor,
    curso,
    orientador,
    coorientador,
    semestre,
    resumo,
    dataSubmissaoProposta,
    status
  } = tccData || {};

  // Ajustes de nomenclatura
  const aluno = autor?.nome;
  const nomeCurso = curso?.nome;
  const nomeOrientador = orientador?.nome;
  const nomeCoorientador = coorientador?.nome;
  const periodoSemestre = semestre?.periodo;

  // Se status é um array, pegamos o último registro para exibir como 'status atual'
  const statusAtual = status?.length
    ? status[status.length - 1].statusMensagem
    : null;

  // Formata data de submissão (dd/mm/aaaa)
  const dataSubmissao = dataSubmissaoProposta
    ? new Date(dataSubmissaoProposta).toLocaleDateString('pt-BR')
    : null;

  return (
    <div className="border border-solid border-gray-300 rounded-md bg-white pb-6">
      {/* Título */}
      <div className='px-6 pt-6'>
        <span className="text-2xl font-bold text-gray-700">
          {tema || 'Título do TCC'}
        </span>
      </div>
      {/* Linha pontilhada */}
      <hr className="border-dashed border-gray-300 w-full mb-4" />

      <div className='text-gray-600 px-6'>
        {/* Itens de detalhes */}

        <span className="mb-2 block">
          <span className="font-bold">Autor: </span>
          {aluno || 'Não definido'}
        </span>

        <span className="mb-2 block">
          <span className="font-bold">Curso: </span>
          {nomeCurso || 'Não definido'}
        </span>

        <span className="flex justify-between mb-2 block">
          <span>
            <span className="font-bold">Orientador: </span>
            {nomeOrientador || 'Não definido'}
          </span>
          {nomeCoorientador && (
            <span>
              <span className="font-bold">Coorientador: </span>
              {nomeCoorientador}
            </span>
          )}
        </span>

        <span className="flex justify-between mb-6 block">
          <span>
            <span className="font-bold">Semestre: </span>
            {periodoSemestre || 'Não definido'}
          </span>
          <span>
            <span className="font-bold">Data de Submissão: </span>
            {dataSubmissao || 'Não definida'}
          </span>
        </span>

        {/* Subtítulo Resumo */}
        <span className="font-semibold text-gray-600 mb-2 block text-justify">
          Resumo:
        </span>

        <span className="text-gray-700 leading-relaxed">
          {resumo || 'Nenhum resumo fornecido.'}
        </span>
        {isEditable &&(
        <div className='flex justify-end'>
          <CardEdit />
        </div>
        )}
      </div>
      
    </div>
  );
};

export default CardTccDetalhes;
