// script.js
const API_BASE_URL = 'http://localhost:8080';

function loadPage(entity) {
    const content = document.getElementById('content');
    content.innerHTML = `<p>Carregando ${entity}...</p>`;

    fetch(`${API_BASE_URL}/${entity}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar dados');
            return response.json();
        })
        .then(data => {
            renderData(entity, data);
        })
        .catch(err => {
            content.innerHTML = `<p>Erro ao carregar ${entity}: ${err.message}</p>`;
        });
}

function renderData(entity, data) {
    const content = document.getElementById('content');
    if (data.length === 0) {
        content.innerHTML = `<p>Nenhum dado encontrado para ${entity}.</p>`;
        return;
    }

    let table = `<table>
        <thead><tr>${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}</tr></thead>
        <tbody>
            ${data.map(row => `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}
        </tbody>
    </table>`;
    content.innerHTML = table;
}

