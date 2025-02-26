import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { toast } from 'react-toastify';
import SessoesService from 'meutcc/services/SessoesService';
import { useTccContext } from 'meutcc/pages/detalhes-tcc-copy/context/TccContext';

const AvaliaPreviaAvaliador = ({ sessaoId, comment }) => {
  const [visible, setVisible] = useState(false);
  const [comentarios, setComentarios] = useState('');
  const { fetchData } = useTccContext();

  const handleOpen = () => {
    setComentarios(comment || '');
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setComentarios('');
  };

  const handleSave = async () => {
    try {
      const data = { comentarios_adicionais: comentarios };
      const response = await SessoesService.avaliarPrevia(sessaoId, data);
      await fetchData({})
      toast.success(response.message || "Avaliação salva com sucesso!");
      handleClose();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Erro ao salvar avaliação.";
      toast.error(errorMsg);
    }
  };

    const dialogFooter = (
        <div className='w-full flex justify-between'>
            <div className='w-1/4'>
                <Button
                pt={{ label: { style: { flex: 'none' } } }}
                className='w-full flex justify-center' label="Cancelar" icon="pi pi-times" severity='danger' outlined onClick={handleClose} />
            </div>
            <div className='w-1/2'>
                <Button
                pt={{ label: { style: { flex: 'none' } } }}
                className='w-full flex justify-center' label="Salvar" icon="pi pi-check" severity="warning" onClick={handleSave}/>
            </div>
        </div>
    );

  return (
    <div>
      <div className=''>
          <Button
            label="Avaliar"
            pt={{ label: { style: { flex: 'none' } } }}
            icon="pi pi-star"
            className="w-full flex justify-center items-center text-xl p-button-warning"
            onClick={handleOpen}
          />
      </div>
      <Dialog 
        header="Avaliar Sessão" 
        closeOnEscape
        pt={{
          header: { style: { padding: '0.25rem' } },
          headerTitle: { className: 'text-3xl font-bold pt-4 text-center text-gray-700' },
          content: { 
            style: { paddingRight: '2rem', paddingBottom: '1rem', paddingLeft: '2rem' }, },
          footer: { className: 'px-[2rem] pt-[0.6rem]'}
        }}
        visible={visible} 
        footer={dialogFooter} 
        onHide={handleClose}
      >
        <div className="flex pt-6 flex-col gap-2">
            <div className=''>
                <div className='p-float-label'>
                    <InputTextarea
                    id="comentarios"
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    rows={8}
                    cols={90}
                    autoResize
                    className='card -mt-1 border-2 border-dashed rounded-md shadow-md'
                    />
                    <label htmlFor="comentarios">Comentários sobre a Sessão</label>
                </div>
            </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AvaliaPreviaAvaliador;
