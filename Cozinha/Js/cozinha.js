//================Tela de Pedidos da Cozinha================
let pedidos = [];

async function fetchPedidos() {
    try {
        const resp = await fetch('Js/listarPedidos.php', { cache: 'no-store' });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const data = await resp.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        return [];
    }
}

function renderPedidos(items) {
    pedidos = items;
    const main = document.querySelector('main.principal');
    if (!main) return;

    const h1 = main.querySelector('h1');
    main.innerHTML = '';
    if (h1) main.appendChild(h1);

    const container = document.createElement('div');
    container.id = 'pedidos-container';
    main.appendChild(container);

    if (items.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'Nenhum pedido pendente';
        p.style.cssText = 'padding:20px; text-align:center';
        container.appendChild(p);
        return;
    }

    items.forEach((pedido) => {
        const section = document.createElement('section');
        section.id = 'pedido-' + pedido.id;
        section.style.marginBottom = '20px';

        const mesaH2 = document.createElement('h2');
        mesaH2.innerHTML = `Cliente: <span>${pedido.nomeCliente || 'Cliente'}</span>`;
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

        // Itens
        const itensTexto = (pedido.itens || '').toString().trim();
        if (itensTexto) {
            const liItens = document.createElement('li');
            liItens.innerHTML = `<p><strong>Itens:</strong> ${itensTexto}</p>`;
            ul.appendChild(liItens);
        }

        // Observações (só mostra se diferente dos itens)
        if (pedido.observacoes && pedido.observacoes !== itensTexto) {
            const liObs = document.createElement('li');
            liObs.innerHTML = `<p><strong>Observações:</strong> ${pedido.observacoes}</p>`;
            ul.appendChild(liObs);
        }

        // Valor
        const liVal = document.createElement('li');
        liVal.innerHTML = `<p><strong>Valor:</strong> R$ ${(Number(pedido.valor) || 0).toFixed(2).replace('.', ',')}</p>`;
        ul.appendChild(liVal);

        // Pagamento
        const liPag = document.createElement('li');
        liPag.innerHTML = `<p><strong>Pagamento:</strong> ${pedido.pagamento || 'indefinido'}</p>`;
        ul.appendChild(liPag);

        // Botão Concluído
        const liBtn = document.createElement('li');
        const btnConcluir = document.createElement('button');
        btnConcluir.textContent = 'Concluído';
        btnConcluir.style.cssText = 'padding:8px 16px; margin-top:10px; background:#2c5530; color:white; border:none; cursor:pointer; border-radius:4px';
        btnConcluir.addEventListener('click', () => markOrderDone(pedido.id, section));
        liBtn.appendChild(btnConcluir);
        ul.appendChild(liBtn);

        card.appendChild(ul);
        grid.appendChild(card);
        subSection.appendChild(grid);
        section.appendChild(subSection);
        container.appendChild(section);
    });
}

async function markOrderDone(pedidoId, element) {
    // Feedback visual imediato
    element.style.opacity = '0.4';
    element.style.pointerEvents = 'none';

    // Remove da lista local e re-renderiza após 1s
    setTimeout(() => {
        pedidos = pedidos.filter(p => p.id !== pedidoId);
        renderPedidos(pedidos);
    }, 800);
    await fetch('Js/concluirPedido.php', { method: 'POST', body: JSON.stringify({ id: pedidoId }) });
}

async function loadAndRender() {
    const items = await fetchPedidos();
    renderPedidos(items);
}

document.addEventListener('DOMContentLoaded', () => {
    loadAndRender();
    setInterval(loadAndRender, 5000); // atualiza a cada 5 segundos
});
