import { Question, QuestionDatabase } from './types';

export const QUESTIONS_BY_SUBJECT: QuestionDatabase = {
  "Matemática": {
    1: [
      { q: "Quanto é 1/2 + 1/4?", opts: ["1/6", "3/4", "2/4", "1/8"], ans: 1, explanation: ["Encontre o MMC de 2 e 4, que é 4.", "Converta 1/2 = 2/4.", "Some: 2/4 + 1/4 = 3/4."], mistake: "Somar os denominadores diretamente (1/2+1/4 ≠ 2/6)." },
      { q: "Qual é o valor de 25% de 80?", opts: ["15", "20", "25", "30"], ans: 1, explanation: ["25% = 25/100.", "(25/100) × 80 = 20.", "Resultado: 20."], mistake: "Confundir 25% com 1/5." },
      { q: "Simplifique a fração 12/18.", opts: ["2/3", "3/4", "4/6", "1/2"], ans: 0, explanation: ["MDC(12,18) = 6.", "12÷6=2 e 18÷6=3.", "Resultado: 2/3."], mistake: "Dividir só o numerador ou só o denominador." },
      { q: "Qual é o dobro de 37?", opts: ["64", "74", "84", "67"], ans: 1, explanation: ["Dobro = multiplicar por 2.", "37 × 2 = 74.", "Verifique: 30×2=60 e 7×2=14 → 74."], mistake: "Errar a adição 37+37." },
      { q: "Quanto é 15% de 200?", opts: ["20", "25", "30", "35"], ans: 2, explanation: ["10% de 200 = 20.", "5% de 200 = 10.", "15% = 20+10 = 30."], mistake: "Parar em 10% e esquecer os 5% restantes." },
      { q: "Qual o perímetro de um quadrado com lado 7cm?", opts: ["14cm", "21cm", "28cm", "49cm"], ans: 2, explanation: ["Perímetro = 4 × lado.", "4 × 7 = 28 cm.", "Não confundir com área (7²=49)."], mistake: "Calcular a área em vez do perímetro." },
      { q: "Quanto é 3/5 de 40?", opts: ["15", "20", "24", "30"], ans: 2, explanation: ["40 ÷ 5 = 8.", "8 × 3 = 24.", "Resultado: 24."], mistake: "Multiplicar 3×40 sem dividir por 5." },
      { q: "Qual o valor de 7 x 8?", opts: ["54", "56", "64", "48"], ans: 1, explanation: ["Tabuada do 7 ou do 8.", "7 x 8 = 56.", "Verifique: 7x7=49 + 7 = 56."], mistake: "Confundir com 7x9=63 ou 6x8=48." },
      { q: "Quanto é 100 - 37?", opts: ["63", "73", "53", "67"], ans: 0, explanation: ["100 - 30 = 70.", "70 - 7 = 63.", "Resultado: 63."], mistake: "Errar a subtração na dezena." },
      { q: "Qual o sucessor de 999?", opts: ["998", "1000", "1001", "1100"], ans: 1, explanation: ["Sucessor é o número + 1.", "999 + 1 = 1000.", "Resultado: 1000."], mistake: "Confundir com antecessor (998)." },
    ],
    2: [
      { q: "Se 3x + 7 = 22, qual é o valor de x?", opts: ["3", "4", "5", "6"], ans: 2, explanation: ["3x = 22 - 7 = 15.", "x = 15 ÷ 3 = 5.", "Resultado: x = 5."], mistake: "Esquecer de dividir por 3 no final." },
      { q: "Uma sala tem 12 meninos e 8 meninas. Qual a % de meninas?", opts: ["30%", "35%", "40%", "45%"], ans: 2, explanation: ["Total = 12+8 = 20.", "8/20 × 100 = 40%.", "Resultado: 40%."], mistake: "Dividir 8 por 12 em vez de 8 por 20." },
      { q: "Qual a área de um retângulo com base 8cm e altura 5cm?", opts: ["26cm²", "40cm²", "13cm²", "80cm²"], ans: 1, explanation: ["A = base × altura.", "A = 8 × 5 = 40 cm².", "Perímetro seria 2×(8+5)=26."], mistake: "Calcular o perímetro em vez da área." },
      { q: "Resolva: 2(x - 3) = 10. Quanto é x?", opts: ["4", "6", "7", "8"], ans: 3, explanation: ["2x - 6 = 10.", "2x = 16.", "x = 8."], mistake: "Dividir 10 por 2 primeiro sem expandir o parêntese." },
      { q: "Qual o valor de 2³ + 3²?", opts: ["13", "17", "19", "25"], ans: 1, explanation: ["2³ = 8.", "3² = 9.", "8 + 9 = 17."], mistake: "Calcular 2×3 + 3×2 = 12." },
      { q: "Um triângulo tem ângulos 60° e 80°. Qual o terceiro?", opts: ["30°", "40°", "50°", "60°"], ans: 1, explanation: ["Soma dos ângulos = 180°.", "180 - 60 - 80 = 40°.", "Resultado: 40°."], mistake: "Subtrair apenas um dos ângulos." },
      { q: "Qual é a média de: 4, 8, 6, 10, 12?", opts: ["7", "8", "9", "10"], ans: 1, explanation: ["Soma: 4+8+6+10+12 = 40.", "40 ÷ 5 = 8.", "Média = 8."], mistake: "Dividir pela soma em vez de pela quantidade de valores." },
      { q: "Qual a raiz quadrada de 144?", opts: ["10", "12", "14", "16"], ans: 1, explanation: ["12 x 12 = 144.", "Portanto, √144 = 12.", "Verifique: 10²=100, 12²=144."], mistake: "Confundir com 14." },
      { q: "Se um carro viaja a 80km/h, quanto percorre em 3 horas?", opts: ["200km", "240km", "280km", "300km"], ans: 1, explanation: ["Distância = Velocidade x Tempo.", "80 x 3 = 240 km.", "Resultado: 240km."], mistake: "Somar 80+3 em vez de multiplicar." },
    ],
    3: [
      { q: "Resolva: (x² - 9) / (x - 3) para x ≠ 3", opts: ["x-3", "x+3", "x²+3", "3x"], ans: 1, explanation: ["x²-9 = (x+3)(x-3).", "(x+3)(x-3)/(x-3) = x+3.", "Resultado: x+3."], mistake: "Dividir x² por x e 9 por 3 separadamente." },
      { q: "Em uma PA, o 1º termo é 3 e a razão é 5. Qual o 10º termo?", opts: ["48", "50", "53", "45"], ans: 0, explanation: ["aₙ = a₁ + (n-1)×r.", "a₁₀ = 3 + 9×5 = 48.", "Resultado: 48."], mistake: "Usar n em vez de (n-1): 3+10×5=53." },
      { q: "Qual o discriminante de x² - 5x + 6 = 0?", opts: ["1", "25", "6", "4"], ans: 0, explanation: ["Δ = b² - 4ac.", "a=1, b=-5, c=6.", "Δ = 25-24 = 1."], mistake: "Esquecer de multiplicar por 4ac." },
      { q: "Se log₂(x) = 5, quanto vale x?", opts: ["10", "25", "32", "64"], ans: 2, explanation: ["log₂(x)=5 → 2⁵=x.", "2⁵ = 32.", "Resultado: 32."], mistake: "Calcular 2×5=10." },
      { q: "Quantas diagonais tem um hexágono?", opts: ["6", "9", "12", "15"], ans: 1, explanation: ["Diagonais = n(n-3)/2.", "6×3/2 = 9.", "Resultado: 9 diagonais."], mistake: "Confundir o número de lados com o de diagonais." },
      { q: "Qual é o valor de sen(30°)?", opts: ["√3/2", "1/2", "√2/2", "1"], ans: 1, explanation: ["Triângulo 30-60-90: lados 1, √3, 2.", "sen(30°) = oposto/hipotenusa = 1/2.", "Resultado: 1/2."], mistake: "Confundir sen(30°) with cos(30°)=√3/2." },
      { q: "Qual a derivada de f(x) = x²?", opts: ["x", "2x", "2", "x/2"], ans: 1, explanation: ["Regra do tombo: d/dx(xⁿ) = nxⁿ⁻¹.", "d/dx(x²) = 2x²⁻¹ = 2x.", "Resultado: 2x."], mistake: "Pensar que a derivada de x² é x." },
      { q: "Resolva a integral de 2x dx.", opts: ["x² + C", "2x² + C", "x + C", "2 + C"], ans: 0, explanation: ["Integral de xⁿ = xⁿ⁺¹/(n+1).", "Integral de 2x = 2 * (x²/2) = x².", "Adicionamos a constante C."], mistake: "Esquecer de dividir por 2." },
    ]
  },
  "Português": {
    1: [
      { q: "Qual é o plural de 'cidadão'?", opts: ["cidadões", "cidadãos", "cidadõens", "cidadõs"], ans: 1, explanation: ["Palavras em -ão têm plural em -ãos, -ões ou -ães.", "'Cidadão' faz plural em -ãos.", "Resultado: cidadãos."], mistake: "Generalizar e usar -ões para todos os casos." },
      { q: "Em 'O menino correu rápido.', qual é o sujeito?", opts: ["correu", "rápido", "O menino", "menino correu"], ans: 2, explanation: ["Sujeito é quem pratica a ação.", "'Quem correu?' → 'O menino'.", "Sujeito = 'O menino'."], mistake: "Confundir o verbo com o sujeito." },
      { q: "Qual palavra está escrita corretamente?", opts: ["excessão", "exceção", "escepção", "exeção"], ans: 1, explanation: ["A forma correta é 'exceção'.", "Deriva do latim 'exceptione'.", "Outras formas são incorretas."], mistake: "Escrever 'excessão' por influência de 'excesso'." },
      { q: "'Ele chegou cedo.' O verbo está em qual tempo?", opts: ["Presente", "Pret. Imperfeito", "Pret. Perfeito", "Futuro"], ans: 2, explanation: ["Pretérito Perfeito = ação concluída no passado.", "'Chegou' indica ação concluída.", "Tempo: Pretérito Perfeito."], mistake: "Confundir Pretérito Perfeito com Imperfeito." },
      { q: "Qual é o antônimo de 'feliz'?", opts: ["alegre", "contente", "triste", "animado"], ans: 2, explanation: ["Antônimo = palavra de sentido oposto.", "O oposto de feliz é triste.", "Alegre e contente são sinônimos."], mistake: "Confundir sinônimo com antônimo." },
      { q: "Qual o coletivo de 'peixes'?", opts: ["Alcateia", "Cardume", "Enxame", "Manada"], ans: 1, explanation: ["Cardume é o coletivo de peixes.", "Alcateia=lobos; Enxame=abelhas; Manada=elefantes."], mistake: "Confundir com alcateia." },
      { q: "Qual a sílaba tônica de 'café'?", opts: ["ca", "fé", "Não tem", "As duas"], ans: 1, explanation: ["A sílaba tônica é a pronunciada com mais força.", "Em 'café', a última sílaba 'fé' é a tônica.", "É uma palavra oxítona."], mistake: "Achar que a primeira sílaba é a mais forte." },
    ],
    2: [
      { q: "'Embora estivesse cansado, ele terminou.' A subordinada indica:", opts: ["Causa", "Concessão", "Condição", "Tempo"], ans: 1, explanation: ["'Embora' é conjunção concessiva.", "Expressa ideia contrária à esperada.", "Resposta: Concessão."], mistake: "Confundir concessão ('embora') com causa ('porque')." },
      { q: "Em qual frase o 'por que' está correto?", opts: ["Por que você foi?", "Explique o porque.", "Não sei porque ele saiu.", "Porque sim."], ans: 0, explanation: ["'Por que' separado = pronome interrogativo.", "Usa-se em perguntas diretas.", "'Por que você foi?' está correto."], mistake: "Usar 'porque' em perguntas diretas." },
      { q: "'Meus olhos são dois oceanos' — qual figura de linguagem?", opts: ["Metonímia", "Hipérbole", "Metáfora", "Antítese"], ans: 2, explanation: ["Metáfora = comparação implícita, sem 'como'.", "'Olhos são oceanos' compara sem usar 'como'.", "Símile usaria: 'como oceanos'."], mistake: "Confundir metáfora com hipérbole." },
      { q: "'O gato que comeu o peixe sumiu.' — 'que comeu o peixe' é:", opts: ["Coord. Aditiva", "Sub. Adjetiva", "Sub. Adverbial", "Sub. Substantiva"], ans: 1, explanation: ["Orações adjetivas qualificam substantivos.", "'que comeu o peixe' qualifica 'gato'.", "É oração subordinada adjetiva."], mistake: "Confundir oração adjetiva com substantiva." },
      { q: "Qual frase está na voz passiva?", opts: ["O aluno leu o livro.", "O livro foi lido pelo aluno.", "O aluno lê muito.", "Leia o livro!"], ans: 1, explanation: ["Voz passiva: sujeito sofre a ação.", "'O livro foi lido' — livro sofre a ação.", "Estrutura: verbo ser + particípio."], mistake: "Confundir voz passiva com ativa." },
      { q: "Identifique a oração sem sujeito:", opts: ["Choveu muito ontem.", "Eles saíram cedo.", "O dia está lindo.", "Nós estudamos."], ans: 0, explanation: ["Verbos que indicam fenômenos da natureza não têm sujeito.", "'Choveu' é um verbo impessoal.", "Resultado: Choveu muito ontem."], mistake: "Achar que 'ontem' é o sujeito." },
    ],
    3: [
      { q: "Em 'Vende-se casas', o verbo deveria estar:", opts: ["No singular — correto", "No plural: 'Vendem-se'", "No infinitivo", "No imperativo"], ans: 1, explanation: ["'Casas' é o sujeito paciente.", "O verbo concorda: 'casas' → plural.", "Correto: 'Vendem-se casas'."], mistake: "Tratar o verbo como impessoal." },
      { q: "'Era uma noite de morte e vida' — qual recurso?", opts: ["Pleonasmo", "Antítese", "Catacrese", "Eufemismo"], ans: 1, explanation: ["Antítese = aproximação de ideias opostas.", "'morte' e 'vida' são opostas.", "Recurso: antítese."], mistake: "Confundir antítese com paradoxo." },
      { q: "'Quando chegar, avise.' Quantas orações?", opts: ["1", "2", "3", "4"], ans: 1, explanation: ["Oração 1: 'Quando chegar' (subordinada).", "Oração 2: 'avise' (principal).", "Total: 2 orações."], mistake: "Contar o período inteiro como uma oração." },
      { q: "O que é um hiato?", opts: ["Encontro de duas vogais em sílabas diferentes", "Encontro de duas vogais na mesma sílaba", "Encontro de três vogais", "Encontro de consoantes"], ans: 0, explanation: ["Hiato ocorre quando vogais se separam na division silábica.", "Ex: Sa-ú-de.", "Ditongo é quando ficam juntas."], mistake: "Confundir hiato com ditongo." },
    ]
  },
  "Ciências": {
    1: [
      { q: "Qual gás é essencial para a respiração humana?", opts: ["CO₂", "Nitrogênio", "Oxigênio", "Hidrogênio"], ans: 2, explanation: ["Precisamos de O₂ para a respiração celular.", "O₂ é absorvido nos pulmões.", "Sem O₂ as células param."], mistake: "Confundir O₂ (inspirado) com CO₂ (expirado)." },
      { q: "Qual é a função do coração?", opts: ["Filtrar o sangue", "Bombear o sangue", "Produzir hormônios", "Digerir alimentos"], ans: 1, explanation: ["O coração é um músculo-bomba.", "Impulsiona o sangue por todo o corpo.", "Rins filtram; pâncreas produz hormônios."], mistake: "Confundir função do coração com a dos rins." },
      { q: "O que a célula vegetal tem que a animal não tem?", opts: ["Membrana plasmática", "Mitocôndria", "Parede celular", "Ribossomo"], ans: 2, explanation: ["Células vegetais têm parede celular (celulose).", "Células animais não possuem parede celular.", "Essa é uma das principais diferenças."], mistake: "Confundir parede celular com membrana plasmática." },
      { q: "Qual é o planeta mais próximo do Sol?", opts: ["Vênus", "Terra", "Mercúrio", "Marte"], ans: 2, explanation: ["Ordem: Mercúrio, Vênus, Terra, Marte...", "Mercúrio é the mais próximo do Sol.", "Vênus é the 2º mais próximo."], mistake: "Confundir Mercúrio com Vênus." },
      { q: "A fotossíntese ocorre nos:", opts: ["Mitocôndrias", "Vacúolos", "Cloroplastos", "Ribossomos"], ans: 2, explanation: ["Fotossíntese = luz solar → energia química.", "Processo ocorre nos cloroplastos.", "Cloroplastos têm clorofila (pigmento verde)."], mistake: "Confundir cloroplastos com mitocôndrias." },
      { q: "Qual o maior osso do corpo humano?", opts: ["Úmero", "Fêmur", "Rádio", "Tíbia"], ans: 1, explanation: ["O fêmur é o osso da coxa.", "É o osso mais longo e forte do corpo.", "Resultado: Fêmur."], mistake: "Confundir com o úmero (braço)." },
    ],
    2: [
      { q: "O que é a mitose?", opts: ["Fusão de gametas", "Divisão que gera 2 células iguais", "Produção de gametas", "Morte programada"], ans: 1, explanation: ["Mitose = divisão celular equacional.", "Resulta em 2 células geneticamente idênticas.", "Meiose produz gametas (4 células)."], mistake: "Confundir mitose com meiose." },
      { q: "Qual é a fórmula química da água?", opts: ["CO₂", "H₂O", "O₂", "NaCl"], ans: 1, explanation: ["Água = 2 hidrogênios + 1 oxigênio.", "Fórmula: H₂O.", "CO₂=gás carbônico; NaCl=sal."], mistake: "Confundir H₂O com CO₂." },
      { q: "O que acontece quando um predador é removido da cadeia?", opts: ["Nada muda", "A presa diminui", "A presa aumenta descontroladamente", "O produtor desaparece"], ans: 2, explanation: ["Sem predadores, a presa não é controlada.", "A população da presa cresce em excesso.", "Isso causa desequilíbrio ambiental."], mistake: "Pensar que remoção do predador não afeta a presa." },
      { q: "Qual a principal função das hemácias?", opts: ["Defesa do corpo", "Coagulação", "Transporte de oxigênio", "Produção de anticorpos"], ans: 2, explanation: ["Hemácias contêm hemoglobina.", "Ligam-se ao oxigênio nos pulmões.", "Transportam O₂ para os tecidos."], mistake: "Confundir com leucócitos (defesa)." },
    ],
    3: [
      { q: "O que é seleção natural segundo Darwin?", opts: ["Mutação aleatória", "Sobrevivência dos mais fortes", "Indivíduos melhor adaptados sobrevivem e reproduzem mais", "Criação divina das espécies"], ans: 2, explanation: ["Darwin observou variações entre indivíduos.", "Os mais adaptados ao ambiente reproduzem mais.", "Isso leva à evolução das espécies."], mistake: "Simplificar como 'mais forte' sem considerar adaptação." },
      { q: "O que é um átomo isoeletrônico?", opts: ["Mesmo número de massa", "Mesmo elemento", "Mesmo número de elétrons", "Mesmo número de nêutrons"], ans: 2, explanation: ["Isoeletrônicas = mesma quantidade de elétrons.", "Ex: Na⁺ e Ne têm 10 elétrons cada.", "Não importa se são do mesmo elemento."], mistake: "Confundir isoeletrônico com isótopo." },
      { q: "Qual a função da enzima amilase?", opts: ["Quebrar proteínas", "Quebrar gorduras", "Quebrar amido", "Quebrar DNA"], ans: 2, explanation: ["Amilase salivar inicia a digestão na boca.", "Atua sobre o amido (carboidrato).", "Transforma amido em maltose."], mistake: "Achar que digere proteínas." },
    ]
  },
  "História": {
    1: [
      { q: "Quem foi o primeiro presidente do Brasil?", opts: ["Dom Pedro II", "Getúlio Vargas", "Deodoro da Fonseca", "JK"], ans: 2, explanation: ["Com a República em 1889, Deodoro assumiu.", "Foi o 1º presidente do Brasil.", "Dom Pedro II foi o último imperador."], mistake: "Confundir Dom Pedro II com o 1º presidente." },
      { q: "Em que ano o Brasil foi 'descoberto' pelos portugueses?", opts: ["1492", "1500", "1550", "1498"], ans: 1, explanation: ["Cabral chegou ao Brasil em 22 de abril de 1500.", "Em 1492, Colombo chegou ao Caribe.", "1498 foi a chegada de Vasco da Gama à Índia."], mistake: "Confundir 1500 com 1492." },
      { q: "Qual civilização construiu as pirâmides do Egito?", opts: ["Romanos", "Gregos", "Egípcios", "Maias"], ans: 2, explanation: ["As pirâmides foram construídas pelos egípcios.", "A maior é a Pirâmide de Quéops, em Gizé.", "Maias construíram templos-pirâmide nas Américas."], mistake: "Confundir pirâmides egípcias com as maias." },
      { q: "Quem descobriu a América em 1492?", opts: ["Vasco da Gama", "Pedro Álvares Cabral", "Cristóvão Colombo", "Américo Vespúcio"], ans: 2, explanation: ["Colombo navegou pela Espanha.", "Chegou às Bahamas em 1492.", "Pensava ter chegado às Índias."], mistake: "Confundir com Cabral (Brasil)." },
      { q: "O que foi a Lei Áurea?", opts: ["Lei que deu terras aos escravos", "Lei que libertou os escravos no Brasil", "Lei que criou o café", "Lei que expulsou os holandeses"], ans: 1, explanation: ["Assinada pela Princesa Isabel em 1888.", "Extinguiu a escravidão no Brasil.", "Resultado: Fim da escravidão legal."], mistake: "Confundir com a Lei do Ventre Livre." },
    ],
    2: [
      { q: "Qual foi a causa imediata da I Guerra Mundial?", opts: ["Invasão da Polônia", "Assassinato do Arquiduque Francisco Ferdinando", "Crise de 1929", "Revolução Russa"], ans: 1, explanation: ["O estopim foi o assassinato de Francisco Ferdinando em 1914.", "Ativou o sistema de alianças europeias.", "A tensão imperialista já existia antes."], mistake: "Confundir o estopim da I Guerra com a II Guerra." },
      { q: "O que foi o Estado Novo no Brasil?", opts: ["1º governo republicano", "Ditadura de Vargas (1937-1945)", "Governo de JK", "Período da Abertura"], ans: 1, explanation: ["Estado Novo foi instaurado por Vargas em 1937.", "Regime autoritário e centralizador.", "Durou até 1945."], mistake: "Confundir Estado Novo com toda a Era Vargas." },
      { q: "O que foi o Renascimento?", opts: ["Movimento religioso", "Movimento cultural e artístico na Europa", "Revolução industrial", "Guerra civil americana"], ans: 1, explanation: ["Surgiu na Itália entre os séculos XIV e XVI.", "Valorização do humanismo e da antiguidade clássica.", "Artistas como Leonardo da Vinci e Michelangelo."], mistake: "Confundir com a Reforma Protestante." },
    ],
    3: [
      { q: "O que foi o Congresso de Viena (1815)?", opts: ["Paz após a I Guerra", "Reorganização da Europa após Napoleão", "Criação da Liga das Nações", "Divisão da Alemanha"], ans: 1, explanation: ["Congresso de Viena (1814-1815) reorganizou a Europa.", "Restaurou monarquias derrubadas por Napoleão.", "Criou o 'equilíbrio de poder' europeu."], mistake: "Confundir com Tratado de Versalhes (pós-I Guerra)." },
      { q: "O que caracterizou o Imperialismo do século XIX?", opts: ["Cooperação pacífica", "Dominação europeia sobre Ásia e África", "Democracia representativa global", "Industrialização das colônias"], ans: 1, explanation: ["Imperialismo = expansão europeia sobre outros continentes.", "Motivado por matérias-primas e mercados.", "África e Ásia foram os principais alvos."], mistake: "Confundir imperialismo com colonialismo." },
      { q: "Quem foi o líder da Revolução Russa de 1917?", opts: ["Stalin", "Lenin", "Trotsky", "Nicolau II"], ans: 1, explanation: ["Lenin liderou os bolcheviques.", "Derrubou o governo provisório.", "Instaurou o regime socialista."], mistake: "Confundir com Stalin, que assumiu depois." },
      { q: "O que foi a Guerra Fria?", opts: ["Conflito armado EUA × URSS", "Tensão ideológica sem confronto direto", "Série de guerras na Europa Central", "Guerra econômica do Japão"], ans: 1, explanation: ["Guerra Fria (1947-1991): EUA × URSS.", "Não houve guerra direta entre as superpotências.", "Manifestou-se em corrida armamentista e conflitos por procuração."], mistake: "Pensar que houve guerra direta entre EUA e URSS." },
      { q: "O que foi o Holocausto?", opts: ["Bomba atômica em Hiroshima", "Genocídio de judeus e outros grupos pelo nazismo", "Massacre de civis em Stalingrado", "Campos de trabalho soviéticos"], ans: 1, explanation: ["O Holocausto foi o extermínio sistemático de ~6 milhões de judeus.", "Também vitimou ciganos, homossexuais, deficientes, etc.", "Perpetrado pelo regime nazista de Hitler."], mistake: "Confundir o Holocausto com outros crimes de guerra da WWII." },
    ]
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
