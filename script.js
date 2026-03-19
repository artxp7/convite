// ===== PLAYER DE MÚSICA COM AUTOPLAY GARANTIDO =====
const musica = document.getElementById('musica');
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');

let estaTocando = false;
let usuarioAtivouSom = false;

// CONFIGURAÇÕES CRÍTICAS PARA AUTOPLAY
musica.preload = 'auto';
musica.loop = true;
musica.muted = true; // COMEÇA MUDO (isso permite autoplay em todos navegadores)
musica.volume = 0.5;

// ===== ESTRATÉGIA 1: Autoplay com áudio mudo (100% garantido) =====
function iniciarMusicaMuda() {
    console.log("Tentando autoplay com áudio mudo...");
    
    musica.play()
        .then(() => {
            console.log("✅ Música tocando (muda)!");
            estaTocando = true;
            autoplayIniciado = true;
            
            // Atualiza botão
            playPauseBtn.innerHTML = '<span class="play-icon">⏸️</span>';
            playPauseBtn.classList.add('playing');
            
            // Mostra aviso que está mudo
            mostrarAvisoMusicaMuda();
        })
        .catch(error => {
            console.log("❌ Falhou até mesmo o áudio mudo:", error);
            // Último recurso: botão gigante
            criarBotaoEmergencia();
        });
}

// Mostra aviso que a música está tocando mas muda
function mostrarAvisoMusicaMuda() {
    const aviso = document.createElement('div');
    aviso.id = 'aviso-mudo';
    aviso.innerHTML = `
        <div style="
            position: fixed;
            top: 80px;
            right: 100px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            font-size: 0.9rem;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 1px solid #6c5ce7;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: pulseAviso 2s infinite;
        ">
            🔇 Música tocando (mudo) - Clique no alto-falante para ativar o som
        </div>
    `;
    document.body.appendChild(aviso);
    
    // Remove após 5 segundos
    setTimeout(() => {
        const el = document.getElementById('aviso-mudo');
        if (el) el.remove();
    }, 5000);
}

// ===== ESTRATÉGIA 2: Forçar ativação do som no primeiro clique =====
function ativarSomNoPrimeiroClique() {
    // Qualquer clique na página ativa o som
    document.body.addEventListener('click', function ativarSom() {
        if (musica.muted) {
            musica.muted = false;
            muteBtn.innerHTML = '<span class="mute-icon">🔊</span>';
            muteBtn.classList.remove('muted');
            
            // Mostra mensagem de sucesso
            mostrarMensagemFlash('🔊 Som ativado!');
            
            // Remove o aviso de mudo se existir
            const aviso = document.getElementById('aviso-mudo');
            if (aviso) aviso.remove();
        }
    }, { once: true }); // Executa apenas uma vez
}

