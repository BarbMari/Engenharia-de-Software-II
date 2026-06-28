//================Página de Pagamento================
let cartData = {};
let total = 0;

function formatCurrencyBR(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function loadCartFromStorage() {
    try {
        const stored = localStorage.getItem('pedidoCart');
        if (stored) cartData = JSON.parse(stored);
    } catch (e) {
        console.warn('Erro ao carregar carrinho:', e);
        cartData = {};
    }
}

function renderReview() {
    loadCartFromStorage();
    
    const pizzaSection = document.getElementById('secaoPizza');
    const bebidaSection = document.getElementById('secaoBebida');
    
    if (!pizzaSection || !bebidaSection) return;
    
    // liimpa as lista que ja existem
    let pizzaUl = pizzaSection.querySelector('ul');
    let bebidaUl = bebidaSection.querySelector('ul');
    
    if (!pizzaUl) { pizzaUl = document.createElement('ul'); pizzaSection.appendChild(pizzaUl); }
    if (!bebidaUl) { bebidaUl = document.createElement('ul'); bebidaSection.appendChild(bebidaUl); }
    
    pizzaUl.innerHTML = '';
    bebidaUl.innerHTML = '';

    
    Object.entries(cartData).forEach(([itemId, { item, qty }]) => {
        if (qty <= 0) return;
        
        const subtotal = item.preco * qty;
        total += subtotal;
        
        const li = document.createElement('li');
        li.innerHTML = `${qty}x - ${item.nome}<t>R$<span class="preco">${item.preco.toFixed(2).replace('.', ',')}</span></t><button class="btn-remover" data-id="${itemId}">-</button>`;
        
        // Identify category
        const tipo = (item.tipo || '').toLowerCase();
        if (tipo.includes('pizza') || tipo.includes('salg') || tipo.includes('veget') || tipo.includes('doce')) {
            pizzaUl.appendChild(li);
        } else if (tipo.includes('bebid') || tipo.includes('refriger') || tipo.includes('suco') || tipo.includes('destil')) {
            bebidaUl.appendChild(li);
        }
        
        // Remove o botao
        li.querySelector('.btn-remover').addEventListener('click', () => removeFromPaymentReview(itemId));
    });
    
    // Oculta se ta vazio
    pizzaSection.style.display = pizzaUl.children.length > 0 ? 'block' : 'none';
    bebidaSection.style.display = bebidaUl.children.length > 0 ? 'block' : 'none';
    
    // Atualiza totals
    document.querySelectorAll('.valorFinal').forEach(el => {
        el.textContent = total === 0 ? '0,00' : formatCurrencyBR(total).replace('R$', '').trim();
    });
}

function removeFromPaymentReview(itemId) {
    if (cartData[itemId]) {
        cartData[itemId].qty = Math.max(0, cartData[itemId].qty - 1);
        if (cartData[itemId].qty === 0) delete cartData[itemId];
        localStorage.setItem('pedidoCart', JSON.stringify(cartData));
        renderReview();
    }
}

async function submitOrder() {
    loadCartFromStorage();
    
    const formaPagamento = document.getElementById('formaPagamento').value;
    const observacoes = document.getElementById('obsBox').value || '';
    const nomeCliente = document.getElementById('nameBox').value;
    
    if (!formaPagamento) {
        alert('Selecione uma forma de pagamento');
        return;
    }
    
    if (Object.keys(cartData).length === 0) {
        alert('Carrinho vazio');
        return;
    }
    
    // Prepare order payload
    const orderItems = Object.entries(cartData).map(([id, { item, qty }]) => ({
        itemId: item.id,
        nome: item.nome,
        quantidade: qty,
        valor: item.preco
    }));
    
    let itens = "";
    
    for (let i = 0; i < orderItems.length; i++) {
        itens += orderItems[i].nome + ", ";
    }
    
    const payload = {
        total,  
        nomeCliente,
        observacoes,
        formaPagamento,
        itens: itens
    };
    
    try {
        const resp = await fetch('../Cliente/Js/salvarPedido.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const result = await resp.json();
        
        if (result.success) {
            localStorage.removeItem('pedidoCart');
            window.location.href = 'pedidoConcluido.html?pedidoId=' + result.pedidoId;
        } else {
            alert('Erro ao salvar pedido: ' + (result.message || 'desconhecido'));
        }
    } catch (err) {
        alert('Erro ao enviar pedido: ' + err.message);
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderReview();
    
    // Wire up the confirm button
    const confirmBtn = document.querySelector('#confirmaPedido button') || document.querySelector('.sendButton');
    if (confirmBtn) {
        confirmBtn.onclick = (e) => {
            e.preventDefault();
            submitOrder();
        };
    }
});
