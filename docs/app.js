const I18N = {
  pt: {
    nav_story: 'A Origem',
    nav_features: 'Funcionalidades',
    nav_manual: 'Manual de Uso',
    nav_roadmap: 'Novidades',
    nav_shortcuts: 'Atalhos',
    badge_local: '100% Local & Offline',
    badge_privacy: 'Zero Nuvem • Zero Telemetria',
    badge_dev: 'Feito de Dev para Dev',
    badge_oss: '💚 100% Open Source (MIT)',
    hero_title: 'A Forja Local de <span class="accent">APIs & Webhooks</span> sem dor de cabeça.',
    hero_subtitle:
      'Intercepte, inspecione, simule mocks com SSL/HTTPS automático, dispare callbacks assíncronos e faça replay de requisições em tempo real — direto no seu desktop.',
    cta_manual: '📖 Ler Manual de Uso',
    cta_github: '⭐ Ver no GitHub',
    car_eyebrow: '📸 INTERFACE REAL DA APLICAÇÃO',
    car_t1: 'Dashboard & Live Traffic',
    car_d1: '<strong>1. Visão Geral & Live Traffic:</strong> Listeners HTTP e HTTPS (com SSL automático), regras de mock com badges SSL/Callback e gerador de comando cURL de teste.',
    car_t2: 'Inspeção Request & Response',
    car_d2: '<strong>2. Request & Response Inspector:</strong> Data e hora exatas da chamada, JSON formatado com botão Pretty no Monaco Editor e divisor horizontal redimensionável.',
    car_t3: 'Inspeção de Mock & Callback',
    car_d3: '<strong>3. Mock Inspector (Modo Leitura):</strong> Clique na regra para inspecionar rota, porta SSL, payload do Callback Assíncrono configurado e resposta simulada.',
    car_t4: 'Editor de Mock & Callback',
    car_d4: '<strong>4. Editor de Regra de Mock:</strong> Configure status HTTP, latência simulada (delay), cabeçalhos e dispare callbacks assíncronos automáticos.',
    sim_hint: '💡 Simulador Interativo: Clique nas requisições ou nas regras de mock abaixo para inspecionar e testar o botão Pretty/Raw!',
    story_eyebrow: '☕ DE DEV PARA DEV',
    story_title: 'Nascido da frustração real com o WireMock e túneis na nuvem',
    story_desc:
      'Quem já desenvolveu integrações com gateways de pagamento, ERPs ou sistemas de mensageria conhece bem o sofrimento de testar webhooks localmente.',
    pain_title: '❌ O Sofrimento Antigo (WireMock & Túneis)',
    pain_1: '<strong>O Dilema do WireMock:</strong> Dezenas de linhas em Java ou JSONs quilométricos de mapeamento e containers Docker pesados apenas para responder um simples <code>200 OK</code>.',
    pain_2: '<strong>A Cegueira do Terminal:</strong> Ficar olhando logs no console sem saber se o webhook chegou, se faltou header ou se o payload veio truncado.',
    pain_3: '<strong>O Pesadelo Assíncrono:</strong> Criar scripts improvisados ou controllers fakes para simular um gateway que responde <code>200 OK</code> e manda um POST de confirmação 3 segundos depois.',
    pain_4: '<strong>Dependência de Túneis:</strong> URLs rotativas que mudam a cada reinício, limites de requisição e dados sensíveis trafegando em servidores de terceiros.',
    forge_title: '🔥 O Jeito Hooksmith',
    forge_1: '<strong>Portas HTTP & HTTPS em 2 Cliques:</strong> Crie listeners locais com certificado SSL auto-assinado emitido automaticamente.',
    forge_2: '<strong>Visibilidade Total em Tempo Real:</strong> Veja método, rota, status, tempo em ms, data/hora exata da chamada e payload com syntax highlighting.',
    forge_3: '<strong>Callbacks Assíncronos Nativos:</strong> Configure na própria regra de mock a URL, método, delay e payload que o Hooksmith deve disparar após responder.',
    forge_4: '<strong>Inspeção & Replay Instantâneo:</strong> Clique num mock para inspecionar seus detalhes, redimensione o painel Request/Response e formate JSON com 1 clique.',
    feat_eyebrow: '🚀 RECURSOS PRINCIPAIS',
    feat_title: 'Tudo o que você precisa para dominar integrações',
    feat_subtitle: 'Projetado para substituir múltiplos scripts, containers de mock e ferramentas dispersas por uma única interface coesa.',
    f1_title: 'Listeners HTTP & HTTPS (Auto SSL)',
    f1_desc: 'Abra quantas portas locais quiser. Ative HTTPS e o Hooksmith gera e gerencia os certificados SSL locais automaticamente.',
    f2_title: 'Painel Redimensionável & Data/Hora',
    f2_desc: 'Divisor arrastável entre Request e Response (duplo clique para 50%/50%), registro de data/hora exata da chamada e editor Monaco.',
    f3_title: 'Prettify JSON Inteligente',
    f3_desc: 'JSONs minificados são exibidos formatados por padrão. Alterne entre Pretty e Raw em 1 clique e copie já indentado.',
    f4_title: 'Inspeção de Mocks + Tag SSL',
    f4_desc: 'Clique em qualquer regra na Sidebar para inspecioná-la no painel direito sem abrir o editor por engano. Veja a porta e a badge SSL.',
    f5_title: 'Callbacks Assíncronos por Regra',
    f5_desc: 'Simule o ciclo completo de gateways (Pix, Stripe, MercadoPago): o mock responde na hora e dispara um webhook de callback após o delay configurado.',
    f6_title: 'Edit & Replay Instantâneo',
    f6_desc: 'Modifique o body ou os headers de qualquer requisição capturada e reenvie-a com Ctrl+Enter para testar seu backend.',
    man_eyebrow: '📖 GUIA PASSO A PASSO',
    man_title: 'Manual Prático de Uso',
    man_subtitle: 'Domine todo o fluxo de trabalho do Hooksmith em poucos minutos.',
    m1_title: 'Criando e Gerenciando Listeners (HTTP & HTTPS)',
    m1_desc: 'Na barra lateral esquerda, clique em "+" em Listeners. Defina um nome amigável (ex: Gateway Pagamento), escolha a porta (ex: 4010 ou 8443) e marque a opção HTTPS/SSL se desejar criptografia local automática.',
    m2_title: 'Monitorando o Live Traffic e Filtros',
    m2_desc: 'Toda chamada recebida aparece instantaneamente na coluna central com método, rota, status HTTP, latência e tag de origem (CAPTURED, MOCKED, REPLAY ou CALLBACK). Use a busca (Ctrl+K) ou os filtros rápidos.',
    m3_title: 'Inspecionando Payloads, Redimensionando e Formatando JSON',
    m3_desc: 'Ao clicar em uma requisição, o painel direito mostra a data e hora exatas da chamada. Arraste a barra divisória horizontal entre Request e Response para ampliar payloads extensos e use o botão "Pretty" para formatar JSON.',
    m4_title: 'Inspecionando e Editando Regras de Mock',
    m4_desc: 'Clique em um card em "Mock Rules" para visualizar todos os seus detalhes e comando cURL no Painel de Inspeção. Ao lado da porta, a tag SSL indica listeners seguros. Para editar, clique no ícone de lápis ou em "Editar Regra".',
    m5_title: 'Configurando Callbacks Assíncronos Automatizados',
    m5_desc: 'Dentro do editor de Mock, ative "Callback Assíncrono". Informe o método (POST/PUT), a URL do seu backend local, o delay em milissegundos e o JSON do evento. O Hooksmith disparará o callback automaticamente após responder o mock.',
    m6_title: 'Edit & Replay de Requisições',
    m6_desc: 'Selecione qualquer requisição capturada, clique em "Edit & Replay", ajuste o JSON ou cabeçalhos no editor Monaco e pressione Ctrl+Enter para disparar a nova chamada.',
    rd_eyebrow: '🔮 O QUE VEM POR AÍ • ROADMAP & BACKLOG',
    rd_title: 'Muito além do HTTP: Mensageria & Automação Local',
    rd_subtitle: 'O Hooksmith está evoluindo para unificar webhooks, filas de mensageria e disparos agendados em uma única forja 100% local.',
    rd_soon: 'Em Breve',
    rd1_title: 'Integração com Apache Kafka',
    rd1_desc: 'Conecte-se a brokers Kafka locais ou de desenvolvimento para inspecionar mensagens em tópicos, publicar eventos JSON com 1 clique e criar pontes automáticas (Webhook HTTP ➔ Tópico Kafka).',
    rd2_title: 'Integração com RabbitMQ',
    rd2_desc: 'Monitore exchanges e filas AMQP em tempo real, simule consumidores locais, inspecione Dead Letter Queues (DLQ) e dispare mensagens diretamente em filas quando uma regra de mock for acionada.',
    rd3_title: 'Agendamento de Chamadas & Cron',
    rd3_desc: 'Programe disparos periódicos de webhooks (Cron Jobs), baterias de testes automatizadas e simulações realistas de retentativas (exponential backoff) sem precisar de scripts externos.',
    oss_badge: '💚 100% OPEN SOURCE • LICENÇA MIT',
    oss_title: 'Construído pela comunidade, para a comunidade — Contribua!',
    oss_desc: 'O Hooksmith é 100% código aberto. Qualquer desenvolvedor pode contribuir com código, implementar novas integrações do backlog (como Kafka e RabbitMQ), sugerir melhorias ou reportar bugs no GitHub.',
    oss_btn_fork: '🍴 Contribuir no GitHub',
    oss_btn_issues: '💡 Sugerir Feature / Issue',
    sc_eyebrow: '⌨️ PRODUTIVIDADE',
    sc_title: 'Atalhos de Teclado & Armazenamento Local',
    sc_replay: 'Disparar Replay da requisição selecionada',
    sc_mock: 'Abrir modal de Nova Regra de Mock',
    sc_search: 'Focar na busca global de tráfego',
    sc_clear: 'Limpar histórico de tráfego capturado',
    sc_esc: 'Fechar modal ou desmarcar inspeção',
    sc_zoom: 'Ajustar zoom da interface',
  },
  en: {
    nav_story: 'The Origin',
    nav_features: 'Capabilities',
    nav_manual: 'User Manual',
    nav_roadmap: "What's Next",
    nav_shortcuts: 'Shortcuts',
    badge_local: '100% Local & Offline',
    badge_privacy: 'Zero Cloud • Zero Telemetry',
    badge_dev: 'Built by Devs, for Devs',
    badge_oss: '💚 100% Open Source (MIT)',
    hero_title: 'The Local <span class="accent">API & Webhook Forge</span> without the headache.',
    hero_subtitle:
      'Intercept, inspect, mock with zero-config SSL/HTTPS, trigger automated asynchronous callbacks, and replay requests in real time — right on your desktop.',
    cta_manual: '📖 Read User Manual',
    cta_github: '⭐ View on GitHub',
    car_eyebrow: '📸 REAL APPLICATION SCREENSHOTS',
    car_t1: 'Dashboard & Live Traffic',
    car_d1: '<strong>1. Overview & Live Traffic:</strong> HTTP & HTTPS listeners (with automated SSL), mock rules with SSL/Callback badges, and quick test cURL generator.',
    car_t2: 'Request & Response Inspector',
    car_d2: '<strong>2. Request & Response Inspector:</strong> Exact call date/time badge, Pretty-formatted JSON in Monaco Editor, and resizable horizontal split.',
    car_t3: 'Mock & Callback Inspector',
    car_d3: '<strong>3. Mock Inspector (Read-Only):</strong> Click a rule to inspect route, SSL port, configured Asynchronous Callback payload, and simulated response.',
    car_t4: 'Mock & Callback Editor',
    car_d4: '<strong>4. Mock Rule Editor:</strong> Configure HTTP status code, simulated network delay, headers, and automated asynchronous webhook callbacks.',
    sim_hint: '💡 Interactive Simulator: Click on the captured requests or mock rules below to inspect them and test the Pretty/Raw toggle!',
    story_eyebrow: '☕ BUILT BY DEVS, FOR DEVS',
    story_title: 'Born from the real frustration of WireMock and cloud tunnels',
    story_desc:
      'If you have ever built an integration with a payment gateway, ERP, or messaging webhook provider, you know the pain of testing webhooks locally.',
    pain_title: '❌ The Old Struggle (WireMock & Tunnels)',
    pain_1: '<strong>The WireMock Dilemma:</strong> Verbose Java setups, endless nested JSON mapping files, and heavy Docker containers just to return a simple <code>200 OK</code>.',
    pain_2: '<strong>Terminal Blindness:</strong> Staring at console logs hoping a webhook arrived, with zero visual visibility into stripped headers or truncated payloads.',
    pain_3: '<strong>The Async Nightmare:</strong> Writing throwaway scripts or fake controllers to test a gateway that responds <code>200 OK</code> and fires a webhook callback 3 seconds later.',
    pain_4: '<strong>Cloud Tunnel Tax:</strong> Rotating public URLs on every restart, rate limits, latency spikes, and sensitive payload data passing through third-party servers.',
    forge_title: '🔥 The Hooksmith Way',
    forge_1: '<strong>HTTP & HTTPS Ports in 2 Clicks:</strong> Spawn local listeners with automated self-signed SSL certificates out of the box.',
    forge_2: '<strong>Real-Time Visual Inspection:</strong> See method, path, status, duration in ms, exact call timestamp, and syntax-highlighted payloads.',
    forge_3: '<strong>Native Asynchronous Callbacks:</strong> Configure the target URL, method, delay, and JSON body directly inside each mock rule.',
    forge_4: '<strong>Instant Inspection & Replay:</strong> Click a mock rule to inspect it in read-only mode, resize the Request/Response split, and prettify JSON in 1 click.',
    feat_eyebrow: '🚀 CORE CAPABILITIES',
    feat_title: 'Everything you need to master webhook integrations',
    feat_subtitle: 'Designed to replace ad-hoc scripts, heavy mock containers, and scattered tools with one cohesive desktop forge.',
    f1_title: 'HTTP & HTTPS Listeners (Auto SSL)',
    f1_desc: 'Open as many local ports as you need. Toggle HTTPS and Hooksmith automatically generates and manages local SSL certificates.',
    f2_title: 'Resizable Split & Call Timestamp',
    f2_desc: 'Draggable horizontal divider between Request and Response (double-click for 50%/50%), exact call date/time badge, and Monaco editor.',
    f3_title: 'Smart JSON Prettify',
    f3_desc: 'Minified JSON payloads are formatted by default. Toggle between Pretty and Raw in a single click and copy formatted output.',
    f4_title: 'Mock Inspector + SSL Indicator',
    f4_desc: 'Click any rule in the Sidebar to inspect its full details in the right panel without opening the edit modal by accident. Includes port SSL badges.',
    f5_title: 'Async Callbacks per Mock Rule',
    f5_desc: 'Simulate full gateway lifecycles (Stripe, PayPal, Pix): respond immediately and fire an automated webhook callback after a custom delay.',
    f6_title: '1-Click Edit & Replay',
    f6_desc: 'Modify the body or headers of any captured request and re-fire it with Ctrl+Enter to test your backend handlers.',
    man_eyebrow: '📖 STEP-BY-STEP GUIDE',
    man_title: 'Practical User Manual',
    man_subtitle: 'Master the entire Hooksmith workflow in minutes.',
    m1_title: 'Creating & Managing Listeners (HTTP & HTTPS)',
    m1_desc: 'In the left sidebar, click "+" under Listeners. Give it a friendly name (e.g., Payment Gateway), pick a port (e.g., 4010 or 8443), and toggle HTTPS/SSL for automatic local encryption.',
    m2_title: 'Monitoring Live Traffic & Filters',
    m2_desc: 'Every incoming call appears instantly in the central stream with method, path, HTTP status, latency, and origin tag (CAPTURED, MOCKED, REPLAY, or CALLBACK). Use global search (Ctrl+K) or quick filter tabs.',
    m3_title: 'Inspecting Payloads, Resizing & JSON Prettify',
    m3_desc: 'Clicking a request displays the exact date and time of the call. Drag the horizontal divider between Request and Response to expand large payloads, and click "Pretty" to toggle JSON indentation.',
    m4_title: 'Inspecting vs Editing Mock Rules',
    m4_desc: 'Click a card under "Mock Rules" to view its read-only details and ready-to-use cURL command in the Inspection Panel. Next to the port badge, the SSL tag highlights secure listeners. Click the Pencil icon or "Edit Rule" to modify.',
    m5_title: 'Configuring Automated Asynchronous Callbacks',
    m5_desc: 'Inside the Mock Editor, enable "Asynchronous Callback". Set the method (POST/PUT), your local backend URL, the delay in ms, and the JSON payload. Hooksmith will fire the callback automatically after answering the mock.',
    m6_title: 'Editing & Replaying Requests',
    m6_desc: 'Select any captured request, click "Edit & Replay", tweak the JSON body or headers in the Monaco editor, and press Ctrl+Enter to fire.',
    rd_eyebrow: "🔮 WHAT'S COMING NEXT • FUTURE ROADMAP",
    rd_title: 'Beyond HTTP: Event Brokers & Scheduled Automation',
    rd_subtitle: 'Hooksmith is evolving to unify webhooks, message brokers, and scheduled triggers into a single 100% local desktop forge.',
    rd_soon: 'Coming Soon',
    rd1_title: 'Apache Kafka Integration',
    rd1_desc: 'Connect to local or dev Kafka clusters to inspect topic streams in real time, publish JSON events in one click, and bridge incoming HTTP webhooks directly into Kafka topics.',
    rd2_title: 'RabbitMQ & AMQP Integration',
    rd2_desc: 'Monitor AMQP exchanges and queues visually, inspect Dead Letter Queues (DLQ), simulate queue consumers, and publish messages to RabbitMQ whenever a mock rule is triggered.',
    rd3_title: 'Scheduled Calls & Cron Jobs',
    rd3_desc: 'Schedule recurring webhook calls, automated test suites, and realistic retry policies (exponential backoff) natively without writing external cron scripts.',
    oss_badge: '💚 100% OPEN SOURCE • MIT LICENSE',
    oss_title: 'Built by the community, for the community — Join Us!',
    oss_desc: 'Hooksmith is 100% open source. Anyone can contribute code, help build upcoming backlog integrations (like Kafka & RabbitMQ), suggest improvements, or open Pull Requests on GitHub.',
    oss_btn_fork: '🍴 Contribute on GitHub',
    oss_btn_issues: '💡 Suggest Feature / Issue',
    sc_eyebrow: '⌨️ PRODUCTIVITY',
    sc_title: 'Keyboard Shortcuts & Local Storage',
    sc_replay: 'Fire Replay of the selected request',
    sc_mock: 'Open New Mock Rule modal',
    sc_search: 'Focus global traffic search bar',
    sc_clear: 'Clear captured traffic stream',
    sc_esc: 'Close modal or deselect inspection',
    sc_zoom: 'Zoom in / Zoom out application UI',
  },
  es: {
    nav_story: 'El Origen',
    nav_features: 'Funcionalidades',
    nav_manual: 'Manual de Uso',
    nav_roadmap: 'Novedades',
    nav_shortcuts: 'Atajos',
    badge_local: '100% Local y Offline',
    badge_privacy: 'Cero Nube • Cero Telemetría',
    badge_dev: 'Hecho de Dev para Dev',
    badge_oss: '💚 100% Open Source (MIT)',
    hero_title: 'La Forja Local de <span class="accent">APIs y Webhooks</span> sin dolores de cabeza.',
    hero_subtitle:
      'Intercepta, inspecciona, simula mocks con SSL/HTTPS automático, dispara callbacks asíncronos y repite peticiones en tiempo real — directo en tu escritorio.',
    cta_manual: '📖 Leer Manual de Uso',
    cta_github: '⭐ Ver en GitHub',
    car_eyebrow: '📸 INTERFAZ REAL DE LA APLICACIÓN',
    car_t1: 'Dashboard y Live Traffic',
    car_d1: '<strong>1. Vista General y Live Traffic:</strong> Listeners HTTP y HTTPS (con SSL automático), reglas de mock con etiquetas SSL/Callback y generador de comando cURL.',
    car_t2: 'Inspección Request y Response',
    car_d2: '<strong>2. Request & Response Inspector:</strong> Fecha y hora exactas de la llamada, JSON formateado con botón Pretty en Monaco Editor y divisor horizontal redimensionable.',
    car_t3: 'Inspector de Mock y Callback',
    car_d3: '<strong>3. Mock Inspector (Modo Lectura):</strong> Haz clic en una regla para inspeccionar ruta, puerto SSL, payload del Callback Asíncrono y respuesta simulada.',
    car_t4: 'Editor de Mock y Callback',
    car_d4: '<strong>4. Editor de Regla de Mock:</strong> Configura código de estado HTTP, latencia simulada (delay), cabeceras y callbacks asíncronos automáticos.',
    sim_hint: '💡 Simulador Interactivo: ¡Haz clic en las peticiones o reglas de mock abajo para inspeccionarlas y probar el botón Pretty/Raw!',
    story_eyebrow: '☕ DE DEV PARA DEV',
    story_title: 'Nacido de la frustración real con WireMock y túneles en la nube',
    story_desc:
      'Quien haya desarrollado integraciones con pasarelas de pago, ERPs o webhooks de mensajería conoce el sufrimiento de probar webhooks localmente.',
    pain_title: '❌ El Sufrimiento Antiguo (WireMock y Túneles)',
    pain_1: '<strong>El Dilema de WireMock:</strong> Decenas de líneas en Java, archivos JSON interminables y contenedores Docker pesados solo para devolver un <code>200 OK</code>.',
    pain_2: '<strong>Ceguera en la Terminal:</strong> Mirar logs esperando que llegue el webhook sin visibilidad de cabeceras o cuerpos truncados.',
    pain_3: '<strong>La Pesadilla Asíncrona:</strong> Crear scripts temporales para simular una pasarela que responde <code>200 OK</code> y envía un POST de confirmación 3 segundos después.',
    pain_4: '<strong>Dependencia de Túneles:</strong> URLs rotativas en cada reinicio, límites de tráfico y datos sensibles pasando por servidores externos.',
    forge_title: '🔥 El Estilo Hooksmith',
    forge_1: '<strong>Puertos HTTP y HTTPS en 2 Clics:</strong> Crea listeners locales con certificado SSL autofirmado emitido automáticamente.',
    forge_2: '<strong>Visibilidad Total en Tiempo Real:</strong> Mira método, ruta, estado, duración en ms, fecha/hora exacta y payload formateado.',
    forge_3: '<strong>Callbacks Asíncronos Nativos:</strong> Configura en cada regla de mock la URL, método, retraso y payload que Hooksmith disparará automáticamente.',
    forge_4: '<strong>Inspección y Replay Instantáneo:</strong> Haz clic en un mock para inspeccionarlo, redimensiona el panel Request/Response y formatea JSON en 1 clic.',
    feat_eyebrow: '🚀 CAPACIDADES PRINCIPALES',
    feat_title: 'Todo lo que necesitas para dominar integraciones',
    feat_subtitle: 'Diseñado para reemplazar scripts improvisados y contenedores pesados por una única forja de escritorio.',
    f1_title: 'Listeners HTTP y HTTPS (Auto SSL)',
    f1_desc: 'Abre tantos puertos locales como necesites. Activa HTTPS y Hooksmith genera y gestiona los certificados SSL automáticamente.',
    f2_title: 'Panel Redimensionable y Fecha/Hora',
    f2_desc: 'Divisor arrastrable entre Request y Response (doble clic para 50%/50%), fecha/hora exacta de la llamada y editor Monaco.',
    f3_title: 'Prettify JSON Inteligente',
    f3_desc: 'Los JSON minificados se muestran indentados por defecto. Alterna entre Pretty y Raw en 1 clic y copia el resultado formateado.',
    f4_title: 'Inspector de Mocks + Etiqueta SSL',
    f4_desc: 'Haz clic en cualquier regla en la barra lateral para inspeccionarla sin abrir el modal de edición por error. Incluye indicador SSL.',
    f5_title: 'Callbacks Asíncronos por Regla',
    f5_desc: 'Simula flujos completos de pago: el mock responde al instante y dispara un webhook de callback tras el retraso configurado.',
    f6_title: 'Edit & Replay en 1 Clic',
    f6_desc: 'Modifica el cuerpo o cabeceras de cualquier petición capturada y reenvíala con Ctrl+Enter.',
    man_eyebrow: '📖 GUÍA PASO A PASO',
    man_title: 'Manual Práctico de Uso',
    man_subtitle: 'Domina todo el flujo de trabajo de Hooksmith en minutos.',
    m1_title: 'Creación y Gestión de Listeners (HTTP y HTTPS)',
    m1_desc: 'En la barra lateral izquierda, haz clic en "+" en Listeners. Define un nombre, elige el puerto (ej: 4010 o 8443) y activa HTTPS/SSL para cifrado local automático.',
    m2_title: 'Monitoreo de Live Traffic y Filtros',
    m2_desc: 'Cada llamada recibida aparece al instante en la columna central con método, ruta, estado HTTP, latencia y etiqueta de origen (CAPTURED, MOCKED, REPLAY o CALLBACK).',
    m3_title: 'Inspección de Payloads, Redimensionamiento y Prettify JSON',
    m3_desc: 'Al seleccionar una petición verás la fecha y hora exactas. Arrastra la barra horizontal entre Request y Response y usa el botón "Pretty" para indentar JSON.',
    m4_title: 'Inspección vs Edición de Reglas de Mock',
    m4_desc: 'Haz clic en una regla para ver sus detalles en modo lectura y su comando cURL. Junto al puerto, la etiqueta SSL indica listeners seguros. Usa el ícono de lápiz para editar.',
    m5_title: 'Configuración de Callbacks Asíncronos',
    m5_desc: 'En el editor de Mock, activa "Callback Asíncrono". Indica método, URL de destino, retraso en ms y JSON. Hooksmith disparará el callback automáticamente.',
    m6_title: 'Edición y Replay de Peticiones',
    m6_desc: 'Selecciona una petición capturada, haz clic en "Edit & Replay", ajusta el JSON o cabeceras y presiona Ctrl+Enter.',
    rd_eyebrow: '🔮 PRÓXIMAS NOVEDADES • ROADMAP Y BACKLOG',
    rd_title: 'Más allá de HTTP: Mensajería y Automatización Local',
    rd_subtitle: 'Hooksmith evoluciona para unificar webhooks, colas de mensajería y llamadas programadas en una única forja 100% local.',
    rd_soon: 'Próximamente',
    rd1_title: 'Integración con Apache Kafka',
    rd1_desc: 'Conéctate a brokers Kafka locales para inspeccionar mensajes en tópicos, publicar eventos JSON en 1 clic y crear puentes automáticos (Webhook HTTP ➔ Tópico Kafka).',
    rd2_title: 'Integración con RabbitMQ',
    rd2_desc: 'Monitorea exchanges y colas AMQP en tiempo real, inspecciona Dead Letter Queues (DLQ) y publica mensajes directamente en colas cuando se active una regla de mock.',
    rd3_title: 'Programación de Llamadas y Cron',
    rd3_desc: 'Programa disparos periódicos de webhooks (Cron Jobs), baterías de pruebas automatizadas y simulaciones de reintentos (exponential backoff) sin scripts externos.',
    oss_badge: '💚 100% OPEN SOURCE • LICENCIA MIT',
    oss_title: 'Construido por la comunidad, para la comunidad — ¡Contribuye!',
    oss_desc: 'Hooksmith es 100% código abierto. Cualquier persona puede contribuir con código, ayudar a construir las integraciones del backlog (Kafka y RabbitMQ), sugerir mejoras o enviar Pull Requests en GitHub.',
    oss_btn_fork: '🍴 Contribuir en GitHub',
    oss_btn_issues: '💡 Sugerir Mejora / Issue',
    sc_eyebrow: '⌨️ PRODUCTIVIDAD',
    sc_title: 'Atajos de Teclado y Almacenamiento Local',
    sc_replay: 'Ejecutar Replay de la petición seleccionada',
    sc_mock: 'Abrir modal de Nueva Regla de Mock',
    sc_search: 'Enfocar barra de búsqueda global',
    sc_clear: 'Limpiar historial de tráfico capturado',
    sc_esc: 'Cerrar modal o deseleccionar inspección',
    sc_zoom: 'Ajustar zoom de la interfaz',
  },
};

