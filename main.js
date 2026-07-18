// ==============================================================
// LÓGICA PRINCIPAL - REVISADA
// ==============================================================

// ==============================================================
// UTILITÁRIOS
// ==============================================================

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function gerarPerguntasRandomicas() {
    const todasPerguntas = [];
    TIPOS.forEach(tipo => {
        if (tipo.perguntas && tipo.perguntas.length > 0) {
            tipo.perguntas.forEach(pergunta => {
                todasPerguntas.push({
                    tipoId: tipo.id,
                    pergunta: pergunta
                });
            });
        }
    });
    return shuffleArray(todasPerguntas);
}


// ==============================================================
// VARIÁVEIS GLOBAIS
// ==============================================================

let perguntasRandomicas = [];


// ==============================================================
// 1. TESTE LIKERT (com randomização)
// ==============================================================

function renderPerguntas() {
    const container = document.getElementById('perguntas-container');
    if (!container) {
        console.error('Elemento #perguntas-container não encontrado!');
        return;
    }
    
    container.innerHTML = '';
    perguntasRandomicas = gerarPerguntasRandomicas();
    
    if (perguntasRandomicas.length === 0) {
        container.innerHTML = '<p>Nenhuma pergunta encontrada. Verifique os dados.</p>';
        return;
    }
    
    perguntasRandomicas.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'pergunta';
        div.innerHTML = `
            <p><strong>${index + 1}.</strong> ${item.pergunta}</p>
            <div class="likert">
                <label>
                    <input type="radio" name="q${index}" value="1" required>
                    1 - Discordo totalmente
                </label>
                <label>
                    <input type="radio" name="q${index}" value="2" required>
                    2 - Discordo parcialmente
                </label>
                <label>
                    <input type="radio" name="q${index}" value="3" required>
                    3 - Concordo parcialmente
                </label>
                <label>
                    <input type="radio" name="q${index}" value="4" required>
                    4 - Concordo totalmente
                </label>
            </div>
        `;
        container.appendChild(div);
    });
}

function processarTeste(e) {
    e.preventDefault();
    const form = document.getElementById('form-teste');
    if (!form) {
        alert('Formulário não encontrado!');
        return;
    }
    
    const dados = new FormData(form);
    const pontuacao = TIPOS.map(() => 0);
    
    perguntasRandomicas.forEach((item, index) => {
        const val = dados.get(`q${index}`);
        if (val) {
            pontuacao[item.tipoId - 1] += parseInt(val, 10);
        }
    });

    const resultados = TIPOS.map((tipo, idx) => ({
        tipo: tipo,
        pontos: pontuacao[idx] || 0
    }));

    resultados.sort((a, b) => b.pontos - a.pontos);
    const maxPontos = resultados[0].pontos;
    const empatados = resultados.filter(r => r.pontos === maxPontos);

    const idsEmpatados = empatados.map(r => r.tipo.id);
    localStorage.setItem('eneagrama_resultado', JSON.stringify({
        ids: idsEmpatados,
        metodo: 'teste-likert',
        data: new Date().toISOString()
    }));

    exibirResultado(empatados, maxPontos, 'teste-likert');
    mudarAba('resultado');
}


// ==============================================================
// 2. TRIAGEM RÁPIDA
// ==============================================================

