<p align="center">
  <img src="src/assets/brand/hooksmith-logo.png" alt="Hooksmith Logo" width="380">
</p>

<p align="center">
  <strong>Forja Local de APIs e Webhooks — 100% Offline, Seguro e Focado em Privacidade</strong>
</p>

<p align="center">
  <a href="README.pt-BR.md">🇧🇷 Versão em Português</a> •
  <a href="README.md">🇺🇸 English Version</a> •
  <a href="CONTRIBUTING.pt-BR.md">🛠️ Documentação Técnica & Arquitetura</a> •
  <a href="https://claudsan.github.io/hooksmith/">🌐 Site Oficial</a>
</p>

---

## ☕ A Origem: Feito de Dev para Dev

Se você já desenvolveu integrações com gateways de pagamento, ERPs, APIs financeiras ou webhooks de mensageria, certamente conhece o sofrimento:

- **O Dilema do WireMock:** Ter que escrever dezenas de linhas de configuração em Java ou arquivos JSON quilométricos de mapeamento, subir containers Docker pesados apenas para responder um simples `200 OK`, ou perder horas caçando o motivo de uma expressão regular não bater na rota do mock.
- **A Cegueira dos Webhooks:** Ficar olhando para a janela preta do terminal torcendo para o webhook ter chegado no seu backend, sem nenhuma visibilidade visual de quais headers foram enviados, se o payload veio truncado ou se houve timeout na chamada.
- **O Pesadelo dos Fluxos Assíncronos:** Como testar na sua máquina um gateway que responde a criação do pedido na hora com `200 OK` e, 3 segundos depois, envia um POST de callback notificando que o Pix ou cartão foi aprovado? Quase todo desenvolvedor acaba criando scripts improvisados, controllers temporários no código ou disparando requisições manuais no Postman para tentar simular o ciclo.
- **A Dependência de Túneis na Nuvem:** Ficar refém de ferramentas com URLs públicas rotativas que mudam a cada reinicialização, impõem limites de requisições por minuto, adicionam latência de rede e expõem dados sensíveis do seu tráfego para servidores de terceiros.

**O Hooksmith nasceu exatamente dessa dor.**

Queríamos uma ferramenta visual, rápida e nativa no desktop, onde você pudesse abrir uma porta HTTP ou HTTPS em dois cliques, inspecionar cada byte em tempo real, editar e reenviar payloads sem atrito, e simular fluxos assíncronos completos de ponta a ponta. Sem nuvem, sem burocracia, sem containers pesados. Uma forja robusta e elegante, criada por quem vive a realidade do desenvolvimento de software e entende o valor de um ciclo de testes sem frustração.

---

## 📌 O que é o Hooksmith?

O **Hooksmith** é uma ferramenta desktop ultra-rápida projetada para desenvolvedores interceptarem, inspecionarem, testarem, simularem (mock) e reenviarem (replay) requisições HTTP e chamadas de webhooks HTTPS inteiramente no seu computador local.

Ao contrário de serviços baseados na nuvem, o Hooksmith funciona **100% offline**: sem contas, sem assinaturas, sem intermediários na nuvem e com zero telemetria. Todo o histórico de tráfego, as regras de simulação e os certificados SSL permanecem guardados exclusivamente no seu disco local.

---

## 🚀 Principais Funcionalidades