const SIM_DATA = {
  req1: {
    type: 'request',
    method: 'POST',
    path: '/webhooks/payment',
    port: ':8443',
    ssl: true,
    source: 'MOCKED',
    status: '200 OK',
    statusColor: '#10B981',
    duration: '12 ms',
    size: '148 B',
    datetime: '25/11/2026 11:04:18',
    reqRaw: '{"event":"checkout.completed","order_id":"ord_982341","amount":249.90,"currency":"BRL","customer":{"email":"dev@hooksmith.local"}}',
    resRaw: '{"status":"received","mock_rule":"Approve Pix Checkout","callback_scheduled":true,"callback_delay_ms":1500}',
  },
  req2: {
    type: 'request',
    method: 'POST',
    path: '/api/orders/callback',
    port: ':4010',
    ssl: false,
    source: 'CALLBACK',
    status: '201 Created',
    statusColor: '#10B981',
    duration: '8 ms',
    size: '96 B',
    datetime: '25/11/2026 11:04:19',
    reqRaw: '{"webhook_event":"payment.approved","order_id":"ord_982341","paid_at":"2026-11-25T11:04:19Z","signature":"sha256=8f9d2a"}',
    resRaw: '{"acknowledged":true,"processed_by":"local-backend-service"}',
  },
  req3: {
    type: 'request',
    method: 'POST',
    path: '/webhooks/gateway',
    port: ':8443',
    ssl: true,
    source: 'CAPTURED',
    status: '503 Service Unavailable',
    statusColor: '#F43F5E',
    duration: '804 ms',
    size: '84 B',
    datetime: '25/11/2026 11:01:05',
    reqRaw: '{"event":"transfer.initiated","tx_id":"tx_00192","retry_count":2}',
    resRaw: '{"error":"upstream_gateway_timeout","retryable":true,"code":"ERR_GATEWAY_503"}',
  },
  mock1: {
    type: 'mock',
    name: 'Approve Pix + Callback',
    method: 'POST',
    path: '/webhooks/payment',
    port: ':8443',
    ssl: true,
    status: '200 OK',
    delay: '150ms',
    callbackUrl: 'http://localhost:3000/api/orders/callback',
    callbackMethod: 'POST',
    callbackDelay: '1500ms',
    callbackBody: '{"webhook_event":"payment.approved","order_id":"ord_982341","status":"PAID"}',
    resRaw: '{"status":"received","mock_rule":"Approve Pix Checkout","callback_scheduled":true}',
  },
  mock2: {
    type: 'mock',
    name: 'Erro Gateway (503)',
    method: 'POST',
    path: '/webhooks/gateway',
    port: ':8443',
    ssl: true,
    status: '503 Unavailable',
    delay: '800ms',
    callbackUrl: null,
    resRaw: '{"error":"upstream_gateway_timeout","retryable":true,"code":"ERR_GATEWAY_503"}',
  },
};

