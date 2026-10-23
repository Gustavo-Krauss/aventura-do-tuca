# 🏝️ Aventura do Tuca

Jogo educativo para a **Educação Infantil — Pré-escola II (5 e 6 anos)**, feito para rodar no navegador (Chromebook, Chrome, Firefox e Edge) e ser publicado no GitHub Pages.

A criança escolhe um amigo, navega por um mapa com 4 ilhas e, ao completar todas, abre o baú do tesouro e recebe um certificado. Cada pergunta respondida fica registrada para o professor acompanhar o desenvolvimento das habilidades.

## Conteúdos (somente estes 4)

| Ilha | Assunto |
|---|---|
| 🦒 Ilha dos Tamanhos | Grandezas e Comparações |
| 123 Ilha dos Números | Contagem e Quantidades |
| 🎨 Ilha das Cores | Cores |
| ABC Ilha das Letras | Letras e Palavras |

## Níveis

| Nível | Perguntas | Como é |
|---|---|---|
| 🌱 Fácil | 20 (5 por ilha) | conceitos básicos, poucas opções |
| 🌿 Médio | 20 (5 por ilha) | mais opções, números até 15, 4 pares para ligar, memória com 12 cartas |
| 🌳 Difícil | 20 (5 por ilha) | desafios novos: balança, sequência de cores, contagem seletiva, juntar quantidades, letra que falta, palavras parecidas |

Os três níveis ficam liberados e são escolhidos no topo do mapa. Cada nível tem as próprias estrelas, o próprio tesouro (madeira, prata e ouro) e o próprio certificado.

Em todas as ilhas, as 5 perguntas seguem a mesma ordem de interação:

1. 👆 Múltipla escolha
2. 👆 Múltipla escolha
3. ✋ Arrastar e soltar (ou tocar no item e depois no lugar, mais fácil no touchpad)
4. ✏️ Ligar pares
5. 🃏 Jogo da memória

As figuras, cores e números de cada pergunta são sorteados na hora, então o jogo muda a cada partida, mas **cada pergunta mede sempre a mesma habilidade**.

## Registro pedagógico (arquivo .txt)

Cada pergunta respondida gera **1 linha** no registro, com **ID em auto incremento**. Os registros ficam guardados no navegador do computador e o professor baixa tudo num **único arquivo `.txt`** pelo **Painel do educador** (botão ⓘ na tela inicial → *Baixar registros (.txt)*).

O arquivo usa ponto e vírgula como separador, então abre direto no Excel ou no Google Planilhas. As colunas são:

| Coluna | Exemplo |
|---|---|
| ID | 1 |
| DATA | 22/10/2026 |
| HORA | 14:03:12 |
| CRIANCA | Ana Clara (ou "Sem nome") |
| NIVEL | Fácil |
| ILHA | Ilha dos Tamanhos |
| AREA | Espaços, tempos, quantidades, relações e transformações (campo de experiência da BNCC) |
| ASSUNTO | Grandezas e Comparações |
| HABILIDADE | Comparar tamanhos: maior e menor |
| BNCC | EI03ET01 |
| CODIGO_PERGUNTA | TAM-F1 |
| TENTATIVAS | 2 |
| ACERTOS | 1 |
| ERROS | 1 |
| RESULTADO | Acertou de primeira / Acertou após N erros / Não concluída |
| TEMPO_SEGUNDOS | 8 |

Como as tentativas são contadas:

- **Múltipla escolha:** cada toque é uma tentativa.
- **Arrastar:** cada peça colocada é uma tentativa, e no "coloque N na cesta" cada vez que aperta *Pronto* também conta.
- **Ligar pares:** cada linha puxada é uma tentativa.
- **Memória:** cada par de cartas virado é uma tentativa. Errar faz parte do jogo da memória, por isso a contagem de estrelas tolera alguns erros.

Se a criança sai da ilha no meio de uma pergunta que já tentou, ela aparece como **"Não concluída"**.