- **Múltiplos Listeners (HTTP e HTTPS/SSL):** Crie portas locais personalizadas com emissão automática de certificados SSL auto-assinados.
- **Inspeção de Tráfego em Tempo Real:** Fluxo de alta resolução mostrando método, rota, status HTTP, duração em ms e data/hora exata da chamada.
- **Divisor Redimensionável no Painel:** Ajuste a altura vertical entre a Requisição e a Resposta com duplo clique para restaurar 50%/50%.
- **Prettify Inteligente de JSON:** Alterne com um clique entre visualização identada (`Pretty`) e compacta (`Raw`), com cópia formatada para a área de transferência.
- **Simulador de Mocks Poderoso:** Responda automaticamente a rotas com status codes personalizados, cabeçalhos customizados e simulação de latência de rede (delay).
- **Callbacks Assíncronos Automatizados:** Configure o disparo de webhooks automáticos após o mock (ideal para simular gateways de pagamento e eventos de mensageria).
- **Edição & Replay com 1 Clique:** Modifique cabeçalhos ou corpos de requisições capturadas e reenvie-as instantaneamente.
- **Interface Multilíngue:** Tradução completa e nativa para Português (pt-BR), Inglês (en-US) e Espanhol (es-ES).

---

## 📖 Manual Prático de Uso

### 1. Criando e Gerenciando Listeners (HTTP & HTTPS)

Listeners são as portas que o Hooksmith abre no seu computador para escutar o tráfego gerado pelas suas aplicações, microserviços ou webhooks externos.

1. Na barra lateral esquerda, em **Listeners**, clique em **`+`** (ou no botão **`+ Listener`** no topo da janela).
2. Preencha as configurações:
   - **Nome do Listener:** Um nome amigável para identificar o serviço (ex: `Gateway de Pagamento`, `API de Notificações`, `Backend Local`).
   - **Porta:** Número da porta (ex: `4010`, `8443`, `8080`).
   - **HTTPS / SSL:** Ative o toggle para usar HTTPS seguro. O Hooksmith gera e configura um certificado SSL local automaticamente, sem necessidade de comandos no terminal.
3. Clique em **Iniciar Listener**. O serviço fica ativo na hora (com indicador verde pulsante).
4. É possível pausar e reativar qualquer listener a qualquer momento usando a chave (toggle) no card.

---

### 2. Acompanhando o Tráfego em Tempo Real (Live Traffic)

Assim que qualquer requisição atinge uma das portas ativas, ela surge imediatamente na coluna central de tráfego:

- **Indicadores Rápidos:** Exibe o método HTTP (`POST`, `GET`, `PUT`, `DELETE`), o caminho da URL, o status code (`200 OK`, `500 Internal Server Error`, etc.), o tempo de resposta em milissegundos e a porta receptora.
- **Tags de Origem da Chamada:**
  - `CAPTURED`: Requisição real vinda da rede interceptada pelo listener.
  - `MOCKED`: Requisição interceptada e respondida por uma regra de mock do Hooksmith.
  - `REPLAY`: Requisição gerada pela ferramenta de Replay do Hooksmith.
  - `CALLBACK`: Webhook automático disparado por uma regra de mock.
- **Busca e Filtros:**
  - Use o campo de busca (<kbd>Ctrl</kbd> + <kbd>K</kbd>) para filtrar por rota, conteúdo do corpo ou código de status.
  - Filtre por tipo clicando nas abas: **Todos**, **POST**, **GET** ou **Erros** (4xx/5xx).
  - Use o botão **Limpar** para esvaziar a lista quando desejar.

---

### 3. Inspecionando Requisições e Respostas

Ao clicar em qualquer item da lista de tráfego, o painel direito exibe todos os detalhes da chamada:

- **Data e Hora da Chamada:** Exibe a data e hora exata (`DD/MM/AAAA HH:MM:SS`) em que o webhook foi recebido pelo sistema.
- **Editor de Código Monaco Integrado:** Suporte completo a syntax highlighting para JSON, XML, HTML e texto plano.
- **Divisor Vertical Redimensionável:**
  - Passe o mouse sobre a barra horizontal que divide a Requisição (metade superior) e a Resposta (metade inferior).
  - Clique e arraste para cima ou para baixo para dar mais espaço ao payload que você precisa analisar com mais atenção.
  - Dê **duplo clique** sobre a barra para restaurar a divisão perfeita de 50% / 50%.
  - O tamanho configurado é lembrado automaticamente nas próximas vezes que você abrir o app.
