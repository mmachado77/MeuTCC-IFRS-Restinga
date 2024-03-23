async function getProfessores(data) {
    return fetch('http://localhost:8000/api/professores/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: data,
    }).then((response) => response.json()).catch((error) => console.error(error));
}

export default {
    getProfessores,
}