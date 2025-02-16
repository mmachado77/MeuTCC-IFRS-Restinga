import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { useTccContext } from "../../context/TccContext";
import ProfessoresAvaliadores from "../../services/ProfessoresAvaliadores";
import CustomAvatar from "meutcc/components/ui/CustomAvatar";
import CardSessao from "./CardSessao";
import { toast } from "react-toastify";
import SessoesService from "meutcc/services/SessoesService";

const FormSessao = ({ tipoSessao, viewOnly = false, onClose }) => {
  // Desestrutura todas as funções necessárias do contexto
  const { tccData, updateTccDetails } = useTccContext();
  const [professoresAptos, setProfessoresAptos] = useState([]);

  // Estado original da sessão (mantendo outros dados)
  const [sessaoData, setSessaoData] = useState({
    idTCC: tccData?.id || "",
    orientador: tccData?.orientador || null,
    tipo: tipoSessao,
    avaliador1: null,
    avaliador2: null,
    localForma: "presencial",
    local: "",
    agendamento: null // Novo campo para a data completa
  });

  // Estados para data e hora (usados no formulário)
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(null);

  // Quando ambos os calendários estiverem preenchidos, atualiza sessaoData.agendamento
  useEffect(() => {
    if (dataSelecionada && horaSelecionada) {
      const selectedDate = new Date(dataSelecionada);
      const selectedTime = new Date(horaSelecionada);
      const dia = selectedDate.getDate();
      const mes = selectedDate.getMonth();
      const ano = selectedDate.getFullYear();
      const hrs = selectedTime.getHours();
      const mins = selectedTime.getMinutes();
      const dataCompleta = new Date(ano, mes, dia, hrs, mins);
      setSessaoData((prev) => ({
        ...prev,
        agendamento: dataCompleta.toISOString()
      }));
    }
  }, [dataSelecionada, horaSelecionada]);

  async function handleCriarSessao() {
    // Verifica se todos os dados necessários estão preenchidos
    if (
      !sessaoData ||
      !sessaoData.agendamento ||
      !sessaoData.avaliador1 ||
      !sessaoData.avaliador2 ||
      !sessaoData.localForma ||
      !sessaoData.local
    ) {
      toast.error("Preencha todos os campos necessários para agendar a sessão.");
      return;
    }

    // Monta o payload para a API
    const payload = {
      idTCC: sessaoData.idTCC,
      tipo: sessaoData.tipo,
      avaliador1: sessaoData.avaliador1.id,
      avaliador2: sessaoData.avaliador2.id,
      localForma: sessaoData.localForma,
      localDescricao: sessaoData.local,
      dataInicio: sessaoData.agendamento // Já em formato ISO
    };

    try {
      await SessoesService.postNovaSessao(payload);
      // Atualiza os dados do contexto (tccData e proximosPassos) através do updateTccDetails
      await updateTccDetails({});
      onClose(); // Fecha o dialog
    } catch (error) {
      toast.error(`Erro ao criar sessão: ${error.response?.data || error.message}`);
    }
  }

  const handleLimpar = () => {
    setSessaoData({
      idTCC: tccData?.id || "",
      orientador: tccData?.orientador || null,
      tipo: tipoSessao,
      avaliador1: null,
      avaliador2: null,
      localForma: "presencial",
      local: "",
      agendamento: null
    });
    setDataSelecionada(null);
    setHoraSelecionada(null);
  };

  // Template para exibir avatar/nome nos Dropdowns
  const professorOptionTemplate = (option) => {
    return (
      <div className="flex items-center text-[1.15rem]">
        <CustomAvatar
          className="w-[40px] h-[40px] text-[20px]"
          image={option?.avatar}
          fullname={option?.nome}
          size="large"
          shape="circle"
        />
        <span className="ml-3">{option?.nome}</span>
      </div>
    );
  };

  const [rotateIcon, setRotateIcon] = useState(false);

  // Alterna entre presencial e remoto
  const handleToggleLocalForma = () => {
    setRotateIcon(true);
    setTimeout(() => setRotateIcon(false), 1000);
    setSessaoData((prev) => {
      const novoValor = prev.localForma === "presencial" ? "remoto" : "presencial";
      return { ...prev, localForma: novoValor };
    });
  };

  // Atualiza os dados da sessão para os outros campos
  const handleChange = (field, value) => {
    setSessaoData((prev) => ({ ...prev, [field]: value }));
  };

  // Buscar lista de professores aptos
  useEffect(() => {
    ProfessoresAvaliadores.getProfessoresByCurso()
      .then((data) => {
        const filtered = tccData?.orientador
          ? data.filter((prof) => prof.id !== tccData.orientador.id)
          : data;
        setProfessoresAptos(filtered);
      })
      .catch((error) => {
        console.error("Erro ao buscar professores aptos:", error);
      });
  }, [tccData]);

  // Evitar que avaliador2 seja o mesmo que avaliador1
  const professoresAptosParaAvaliador2 = sessaoData.avaliador1
    ? professoresAptos.filter((prof) => prof.id !== sessaoData.avaliador1.id)
    : professoresAptos;

  // Função que renderiza o formulário
  const renderForm = () => (
    <div className="flex flex-col p-4 border border-[#f97316] border-dashed rounded-md shadow-md">
      <div className="flex flex-col gap-8">
        <Tag severity="warning" className="text-[1.6rem] p-3">
          Agendamento de Sessão
        </Tag>
        {/* Linha 1: Calendários de Data e Hora */}
        <div className="flex gap-2">
          <Calendar
            placeholder="Data da Sessao"
            showIcon
            id="dataSessao"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.value)}
            dateFormat="dd/mm/yy"
            locale="ptbr"
            disabled={viewOnly}
            className="w-3/5"
            inputClassName="font-normal text-[1.15rem] text-gray-700"
          />
          <Calendar
            placeholder="Horário"
            showIcon
            icon="pi pi-clock"
            id="horaSessao"
            stepMinute={10}
            value={horaSelecionada}
            onChange={(e) => setHoraSelecionada(e.value)}
            timeOnly
            hourFormat="24"
            locale="ptbr"
            disabled={viewOnly}
            className="w-2/5"
            inputClassName="font-normal text-[1.15rem] text-gray-700"
          />
        </div>
        {/* Linha 2: Endereço / TipoLocal e Botões */}
        <div className="flex items-center gap-2">
          <InputText
            id="local"
            value={sessaoData.local}
            onChange={(e) => handleChange("local", e.target.value)}
            disabled={viewOnly}
            className="font-normal text-[1.15rem] text-gray-700 w-full"
            placeholder={sessaoData.localForma === "presencial" ? "Local" : "Link"}
          />
          <div className="p-inputgroup flex-1 self-stretch w-full">
            <Button
              text
              label={sessaoData.localForma === "presencial" ? "Presencial" : "Remoto"}
              severity={sessaoData.localForma === "presencial" ? "warning" : "info"}
              className="w-7/8 transition duration-300 ease-in-out py-1 text-sm text-start px-[0.5rem] font-normal pointer-events-none border border-[#d1d5db]"
            />
            <Button
              icon={rotateIcon ? "pi pi-spin pi-sync" : "pi pi-sync"}
              className="text-white"
              style={{
                minWidth: "3rem",
                backgroundColor: sessaoData.localForma === "presencial" ? "#f97316" : "#2c84d8",
                transition: "transform 1s ease",
                border: "none"
              }}
              onClick={handleToggleLocalForma}
              disabled={viewOnly}
            />
          </div>
        </div>
        {/* Linha 3: Avaliador 1 */}
        <span className="font-normal text-[1.15rem] text-gray-700 p-float-label">
          <Dropdown
            id="avaliador1"
            value={sessaoData.avaliador1}
            options={professoresAptos}
            optionLabel="nome"
            itemTemplate={professorOptionTemplate}
            valueTemplate={professorOptionTemplate}
            onChange={(e) => handleChange("avaliador1", e.value)}
            disabled={viewOnly}
            className="w-full"
          />
          <label htmlFor="avaliador1">Avaliador 1</label>
        </span>
        {/* Linha 4: Avaliador 2 */}
        <span className="font-normal text-[1.15rem] text-gray-700 p-float-label">
          <Dropdown
            id="avaliador2"
            value={sessaoData.avaliador2}
            options={professoresAptosParaAvaliador2}
            optionLabel="nome"
            itemTemplate={professorOptionTemplate}
            valueTemplate={professorOptionTemplate}
            onChange={(e) => handleChange("avaliador2", e.value)}
            disabled={viewOnly}
            className="w-full"
          />
          <label htmlFor="avaliador2">Avaliador 2</label>
        </span>
      </div>
    </div>
  );

  const isFormFilled =
    sessaoData.tipo &&
    sessaoData.avaliador1 &&
    sessaoData.avaliador2 &&
    sessaoData.localForma &&
    sessaoData.local &&
    sessaoData.agendamento;

  return isFormFilled ? (
    <div className="flex gap-4 pb-3 transition-all duration-550 ease-out">
      <div className="w-[40%] transition-all duration-550 ease-out">
        {renderForm()}
      </div>
      <div className="w-[60%] transition-all duration-550 ease-out">
        <CardSessao onHandleLimpar={handleLimpar} onHandleCriar={handleCriarSessao} sessaoData={sessaoData} />
      </div>
    </div>
  ) : (
    <div className="flex justify-center pb-3 transition-all duration-550 ease-out">
      <div className="max-w-[430px]">{renderForm()}</div>
    </div>
  );
};

export default FormSessao;
