import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

const ListarPropostasPage = () => {

    const customers = [
        { name: 'Customer 1', country: { name: 'Australia' }, company: 'Company 1', representative: { name: 'Representative 1' } },
        { name: 'Customer 2', country: { name: 'Brazil' }, company: 'Company 2', representative: { name: 'Representative 2' } },
        { name: 'Customer 3', country: { name: 'Canada' }, company: 'Company 3', representative: { name: 'Representative 3' } },
        { name: 'Customer 4', country: { name: 'Germany' }, company: 'Company 4', representative: { name: 'Representative 4' } },
        { name: 'Customer 5', country: { name: 'United States' }, company: 'Company 5', representative: { name: 'Representative 5' } }
    ];

    return <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
        <div className='py-3 border-0 border-b border-dashed border-gray-200'>
            <h1 className='heading-1 text-center text-gray-700'>Listar Propostas</h1>
        </div>

        <div className='py-6 px-3'>
            <DataTable value={customers} paginator rows={5} tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" header="Tema" style={{ width: '25%' }}></Column>
                <Column field="country.name" header="Autor" style={{ width: '25%' }}></Column>
                <Column field="company" header="Orientador" style={{ width: '25%' }}></Column>
                <Column field="representative.name" header="" style={{ width: '25%' }}></Column>
            </DataTable>
        </div>
    </div>;
};

export default ListarPropostasPage;