<p align="center">
  <img src="src/assets/brand/hooksmith-logo.png" alt="Hooksmith Logo" width="380">
</p>

<p align="center">
  <strong>Forja Local de APIs y Webhooks — 100% Offline, Segura y Enfocada en la Privacidad</strong>
</p>

<p align="center">
  <a href="https://github.com/claudsan/hooksmith/actions/workflows/ci.yml"><img src="https://github.com/claudsan/hooksmith/actions/workflows/ci.yml/badge.svg" alt="CI — Build & TypeCheck"></a>
  <a href="https://github.com/claudsan/hooksmith/actions/workflows/release.yml"><img src="https://github.com/claudsan/hooksmith/actions/workflows/release.yml/badge.svg" alt="Release Binaries (Win / Linux / macOS)"></a>
  <a href="https://github.com/claudsan/hooksmith/actions/workflows/pages.yml"><img src="https://github.com/claudsan/hooksmith/actions/workflows/pages.yml/badge.svg" alt="Deploy GitHub Pages"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-10B981.svg" alt="License: MIT"></a>
  <a href="https://github.com/claudsan/hooksmith/pulls"><img src="https://img.shields.io/badge/PRs-welcome-F97316.svg" alt="PRs Welcome"></a>
  <img src="https://img.shields.io/badge/100%25_Local-Offline_First-38BDF8.svg" alt="100% Local & Offline">
</p>

<p align="center">
  <a href="README.pt-BR.md">🇧🇷 Versão em Português</a> •
  <a href="README.md">🇺🇸 English Version</a> •
  <a href="README.es-ES.md">🇪🇸 Versión en Español</a> •
  <a href="CONTRIBUTING.es-ES.md">🛠️ Documentación Técnica y Arquitectura</a> •
  <a href="https://claudsan.github.io/hooksmith/?lang=es">🌐 Sitio Oficial</a>
</p>

---

## ☕ El Origen: Hecho de Dev para Dev

Si alguna vez has desarrollado integraciones con pasarelas de pago, ERPs, APIs financieras o webhooks de mensajería, seguramente conoces el sufrimiento:

- **El Dilema de WireMock:** Tener que escribir decenas de líneas de configuración en Java o interminables archivos JSON de mapeo, levantar contenedores Docker pesados solo para responder un simple `200 OK`, o perder horas buscando por qué una expresión regular no coincide con la ruta del mock.
- **La Ceguera de los Webhooks:** Quedarse mirando la ventana negra de la terminal cruzando los dedos para que el webhook haya llegado a tu backend, sin visibilidad de qué cabeceras se enviaron, si el payload llegó truncado o si hubo un timeout.
- **La Pesadilla de los Flujos Asíncronos:** ¿Cómo probar en tu máquina una pasarela que responde a la creación de una orden al instante con `200 OK` y, 3 segundos después, envía un POST de callback notificando que el pago fue aprobado? Casi todos los desarrolladores terminan creando scripts improvisados, controladores temporales o disparando peticiones manuales en Postman para intentar simular el ciclo.
- **La Dependencia de Túneles en la Nube:** Depender de herramientas con URLs públicas rotativas que cambian en cada reinicio, imponen límites de peticiones por minuto, añaden latencia de red y exponen datos sensibles de tu tráfico a servidores de terceros.

**Hooksmith nació exactamente de ese dolor.**

Queríamos una herramienta visual, rápida y nativa de escritorio donde pudieras abrir un puerto HTTP o HTTPS en dos clics, inspeccionar cada byte en tiempo real, editar y reenviar payloads sin fricción, y simular flujos asíncronos completos de extremo a extremo. Sin nube, sin burocracia, sin contenedores pesados. Una forja robusta y elegante, creada por quienes viven la realidad del desarrollo de software y entienden el valor de un ciclo de pruebas sin frustración.

---

## 📌 ¿Qué es Hooksmith?

**Hooksmith** es una herramienta de escritorio ultrarrápida diseñada para que los desarrolladores intercepten, inspeccionen, prueben, simulen (mock) y reenvíen (replay) peticiones HTTP y llamadas de webhooks HTTPS íntegramente en su máquina local.

