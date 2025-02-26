import React from 'react';
import { useTccContext } from '../context/TccContext'; // Contexto do TCC
import { InputTextarea } from 'primereact/inputtextarea';
import StatusTag from './StatusTag'; // Componente existente
import EditarForm from './EditarForm'; // Componente existente
import FileItemTCC from './FileItemTCC';
import { updateDetalhesTCC } from '../services/TccService';

const DetalhesHeader = () => {
    const { tccData, user, updateTccDetails } = useTccContext();

    // Desestruturação dos dados, incluindo o arquivo do TCC (documentoTCC)
    const { 
        id,
        tema, 
        autor, 
        curso, 
        orientador, 
        coorientador, 
        semestre, 
        resumo, 
        dataSubmissaoProposta, 
        status,
        documentoTCC 
    } = tccData || {};

    // Verificar se o usuário é coordenador
    const isCoordenador = user?.tipo === 'Coordenador';

    // Verificar se o usuário pode editar
    const isEditAllowed =
        isCoordenador || 
        user?.id === tccData?.autor?.id || 
        user?.id === tccData?.orientador?.id;

    return (
        <div className="bg-white shadow rounded-lg max-w-5xl mx-auto p-6 text-lg">
            {/* Título e Status */}
            <div className="flex justify-between items-center mb-4">
                {/* Aumenta o título para text-3xl */}
                <h1 className="text-left text-gray-700 text-2xl font-bold flex-1">
                    {tema || 'Título do TCC'}
                </h1>
                <div className="flex items-center gap-4">
                    {/* Aumenta o tamanho do texto do StatusTag para text-xl */}
                    <StatusTag
                        status={status?.[status.length - 1]?.statusMensagem || 'Indefinido'}
                        className="px-4 py-2 text-xl"
                    />
                </div>
            </div>

            {/* Informações Principais e Botão Editar */}
            <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col text-start">
  <p className="text-gray-600">
    <span className="font-bold">Aluno: </span>{autor?.nome || 'Não definido'}<br />
    <span className="font-bold">Curso: </span>{curso?.nome || 'Não definido'}<br />
    <span className="inline-flex gap-8">
      <span>
        <span className="font-bold">Orientador: </span>{orientador?.nome || 'Não definido'}
      </span>
      {coorientador?.nome && (
        <span>
          <span className="font-bold">Coorientador: </span>{coorientador.nome}
        </span>
      )}
    </span>
    <br />
    <span className="inline-flex gap-8">
      <span>
        <span className="font-bold">Semestre: </span>{semestre?.periodo || 'Não definido'}
      </span>
      <span>
        <span className="font-bold">Data de Submissão: </span>
        {dataSubmissaoProposta ? new Date(dataSubmissaoProposta).toLocaleDateString() : 'Não definida'}
      </span>
    </span>
  </p>
</div>


                {isEditAllowed && (
                    <div className='w-1/4 min-h-[100%]'>
                        <EditarForm
                            buttonLabel="Agendar Banca Prévia"
                            buttonClassName="p-button-rounded p-button-success w-full h-full px-6"
                            isCoordenador={isCoordenador}
                        />
                    </div>
                )}
            </div>

            {/* Resumo e Arquivo */}
            <div className="mt-4 flex justify-between">
                <div className="w-4/5">
                    <InputTextarea 
                        value={resumo || 'Nenhum resumo fornecido.'} 
                        readOnly 
                        style={{ minWidth: '100%', minHeight: '250px' }} 
                    />
                </div>
                <div className="ml-4 w-1/5 flex flex-col justify-between h-stretch">
                    <FileItemTCC 
                        file={documentoTCC} 
                        tccId={id} 
                        prazoEntrega=""
                        user={user}
                        updateTccDetails={updateTccDetails}
                    />
                </div>
            </div>
        </div>
    );
};

export default DetalhesHeader;