// ===== ESTRATÉGIA 3: Botão de emergência (se tudo falhar) =====
function criarBotaoEmergencia() {
    const botao = document.createElement('button');
    botao.id = 'botao-emergencia';
    botao.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <span style="font-size: 3rem;">🎵</span>
            <span style="font-size: 1.5rem;">Clique para iniciar a música</span>
            <span style="font-size: 0.9rem; opacity: 0.8;">O navegador bloqueou o autoplay</span>
        </div>
    `;
    
    Object.assign(botao.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'linear-gradient(135deg, #6c5ce7, #a463f5)',
        color: 'white',
        border: 'none',
        padding: '40px',
        borderRadius: '30px',
        cursor: 'pointer',
        zIndex: '10000',
        boxShadow: '0 20px 60px rgba(108, 92, 231, 0.6)',
        border: '3px solid rgba(255,255,255,0.3)',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        animation: 'pulsoEmergencia 1.5s infinite'
    });
    
    botao.onclick = function() {
        musica.play()
            .then(() => {
                estaTocando = true;
                musica.muted = false;
                playPauseBtn.innerHTML = '<span class="play-icon">⏸️</span>';
                playPauseBtn.classList.add('playing');
                muteBtn.innerHTML = '<span class="mute-icon">🔊</span>';
                botao.remove();
                
                // Remove overlay
                const overlay = document.querySelector('.overlay-emergencia');
                if (overlay) overlay.remove();
            });
    };
    
    document.body.appendChild(botao);
    
    // Overlay escuro
    const overlay = document.createElement('div');
    overlay.className = 'overlay-emergencia';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: '9999'
    });
    document.body.appendChild(overlay);
}

// ===== FUNÇÕES AUXILIARES =====
function mostrarMensagemFlash(texto) {
    const msg = document.createElement('div');
    msg.textContent = texto;
    Object.assign(msg.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#6c5ce7',
        color: 'white',
        padding: '15px 30px',
        borderRadius: '50px',
        zIndex: '10001',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        boxShadow: '0 10px 30px rgba(108, 92, 231, 0.5)',
        animation: 'flashMensagem 2s forwards'
    });
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

// ===== EVENTOS DO PLAYER =====
playPauseBtn.addEventListener('click', () => {
    if (estaTocando) {
        musica.pause();
        playPauseBtn.innerHTML = '<span class="play-icon">▶</span>';
        playPauseBtn.classList.remove('playing');
    } else {
        musica.play();
        playPauseBtn.innerHTML = '<span class="play-icon">⏸️</span>';
        playPauseBtn.classList.add('playing');
    }
    estaTocando = !estaTocando;
});

muteBtn.addEventListener('click', () => {
    musica.muted = !musica.muted;
    muteBtn.innerHTML = musica.muted ? '<span class="mute-icon">🔇</span>' : '<span class="mute-icon">🔊</span>';
    muteBtn.classList.toggle('muted');
    
    // Se estava mudo e agora ativou, mostra mensagem
    if (!musica.muted) {
        mostrarMensagemFlash('🔊 Som ativado!');
    }
});

volumeSlider.addEventListener('input', (e) => {
    musica.volume = e.target.value;
    if (musica.volume === 0) {
        muteBtn.innerHTML = '<span class="mute-icon">🔇</span>';
        muteBtn.classList.add('muted');
    } else {
        muteBtn.innerHTML = '<span class="mute-icon">🔊</span>';
        muteBtn.classList.remove('muted');
        musica.muted = false;
    }
});

// ===== INICIAR TUDO =====
window.addEventListener('load', () => {
    console.log("🚀 Iniciando autoplay garantido...");
    
    // PASSO 1: Inicia música MUDO (100% garantido)
    setTimeout(iniciarMusicaMuda, 500);
    
    // PASSO 2: Prepara para ativar som no clique
    setTimeout(ativarSomNoPrimeiroClique, 1000);
    
    // PASSO 3: Para dispositivos móveis - toque ativa som
    document.addEventListener('touchstart', function ativarSomTouch() {
        if (musica.muted) {
            musica.muted = false;
            muteBtn.innerHTML = '<span class="mute-icon">🔊</span>';
            muteBtn.classList.remove('muted');
        }
    }, { once: true });
});

// ===== ANIMAÇÕES CSS =====
const styleAnimacoes = document.createElement('style');
styleAnimacoes.textContent = `
    @keyframes pulseAviso {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    @keyframes pulsoEmergencia {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.05); }
    }
    
    @keyframes flashMensagem {
        0% { transform: translateX(-50%) translateY(100%); opacity: 0; }
        20% { transform: translateX(-50%) translateY(0); opacity: 1; }
        80% { transform: translateX(-50%) translateY(0); opacity: 1; }
        100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }
