import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { toast } from 'react-toastify';
import { Tag } from 'primereact/tag';
import AvaliacaoService from '../../../../../services/AvaliacaoService'
import { useTccContext } from '../../../context/TccContext'

const AvaliaFinal = ({ session }) => {
  const sessaoId = session?.id
  const [visibleAvaliacao, setVisibleAvaliacao] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para mensagens de erro
  const [notaEstruturaMensagemErro, setNotaEstruturaMensagemErro] = useState('');
  const [notaRelevanciaMensagemErro, setNotaRelevanciaMensagemErro] = useState('');
  const [notaConhecimentoMensagemErro, setNotaConhecimentoMensagemErro] = useState('');
  const [notaBibliografiaMensagemErro, setNotaBibliografiaMensagemErro] = useState('');
  const [notaRecursosMensagemErro, setNotaRecursosMensagemErro] = useState('');
  const [notaConteudoMensagemErro, setNotaConteudoMensagemErro] = useState('');
  const [notaSinteseMensagemErro, setNotaSinteseMensagemErro] = useState('');
  const [dataEntregaMensagemErro, setDataEntregaMensagemErro] = useState('');
  const [horarioEntregaMensagemErro, setHorarioEntregaMensagemErro] = useState('');
  const [adequacoesMensagemErro, setAdequacoesMensagemErro] = useState('');

  // Estado para controle das adequações e data/hora
  const [necessarioAdequacoes, setNecessarioAdequacoes] = useState(false);
  const [datetime24h, setDateTime24h] = useState(null);

  const { fetchData, tccData, user } = useTccContext();
  const handleAdequacoesChange = (e) => {
    setNecessarioAdequacoes(e.checked);
  };
  const evaluated = (() => {
    if (user?.id === session?.banca?.professores[0]?.id) {
      return session?.avaliacao?.avaliado_avaliador1;
    } else if (user?.id === session?.banca?.professores[1]?.id) {
      return session?.avaliacao?.avaliado_avaliador2;
    } else if (user?.id === tccData?.orientador?.id) {
      return session?.avaliacao?.avaliado_orientador;
    }
    return false;
  })();

  const onSubmitAvaliacao = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const jsonData = Object.fromEntries(formData);

    if (jsonData.estrutura_trabalho === '') {
      setNotaEstruturaMensagemErro('A nota de Estrutura do Trabalho é obrigatória');
      setLoading(false);
      return;
    } else {
      setNotaEstruturaMensagemErro('');
    }

    if (jsonData.relevancia_originalidade_qualidade === '') {
      setNotaRelevanciaMensagemErro('A nota de Relevância, Originalidade e Qualidade do Conteúdo é obrigatória');
      setLoading(false);
      return;
    } else {
      setNotaRelevanciaMensagemErro('');
    }

    if (jsonData.grau_conhecimento === '') {
      setNotaConhecimentoMensagemErro('A nota de Grau de Conhecimento é obrigatória');
      setLoading(false);
      return;
    } else {
      setNotaConhecimentoMensagemErro('');
    }

    if (jsonData.bibliografia_apresentada === '') {
      setNotaBibliografiaMensagemErro('A nota de Bibliografia Apresentada é obrigatória');
      setLoading(false);
      return;
    } else {
      setNotaBibliografiaMensagemErro('');
    }

    if (jsonData.utilizacao_recursos_didaticos === '') {
      setNotaRecursosMensagemErro('A nota de Utilização de Recursos Didáticos é obrigatória');
      setLoading(false);
      return;
    } else {
      setNotaRecursosMensagemErro('');
    }

    if (jsonData.conteudo_apresentacao === '') {
      setNotaConteudoMensagemErro('A nota de Conteúdo da Apresentação é obrigatória');
      setLoading(false);
      return;
    } else {
      setNotaConteudoMensagemErro('');
    }

    if (jsonData.utilizacao_tempo_sintese === '') {
      setNotaSinteseMensagemErro('A nota de Utilização do Tempo e Poder de Síntese é obrigatória');
      setLoading(false);
      return;
    } else {
      setNotaSinteseMensagemErro('');
    }

    if (necessarioAdequacoes && jsonData.data_entrega === '') {
      setDataEntregaMensagemErro('O campo Data é obrigatório');
      setLoading(false);
      return;
    } else {
      setDataEntregaMensagemErro('');
    }

    if (necessarioAdequacoes && jsonData.horario_entrega === '') {
      setHorarioEntregaMensagemErro('O campo Horário é obrigatório');
      setLoading(false);
      return;
    } else {
      setHorarioEntregaMensagemErro('');
    }

    if (necessarioAdequacoes && jsonData.adequacoes_necessarias === '') {
      setAdequacoesMensagemErro('O campo Adequações Necessárias é obrigatório');
      setLoading(false);
      return;
    } else {
      setAdequacoesMensagemErro('');
    }

    const response = await AvaliacaoService.avaliar(sessaoId, jsonData);

    if (response) {
      toast.success('Avaliação realizada com sucesso');
    } else {
      toast.error('Erro ao realizar avaliação');
    }

    setLoading(false);
    fetchData();
    setVisibleAvaliacao(false);
  };
  

  return (
    <div>
      <Button
        label={evaluated ? "Avaliação Submetida" : "Avaliar TCC"}
        pt={{ label: { style: { flex: 'none' } } }}
        icon={evaluated ? 'pi pi-star-fill' : 'pi pi-star'}
        disabled= {evaluated ? true : false}
        className={`w-full py-1 flex justify-center items-center text-xl p-button-warning `}
        onClick={() => setVisibleAvaliacao(true)}
      />

      <Dialog
        header="Avaliar TCC"
        closeOnEscape
        pt={{
          header: {
            style: { padding: '1.6rem' },
            className: 'sticky shadow-md shadow-[#22c55e]/50'
          },
          headerTitle: { className: 'text-3xl font-bold text-center text-gray-700' },
          content: { style: { padding: '2rem' } }
        }}
        className="max-w-screen-lg"
        visible={visibleAvaliacao}
        style={{ width: '90vw' }}
        onHide={() => setVisibleAvaliacao(false)}
      >
        <form onSubmit={onSubmitAvaliacao}>
          <div className="grid gap-12 p-6">
            {/* Seção: NOTAS TRABALHO ESCRITO */}
            <div className="border border-dashed border-[#22c55e] shadow-md rounded-xl p-8">
              <div className="text-start -mt-[3.2rem]">
                <Tag
                  icon="pi pi-file-edit text-lg ml-2"
                  className="h-fit text-[1.15rem] font-medium gap-2"
                  value="NOTAS TRABALHO ESCRITO"
                  style={{ backgroundColor: '#22c55e', color: '#FFFFFF' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-8 mt-5">
                <div className="flex flex-col gap-2 items-start w-full">
                  <label className='text-[0.9rem]' htmlFor="estrutura_trabalho"><b>Estrutura do Trabalho</b></label>
                  <InputNumber
                    className="w-full"
                    id="estrutura_trabalho"
                    name="estrutura_trabalho"
                    placeholder="Máximo 1,0 ponto"
                    mode="decimal"
                    minFractionDigits={1}
                    maxFractionDigits={2}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                  {notaEstruturaMensagemErro && <small className="px-2 py-1 text-red-500">{notaEstruturaMensagemErro}</small>}
                </div>
                <div className="flex flex-col gap-2 items-start w-full">
                  <label className='text-[0.9rem]' htmlFor="relevancia_originalidade_qualidade"><b>Relevância, Originalidade e Qualidade do Conteúdo</b></label>
                  <InputNumber
                    className="w-full"
                    id="relevancia_originalidade_qualidade"
                    name="relevancia_originalidade_qualidade"
                    placeholder="Máximo 3,0 pontos"
                    mode="decimal"
                    minFractionDigits={1}
                    maxFractionDigits={2}
                    min={0}
                    max={3}
                    step={0.1}
                  />
                  {notaRelevanciaMensagemErro && <small className="px-2 py-1 text-red-500">{notaRelevanciaMensagemErro}</small>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mt-5">
                <div className="flex flex-col gap-2 items-start w-full">
                  <label className='text-[0.9rem]' htmlFor="grau_conhecimento"><b>Grau de Conhecimento</b></label>
                  <InputNumber
                    className="w-full"
                    id="grau_conhecimento"
                    name="grau_conhecimento"
                    placeholder="Máximo 2,0 pontos"
                    mode="decimal"
                    minFractionDigits={1}
                    maxFractionDigits={2}
                    min={0}
                    max={2}
                    step={0.1}
                  />
                  {notaConhecimentoMensagemErro && <small className="px-2 py-1 text-red-500">{notaConhecimentoMensagemErro}</small>}
                </div>
                <div className="flex flex-col gap-2 items-start w-full">
                  <label className='text-[0.9rem]' htmlFor="bibliografia_apresentada"><b>Bibliografia Apresentada</b></label>
                  <InputNumber
                    className="w-full"
                    id="bibliografia_apresentada"
                    name="bibliografia_apresentada"
                    placeholder="Máximo 1,0 ponto"
                    mode="decimal"
                    minFractionDigits={1}
                    maxFractionDigits={2}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                  {notaBibliografiaMensagemErro && <small className="px-2 py-1 text-red-500">{notaBibliografiaMensagemErro}</small>}
                </div>
              </div>
            </div>

            {/* Seção: NOTAS APRESENTAÇÃO DO TRABALHO */}
            <div className="border border-dashed border-[#22c55e] shadow-md rounded-xl p-8">
              <div className="text-start -mt-[3.2rem]">
                <Tag
                  icon="pi pi-file-edit text-lg ml-2"
                  className="h-fit text-[1.15rem] font-medium gap-2"
                  value="NOTAS APRESENTAÇÃO DO TRABALHO"
                  style={{ backgroundColor: '#22c55e', color: '#FFFFFF' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-8 mt-5">
                <div className="flex flex-col gap-2 items-start w-full">
                  <label className='text-[0.9rem]' htmlFor="utilizacao_recursos_didaticos"><b>Utilização de Recursos Didáticos</b></label>
                  <InputNumber
                    className="w-full"
                    id="utilizacao_recursos_didaticos"
                    name="utilizacao_recursos_didaticos"
                    placeholder="Máximo 1,0 ponto"
                    mode="decimal"
                    minFractionDigits={1}
                    maxFractionDigits={2}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                  {notaRecursosMensagemErro && <small className="px-2 py-1 text-red-500">{notaRecursosMensagemErro}</small>}
                </div>
                <div className="flex flex-col gap-2 items-start w-full">
                  <label className='text-[0.9rem]' htmlFor="conteudo_apresentacao"><b>Conteúdo da Apresentação</b></label>
                  <InputNumber
                    className="w-full"
                    id="conteudo_apresentacao"
                    name="conteudo_apresentacao"
                    placeholder="Máximo 1,0 ponto"
                    mode="decimal"
                    minFractionDigits={1}
                    maxFractionDigits={2}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                  {notaConteudoMensagemErro && <small className="px-2 py-1 text-red-500">{notaConteudoMensagemErro}</small>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mt-5">
                <div className="flex flex-col gap-2 items-start w-full">
                  <label className='text-[0.9rem]' htmlFor="utilizacao_tempo_sintese"><b>Utilização do Tempo e Poder de Síntese</b></label>
                  <InputNumber
                    className="w-full"
                    id="utilizacao_tempo_sintese"
                    name="utilizacao_tempo_sintese"
                    placeholder="Máximo 1,0 ponto"
                    mode="decimal"
                    minFractionDigits={1}
                    maxFractionDigits={2}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                  {notaSinteseMensagemErro && <small className="px-2 py-1 text-red-500">{notaSinteseMensagemErro}</small>}
                </div>
              </div>
            </div>

            {/* Seção: CONSIDERAÇÕES FINAIS */}
            <div className="border border-dashed border-[#22c55e] shadow-md rounded-xl p-8">
              <div className="text-start -mt-[3.2rem]">
                <Tag
                  icon="pi pi-file-edit text-lg ml-2"
                  className="h-fit text-[1.15rem] font-medium gap-2"
                  value="CONSIDERAÇÕES FINAIS"
                  style={{ backgroundColor: '#22c55e', color: '#FFFFFF' }}
                />
              </div>
              {user.id === tccData?.orientador?.id && (
                <>
                  <div className="flex flex-wrap gap-1 pt-4 mb-3 items-start">
                    <Checkbox
                      inputId="adequacoes"
                      name="adequacoes"
                      onChange={handleAdequacoesChange}
                      checked={necessarioAdequacoes}
                    />
                    <label className='text-[0.9rem] ml-2' htmlFor="adequacoes" >
                      O Trabalho de Conclusão de Curso (TCC) necessita de adequações para aprovação da versão final
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-8" style={{ display: necessarioAdequacoes ? 'flex' : 'none' }}>
                    <div className="flex flex-col gap-2 items-start w-full">
                      <label className='text-[0.9rem]' htmlFor="data_entrega"><b>Data</b></label>
                      <Calendar
                        className="w-full"
                        id="data_entrega"
                        locale='ptbr'
                        name="data_entrega"
                        placeholder="Data para entrega da versão definitiva"
                        value={datetime24h}
                        minDate={new Date()}
                        readOnlyInput
                        onChange={(e) => setDateTime24h(e.value)}
                      />
                      {dataEntregaMensagemErro && <small className="px-2 py-1 text-red-500">{dataEntregaMensagemErro}</small>}
                    </div>
                    <div className="flex flex-col gap-2 items-start w-full">
                      <label className='text-[0.9rem]' htmlFor="horario_entrega"><b>Horário</b></label>
                      <Calendar
                        className="w-full"
                        id="horario_entrega"
                        name="horario_entrega"
                        value={datetime24h}
                        placeholder="Horário para entrega da versão definitiva"
                        readOnlyInput
                        onChange={(e) => setDateTime24h(e.value)}
                        timeOnly
                      />
                      {horarioEntregaMensagemErro && <small className="px-2 py-1 text-red-500">{horarioEntregaMensagemErro}</small>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 my-3 items-start" style={{ display: necessarioAdequacoes ? 'flex' : 'none' }}>
                    <label className='text-[0.9rem] ml-2' htmlFor="adequacoes_necessarias" ><b>Adequações Necessárias</b></label>
                    <InputTextarea
                      id="adequacoes_necessarias"
                      name="adequacoes_necessarias"
                      placeholder="Descreva quais ajustes devem ser realizados pelo estudante mediante a aprovação do TCC"
                      rows={6}
                      className={`w-full ${adequacoesMensagemErro ? 'p-invalid' : ''}`}
                    />
                    {adequacoesMensagemErro && <small className="px-2 py-1 text-red-500">{adequacoesMensagemErro}</small>}
                  </div>
                </>
              )}
              <div className="flex flex-wrap gap-2 my-3 items-start">
                <label className='text-[0.9rem] ml-2' htmlFor="comentarios_adicionais"><b>Comentários Adicionais</b></label>
                <InputTextarea
                  id="comentarios_adicionais"
                  name="comentarios_adicionais"
                  placeholder="Escreva comentários que achar pertinente quanto ao TCC apresentado"
                  rows={6}
                  className="w-full"
                />
              </div>
            </div>

            {/* Botão de submissão */}
            <div className="flex w-full justify-end">
              <Button
                t={{ label: { style: { flex: 'none' } } }}
                className="w-2/6 flex justify-center"
                icon="pi pi-star-fill"
                severity="success"
                type="submit"
                label={loading ? "Submetendo Avaliação do TCC" : "Submeter Avaliação do TCC"}
                loading={loading}
              />
            </div>

          </div>
        </form>
      </Dialog>


    </div>
  );
};

export default AvaliaFinal;