- **Botão Prettify (JSON Formatado):**
  - Na barra da aba `Body`, clique no botão **`Pretty`** para alternar entre a exibição identada e a exibição compacta em uma só linha (`Raw`).
  - O botão de copiar respeita o modo ativo: copiando o JSON identado e pronto para compartilhar.
- **Abas de Navegação:**
  - **Body:** Corpo da requisição/resposta formatado.
  - **Headers:** Tabela de cabeçalhos HTTP parseados.
  - **Query:** Parâmetros da query string da URL.
  - **Raw:** Payload original exatamente como transmitido.

---

### 4. Criando e Inspecionando Regras de Mock

As regras de mock permitem simular endpoints externos, APIs de parceiros ou cenários de erro (como timeouts ou falhas 500) sem precisar alterar código no backend:

1. Na seção **Regras de Mock** da barra lateral, clique no botão **`+`** (ou pressione <kbd>Ctrl</kbd> + <kbd>M</kbd>).
2. Configure a regra:
   - **Nome da Regra:** Ex: `Simular Gateway Indisponível (500)`.
   - **Escopo:** Escolha se a regra se aplica a todas as portas ou apenas a uma porta específica (indicando se possui suporte a **`SSL`**).
   - **Método & Rota:** Ex: `POST` `/webhooks/pagamentos` (suporta rotas exatas ou curingas como `/api/*`).
   - **Código de Status:** Códigos convencionais (`200`, `201`, `400`, `422`, `500`) ou personalizado.
   - **Atraso / Latência (ms):** Simule a lentidão da internet ou de servidores lentos (ex: `800ms`) para testar o comportamento de telas de carregamento e timeouts no seu código.
   - **Corpo e Cabeçalhos:** O JSON ou resposta que o mock deve devolver para quem chamou.
3. **Modo Inspeção vs Edição:**
   - **Clique no card da regra:** Abre a inspeção detalhada do mock no painel direito em modo leitura, exibindo rota, status, cabeçalhos, corpo e comando cURL pronto para teste.
   - **Para editar a regra:** Passe o mouse no card e clique no **ícone de lápis** ou clique no botão de destaque **"Editar Regra"** no cabeçalho do inspetor.

---

### 5. Callbacks Assíncronos por Regra de Mock

Muitas APIs modernas (como MercadoPago, Stripe, Pagar.me, Asaas, WhatsApp Cloud API ou GitHub) funcionam de forma assíncrona:
1. Sua aplicação faz a chamada inicial criando um recurso (ex: gerar cobrança Pix).
2. O serviço responde na hora com `200 OK` e o ID gerado.
3. Segundos depois, o servidor deles faz um **webhook callback** para a URL da sua aplicação informando que o pagamento foi aprovado (`payment.approved`).

O Hooksmith simula esse ciclo completo automaticamente:

1. No modal de criação/edição do mock, ative a opção **Callback Assíncrono**.
2. Defina:
   - **Método do Callback:** `POST`, `PUT`, `PATCH` ou `GET`.
   - **URL de Destino:** O endpoint do seu backend local (ex: `http://localhost:3000/api/webhooks/pix`).
   - **Atraso do Callback:** Tempo em milissegundos para aguardar após responder o mock antes de disparar o webhook (ex: `1500ms`).
   - **Payload do Callback:** O JSON com os dados que o seu backend espera receber no evento.
3. Ao receber uma chamada correspondente, o Hooksmith responde o mock imediatamente, aguarda o tempo configurado e dispara a requisição de callback para o seu backend.

---

### 6. Edição e Replay Instantâneo

Quer testar como o seu backend se comporta com dados ligeiramente diferentes sem precisar gerar um novo evento no sistema de origem?

