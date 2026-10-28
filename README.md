# NauticSport – Catálogo Virtual de Lanchas e Jetskis

Catálogo virtual estático para uma loja fictícia de lanchas e jetskis, construído com HTML, CSS e JavaScript puro (sem frameworks ou build step).

> Projeto originalmente desenvolvido para um cliente e disponibilizado aqui como peça de portfólio. Dados, imagens e informações de contato foram removidos/substituídos por placeholders para estar em conformidade com a LGPD.

## 🔗 Demo

https://douglasaugusto01.github.io/catalogoVirtualLanchas/

## ✨ Funcionalidades

- Página inicial com carrossel de produtos em destaque
- Catálogo com filtro por categoria, faixa de preço e ordenação
- Paginação dos resultados
- Página de detalhes do produto com especificações técnicas e produtos relacionados
- Formulário de contato (simulado, sem backend)
- Botão flutuante de WhatsApp e botão "voltar ao topo"
- Menu de navegação responsivo (hambúrguer) para dispositivos móveis
- Totalmente responsivo (mobile, tablet e desktop)

## 🛠️ Tecnologias

- HTML5 semântico
- CSS3 (variáveis, Grid, Flexbox, media queries)
- JavaScript (ES6+), sem dependências de frameworks
- [Font Awesome](https://fontawesome.com/) para ícones
- Dados simulados em arquivos JSON estáticos (`data/produtos.json`, `data/categorias.json`)

## 📁 Estrutura

```
├── index.html          # Página inicial
├── catalogo.html       # Catálogo com filtros e paginação
├── produto.html        # Detalhes do produto
├── 404.html            # Página de erro personalizada
├── css/style.css       # Estilos globais
├── js/
│   ├── common.js        # Configurações, menu mobile, WhatsApp flutuante, voltar ao topo
│   ├── main.js           # Lógica da home e do catálogo
│   └── produto.js        # Lógica da página de detalhes
├── data/
│   ├── produtos.json
│   └── categorias.json
└── images/
```

## ▶️ Como executar localmente

Por ser um projeto 100% estático, basta servir a pasta com qualquer servidor HTTP (necessário por causa das chamadas `fetch` aos arquivos JSON):

```bash
# usando Python
python -m http.server 8000

# ou usando Node (npx)
npx serve .
```

Depois acesse `http://localhost:8000`.

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE).

---

Desenvolvido por [Douglas Augusto](https://github.com/DouglasAugusto01).
