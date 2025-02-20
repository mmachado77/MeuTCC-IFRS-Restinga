import React, { useRef } from 'react';
import { useTccContext } from './context/TccContext';
import FileItemTCC from './components/FileItemTCC';
import CardTccDetalhes from './components/CardTccDetalhes';
import CardProximoPassos from './components/CardProximoPassos';
import SessoesDetalhes from './components/SessoesDetalhes';

const MontaTela = () => {
  const { tccData, user, updateTccDetails, sessaoPrevia, sessaoFinal } = useTccContext();
  const isEditable =
    user &&
    tccData &&
    ((user.tipo === 'Coordenador' && user.curso === tccData?.curso?.id) ||
      (user.id && tccData.autor?.id && user.id === tccData.autor.id) ||
      (user.id && tccData.orientador?.id && user.id === tccData.orientador.id));

  // Cria a ref para acessar os métodos do FileItemTCC
  const fileItemRef = useRef(null);


  return (
    <div className="p-4 max-w-screen-lg mx-auto bg-white my-6 rounded-lg">
      <div className="flex gap-4">
        <div className="w-3/5">
          <CardTccDetalhes isEditable={isEditable} />
        </div>
        <div className="w-2/5 flex flex-col gap-4">
          {isEditable && (
            <CardProximoPassos
              tccId={tccData?.id}
              isEditable={isEditable}
              fileItemRef={fileItemRef} // Passa a ref para o CardProximoPassos/ProximaEtapa
            />
          )}
          <FileItemTCC
            ref={fileItemRef}
            file={tccData?.documentoTCC}
            tccId={tccData?.id}
            prazoEntrega=""
            user={user}
            isEditable={isEditable}
            updateTccDetails={updateTccDetails}
          />
        </div>
      </div>
      {(sessaoPrevia || sessaoFinal) && (
        <SessoesDetalhes sessaoPrevia={sessaoPrevia} sessaoFinal={sessaoFinal} />
      )}

    </div>
  );
};

export default MontaTela;
