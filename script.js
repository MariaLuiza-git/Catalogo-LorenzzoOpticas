const contador = document.getElementById('sacolaContador');
const botoes = document.querySelectorAll('.btn-interesse');

const salva = localStorage.getItem('sacola');
const sacola = salva ? JSON.parse(salva) : [];
contador.textContent = sacola.length;

botoes.forEach(function (botao) {
    botao.addEventListener('click', function () {
        const card = botao.closest('.produto-card');
        const nome = card.querySelector('.card-nome').textContent;
        const preco = card.querySelector('.card-preco').textContent;

        sacola.push({ nome: nome, preco: preco });
        contador.textContent = sacola.length;
        localStorage.setItem('sacola', JSON.stringify(sacola));

        document.getElementById('resumoNome').textContent = nome;
        document.getElementById('resumoPreco').textContent = preco;
        document.getElementById('resumoFoto').src = card.querySelector('img').src;
        document.getElementById('resumo').classList.add('aberto');

    document.getElementById('btnEscolherMais').addEventListener('click', function () {
    document.getElementById('resumo').classList.remove('aberto');
});

});
});
document.getElementById('resumoFechar').addEventListener('click', function () {
    document.getElementById('resumo').classList.remove('aberto');
});

const aba = document.getElementById('sacolaAba');
const lista = document.getElementById('listaSacola');

function mostrarSacola() {
    lista.innerHTML = '';

    sacola.forEach(function (item, indice) {
        const li = document.createElement('li');
        li.textContent = item.nome + ' - ' + item.preco + ' ';
        
         const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.addEventListener('click', function () {
        sacola.splice(indice, 1);
        localStorage.setItem('sacola', JSON.stringify(sacola));
        contador.textContent = sacola.length;
        mostrarSacola();
    });

    li.appendChild(btnRemover);
    lista.appendChild(li);
});


    document.getElementById('resumo').classList.remove('aberto');
    aba.classList.add('aberto');
}

document.getElementById('btnIrSacola').addEventListener('click', mostrarSacola);
document.getElementById('btn-sacola').addEventListener('click', mostrarSacola);

document.getElementById('sacolaFechar').addEventListener('click', function () {
    aba.classList.remove('aberto');
});

document.getElementById('btnMaisSacola').addEventListener('click', function () {
    aba.classList.remove('aberto');
});

const telefoneLoja = '5599985330012';

document.getElementById('btnEnviar').addEventListener('click', function () {
    if (sacola.length === 0) {
        alert('Sua sacola está vazia.');
        return;
    }

    let mensagem = 'Olá! Tenho interesse nestes perfumes:\n';

    sacola.forEach(function (item) {
        mensagem = mensagem + ' - ' + item.nome + ' (' + item.preco + ')\n';
    });

    const link = 'https://wa.me/' + telefoneLoja + '?text=' + encodeURIComponent(mensagem);
    window.open(link, '_blank');
});