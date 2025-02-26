import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { toast } from 'react-toastify';
import SessoesService from 'meutcc/services/SessoesService';
import { useTccContext } from 'meutcc/pages/detalhes-tcc-copy/context/TccContext';

const AvaliaPreviaOrientador = ({ sessaoId, comment, avaliar }) => {
  const [visible, setVisible] = useState(false);
  const [comentarios, setComentarios] = useState('');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showDisapproveDialog, setShowDisapproveDialog] = useState(false);
  const { fetchData } = useTccContext();

  const handleOpen = () => {
    setComentarios(comment || '');
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setComentarios('');
  };

  const handleApprove = async () => {
    try {
      const data = { 
        parecer_orientador: comentarios, 
        resultado_previa: 'true' 
      };
      const response = await SessoesService.avaliarPrevia(sessaoId, data);
      await fetchData({});
      toast.success(response.message || "Avaliação aprovada com sucesso!");
      setShowApproveDialog(false);
      handleClose();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Erro ao salvar avaliação.";
      toast.error(errorMsg);
      setShowApproveDialog(false);
    }
  };

  const handleDisapprove = async () => {
    try {
      const data = { 
        parecer_orientador: comentarios, 
        resultado_previa: 'false' 
      };
      const response = await SessoesService.avaliarPrevia(sessaoId, data);
      await fetchData({});
      toast.success(response.message || "Avaliação registrada com reprovação!");
      setShowDisapproveDialog(false);
      handleClose();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Erro ao salvar avaliação.";
      toast.error(errorMsg);
      setShowDisapproveDialog(false);
    }
  };

  const mainDialogFooter = (
    <div className="w-full flex justify-between gap-32">
        <Button
          pt={{ label: { style: { flex: 'none' } } }}
          className="w-1/3 flex justify-center" 
          label="Reprovar" 
          icon="pi pi-ban" 
          severity="danger" 
          onClick={() => setShowDisapproveDialog(true)}
        />
        <Button
          pt={{ label: { style: { flex: 'none' } } }}
          className="w-2/3 flex justify-center" 
          label="Aprovar" 
          icon="pi pi-check" 
          severity="success" 
          onClick={() => setShowApproveDialog(true)}
        />
    </div>
  );

  const approveDialogFooter = (
    <div className="w-full flex justify-between">
      <div className="w-1/2">
        <Button 
          pt={{ label: { style: { flex: 'none' } } }}
          className="w-full flex justify-center" 
          label="Cancelar" 
          icon="pi pi-times" 
          severity="danger" 
          outlined 
          onClick={() => setShowApproveDialog(false)}
        />
      </div>
      <div className="w-1/2">
        <Button 
          pt={{ label: { style: { flex: 'none' } } }}
          className="w-full flex justify-center" 
          label="Confirmar" 
          icon="pi pi-check" 
          severity="success" 
          onClick={handleApprove}
        />
      </div>
    </div>
  );

  const disapproveDialogFooter = (
    <div className="w-full flex justify-between">
      <div className="w-1/2">
        <Button 
          pt={{ label: { style: { flex: 'none' } } }}
          className="w-full flex justify-center" 
          label="Cancelar" 
          icon="pi pi-times" 
          severity="danger" 
          outlined 
          onClick={() => setShowDisapproveDialog(false)}
        />
      </div>
      <div className="w-1/2">
        <Button 
          pt={{ label: { style: { flex: 'none' } } }}
          className="w-full flex justify-center" 
          label="Confirmar" 
          icon="pi pi-check" 
          severity="warning" 
          onClick={handleDisapprove}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Button
        label="Avaliar Sessão"
        pt={{ label: { style: { flex: 'none' } } }}
        icon="pi pi-star"
        className="w-full flex justify-center items-center text-xl p-button-warning"
        onClick={handleOpen}
        disabled={!avaliar}
      />

      <Dialog
        header="Avaliar Sessão (Orientador)"
        closeOnEscape
        pt={{
          header: { style: { padding: '0.25rem' } },
          headerTitle: { className: 'text-3xl font-bold pt-4 text-center text-gray-700' },
          content: { style: { padding: '2rem 2rem 1rem 2rem' } },
          footer: { className: 'px-[2rem] pt-[0.6rem]' }
        }}
        visible={visible}
        footer={mainDialogFooter}
        onHide={handleClose}
      >
        <div className="flex pt-6 flex-col gap-2">
          <div>
            <div className="p-float-label">
              <InputTextarea
                id="comentarios"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                rows={8}
                cols={90}
                autoResize
                className="card -mt-1 border-2 border-dashed rounded-md shadow-md"
              />
              <label htmlFor="comentarios">Parecer do Orientador</label>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Confirma Aprovação"
        visible={showApproveDialog}
        onHide={() => setShowApproveDialog(false)}
        modal
        pt={{
          content: { style: { padding: '2rem' } },
          footer: { className: 'px-[2rem] pt-[0.6rem]' }
        }}
        footer={approveDialogFooter}
      >
        <p>Você realmente deseja aprovar esta sessão?</p>
      </Dialog>

      <Dialog
        header="Confirma Reprovação"
        visible={showDisapproveDialog}
        onHide={() => setShowDisapproveDialog(false)}
        modal
        pt={{
          content: { style: { padding: '2rem' } },
          footer: { className: 'px-[2rem] pt-[0.6rem]' }
        }}
        footer={disapproveDialogFooter}
      >
        <p>Você realmente deseja reprovar esta sessão?</p>
      </Dialog>
    </div>
  );
};

export default AvaliaPreviaOrientador;
