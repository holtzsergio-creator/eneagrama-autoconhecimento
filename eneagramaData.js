// ==============================================================
// DADOS DOS 9 TIPOS DO ENEAGRAMA
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
        pergunta: "Sou muito atento a detalhes e organizado, e me incomodo com erros ou desordem.",
        cor: "#8B5A2B"
    },
    {
        id: 2,
        nome: "O Ajudador",
        virtude: "Humildade",
        vicio: "Orgulho",
        medo: "Ser indesejado, não amado",
        desejo: "Ser amado e necessário",
        descricao: "O Ajudador é generoso, acolhedor e se doa aos outros. Pode, porém, sacrificar suas próprias necessidades e manipular para ser indispensável. A virtude da humildade o ensina a receber e a reconhecer seus próprios limites.",
        pergunta: "Gosto de ajudar os outros e sou muito generoso, muitas vezes colocando os outros em primeiro lugar.",
        cor: "#C47B4A"
    },
    {
        id: 3,
        nome: "O Realizador",
        virtude: "Verdade",
        vicio: "Engano",
        medo: "Ser fracassado, sem valor",
        desejo: "Ser bem-sucedido e admirado",
        descricao: "O Realizador é ambicioso, focado e adaptável. Busca excelência e reconhecimento, mas pode perder a conexão com seus sentimentos reais. A prática da verdade o ajuda a ser autêntico e a encontrar valor além do desempenho.",
        pergunta: "Sou muito focado em metas e gosto de ser reconhecido pelo meu sucesso.",
        cor: "#D4A24C"
    },
    {
        id: 4,
        nome: "O Romântico",
        virtude: "Equanimidade",
        vicio: "Inveja",
        medo: "Ser comum, sem identidade",
        desejo: "Ser único e especial",
        descricao: "O Romântico é sensível, criativo e introspectivo. Busca significado e autenticidade, mas pode se sentir deficiente e comparar-se. A equanimidade traz paz interior e aceitação da própria essência.",
        pergunta: "Sinto que sou diferente dos outros e busco profundamente minha identidade única.",
        cor: "#7A5C7A"
    },
    {
        id: 5,
        nome: "O Observador",
        virtude: "Desapego",
        vicio: "Avareza",
        medo: "Ser incapaz, inútil",
        desejo: "Ser competente e entender o mundo",
        descricao: "O Observador é analítico, independente e reservado. Acumula conhecimento para sentir segurança, mas pode se isolar. A virtude do desapego o convida a confiar na vida e a compartilhar seu saber.",
        pergunta: "Prefiro observar e analisar as situações antes de agir, e valorizo meu espaço pessoal.",
        cor: "#4A6B8A"
    },
    {
        id: 6,
        nome: "O Questionador",
        virtude: "Coragem",
        vicio: "Medo",
        medo: "Ficar sem apoio, ser traído",
        desejo: "Ter segurança e orientação",
        descricao: "O Questionador é leal, vigilante e responsável. Antecipa problemas e busca proteção, mas a ansiedade pode dominá-lo. A coragem o ajuda a confiar em si mesmo e na vida, mesmo na incerteza.",
        pergunta: "Costumo pensar nos piores cenários e busco segurança em pessoas ou instituições.",
        cor: "#8F8A6B"
    },
    {
        id: 7,
        nome: "O Entusiasta",
        virtude: "Sobriedade",
        vicio: "Gula",
        medo: "Ficar preso à dor ou ao tédio",
        desejo: "Ser feliz e livre",
        descricao: "O Entusiasta é otimista, espontâneo e busca novas experiências. Evita o sofrimento e pode dispersar-se. A sobriedade o ensina a encontrar contentamento no simples e a enfrentar a dor com maturidade.",
        pergunta: "Sou otimista, adoro novidades e evito situações que me pareçam chatas ou dolorosas.",
        cor: "#C49A6C"
    },
    {
        id: 8,
        nome: "O Desafiador",
        virtude: "Inocência",
        vicio: "Luxúria (excesso)",
        medo: "Ser controlado, vulnerável",
        desejo: "Proteger-se e ter controle",
        descricao: "O Desafiador é forte, protetor e direto. Luta por justiça e não gosta de fraquezas, mas pode dominar os outros. A inocência o reconecta à leveza e à confiança no fluxo da vida.",
        pergunta: "Sou decidido, defendo os outros e não gosto de ser controlado ou de mostrar vulnerabilidade.",
        cor: "#A65A4A"
    },
    {
        id: 9,
        nome: "O Pacificador",
        virtude: "Ação",
        vicio: "Preguiça (acomodação)",
        medo: "Perder a harmonia, ser excluído",
        desejo: "Ter paz e união",
        descricao: "O Pacificador é calmo, receptivo e mediador. Evita conflitos e pode se esquecer de si mesmo. A virtude da ação o motiva a ocupar seu lugar e a expressar sua vontade com amor.",
        pergunta: "Evito conflitos e busco harmonia, muitas vezes concordando com os outros para manter a paz.",
        cor: "#7A8B7A"
    }
];
