
import React from "react";
import { Dialog as BaseDialog } from 'primereact/dialog';
import { ptBR } from "date-fns/locale/pt-BR";
import { format } from "date-fns";
import { Badge } from "primereact/badge";

export default function Dialog({ ...props }) {
    return (
        <BaseDialog header="Detalhes da sessão" visible={props.visible} style={{ width: '50vw' }} onHide={() => props.setVisible(false)}>
            {
                props.sessao && (
                    <div className="xl:grid xl:grid-cols-2">
                        <div className="col-span-2">
                            <span className="block mb-2 font-semibold text-900">Tema</span>
                            <span className="block mb-3">{props.sessao.tcc.tema}</span>
                        </div>

                        <div className="col-span-2">
                            <span className="block mb-2 font-semibold text-900">Resumo</span>
                            <span className="block mb-3">{props.sessao?.tcc?.resumo || 'Não preenchido'}</span>
                        </div>

                        <div>
                            <span className="block mb-2 font-semibold text-900">Autor</span>
                            <span className="block mb-3">{props.sessao.tcc.autor.nome}</span>
                        </div>

                        <div>
                            <span className="block mb-2 font-semibold text-900">Orientado por</span>
                            <span className="block mb-3">
                                {
                                    props.sessao.tcc.coorientador == null
                                        ? props.sessao.tcc.orientador.nome
                                        : (`${props.sessao.tcc.orientador.nome} e ${props.sessao.tcc.coorientador.nome}`)
                                }
                            </span>
                        </div>

                        <div>
                            <span className="block mb-2 font-semibold text-900">Tipo</span>
                            <span className="block mb-3">{props.sessao.tipo}</span>
                        </div>

                        <div>
                            <span className="block mb-2 font-semibold text-900">Data da apresentação</span>
                            <span className="block mb-3">{format(props.sessao.data_inicio, 'dd/MM/yyyy HH:ii:ss', { locale: ptBR })}</span>
                        </div>

                        <div className="col-span-2">
                            <span className="block mb-2 font-semibold text-900">Local</span>
                            <span className="block mb-3">{props.sessao.forma_apresentacao} - {props.sessao.local}</span>
                        </div>

                        <div className="col-span-2">
                            <span className="block mb-2 font-semibold text-900">Banca</span>
                            <span className="block mb-3">{props.sessao.banca.professores.map((professor) => <Badge value={professor.nome} severity="secondary" className="mx-2" />)}</span>
                        </div>

                    </div>
                )
            }
        </BaseDialog>
    )
}