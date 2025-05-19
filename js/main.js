document.addEventListener('DOMContentLoaded', function() {
    // Elementos comuns
    const carrossel = document.getElementById('carrossel');
    const destaques = document.getElementById('destaques');
    const catalogo = document.getElementById('catalogo');
    
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
            // Remover loading se existir
            const loadingElements = document.querySelectorAll('.loading');
            loadingElements.forEach(el => el.remove());
            
            // Página inicial - Carrossel
            if (carrossel) {
                let currentIndex = 0;
                const produtosDestaque = produtos.filter(p => p.destaque);
                
                function showNextImage() {
                    if (produtosDestaque.length === 0) return;
                    
                    const produto = produtosDestaque[currentIndex];
                    carrossel.innerHTML = `
                        <img src="images/${produto.imagem}" alt="${produto.nome}">
                        <div class="carrossel-info">
                            <h3>${produto.nome}</h3>
                            <p>${formatarPreco(produto.preco)}</p>
                            <a href="produto.html?id=${produto.id}" class="btn">Ver Detalhes</a>
                        </div>
                    `;
                    currentIndex = (currentIndex + 1) % produtosDestaque.length;
                }
                
                showNextImage();
                setInterval(showNextImage, 5000);
            }
            
            // Página inicial - Produtos em destaque
            if (destaques) {
                const produtosDestaque = produtos.filter(p => p.destaque).slice(0, 6);
                destaques.innerHTML = produtosDestaque.map(criarElementoProduto).join('');
            }
            
            // Página de catálogo
            if (catalogo) {
                // Configurar filtros
                const categoriaSelect = document.getElementById('categoria');
                const precoRange = document.getElementById('preco');
                const precoValor = document.getElementById('preco-valor');
                const ordenarSelect = document.getElementById('ordenar');
                const aplicarFiltrosBtn = document.getElementById('aplicar-filtros');
                const anteriorBtn = document.getElementById('anterior');
                const proximoBtn = document.getElementById('proximo');
                const paginasDiv = document.getElementById('paginas');
                
                let produtosFiltrados = [...produtos];
                let paginaAtual = 1;
                const itensPorPagina = 9;
                
                // Carregar categorias para o select
                if (categoriaSelect) {
                    fetch('data/categorias.json')
                        .then(response => response.json())
                        .then(categorias => {
                            categorias.forEach(categoria => {
                                const option = document.createElement('option');
                                option.value = categoria.id;
                                option.textContent = categoria.nome;
                                categoriaSelect.appendChild(option);
                            });
                        });
                }
                
                // Atualizar exibição do valor do preço
                if (precoRange && precoValor) {
                    precoRange.addEventListener('input', function() {
                        precoValor.textContent = formatarPreco(parseFloat(this.value));
                    });
                }
                
                // Aplicar filtros
                function aplicarFiltros() {
                    const categoria = categoriaSelect ? categoriaSelect.value : 'todos';
                    const precoMaximo = precoRange ? parseFloat(precoRange.value) : Infinity;
                    const ordenacao = ordenarSelect ? ordenarSelect.value : 'nome';
                    
                    // Filtrar por categoria e preço
                    produtosFiltrados = produtos.filter(produto => {
                        const categoriaMatch = categoria === 'todos' || produto.categoria_id.toString() === categoria;
                        const precoMatch = produto.preco <= precoMaximo;
                        return categoriaMatch && precoMatch;
                    });
                    
                    // Ordenar produtos
                    produtosFiltrados.sort((a, b) => {
                        switch (ordenacao) {
                            case 'nome':
                                return a.nome.localeCompare(b.nome);
                            case 'preco-asc':
                                return a.preco - b.preco;
                            case 'preco-desc':
                                return b.preco - a.preco;
                            case 'recentes':
                                return new Date(b.created_at) - new Date(a.created_at);
                            default:
                                return 0;
                        }
                    });
                    
                    paginaAtual = 1;
                    atualizarCatalogo();
                }
                
                // Atualizar catálogo com paginação
                function atualizarCatalogo() {
                    const inicio = (paginaAtual - 1) * itensPorPagina;
                    const fim = inicio + itensPorPagina;
                    const produtosPagina = produtosFiltrados.slice(inicio, fim);
                    
                    catalogo.innerHTML = produtosPagina.length > 0 
                        ? produtosPagina.map(criarElementoProduto).join('') 
                        : '<div class="sem-resultados">Nenhum produto encontrado com os filtros selecionados.</div>';
                    
                    // Atualizar paginação
                    const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);
                    
                    if (anteriorBtn) {
                        anteriorBtn.disabled = paginaAtual === 1;
                    }
                    
                    if (proximoBtn) {
                        proximoBtn.disabled = paginaAtual === totalPaginas || totalPaginas === 0;
                    }
                    
                    if (paginasDiv) {
                        paginasDiv.innerHTML = '';
                        for (let i = 1; i <= totalPaginas; i++) {
                            const btn = document.createElement('button');
                            btn.textContent = i;
                            btn.classList.toggle('active', i === paginaAtual);
                            btn.addEventListener('click', () => {
                                paginaAtual = i;
                                atualizarCatalogo();
                            });
                            paginasDiv.appendChild(btn);
                        }
                    }
                }
                
                // Configurar eventos
                if (aplicarFiltrosBtn) {
                    aplicarFiltrosBtn.addEventListener('click', aplicarFiltros);
                }
                
                if (anteriorBtn) {
                    anteriorBtn.addEventListener('click', () => {
                        if (paginaAtual > 1) {
                            paginaAtual--;
                            atualizarCatalogo();
                        }
                    });
                }
                
                if (proximoBtn) {
                    proximoBtn.addEventListener('click', () => {
                        const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);
                        if (paginaAtual < totalPaginas) {
                            paginaAtual++;
                            atualizarCatalogo();
                        }
                    });
                }
                
                // Inicializar catálogo
                aplicarFiltros();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            const loadingElements = document.querySelectorAll('.loading');
            loadingElements.forEach(el => {
                el.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Erro ao carregar produtos. Por favor, tente novamente mais tarde.</p>
                `;
            });
        });
    
    // Formulário de contato
    const contatoForm = document.querySelector('.contato-form');
    if (contatoForm) {
        contatoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const mensagem = document.getElementById('mensagem').value;
            
            // Simulação de envio de formulário (sem backend)
            alert(`Obrigado ${nome}! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.`);
            contatoForm.reset();
        });
    }
    
    // Smooth scroll para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});
