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
      <div className='w-2/6'>
        <EditarForm
            buttonLabel="Editar TCC"
            isCoordenador={isCoordenador}
        />
      </div>  
  );
};

export default CardEdit;
