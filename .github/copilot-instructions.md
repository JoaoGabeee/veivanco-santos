# Copilot Instructions for Veivanco & Santos Contabilidade

## Visão Geral
Este repositório contém o site institucional da Veivanco & Santos Contabilidade, com páginas estáticas em HTML, CSS e JavaScript. O objetivo é apresentar serviços, facilitar contato e exibir notícias do setor contábil.

## Estrutura Principal
- `index.html`: Página inicial com apresentação, serviços, depoimentos, resultados e formulário de contato.
- `faq.html`: Perguntas frequentes e formulário para dúvidas.
- `script.js`: Scripts para animações, contadores, formulários e menu responsivo.
- `style.css`: Estilos globais e componentes customizados.
- `icones/` e `imagens/`: Recursos visuais usados nas páginas.
- `portalVS/`: Portal de notícias com:
  - `noticias.html`: Página de notícias dinâmicas.
  - `rss.js`: Carrega e exibe notícias de feeds RSS externos, com fallback para imagens locais.
  - `styleNoticias.css`: Estilos específicos do portal de notícias.

## Padrões e Convenções
- **HTML sem frameworks JS**: O site é estático, sem frameworks como React ou Vue.
- **Bootstrap 5**: Usado via CDN para responsividade e componentes visuais.
- **Formulários**: Enviados via Formspree (`action` nos forms), com feedback visual via modais customizados.
- **Imagens**: Sempre usar imagens do diretório `imagens/` ou `icones/` para fallback.
- **Notícias**: O portal consome múltiplos feeds RSS via API pública (`rss2json`), exibe a notícia principal em destaque e faz paginação local.
- **Busca de notícias**: Implementada no portal, com separação entre resultados e "outras notícias".
- **Scripts**: Não usar bibliotecas externas JS além do Bootstrap. Preferir código vanilla.

## Fluxos de Desenvolvimento
- **Visualização local**: Use Live Server (porta 5501) ou abra `index.html` diretamente no navegador.
- **Deploy**: O site pode ser publicado no GitHub Pages (estrutura já compatível).
- **Adição de notícias**: Para feeds, edite o array `feeds` em `portalVS/rss.js`.
- **Novos ícones/imagens**: Adicione em `icones/` ou `imagens/` e referencie nos HTML/JS.

## Exemplos de Padrão
- Para adicionar um novo serviço:
  - Edite a seção `#servicos` em `index.html`.
  - Use SVG de `icones/` para o ícone.
- Para adicionar um novo feed RSS:
  - Inclua a URL no array `feeds` em `portalVS/rss.js`.

## Observações
- Não há testes automatizados ou build scripts.
- Não há dependências Node.js ou Python.
- O código deve ser limpo, comentado e seguir o padrão já existente.

Consulte sempre `README.md` e os arquivos HTML para exemplos de estrutura e estilo.
