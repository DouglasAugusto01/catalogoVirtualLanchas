document.addEventListener('DOMContentLoaded', function() {
    // Obter o ID do produto da URL
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    if (!produtoId) {
        window.location.href = 'catalogo.html';
        return;
    }

    // Elementos da página
    const detalhesProduto = document.getElementById('detalhes-produto');
    const especificacoesProduto = document.getElementById('especificacoes-produto');
    const relacionados = document.getElementById('relacionados');
    const breadcrumbNome = document.getElementById('produto-nome-breadcrumb');

    // Funções utilitárias
    function formatarPreco(preco) {
        return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function criarElementoProduto(produto) {
        return `
            <div class="produto">
                <div class="produto-img">
                    <img src="images/${produto.imagem}" alt="${produto.nome}">
                </div>
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao.substring(0, 100)}${produto.descricao.length > 100 ? '...' : ''}</p>
                    <div class="preco">${formatarPreco(produto.preco)}</div>
                    <a href="produto.html?id=${produto.id}" class="btn">Ver Detalhes</a>
                </div>
            </div>
        `;
    }

    // Carregar produtos de arquivo JSON estático
    fetch('data/produtos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar produtos');
            }
            return response.json();
        })
        .then(produtos => {
            // Encontrar o produto pelo ID
            const produto = produtos.find(p => p.id === parseInt(produtoId));
            
            if (!produto) {
                throw new Error('Produto não encontrado');
            }
            
            // Atualizar breadcrumb
            if (breadcrumbNome) {
                breadcrumbNome.textContent = produto.nome;
            }
            
            // Atualizar título da página
            document.title = `${produto.nome} - NauticSport`;
            
            // Exibir detalhes do produto
            detalhesProduto.innerHTML = `
                <div class="produto-imagem">
                    <img src="images/${produto.imagem}" alt="${produto.nome}">
                </div>
                <div class="produto-info-detalhes">
                    <h3>${produto.nome}</h3>
                    <div class="descricao">${produto.descricao}</div>
                    <div class="preco">${formatarPreco(produto.preco)}</div>
                    <div class="estoque ${produto.estoque > 0 ? 'disponivel' : 'indisponivel'}">
                        ${produto.estoque > 0 ? `<i class="fas fa-check-circle"></i> Em estoque: ${produto.estoque} unidades` : '<i class="fas fa-times-circle"></i> Indisponível'}
                    </div>
                    <div class="produto-acoes">
                        <a href="index.html#contato" class="btn">Solicitar Orçamento</a>
                        <a href="https://wa.me/551199998888?text=Olá, tenho interesse no produto ${produto.nome}" class="btn btn-whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                    </div>
                </div>
            `;
            
            // Exibir especificações técnicas
            if (especificacoesProduto && produto.especificacoes) {
                const especificacoes = typeof produto.especificacoes === 'string' 
                    ? JSON.parse(produto.especificacoes) 
                    : produto.especificacoes;
                
                let especificacoesHTML = '<div class="especificacoes-lista">';
                
                for (const [chave, valor] of Object.entries(especificacoes)) {
                    const chaveFormatada = chave.charAt(0).toUpperCase() + chave.slice(1).replace(/_/g, ' ');
                    especificacoesHTML += `
                        <div class="especificacao-item">
                            <i class="fas fa-check"></i>
                            <span><strong>${chaveFormatada}:</strong> ${valor}</span>
                        </div>
                    `;
                }
                
                especificacoesHTML += '</div>';
                especificacoesProduto.innerHTML = especificacoesHTML;
            }
            
            // Carregar produtos relacionados
            if (relacionados) {
                // Filtrar produtos da mesma categoria
                const produtosRelacionados = produtos
                    .filter(p => p.categoria_id === produto.categoria_id && p.id !== parseInt(produtoId))
                    .slice(0, 3);
                
                if (produtosRelacionados.length > 0) {
                    relacionados.innerHTML = produtosRelacionados.map(criarElementoProduto).join('');
                } else {
                    document.querySelector('.produtos-relacionados').style.display = 'none';
                }
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            detalhesProduto.innerHTML = `
                <div class="erro-produto">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Produto não encontrado</h3>
                    <p>O produto que você está procurando não existe ou foi removido.</p>
                    <a href="catalogo.html" class="btn">Ver Catálogo</a>
                </div>
            `;
        });
});
