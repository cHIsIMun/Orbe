# Orbe - Widgets Educacionais

Orbe é uma plataforma de widgets educacionais interativos que podem ser facilmente incorporados em sites educacionais, plataformas de LMS ou blogs através de iframes.

## Widgets Disponíveis

### Flashcards

Widget interativo para estudo com cartões de perguntas e respostas. Os usuários podem revisar o conteúdo, virar os cartões para ver as respostas e receber um relatório sobre os tópicos que precisam de mais estudo.

**Características:**
- Cartões interativos com efeito de giro 3D
- Sistema de rastreamento de progresso
- Relatório detalhado de desempenho por tópico
- Suporte para configurações personalizáveis (título, tema, etc.)

## Como Usar

### Instalação e Execução Local

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/widgets.git
cd widgets
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse em [http://localhost:5173](http://localhost:5173)

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist`.
```

## Incorporação em Sites

### Widget de Flashcards

**RECOMENDADO para incorporação cross-domain:**

```html
<iframe 
  src="https://seu-dominio.com/widgets/flashcards?data_b64=BASE64_DOS_FLASHCARDS" 
  width="100%" 
  height="600px" 
  frameborder="0"
></iframe>
```

#### Como gerar o Base64 correto:

```javascript
function gerarBase64Flashcards(flashcards) {
  const json = JSON.stringify(flashcards);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Exemplo de uso:
const flashcards = [
  {
    "Q": "Qual é a capital do Brasil?",
    "A": "Brasília", 
    "T": "Geografia"
  },
  {
    "Q": "Quem escreveu Dom Casmurro?",
    "A": "Machado de Assis",
    "T": "Literatura"
  }
];

const base64 = gerarBase64Flashcards(flashcards);
const iframeSrc = `https://seu-dominio.com/widgets/flashcards?data_b64=${base64}`;
```

#### Parâmetros suportados:

- **`data_b64`**: (Recomendado) Base64 dos flashcards - funciona em todos os contextos
- **`data`**: (Alternativa) Base64 dos flashcards - pode quebrar em alguns contextos cross-domain  
- **`debug=1`**: (Opcional) Ativa logs detalhados no console para diagnóstico

#### Alternativa: Comunicação postMessage

Para conjuntos de dados grandes ou controle total:

```html
<iframe 
  id="flashcards-iframe" 
  src="https://seu-dominio.com/widgets/flashcards" 
  width="100%" 
  height="600px" 
  frameborder="0"
></iframe>

<script>
  const flashcards = [
    {
      "Q": "Qual é a capital do Brasil?",
      "A": "Brasília",
      "T": "Geografia"
    },
    {
      "Q": "Quem escreveu Dom Casmurro?",
      "A": "Machado de Assis", 
      "T": "Literatura"
    }
  ];

  const iframe = document.getElementById('flashcards-iframe');
  
  // Aguardar mensagem do iframe indicando que está pronto
  window.addEventListener('message', function(event) {
    // Em produção, verifique a origem: if (event.origin !== "https://seu-dominio.com") return;
    
    if (event.data && event.data.type === 'ready' && event.data.widget === 'flashcards') {
      // Enviar dados para o iframe
      iframe.contentWindow.postMessage({
        type: 'flashcards',
        cards: flashcards,
        config: {
          title: "Meus Flashcards",
          theme: "light", // "light", "dark" ou "auto"
          shuffleCards: true // embaralhar os cartões
        }
      }, '*');  // Em produção, use o domínio específico em vez de '*'
    }
  });
</script>
```

Para informações mais detalhadas sobre como usar os widgets, acesse o arquivo `public/how-to-use.html` ou visite a página de detalhes no site após a implantação.

Para incorporar o widget de flashcards em seu site, use o seguinte código HTML:

```html
<iframe 
  src="https://seu-dominio.com/widgets/flashcards?data=URL_ENCODADA_DO_JSON" 
  width="100%" 
  height="600" 
  style="border: none; border-radius: 8px;"
></iframe>
```

#### Parâmetros Aceitos

- `data`: (Obrigatório) Pode ser:
  - URL para um arquivo JSON (`https://seu-site.com/dados.json`)
  - Caminho relativo para um JSON hospedado no mesmo servidor (`/dados/flashcards.json`)
  - JSON codificado em Base64

- `config`: (Opcional) Configurações adicionais em formato JSON codificado em Base64:
  ```json
  {
    "title": "Título Personalizado",
    "theme": "light", // light, dark, ou auto
    "shuffleCards": true // embaralhar cartões
  }
  ```

#### Formato do JSON de Dados

```json
[
  {
    "Q": "Pergunta aqui",
    "A": "Resposta aqui",
    "T": "Tópico ou categoria"
  },
  {
    "Q": "Outra pergunta",
    "A": "Outra resposta",
    "T": "Outro tópico"
  }
  // Mais cartões...
]
```

## Exemplo de Incorporação

Um exemplo prático de incorporação está disponível em `/public/embed-example.html`.

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- React Router
- Framer Motion (animações)
- TailwindCSS
- shadcn/ui

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
