<h2 align="center">Portfólio · ffzanini.dev</h2>

<p align="center">
  Portfólio pessoal com projetos, currículo, contato e tema claro/escuro.
</p>

<p align="center">
  <a href="#-sobre-o-projeto">📋 Sobre</a>&nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#-funcionalidades">✨ Funcionalidades</a>&nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#-tecnologias">🛠 Tecnologias</a>&nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#-como-executar">🚀 Como executar</a>&nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#deploy-e-otimizações">📦 Deploy</a>&nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#-contato">👋 Contato</a>&nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#-licença">📄 Licença</a>
</p>

---

## 📋 Sobre o projeto

Este repositório contém o **portfólio pessoal** ([ffzanini.dev](https://www.ffzanini.dev)), pensado como uma vitrine das minhas habilidades, experiências e projetos realizados ao longo da carreira. O foco é **usabilidade** e **acessibilidade**: navegação simples, suporte a múltiplos idiomas (PT, EN), tema claro/escuro e **download do currículo em PDF** (estático ou gerado sob demanda).

O design foi inspirado nos princípios de **mobile first**, garantindo uma navegação intuitiva em qualquer dispositivo. O projeto também serve como laboratório de testes, onde implemento novas bibliotecas e tecnologias antes de utilizá-las em projetos reais.

---

## ✨ Funcionalidades

- **Idiomas:** Português e Inglês (i18n)
- **Tema:** Alternância entre modo claro e escuro
- **PDF do currículo:** Download estático (PT/EN) ou geração sob demanda via API (Puppeteer)
- **Projetos:** Seções para projetos profissionais e de estudo, com detalhes por projeto
- **Contato:** Formulário integrado ao Notion
- **SEO e segurança:** Sitemap, metadados, robots.txt, middleware contra bots e headers de segurança
- **Layout responsivo:** Pensado para leitura e navegação em qualquer dispositivo

---

## 🛠 Tecnologias

### Principais

| Tecnologia | Uso |
|------------|-----|
| [Next.js](https://nextjs.org/) | Framework React, App Router, API Routes |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização e design system |
| [React](https://react.dev/) | Interface e componentes |
| [Vercel](https://vercel.com/) | Hospedagem e deploy |

### Complementares

| Tecnologia | Uso |
|------------|-----|
| [Framer Motion](https://motion.dev/) | Animações e transições |
| [React Hook Form](https://react-hook-form.com/) | Formulário de contato |
| [React Icons](https://react-icons.github.io/react-icons/) | Ícones |
| [Axios](https://axios-http.com/) | Requisições HTTP |
| [next-themes](https://github.com/pacocoursey/next-themes) | Tema claro/escuro |
| [Puppeteer](https://pptr.dev/) | Geração de PDF em serverless (opcional) |
| [react-hot-toast](https://react-hot-toast.com/) | Notificações (toast) |
| [Notion API](https://developers.notion.com/) | Backend do formulário de contato |

---

## 🚀 Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado: LTS)
- npm ou yarn

### Passos

**1. Clonar o repositório**

```bash
git clone https://github.com/ffzanini/website-personal.git
cd website-personal
```

**2. Instalar dependências**

```bash
npm install
```

**3. Rodar em desenvolvimento**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

**4. Build para produção**

```bash
npm run build
npm start
```

**5. Gerar PDFs do currículo (opcional)**

Para servir os PDFs de forma estática e economizar Edge/Serverless na Vercel:

```bash
npm run build && npm run generate-pdfs
```

Depois faça commit de `public/resume-pt.pdf` e `public/resume-en.pdf`.

---

## 📦 Deploy e otimizações

### Consumo de Edge / Serverless (Vercel)

| Origem | Quando consome | Otimização |
|--------|----------------|------------|
| **POST /api/contact** | Cada envio do formulário de contato | Necessário; URL `/api/contact`. |
| **POST /api/generate-pdf** | Cada clique em "Gerar PDF" | Prefira os links "Baixar PDF (PT/EN)" estáticos; gere com `npm run generate-pdfs`. |
| Páginas (/, /about, etc.) | — | Servidas estáticas do CDN (zero Serverless). |
| **/projects/[slug]** | — | Pré-renderizado com `generateStaticParams` (SSG). |

### Proteção contra ataques e bots

1. **No código (já aplicado)**  
   - **Middleware** (`src/middleware.ts`): bloqueia na borda User-Agent vazio ou de scanners conhecidos (sqlmap, nikto, masscan, etc.). Resposta 403 com cache de 1h.  
   - **robots.txt** (`src/app/robots.ts`): desautoriza crawlers em `/api/` e bots de IA (GPTBot, CCBot, etc.).  
   - **Headers de segurança** em `next.config.js`: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

2. **Na Vercel (recomendado)**  
   - Dashboard do projeto → **Firewall** → **Bot Management**.  
   - Ative **Attack Challenge Mode** em caso de ataque ou tráfego suspeito; requisições bloqueadas não contam no uso.  
   - [Documentação: Attack Challenge Mode](https://vercel.com/docs/vercel-firewall/attack-challenge-mode)

---

## 👋 Contato

Dúvidas sobre o projeto, consultoria ou interesse em produtos digitais e desenvolvimento de jogos?

- **Site:** [ffzanini.dev](https://www.ffzanini.dev)
- **Contato:** [ffzanini.dev/contact](https://www.ffzanini.dev/contact)
- **LinkedIn:** [linkedin.com/in/ffzanini](https://www.linkedin.com/in/ffzanini/)

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

Feito com 💙 por Felipe Frantz Zanini
