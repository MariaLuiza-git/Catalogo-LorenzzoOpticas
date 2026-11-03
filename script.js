let sacola = JSON.parse(localStorage.getItem('sacola'))  || [];

function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
}

function salvarSacola() {
    localStorage.setItem('sacola', JSON.stringify(sacola));
}

function renderizarSacola() {
    const lista = document.getElementById('listaSacola');
    let totalPedido = 0;
    let totalItens = 0;

    lista.innerHTML = sacola.map(function (item){
        const totalItem = item.preco * item.qtd;
        totalPedido += totalItem;
        totalItens += item.qtd;

        return `
        <li class="sacola-item">
        <img src="${item.imagem}" alt="${item.nome}" class="sacola-foto">
        <div class="sacola-info">
          <div class="item-topo">
            <h4 class="sacola-nome">${item.nome}</h4>
            <button class="btn-lixeira" data-acao="remover" data-id="${item.id}" aria-label="Remover produto">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
          <div class="sacola-base">
            <div class="sacola-preco">
              <span>Total</span>
              <strong>${formatarPreco(totalItem)}</strong>
            </div>
            <div class="seletor-qtd">
              <button data-acao="diminuir" data-id="${item.id}">−</button>
              <span>${String(item.qtd).padStart(2, '0')}</span>
              <button data-acao="aumentar" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </li>
        `;
    }).join('');

    document.getElementById('sacolaTotal').textContent = formatarPreco(totalPedido);
    document.getElementById('sacolaContador').textContent = totalItens;
}

document.getElementById('listaSacola').addEventListener('click', function (evento) {
  const botao = evento.target.closest('button');
  if (!botao) return;

  const id = botao.dataset.id;
  const acao = botao.dataset.acao;
  const item = sacola.find(function (produto) {
    return String(produto.id) === id;
  });
  if (!item) return;

  if (acao === 'aumentar') {
    item.qtd++;
  } else if (acao === 'diminuir') {
    item.qtd--;
    if (item.qtd < 1) {
      sacola = sacola.filter(function (produto) {
        return String(produto.id) !== id;
      });
    }
  } else if (acao === 'remover') {
    sacola = sacola.filter(function (produto) {
      return String(produto.id) !== id;
    });
  }

  salvarSacola();
  renderizarSacola();
});

const resumo = document.getElementById('resumo');
const sacolaAba = document.getElementById('sacolaAba');

function abrirSacola() {
    resumo.classList.remove('aberto');
    sacolaAba.classList.add('aberto');
}

function fecharSacola() {
    sacolaAba.classList.remove('aberto');
}

function fecharResumo() {
    resumo.classList.remove('aberto');
}

document.getElementById('btn-sacola').addEventListener('click', abrirSacola);
document.getElementById('sacolaFechar').addEventListener('click', fecharSacola);
document.getElementById('resumoFechar').addEventListener('click', fecharResumo);
document.getElementById('btnIrSacola').addEventListener('click', abrirSacola);
document.getElementById('btnEscolherMais').addEventListener('click', fecharResumo);
document.getElementById('btnMaisSacola').addEventListener('click', fecharSacola);


document.querySelector('.vitrine-grade').addEventListener('click', function (evento) {
  const botao = evento.target.closest('.btn-interesse');
  if (!botao) return;

  const card = botao.closest('.produto-card');
  const nome = card.querySelector('.card-nome').textContent;
  const imagem = card.querySelector('img').getAttribute('src');
  const textoPreco = card.querySelector('.card-preco').textContent;
  const preco = Number(textoPreco.replace('R$', '').trim().replace('.', '').replace(',', '.'));

  const existente = sacola.find(function (produto) {
    return produto.nome === nome;
  });

  if (existente) {
    existente.qtd++;
  } else {
    sacola.push({ id: Date.now(), nome: nome, preco: preco, imagem: imagem, qtd: 1 });
  }

   salvarSacola();
  renderizarSacola();

  document.getElementById('resumoFoto').src = imagem;
  document.getElementById('resumoNome').textContent = nome;
  document.getElementById('resumoPreco').textContent = textoPreco;
  resumo.classList.add('aberto');
});

renderizarSacola();

document.getElementById('btnEnviar').addEventListener('click', function () {
    if (sacola.length === 0) {
        alert('Sua sacola está vazia.');
        return;
    }

    const numeroLoja = '5599985330012';
    let mensagem = 'Olá! Tenho interesse nestes perfumes:\n\n';
    let totalPedido = 0;

    sacola.forEach(function (item) {
        const totalItem = item.preco * item.qtd;
        totalPedido += item.preco * item.qtd;
        mensagem += item.qtd + 'x ' + item.nome + ' - ' + formatarPreco(totalItem) + '\n\n';
    });

    mensagem += '\nTotal do pedido: ' + formatarPreco(totalPedido);

    const link = 'https://wa.me/' + numeroLoja + '?text=' + encodeURIComponent(mensagem);
    window.open(link, '_blank');
});