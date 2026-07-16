// ==============================================================
// LÓGICA PRINCIPAL
// ==============================================================

// ==============================================================
// 1. TESTE LIKERT (escala de 4 pontos)
// ==============================================================

function renderPerguntas() {
    const container = document.getElementById('perguntas-container');
    container.innerHTML = '';
    TIPOS.forEach((tipo, index) => {
        const div = document.createElement('div');
        div.className = 'pergunta';
        div.innerHTML = `
            <p><strong>${index + 1}.</strong> ${tipo.pergunta}</p>
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
    const dados = new FormData(form);

    const pontuacao = TIPOS.map(() => 0);
    for (let i = 0; i < TIPOS.length; i++) {
        const val = dados.get(`q${i}`);
        if (val) {
            pontuacao[i] = parseInt(val, 10);
        }
    }

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
// 2. TRIAGEM RÁPIDA (Riso-Hudson)
// ==============================================================

function renderTriagem() {
    const grupoI = document.getElementById('grupo-I');
    const grupoII = document.getElementById('grupo-II');

    // Grupo I
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

    // Grupo II
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
// 3. EXIBIR RESULTADO (COM SETAS DE MOVIMENTO)
// ==============================================================

function exibirResultado(empatados, pontuacao, metodo) {
    const container = document.getElementById('resultado-teste');
    const nomeMetodo = metodo === 'teste-likert' ? 'Teste Likert' : 'Triagem Rápida (Riso-Hudson)';

    if (empatados.length === 1) {
        const tipo = empatados[0].tipo;
        const tipoEstresse = TIPOS.find(t => t.id === tipo.setaEstresse);
        const tipoCrescimento = TIPOS.find(t => t.id === tipo.setaCrescimento);

        container.innerHTML = `
            <div class="card-tipo" style="border-left-color: ${tipo.cor};">
                <h2>Seu tipo principal é: ${tipo.nome}</h2>
                <div class="subtitulo">${metodo === 'teste-likert' ? `Pontuação: ${pontuacao} / 4` : 'Método Riso-Hudson'} · ${nomeMetodo}</div>
                <p style="margin: 0.8rem 0;">${tipo.descricao}</p>

                <!-- SETAS DE MOVIMENTO -->
                <div class="setas-container">
                    <h4>🧭 Caminhos de Movimento (Lei do 7)</h4>
                    <div class="setas-grid">
                        <div class="seta-estresse">
                            <div class="seta-label">⬇️ Em Estresse (desintegração)</div>
                            <div class="seta-nome">${tipoEstresse.nome}</div>
                            <div class="seta-detalhe">Vício: ${tipoEstresse.vicio}</div>
                        </div>
                        <div class="seta-crescimento">
                            <div class="seta-label">⬆️ Em Crescimento (integração)</div>
                            <div class="seta-nome">${tipoCrescimento.nome}</div>
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
            </div>
        `;
    } else {
        // EMPATE
        const nomes = empatados.map(r => r.tipo.nome).join(' e ');
        container.innerHTML = `
            <div class="card-tipo" style="border-left-color: #b8a99a;">
                <h2>Empate entre: ${nomes}</h2>
                <p>Você tem características fortes de mais de um tipo. Leia sobre todos eles para se aprofundar.</p>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.8rem;">
                    ${empatados.map(r => `
                        <span class="badge-tipo" style="background: ${r.tipo.cor}; color: #fff;">${r.tipo.nome}</span>
                    `).join('')}
                </div>
                <p style="margin-top: 0.8rem; font-size: 0.9rem; color: #6f5f4e;">Explore o catálogo para conhecer todos os tipos e suas setas de movimento.</p>
            </div>
        `;
    }
    carregarMeuTipo();
}


// ==============================================================
// 4. EXIBIR "MEU TIPO" (SALVO)
// ==============================================================

function carregarMeuTipo() {
    const container = document.getElementById('meu-tipo-container');
    const stored = localStorage.getItem('eneagrama_resultado');

    if (!stored) {
        container.innerHTML = `<p style="color: #6f5f4e;">Você ainda não fez nenhum teste. Vá para a aba <strong>Teste</strong> ou <strong>Triagem Rápida</strong> e descubra seu tipo.</p>`;
        return;
    }

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
                <h2>${tipo.nome}</h2>
                <div class="subtitulo">Virtude: ${tipo.virtude} · Vício: ${tipo.vicio}</div>
                <p style="font-size: 0.9rem; color: #8f7a66; margin-bottom: 0.8rem;">Identificado por: ${nomeMetodo}</p>
                <p>${tipo.descricao}</p>

                <!-- SETAS DE MOVIMENTO -->
                <div class="setas-container">
                    <h4>🧭 Caminhos de Movimento (Lei do 7)</h4>
                    <div class="setas-grid">
                        <div class="seta-estresse">
                            <div class="seta-label">⬇️ Em Estresse (desintegração)</div>
                            <div class="seta-nome">${tipoEstresse.nome}</div>
                            <div class="seta-detalhe">Vício: ${tipoEstresse.vicio}</div>
                        </div>
                        <div class="seta-crescimento">
                            <div class="seta-label">⬆️ Em Crescimento (integração)</div>
                            <div class="seta-nome">${tipoCrescimento.nome}</div>
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
                        <span class="badge-tipo" style="background: ${t.cor}; color: #fff;">${t.nome}</span>
                    `).join('')}
                </div>
                <p>Explore o catálogo para conhecer todos eles.</p>
            </div>
        `;
    }
}


// ==============================================================
// 5. CATÁLOGO
// ==============================================================

function renderCatalogo() {
    const container = document.getElementById('catalogo-container');
    container.innerHTML = '';
    TIPOS.forEach(tipo => {
        const div = document.createElement('div');
        div.className = 'item-catalogo';
        div.style.borderLeftColor = tipo.cor;
        div.innerHTML = `
            <div class="nome-tipo">${tipo.nome}</div>
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
    container.innerHTML = `
        <div class="card-tipo" style="border-left-color: ${tipo.cor};">
            <h2>${tipo.nome}</h2>
            <div class="subtitulo">Virtude: ${tipo.virtude} · Vício: ${tipo.vicio}</div>
            <p>${tipo.descricao}</p>

            <!-- SETAS DE MOVIMENTO -->
            <div class="setas-container">
                <h4>🧭 Caminhos de Movimento (Lei do 7)</h4>
                <div class="setas-grid">
                    <div class="seta-estresse">
                        <div class="seta-label">⬇️ Em Estresse (desintegração)</div>
                        <div class="seta-nome">${tipoEstresse.nome}</div>
                        <div class="seta-detalhe">Vício: ${tipoEstresse.vicio}</div>
                    </div>
                    <div class="seta-crescimento">
                        <div class="seta-label">⬆️ Em Crescimento (integração)</div>
                        <div class="seta-nome">${tipoCrescimento.nome}</div>
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
// 6. NAVEGAÇÃO POR ABAS
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
// 7. INICIALIZAÇÃO
// ==============================================================

document.addEventListener('DOMContentLoaded', function() {
    renderPerguntas();
    renderTriagem();
    carregarMeuTipo();
    renderCatalogo();

    document.getElementById('form-teste').addEventListener('submit', processarTeste);
    document.getElementById('form-triagem').addEventListener('submit', processarTriagem);

    document.getElementById('btn-ver-todos').addEventListener('click', function() {
        mudarAba('catalogo');
    });
});