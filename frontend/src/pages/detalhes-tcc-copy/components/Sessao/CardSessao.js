import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import CardData from './CartaoData';
import CardHora from './CardHora';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { useTccContext } from '../../context/TccContext';

const CardSessao = ({
  onHandleLimpar,
  onHandleCriar,
  sessaoData,
  tipoSessao, // opcional: "PREVIA" ou "FINAL"
  readOnly = false
}) => {
  const { tccData } = useTccContext();
  // Tenta obter a sessão com base nas props; se não for passada, tenta a partir do contexto
  let session = sessaoData;
  if (!session && tccData) {
    if (tipoSessao && tccData.sessoes && Array.isArray(tccData.sessoes)) {
      if (tipoSessao.toUpperCase() === "PREVIA") {
        session = tccData.sessoes.find(s =>
          s.tipo && s.tipo.toLowerCase().includes("sessão prévia")
        );
      } else if (tipoSessao.toUpperCase() === "FINAL") {
        session = tccData.sessoes.find(s =>
          s.tipo && s.tipo.toLowerCase().includes("sessão final")
        );
      }
    }
    // Fallback: usa tccData se não houver sessão específica
    session = session || tccData;
  }

  let hora = null;

  // Extrai data/hora a partir de session.data_inicio
  if (session.data_inicio) {
    hora = new Date(session.data_inicio)
  } else if (session.agendamento) {
    hora = new Date(session.agendamento);
  }

  const dia = hora.getDate();
  const mes = hora.getMonth() + 1;
  const ano = hora.getFullYear();
  const formattedTime = `${hora.getHours()}:${hora.getMinutes()
    .toString()
    .padStart(2, '0')}`;

  // O orientador é sempre obtido de tccData
  const orientador = tccData?.orientador;

  // Para os avaliadores, verifica se há professores na banca
  const avaliador1 = session?.banca?.professores?.[0] || session.avaliador1;
  const avaliador2 = session?.banca?.professores?.[1] || session.avaliador2;

  return (
    <div className="pt-8 px-6 pb-7 gap-6 border min-h-[100%] max-w-[100%] flex flex-col justify-between border-[#f97316] bg-verde-gradient border-dashed rounded-md shadow-md">
      <div className="flex gap-4 w-fill mt-1">
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
          <div>{renderPessoa(avaliador1, "Avaliador(a)")}</div>
          <div>{renderPessoa(avaliador2, "Avaliador(a)")}</div>
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
              value={session?.local}
              onChange={() => { /* se for edição, implementar */ }}
              className="pointer-events-none text-md self-center p-2 bg-none w-full"
            />
          </div>
        </div>
      </div>
      {/* Renderiza os botões somente se não for visualização */}
      {!readOnly && (
        <div className="flex justify-around gap-5">
          <div className="w-2/5">
            {renderButtonLimpar({ onHandleLimpar })}
          </div>
          <div className="w-3/5">
            {renderButtonAgendar(onHandleCriar)}
          </div>
        </div>
      )}
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
