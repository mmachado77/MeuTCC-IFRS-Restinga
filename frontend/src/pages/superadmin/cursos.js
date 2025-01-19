/**
 * Página de Gerenciamento de Cursos para SuperAdmin.
 *
 * Esta página exibe uma lista de cursos em uma tabela interativa,
 * utilizando PrimeReact DataTable para exibição e integração com AdminCursoService.
 */

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { AdminCursoService } from '../../services/CursoService'; // Serviço para SuperAdmin

const CursosPage = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Busca os cursos do backend ao carregar a página
    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const data = await AdminCursoService.getCursos();
                setCursos(data);
            } catch (error) {
                console.error('Erro ao buscar cursos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCursos();
    }, []);

    // Renderização do nome do coordenador, tratando cursos sem coordenador
    const coordenadorTemplate = (rowData) => {
        return rowData.coordenador_atual
            ? rowData.coordenador_atual.nome
            : <span className="text-gray-500">Sem coordenador</span>;
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciamento de Cursos</h1>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <ProgressSpinner />
                </div>
            ) : (
                <DataTable value={cursos} responsiveLayout="scroll" paginator rows={10}>
                    <Column field="sigla" header="Sigla" sortable></Column>
                    <Column field="nome" header="Nome" sortable></Column>
                    <Column body={coordenadorTemplate} header="Coordenador Atual"></Column>
                </DataTable>
            )}
        </div>
    );
};

export default CursosPage;