let currentLang = 'pt';
let currentSimKey = 'req1';
let isPretty = true;

function formatJson(raw) {
  if (!isPretty) return raw;
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

function setLanguage(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (I18N[lang][key]) {
      el.innerHTML = I18N[lang][key];
    }
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  try {
    localStorage.setItem('hooksmith:docs-lang', lang);
  } catch {}
}

function selectSimItem(key) {
  currentSimKey = key;
  document.querySelectorAll('[data-sim-item]').forEach((el) => {
    el.classList.toggle('active', el.getAttribute('data-sim-item') === key);
  });
  renderSimulatorInspector();
}

function toggleSimPretty() {
  isPretty = !isPretty;
  renderSimulatorInspector();
}

function renderSimulatorInspector() {
  const item = SIM_DATA[currentSimKey];
  const container = document.getElementById('sim-inspector');
  if (!container || !item) return;

  if (item.type === 'request') {
    container.innerHTML = `
      <div class="inspector-bar">
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="method-badge method-${item.method}">${item.method}</span>
          <span style="font-family:var(--font-mono);font-weight:600;">${item.path}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="tip-chip" title="Data e hora da chamada">📅 ${item.datetime}</span>
          <span class="source-tag tag-${item.source}">${item.source}</span>
          <span class="tip-chip">${item.port} ${item.ssl ? '<span class="ssl-tag">🔒 SSL</span>' : 'HTTP'}</span>
        </div>
      </div>

      <div class="inspector-bar" style="background:#10131C;">
        <span style="color:var(--brand);font-family:var(--font-mono);font-weight:700;font-size:0.73rem;">↗ INCOMING REQUEST • BODY</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="pretty-btn" onclick="toggleSimPretty()">✨ ${isPretty ? 'Pretty' : 'Raw'}</button>
        </div>
      </div>
      <pre class="code-box">${formatJson(item.reqRaw)}</pre>

      <div style="height:5px;background:#1A202C;border-top:1px solid var(--line);border-bottom:1px solid var(--line);cursor:row-resize;" title="Divisor Redimensionável Request / Response"></div>

      <div class="inspector-bar" style="background:#10131C;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="color:var(--ok);font-family:var(--font-mono);font-weight:700;font-size:0.73rem;">↙ RESPONSE</span>
          <span style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;color:${item.statusColor};">● ${item.status}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:0.73rem;color:var(--fg-muted);">
          <span>⏱ ${item.duration}</span>
          <span>💾 ${item.size}</span>
        </div>
      </div>
      <pre class="code-box">${formatJson(item.resRaw)}</pre>
    `;
  } else {
    container.innerHTML = `
      <div class="inspector-bar">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:var(--brand);font-weight:700;">⚡ MOCK INSPECTOR:</span>
          <span style="font-weight:700;">${item.name}</span>
          <span class="method-badge method-${item.method}">${item.method}</span>
          <span style="font-family:var(--font-mono);color:var(--fg-muted);">${item.path}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="tip-chip">${item.port} ${item.ssl ? '<span class="ssl-tag">🔒 SSL</span>' : 'HTTP'}</span>
          <span class="tip-chip">⏱ ${item.delay}</span>
          <button class="pretty-btn" onclick="toggleSimPretty()">✨ ${isPretty ? 'Pretty' : 'Raw'}</button>
        </div>
      </div>
      ${
        item.callbackUrl
          ? `<div style="padding:12px 14px;background:rgba(244,63,94,0.08);border-bottom:1px solid rgba(244,63,94,0.25);font-size:0.78rem;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <strong style="color:#FB7185;font-family:var(--font-mono);">🚀 ASYNC CALLBACK CONFIGURED (${item.callbackMethod})</strong>
                <span class="cb-tag">Delay: ${item.callbackDelay}</span>
              </div>
              <div style="font-family:var(--font-mono);color:var(--fg-muted);margin-bottom:6px;">Target: ${item.callbackUrl}</div>
              <pre class="code-box" style="padding:8px;border-radius:6px;border:1px solid var(--line);">${formatJson(item.callbackBody)}</pre>
            </div>`
          : ''
      }
      <div class="inspector-bar" style="background:#10131C;">
        <span style="color:var(--fg-muted);font-family:var(--font-mono);font-weight:700;font-size:0.72rem;">SIMULATED RESPONSE BODY (${item.status})</span>
      </div>
      <pre class="code-box">${formatJson(item.resRaw)}</pre>
    `;
  }
}

let currentSlideIndex = 0;
let carouselTimer = null;
const SLIDE_CAPTION_KEYS = ['car_d1', 'car_d2', 'car_d3', 'car_d4'];

function goToSlide(index) {
  currentSlideIndex = (index + 4) % 4;
  document.querySelectorAll('[data-slide]').forEach((el) => {
    el.classList.toggle('active', Number(el.getAttribute('data-slide')) === currentSlideIndex);
  });
  document.querySelectorAll('[data-slide-tab]').forEach((el) => {
    el.classList.toggle('active', Number(el.getAttribute('data-slide-tab')) === currentSlideIndex);
  });
  document.querySelectorAll('[data-slide-dot]').forEach((el) => {
    el.classList.toggle('active', Number(el.getAttribute('data-slide-dot')) === currentSlideIndex);
  });
  const captionEl = document.getElementById('carousel-caption');
  const key = SLIDE_CAPTION_KEYS[currentSlideIndex];
  if (captionEl && I18N[currentLang] && I18N[currentLang][key]) {
    captionEl.setAttribute('data-i18n', key);
    captionEl.innerHTML = I18N[currentLang][key];
  }
}

function nextSlide() {
  goToSlide(currentSlideIndex + 1);
}

function prevSlide() {
  goToSlide(currentSlideIndex - 1);
}

function startCarouselAutoPlay() {
  stopCarouselAutoPlay();
  carouselTimer = setInterval(() => {
    nextSlide();
  }, 6000);
}

function stopCarouselAutoPlay() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
}

function pauseCarousel() {
  stopCarouselAutoPlay();
}

function resumeCarousel() {
  startCarouselAutoPlay();
}

function openLightbox(src) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  if (modal && img) {
    img.src = src;
    modal.classList.add('open');
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang');
  let savedLang = null;
  try {
    savedLang = localStorage.getItem('hooksmith:docs-lang');
  } catch {}
  const initialLang = urlLang && I18N[urlLang] ? urlLang : savedLang && I18N[savedLang] ? savedLang : 'pt';
  setLanguage(initialLang);
  renderSimulatorInspector();
  startCarouselAutoPlay();
});