Observações:

- Os registros ficam no navegador de cada Chromebook. Baixe o arquivo antes de limpar os dados de navegação.
- **Outra criança** (tela inicial) zera só as estrelas, e os registros continuam guardados.
- **Apagar registros** (Painel do educador) apaga a lista, mas o ID continua crescendo e nunca repete.

## As 60 perguntas

Áreas (campos de experiência da BNCC): **ET** = Espaços, tempos, quantidades, relações e transformações · **EF** = Escuta, fala, pensamento e imaginação · **TS** = Traços, sons, cores e formas.

| Código | Nível | Assunto | Habilidade | BNCC |
|---|---|---|---|---|
| TAM-F1 | Fácil | Grandezas e Comparações | Comparar tamanhos: maior e menor | EI03ET01 |
| TAM-F2 | Fácil | Grandezas e Comparações | Comparar alturas: mais alto e mais baixo | EI03ET01 |
| TAM-F3 | Fácil | Grandezas e Comparações | Ordenar 3 objetos do menor para o maior | EI03ET01 |
| TAM-F4 | Fácil | Grandezas e Comparações | Relacionar objetos de mesmo tamanho | EI03ET05 |
| TAM-F5 | Fácil | Grandezas e Comparações | Diferenciar tamanhos iguais e diferentes (memória) | EI03ET05 |
| NUM-F1 | Fácil | Contagem e Quantidades | Contar objetos até 10 | EI03ET07 |
| NUM-F2 | Fácil | Contagem e Quantidades | Comparar quantidades: mais e menos | EI03ET01 |
| NUM-F3 | Fácil | Contagem e Quantidades | Separar uma quantidade pedida (até 6) | EI03ET07 |
| NUM-F4 | Fácil | Contagem e Quantidades | Relacionar número e quantidade (até 8) | EI03ET07 |
| NUM-F5 | Fácil | Contagem e Quantidades | Reconhecer quantidades representadas por bolinhas (memória) | EI03ET07 |
| COR-F1 | Fácil | Cores | Identificar cores básicas | EI03TS02 |
| COR-F2 | Fácil | Cores | Associar cores a objetos do dia a dia | EI03TS02 |
| COR-F3 | Fácil | Cores | Classificar objetos por cor (3 cores) | EI03ET05 |
| COR-F4 | Fácil | Cores | Relacionar objetos à sua cor | EI03ET05 |
| COR-F5 | Fácil | Cores | Associar giz de cera e figura da mesma cor (memória) | EI03ET05 |
| LET-F1 | Fácil | Letras e Palavras | Reconhecer letras iguais (discriminação visual) | EI03EF09 |
| LET-F2 | Fácil | Letras e Palavras | Identificar a letra inicial de palavras | EI03EF09 |
| LET-F3 | Fácil | Letras e Palavras | Montar palavras simples a partir de um modelo | EI03EF09 |
| LET-F4 | Fácil | Letras e Palavras | Relacionar figura e letra inicial | EI03EF09 |
| LET-F5 | Fácil | Letras e Palavras | Relacionar vogais maiúsculas e minúsculas (memória) | EI03EF09 |
| TAM-M1 | Médio | Grandezas e Comparações | Comparar comprimentos: comprido e curto | EI03ET01 |
| TAM-M2 | Médio | Grandezas e Comparações | Comparar pesos: pesado e leve | EI03ET01 |
| TAM-M3 | Médio | Grandezas e Comparações | Ordenar 4 objetos por tamanho (crescente e decrescente) | EI03ET01 |
| TAM-M4 | Médio | Grandezas e Comparações | Relacionar 4 tamanhos diferentes | EI03ET05 |
| TAM-M5 | Médio | Grandezas e Comparações | Diferenciar pequeno, médio e grande (memória) | EI03ET05 |
| NUM-M1 | Médio | Contagem e Quantidades | Identificar o número que falta: antes, depois e entre | EI03ET07 |
| NUM-M2 | Médio | Contagem e Quantidades | Contar objetos até 15 | EI03ET07 |
| NUM-M3 | Médio | Contagem e Quantidades | Separar uma quantidade pedida (até 10) | EI03ET07 |
| NUM-M4 | Médio | Contagem e Quantidades | Relacionar número e quantidade (até 10) | EI03ET07 |
| NUM-M5 | Médio | Contagem e Quantidades | Reconhecer quantidades de 1 a 9 por bolinhas (memória) | EI03ET07 |
| COR-M1 | Médio | Cores | Prever a cor formada pela mistura de duas tintas | EI03ET02 |
| COR-M2 | Médio | Cores | Identificar cores, incluindo rosa e marrom | EI03TS02 |
| COR-M3 | Médio | Cores | Classificar objetos por cor (4 cores) | EI03ET05 |
| COR-M4 | Médio | Cores | Relacionar objetos à sua cor (4 cores) | EI03ET05 |
| COR-M5 | Médio | Cores | Associar giz de cera e figura da mesma cor (6 pares) | EI03ET05 |
| LET-M1 | Médio | Letras e Palavras | Reconhecer palavras que começam com uma letra | EI03EF09 |
| LET-M2 | Médio | Letras e Palavras | Diferenciar letras minúsculas parecidas (b, d, p, q...) | EI03EF09 |
| LET-M3 | Médio | Letras e Palavras | Agrupar figuras pela letra inicial | EI03EF09 |
| LET-M4 | Médio | Letras e Palavras | Relacionar letras maiúsculas e minúsculas | EI03EF09 |
| LET-M5 | Médio | Letras e Palavras | Associar figura e letra inicial (memória) | EI03EF09 |
| TAM-D1 | Difícil | Grandezas e Comparações | Comparar recipientes: mais cheio e mais vazio | EI03ET01 |
| TAM-D2 | Difícil | Grandezas e Comparações | Comparar pesos usando a balança | EI03ET01 |
| TAM-D3 | Difícil | Grandezas e Comparações | Ordenar torres pela altura | EI03ET01 |
| TAM-D4 | Difícil | Grandezas e Comparações | Relacionar objetos de mesmo comprimento | EI03ET05 |
| TAM-D5 | Difícil | Grandezas e Comparações | Identificar torres de mesma altura (memória) | EI03ET05 |
| NUM-D1 | Difícil | Contagem e Quantidades | Juntar duas quantidades (adição com figuras) | EI03ET07 |
| NUM-D2 | Difícil | Contagem e Quantidades | Contar só um tipo de figura (contagem seletiva) | EI03ET07 |
| NUM-D3 | Difícil | Contagem e Quantidades | Ordenar números do menor para o maior | EI03ET07 |
| NUM-D4 | Difícil | Contagem e Quantidades | Relacionar grupos com a mesma quantidade | EI03ET01 |
| NUM-D5 | Difícil | Contagem e Quantidades | Relacionar número e quantidade de figuras (memória) | EI03ET07 |
| COR-D1 | Difícil | Cores | Identificar forma e cor ao mesmo tempo | EI03ET05 |
| COR-D2 | Difícil | Cores | Identificar o que não pertence ao grupo de cor | EI03ET05 |
| COR-D3 | Difícil | Cores | Continuar uma sequência (padrão) de cores | EI03ET05 |
| COR-D4 | Difícil | Cores | Relacionar misturas de tintas às cores formadas | EI03ET02 |
| COR-D5 | Difícil | Cores | Diferenciar tons claros e escuros (memória) | EI03TS02 |
| LET-D1 | Difícil | Letras e Palavras | Completar a letra que falta em uma palavra | EI03EF09 |
| LET-D2 | Difícil | Letras e Palavras | Diferenciar palavras escritas parecidas | EI03EF03 |
| LET-D3 | Difícil | Letras e Palavras | Montar palavras maiores a partir de um modelo | EI03EF09 |
| LET-D4 | Difícil | Letras e Palavras | Relacionar figura e palavra escrita | EI03EF03 |
| LET-D5 | Difícil | Letras e Palavras | Relacionar maiúsculas e minúsculas (memória, 6 pares) | EI03EF09 |