A diferencia de los servicios basados en la nube, Hooksmith funciona **100% offline**: sin cuentas, sin suscripciones, sin intermediarios en la nube y con cero telemetría. Todo el historial de tráfico, las reglas de simulación y los certificados SSL permanecen guardados exclusivamente en tu disco local.

---

## 🚀 Funcionalidades Principales

- **Múltiples Listeners (HTTP y HTTPS/SSL):** Crea puertos locales personalizados con emisión automática de certificados SSL autofirmados.
- **Inspección de Tráfico en Tiempo Real:** Flujo de alta resolución que muestra método, ruta, estado HTTP, duración en ms y fecha/hora exacta de la llamada.
- **Divisor Redimensionable en el Panel:** Ajusta la altura vertical entre la Petición (Request) y la Respuesta (Response) con doble clic para restaurar al 50%/50%.
- **Prettify Inteligente de JSON:** Alterna con un clic entre la vista indentada (`Pretty`) y la compacta (`Raw`), con copia formateada al portapapeles.
- **Simulador de Mocks Potente:** Responde automáticamente a rutas con códigos de estado personalizados, cabeceras a medida y simulación de latencia de red (delay).
- **Callbacks Asíncronos Automatizados:** Configura el disparo de webhooks automáticos después del mock (ideal para simular pasarelas de pago y eventos de mensajería).
- **Edición y Replay en 1 Clic:** Modifica cabeceras o cuerpos de peticiones capturadas y reenvíalos al instante.
- **Interfaz Multilingüe:** Traducción completa y nativa en Español (es-ES), Portugués (pt-BR) e Inglés (en-US).

---

## 📖 Manual Práctico de Uso

### 1. Creación y Gestión de Listeners (HTTP y HTTPS)

Los Listeners son los puertos que Hooksmith abre en tu computadora para escuchar el tráfico generado por tus aplicaciones, microservicios o webhooks externos.

1. En la barra lateral izquierda, en **Listeners**, haz clic en **`+`** (o en el botón **`+ Listener`** en la barra superior).
2. Completa la configuración:
   - **Nombre del Listener:** Un nombre descriptivo para identificar el servicio (ej: `Pasarela de Pagos`, `API de Notificaciones`, `Backend Local`).
   - **Puerto:** Número del puerto (ej: `4010`, `8443`, `8080`).
   - **HTTPS / SSL:** Activa el interruptor para usar HTTPS seguro. Hooksmith genera y configura un certificado SSL local automáticamente sin necesidad de comandos en la terminal.
3. Haz clic en **Iniciar Listener**. El servicio quedará activo al instante (con indicador verde pulsante).
4. Puedes pausar y reactivar cualquier listener en cualquier momento usando el interruptor de la tarjeta.

---

### 2. Monitoreo del Tráfico en Tiempo Real (Live Traffic)

Tan pronto como una petición llega a uno de los puertos activos, aparece de inmediato en la columna central de tráfico:

- **Indicadores Rápidos:** Muestra el método HTTP (`POST`, `GET`, `PUT`, `DELETE`), la ruta de la URL, el código de estado (`200 OK`, `500 Internal Server Error`, etc.), el tiempo de respuesta en milisegundos y el puerto receptor.
- **Etiquetas de Origen de la Llamada:**
  - `CAPTURED`: Petición real proveniente de la red interceptada por el listener.
  - `MOCKED`: Petición interceptada y respondida por una regla de mock de Hooksmith.
  - `REPLAY`: Petición generada por la herramienta de Replay de Hooksmith.
  - `CALLBACK`: Webhook automático disparado por una regla de mock.
- **Búsqueda y Filtros:**
  - Usa el campo de búsqueda (<kbd>Ctrl</kbd> + <kbd>K</kbd>) para filtrar por ruta, contenido del cuerpo o código de estado.
  - Filtra por tipo haciendo clic en las pestañas: **Todos**, **POST**, **GET** o **Errores** (4xx/5xx).
  - Usa el botón **Limpiar** para vaciar la lista cuando lo desees.

---

### 3. Inspección de Peticiones y Respuestas

Al hacer clic en cualquier elemento de la lista de tráfico, el panel derecho muestra todos los detalles de la llamada:

