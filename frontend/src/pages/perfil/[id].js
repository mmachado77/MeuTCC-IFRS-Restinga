import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'meutcc/core/context/AuthContext';
import UsuarioService from 'meutcc/services/UsuarioService';
import { Toast } from 'primereact/toast';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import Table from 'meutcc/pages/home/Table';
import CustomAvatar from 'meutcc/components/ui/CustomAvatar';
import { GUARDS } from 'meutcc/core/constants';

const areasInteresse = [
    { label: 'Algoritmos, Combinatória e Otimização', value: 'ALGORITMOS_COMBINATORIA_E_OTIMIZACAO' },
    { label: 'Arquitetura de Computadores e Processamento de Alto Desempenho', value: 'ARQUITETURA_DE_COMPUTADORES_E_PROCESSAMENTO_DE_ALTO_DESEMPENHO' },
    { label: 'Banco de Dados', value: 'BANCO_DE_DADOS' },
    { label: 'Biologia Computacional', value: 'BIOLOGIA_COMPUTACIONAL' },
    { label: 'Computação Aplicada à Saúde', value: 'COMPUTACAO_APLICADA_A_SAUDE' },
    { label: 'Computação Gráfica e Processamento de Imagens', value: 'COMPUTACAO_GRAFICA_E_PROCESSAMENTO_DE_IMAGENS' },
    { label: 'Computação Musical', value: 'COMPUTACAO_MUSICAL' },
    { label: 'Computação Ubíqua e Pervasiva', value: 'COMPUTACAO_UBIQUA_E_PERVASIVA' },
    { label: 'Concepção de Circuitos Integrados', value: 'CONCEPCAO_DE_CIRCUITOS_INTEGRADOS' },
    { label: 'Engenharia de Software', value: 'ENGENHARIA_DE_SOFTWARE' },
    { label: 'Geo Informática', value: 'GEO_INFORMATICA' },
    { label: 'Informática na Educação', value: 'INFORMATICA_NA_EDUCACAO' },
    { label: 'Inteligência Artificial', value: 'INTELIGENCIA_ARTIFICIAL' },
    { label: 'Inteligência Computacional', value: 'INTELIGENCIA_COMPUTACIONAL' },
    { label: 'Interação Humano Computador', value: 'INTERACAO_HUMANO_COMPUTADOR' },
    { label: 'Jogos e Entretenimento', value: 'JOGOS_E_ENTRETENIMENTO' },
    { label: 'Linguagens de Programação', value: 'LINGUAGENS_DE_PROGRAMACAO' },
    { label: 'Métodos Formais', value: 'METODOS_FORMAIS' },
    { label: 'Processamento de Linguagem Natural', value: 'PROCESSAMENTO_DE_LINGUAGEM_NATURAL' },
    { label: 'Realidade Virtual', value: 'REALIDADE_VIRTUAL' },
    { label: 'Redes de Computadores e Sistemas Distribuídos', value: 'REDES_DE_COMPUTADORES_E_SISTEMAS_DISTRIBUIDOS' },
    { label: 'Robótica', value: 'ROBOTICA' },
    { label: 'Segurança', value: 'SEGURANCA' },
    { label: 'Sistemas Colaborativos', value: 'SISTEMAS_COLABORATIVOS' },
    { label: 'Sistemas Distribuidos', value: 'SISTEMAS_DISTRIBUIDOS' },
    { label: 'Sistemas de Informação', value: 'SISTEMAS_DE_INFORMACAO' },
    { label: 'Sistemas Multimídia e Hipermídia', value: 'SISTEMAS_MULTIMIDIA_E_HIPERMIDIA' },
    { label: 'Sistemas Tolerantes a Falhas', value: 'SISTEMAS_TOLERANTES_A_FALHAS' }
];

const ProfilePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [tipo, setTipo] = useState('');
    const [avatar, setAvatar] = useState('');
    const [areaInteresse, setAreaInteresse] = useState([]);
    const [nomeTemp, setNomeTemp] = useState('');
    const [areaInteresseTemp, setAreaInteresseTemp] = useState([]);
    const [tccs, setTccs] = useState([]);
    const [socialLinks, setSocialLinks] = useState({ linkedin: '', github: '', gmail: '' });
    const [exibirDialogo, setExibirDialogo] = useState(false);
    const [exibirDialogoLinkedIn, setExibirDialogoLinkedIn] = useState(false);
    const [exibirDialogoGitHub, setExibirDialogoGitHub] = useState(false);
    const [linkTemp, setLinkTemp] = useState('');
    const toast = useRef(null);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await UsuarioService.getPerfilById(id);
                const areaInteresseArray = response.area_interesse ? JSON.parse(response.area_interesse.replace(/'/g, '"')) : [];
                setPerfil(response);
                setNome(response.nome);
                setEmail(response.email);
                setTipo(response.tipo);
                setAvatar(response.avatar);
                setAreaInteresse(Array.isArray(areaInteresseArray) ? areaInteresseArray : []);
                setNomeTemp(response.nome);
                setAreaInteresseTemp(Array.isArray(areaInteresseArray) ? areaInteresseArray : []);
                setSocialLinks({
                    linkedin: response.linkedin || '',
                    github: response.github || '',
                    gmail: response.email || '',
                });
            } catch (error) {
                console.error('Erro ao obter o perfil do usuário:', error);
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao obter o perfil do usuário', life: 3000 });
                }
            }
        };
        if (id) {
            fetchPerfil();
        }
    }, [id]);

    useEffect(() => {
        const fetchTccs = async () => {
            if (!user) return;
            try {
                const response = await UsuarioService.getTccsByUsuarioId(id);
                setTccs(response);
            } catch (error) {
                console.error('Erro ao obter TCCs:', error);
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Nenhum TCC vinculado ao usuário', life: 3000 });
                }
                setTccs([]); // Certifique-se de definir TCCs como uma lista vazia
            }
        };
        if (user && user.tipo && id) {
            fetchTccs();
        }
    }, [user, id]);

    const atualizarPerfil = async () => {
        try {
            await UsuarioService.atualizarPerfil({
                id: perfil.id,
                nome: nomeTemp,
                area_interesse: JSON.stringify(areaInteresseTemp),
                linkedin: socialLinks.linkedin,
                github: socialLinks.github,
                gmail: socialLinks.gmail,
            });
            setNome(nomeTemp);
            setAreaInteresse(areaInteresseTemp);
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfil atualizado com sucesso', life: 3000 });
            }
            setExibirDialogo(false);
        } catch (error) {
            console.error('Erro ao atualizar o perfil:', error);
            if (toast.current) {
                if (error.response && error.response.status === 403) {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Permissão negada. Verifique suas permissões.', life: 3000 });
                } else {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar o perfil', life: 3000 });
                }
            }
        }
    };

    const abrirDialogo = () => {
        setExibirDialogo(true);
    };

    const fecharDialogo = () => {
        setNomeTemp(nome);
        setAreaInteresseTemp(areaInteresse);
        setExibirDialogo(false);
    };

    const abrirDialogoLinkedIn = () => {
        setLinkTemp(socialLinks.linkedin ? `https://www.linkedin.com/in/${socialLinks.linkedin}` : '');
        setExibirDialogoLinkedIn(true);
    };

    const fecharDialogoLinkedIn = () => {
        setLinkTemp('');
        setExibirDialogoLinkedIn(false);
    };

    const salvarLinkLinkedIn = async () => {
        const isValidLink = linkTemp.includes('linkedin.com/in/');
        if (!isValidLink) {
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'O link deve ser do LinkedIn', life: 3000 });
            }
            return;
        }

        const username = linkTemp.split('linkedin.com/in/')[1];
        try {
            await UsuarioService.atualizarPerfil({ id: perfil.id, linkedin: username });
            setSocialLinks(prevLinks => ({ ...prevLinks, linkedin: username }));
        } catch (error) {
            console.error('Erro ao atualizar o LinkedIn:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar o LinkedIn', life: 3000 });
            }
        }
        fecharDialogoLinkedIn();
    };

    const abrirDialogoGitHub = () => {
        setLinkTemp(socialLinks.github ? `https://github.com/${socialLinks.github}` : '');
        setExibirDialogoGitHub(true);
    };

    const fecharDialogoGitHub = () => {
        setLinkTemp('');
        setExibirDialogoGitHub(false);
    };

    const salvarLinkGitHub = async () => {
        const isValidLink = linkTemp.includes('github.com/');
        if (!isValidLink) {
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'O link deve ser do GitHub', life: 3000 });
            }
            return;
        }

        const username = linkTemp.split('github.com/')[1];
        try {
            await UsuarioService.atualizarPerfil({ id: perfil.id, github: username });
            setSocialLinks(prevLinks => ({ ...prevLinks, github: username }));
        } catch (error) {
            console.error('Erro ao atualizar o GitHub:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar o GitHub', life: 3000 });
            }
        }
        fecharDialogoGitHub();
    };

    return (
        <section className="container mx-auto p-4 flex flex-col lg:flex-row lg:space-x-6" style={{ minHeight: '100vh' }}>
            <div className="profile-sidebar flex-1 lg:flex-[35%] mb-4 lg:mb-0" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Card className="h-full">
                    <div className="text-center" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <CustomAvatar image={avatar} fullname={nome} className='mb-4 w-[170px] h-[170px] text-[50px]' shape="circle" />
                        <h5 className="mt-4 mb-2" style={{ fontSize: '30px' }}>{nome}</h5>
                        <p className="text-gray-500 mb-4" style={{ fontSize: '22px' }}>{tipo}</p>
                        {user && user.id === perfil?.id && (
                            <div className="flex justify-center space-x-2">
                                <Button label="Modificar perfil" className="p-button-info" onClick={abrirDialogo} />
                            </div>
                        )}
                    </div>
                </Card>
                <Card className="mt-4">
                    <h5 style={{ fontSize: '20px',  }}>Redes Sociais</h5>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <a href={`https://www.linkedin.com/in/${socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                                <i className="pi pi-linkedin text-2xl"></i>
                                <span>{socialLinks.linkedin ? 'LinkedIn' : 'Adicione sua conta'}</span>
                            </a>
                            {user && user.id === perfil?.id && (
                                <Button icon="pi pi-pencil" className="p-button-text p-button-plain" onClick={abrirDialogoLinkedIn} />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <a href={`https://github.com/${socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                                <i className="pi pi-github text-2xl"></i>
                                <span>{socialLinks.github ? 'GitHub' : 'Adicione sua conta'}</span>
                            </a>
                            {user && user.id === perfil?.id && (
                                <Button icon="pi pi-pencil" className="p-button-text p-button-plain" onClick={abrirDialogoGitHub} />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${socialLinks.gmail}&su=Subject&body=Body}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                                <i className="pi pi-envelope text-2xl"></i>
                                <span>Gmail</span>
                            </a>
                            <Button icon="pi pi-pencil" className="p-button-text p-button-plain" style={{ visibility: 'hidden' }} />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="profile-content flex-1 lg:flex-[65%] flex flex-col">
                <Card className="mb-4 flex-1">
                    <div className="p-fluid">
                        <div className="p-field p-grid">
                            <label htmlFor="nome" className="p-col-12 p-md-3">Nome Completo</label>
                            <div className="p-col-12 p-md-9">
                                <InputText id="nome" value={nome} readOnly />
                            </div>
                        </div>
                        <Divider />
                        <div className="p-field p-grid">
                            <label htmlFor="email" className="p-col-12 p-md-3">Email</label>
                            <div className="p-col-12 p-md-9">
                                <InputText id="email" value={email} readOnly />
                            </div>
                        </div>
                        <Divider />
                        <div className="p-field p-grid">
                            <label htmlFor="areaInteresse" className="p-col-12 p-md-3">Área de Interesse</label>
                            <div className="p-col-12 p-md-9">
                                <MultiSelect
                                    id="areaInteresse"
                                    value={areaInteresse}
                                    options={areasInteresse}
                                    placeholder="Selecione uma ou mais áreas de interesse"
                                    display="chip"
                                    disabled
                                    style={{ maxWidth: '100%', whiteSpace: 'normal', wordWrap: 'break-word' }}
                                    className="multiselect-container"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className='mb-4 flex-1'>
                    <h1 className='px-5 pt-2 text-2xl font-bold text-center'>TCC'S</h1>
                    <div className='p-5'>
                        <Table tccs={tccs} />
                    </div>
                </Card>
            </div>

            <Dialog visible={exibirDialogo} style={{ width: '32rem' }} header="Modificar Perfil" modal footer={(
                <div className='flex justify-end'>
                    <Button label="Cancelar" icon="pi pi-times" onClick={fecharDialogo} className="p-button-text p-button-danger" />
                    <Button label="Salvar" icon="pi pi-check" onClick={atualizarPerfil} autoFocus />
                </div>
            )} onHide={fecharDialogo}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="nome">Nome Completo</label>
                        <InputText id="nome" value={nomeTemp} onChange={(e) => setNomeTemp(e.target.value)} />
                    </div>
                    <Divider />
                    <div className="p-field">
                        <label htmlFor="areaInteresse">Área de Interesse</label>
                        <MultiSelect
                            id="areaInteresse"
                            value={areaInteresseTemp}
                            options={areasInteresse}
                            onChange={(e) => setAreaInteresseTemp(e.value)}
                            placeholder="Selecione uma ou mais áreas de interesse"
                            display="chip"
                            style={{ maxWidth: '100%', whiteSpace: 'normal', wordWrap: 'break-word' }}
                            className="multiselect-container"
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={exibirDialogoLinkedIn} style={{ width: '32rem' }} header="Adicionar LinkedIn" modal footer={(
                <div className='flex justify-end'>
                    <Button label="Cancelar" icon="pi pi-times" onClick={fecharDialogoLinkedIn} className="p-button-text p-button-danger" />
                    <Button label="Salvar" icon="pi pi-check" onClick={salvarLinkLinkedIn} autoFocus />
                </div>
            )} onHide={fecharDialogoLinkedIn}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="link">LinkedIn</label>
                        <InputText
                            id="link"
                            value={linkTemp}
                            onChange={(e) => setLinkTemp(e.target.value)}
                            placeholder="https://www.linkedin.com/in/Usuario"
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={exibirDialogoGitHub} style={{ width: '32rem' }} header="Adicionar GitHub" modal footer={(
                <div className='flex justify-end'>
                    <Button label="Cancelar" icon="pi pi-times" onClick={fecharDialogoGitHub} className="p-button-text p-button-danger" />
                    <Button label="Salvar" icon="pi pi-check" onClick={salvarLinkGitHub} autoFocus />
                </div>
            )} onHide={fecharDialogoGitHub}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="link">GitHub</label>
                        <InputText
                            id="link"
                            value={linkTemp}
                            onChange={(e) => setLinkTemp(e.target.value)}
                            placeholder="https://github.com/Usuario"
                        />
                    </div>
                </div>
            </Dialog>

            <Toast ref={toast} />
        </section>
    );
};

ProfilePage.guards = [GUARDS.ESTUDANTE, GUARDS.PROFESSOR_INTERNO, GUARDS.PROFESSOR_EXTERNO, GUARDS.COORDENADOR];
ProfilePage.title = 'Perfil';

export default ProfilePage;