## Estrutura: início, meio e fim

1. **Início:** tela de abertura, depois a escolha do amigo (avatar) e o nome da criança (opcional, usado nos registros).
2. **Meio:** o mapa com as 4 ilhas e a escolha do nível. Cada ilha tem 5 perguntas e termina com 1 a 3 estrelas.
3. **Fim:** com as 4 ilhas do nível completas, o baú abre e aparece a tela de parabéns com o certificado para imprimir.

## Requisitos atendidos

- **Navegação simples e intuitiva:** botões grandes, ícones, uma mãozinha animada que mostra o gesto na 1ª vez e o mascote que reage aos acertos e erros.
- **Visual adequado a 5–6 anos:** cores fortes, fonte arredondada, figuras grandes e pouco texto, com a palavra-chave destacada.
- **Experiência acolhedora e motivadora:** errar não tira a criança da fase, e há confete, estrelas e certificado.
- **Acompanhamento pedagógico:** cada pergunta está ligada a área, assunto, habilidade e objetivo da BNCC, com registro de acertos, erros e tentativas em `.txt`.
- **Chromebook, Chrome, Firefox e Edge:** HTML, CSS e JavaScript puro, sem instalação e sem servidor. Funciona com mouse, touchpad, toque e teclado, e tem botão de tela cheia.

