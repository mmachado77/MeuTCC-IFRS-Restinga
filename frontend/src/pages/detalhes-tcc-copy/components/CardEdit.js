import { useTccContext } from '../context/TccContext'; // Contexto do TCC
import EditarForm from './EditarForm';
import StatusTag from './StatusTag'; 

const CardEdit = () => {
  const { tccData } = useTccContext();
  const { user } = useTccContext();
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
  const isCoordenador = user?.tipo === 'Coordenador';

  return (
    <div className="border border-solid border-gray-300 rounded-md bg-white p-6">
      <div className=''>
        <EditarForm
            buttonLabel="Editar TCC"
            isCoordenador={isCoordenador}
        />
      </div>  
    </div>
  );
};

export default CardEdit;