function renderTriagem() {
    const grupoI = document.getElementById('grupo-I');
    const grupoII = document.getElementById('grupo-II');
    
    if (!grupoI || !grupoII) {
        console.error('Elementos da triagem não encontrados!');
        return;
    }

    grupoI.innerHTML = '';
    for (const [letra, dados] of Object.entries(TRIAGEM.grupos.I)) {
        const div = document.createElement('div');
        div.className = 'opcao-triagem';
        div.innerHTML = `
            <label>
                <input type="radio" name="grupoI" value="${letra}" required>
                <span class="letra">${letra}.</span> ${dados.texto}
            </label>
        `;
        const radio = div.querySelector('input');
        radio.addEventListener('change', function() {
            document.querySelectorAll('#grupo-I .opcao-triagem').forEach(el => el.classList.remove('selecionado'));
            if (this.checked) {
                div.classList.add('selecionado');
            }
        });
        grupoI.appendChild(div);
    }

    grupoII.innerHTML = '';
    for (const [letra, dados] of Object.entries(TRIAGEM.grupos.II)) {
        const div = document.createElement('div');
        div.className = 'opcao-triagem';
        div.innerHTML = `
            <label>
                <input type="radio" name="grupoII" value="${letra}" required>
                <span class="letra">${letra}.</span> ${dados.texto}
            </label>
        `;
        const radio = div.querySelector('input');
        radio.addEventListener('change', function() {
            document.querySelectorAll('#grupo-II .opcao-triagem').forEach(el => el.classList.remove('selecionado'));
            if (this.checked) {
                div.classList.add('selecionado');
            }
        });
        grupoII.appendChild(div);
    }
}

function processarTriagem(e) {
    e.preventDefault();
    const form = document.getElementById('form-triagem');
    if (!form) {
        alert('Formulário não encontrado!');
        return;
    }
    
    const dados = new FormData(form);
    const grupoI = dados.get('grupoI');
    const grupoII = dados.get('grupoII');

    if (!grupoI || !grupoII) {
        alert('Por favor, escolha uma opção em cada grupo.');
        return;
    }

    const tiposI = TRIAGEM.grupos.I[grupoI].tipos;
    const tiposII = TRIAGEM.grupos.II[grupoII].tipos;
    const tipoEncontrado = tiposI.find(t => tiposII.includes(t));

    if (tipoEncontrado) {
        const tipo = TIPOS.find(t => t.id === tipoEncontrado);
        localStorage.setItem('eneagrama_resultado', JSON.stringify({
            ids: [tipo.id],
            metodo: 'triagem-rapida',
            data: new Date().toISOString()
        }));
        exibirResultado([{ tipo: tipo, pontos: 0 }], 0, 'triagem-rapida');
        mudarAba('resultado');
    } else {
        alert('Nenhum tipo encontrado. Tente novamente.');
    }
}


// ==============================================================
// 3. EXIBIR RESULTADO
// ==============================================================

