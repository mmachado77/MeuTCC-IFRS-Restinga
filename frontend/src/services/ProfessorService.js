async function getProfessores() {
    return await fetch('http://127.0.0.1:8000/app/getprofessores/', {
        method: 'GET',
    }).then((response) => response.json());
}

export default {
    getProfessores,
}