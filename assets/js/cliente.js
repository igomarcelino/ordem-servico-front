$(document).ready(function() {
    // Controla a exibição do formulário de adicionar cliente
    $('#toggleAddClientForm').on('click', function() {
        $('#addClientForm').toggle();
        $(this).text($(this).text() === 'Adicionar' ? 'Ocultar Formulário' : 'Adicionar');
    });

    // Controla a exibição da lista de clientes
    $('#toggleClientList').on('click', function() {
        $('#clientTable').toggle(); // Corrigido para mostrar/ocultar a tabela
        // Verifica o texto do botão e exibe ou oculta o botão de buscar
        if ($(this).text() !== 'Mostrar Lista de Clientes') {
            $('#fetchClientsButton').hide(); // Esconde o botão de buscar
        } else {
            $('#fetchClientsButton').show(); // Mostra o botão de buscar
        }
        $(this).text($(this).text() === 'Mostrar Lista de Clientes' ? 'Ocultar Lista de Clientes' : 'Mostrar Lista de Clientes');
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
    function fetchClients() {
        $.ajax({
            url: 'http://localhost:8080/cliente', // URL para buscar a lista de clientes
            type: 'GET',
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
                alert('Erro ao buscar a lista de clientes. Tente novamente.');
            }
        });
    }

    // Evento para buscar a lista de clientes ao clicar no botão "Buscar Clientes"
    $('#fetchClientsButton').on('click', function() {
        fetchClients(); // Chama a função que busca a lista de clientes
    });

     // Controla a exibição do formulário de busca de cliente

     $('#toggleSearchClientForm').on('click', function() {

        $('#searchClientForm').toggle();

        $(this).text($(this).text() === 'Buscar Cliente' ? 'Ocultar Formulário' : 'Buscar Cliente');

    });


    // Controla a exibição do formulário de busca de cliente

    $('#toggleSearchClientForm').on('click', function() {

        $('#searchClientForm').toggle();

        $(this).text($(this).text() === 'Buscar Cliente' ? 'Ocultar Formulário' : 'Buscar Cliente');

    });


     // Controla a exibição do formulário de busca de cliente

     $('#toggleSearchClientForm').on('click', function() {

        $('#searchClientForm').toggle();

        $(this).text($(this).text() === 'Buscar Cliente' ? 'Ocultar Formulário' : 'Buscar Cliente');

    });


    // Evento para buscar cliente pelo ID

    $('#searchClientButton').on('click', function() {

        const clientId = $('#clientId').val();

        if (clientId) {

            $.ajax({

                url: `http://localhost:8080/cliente/${clientId}`, // URL para buscar o cliente pelo ID

                type: 'GET',

                success: function(cliente) {

                    // Exibe os detalhes do cliente

                    $('#clientDetails').html(`

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


    // Evento para fechar o resultado da busca

    $('#closeResultButton').on('click', function() {

        $('#clientSearchResult').hide(); // Esconde a div de resultado

        $('#clientDetails').empty(); // Limpa o conteúdo do resultado

        $('#clientId').val(''); // Limpa o campo de ID

    });
});