- **Fecha y Hora de la Llamada:** Muestra la fecha y hora exacta (`DD/MM/AAAA HH:MM:SS`) en que el webhook fue recibido por el sistema.
- **Editor de Código Monaco Integrado:** Soporte completo de resaltado de sintaxis (syntax highlighting) para JSON, XML, HTML y texto plano.
- **Divisor Vertical Redimensionable:**
  - Pasa el cursor sobre la barra horizontal que divide la Petición (mitad superior) y la Respuesta (mitad inferior).
  - Haz clic y arrastra hacia arriba o hacia abajo para dar más espacio al payload que necesitas analizar en detalle.
  - Haz **doble clic** sobre la barra para restaurar la división perfecta de 50% / 50%.
  - El tamaño configurado se guarda automáticamente para tus próximas sesiones.
- **Botón Prettify (JSON Formateado):**
  - En la barra de la pestaña `Body`, haz clic en el botón **`Pretty`** para alternar entre la vista indentada y la vista compacta en una sola línea (`Raw`).
  - El botón de copiar respeta el modo activo, copiando el JSON indentado y listo para compartir.
- **Pestañas de Navegación:**
  - **Body:** Cuerpo de la petición/respuesta formateado.
  - **Headers:** Tabla de cabeceras HTTP analizadas.
  - **Query:** Parámetros de la query string de la URL.
  - **Raw:** Payload original exactamente como fue transmitido.

---

### 4. Creación e Inspección de Reglas de Mock

Las reglas de mock te permiten simular endpoints externos, APIs de terceros o escenarios de error (como timeouts o fallos 500) sin necesidad de alterar código en el backend:

1. En la sección **Reglas de Mock** de la barra lateral, haz clic en el botón **`+`** (o presiona <kbd>Ctrl</kbd> + <kbd>M</kbd>).
2. Configura la regla:
   - **Nombre de la Regla:** Ej: `Simular Pasarela No Disponible (503)`.
   - **Alcance (Scope):** Elige si la regla se aplica a todos los puertos o exclusivamente a un puerto específico (mostrando la etiqueta **`SSL`** si el puerto es HTTPS).
   - **Método y Ruta:** Ej: `POST` `/webhooks/pagos` (admite rutas exactas o comodines como `/api/*`).
   - **Código de Estado:** Códigos estándar (`200`, `201`, `400`, `422`, `500`) o código personalizado.
   - **Retraso / Latencia (ms):** Simula lentitud de red o servidores sobrecargados (ej: `800ms`) para probar estados de carga y timeouts en tu aplicación.
   - **Cuerpo y Cabeceras:** El JSON o respuesta que el mock debe devolver al cliente.
3. **Modo Inspección vs Edición:**
   - **Clic en la tarjeta de la regla:** Abre la inspección detallada del mock en el panel derecho en modo lectura, mostrando ruta, estado, cabeceras, cuerpo y comando cURL listo para probar.
   - **Para editar la regla:** Pasa el cursor sobre la tarjeta y haz clic en el **ícono de lápiz** o haz clic en el botón **"Editar Regla"** en el encabezado del inspector.

---

### 5. Callbacks Asíncronos por Regla de Mock

Muchas APIs modernas (como Stripe, MercadoPago, PayPal, WhatsApp Cloud API o GitHub) funcionan de forma asíncrona:
1. Tu aplicación realiza la llamada inicial creando un recurso (ej: generar orden de pago).
2. El servicio responde al instante con `200 OK` y el ID generado.
3. Segundos después, su servidor realiza un **webhook callback** hacia la URL de tu aplicación informando que el pago fue aprobado (`payment.approved`).

Hooksmith simula este ciclo completo de forma automática:

1. En el modal de creación/edición del mock, activa la opción **Callback Asíncrono**.
2. Define:
   - **Método del Callback:** `POST`, `PUT`, `PATCH` o `GET`.
   - **URL de Destino:** El endpoint de tu backend local (ej: `http://localhost:3000/api/webhooks/pagos`).
   - **Retraso del Callback:** Tiempo en milisegundos a esperar después de responder el mock antes de disparar el webhook (ej: `1500ms`).
   - **Payload del Callback:** El JSON con los datos que tu backend espera recibir en el evento.
3. Al recibir una llamada que coincida con la regla, Hooksmith responde el mock de inmediato, espera el tiempo configurado y dispara la petición de callback hacia tu backend.

---

### 6. Edición y Replay Instantáneo

