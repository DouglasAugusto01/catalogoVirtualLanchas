// Configurações compartilhadas do site (dados fictícios/placeholder)
const SITE_CONFIG = {
    whatsappNumber: '5511999998888', // DDI + DDD + número, somente dígitos
    phoneDisplay: '(11) 99999-8888',
    email: 'contato@nauticsport.com.br'
};

document.addEventListener('DOMContentLoaded', function () {
    // Menu mobile (hambúrguer)
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            const aberto = navMenu.classList.toggle('open');
            menuToggle.classList.toggle('active', aberto);
            menuToggle.setAttribute('aria-expanded', aberto);
        });

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Preenche links/textos de contato a partir da configuração central
    document.querySelectorAll('[data-whatsapp]').forEach(function (link) {
        const mensagem = link.getAttribute('data-whatsapp') || 'Olá! Gostaria de mais informações.';
        link.href = 'https://wa.me/' + SITE_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(mensagem);
        link.target = '_blank';
        link.rel = 'noopener';
    });

    document.querySelectorAll('[data-tel]').forEach(function (link) {
        link.href = 'tel:+' + SITE_CONFIG.whatsappNumber;
    });

    document.querySelectorAll('[data-email-text]').forEach(function (el) {
        el.textContent = SITE_CONFIG.email;
        if (el.tagName === 'A') {
            el.href = 'mailto:' + SITE_CONFIG.email;
        }
    });

    document.querySelectorAll('[data-phone-text]').forEach(function (el) {
        el.textContent = SITE_CONFIG.phoneDisplay;
    });

    // Botão flutuante do WhatsApp
    const whatsappFloat = document.createElement('a');
    whatsappFloat.className = 'whatsapp-float';
    whatsappFloat.href = 'https://wa.me/' + SITE_CONFIG.whatsappNumber + '?text=' +
        encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos da NauticSport.');
    whatsappFloat.target = '_blank';
    whatsappFloat.rel = 'noopener';
    whatsappFloat.setAttribute('aria-label', 'Conversar no WhatsApp');
    whatsappFloat.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i>';
    document.body.appendChild(whatsappFloat);

    // Botão "voltar ao topo"
    const backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Voltar ao topo');
    backToTop.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function () {
        backToTop.classList.toggle('show', window.scrollY > 400);
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
