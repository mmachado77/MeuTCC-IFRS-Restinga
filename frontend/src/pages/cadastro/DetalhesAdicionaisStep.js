import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Steps } from 'primereact/steps';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import UsuarioService from 'meutcc/services/UsuarioService';


const DetalhesAdicionaisStep = ({ IsInterno, userData, setUserData, grausAcademicos, setActiveIndex, activeIndex }) => {
    const toast = useRef(null);
    const [identidade, setIdentidade] = useState(null);
    const [diploma, setDiploma] = useState(null);


    const onFieldChange = (e, fieldName) => {
        setUserData({ ...userData, [fieldName]: e.target.value });
    };

    const onFileSelect = (e, setFile) => {
        if (e.files && e.files.length > 0) {
            setFile(e.files[0]); // Acessando o primeiro arquivo selecionado
        }
    };



    const validateAndSubmit = () => {
        let error = false;

        if (!IsInterno && !userData.grau) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Grau deve ser preenchido para usuários externos.', life: 3000 });
            error = true;
        }
        if (!IsInterno && !userData.area) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Área deve ser preenchida para usuários externos.', life: 3000 });
            error = true;
        }
        if (IsInterno && userData.isProfessor && !userData.matricula) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Matrícula deve ser preenchida para professores internos.', life: 3000 });
            error = true;
        }
        if (IsInterno && userData.isProfessor && !userData.grau) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Grau deve ser preenchido para professores internos.', life: 3000 });
            error = true;
        }
        if (IsInterno && userData.isProfessor && !userData.area) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Área deve ser preenchida para professores internos.', life: 3000 });
            error = true;
        }
        if (IsInterno && !userData.isProfessor && !userData.matricula) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Matrícula deve ser preenchida para estudantes.', life: 3000 });
            error = true;
        }

        if (!error) {
            const formData = new FormData();
            formData.append('nome', userData.nome);
            formData.append('cpf', userData.cpf);
            formData.append('email', userData.email);
            formData.append('grau', userData.grau);
            formData.append('area', userData.area);
            formData.append('titulo', userData.titulo);
            formData.append('avatar', userData.avatar);
            if (userData.matricula) formData.append('matricula', userData.matricula);
            if (userData.grau) formData.append('grau', userData.grau);
            if (userData.area) formData.append('area', userData.area);
            if (userData.titulo) formData.append('titulo', userData.titulo);

            // Certifique-se de que 'identidade' e 'diploma' são realmente arquivos
            if (identidade) {
                formData.append('identidade', identidade, identidade.name);
            }
            if (diploma) {
                formData.append('diploma', diploma, diploma.name);
            }

            UsuarioService.criarUsuario(formData)
                .then(response => {
                    console.log('Usuário criado com sucesso:', response);
                    window.location.pathname = ('/');
                })
                .catch(error => {
                    console.error('Erro ao criar usuário:', error);
                });
        }
    };




    const steps = [
        { label: 'Dados Pessoais' },
        { label: 'Escolha o Tipo' },
        { label: 'Detalhes Adicionais' }
    ];

    return (
        <div className='py-6 px-9'>
            <Toast ref={toast} />
            <div className='max-w-screen-md mx-auto bg-white m-3 mt-6 flex flex-col py-6 px-9'>
                <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                    <Steps model={steps} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true} />
                    <h1 className='heading-1 text-center text-gray-700'>Dados Adicionais</h1>
                </div>
                {IsInterno === false ? (
                    <>
                        <Dropdown className='w-full mb-2' value={userData.grau} options={grausAcademicos} onChange={(e) => onFieldChange(e, 'grau')} placeholder="Selecione o Grau Acadêmico" />
                        <InputText className='w-full mb-2' value={userData.area} onChange={(e) => onFieldChange(e, 'area')} placeholder="Área de Atuação" />
                        <InputText className='w-full mb-2' value={userData.titulo} onChange={(e) => onFieldChange(e, 'titulo')} placeholder="Títulos" />
                        <label htmlFor='identidade' className='font-bold text-gray-700'> Documento de Identidade: </label>
                        <FileUpload name="identidade" mode="basic" auto={false} accept="application/pdf,image/png,image/jpeg" maxFileSize={5000000} label="Upload Identidade" chooseLabel="Selecionar Identidade" onSelect={(e) => onFileSelect(e, setIdentidade)} className="w-full p-button-sm p-button-outlined" style={{ marginBottom: '10px', marginTop: '5px', border: '1px solid #ccc', padding: '10px', borderRadius: '10px', justifyContent: 'space-between' }} />
                        <label htmlFor='diploma' className='font-bold text-gray-700'> Diploma: </label>
                        <FileUpload name="diploma" mode="basic" auto={false} accept="application/pdf,image/png,image/jpeg" maxFileSize={5000000} label="Upload Diploma" chooseLabel="Selecionar Diploma" onSelect={(e) => onFileSelect(e, setDiploma)} className="w-full p-button-sm p-button-outlined" style={{ marginBottom: '10px', marginTop: '5px', border: '1px solid #ccc', padding: '10px', borderRadius: '10px', justifyContent: 'space-between' }} />
                        <Button className='w-full mb-2' label="Concluir Cadastro" onClick={validateAndSubmit} />
                    </>
                ) : userData.isProfessor === false ? (
                    <>
                        <InputText className='w-full mb-2' value={userData.matricula} placeholder="Matrícula" onChange={(e) => onFieldChange(e, 'matricula')} />
                        <Button className='w-full mb-2' label="Concluir Cadastro" onClick={validateAndSubmit} />
                    </>
                ) : (
                    <>
                        <InputText className='w-full mb-2' value={userData.matricula} placeholder="Matrícula" onChange={(e) => onFieldChange(e, 'matricula')} />
                        <Dropdown className='w-full mb-2' value={userData.grau} options={grausAcademicos} onChange={(e) => onFieldChange(e, 'grau')} placeholder="Selecione o Grau Acadêmico" />
                        <InputText className='w-full mb-2' value={userData.area} placeholder="Área" onChange={(e) => onFieldChange(e, 'area')} />
                        <InputText className='w-full mb-2' value={userData.titulo} onChange={(e) => onFieldChange(e, 'titulo')} placeholder="Títulos" />
                        <Button className='w-full mb-2' label="Concluir Cadastro" onClick={validateAndSubmit} />
                    </>
                )}
            </div>
        </div>
    );

};


export default DetalhesAdicionaisStep;
