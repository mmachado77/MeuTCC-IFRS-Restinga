import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import TccService from 'meutcc/services/TccService';
import ProfessorService from 'meutcc/services/ProfessorService';

const MeusTccsPage = () => {

    const [loading, setLoading] = React.useState(false);
    const [selectedOrientador, setSelectedOrientador] = React.useState(null);
    const [selectedCoorientador, setSelectedCoorientador] = React.useState(null);
    const [temCoorientador, setTemCoorientador] = React.useState(false);
    const [afirmoQueConversei, setAfirmoQueConversei] = React.useState(false);
    const [orientadores, setOrientadores] = React.useState([]);
    const [coorientadores, setCoorientadores] = React.useState([]);

    React.useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const data = await ProfessorService.getProfessores();

                const professores = data.map((professor) => ({ name: professor.nome, code: professor.id }));
    
                setOrientadores(professores);
                setCoorientadores(professores);

            } catch (error) {
                console.error('Erro ao buscar professores', error);
            }
        };

        fetchProfessores();
    }, []);


    const onSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        const formData = new FormData(event.currentTarget);
        console.log('Current target', event.currentTarget);
        console.log('Form data', formData);
        const response = await TccService.submeterProposta(formData);

        if (response) {
            console.log('Proposta submetida com sucesso');
        } else {
            console.log('Erro ao submeter proposta');
        }

        setLoading(false);

    }

    return <div className='max-w-screen-md mx-auto bg-white m-3 mt-6 flex flex-col'>
            <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                <h1 className='heading-1 text-center text-gray-700'>Submeter Proposta de TCC</h1>
            </div>

            <div className='py-6 px-9'>
                <form onSubmit={onSubmit}>
                    <div className='flex flex-wrap align-items-center mb-3 gap-2'>
                        <label htmlFor='tema' className='p-sr-only'>Tema</label>
                        <InputText id='tema' name='tema' placeholder='Tema' className='w-full' />

                        {/* <Message severity="error" text="Username is required" /> */}
                    </div>

                    <div className='flex flex-wrap align-items-center mb-3 gap-2'>
                        <InputTextarea id='tema' name='resumo' placeholder='Escreva um resumo sobre o que será abordado em seu TCC' className='w-full' rows={6}  />
                    </div>

                    <div className='flex flex-row align-items-center mb-3 gap-2'>
                        <div className='w-1/2'>
                            <Dropdown value={selectedOrientador} name='orientador' onChange={(e) => setSelectedOrientador(e.value)} options={orientadores} optionLabel="name" placeholder="Selecione o orientador" className="w-full md:w-14rem" />
                        </div>
                        <div className='w-1/2'>
                            <Dropdown value={selectedCoorientador} name='coorientador' disabled={!temCoorientador} onChange={(e) => setSelectedCoorientador(e.value)} options={coorientadores} optionLabel="name" placeholder="Selecione o coorientador" className="w-full md:w-14rem" />
                            <div className="flex align-items-center py-3">
                                <Checkbox inputId="temCoorientador" name="temCoorientador" value="temCoorientador" onChange={(e) => setTemCoorientador(!temCoorientador)} checked={temCoorientador} />
                                <label htmlFor="temCoorientador" className="ml-2">Tem coorientador</label>
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-wrap align-items-center mb-3 gap-1 pt-2">
                        <Checkbox inputId="afirmoQueConversei" name="pizza" value="Cheese" onChange={(e) => setAfirmoQueConversei(!afirmoQueConversei)} checked={afirmoQueConversei} />
                        <label htmlFor="afirmoQueConversei" className="ml-2">Afirmo que conversei presencialmente com o professor sobre minha proposta de TCC</label>
                    </div>

                    <div className="flex flex-wrap align-items-center mb-3 gap-2">
                        <Button label={loading ? "Submetendo proposta" : "Submeter proposta"} loading={loading} className='w-full' />
                    </div>
                </form>
            </div>
    </div>;

}

MeusTccsPage.logged = true;
MeusTccsPage.showMenu = true;

export default MeusTccsPage;