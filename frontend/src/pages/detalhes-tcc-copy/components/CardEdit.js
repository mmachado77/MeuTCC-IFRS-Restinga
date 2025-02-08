import { useTccContext } from '../context/TccContext'; // Contexto do TCC
import StatusTag from './StatusTag'; 

const CardEdit = () => {
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

  return (
    <div className="border border-solid border-gray-300 rounded-md bg-white pb-6">
      <span>meu card</span>
    </div>
  );
};

export default CardEdit;