## Como testar no computador

Dê dois cliques no arquivo `index.html`.

## Como publicar no GitHub Pages (pelo site, sem programas)

1. Entre em <https://github.com> e faça login.
2. Clique em **New**, use o nome `aventura-do-tuca`, marque **Public** e clique em **Create repository**.
3. Clique em **uploading an existing file**.
4. Arraste **tudo o que está dentro** da pasta `aventura-do-tuca` (`index.html`, `css`, `js`, `assets`, `README.md`). O `index.html` precisa ficar na raiz do repositório.
5. Clique em **Commit changes**.
6. Vá em **Settings → Pages → Build and deployment → Source: Deploy from a branch**, escolha `main` e `/ (root)` e clique em **Save**.
7. Em 1 ou 2 minutos o link aparece: `https://SEU-USUARIO.github.io/aventura-do-tuca/`

### Alternativa pelo terminal (Git)

```bash
cd aventura-do-tuca
git init
git add .
git commit -m "Aventura do Tuca"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/aventura-do-tuca.git
git push -u origin main
```

## Estrutura de pastas

```
aventura-do-tuca/
├── index.html          página do jogo
├── css/style.css       visual (cores, tamanhos, animações)
├── js/art.js           desenhos em SVG (mascote Tuca, ilhas, balança, cestos...)
├── js/engine.js        mecânicas: escolha, arrastar, ligar, memória + efeitos
├── js/content.js       as 60 perguntas, com área, assunto, habilidade e BNCC
├── js/registro.js      registro das tentativas e geração do arquivo .txt
├── js/app.js           telas e fluxo (início, mapa, níveis, ilhas, final, painel do educador)
└── assets/fonts/       fonte Baloo 2 (licença OFL)
```

## Tecnologias e créditos

- HTML5, CSS3 e JavaScript puro (sem frameworks e sem banco de dados).
- Fonte **Baloo 2**, sob a SIL Open Font License (arquivo em `assets/fonts/OFL-LICENSE.txt`).
- Mascote, ilhas, balança e formas desenhados em SVG no próprio código. As figuras de bichos e objetos usam os emojis do sistema.
- Objetivos de aprendizagem: BNCC — Educação Infantil, crianças pequenas (4 anos a 5 anos e 11 meses).
