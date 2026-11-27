// ============================================
// PROJETOS (HÉLICE)
// ============================================

// ===== 2. ELEMENTOS DA PÁGINA =====
const palco = document.querySelector('.palco');
const helice = document.querySelector('.helice');
const caixa = document.querySelector('.detalhes');
const caixaNumero = document.querySelector('.detalhes__numero');
const caixaNome = document.querySelector('.detalhes__nome');
const caixaImagem = document.querySelector('.detalhes__imagem');
const caixaDescricao = document.querySelector('.detalhes__descricao');
const caixaLink = document.querySelector('.detalhes__link');

// ===== 3. CONFIGURAÇÕES DA ESPIRAL =====
const itensPorVolta = 8;
const passoAngulo = 360 / itensPorVolta;
const passoAltura = 40;
let raio = 260; // recalculado conforme o tamanho da tela

// ===== 4. CRIAR OS CARDS A PARTIR DOS DADOS =====
projetos.forEach((projeto, i) => {
  const numero = String(i + 1).padStart(2, '0');

  const card = document.createElement('button');
  card.className = 'helice__item';
  card.innerHTML = `<span>${numero}</span>${projeto.nome}`;
  card.dataset.angulo = i * passoAngulo;

  card.addEventListener('click', () => {
    if (moveu) return; // foi um arraste, não um clique
    selecionar(i, card);
  });

  helice.appendChild(card);
});

const cards = document.querySelectorAll('.helice__item');

// Posiciona os cards na espiral (e reposiciona se a tela mudar de tamanho)
function posicionarCards() {
  raio = Math.min(260, palco.clientWidth * 0.42);

  cards.forEach((card, i) => {
    const angulo = Number(card.dataset.angulo);
    const altura = (i - (cards.length - 1) / 2) * passoAltura;
    card.style.transform =
      `translateY(${altura}px) rotateY(${angulo}deg) translateZ(${raio}px)`;
  });
}

posicionarCards();
window.addEventListener('resize', posicionarCards);

// ===== 5. MOSTRAR O PROJETO NA CAIXA =====
function selecionar(indice, card) {
  const projeto = projetos[indice];

  caixaNumero.textContent = `PROJETO ${String(indice + 1).padStart(2, '0')}`;
  caixaNome.textContent = projeto.nome;
  caixaDescricao.textContent = projeto.descricao;

  // imagem do projeto (só aparece se o projeto tiver uma)
  if (projeto.imagem) {
    caixaImagem.src = `assets/projetos/${projeto.imagem}`;
    caixaImagem.alt = `Imagem do projeto ${projeto.nome}`;
    caixaImagem.hidden = false;
  } else {
    caixaImagem.hidden = true;
  }
  caixaLink.href = projeto.link;
  caixaLink.hidden = false;

  // reinicia a animação de entrada da caixa
  caixa.classList.remove('trocando');
  void caixa.offsetWidth;
  caixa.classList.add('trocando');

  // marca o card ativo
  cards.forEach((c) => c.classList.remove('ativo'));
  card.classList.add('ativo');

  // gira a hélice até o card ficar de frente
  const anguloCard = Number(card.dataset.angulo);
  const voltas = Math.round((rotacao - anguloCard) / 360);
  alvo = anguloCard + voltas * 360;
}

// ===== 6. ANIMAÇÃO =====
let rotacao = 0;
let velocidade = 0.15;
let alvo = null;       // ângulo para onde a hélice deve ir ao selecionar
let arrastando = false;
let moveu = false;
let inicioX = 0;
let ultimoX = 0;

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  velocidade = 0;
}

function animar() {
  if (alvo !== null) {
    rotacao += (alvo - rotacao) * 0.08;   // aproxima suavemente do alvo
  } else if (!arrastando) {
    rotacao += velocidade;               // giro automático
  }

  helice.style.transform = `rotateX(-10deg) rotateY(${-rotacao}deg)`;

  cards.forEach((card) => {
    const relativo = (Number(card.dataset.angulo) - rotacao) * Math.PI / 180;
    const frente = (Math.cos(relativo) + 1) / 2;
    card.style.opacity = 0.15 + frente * 0.85;
    card.style.pointerEvents = frente > 0.5 ? 'auto' : 'none'; // só os da frente são clicáveis
  });

  requestAnimationFrame(animar);
}

animar();

// ===== 7. ARRASTAR =====
palco.addEventListener('pointerdown', (e) => {
  arrastando = true;
  moveu = false;
  inicioX = e.clientX;
  ultimoX = e.clientX;
});

window.addEventListener('pointermove', (e) => {
  if (!arrastando) return;

  if (Math.abs(e.clientX - inicioX) > 5) {
    moveu = true;
    alvo = null; // o usuário assumiu o controle: volta ao giro livre
  }

  rotacao -= (e.clientX - ultimoX) * 0.3;
  ultimoX = e.clientX;
});

window.addEventListener('pointerup', () => {
  arrastando = false;
});

// ============================================
// FORMAÇÃO & CERTIFICADOS
// ============================================

const listaCertificados = document.querySelector('.formacao__lista');
const destaques = document.querySelector('.formacao__destaques');

// Cria um card em destaque para cada item de "formacao" (dados.js)
formacao.forEach((item) => {
  const card = document.createElement('article');
  card.className = 'formacao__card';

  card.innerHTML = `
    <p class="formacao__status"></p>
    <h3 class="formacao__curso"></h3>
    <p class="formacao__instituicao"></p>
    <p class="formacao__descricao"></p>
  `;
  card.querySelector('.formacao__status').textContent = item.status;
  card.querySelector('.formacao__curso').textContent = item.curso;
  card.querySelector('.formacao__instituicao').textContent = `${item.instituicao} · ${item.periodo}`;
  card.querySelector('.formacao__descricao').textContent = item.descricao;

  destaques.appendChild(card);
});
const modal = document.querySelector('#modal-certificado');
const modalConteudo = document.querySelector('.modal__conteudo');
const botaoFechar = document.querySelector('.modal__fechar');

// Cria uma linha da lista para cada item de "certificados" (dados.js)
certificados.forEach((curso) => {
  const item = document.createElement('li');
  const botao = document.createElement('button');
  botao.className = 'certificado';

  botao.innerHTML = `
    <span class="certificado__nome"></span>
    <span class="certificado__info"></span>
    <span class="certificado__ver">${curso.arquivo ? 'Ver →' : 'Em andamento'}</span>
  `;
  botao.querySelector('.certificado__nome').textContent = curso.nome;
  botao.querySelector('.certificado__info').textContent = `${curso.instituicao} · ${curso.ano}`;

  if (curso.arquivo) {
    botao.addEventListener('click', () => abrirCertificado(curso));
  } else {
    botao.disabled = true; // sem arquivo: não abre nada
  }

  item.appendChild(botao);
  listaCertificados.appendChild(item);
});

// Mostra o certificado no modal (imagem ou PDF)
function abrirCertificado(curso) {
  const caminho = `assets/certificados/${curso.arquivo}`;

  if (curso.arquivo.endsWith('.pdf')) {
    modalConteudo.innerHTML = `<iframe src="${caminho}" title="${curso.nome}"></iframe>`;
  } else {
    modalConteudo.innerHTML = `<img src="${caminho}" alt="Certificado: ${curso.nome}">`;
  }

  modal.showModal();
}

botaoFechar.addEventListener('click', () => modal.close());

// fecha ao clicar fora do certificado (no fundo escuro)
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close();
});