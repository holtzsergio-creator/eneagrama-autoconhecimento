// ==============================================================
// DADOS DOS 9 TIPOS DO ENEAGRAMA (com 3 perguntas cada)
// ==============================================================

const TIPOS = [
    {
        id: 1,
        nome: "O Reformador",
        virtude: "Serenidade",
        vicio: "Ira",
        medo: "Ser corrupto, imperfeito",
        desejo: "Ser bom, íntegro",
        descricao: "O Reformador é consciente, ético e tem um forte senso de certo e errado. Busca melhorar o mundo e a si mesmo, mas pode cair no perfeccionismo e na rigidez. No caminho espiritual, aprende a aceitar a imperfeição e a descansar na graça.",
        perguntas: [
            "Sou muito atento a detalhes e organizado, e me incomodo com erros ou desordem.",
            "Tenho um forte senso de certo e errado e procuro sempre fazer o que é correto.",
            "Sou crítico comigo mesmo e com os outros, buscando a perfeição em tudo que faço."
        ],
        cor: "#8B5A2B",
        setaEstresse: 4,
        setaCrescimento: 7
    },
    {
        id: 2,
        nome: "O Ajudador",
        virtude: "Humildade",
        vicio: "Orgulho",
        medo: "Ser indesejado, não amado",
        desejo: "Ser amado e necessário",
        descricao: "O Ajudador é generoso, acolhedor e se doa aos outros. Pode, porém, sacrificar suas próprias necessidades e manipular para ser indispensável. A virtude da humildade o ensina a receber e a reconhecer seus próprios limites.",
        perguntas: [
            "Gosto de ajudar os outros e sou muito generoso, muitas vezes colocando os outros em primeiro lugar.",
            "Sinto-me realizado quando sou útil e necessário para as pessoas ao meu redor.",
            "Tenho facilidade em perceber as necessidades dos outros e faço questão de cuidar deles."
        ],
        cor: "#C47B4A",
        setaEstresse: 8,
        setaCrescimento: 4
    },
    {
        id: 3,
        nome: "O Realizador",
        virtude: "Verdade",
        vicio: "Engano",
        medo: "Ser fracassado, sem valor",
        desejo: "Ser bem-sucedido e admirado",
        descricao: "O Realizador é ambicioso, focado e adaptável. Busca excelência e reconhecimento, mas pode perder a conexão com seus sentimentos reais. A prática da verdade o ajuda a ser autêntico e a encontrar valor além do desempenho.",
        perguntas: [
            "Sou muito focado em metas e gosto de ser reconhecido pelo meu sucesso.",
            "Busco ser o melhor no que faço e me esforço para ser admirado pelos outros.",
            "Sou competitivo e gosto de superar desafios para provar meu valor."
        ],
        cor: "#D4A24C",
        setaEstresse: 9,
        setaCrescimento: 6
    },
    {
        id: 4,
        nome: "O Romântico",
        virtude: "Equanimidade",
        vicio: "Inveja",
        medo: "Ser comum, sem identidade",
        desejo: "Ser único e especial",
        descricao: "O Romântico é sensível, criativo e introspectivo. Busca significado e autenticidade, mas pode se sentir deficiente e comparar-se. A equanimidade traz paz interior e aceitação da própria essência.",
        perguntas: [
            "Sinto que sou diferente dos outros e busco profundamente minha identidade única.",
            "Sou sensível e muitas vezes me identifico com sentimentos de melancolia ou saudade.",
            "Valorizo a autenticidade e a beleza, e me incomodo com o que é superficial ou comum."
        ],
        cor: "#7A5C7A",
        setaEstresse: 2,
        setaCrescimento: 1
    },
    {
        id: 5,
        nome: "O Observador",
        virtude: "Desapego",
        vicio: "Avareza",
        medo: "Ser incapaz, inútil",
        desejo: "Ser competente e entender o mundo",
        descricao: "O Observador é analítico, independente e reservado. Acumula conhecimento para sentir segurança, mas pode se isolar. A virtude do desapego o convida a confiar na vida e a compartilhar seu saber.",
        perguntas: [
            "Prefiro observar e analisar as situações antes de agir, e valorizo meu espaço pessoal.",
            "Gosto de estudar e entender profundamente os assuntos que me interessam.",
            "Sinto-me mais confortável quando posso me retirar para refletir e processar informações."
        ],
        cor: "#4A6B8A",
        setaEstresse: 7,
        setaCrescimento: 8
    },
    {
        id: 6,
        nome: "O Questionador",
        virtude: "Coragem",
        vicio: "Medo",
        medo: "Ficar sem apoio, ser traído",
        desejo: "Ter segurança e orientação",
        descricao: "O Questionador é leal, vigilante e responsável. Antecipa problemas e busca proteção, mas a ansiedade pode dominá-lo. A coragem o ajuda a confiar em si mesmo e na vida, mesmo na incerteza.",
        perguntas: [
            "Costumo pensar nos piores cenários e busco segurança em pessoas ou instituições.",
            "Sou leal e valorizo a confiança, mas também sou desconfiado com novas pessoas.",
            "Gosto de ter um plano de ação e me preparar para possíveis problemas futuros."
        ],
        cor: "#8F8A6B",
        setaEstresse: 3,
        setaCrescimento: 9
    },
    {
        id: 7,
        nome: "O Entusiasta",
        virtude: "Sobriedade",
        vicio: "Gula",
        medo: "Ficar preso à dor ou ao tédio",
        desejo: "Ser feliz e livre",
        descricao: "O Entusiasta é otimista, espontâneo e busca novas experiências. Evita o sofrimento e pode dispersar-se. A sobriedade o ensina a encontrar contentamento no simples e a enfrentar a dor com maturidade.",
        perguntas: [
            "Sou otimista, adoro novidades e evito situações que me pareçam chatas ou dolorosas.",
            "Tenho uma mente inquieta e estou sempre buscando novas experiências e ideias.",
            "Evito o tédio e a dor, preferindo focar no que é positivo e prazeroso."
        ],
        cor: "#C49A6C",
        setaEstresse: 1,
        setaCrescimento: 5
    },
    {
        id: 8,
        nome: "O Desafiador",
        virtude: "Inocência",
        vicio: "Luxúria (excesso)",
        medo: "Ser controlado, vulnerável",
        desejo: "Proteger-se e ter controle",
        descricao: "O Desafiador é forte, protetor e direto. Luta por justiça e não gosta de fraquezas, mas pode dominar os outros. A inocência o reconecta à leveza e à confiança no fluxo da vida.",
        perguntas: [
            "Sou decidido, defendo os outros e não gosto de ser controlado ou de mostrar vulnerabilidade.",
            "Tenho forte presença e não tenho medo de confrontos quando necessário.",
            "Gosto de assumir o controle das situações e proteger aqueles que considero mais fracos."
        ],
        cor: "#A65A4A",
        setaEstresse: 5,
        setaCrescimento: 2
    },
    {
        id: 9,
        nome: "O Pacificador",
        virtude: "Ação",
        vicio: "Preguiça (acomodação)",
        medo: "Perder a harmonia, ser excluído",
        desejo: "Ter paz e união",
        descricao: "O Pacificador é calmo, receptivo e mediador. Evita conflitos e pode se esquecer de si mesmo. A virtude da ação o motiva a ocupar seu lugar e a expressar sua vontade com amor.",
        perguntas: [
            "Evito conflitos e busco harmonia, muitas vezes concordando com os outros para manter a paz.",
            "Tenho facilidade em ver todos os lados de uma situação e mediá-los.",
            "Costumo me esquecer de mim mesmo para acomodar as necessidades dos outros."
        ],
        cor: "#7A8B7A",
        setaEstresse: 6,
        setaCrescimento: 3
    }
];