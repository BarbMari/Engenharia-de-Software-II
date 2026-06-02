//================Tela de Pedidos da Cozinha================
let pedidos = [];

async function fetchPedidos() {
    try {
        // Adjust path based on where you're running from
        const resp = await fetch('../Administrador/Js/listarPedidos.php', { cache: 'no-store' });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const data = await resp.json();
        if (Array.isArray(data)) return data;
        return [];
    } catch (err) {
        console.warn('Erro ao buscar pedidos:', err);
        return [];
    }
}

function renderPedidos(items) {
    pedidos = items;
    const main = document.querySelector('main.principal');
    if (!main) return;
    
    // Remove all existing pedido sections (keep header)
    const h1 = main.querySelector('h1');
    let targetContainer = main;
    if (h1) {
        // Keep the h1, insert after it
        const wrapper = document.createElement('div');
        wrapper.id = 'pedidos-container';
        if (h1.nextSibling) {
            h1.parentNode.insertBefore(wrapper, h1.nextSibling);
        } else {
            h1.parentNode.appendChild(wrapper);
        }
        targetContainer = wrapper;
    } else {
        targetContainer.innerHTML = '';
    }
    
    if (items.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'Nenhum pedido pendente';
        p.style.padding = '20px';
        p.style.textAlign = 'center';
        targetContainer.appendChild(p);
        return;
    }
    
    // Group by client or create individual sections
    items.forEach((pedido, idx) => {
        const section = document.createElement('section');
        section.id = 'pedido-' + pedido.id;
        
        const mesaH2 = document.createElement('h2');
        mesaH2.innerHTML = `Mesa <span>${pedido.id}</span>`;
        section.appendChild(mesaH2);
        
        const subSection = document.createElement('section');
        const pedidoH2 = document.createElement('h2');
        pedidoH2.innerHTML = `Pedido: <span>#${pedido.nomePedido || pedido.id}</span>`;
        subSection.appendChild(pedidoH2);
        
        const grid = document.createElement('div');
        grid.className = 'grid';
        
        const card = document.createElement('div');
        card.className = 'card';
        
        const ul = document.createElement('ul');
        
        // Parse observações to extract items (ideally this would come from a proper join in DB)
        // For now, display formatted info
        const liNome = document.createElement('li');
        liNome.innerHTML = `<p><strong>Cliente:</strong> ${pedido.nomeCliente}</p>`;
        ul.appendChild(liNome);
        
        if (pedido.observacoes) {
            const liObs = document.createElement('li');
            liObs.innerHTML = `<p><strong>Observações:</strong> ${pedido.observacoes}</p>`;
            ul.appendChild(liObs);
        }
        
        const liQtd = document.createElement('li');
        liQtd.innerHTML = `<p><strong>Itens:</strong> ${pedido.qtdItens}</p>`;
        ul.appendChild(liQtd);
        
        const liVal = document.createElement('li');
        liVal.innerHTML = `<p><strong>Valor:</strong> R$ ${pedido.valor.toFixed(2).replace('.', ',')}</p>`;
        ul.appendChild(liVal);
        
        const liPag = document.createElement('li');
        liPag.innerHTML = `<p><strong>Pagamento:</strong> ${pedido.pagamento || 'indefinido'}</p>`;
        ul.appendChild(liPag);
        
        // Add a button to mark as done
        const liBtn = document.createElement('li');
        const btnConcluir = document.createElement('button');
        btnConcluir.textContent = 'Concluído';
        btnConcluir.style.padding = '8px 16px';
        btnConcluir.style.marginTop = '10px';
        btnConcluir.style.backgroundColor = '#2c5530';
        btnConcluir.style.color = 'white';
        btnConcluir.style.border = 'none';
        btnConcluir.style.cursor = 'pointer';
        btnConcluir.addEventListener('click', () => markOrderDone(pedido.id, section));
        liBtn.appendChild(btnConcluir);
        ul.appendChild(liBtn);
        
        card.appendChild(ul);
        grid.appendChild(card);
        subSection.appendChild(grid);
        section.appendChild(subSection);
        
        targetContainer.appendChild(section);
    });
}

async function markOrderDone(pedidoId, element) {
    // Could call an endpoint to update status in DB
    // For now just remove from display
    element.style.opacity = '0.5';
    element.style.textDecoration = 'line-through';
    // setTimeout(() => element.remove(), 500);
}

async function loadAndRender() {
    const items = await fetchPedidos();
    renderPedidos(items);
}

document.addEventListener('DOMContentLoaded', () => {
    loadAndRender();
    // Refresh pedidos every 5 seconds
    setInterval(loadAndRender, 5000);
});