¿Quieres probar cómo se comporta tu backend con datos ligeramente distintos sin tener que generar un nuevo evento en el sistema de origen?

1. Selecciona una petición ya capturada en el historial de tráfico.
2. En la barra superior del inspector, haz clic en el botón **`Edit & Replay`**.
3. El panel entrará en **Modo de Edición**:
   - Modifica el JSON del cuerpo directamente en el editor.
   - Cambia o añade nuevas cabeceras.
   - Haz clic en el botón naranja **`Replay`** (o presiona <kbd>Ctrl</kbd> + <kbd>Enter</kbd>).
4. La nueva petición se dispara al instante y puedes ver la respuesta de tu backend en la parte superior de la lista con la etiqueta `REPLAY`.

---

## 🔮 Próximas Novedades (Roadmap y Backlog Futuro)

Hooksmith está evolucionando para unificar webhooks HTTP, mensajería asíncrona y automatización programada en una única forja 100% local:

- 📡 **Integración con Apache Kafka:** Conéctate a brokers Kafka locales para inspeccionar mensajes en tópicos en tiempo real, publicar eventos JSON en 1 clic y crear puentes automáticos (`Webhook HTTP ➔ Tópico Kafka`).
- 🐇 **Integración con RabbitMQ:** Monitorea exchanges y colas AMQP visualmente, inspecciona Dead Letter Queues (DLQ), simula consumidores locales y publica mensajes en colas cuando se active una regla de mock.
- ⏰ **Programación de Llamadas y Cron Jobs:** Programa disparos periódicos de webhooks, baterías de pruebas automatizadas y políticas realistas de reintentos (*exponential backoff*) sin depender de scripts externos.

---

## ⌨️ Atajos de Teclado

| Atajo | Acción |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Ejecutar Replay de la petición seleccionada |
| <kbd>Ctrl</kbd> + <kbd>M</kbd> | Abrir modal para Nueva Regla de Mock |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>E</kbd> | Enfocar el campo de búsqueda de tráfico |
| <kbd>Ctrl</kbd> + <kbd>L</kbd> | Limpiar lista de tráfico capturado |
| <kbd>Esc</kbd> | Cerrar modal abierto o deseleccionar inspección |
| <kbd>Ctrl</kbd> + <kbd>+</kbd> / <kbd>Ctrl</kbd> + <kbd>-</kbd> | Aumentar / Disminuir zoom de la interfaz |
| <kbd>Ctrl</kbd> + <kbd>0</kbd> | Restaurar zoom predeterminado |

---

## 🔒 Almacenamiento Local y Privacidad

Hooksmith guarda tus datos en una base de datos SQLite local en la carpeta de datos de tu sistema operativo:
- **Windows:** `%APPDATA%/Hooksmith/hooksmith.db`
- **macOS:** `~/Library/Application Support/Hooksmith/hooksmith.db`
- **Linux:** `~/.config/Hooksmith/hooksmith.db`

Ningún dato se envía a servidores externos.

---

## 🤝 100% Open Source — ¡Contribuye al Proyecto!

**Hooksmith es 100% Open Source (Licencia MIT)**, hecho de dev para dev. ¡Cualquier persona puede contribuir y ayudar a evolucionar la herramienta!

> 🛠️ **Consulta nuestra [Documentación Técnica y Guía de Arquitectura (`CONTRIBUTING.es-ES.md`)](CONTRIBUTING.es-ES.md)** para conocer todo nuestro stack (Electron, React 19, Fastify, SQLite WAL, Monaco, Undici), diagramas de arquitectura, estructura de carpetas e instrucciones de desarrollo local.

- 🍴 **Envía un Pull Request:** ¿Quieres ayudar a construir las integraciones con **Apache Kafka**, **RabbitMQ**, **Programación de Llamadas** o mejorar la interfaz? ¡Haz un fork del proyecto y envía tu PR!
- 💡 **Sugiere Funcionalidades o Reporta Bugs:** Abre un issue en [GitHub Issues](https://github.com/claudsan/hooksmith/issues) con tus ideas y comentarios.
- ⭐ **Apoya el Proyecto:** Si Hooksmith te ha facilitado el día a día probando webhooks, ¡déjanos una estrella (Star) en el repositorio de GitHub!

---

## 📄 Licencia

Hooksmith se distribuye bajo la licencia [MIT](LICENSE).