1. Selecione uma requisição já capturada no histórico de tráfego.
2. Na barra superior do inspetor, clique no botão **`Edit & Replay`**.
3. O painel entrará em **Modo de Edição**:
   - Altere o JSON do corpo diretamente no editor.
   - Modifique ou adicione novos cabeçalhos.
   - Clique no botão laranja **`Replay`** (ou aperte <kbd>Ctrl</kbd> + <kbd>Enter</kbd>).
4. A nova requisição é disparada imediatamente e você confere a resposta do seu backend no topo da lista com a tag `REPLAY`.

---

## 🔮 O que vem por aí (Roadmap & Backlog Futuro)

O Hooksmith está evoluindo para unificar webhooks HTTP, mensageria assíncrona e automação agendada em uma única forja 100% local:

- 📡 **Integração com Apache Kafka:** Conecte-se a brokers Kafka locais para inspecionar mensagens em tópicos em tempo real, publicar eventos JSON com 1 clique e criar pontes automáticas (`Webhook HTTP ➔ Tópico Kafka`).
- 🐇 **Integração com RabbitMQ:** Monitore exchanges e filas AMQP visualmente, inspecione Dead Letter Queues (DLQ), simule consumidores locais e dispare mensagens em filas quando uma regra de mock for acionada.
- ⏰ **Agendamento de Chamadas & Cron Jobs:** Programe disparos periódicos de webhooks, baterias de testes automatizadas e políticas realistas de retentativa (*exponential backoff*) sem depender de scripts externos.

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Executar Replay da requisição selecionada |
| <kbd>Ctrl</kbd> + <kbd>M</kbd> | Abrir modal para Nova Regra de Mock |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>E</kbd> | Focar no campo de busca de tráfego |
| <kbd>Ctrl</kbd> + <kbd>L</kbd> | Limpar lista de tráfego capturado |
| <kbd>Esc</kbd> | Fechar modal aberto ou desmarcar inspeção |
| <kbd>Ctrl</kbd> + <kbd>+</kbd> / <kbd>Ctrl</kbd> + <kbd>-</kbd> | Aumentar / Diminuir zoom da interface |
| <kbd>Ctrl</kbd> + <kbd>0</kbd> | Restaurar zoom padrão |

---

## 🔒 Armazenamento Local e Privacidade

O Hooksmith salva seus dados em um banco de dados SQLite local na pasta de dados do seu sistema operacional:
- **Windows:** `%APPDATA%/Hooksmith/hooksmith.db`
- **macOS:** `~/Library/Application Support/Hooksmith/hooksmith.db`
- **Linux:** `~/.config/Hooksmith/hooksmith.db`

Nenhum dado trafega para servidores externos.

---

## 🤝 100% Open Source — Contribua com o Projeto!

O **Hooksmith é 100% Open Source (Licença MIT)**, feito de dev para dev. Qualquer pessoa pode contribuir e ajudar a evoluir a ferramenta!

> 🛠️ **Acesse nossa [Documentação Técnica & Guia de Arquitetura (`CONTRIBUTING.pt-BR.md`)](CONTRIBUTING.pt-BR.md)** para conhecer toda a nossa stack (Electron, React 19, Fastify, SQLite WAL, Monaco, Undici), diagramas de arquitetura, estrutura de pastas e instruções de desenvolvimento local.

- 🍴 **Envie um Pull Request:** Quer ajudar a construir as integrações com **Apache Kafka**, **RabbitMQ**, **Agendamento de Chamadas** ou melhorar a interface? Faça um fork do projeto e envie seu PR!
- 💡 **Sugira Funcionalidades ou Reporte Bugs:** Abra uma issue em [GitHub Issues](https://github.com/claudsan/hooksmith/issues) com suas ideias e feedbacks.
- ⭐ **Apoie o Projeto:** Se o Hooksmith facilitou o seu dia a dia testando webhooks, deixe uma estrela (Star) no repositório do GitHub!

---

## 📄 Licença

O Hooksmith é disponibilizado sob a licença [MIT](LICENSE).
