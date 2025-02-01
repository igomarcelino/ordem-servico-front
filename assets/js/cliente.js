const authHeader = sessionStorage.getItem('authHeader');

$(document).ready(function() {
    // Controla a exibição do formulário de adicionar cliente
    $('#toggleAddClientForm').on('click', function() {
        $('#addClientForm').toggle();
        $(this).text($(this).text() === 'Adicionar' ? 'Ocultar Formulário' : 'Adicionar');
    });

    
    

    // Adiciona um novo cliente
    $('#addClientForm').on('submit', function(e) {
        e.preventDefault(); // Impede o envio padrão do formulário
    
        // Captura os dados do formulário
        const clienteData = {
            id: 0, // ID inicial, pode ser gerado pelo backend
            nome: $('#clientNome').val(),
            cpf: $('#clientCpf').val(),
            telefone: $('#clientTelefone').val(),
            email: $('#clientEmail').val(),
            endereco: {
                id: 0, // ID inicial para o endereço, se necessário
                rua: $('#clientRua').val(),
                numero: $('#clientNumero').val(),
                complemento: $('#clientComplemento').val(),
                bairro: $('#clientBairro').val(),
                cidade: $('#clientCidade').val(),
                estado: $('#clientEstado').val(),
                cep: $('#clientCep').val() 
            }
        };
    
        // Envia os dados para o backend
        $.ajax({
            url: 'http://localhost:8080/cliente',
            type: 'POST',
            headers: {
                'Authorization': authHeader, // Agora gera dinamicamente a autenticação correta
                'Content-Type': 'application/json'
            },
            xhrFields: {
                withCredentials: true // Garante o envio de cookies e JSESSIONID, se necessário
            },
            contentType: 'application/json', // Define o tipo de conteúdo como JSON
            data: JSON.stringify(clienteData), // Converte o objeto para uma string JSON
            success: function(response) {
                alert('Cliente cadastrado com sucesso!');
                $('#addClientForm')[0].reset(); // Limpa os campos do formulário
                fetchClients(); // Atualiza a lista de clientes
            },
            error: function() {
                alert('Erro ao cadastrar cliente. Tente novamente.');
            }
        });
    });

    // Função para buscar e exibir a lista de clientes
    // Função para buscar e exibir a lista de clientes com autenticação

    function fetchClients() {
        $.ajax({
            url: 'http://localhost:8080/cliente', // URL da API
            type: 'GET',
            headers: {
                'Authorization': authHeader, // autenticacao no header
                'Content-Type': 'application/json'
            },
            xhrFields: {
                withCredentials: true // Garante o envio de cookies e JSESSIONID, se necessário
            },
            success: function(response) {
                // Limpa a tabela anterior
                $('#clientList').empty();
    
                // Verifica se a resposta contém clientes
                if (response.length === 0) {
                    $('#clientList').append('<tr><td colspan="3">Nenhum cliente encontrado.</td></tr>');
                } else {
                    // Adiciona cada cliente à tabela
                    response.forEach(function(cliente) {
                        $('#clientList').append(`
                            <tr>
                                <td>${cliente.id}</td>
                                <td>${cliente.nome}</td>
                                <td>${cliente.cpf}</td>
                            </tr>
                        `);
                    });
                }
                // Exibe a tabela de clientes
                $('#clientTable').show();
            },
            error: function(xhr, status, error) {
                console.error('Erro ao buscar a lista de clientes:', error);
                alert('Erro ao buscar a lista de clientes. Verifique suas credenciais e tente novamente.');
            }
        });
    }
    

    // Evento para buscar a lista de clientes ao clicar no botão "Buscar Clientes"
    $('#fetchClientsButton').on('click', function() {
        fetchClients(); // Chama a função que busca a lista de clientes
    });

     
     


    // Evento para buscar cliente pelo ID
    $('#searchClientButton').on('click', function() {
        const clientId = $('#searchClientId').val();
        if (clientId) {
            $.ajax({
                url: `http://localhost:8080/cliente/${clientId}`, // URL para buscar o cliente pelo ID
                type: 'GET',
                headers: {
                    'Authorization': authHeader, // Agora gera dinamicamente a autenticação correta
                    'Content-Type': 'application/json'
                },
                xhrFields: {
                    withCredentials: true // Garante o envio de cookies e JSESSIONID, se necessário
                },
                success: function(cliente) {
                    // Exibe os detalhes do cliente
                    $('#searchResult').html(`
                        <strong>ID:</strong> ${cliente.id}<br>
                        <strong>Nome:</strong> ${cliente.nome}<br>
                        <strong>CPF:</strong> ${cliente.cpf}<br>
                        <strong>Telefone:</strong> ${cliente.telefone}<br>
                        <strong>Email:</strong> ${cliente.email}<br>
                        <strong>Endereço:</strong><br>
                        Rua: ${cliente.endereco.rua}, Número: ${cliente.endereco.numero}, Complemento: ${cliente.endereco.complemento},<br>
                        Bairro: ${cliente.endereco.bairro}, Cidade: ${cliente.endereco.cidade}, Estado: ${cliente.endereco.estado}, CEP: ${cliente.endereco.cep}
                    `);
                    $('#clientSearchResult').show(); // Mostra o resultado da busca
                },
                error: function() {
                    alert('Cliente não encontrado. Verifique o ID e tente novamente.');
                    $('#clientSearchResult').hide(); // Esconde o resultado da busca
                }
            });
        } else {
            alert('Por favor, insira um ID válido.');
        }
    });

    // funcao Deletar by ID
    $('#deleteByIDButton').on('click', function() {
        const clientId = $('#inputDeleteClienteById').val();
        
        if (clientId) {
            // Busca o cliente pelo ID antes de deletar
            $.ajax({
                url: `http://localhost:8080/cliente/${clientId}`,
                type: 'GET',
                headers: {
                    'Authorization': authHeader, 
                    'Content-Type': 'application/json'
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function(cliente) {
                    // Exibe os dados do cliente no #searchResult
                    $('#searchResultDelete').html(`
                        <h3>Dados do Cliente</h3>
                        <p><strong>ID:</strong> ${cliente.id}</p>
                        <p><strong>Nome:</strong> ${cliente.nome}</p>
                        <p><strong>Email:</strong> ${cliente.email}</p>
                        <p><strong>Telefone:</strong> ${cliente.telefone}</p>
                        <button id="confirmDeleteButton" style="background-color: red; color: white; padding: 10px; border: none; cursor: pointer;">
                            Confirmar Exclusão
                        </button>
                    `).show();
    
                    // Adiciona evento ao botão de confirmação
                    $('#confirmDeleteButton').on('click', function() {
                        if (confirm(`Tem certeza que deseja deletar o cliente "${cliente.nome}"?`)) {
                            // Realiza a exclusão
                            $.ajax({
                                url: `http://localhost:8080/cliente/${clientId}`,
                                type: 'DELETE',
                                headers: {
                                    'Authorization': authHeader, 
                                    'Content-Type': 'application/json'
                                },
                                xhrFields: {
                                    withCredentials: true
                                },
                                success: function() {
                                    $('#searchResultDelete').html(`<h1 style="color: red;">Cliente "${cliente.nome}" deletado com sucesso!</h1>`);
                                },
                                error: function() {
                                    alert('Erro ao deletar o cliente. Tente novamente.');
                                }
                            });
                        }
                    });
                },
                error: function() {
                    alert('Cliente não encontrado. Verifique o ID e tente novamente.');
                    $('#searchResult').hide();
                }
            });
        } else {
            alert('Por favor, insira um ID válido.');
        }
    });
    
$    
    // Evento para fechar o resultado da busca

    $('#closeResultButton').on('click', function() {
        $('#clientSearchResult').hide(); // Esconde a div de resultado
        $('#clientDetails').empty(); // Limpa o conteúdo do resultado
        $('#clientId').val(''); // Limpa o campo de ID
    });



    // Esconde todas as seções inicialmente

    $('.section').hide();
    // Função para mostrar a seção correspondente
    function showSection(sectionId) {
        $('.section').hide(); // Esconde todas as seções
        $(sectionId).show(); // Mostra a seção correspondente
    }


    // Eventos de clique para os botões do menu
    $('#showAddClient').click(function() {
        showSection('#addClient');
    });
    $('#showListClients').click(function() {
        showSection('#listClients');
    });
    $('#showSearchClient').click(function() {
        showSection('#searchClient');
    });
    // Eventos de clique para os botões de voltar
    $('#backToMenu1').click(function() {
        $('.section').hide(); // Volta para a seção de Adicionar Cliente
    });
    $('#backToMenu2').click(function() {
        $('.section').hide(); // Volta para a seção de Lista de Clientes
    });
    $('#backToMenu3').click(function() {
        $('.section').hide(); // Volta para a seção de Buscar Cliente
    });


    // Mostra a seção inicial (pode ser a primeira seção ou uma mensagem de boas-vindas)
    $('.section').hide(); // Exibe a seção de Adicionar Cliente por padrão
    $('#toggleCadastro').click(function() {
        $('#cadastroOptions').slideToggle();
        $('#buscarOptions').hide(); // Esconde as opções de busca
        $('#deletarOptions').hide();
        $('#addClient, #listClients, #searchClient, #searchByCpf, #deleteById').hide();
    });
    $('#toggleBuscar').click(function() {
        $('#buscarOptions').slideToggle();
        $('#cadastroOptions').hide(); // Esconde as opções de cadastro
        $('#deletarOptions').hide();
        $('#addClient, #listClients, #searchClient, #searchByCpf').hide();
    });

    $('#toggleDeletar').click(function(){
        $('#deletarOptions').slideToggle();
        $('#cadastroOptions').hide();
        $('#buscarOptions').hide();
        $('#addClient, #listClients, #searchClient, #searchByCpf, #deleteById').hide();
    });

    // funcoes de mostar o cliente
    
    $('#showAddClient').click(function() {

        $('#addClient').show();

        $('#listClients, #searchClient, #searchByCpf').hide();

    });


    $('#showListClients').click(function() {

        $('#listClients').show();

        $('#addClient, #searchClient, #searchByCpf').hide();

    });


    $('#showSearchClient').click(function() {

        $('#searchClient').show();

        $('#addClient, #listClients, #searchByCpf').hide();

    });


    $('#showSearchByCpf').click(function() {

        $('#searchByCpf').show();

        $('#addClient, #listClients, #searchClient').hide();

    });

    $('#showDeletarById').click(function(){
        $('#deleteById').show();
        $('#addClient, #listClients, #searchClient, #searchByCpf').hide();
    });


    // funcoes para retornar ao menu

    $('#backToMenu1, #backToMenu2, #backToMenu3, #backToMenu4').click(function() {

        $('#addClient, #listClients, #searchClient, #searchByCpf').hide();

        $('#cadastroOptions, #buscarOptions').hide(); // Esconde as opções do menu

    });


    $('#searchClientByCpfButton').click(function() {
        const cpf = $('#searchClientCpf').val();

        // Aqui você pode fazer a chamada AJAX para buscar o cliente pelo CPF

        $.ajax({

            url: `http://localhost:8080/cliente/cliente/${cpf}`, // Substitua pela sua URL de API

            method: 'GET',

            headers: {
                'Authorization': authHeader, // Agora gera dinamicamente a autenticação correta
                'Content-Type': 'application/json'
            },
            xhrFields: {
                withCredentials: true // Garante o envio de cookies e JSESSIONID, se necessário
            },
            success: function(data) {

                $('#searchByCpfResult').html(`

                    <p>ID: ${data.id}</p>

                    <p>Nome: ${data.nome}</p>

                    <p>CPF: ${data.cpf}</p>

                    <p>Telefone: ${data.telefone}</p>

                    <p>Email: ${data.email}</p>

                    <p>Endereço: ${data.endereco.rua}, ${data.endereco.numero}, ${data.endereco.bairro}, ${data.endereco.cidade}, ${data.endereco.estado}, ${data.endereco.cep}</p>

                `);

            },

            error: function() {

                $('#searchByCpfResult').html('<p>Cliente não encontrado.</p>');

            }

        });

    });
    
});