function exibirResultado(empatados, pontuacao, metodo) {
    const container = document.getElementById('resultado-teste');
    if (!container) {
        console.error('Elemento #resultado-teste não encontrado!');
        return;
    }
    
    const nomeMetodo = metodo === 'teste-likert' ? 'Teste Likert' : 'Triagem Rápida (Riso-Hudson)';

    if (empatados.length === 1) {
        const tipo = empatados[0].tipo;
        const tipoEstresse = TIPOS.find(t => t.id === tipo.setaEstresse);
        const tipoCrescimento = TIPOS.find(t => t.id === tipo.setaCrescimento);
        const totalPerguntas = metodo === 'teste-likert' ? perguntasRandomicas.length * 4 : 0;

        container.innerHTML = `
            <div class="card-tipo" style="border-left-color: ${tipo.cor};">
                <h2>Seu tipo principal é: <span style="font-weight: bold;">${tipo.id}.</span> ${tipo.nome}</h2>
                <div class="subtitulo">${metodo === 'teste-likert' ? `Pontuação: ${pontuacao} / ${totalPerguntas}` : 'Método Riso-Hudson'} · ${nomeMetodo}</div>
                <p style="margin: 0.8rem 0;">${tipo.descricao}</p>

                <div class="setas-container">
                    <h4>🧭 Caminhos de Movimento (Lei do 7)</h4>
                    <div class="setas-grid">
                        <div class="seta-estresse">
                            <div class="seta-label">⬇️ Em Estresse (desintegração)</div>
                            <div class="seta-nome"><span style="font-weight: bold;">${tipo.id}</span> → <span style="font-weight: bold;">${tipoEstresse.id}</span> · ${tipoEstresse.nome}</div>
                            <div class="seta-detalhe">Vício: ${tipoEstresse.vicio}</div>
                        </div>
                        <div class="seta-crescimento">
                            <div class="seta-label">⬆️ Em Crescimento (integração)</div>
                            <div class="seta-nome"><span style="font-weight: bold;">${tipo.id}</span> → <span style="font-weight: bold;">${tipoCrescimento.id}</span> · ${tipoCrescimento.nome}</div>
                            <div class="seta-detalhe">Virtude: ${tipoCrescimento.virtude}</div>
                        </div>
                    </div>
                    <div class="seta-explicacao">
                        <strong>📖 Sobre as setas:</strong> Quando sob estresse, você pode assumir traços negativos do tipo indicado em <strong>estresse</strong>. 
                        Em crescimento, você pode acessar virtudes do tipo indicado em <strong>crescimento</strong>.
                        <br><small style="color: #8f7a66;">Sequência da Lei do 7: 1 → 4 → 2 → 8 → 5 → 7 → 1 (estresse) · 3 → 9 → 6 → 3 (tríade)</small>
                    </div>
                </div>

                <div class="detalhe">
                    <span class="detalhe-item">😨 Medo: ${tipo.medo}</span>
                    <span class="detalhe-item">💫 Desejo: ${tipo.desejo}</span>
                </div>
                <div class="detalhe">
                    <span class="detalhe-item">✨ Virtude: ${tipo.virtude}</span>
                    <span class="detalhe-item">🔥 Vício: ${tipo.vicio}</span>
                </div>

                ${gerarBotoesCompartilhamento()}
            </div>
        `;
    } else {
        const nomes = empatados.map(r => `${r.tipo.id}. ${r.tipo.nome}`).join(' e ');
        container.innerHTML = `
            <div class="card-tipo" style="border-left-color: #b8a99a;">
                <h2>Empate entre: ${nomes}</h2>
                <p>Você tem características fortes de mais de um tipo. Leia sobre todos eles para se aprofundar.</p>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.8rem;">
                    ${empatados.map(r => `
                        <span class="badge-tipo" style="background: ${r.tipo.cor}; color: #fff;">${r.tipo.id}. ${r.tipo.nome}</span>
                    `).join('')}
                </div>
                <p style="margin-top: 0.8rem; font-size: 0.9rem; color: #6f5f4e;">Explore o catálogo para conhecer todos os tipos e suas setas de movimento.</p>
                ${gerarBotoesCompartilhamento()}
            </div>
        `;
    }
    carregarMeuTipo();
}

function gerarBotoesCompartilhamento() {
    return `
        <div class="compartilhar-container" style="margin-top: 1.5rem; text-align: center; padding-top: 1rem; border-top: 1px solid #e3d9cf;">
            <p style="font-size: 0.9rem; color: #6f5f4e; margin-bottom: 0.5rem;">Compartilhe seu resultado:</p>
            <div style="display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap;">
                <button onclick="compartilharWhatsApp()" class="btn-compartilhar" style="background: #25D366;">WhatsApp</button>
                <button onclick="compartilharTwitter()" class="btn-compartilhar" style="background: #1DA1F2;">Twitter</button>
                <button onclick="compartilharFacebook()" class="btn-compartilhar" style="background: #1877F2;">Facebook</button>
                <button onclick="compartilharLinkedIn()" class="btn-compartilhar" style="background: #0A66C2;">LinkedIn</button>
                <button onclick="copiarLink()" class="btn-compartilhar" style="background: #6f5f4e;">Copiar Link</button>
            </div>
        </div>
    `;
}


// ==============================================================
// 4. COMPARTILHAMENTO
// ==============================================================

