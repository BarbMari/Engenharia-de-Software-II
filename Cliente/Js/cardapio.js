//================Cardápio (fetch from server)================
let currentItems = [];
const cart = {};

function formatCurrencyBR(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function updateResumo() {
    const resumo = document.querySelector('.resumo-pedido ul');
    const valorSpan = document.getElementById('valorFInal');
    resumo.innerHTML = '';
    let total = 0;
    Object.values(cart).forEach(({ item, qty }) => {
        const li = document.createElement('li');
        li.textContent = `${qty}x ${item.nome} - ${formatCurrencyBR(item.preco)}`;
        resumo.appendChild(li);
        total += item.preco * qty;
    });
    valorSpan.textContent = total === 0 ? '0,00' : formatCurrencyBR(total).replace('R$', '').trim();
}

function addToCart(id) {
    const item = currentItems.find(it => String(it.id) === String(id));
    if (!item) return;
    if (!cart[id]) cart[id] = { item, qty: 0 };
    cart[id].qty += 1;
    updateResumo();
}

function removeFromCart(id) {
    if (!cart[id]) return;
    cart[id].qty = Math.max(0, cart[id].qty - 1);
    if (cart[id].qty === 0) delete cart[id];
    updateResumo();
}

function guessMatches(headerText, tipo) {
    const h = (headerText || '').toLowerCase();
    const t = (tipo || '').toLowerCase();
    if (!t) return false;
    if (h.includes('salgada')    && t === 'salgada')    return true;
    if (h.includes('vegetarian') && t === 'vegetariana') return true;
    if (h.includes('doce')       && t === 'doce')       return true;
    if (h.includes('bebida')     && t === 'bebida')     return true;
    return false;
}

function renderItems(items) {
    currentItems = items.map(it => ({
        id:           it.id,
        nome:         it.nome   || it.Nome   || 'Sem nome',
        preco:        Number(it.preco  ?? it.Valor ?? 0),
        imagem:       it.imagem || it.Imagem || null,
        ingredientes: it.ingredientes || it.Igredientes || it.resumo || '',
        tipo:         it.tipo   || it.Tipo   || ''
    }));

    if (!currentItems.length) {
        document.querySelectorAll('.grid').forEach(g => g.innerHTML = '');
        return;
    }

    document.querySelectorAll('.grid').forEach(grid => {
        const sec = grid.closest('section');
        const header = sec
            ? (sec.querySelector('h2') || sec.querySelector('h1') || {}).textContent || ''
            : '';

        const toRender = currentItems.filter(it => guessMatches(header, it.tipo));
        if (!toRender.length) { grid.innerHTML = ''; return; }

        const template = grid.querySelector('.card');
        grid.innerHTML = '';

        toRender.forEach(item => {
            let card;
            if (template) {
                card = template.cloneNode(true);
                const img  = card.querySelector('img');           if (img)  { img.src = item.imagem || ''; img.alt = item.nome; }
                const h3   = card.querySelector('h3');            if (h3)   h3.textContent = item.nome;
                const p    = card.querySelector('p');             if (p)    p.textContent  = item.ingredientes || '';
                const span = card.querySelector('.preco');        if (span) span.textContent = `R$ ${Number(item.preco).toFixed(2).replace('.', ',')}`;

                const addBtnOld = card.querySelector('.btn-adicionar');
                const remBtnOld = card.querySelector('.btn-remover');
                if (addBtnOld) { const b = addBtnOld.cloneNode(true); addBtnOld.replaceWith(b); b.addEventListener('click', () => addToCart(item.id)); }
                if (remBtnOld) { const b = remBtnOld.cloneNode(true); remBtnOld.replaceWith(b); b.addEventListener('click', () => removeFromCart(item.id)); }
            } else {
                card = document.createElement('div'); card.className = 'card';
                const img  = document.createElement('img');  img.src = item.imagem || ''; img.alt = item.nome; card.appendChild(img);
                const h3   = document.createElement('h3');   h3.textContent = item.nome; card.appendChild(h3);
                const p    = document.createElement('p');    p.textContent  = item.ingredientes || ''; card.appendChild(p);
                const span = document.createElement('span'); span.className = 'preco'; span.textContent = `R$ ${Number(item.preco).toFixed(2).replace('.', ',')}`; card.appendChild(span);
                const botoes = document.createElement('div'); botoes.className = 'botoes';
                const btnAdd = document.createElement('button'); btnAdd.className = 'btn-adicionar'; btnAdd.textContent = '+'; btnAdd.addEventListener('click', () => addToCart(item.id));
                const btnRem = document.createElement('button'); btnRem.className = 'btn-remover';   btnRem.textContent = '-'; btnRem.addEventListener('click', () => removeFromCart(item.id));
                botoes.appendChild(btnAdd); botoes.appendChild(btnRem); card.appendChild(botoes);
            }
            grid.appendChild(card);
        });
    });
}

async function fetchMenu() {
    try {
        const resp = await fetch('../Administrador/php/cardapio.php', { cache: 'no-store' });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const data = await resp.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.warn('cardapio fetch failed:', err);
        return [];
    }
}

function saveCartToStorage() {
    localStorage.setItem('pedidoCart', JSON.stringify(cart));
}

function goToPayment() {
    saveCartToStorage();
    window.location.href = 'pagamento.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    const items = await fetchMenu();
    renderItems(items);
    updateResumo();

    const pagamentoLink = document.querySelector('.pagamento a');
    if (pagamentoLink) {
        pagamentoLink.addEventListener('click', (e) => {
            e.preventDefault();
            goToPayment();
        });
    }
});
