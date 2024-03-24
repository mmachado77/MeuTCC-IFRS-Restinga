async function submeterProposta(data) {
    return fetch('http://localhost:8000/api/tccs/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    }).then((response) => response.json()).catch((error) => console.error(error));
}

export default {
    submeterProposta,
}