function gerarTextoCompartilhamento() {
    const stored = localStorage.getItem('eneagrama_resultado');
    if (!stored) return 'Descubra seu tipo no Eneagrama! 🌿';
    
    try {
        const data = JSON.parse(stored);
        const ids = data.ids;
        const tipos = TIPOS.filter(t => ids.includes(t.id));
        const nomes = tipos.map(t => `${t.id}. ${t.nome}`).join(' e ');
        return `Meu tipo no Eneagrama é ${nomes}! 🌿 Faça o teste também: ${window.location.href}`;
    } catch (e) {
        return 'Descubra seu tipo no Eneagrama! 🌿';
    }
}

function compartilharWhatsApp() {
    const texto = gerarTextoCompartilhamento();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
}

function compartilharTwitter() {
    const texto = gerarTextoCompartilhamento();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}`, '_blank');
}

function compartilharFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
}

function compartilharLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
}

function copiarLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copiado para a área de transferência!'))
        .catch(() => alert('Não foi possível copiar o link.'));
}


// ==============================================================
// 5. EXIBIR "MEU TIPO"
// ==============================================================

function carregarMeuTipo() {
    const container = document.getElementById('meu-tipo-container');
    if (!container) {
        console.error('Elemento #meu-tipo-container não encontrado!');
        return;
    }
    
    const stored = localStorage.getItem('eneagrama_resultado');

    if (!stored) {
        container.innerHTML = `<p style="color: #6f5f4e;">Você ainda não fez nenhum teste. Vá para a aba <strong>Teste</strong> ou <strong>Triagem Rápida</strong> e descubra seu tipo.</p>`;
        return;
    }

    try {
        const data = JSON.parse(stored);
        const ids = data.ids;
        const metodo = data.metodo || 'desconhecido';
        const tiposEncontrados = TIPOS.filter(t => ids.includes(t.id));

        if (tiposEncontrados.length === 0) {
            container.innerHTML = `<p style="color: #6f5f4e;">Nenhum tipo encontrado. Faça o teste novamente.</p>`;
            return;
        }

        const nomeMetodo = metodo === 'teste-likert' ? 'Teste Likert' :
            metodo === 'triagem-rapida' ? 'Triagem Rápida (Riso-Hudson)' :
            'Método desconhecido';

        if (tiposEncontrados.length === 1) {
            const tipo = tiposEncontrados[0];
            const tipoEstresse = TIPOS.find(t => t.id === tipo.setaEstresse);
            const tipoCrescimento = TIPOS.find(t => t.id === tipo.setaCrescimento);

            container.innerHTML = `
                <div class="card-tipo" style="border-left-color: ${tipo.cor};">
                    <h2><span style="font-weight: bold;">Tipo ${tipo.id}:</span> ${tipo.nome}</h2>
                    <div class="subtitulo">Virtude: ${tipo.virtude} · Vício: ${tipo.vicio}</div>
                    <p style="font-size: 0.9rem; color: #8f7a66; margin-bottom: 0.8rem;">Identificado por: ${nomeMetodo}</p>
                    <p>${tipo.descricao}</p>

                    <div class="setas-container">
                        <h4>🧭 Caminhos de Movimento (Lei do 7)</h4>
                        <div class="setas-grid">
                            <div class="seta-estresse">
                                <div class="seta-label">⬇️ Em Estresse (desintegração)</div>
                                <div class="seta-nome"><span style="font-weight: bold;">${tipo.id}</span> → <span style="font-weight: bold;">${tipoEstresse.id}</span> · ${tipoEstresse.nome}</div>
                                <div class="seta-detalhe">Vício: ${tipoEstresse.vicio}</div>
                            </div>
                            <div class="seta-crescimento">
                                <div class="seta-label">⬆️ Em Crescimento (integração)</div>
                                <div class="seta-nome"><span style="font-weight: bold;">${tipo.id}</span> → <span style="font-weight: bold;">${tipoCrescimento.id}</span> · ${tipoCrescimento.nome}</div>
                                <div class="seta-detalhe">Virtude: ${tipoCrescimento.virtude}</div>
                            </div>
                        </div>
                        <div class="seta-explicacao">
                            <strong>📖 Sobre as setas:</strong> Quando sob estresse, você pode assumir traços negativos do tipo indicado em <strong>estresse</strong>. 
                            Em crescimento, você pode acessar virtudes do tipo indicado em <strong>crescimento</strong>.
                            <br><small style="color: #8f7a66;">Sequência da Lei do 7: 1 → 4 → 2 → 8 → 5 → 7 → 1 (estresse) · 3 → 9 → 6 → 3 (tríade)</small>
                        </div>
                    </div>

                    <div class="detalhe">
                        <span class="detalhe-item">😨 Medo: ${tipo.medo}</span>
                        <span class="detalhe-item">💫 Desejo: ${tipo.desejo}</span>
                    </div>
                    <p style="margin-top: 1rem; font-style: italic; color: #6f5f4e;">
                        🌱 Sugestão de crescimento: ${tipo.virtude} – pratique a ${tipo.virtude.toLowerCase()} no seu dia a dia.
                    </p>
                    ${gerarBotoesCompartilhamento()}
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="card-tipo" style="border-left-color: #b8a99a;">
                    <h2>Tipos em destaque</h2>
                    <p style="font-size: 0.9rem; color: #8f7a66; margin-bottom: 0.8rem;">Identificado por: ${nomeMetodo}</p>
                    <p>Você apresentou equilíbrio entre estes tipos:</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.8rem; margin: 0.8rem 0;">
                        ${tiposEncontrados.map(t => `
                            <span class="badge-tipo" style="background: ${t.cor}; color: #fff;">${t.id}. ${t.nome}</span>
                        `).join('')}
                    </div>
                    <p>Explore o catálogo para conhecer todos eles.</p>
                    ${gerarBotoesCompartilhamento()}
                </div>
            `;
        }
    } catch (e) {
        console.error('Erro ao carregar resultado:', e);
        container.innerHTML = `<p style="color: #6f5f4e;">Erro ao carregar resultado. Tente novamente.</p>`;
    }
}


// ==============================================================
// 6. CATÁLOGO
// ==============================================================

function renderCatalogo() {
    const container = document.getElementById('catalogo-container');
    if (!container) {
        console.error('Elemento #catalogo-container não encontrado!');
        return;
    }
    
    container.innerHTML = '';
    TIPOS.forEach(tipo => {
        const div = document.createElement('div');
        div.className = 'item-catalogo';
        div.style.borderLeftColor = tipo.cor;
        div.innerHTML = `
            <div class="nome-tipo"><span style="font-weight: bold;">${tipo.id}.</span> ${tipo.nome}</div>
            <div class="virt-vicio">Virtude: ${tipo.virtude} · Vício: ${tipo.vicio}</div>
        `;
        div.addEventListener('click', () => exibirDetalheCatalogo(tipo.id));
        container.appendChild(div);
    });
}

function exibirDetalheCatalogo(id) {
    const tipo = TIPOS.find(t => t.id === id);
    if (!tipo) return;

    const tipoEstresse = TIPOS.find(t => t.id === tipo.setaEstresse);
    const tipoCrescimento = TIPOS.find(t => t.id === tipo.setaCrescimento);

    const container = document.getElementById('detalhe-catalogo');
    if (!container) return;
    
    container.innerHTML = `
        <div class="card-tipo" style="border-left-color: ${tipo.cor};">
            <h2><span style="font-weight: bold;">Tipo ${tipo.id}:</span> ${tipo.nome}</h2>
            <div class="subtitulo">Virtude: ${tipo.virtude} · Vício: ${tipo.vicio}</div>
            <p>${tipo.descricao}</p>

            <div class="setas-container">
                <h4>🧭 Caminhos de Movimento (Lei do 7)</h4>
                <div class="setas-grid">
                    <div class="seta-estresse">
                        <div class="seta-label">⬇️ Em Estresse (desintegração)</div>
                        <div class="seta-nome"><span style="font-weight: bold;">${tipo.id}</span> → <span style="font-weight: bold;">${tipoEstresse.id}</span> · ${tipoEstresse.nome}</div>
                        <div class="seta-detalhe">Vício: ${tipoEstresse.vicio}</div>
                    </div>
                    <div class="seta-crescimento">
                        <div class="seta-label">⬆️ Em Crescimento (integração)</div>
                        <div class="seta-nome"><span style="font-weight: bold;">${tipo.id}</span> → <span style="font-weight: bold;">${tipoCrescimento.id}</span> · ${tipoCrescimento.nome}</div>
                        <div class="seta-detalhe">Virtude: ${tipoCrescimento.virtude}</div>
                    </div>
                </div>
                <div class="seta-explicacao">
                    <strong>📖 Sobre as setas:</strong> Quando sob estresse, este tipo pode assumir traços negativos do tipo em <strong>estresse</strong>. 
                    Em crescimento, pode acessar virtudes do tipo em <strong>crescimento</strong>.
                    <br><small style="color: #8f7a66;">Sequência da Lei do 7: 1 → 4 → 2 → 8 → 5 → 7 → 1 (estresse) · 3 → 9 → 6 → 3 (tríade)</small>
                </div>
            </div>

            <div class="detalhe">
                <span class="detalhe-item">😨 Medo: ${tipo.medo}</span>
                <span class="detalhe-item">💫 Desejo: ${tipo.desejo}</span>
            </div>
            <p style="margin-top: 1rem; font-style: italic; color: #6f5f4e;">
                🌱 Caminho espiritual: cultivar a ${tipo.virtude.toLowerCase()} e transmutar o ${tipo.vicio.toLowerCase()}.
            </p>
        </div>
    `;
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// ==============================================================
// 7. FORMULÁRIO DE CONTATO
// ==============================================================

function enviarContato(e) {
    e.preventDefault();
    const form = document.getElementById('form-contato');
    if (!form) {
        alert('Formulário não encontrado!');
        return;
    }
    
    const dados = new FormData(form);
    const nome = dados.get('nome');
    const email = dados.get('email');
    const mensagem = dados.get('mensagem');

    if (!nome || !email || !mensagem) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const assunto = `Contato via Eneagrama - ${nome}`;
    const corpo = `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`;

    window.location.href = `mailto:sergioholtz@duck.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    alert('Obrigado pela mensagem! Seu cliente de email será aberto para enviar.');
    form.reset();
}