`;
document.head.appendChild(styleAnimacoes);

// ===== CÓDIGO DE CONFIRMAÇÃO DE PRESENÇA (mantido igual) =====
const opcaoSim = document.getElementById('opcaoSim');
const opcaoNao = document.getElementById('opcaoNao');
const secaoVai = document.getElementById('secaoVai');
const secaoNaoVai = document.getElementById('secaoNaoVai');
const numPessoas = document.getElementById('numPessoas');
const containerNomes = document.getElementById('containerNomes');
const confirmarPresenca = document.getElementById('confirmarPresenca');
const enviarDesculpas = document.getElementById('enviarDesculpas');
const modal = document.getElementById('modalConfirmacao');
const mensagemModal = document.getElementById('mensagemModal');

opcaoSim.addEventListener('change', function() {
    if (this.checked) {
        secaoVai.classList.add('ativa');
        secaoNaoVai.classList.remove('ativa');
    }
});

opcaoNao.addEventListener('change', function() {
    if (this.checked) {
        secaoNaoVai.classList.add('ativa');
        secaoVai.classList.remove('ativa');
    }
});

function gerarCamposNomes() {
    const quantidade = parseInt(numPessoas.value) || 1;
    containerNomes.innerHTML = '';
    
    for (let i = 0; i < quantidade; i++) {
        const div = document.createElement('div');
        div.className = 'campo-nome';
        div.innerHTML = `
            <span class="numero-pessoa">${i + 1}</span>
            <input type="text" placeholder="Nome da pessoa ${i + 1}" id="nome${i}" class="input-nome">
        `;
        containerNomes.appendChild(div);
    }
}

gerarCamposNomes();
numPessoas.addEventListener('change', gerarCamposNomes);

function enviarWhatsApp(mensagem) {
    const mensagemCodificada = encodeURIComponent(mensagem);
    const numeroTelefone = '5511999999999';
    const urlWhatsApp = `https://wa.me/${numeroTelefone}?text=${mensagemCodificada}`;
    window.open(urlWhatsApp, '_blank');
}

confirmarPresenca.addEventListener('click', () => {
    const nomes = [];
    for (let i = 0; i < parseInt(numPessoas.value); i++) {
        const nomeInput = document.getElementById(`nome${i}`);
        if (nomeInput && nomeInput.value.trim()) {
            nomes.push(nomeInput.value.trim());
        }
    }
    
    if (nomes.length === 0) {
        alert('Por favor, preencha pelo menos um nome!');
        return;
    }
    
    let mensagem = '';
    const quantidade = nomes.length;
    
    if (quantidade === 1) {
        mensagem = `Obrigado pelo convite! Pode contar com minha presença. Assinado: ${nomes[0]}`;
    } else {
        const listaNomes = nomes.join(', ');
        mensagem = `Obrigado pelo convite! Pode contar com nossa presença. Assinado: ${listaNomes}`;
    }
    
    mensagemModal.textContent = mensagem;
    modal.classList.add('show');
    enviarWhatsApp(mensagem);
});

enviarDesculpas.addEventListener('click', () => {
    const textoDesculpas = document.getElementById('textoDesculpas').value.trim();
    
    let mensagem = '';
    
    if (textoDesculpas) {
        mensagem = `Infelizmente não poderei comparecer. ${textoDesculpas}`;
    } else {
        mensagem = `Infelizmente não poderei comparecer ao evento. Desejo uma ótima celebração!`;
    }
    
    mensagemModal.textContent = mensagem;
    modal.classList.add('show');
    enviarWhatsApp(mensagem);
});

const closeModal = document.querySelector('.close-modal');
const fecharModalBtn = document.querySelector('.botao-fechar-modal');

function fecharModal() {
    modal.classList.remove('show');
}

closeModal.addEventListener('click', fecharModal);
fecharModalBtn.addEventListener('click', fecharModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        fecharModal();
    }
});
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const carrossel = document.querySelector('.carrossel');

function showSlide(n) {
    slideIndex = n;
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    
    carrossel.style.transform = `translateX(-${slideIndex * 100}%)`;
    
    dots.forEach(dot => dot.classList.remove('active'));
    dots[slideIndex].classList.add('active');
}

document.querySelector('.prev').addEventListener('click', () => {
    showSlide(slideIndex - 1);
});

document.querySelector('.next').addEventListener('click', () => {
    showSlide(slideIndex + 1);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto-play opcional
setInterval(() => {
    showSlide(slideIndex + 1);
}, 5000);