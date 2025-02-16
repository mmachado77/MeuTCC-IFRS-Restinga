import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import CardData from './CartaoData';
import CardHora from './CardHora';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';

const CardSessao = ({ onHandleLimpar, onHandleCriar, sessaoData }) => {
  // Extrai a data/hora de agendamento a partir de sessaoData.agendamento
  const agendamento = sessaoData?.agendamento ? new Date(sessaoData.agendamento) : null;
  const dia = agendamento ? agendamento.getDate() : null;
  const mes = agendamento ? agendamento.getMonth() + 1 : null;
  const ano = agendamento ? agendamento.getFullYear() : null;
  const formattedTime = agendamento
    ? `${agendamento.getHours()}:${agendamento.getMinutes().toString().padStart(2, '0')}`
    : null;

  const orientador = sessaoData?.orientador;

  return (
    <div className="pt-8 px-4 pb-4 border h-[100%] max-w-[100%] flex flex-col justify-between border-[#f97316] bg-verde-gradient border-dashed rounded-md shadow-md">
      <div className="flex gap-4 w-fill">
        <div className="card flex w-[40%] flex-col justify-between py-6 px-4 border-2 border-dashed border-[#22c55e] bg-cardContent-gradient rounded-md shadow-md">
          <div className="text-start -mt-[2.6rem] w-fit">
            <Tag
              icon="pi pi-calendar text-lg ml-2"
              className="h-fit text-[1.15rem] font-medium gap-2 px-"
              value="Data"
              style={{ backgroundColor: '#22c55e', color: '#FFFFFF' }}
            />
          </div>
          <div className="gap-1 mt-3 flex">
            <div className="w-1/3">
              <CardData numero={dia} texto="DIA" />
            </div>
            <div className="w-1/3">
              <CardData numero={mes} texto="MÊS" />
            </div>
            <div className="w-1/3">
              <CardData numero={ano} texto="ANO" />
            </div>
          </div>
          <div className="mt-3">
            <CardHora numero={formattedTime} texto="HORÁRIO" />
          </div>
        </div>
        <div className="flex flex-col w-[60%] justify-between pt-6 pb-4 px-4 border-2 border-dashed border-[#22c55e] bg-cardContent-gradient rounded-md shadow-md">
          <div className="text-start -mt-[2.6rem] w-fit">
            <Tag
              icon="pi pi-users text-lg ml-2"
              className="h-fit text-[1.15rem] font-medium gap-2 px-2"
              value="Banca"
              style={{ backgroundColor: '#22c55e', color: '#FFFFFF' }}
            />
          </div>
          <div>{renderPessoa(orientador, "Orientador")}</div>
          <div>{renderPessoa(sessaoData?.avaliador1, "Avaliador(a)")}</div>
          <div>{renderPessoa(sessaoData?.avaliador2, "Avaliador(a)")}</div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="card w-full flex flex-col pt-6 pb-4 px-4 mt-5 border-2 border-dashed border-[#22c55e] bg-cardContent-gradient rounded-md shadow-md">
          <div className="text-start -mt-[2.6rem]">
            <Tag
              icon="pi pi-map-marker text-lg ml-2"
              className="h-fit text-[1.15rem] font-medium gap-2 px-2"
              value="Local"
              style={{ backgroundColor: '#22c55e', color: '#FFFFFF' }}
            />
          </div>
          <div className="items-center p-textfield flex-1 mt-3">
            <InputText
              value={sessaoData.local}
              onChange={() => { /* autoResize */ }}
              className="pointer-events-none text-md self-center p-2 bg-none w-full"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-around gap-5">
        <div className="w-2/5">
          {renderButtonLimpar({ onHandleLimpar })}
        </div>
        <div className="w-3/5">
          {renderButtonAgendar(onHandleCriar)}
        </div>
      </div>
    </div>
  );
};

const renderPessoa = (pessoa, role) => {
  const getShortName = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.split(" ");
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1]}`;
  };
  return (
    <div>
      <Tag className="bg-white/10 w-full justify-start">
        <div className="flex justify-between gap-2 mt-2">
          <Avatar
            className="shadow-gray-600 shadow-md size-10"
            image={pessoa?.avatar}
            shape="square"
          />
          <div className="flex flex-col justify-center space-y-0">
            <span className="text-lg leading-tight text-[#22c55e]">
              {getShortName(pessoa?.nome)}
            </span>
            <span className="text-base leading-tight font-normal text-[#22c55e]">
              {role}
            </span>
          </div>
        </div>
      </Tag>
    </div>
  );
};

const renderButtonAgendar = (onHandleCriar) => {
  return (
    <Button
      style={{ border: "1px solid #22c55e" }}
      label="Confirmar Sessão"
      icon="pi pi-calendar"
      pt={{ label: { style: { flex: "none" } } }}
      className="w-full h-fit flex justify-center text-base p-3"
      severity="success"
      onClick={() => onHandleCriar && onHandleCriar()}
    />
  );
};

const renderButtonLimpar = ({ onHandleLimpar }) => {
  return (
    <Button
      label="Limpar"
      icon="pi pi-times"
      pt={{ label: { style: { flex: "none" } } }}
      className="w-full h-fit flex justify-center text-base p-3"
      outlined
      severity="warning"
      onClick={() => onHandleLimpar && onHandleLimpar()}
    />
  );
};

export default CardSessao;