// ==============================================================
// 8. NAVEGAÇÃO POR ABAS
// ==============================================================

function mudarAba(abaId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    const tabContent = document.getElementById(`tab-${abaId}`);
    if (tabContent) tabContent.classList.add('active');
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${abaId}"]`);
    if (tabBtn) tabBtn.classList.add('active');
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        mudarAba(this.dataset.tab);
    });
});


// ==============================================================
// 9. INICIALIZAÇÃO
// ==============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando...');
    
    renderPerguntas();
    renderTriagem();
    carregarMeuTipo();
    renderCatalogo();

    const formTeste = document.getElementById('form-teste');
    if (formTeste) {
        formTeste.addEventListener('submit', processarTeste);
    } else {
        console.error('Formulário de teste não encontrado!');
    }

    const formTriagem = document.getElementById('form-triagem');
    if (formTriagem) {
        formTriagem.addEventListener('submit', processarTriagem);
    } else {
        console.error('Formulário de triagem não encontrado!');
    }

    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', enviarContato);
    } else {
        console.error('Formulário de contato não encontrado!');
    }

    const btnVerTodos = document.getElementById('btn-ver-todos');
    if (btnVerTodos) {
        btnVerTodos.addEventListener('click', function() {
            mudarAba('catalogo');
        });
    }
    
    console.log('Inicialização concluída!');
});
