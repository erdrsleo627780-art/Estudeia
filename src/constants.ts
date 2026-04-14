import { Question, QuestionDatabase } from './types';

export const QUESTIONS_BY_SUBJECT: QuestionDatabase = {
  "6º Ano": {
    "Matemática": {
      1: [
        { q: "Quanto é 1/2 + 1/4?", opts: ["1/6", "3/4", "2/4", "1/8"], ans: 1, explanation: ["MMC de 2 e 4 é 4.", "1/2 = 2/4.", "2/4 + 1/4 = 3/4."], mistake: "Somar denominadores." },
        { q: "Qual o valor de 25% de 80?", opts: ["15", "20", "25", "30"], ans: 1, explanation: ["25% = 1/4.", "80 / 4 = 20."], mistake: "Confundir 25% com 1/5." },
        { q: "Simplifique 12/18.", opts: ["2/3", "3/4", "4/6", "1/2"], ans: 0, explanation: ["Divida por 6.", "12/6=2, 18/6=3."], mistake: "Dividir errado." },
        { q: "Dobro de 37?", opts: ["64", "74", "84", "67"], ans: 1, explanation: ["37 * 2 = 74."], mistake: "Erro na soma." },
        { q: "15% de 200?", opts: ["20", "25", "30", "35"], ans: 2, explanation: ["0,15 * 200 = 30."], mistake: "Erro no cálculo." },
        { q: "Perímetro de quadrado lado 7cm?", opts: ["14cm", "21cm", "28cm", "49cm"], ans: 2, explanation: ["4 * 7 = 28."], mistake: "Calcular área." },
        { q: "3/5 de 40?", opts: ["15", "20", "24", "30"], ans: 2, explanation: ["(40/5)*3 = 24."], mistake: "Multiplicar sem dividir." },
        { q: "7 x 8?", opts: ["54", "56", "64", "48"], ans: 1, explanation: ["Tabuada: 56."], mistake: "Confundir tabuada." },
        { q: "100 - 37?", opts: ["63", "73", "53", "67"], ans: 0, explanation: ["100-30=70, 70-7=63."], mistake: "Erro na dezena." },
        { q: "Sucessor de 999?", opts: ["998", "1000", "1001", "1100"], ans: 1, explanation: ["999 + 1 = 1000."], mistake: "Antecessor." },
        { q: "Qual o valor de 5²?", opts: ["10", "15", "25", "50"], ans: 2, explanation: ["5 * 5 = 25."], mistake: "Fazer 5*2." },
        { q: "Raiz quadrada de 81?", opts: ["7", "8", "9", "10"], ans: 2, explanation: ["9 * 9 = 81."], mistake: "Dividir por 2." },
        { q: "Quanto é 0,5 + 0,25?", opts: ["0,7", "0,75", "0,8", "1,0"], ans: 1, explanation: ["0,50 + 0,25 = 0,75."], mistake: "Alinhamento decimal." },
        { q: "Um ângulo reto mede:", opts: ["45°", "90°", "180°", "360°"], ans: 1, explanation: ["Ângulo reto = 90°."], mistake: "Ângulo raso." },
        { q: "Triplo de 15?", opts: ["30", "45", "60", "75"], ans: 1, explanation: ["15 * 3 = 45."], mistake: "Dobro." }
      ],
      2: [
        { q: "Se 3x + 7 = 22, qual o valor de x?", opts: ["3", "4", "5", "6"], ans: 2, explanation: ["3x = 15, x = 5."], mistake: "Erro na subtração." },
        { q: "Área de retângulo 8x5cm?", opts: ["26cm²", "40cm²", "13cm²", "80cm²"], ans: 1, explanation: ["8 * 5 = 40."], mistake: "Perímetro." },
        { q: "Média de 4, 8, 6, 10, 12?", opts: ["7", "8", "9", "10"], ans: 1, explanation: ["40 / 5 = 8."], mistake: "Soma errada." },
        { q: "Raiz de 144?", opts: ["10", "12", "14", "16"], ans: 1, explanation: ["12 * 12 = 144."], mistake: "Confundir com 14." },
        { q: "80km/h em 3h percorre:", opts: ["200km", "240km", "280km", "300km"], ans: 1, explanation: ["80 * 3 = 240."], mistake: "Somar." }
      ]
    },
    "Português": {
      1: [
        { q: "Qual o plural de 'cidadão'?", opts: ["cidadões", "cidadãos", "cidadõens", "cidadõs"], ans: 1, explanation: ["Cidadãos é o plural correto."], mistake: "Generalizar -ões." },
        { q: "Em 'O menino correu', qual o sujeito?", opts: ["correu", "rápido", "O menino", "menino"], ans: 2, explanation: ["Quem correu? O menino."], mistake: "Confundir com o verbo." },
        { q: "Qual palavra está escrita corretamente?", opts: ["excessão", "exceção", "escepção", "exeção"], ans: 1, explanation: ["Exceção deriva de exceto."], mistake: "Escrever excessão." },
        { q: "Antônimo de 'feliz'?", opts: ["alegre", "contente", "triste", "animado"], ans: 2, explanation: ["Antônimo é o oposto."], mistake: "Sinônimo." },
        { q: "Coletivo de 'peixes'?", opts: ["Alcateia", "Cardume", "Enxame", "Manada"], ans: 1, explanation: ["Cardume = peixes."], mistake: "Alcateia." },
        { q: "Sílaba tônica de 'café'?", opts: ["ca", "fé", "Não tem", "As duas"], ans: 1, explanation: ["Café é oxítona."], mistake: "Primeira sílaba." },
        { q: "Qual o substantivo em 'A casa é bela'?", opts: ["A", "casa", "é", "bela"], ans: 1, explanation: ["Casa nomeia o objeto."], mistake: "Adjetivo." },
        { q: "Qual o adjetivo em 'O carro azul'?", opts: ["O", "carro", "azul", "carro azul"], ans: 2, explanation: ["Azul caracteriza o carro."], mistake: "Substantivo." },
        { q: "Plural de 'pão'?", opts: ["pãos", "pães", "pões", "pãens"], ans: 1, explanation: ["Pães é o plural irregular."], mistake: "Pãos." },
        { q: "Qual o verbo em 'Eu estudo muito'?", opts: ["Eu", "estudo", "muito", "estudo muito"], ans: 1, explanation: ["Estudo indica a ação."], mistake: "Pronome." },
        { q: "Sinônimo de 'rápido'?", opts: ["lento", "devagar", "veloz", "parado"], ans: 2, explanation: ["Sinônimo tem sentido igual."], mistake: "Antônimo." },
        { q: "Qual a sílaba tônica de 'relógio'?", opts: ["re", "ló", "gi", "o"], ans: 1, explanation: ["Relógio é paroxítona."], mistake: "Última sílaba." },
        { q: "Feminino de 'cavalo'?", opts: ["égua", "cavala", "mula", "zebra"], ans: 0, explanation: ["Égua é o feminino de cavalo."], mistake: "Cavala." },
        { q: "Qual o artigo em 'Um dia frio'?", opts: ["Um", "dia", "frio", "Um dia"], ans: 0, explanation: ["Um é artigo indefinido."], mistake: "Substantivo." },
        { q: "Qual a pontuação para uma pergunta?", opts: ["Ponto final", "Vírgula", "Interrogação", "Exclamação"], ans: 2, explanation: ["Interrogação indica pergunta."], mistake: "Exclamação." }
      ]
    },
    "Ciências": {
      1: [
        { q: "Qual gás é essencial para a respiração humana?", opts: ["CO₂", "Nitrogênio", "Oxigênio", "Hidrogênio"], ans: 2, explanation: ["Precisamos de O₂ para respirar."], mistake: "CO₂." },
        { q: "Função do coração?", opts: ["Filtrar sangue", "Bombear sangue", "Produzir hormônios", "Digerir"], ans: 1, explanation: ["O coração bombeia o sangue."], mistake: "Filtrar." },
        { q: "Célula vegetal tem e a animal não:", opts: ["Membrana", "Mitocôndria", "Parede celular", "Ribossomo"], ans: 2, explanation: ["Parede celular dá rigidez."], mistake: "Membrana." },
        { q: "Planeta mais próximo do Sol?", opts: ["Vênus", "Terra", "Mercúrio", "Marte"], ans: 2, explanation: ["Mercúrio é o primeiro."], mistake: "Vênus." },
        { q: "Fotossíntese ocorre nos:", opts: ["Mitocôndrias", "Vacúolos", "Cloroplastos", "Ribossomos"], ans: 2, explanation: ["Cloroplastos captam luz."], mistake: "Mitocôndrias." },
        { q: "Maior osso do corpo?", opts: ["Úmero", "Fêmur", "Rádio", "Tíbia"], ans: 1, explanation: ["Fêmur fica na coxa."], mistake: "Úmero." },
        { q: "Satélite natural da Terra?", opts: ["Sol", "Lua", "Marte", "Estrela"], ans: 1, explanation: ["A Lua orbita a Terra."], mistake: "Sol." },
        { q: "Estado físico do gelo?", opts: ["Sólido", "Líquido", "Gasoso", "Plasma"], ans: 0, explanation: ["Gelo é água sólida."], mistake: "Líquido." },
        { q: "Parte da planta que faz fotossíntese?", opts: ["Raiz", "Caule", "Folha", "Fruto"], ans: 2, explanation: ["Folhas têm clorofila."], mistake: "Raiz." },
        { q: "O que é o Sol?", opts: ["Planeta", "Cometa", "Estrela", "Galáxia"], ans: 2, explanation: ["O Sol é uma estrela."], mistake: "Planeta." },
        { q: "Quantos planetas no Sistema Solar?", opts: ["7", "8", "9", "10"], ans: 1, explanation: ["São 8 planetas oficiais."], mistake: "9." },
        { q: "Gás que as plantas absorvem na fotossíntese?", opts: ["Oxigênio", "Gás Carbônico", "Nitrogênio", "Hélio"], ans: 1, explanation: ["Absorvem CO₂ e soltam O₂."], mistake: "Oxigênio." },
        { q: "Onde fica o cérebro?", opts: ["Tórax", "Abdômen", "Crânio", "Pelve"], ans: 2, explanation: ["Protegido pelo crânio."], mistake: "Tórax." },
        { q: "Animal que nasce de ovo é:", opts: ["Mamífero", "Ovíparo", "Vivíparo", "Herbívoro"], ans: 1, explanation: ["Ovíparo põe ovos."], mistake: "Mamífero." },
        { q: "Principal fonte de energia da Terra?", opts: ["Lua", "Vento", "Sol", "Petróleo"], ans: 2, explanation: ["O Sol sustenta a vida."], mistake: "Vento." }
      ]
    },
    "História": {
      1: [
        { q: "Quem foi o primeiro presidente do Brasil?", opts: ["Dom Pedro II", "Getúlio Vargas", "Deodoro da Fonseca", "JK"], ans: 2, explanation: ["Deodoro assumiu em 1889."], mistake: "Dom Pedro II." },
        { q: "Ano do 'descobrimento' do Brasil?", opts: ["1492", "1500", "1550", "1498"], ans: 1, explanation: ["Cabral chegou em 1500."], mistake: "1492." },
        { q: "Civilização que construiu as Pirâmides?", opts: ["Romanos", "Gregos", "Egípcios", "Maias"], ans: 2, explanation: ["Egípcios construíram em Gizé."], mistake: "Maias." },
        { q: "Quem descobriu a América em 1492?", opts: ["Vasco da Gama", "Cabral", "Colombo", "Vespúcio"], ans: 2, explanation: ["Colombo navegou pela Espanha."], mistake: "Cabral." },
        { q: "O que foi a Lei Áurea?", opts: ["Deu terras", "Libertou escravos", "Criou o café", "Expulsou holandeses"], ans: 1, explanation: ["Assinada em 1888 pela Princesa Isabel."], mistake: "Deu terras." },
        { q: "Onde surgiu a democracia?", opts: ["Roma", "Esparta", "Atenas", "Egito"], ans: 2, explanation: ["Atenas, na Grécia Antiga."], mistake: "Roma." },
        { q: "Principal atividade econômica do Brasil Colônia no início?", opts: ["Ouro", "Café", "Pau-Brasil", "Soja"], ans: 2, explanation: ["Extração de madeira para tintura."], mistake: "Ouro." },
        { q: "Quem gritou 'Independência ou Morte'?", opts: ["Dom Pedro I", "Dom Pedro II", "Tiradentes", "Zumbi"], ans: 0, explanation: ["Dom Pedro I, em 1822."], mistake: "Tiradentes." },
        { q: "O que eram as Capitanias Hereditárias?", opts: ["Cidades", "Lotes de terra", "Navios", "Leis"], ans: 1, explanation: ["Divisão do Brasil por Portugal."], mistake: "Cidades." },
        { q: "Quem foi o líder do Quilombo dos Palmares?", opts: ["Tiradentes", "Zumbi", "Aleijadinho", "Bento Gonçalves"], ans: 1, explanation: ["Zumbi lutou contra a escravidão."], mistake: "Tiradentes." },
        { q: "A escrita surgiu na:", opts: ["Grécia", "Mesopotâmia", "China", "Egito"], ans: 1, explanation: ["Escrita cuneiforme dos sumérios."], mistake: "Grécia." },
        { q: "O que foi o Tratado de Tordesilhas?", opts: ["Paz mundial", "Divisão de terras entre Portugal e Espanha", "Fim da guerra", "Lei de comércio"], ans: 1, explanation: ["Dividiu o 'Novo Mundo'."], mistake: "Fim da guerra." },
        { q: "Quem eram os Bandeirantes?", opts: ["Padres", "Exploradores do interior", "Reis", "Escravos"], ans: 1, explanation: ["Buscavam ouro e indígenas."], mistake: "Padres." },
        { q: "A Revolução Francesa defendia:", opts: ["Escravidão", "Liberdade, Igualdade e Fraternidade", "Monarquia absoluta", "Paz total"], ans: 1, explanation: ["Lema: Liberté, Égalité, Fraternité."], mistake: "Monarquia." },
        { q: "O que foi a Pré-História?", opts: ["Antes da escrita", "Depois de Cristo", "Idade Média", "Era Digital"], ans: 0, explanation: ["Período anterior à invenção da escrita."], mistake: "Idade Média." }
      ]
    }
  },
  "7º Ano": {
    "Matemática": {
      1: [
        { q: "Quanto é -5 + 8?", opts: ["-3", "3", "13", "-13"], ans: 1, explanation: ["Sinais diferentes, subtrai e mantém o do maior."], mistake: "Somar os valores." },
        { q: "Valor de (-2)³?", opts: ["-6", "6", "-8", "8"], ans: 2, explanation: ["-2 * -2 * -2 = -8."], mistake: "Fazer -2 * 3." },
        { q: "Qual o valor de x em x - 10 = -4?", opts: ["-14", "6", "-6", "14"], ans: 1, explanation: ["x = -4 + 10 = 6."], mistake: "x = -14." },
        { q: "Quanto é 3/4 de 100?", opts: ["25", "50", "75", "80"], ans: 2, explanation: ["(100/4)*3 = 75."], mistake: "25." },
        { q: "O que é um número primo?", opts: ["Divisível por 2", "Divisível por 1 e por ele mesmo", "Número par", "Número terminado em 1"], ans: 1, explanation: ["Primos têm apenas 2 divisores."], mistake: "Achar que todo ímpar é primo." },
        { q: "Qual o MMC de 4 e 6?", opts: ["2", "10", "12", "24"], ans: 2, explanation: ["Múltiplos de 4: 4, 8, 12... Múltiplos de 6: 6, 12..."], mistake: "Usar o MDC." },
        { q: "Qual o MDC de 12 e 18?", opts: ["2", "3", "6", "36"], ans: 2, explanation: ["Divisores de 12: 1, 2, 3, 4, 6, 12. Divisores de 18: 1, 2, 3, 6, 9, 18."], mistake: "Usar o MMC." },
        { q: "Quanto é 20% de 150?", opts: ["15", "20", "30", "45"], ans: 2, explanation: ["0,2 * 150 = 30."], mistake: "15." },
        { q: "Um triângulo com 3 lados iguais é:", opts: ["Isósceles", "Escaleno", "Equilátero", "Retângulo"], ans: 2, explanation: ["Equi (igual) + látero (lado)."], mistake: "Isósceles." },
        { q: "Soma dos ângulos internos de um triângulo?", opts: ["90°", "180°", "270°", "360°"], ans: 1, explanation: ["Sempre 180°."], mistake: "360°." },
        { q: "Quanto é 2,5 * 4?", opts: ["8", "9", "10", "12"], ans: 2, explanation: ["2,5 + 2,5 + 2,5 + 2,5 = 10."], mistake: "8." },
        { q: "O valor de √49 + √16 é:", opts: ["9", "11", "13", "65"], ans: 1, explanation: ["7 + 4 = 11."], mistake: "√65." },
        { q: "Se um livro custa R$ 40 e tem 10% de desconto, o preço é:", opts: ["R$ 30", "R$ 34", "R$ 36", "R$ 38"], ans: 2, explanation: ["10% de 40 = 4. 40 - 4 = 36."], mistake: "R$ 30." },
        { q: "Qual o valor de 2x = 14?", opts: ["7", "12", "16", "28"], ans: 0, explanation: ["x = 14 / 2 = 7."], mistake: "28." },
        { q: "O oposto de -15 é:", opts: ["0", "1", "15", "-1/15"], ans: 2, explanation: ["Oposto muda o sinal."], mistake: "Inverso." }
      ]
    },
    "Português": {
        1: [
          { q: "O que é um sujeito composto?", opts: ["Tem um núcleo", "Tem dois ou mais núcleos", "Não tem núcleo", "É oculto"], ans: 1, explanation: ["Ex: João e Maria saíram."], mistake: "Achar que é plural." },
          { q: "Qual a função do adjetivo?", opts: ["Indicar ação", "Caracterizar o substantivo", "Substituir o nome", "Ligar orações"], ans: 1, explanation: ["Ex: Carro 'veloz'."], mistake: "Indicar ação." },
          { q: "O que é uma oxítona?", opts: ["Sílaba tônica é a última", "Sílaba tônica é a penúltima", "Sílaba tônica é a antepenúltima", "Não tem acento"], ans: 0, explanation: ["Ex: Café, Maracujá."], mistake: "Paroxítona." },
          { q: "Qual o coletivo de 'lobos'?", opts: ["Cardume", "Alcateia", "Enxame", "Manada"], ans: 1, explanation: ["Alcateia = lobos."], mistake: "Cardume." },
          { q: "O que é um dígrafo?", opts: ["Duas vogais", "Duas letras com um único som", "Três vogais", "Encontro de consoantes"], ans: 1, explanation: ["Ex: CH, LH, NH, RR, SS."], mistake: "Ditongo." },
          { q: "Qual o plural de 'mão'?", opts: ["mãos", "mães", "mões", "mãens"], ans: 0, explanation: ["Mão faz plural em -ãos."], mistake: "Mães." },
          { q: "Em 'Ele viajou ontem', qual o advérbio?", opts: ["Ele", "viajou", "ontem", "viajou ontem"], ans: 2, explanation: ["Ontem indica tempo."], mistake: "Verbo." },
          { q: "O que é um hiato?", opts: ["Vogais juntas", "Vogais em sílabas separadas", "Três vogais", "Duas consoantes"], ans: 1, explanation: ["Ex: Sa-ú-de."], mistake: "Ditongo." },
          { q: "Qual o feminino de 'ator'?", opts: ["atora", "atriz", "atrizadora", "atrizinha"], ans: 1, explanation: ["Atriz é o feminino."], mistake: "Atora." },
          { q: "O que é uma frase interrogativa?", opts: ["Uma ordem", "Uma pergunta", "Uma surpresa", "Uma afirmação"], ans: 1, explanation: ["Termina com '?'."], mistake: "Exclamação." },
          { q: "Qual o antônimo de 'alto'?", opts: ["grande", "baixo", "comprido", "largo"], ans: 1, explanation: ["Baixo é o oposto."], mistake: "Grande." },
          { q: "O que é um substantivo próprio?", opts: ["Nome comum", "Nome de pessoa ou lugar", "Qualidade", "Ação"], ans: 1, explanation: ["Sempre com letra maiúscula."], mistake: "Substantivo comum." },
          { q: "Qual a classe de 'nós'?", opts: ["Verbo", "Substantivo", "Pronome", "Adjetivo"], ans: 2, explanation: ["Pronome pessoal."], mistake: "Verbo." },
          { q: "O que indica o ponto de exclamação?", opts: ["Pergunta", "Emoção ou surpresa", "Fim de frase", "Pausa"], ans: 1, explanation: ["Ex: Que susto!"], mistake: "Pergunta." },
          { q: "Qual o plural de 'canal'?", opts: ["canals", "canais", "canães", "canalses"], ans: 1, explanation: ["Terminados em -al fazem -ais."], mistake: "Canals." }
        ]
      }
    }
};

export const NIVEL_QUESTIONS: Question[] = [
  { q: "Quanto é 1/2 + 1/4?", opts: ["1/6", "3/4", "2/4", "1/8"], ans: 1 },
  { q: "Qual é 25% de 80?", opts: ["15", "20", "25", "30"], ans: 1 },
  { q: "Se 3x + 7 = 22, qual é x?", opts: ["3", "4", "5", "6"], ans: 2 },
  { q: "Simplifique 12/18.", opts: ["2/3", "3/4", "4/6", "1/2"], ans: 0 },
  { q: "Área de retângulo 8cm × 5cm?", opts: ["26cm²", "40cm²", "13cm²", "80cm²"], ans: 1 },
];

export const AVATARS = [
  { id: 'leão', emoji: '🦁', name: 'Leão' },
  { id: 'borboleta', emoji: '🦋', name: 'Borboleta' },
  { id: 'coelho', emoji: '🐰', name: 'Coelho' },
  { id: 'cavalo', emoji: '🐴', name: 'Cavalo' },
  { id: 'zebra', emoji: '🦓', name: 'Zebra' },
];
