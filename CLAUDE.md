# Mayu Travel — Portafolio

Sitio de portafolio para Mayurlin Viera (fotografía y dirección cinematográfica para
hoteles de lujo). React + TypeScript + Vite + Tailwind CSS, desplegado en GitHub
Pages vía GitHub Actions.

**Fase actual: construcción sobre GitHub Pages.** El plan es migrar el sitio
completo a un hosting/dominio propio de Mayurlin más adelante — ver "Migración
futura" abajo antes de tocar `vite.config.ts`.

## Cómo trabajar en este proyecto

- Tocar **solo** lo que se pide explícitamente. No rediseñar, no "mejorar" de
  paso, no tocar funcionalidad no mencionada.
- **Verificar siempre con capturas reales** (Playwright) en móvil (390x844) y
  escritorio (1440x900) antes de dar algo por terminado. Mayurlin ha sido muy
  clara y repetida en que no acepta atajos aquí — cero excepciones.
- **Agrupar cambios pequeños** en una sola ronda de verificación/publicación
  cuando sea razonable, en vez de un ciclo completo de build→deploy→verify por
  cada micro-ajuste. El proceso completo (compilar, levantar servidor, capturas,
  git, PR, merge, deploy, confirmar) tiene un costo real por ronda — agrupar
  varios pedidos pequeños de Mayurlin en una sola ronda ahorra bastante.
- Cuando algo es ambiguo o tiene trade-offs reales, preguntar (con
  `AskUserQuestion` si son opciones concretas) en vez de asumir — pero sin
  bloquear el progreso en detalles menores que se pueden decidir con criterio
  razonable (documentar la decisión al reportar, no pedir permiso para todo).
- Reportar solo cuando esté **realmente verificado**, no antes.
- **Nunca borrar fotos que Mayurlin ya mandó.** Se puede reorganizar,
  recortar de otra forma o mover de sección libremente ("con buen criterio"),
  pero cada foto que ella envía para un hotel debe terminar visible en algún
  lugar de ese hotel — nunca simplemente desaparecer sin que ella lo pida.
- **Máxima calidad de imagen siempre**, aunque eso penalice el peso/tiempo de
  carga — pedido explícito de Mayurlin. Al recortar con PIL: `quality=97,
  subsampling=0` como mínimo, nunca el default (~75) ni valores bajos como
  90. Si el recorte necesario coincide exactamente con el tamaño ya recibido
  (no hace falta cortar nada), copiar el archivo tal cual en vez de
  re-codificarlo — cada re-encode JPEG pierde nitidez de forma acumulativa.
- **Nombre completo de cada hotel**: si la propiedad pertenece a un grupo o
  colección más grande, el nombre debe reflejar ambos — "GRUPO, PROPIEDAD"
  (coma, igual que "THE RITZ-CARLTON TENERIFE, ABAMA" o "VESTIGE COLLECTION,
  BINIDUFÀ") — nunca solo el nombre corto de la propiedad si existe una marca
  matriz. Investigar esto al procesar cada hotel nuevo, no asumir. El nombre
  vive en dos lugares que deben coincidir: `data/hotels.ts` (`hotelName`,
  campo estructural) y `src/lib/content.tsx` + `content.json` (`hotels[].hotelName`,
  el que realmente se muestra — pisa al estructural vía merge en
  `HomeMain.tsx`). **Editar los dos siempre**, o el cambio no se verá.

## Pipeline de git / deploy (repetir en cada ronda)

Rama de trabajo: `claude/portfolio-copy-analysis-qjsul0`.

```
1. git add <archivos específicos> (nunca git add -A a ciegas)
2. git commit -m "..."
3. git fetch origin main && git rebase origin/main
   -- casi siempre hay conflicto o "skipped previously applied commit"
      porque cada ronda anterior se fusionó con squash-merge. Es normal:
      verificar con `git log --oneline` y `git diff` que el contenido
      remoto coincide con lo ya fusionado, y resolver quedándose con HEAD
      (o `git rebase --skip` si el commit completo ya está aguas arriba).
4. npx tsc --noEmit && npm run build   (verificar limpio, otra vez tras el rebase)
5. git push -u origin claude/portfolio-copy-analysis-qjsul0
   -- normalmente falla con "non-fast-forward" por la misma razón del paso 3.
      Confirmar con git log/diff que es seguro, y entonces:
      git push --force-with-lease -u origin claude/portfolio-copy-analysis-qjsul0
6. mcp__github__create_pull_request (base: main)
7. mcp__github__merge_pull_request (merge_method: "squash")
8. mcp__github__actions_run_trigger (method: run_workflow, workflow_id: 328898289, ref: main)
9. mcp__Claude_Code_Remote__send_later (delay ~2 min) para confirmar el deploy y
   reportar a Mayurlin en español, breve. NUNCA fabricar el resultado del
   check-in -- llega como notificación aparte.
10. Al confirmar: mcp__github__actions_list (method: list_workflow_runs, branch: main)
    -- la respuesta es enorme (>400K caracteres), siempre se trunca. Leer el
       archivo guardado con Python (json.load) en vez de reintentar la
       herramienta.
```

**Nota sobre duplicados:** los recordatorios de `send_later` a veces llegan
tarde o fuera de orden (después de que ya se reportó ese mismo resultado por
otro camino). Si el head_sha ya fue confirmado y reportado, no repetir el
reporte completo — decir brevemente que ya se confirmó antes y seguir.

## Reglas de copy

- **Todo copy nuevo se valida en español Y en su traducción al inglés** antes de
  proponerlo. Pedido explícito de Mayurlin: la versión en inglés se hará al
  final, pero una frase que sólo funciona en español obliga a rehacerla. Ejemplo
  real: "Se usa durante mucho tiempo" → "Used for a long time" es plano en
  inglés, y las alternativas naturales devuelven la promesa temporal.
- **Nunca prometer volumen ni duración de entrega.** "Un año de material" se
  descartó por eso: entregan piezas suficientes para publicar, no un año.
- **Menos es más: nada se dice dos veces.** Antes de añadir una frase, buscar si
  ya está en otro sitio. El email vive en dos lugares (Contacto y pie), el plazo
  de reserva en uno (preguntas frecuentes), los oficios en Acerca de y en
  "Alcance de producción" — no en el hero.
- **Posicionamiento**: producción visual para hoteles de lujo **con enfoque
  sostenible**. Es el cliente quien tiene ese enfoque, no una certificación del
  estudio — en inglés, "sustainability-led luxury hotels", nunca "sustainable".
  Vive en el subtítulo del hero (posiciona) y en el cierre de Acerca de
  (sustenta); las fichas de District Hive, Vestige, Welmoon y Deltapark lo
  prueban solas.

## Sistema de diseño (decidido, no revertir sin que ella lo pida)

- **Centrado sí, pero no los carruseles.** Cabeceras de sección, bloques de
  texto sueltos, formulario y botones van centrados. Se probó centrar también
  los carruseles y ella lo rechazó de inmediato: **ese diseño no se toca.**
- **Cuatro carruseles hermanos**, con el mismo esqueleto y **alineados a la
  izquierda**: ancla a la izquierda (comilla o cifra) → pieza flotada →
  el texto en serif grande envolviéndola → firma. Son el bloque de valor de
  Inicio, "El proceso" (Acerca de), "Voces de la industria" (Contacto) y
  **"Piezas verticales"** (el bloque de vídeo de Inicio). Cambiar uno es
  cambiar los cuatro. El cuarto flota un vídeo 9:16 en vez de una foto 3:4, y
  por eso va un escalón más ancho: una pieza vertical al ancho de una foto
  3:4 sale diminuta.
- El bloque de valor **no lleva bucle**: entra una vez y se pasa de 01 a 02
  pulsando la foto. La cifra es un rótulo diminuto, no un ancla gigante.
- "El proceso" **recorre los cuatro pasos una sola vez y se detiene** en el
  último. Arranca al entrar en pantalla (con `IntersectionObserver`): si
  arrancara al montar, la sección vive tan abajo de Acerca de que al llegar ya
  estaría acabada. Cualquier toque de Mayurlin lo detiene y manda ella. La foto
  y el texto son pulsables. No lleva rótulo ni cifra grande — el "Paso N de M"
  de abajo ya lo dice.
- **La trayectoria (35+ / 5 / 6) vive en la banda inferior del hero**, no en una
  sección propia: pequeña, centrada, sin reglas divisorias y con aire. Se quitó
  del bloque de valor para aligerarlo.
- **Jerarquía de líneas**: regla a sangre completa = cambio de sección; hairline
  al ancho del contenido = estructura dentro de un bloque. Los campos del
  formulario usan el mismo hairline, sin relleno ni sombra.
- **Hero**: Cormorant (`font-serif`, peso normal). Se probó Playfair 500/600 y
  ella lo rechazó: "se perdió la elegancia, se ve como negrita". El tamaño se
  mantiene; lo que baja es el peso.
- **El hero es la foto entera y un solo bloque de texto abajo a la izquierda**:
  titular en dos líneas (`hero.fixedLine` + la palabra que rota, esta en
  cursiva), subtítulo pequeño debajo y la trayectoria en un renglón fino. Sin
  banda de fondo, sin "Desplazar". Referencia que dio ella: la portada de v0.
- **La foto del hero es el problema de fondo**: `hero-portada.jpg` tiene su zona
  más clara (la grava) justo donde va el texto, y por eso pide tanto velo.
  Alternativas medidas con la esquina inferior izquierda oscura y limpia:
  `sec6-gal01-fachada-noche-h.jpg` (la mejor con diferencia) y
  `sec3-gal08-fachada-h.jpg`.
- **Al medir contraste, cuidado con la caja**: un `<span>` de bloque ocupa todo
  el ancho y da lecturas falsas; hay que medir sobre los glifos reales
  (`Range.getBoundingClientRect`), coger el div **más pequeño** que contiene el
  texto (si no se coge un ancestro), y comparar contra el píxel más claro y
  contra la opacidad real del texto, no contra blanco puro.
- **Ficha de hotel**: los datos del rodaje (temporada, duración, uso) van en una
  sola línea fina al pie de la foto de portada, no en una segunda fila de datos
  debajo de la ficha — ahí era demasiado texto para quien viene a ver fotos.
- **Botones**: un solo tamaño en toda la web —
  `px-8 py-4 text-[11px] md:px-10 md:py-[1.15rem] md:text-xs`, centrados.
- **Un solo CTA por bloque.** El "ver más" de Inicio vive en el umbral de la
  galería siguiente, fuera del bloque de valor, para que no compitan.

## Verificación local (antes de cada push)

```bash
npm run build
mkdir -p /tmp/servedir && ln -sf $(pwd)/dist /tmp/servedir/New-Portafolio
cd /tmp/servedir && NODE_PATH=/opt/node22/lib/node_modules \
  /opt/node22/bin/node /opt/node22/lib/node_modules/http-server/bin/http-server -p <puerto> --cors
```

Usar `http-server` (HTTP/1.1, keep-alive, range requests reales), **no**
`vite preview` ni servidores Python simples para nada relacionado con video —
ver "Limitaciones del entorno" abajo.

Luego Playwright: `NODE_PATH=/opt/node22/lib/node_modules node <script>.js`,
navegador en `/opt/pw-browsers/chromium`, `args: ['--no-sandbox']`.

## Limitaciones del entorno de este agente (no del sitio real)

- **Sin acceso a dominios externos** (curl, WebFetch, fetch del navegador):
  cualquier imagen o recurso en un dominio externo (mayurlintravel.eu,
  Unsplash, etc.) no se puede descargar ni verificar visualmente desde aquí.
  Si Mayurlin da un enlace externo, hay que pedirle el archivo directo, o
  aceptar no poder verificarlo visualmente y decirlo con honestidad.
- **El Chromium de Playwright en este entorno NO soporta H.264** (es un build
  de Chromium de código abierto, no Chrome real). Los videos deben llevar
  también una fuente WebM (`<source type="video/webm">` después de la de mp4)
  para poder verificar reproducción real aquí — en Safari/Chrome/Firefox
  reales, H.264 sí funciona sin problema.
- **Safari tiene un bug conocido** con el prop `muted` de React en `<video
  autoPlay muted>`: a veces evalúa si puede autoreproducir antes de que el
  DOM refleje el estado "silenciado", y bloquea el autoplay. Fix: forzar
  `video.muted = true` y llamar `.play()` explícitamente en un
  `useLayoutEffect` via ref (ver `components/IntroLoader.tsx`).
- **Bug real de `<source>` encontrado (no solo limitación del entorno)**: si
  la fuente primaria de un `<video>` empieza a cargar pero falla al
  decodificar a mitad de la descarga (no de inmediato), algunos navegadores
  disparan `error` directamente en el `<video>` en vez de pasar a la
  siguiente `<source>` — el fallback automático solo aplica en la selección
  inicial de recurso. Solución: asignar `video.src` de forma imperativa y
  reintentar manualmente con la copia webm en el handler de error, en vez de
  depender de `<source>` hijos (ver `components/IntroLoader.tsx`).
- **Las fotos pegadas directo en el chat se re-codifican a WebP y se limitan
  a ~2000px de ancho** por el pipeline de pegado — no es el archivo original
  de su cámara, aunque sea "la mejor calidad disponible" en la conversación.
  Si Mayurlin reenvía la misma foto "más comprimida" para ahorrar peso en
  una ronda anterior, la versión menos comprimida sigue estando en el
  historial de la conversación y se puede recuperar con el mismo script de
  extracción de imágenes del JSONL (ver ejemplos ya usados en este archivo
  de contexto). Si pide máxima calidad después, preferir siempre la versión
  menos comprimida ya recibida antes que la comprimida — pero explicarle que
  ninguna de las dos es el archivo original sin pasar por el chat.

## Sistema de contenido editable (fotos y textos fuera del bundle)

Mayurlin quiere poder cambiar fotos y textos principales subiendo archivos a
su hosting, sin tocar código ni recompilar. Se implementó así:

- **Fotos**: `public/images/*.jpg`, referenciadas con el helper
  `publicImage(filename)` de `src/lib/content.tsx` (usa
  `import.meta.env.BASE_URL`, nunca rutas absolutas hardcodeadas).
- **Textos principales**: `public/images/content.json`, cargado en tiempo de
  ejecución (`fetch`, no import estático) vía `ContentProvider` /
  `useSiteContent()` en `src/lib/content.tsx`. Hace merge campo por campo
  contra `DEFAULT_CONTENT` (mismo archivo) — si un campo falta o el JSON está
  roto, cae al valor por defecto sin romper la página. **Mantener
  `DEFAULT_CONTENT` sincronizado con `content.json`** cada vez que se edite
  uno de los dos.

### Convención de nombres de fotos

Las 8 secciones de hotel de Inicio (`data/hotels.ts`, array `HOTEL_STORIES`,
en orden = sec1..sec8) muestran exactamente 3 fotos cada una
(`HotelSectionBlock.tsx` corta a `.slice(0, 3)`). Cada layoutVariant (0-7)
define una forma fija por foto — **la forma (h/v/c) no se puede cambiar sin
tocar el layout**:

| Sección | foto1 | foto2 | foto3 |
|---|---|---|---|
| sec1 (Ritz-Carlton Abama — ya con fotos reales) | v | v | h |
| sec2 | h | c | v |
| sec3 | v | h | v |
| sec4 | v | c | h |
| sec5 | h (16:9) | v | v |
| sec6 | c | v | h |
| sec7 | v | v | v |
| sec8 | c | c | h |

Nombre de archivo: `sec{N}-foto{N}-{h|v|c}.jpg`. Al recibir fotos nuevas sin
etiquetar: revisar las dimensiones reales (ancho vs. alto) para saber su
orientación natural y encajarlas en el slot que pida esa forma — no hace
falta que Mayurlin especifique cuál va dónde. Con criterio propio se decide
cuál foto es la "protagonista" (slot más grande) cuando hay varias del mismo
tipo de orientación, salvo que ella indique una preferencia.

Fotos con nombre propio (no numeradas): `hero-portada.jpg` (fondo de Inicio y
vista previa de "Inicio" en el menú), `sobre-mi-mayurlin.jpg`,
`sobre-mi-yerfran.jpg` (retratos en "Acerca de"). La vista previa de
"Proyectos y portafolio" sí sale de las galerías: `sec1-gal5-reflejo-v.jpg`.

**No están en este sistema, siguen en su hosting externo (WordPress) porque
ya son editables por ella sin tocar código:** la foto de pareja de "Acerca
de" (`COUPLE_PHOTO` en `data/media.ts`) y la textura decorativa de fondo del
Hero (URL de higgs.ai en `HeroSection.tsx`).

Las 8 secciones ya tienen sus 3 fotos reales (`photos` en `data/hotels.ts`).

### Página de portafolio de cada hotel (`HotelDetail.tsx`)

Al hacer clic en una foto de una sección se abre la página de portafolio de
ese hotel — una foto de portada a pantalla completa (`coverImage`) más una
galería narrativa más larga, tipo recorrido por las instalaciones (fachada,
habitación, amenidades, spa, restaurante...), **distinta e independiente**
de las 3 fotos del teaser de Inicio.

- **`coverImage`** (portada): cuando Mayurlin manda un lote de fotos y dice
  que una es "la portada", esa va aquí, sin recortar — la foto original
  completa, dejando que el CSS (`object-cover`) la recorte de forma
  responsive según el viewport (portada vertical en móvil, ancha en
  escritorio). Nunca forzar un aspect-ratio fijo en esta imagen.
- **`galleryPhotos`** (array en `HotelStory`, opcional, cae a `photos` si no
  existe): TODAS las fotos reales del hotel que no sean la portada — tanto
  las del lote original de 3 (teaser) como cualquier lote posterior — en un
  orden que cuente una historia coherente (ver regla de cronología abajo).
  Nombre de archivo: `sec{N}-gal{NN}-{tema}-{h|v|c}.jpg` (NN con cero a la
  izquierda si hay 10+, ej. `sec2-gal01-aerea-h.jpg`).
- **Layout por hotel**: `HotelDetail.tsx` tiene un array `GALLERY_LAYOUTS`
  con un esquema visual (tamaños, proporciones, bleed vs. contenido,
  offsets) por cada `layoutVariant` (0-7, el mismo número que ya usa cada
  hotel para su bloque de Inicio) — cada hotel debe verse claramente
  distinto de los demás, nunca la misma plantilla reordenada. Al recibir
  fotos nuevas para la galería de un hotel, ajustar su variante en
  `GALLERY_LAYOUTS` a la cantidad real de fotos y sus orientaciones (no
  forzar una foto vertical importante dentro de un recuadro horizontal
  angosto solo por mantener el layout genérico).
- **Orden cronológico obligatorio**: pedido explícito de Mayurlin — la
  galería debe sentirse como pasear por las instalaciones. Ejemplo de su
  propia secuencia: fachada → habitación → desayuno → spa → cena. Nunca
  agrupar por casualidad (p. ej. spa justo después de la cena sin razón).

## El bloque de vídeo: seis rondas, y dónde está cada versión

**El historial completo, porque la sección se rehízo entera seis veces.**

1. Vídeo horizontal a sangre completa en un bloque pegajoso, y encima cuatro
   tarjetas verticales que se desplegaban al bajar. **Tapaban el vídeo.**
2. Se separaron en dos secciones. Ahí se vio que las cuatro tarjetas
   verticales **no tenían nada dentro**: caja de color, círculo de play y la
   placa del nombre. Contraste con el fondo: **1,33:1**.
3. Se les metió el vídeo real y un tratamiento de "sala de proyección".
   *"No me cierra para nada."*
4. **Opción C** — los verticales como cuarto carrusel hermano, en marfil.
   *"Está mejor que antes pero no me cierra aún."*
5. **Opción D** — las siete piezas en UNA galería. *"Me gusta, es más
   elegante"*, con un fallo que ella detectó: *"hay que desplazarse por todos
   los vídeos para poder ver una pieza u otra"*, y el marco pegaba un salto de
   alto en cada cambio de formato.
6. **Lo que está publicado** — la misma galería, pero **una por formato**.

**`components/PiezasVerticales.tsx` (la C) SIGUE EN EL REPOSITORIO sin usar, a
propósito.** No borrarlo.

### `GaleriaPiezas` es un componente PORTÁTIL, y eso es lo importante

Lleva **su propia cabecera y su propio fondo**, y recibe las piezas por
`piezas`. Mover una galería a otro punto de la página es mover una línea en
`HomeMain`. Está hecho así porque Mayurlin quiere repartir más vídeo por la web
y todavía no ha decidido dónde.

`alterno` cambia el marfil (`#f5f3ed` en vez de `#fbfaf6`) para que dos
galerías seguidas no se lean como un solo bloque interminable.

**El tamaño sale de DOS topes, no de uno.** Primero se probó con el marco a
alto fijo y la pieza a `h-full` con su proporción: en móvil el horizontal salía
de **960 px de ancho sobre una pantalla de 390** y se desbordaba. Con
`width: min(100%, calc(var(--alto) * proporción))` el ancho nunca pasa del
contenedor y el alto nunca pasa de `--alto`. Medido: horizontal 342x192 en
móvil y 1056x594 en escritorio; vertical 294x523 y 365x648.

**La regla de piezas no son puntos**: son marcas de distinto ancho según el
formato. Con una galería por formato ya no mezcla anchos, pero el código se
queda: si algún día vuelven a convivir, sigue funcionando.

**El `tipo` de cada pieza NO repite el formato.** Decía "Restaurante · Pieza
vertical" y con una galería por formato eso ya lo dice la cabecera; además
partía en dos líneas y empujaba las flechas.

### Proporción foto/vídeo en Inicio — resuelta

Mayurlin planteó el problema de fondo: *"vendemos contenido audiovisual para
hoteles... y le estamos dando más protagonismo en la web a las fotos que a los
vídeos"*. Tenía razón y era cuantificable: **12 huecos de foto contra 2 de
vídeo**. Se resolvió con dos cambios a la vez:

1. **La pieza de cada hotel vive en su propio mosaico de la vitrina**, en el
   hueco cuya forma es la suya. Ver `HUECO_VIDEO` y `ANCHO_VIDEO` en
   `HotelSectionBlock.tsx`. La proporción pasa a **9 fotos contra 5 vídeos**
   sin mover una sola sección de sitio.
2. **La galería de piezas verticales baja entre `WhyUs` y `WaysToWork`**
   (`VideoVerticalesInicio`), así el vídeo queda repartido por la página en
   vez de concentrado en un solo punto.

**Reglas que salieron de ahí y no se pueden saltar:**

- **El hueco del vídeo va SIEMPRE por encima de las fotos** (`z-[25]`, por
  debajo de la ficha en `z-30`). Era el fallo exacto que vio ella: en Binidufà
  la foto cuadrada le pasaba por delante y en GPRO lo tapaba entera la de la
  maleta.
- **Las clases de ancho son literales, nunca calculadas.** Tailwind genera las
  clases leyendo el código fuente; una clase compuesta en tiempo de ejecución
  no existe en el CSS. Medido en la primera versión: el marco del vídeo salía
  de **0 px de ancho en móvil** y correcto en escritorio, porque sus `md:` sí
  coincidían por casualidad con clases que ya existían en otra variante.
- **El vídeo se monta al acercarse, no al cargar** (600 px antes de entrar en
  pantalla, y no se vuelve a desmontar). Con tres hoteles con pieza serían
  cinco reproductores descargando a la vez al abrir Inicio. Medido: **2
  iframes al abrir**, 5 tras recorrer la página.
- **La foto que sale del mosaico tiene que seguir viéndose en la galería de
  ese hotel.** En Binidufà y GPRO ya estaba (el mosaico usaba otro recorte del
  mismo plano); a Abama hubo que meterle la cabaña de yoga en `galleryPhotos`,
  entre la piscina y el spa, y correr un hueco la cola de su variante de
  `GALLERY_LAYOUTS` para que cada foto conservara su proporción real.

## La galería de vídeos son DOS secciones, no una

Durante mucho tiempo el vídeo horizontal y los cuatro verticales compartían un
solo bloque pegajoso de 160vh: el vídeo debajo y las tarjetas desplegándose
ENCIMA al cruzar el umbral. Mayurlin lo describió exacto: *"tan pronto haces
más de un scroll, automáticamente saltan estos vídeos verticales y te impide
la visualización del vídeo horizontal"*. Ahora son dos secciones seguidas.

**Sección 1 — el horizontal.** En móvil es una banda 16:9 **pegada al titular**
(antes iba centrada en una pantalla completa, así que había ~300 px de negro
entre el texto y el vídeo, y la tira caía tan abajo que hacía falta otro scroll
para encontrarla). En escritorio llena la pantalla, como siempre. La tira va en
flujo justo debajo del vídeo en móvil y flotando sobre él en escritorio.

**Sección 2 — los cuatro verticales.** Misma distribución
(`DESKTOP_POSITIONS` / `MOBILE_POSITIONS`), mismo despliegue con muelle y
desenfoque de movimiento, en su propio espacio. **El fondo es la misma foto que
respalda al vídeo** (`BG_PLACEHOLDER`), desenfocada 16 px y con el velo negro
al 45%: se lee como continuación del bloque anterior sin cargar un segundo
reproductor, que serían dos descargas y dos audios sonando a la vez.


### El velo de "Acerca de": plano, y no es decorativo

La foto de pareja llevaba tres capas: `grayscale contrast-110` sobre la imagen,
un velo plano del 60% y, encima, un degradado vertical que sumaba **34% arriba
y 30% abajo**. Mayurlin vio ese tercero -- *"se nota en los bordes más oscuro,
en el centro un poco más claro"* -- y se quitó. Queda el 60% plano y uniforme.

**El 60% se queda y hay que defenderlo si vuelve a salir.** La foto es a
contraluz, contra el sol: justo donde cae el titular, el cielo es casi blanco.
Medido sobre los glifos:

| | titular | párrafo |
|---|---|---|
| sin ningún velo | **1,12:1** | **1,04:1** |
| 45% plano | 3,20 | 3,03 |
| 52% plano | 3,91 | 3,68 |
| **60% plano (el que va)** | **4,97** | **4,73** |
| 60% + el degradado (antes) | 6,12 | 5,01 |

El mínimo legible son 4,5:1. Si algún día hay que aclarar más esa sección, el
camino es **otra foto**, no menos velo.

### La tira: tres ranuras, y por qué el "barrido raro" no era la opacidad

Primero se intentó dejando las cuatro miniaturas montadas y poniendo a 0 la
opacidad de las que estuvieran a distancia 2. **No bastó, y el motivo importa.**
Con cuatro vídeos, al pasar de uno al siguiente la miniatura que estaba a -1
pasaba a +2: **viajaba de un extremo al otro cruzando por el medio**, por
detrás de la central, en los mismos 500 ms. Eso es lo que Mayurlin describía
como *"pasa dos a un lado y uno al otro... hace una cosa rarísima"*.

Ahora sólo existen **tres nodos** (`RANURAS = [-1, 0, 1]`), montados y
desmontados con `AnimatePresence`. Al cambiar de vídeo la central se convierte
en lateral (un salto de ranura), la lateral de ese lado sale por su borde y
entra una nueva por el otro. **Ninguna cruza el centro nunca.** Verificado
muestreando la transición a 60, 150, 260, 420 y 700 ms: la que sale se queda
clavada en su x mientras baja de 0,5 a 0, y la que entra aparece fuera del
borde.

**Y la posición ya no se anima con `left`.** Animar `left` obliga al navegador
a recalcular la maquetación en cada fotograma — ésos eran los trompicones. Va
en `x` (píxeles, `transform`, tarjeta gráfica) con **muelle**, no con una curva
fija de 500 ms: un muelle tiene aceleración y frenada propias, que es lo que
ella pedía con "orgánico". Hay dos cajas a propósito: la de fuera centra con
CSS estático (`left-1/2 -translate-x-1/2`) y la de dentro anima; si el centrado
viviera en la animación, Framer reescribiría el `transform` entero.

Lleva **desenfoque de movimiento**: sube al arrancar y baja al llegar, igual
que en las tarjetas verticales.

**Sin borde.** La central llevaba `ring-1 ring-white/45` y Mayurlin pidió
quitarlo: *"no quiero que tenga ningún borde, por muy pequeño que sea"*. La
sombra se queda — eso es profundidad, no un filo.

### TRAMPA: Framer y Tailwind escriben los dos `transform`

Esto rompió la tira entera y se publicó así. Merece la pena leerlo antes de
animar cualquier cosa que además esté centrada.

Las clases `-translate-x-1/2 -translate-y-1/2` de Tailwind y las props `x` /
`scale` de Framer acaban las dos en la propiedad `transform`. Framer la escribe
**en línea**, así que **se lleva por delante el centrado**. Puestas en el mismo
elemento, las miniaturas dejaron de estar centradas: colgaban del punto central
hacia abajo y hacia la derecha, se salían de la pista y tapaban el nombre del
hotel.

La solución es repartirlo en dos cajas, y **la de fuera es la que anima**:

```
<motion.div className="pointer-events-none absolute inset-0"  ← anima x/scale
  <div className="absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2">
    <button className="pointer-events-auto aspect-video h-full">
```

La capa exterior ocupa la pista entera, así que `scale` sobre ella equivale a
escalar la miniatura sobre su propio centro (está centrada en ella), y `x` no
se ve afectado por la escala porque en CSS el desplazamiento se aplica en el
sistema de coordenadas del padre. `pointer-events-none` en la capa y `auto` en
el botón, o las capas laterales, que cubren toda la pista, se tragarían los
clics de la central.

**Y la lección de proceso**: esa ronda se verificó midiendo las posiciones en
el DOM -- que salían correctas, porque el centro de cada caja sí estaba donde
tocaba -- pero sin abrir una sola captura. Los números no ven que la miniatura
se sale de su sitio. **Mirar la captura, siempre, aunque los números cuadren.**

### Los verticales entran al llegar, no un scroll después

`DEPLOY_ON` iba sobre `scrollYProgress` con `offset: ['start start','end end']`,
o sea 0 **cuando la sección ya estaba clavada arriba**: había que dar un scroll
de más, ya dentro, para que las tarjetas salieran, y hasta entonces sólo se
veía la foto borrosa. Ahora hay un **segundo medidor** sólo para la entrada,
con `offset: ['start end','start start']` — 0 cuando el borde superior asoma
por abajo, 1 cuando llega arriba del todo — y el umbral está en 0,6: la
sección ocupa ya el 60% de la pantalla, así que el despliegue termina justo
cuando el bloque acaba de clavarse. El aviso de salida sigue con el medidor
de siempre.

### `dvh`, no `svh`, en los bloques pegajosos

En móvil asomaba una banda oscura bajo los cuatro vídeos que desaparecía al
seguir bajando. `100svh` es la pantalla **más pequeña** — la que tiene la barra
del navegador a la vista — así que en cuanto la barra se escondía, el hueco de
más quedaba fuera del bloque pegajoso y asomaba el `bg-[#1a1918]` de la sección
por debajo. `100dvh` sigue a la pantalla real. En escritorio valen lo mismo.

**Debajo va el nombre del hotel**: serif de la casa, 10-11 px, versalitas,
blanco al 80% con una sombra corta — el vídeo de fondo puede tener un plano
claro justo ahí. Cambia con un fundido (`AnimatePresence mode="wait"`) para que
el relevo no dé un tirón, y vive en una caja de alto fijo (`h-4`) para que la
tira no dé un salto cuando el nombre pasa de una línea a otra.

## Vídeos incrustados (regla fija — aplicar a todos los que vengan)

**Pegar el código del proveedor y no tocarlo.** Todos los vídeos pasan por
`components/VideoNube.tsx`, que es literalmente el bloque que genera el
servicio: caja de proporción por `padding`, iframe absoluto al 100 %, los
atributos `allow` / `allowFullScreen` / `frameBorder` / `referrerPolicy` con
sus valores, y **la dirección intacta**.

**Ninguna de estas "mejoras" funcionó. Todas empeoraron la reproducción y
costaron una ronda cada una:**

| Lo que se añadió | Qué pasó |
|---|---|
| Montar el iframe con `IntersectionObserver` | Congelado en Chrome al volver a la sección |
| Sondear la dirección con `fetch` antes de cargarla | Deja una respuesta opaca en caché de esa misma dirección |
| `pointer-events-none` en el iframe | Si el reproductor pedía un toque, nadie podía dárselo |
| Dos copias, una `md:hidden` y otra `hidden md:block` | Ocultar un iframe no impide que cargue: dos descargas y dos reproductores |
| Añadir `playsinline=1` a la dirección | Dejó de reproducirse en **todos** los navegadores |

Todas se propusieron sin poder verificarlas: **desde este entorno no hay
acceso a dominios externos**, así que cualquier idea sobre el reproductor es
una hipótesis, no una comprobación. Si un vídeo no se reproduce, mirar el
panel del servicio antes que este código.

**Lo único que se hace desde fuera:**

- Si hace falta recortar (el fondo de Inicio va a sangre completa), se ensancha
  el **contenedor**, nunca se deforma el iframe. `177.78svh` de ancho hace que
  la caja 16:9 mida `100svh` de alto.
- `pointer-events-none`, si se necesita, va en ese contenedor y sólo en el
  fondo decorativo de Inicio, que se tragaría el gesto de desplazar.
- Una sola copia del iframe por página: elegir móvil o escritorio con
  `useEsMovil()`, no con `hidden`.
- El `title` es genérico, no el nombre del archivo (decía
  "MASTER 4K SDR — H265 10BIT" y se publicaba en el HTML).

## Auditoría externa (sept. 2026) — decisiones aplicadas

Mayurlin encargó una auditoría externa de 134 puntos y marcó 92 como "sí" en
un panel aparte. Casi todos ya estaban hechos: la auditoría revisó el commit
`688628d` del 13.09 y la web había avanzado desde entonces. Lo que se aplicó
en esta ronda, con el matiz que lleva cada uno:

- **Formulario sin rangos de precio** (pt 101). Antes preguntaba "menos de
  2.500€ / 2.500–5.000€ / …". Se cambió por "en qué punto está" (presupuesto
  aprobado / pendiente / explorando), que califica igual sin anclar la
  conversación en una cifra antes de saber qué necesita el hotel. El campo se
  llama `stage` en `InquiryFields`, ya no `budget`.
- **Sólo cuatro campos obligatorios** (pt 100): nombre, email, hotel o empresa
  y proyecto. Ubicación, servicio y punto del proyecto son opcionales.
- **"Hotel o empresa"**, no "Propiedad" (pt 97) — incluye a las agencias, que
  son quienes escriben en la mitad de los casos.
- **Foco encerrado en el cuadro del formulario** (pt 123): cada etiqueta va
  unida a su campo por `htmlFor`/`id`, el foco entra al abrir, el Tab da la
  vuelta dentro y vuelve al botón de origen al cerrar.
- **La intro no se reproduce en enlaces directos** a `/trabajo/:id` ni a
  `/proyecto/:slug` (pt 115). En Inicio y en las tres páginas del menú sigue
  saliendo en cada carga, como ella pidió. Quien llega por un enlace que ella
  manda a un hotel viene a ver ese trabajo, no seis segundos de vídeo.
- **Afirmaciones sin respaldo fuera** (pts 63, 65, 68, 40): "una de las
  piscinas más codiciadas del Egeo", "agua extraída del aire, energía del
  sol", "cala privada", y las 800 ha pasaron a ser del conjunto Son Ermità +
  Binidufà, que es lo correcto.
- **Nada de cobertura en vivo como parte del servicio** (pts 88/127). Se
  borró de `caseStudies.ts` y se eliminó `components/ProductionScope.tsx`,
  que era código muerto y llevaba la promesa de "mínimo tres stories diarias".
- **El titular de caso dice de qué va el rodaje** (pts 28/33/39). Ojo con el
  pt 33: la auditoría proponía "GPRO Valparaíso: tres producciones, una
  relación que continúa", y eso choca con su regla de que el caso cuenta el
  TRABAJO, nunca el trato. Quedó "tres producciones en la misma propiedad".
- **`VITE_BASE` por defecto** (pt 121): `vite.config.ts` apuntaba a
  `/New-Portafolio/`, del repositorio viejo. Compilar a mano sin la variable
  daba un sitio con todas las rutas rotas. Ahora por defecto vale
  `/New-Portafolio-2.0/`, igual que `deploy.yml`.

Pendientes porque hacen falta datos que sólo tiene ella: pt 35 (si los cinco
días de GPRO son por rodaje o en total), pt 36 (galería publicada / total
entregado / usos autorizados) y pt 106 (si el plazo de "dos a tres semanas"
es real).

## El recorrido: volver deja al visitante donde estaba

`src/lib/recorrido.ts` + el efecto de restauración en `App.tsx`. Pedido de
Mayurlin: "entro en Proyectos, bajo hasta GPRO, le doy a Ver galería, y al
volver me manda a Inicio. Aquí se rompe el flujo."

Tres piezas, y las tres tienen trampa:

1. **El botón Volver mira el historial.** Antes era `navigate('/')` a secas.
   Ahora retrocede de verdad si hay algo detrás (`history.state.idx > 0`), y
   si se entró por un enlace directo lleva a Proyectos señalando ese hotel.
2. **La posición se anota de forma CONTINUA, no al salir.** La limpieza de un
   efecto corre en la fase pasiva, después de que el efecto de layout de la
   pantalla nueva ya haya puesto el scroll a cero: guardando al salir se
   guardaba siempre un cero. Medido: 2.286 px de desvío.
3. **Se ancla al bloque, no al píxel.** En móvil la página de destino puede
   crecer mientras el visitante está fuera (fotos que terminan de cargar) y
   entonces el píxel guardado ya no cae en el mismo sitio. `navigate(-1)` no
   admite llevar datos, así que el bloque al que volver se deja apuntado en
   el módulo (`pedirAncla`) y la restauración recalcula el destino a cada
   fotograma. Aterriza a 96 px del borde, justo bajo el navbar.

Verificado en móvil y escritorio, 8 de 8: Proyectos→galería→volver,
Proyectos→caso→volver, Inicio→galería→volver y enlace directo→volver.

Los bloques de hotel llevan `id="hotel-<id>"` en Inicio Y en Proyectos: sin
ese id no hay a dónde anclar.

## Rótulos laterales y caja de testimonios

- **Los rótulos laterales** (HOTEL / nombre del hotel) viven anclados al
  centro vertical de la pantalla, así que su observador usa `rootMargin:
  '-50% 0px -50% 0px'` — una franja de un píxel en el centro. Con el umbral
  del 2% que tenían antes seguían encendidos sobre los testimonios: la
  sección mide 7.235 px, el 2% son 145, y con 200 px asomando por abajo el
  observador decía que sí mientras el centro ya estaba fuera. **El botón
  flotante NO comparte esa lógica** y tiene su propio observador, porque ella
  pidió que apareciera antes, al llegar al final del bloque de vídeos.
- **La caja de testimonios** no lleva altura fija ni `min-h`: todas las
  tarjetas se apilan en la misma celda de una rejilla (las copias,
  invisibles, sólo miden) y la rejilla toma la altura de la más alta. Un
  `min-h` es un mínimo, no un tope, y las citas largas lo desbordaban: el
  marco saltaba 58 px en móvil, 202 en tableta y 44 en escritorio, moviendo
  el rótulo y la fila de puntos. Un número fijo por tramo se rompería al
  editar una cita. En las copias la foto se sustituye por un hueco de las
  mismas medidas, para no descargar ocho fotografías invisibles.
- **El orden de `TESTIMONIALS` es el orden que se ve**, y lo eligió ella:
  GPRO Valparaíso primero, Ritz-Carlton Abama segundo. No tocar esos dos.

## Varios vídeos horizontales: la tira permanente

Los cuatro vídeos viven en una tira SIEMPRE VISIBLE en la base del bloque de
vídeos de Inicio (`TiraVideos`, dentro de `VideoShowcase.tsx`), alimentada por
`data/videos.ts`.

Primero se hizo como una ventana emergente con un botón, y Mayurlin lo
rechazó: "ir a un botón para abrir una ventana para reproducir otro vídeo
entorpecería el flujo. La idea es que estén los cuatro directamente ahí".

- **Efecto de profundidad**, el mismo de la ventana de propiedades: el del
  centro nítido -- que es el que suena de fondo -- y los de al lado pequeños,
  apagados y desenfocados.
- **Ocupa el 15% del alto de la pantalla como máximo** (`ALTO_TIRA_SVH`), tope
  que puso ella para tapar lo menos posible del vídeo de detrás. Centrada.
- **NINGUNA miniatura es un reproductor**: son fotos de portada. El único
  vídeo de la sección es el del fondo, y cambia al elegir otro (`key={src}`
  fuerza el remontaje).
- **La tira pasa sola cada 15 s** y se para en cuanto se toca: misma regla que
  "El proceso" en Acerca de. 15 y no 5 porque cambiar de vídeo recarga el
  reproductor.
- **La separación se calcula, no se fija** (media central + media lateral +
  4% de aire, sobre el ancho real, con `ResizeObserver`). Con un 34% fijo, en
  móvil las laterales se montaban 61 px sobre la central.
- **"Ver los hoteles" se fue a la derecha y sin cristal**: el centro de abajo
  es de la tira, y dos cajas de cristal seguidas competían.
- **La portada TIENE que ser de ese hotel**, y el número del prefijo NO sigue
  el orden de la página: Abama `sec1`, Binidufà `sec2`, Deltapark `sec3`,
  Honeymoon `sec4`, GPRO `sec5`, Espléndido `sec6`, InterContinental `sec7`,
  Welmoon `sec8`, District Hive `sec9`. Dos entradas llevaban la portada de
  otro hotel por dar por hecho que sí lo seguía.
- **Reales: Abama, Vestige Collection Binidufà y GPRO Valparaíso.** Sigue
  PROVISIONAL sólo InterContinental, apuntando al vídeo de Abama. Antes de
  migrar al dominio propio hay que cambiarle el `src`: publicarlo así pondría
  el vídeo de Abama bajo el nombre de otro hotel.
- **El de GPRO es una MUESTRA en baja resolución** ("WEB CLIENTES HORIZONTAL
  (MUESTRA) LOW RESOLU"), que choca con su regla de máxima calidad siempre.
  Conviene cambiarlo por el definitivo antes de migrar.

## El subrayado de "Iniciar un proyecto"

En la caja de cristal del Hero hay dos acciones con el mismo peso. Para
destacar la principal SIN meter otro botón fuera de la caja -- eso rompería el
bloque -- lleva una línea de 1 px, blanca al 70%, que se dibuja sola de
izquierda a derecha en 1,5 s tras una espera de 1,2 s, y se queda. Medido:
crece de 14 a 132 px, el ancho exacto del texto. Idea de Mayurlin.

## La línea fina sobre el vídeo: no es del sitio

Medido en Inicio y en la galería, móvil y escritorio: la caja del vídeo es
16:9 EXACTA (1600,02 × 900, proporción 1,7778) y el iframe la cubre entera --
hueco de 0 px en los cuatro bordes, a 1x y a 2x, sin bordes y sin fondo
asomando. Mayurlin comprobó además que el archivo no lleva esa franja. O sea
que la pinta el reproductor DENTRO del iframe, y desde fuera de un marco de
otro dominio no se puede ni mirar ni corregir.

**Solución: se tapa.** `VideoNube` tiene un `recorte` (5 px por defecto, una
sola constante para todos los vídeos de la web): el iframe crece esos píxeles
EN PROPORCIÓN -- el horizontal sale del vertical por 16/9, así que la imagen
no se deforma -- y el contenedor recorta el sobrante. Es lo que hace cualquier
reproductor de televisión. A 900 px de alto, 5 px son un 0,9%: invisible. Si
algún día el servicio deja de pintar esa línea, se pone a 0 y se acabó.

## La página de Proyectos usa el mosaico de Inicio

Un solo lenguaje visual en toda la web. Antes esta página enseñaba lo mismo de
dos maneras: los casos como foto horizontal a sangre completa, y las galerías
como foto al 80% con la ficha al lado. Ninguna de las dos era la de Inicio, y
Mayurlin lo dijo claro: "si ya probamos un diseño que funciona y es más
elegante, ¿por qué no lo replicamos? Esta página está desfasada de lo que
hemos construido".

- Los **nueve** hoteles seguidos, cada uno con `HotelSectionBlock` -- el mismo
  mosaico de tres fotos de Inicio -- y debajo su ficha: nombre, la primera
  frase de su descripción y las salidas.
- **Lo que distingue un proyecto de una galería ya no es el diseño sino los
  enlaces**: "Ver proyecto" sólo aparece donde hay caso documentado (hoy 3 de
  9). Se quitaron los dos rótulos de sección, que ya no separaban nada.
- **El id para anclar lo pone `HotelSectionBlock`**, no quien lo usa. Ponerlo
  también fuera dejaba dos elementos con el mismo id y el botón Volver
  aterrizaba en el primero que encontrara.
- La página pasa a medir unos 17.000 px en escritorio. Es el coste, y ella lo
  aceptó: "ocupa un poco más de espacio, pero la diferencia visual es grande".
- `caseSectionLabel`, `caseSectionLine`, `gallerySectionLabel` y
  `gallerySectionLine` siguen en `content.json` sin usarse, por si algún día
  se vuelve a separar.

### La ficha va DENTRO del mosaico (página de Proyectos)

Pedido de Mayurlin: "en un solo bloque estén las fotos y la descripción, el
texto, el botón de ver galería, todo" y "hay mucho espacio vacío donde se
podría aprovechar para colocar todo el texto, el nombre, el rodaje, todo".

Antes se intentó sacando el texto a una columna a la derecha y encogiendo el
mosaico a `52svh`. **Lo rechazó**: las fotos quedaron pequeñas y dispersas.
La diferencia está en dónde va el texto: no en una columna nueva al lado del
mosaico, sino en el hueco que el propio mosaico ya deja vacío. Las fotos no
se tocan — siguen exactamente al tamaño de Inicio.

`HotelSectionBlock` acepta `ficha` (un nodo). Inicio no la pasa y no cambia
nada allí: medido, sus bloques siguen midiendo 653 px en móvil y 1.544 en
escritorio, sin un solo estilo en línea.

- **`HUECO_FICHA`** tiene el hueco de cada variante (0-7) en % del lienzo.
  Cada variante lo deja en un sitio distinto: la 0 y la 2 abajo a la
  izquierda, la 6 en la banda derecha, la 4 (la más llena) sólo en la esquina
  inferior derecha. **Si se cambia una variante hay que volver a mirar su
  hueco.**
- **A partir de 1.280 px** la ficha va dentro; por debajo va debajo de la
  última foto. A 1.024 px la columna de la variante 6 mediría 250 px y el
  nombre saldría partido en cuatro líneas.
- **El alto del bloque se mide, no se fija.** El lienzo mide siempre lo mismo
  pero las fotos no llegan siempre igual de abajo (de 75,1% a 100,2% del
  lienzo): de ahí salían a la vez los dos defectos que ella señaló, fotos
  encima del texto en unos hoteles y 330 px de nada en otros. Es un `height`,
  no un margen negativo: el bloque lleva `overflow-hidden` y con margen la
  ficha que sobresalía se recortaba (a GPRO le faltaban los dos enlaces).
- **Se mide con la cadena de `offsetTop`, no con `getBoundingClientRect`**:
  los rectángulos incluyen el parallax y la medida cambiaría según dónde
  estuviera el scroll.

**El recorrido del parallax va con el tamaño del mosaico.** Los 80/120/50 px
de `yPhoto1/2/3` están pensados para un lienzo de 1.280 px; en móvil el
lienzo mide 358, así que esos mismos píxeles son un CUARTO de su alto. Medido,
las fotos llegan a bajar 78, 117 y 49 px justo mientras se está leyendo la
ficha — casi todo su recorrido — y por eso dejar el hueco por donde acaba la
foto en reposo no basta. Escalado (entre el 30% y el 100%), el aire hasta la
ficha sale parejo: de 41 a 71 px en los nueve, cuando antes iba de -54 a +119.
Sólo donde hay ficha; Inicio conserva su recorrido.

**El lienzo es proporcional (`md:aspect-[1280/1320]`) cuando lleva ficha**, no
de alto fijo. Con alto fijo, el ancho de las fotos y el alto del lienzo dejan
de ir juntos en cuanto la pantalla no mide 1.440: a 1.920 las fotos se hacían
un 19% más altas sin que el lienzo creciera y se salían por abajo (medido,
hasta 204 px encima de la ficha), y a 1.280 encogían y el mosaico se abría.

**Resultado medido** (antes → después), con cero solapes en 390, 1.280, 1.440
y 1.920, y el botón Volver acertando en 9 de 9:

| | antes | después |
|---|---|---|
| móvil, por hotel | 0,97-0,99 pantallas | 0,85-1,02 |
| móvil, aire foto→texto | de -54 a +119 px | de 41 a 71 px |
| escritorio, por hotel | 1,92-1,94 pantallas | 1,30-1,65 |
| escritorio, hueco muerto | de 46 a 351 px | ninguno |
| página entera (1.440) | 19,1 pantallas | 14,9 |

**No llega a una pantalla exacta en escritorio**, y no por falta de ajuste: el
mosaico es casi cuadrado (1280/1320) y la pantalla de portátil es apaisada.
Para que un hotel entero cupiera en 900 px de alto, el mosaico tendría que
medir unos 785 px de ancho en una pantalla de 1.440 — dejaría de ocupar la
pantalla "horizontalmente", que es la otra mitad de lo que ella pidió. En
móvil sí se cumple.

### El hero de móvil: otra composición, no el de escritorio encogido

Mayurlin aprobó una referencia visual para móvil. **Escritorio no cambia** y hay
que dejarlo así: está comprobado que el titular sigue en y=303 a 768px y en
y=237 a 1.440, con los mismos cuerpos, los mismos cortes de línea y la misma
banda de cristal. Cualquier cambio compartido hay que medirlo contra eso.

**La estructura.** La sección ya no mide `h-[100svh]` en móvil: el área de la
foto tiene alto mínimo y crece con lo que lleva dentro, así que no hay nada que
recortar cuando el texto se agranda (probado al 150%: crece de 706 a 740 px y
sigue sin solapes ni scroll horizontal). Dentro van dos grupos separados por
`justify-between` -- rótulo + titular arriba, párrafo + enlace abajo -- en flujo,
no con coordenadas. El truco para no romper escritorio es que el área
fotográfica es una caja en flujo en móvil y `md:absolute md:inset-0` a partir de
md: así todo lo de dentro conserva las coordenadas que tenía colgando de la
sección.

**El encuadre y el color salen de MEDIR la referencia, no de mirarla.** La
primera versión se quedó lejos y ella lo dijo: "fíjate la interpretación del
color de la foto, la posición de la imagen, el tamaño del hero". Comparadas las
dos imágenes con números, las diferencias eran: proporción del área fotográfica
1,14 contra 1,47; brillo medio 74 contra 103; y en el tercio derecho, donde está
la figura, 83 contra 129.

- **La proporción es 1,466 de alto por 1 de ancho** (`.mt-hero-foto` en
  `index.css`). Ojo: hay que sumarle los 56 px de la cabecera, que va fija y
  tapa la parte de arriba de la foto. Sin sumarlos, lo que SE VE se queda en
  1,34 y la composición no cuadra.
- **El encuadre no sale de `object-cover`, sale de una cuenta.** La referencia
  es el recorte x 25-1475, y 160-2286 del archivo de 1800x2726 -- se encontró
  por correlación contra su imagen, probando ventanas. `object-cover` no
  permite pedir un recorte concreto, así que la imagen se coloca a mano:
  ancho 124,14%, izquierda -1,72%, arriba -7,53%, con `h-auto` y `max-w-none`.
- **EL COLOR YA NO LO PONE EL CÓDIGO: lo trae la foto.** Mayurlin mandó el
archivo graduado por ella -- en cálido, oscurecido y con su propio degradado --
y pidió usarlo tal cual. Así que en móvil NO hay `grayscale`, ni `brightness`,
ni `contrast`: cualquiera de los tres se llevaría por delante su trabajo. Y por
lo mismo, todas las sombras del código (los tres velos y las cinco
`text-shadow`) van al 50% de lo que estaban.

**EL ARCHIVO NUEVO CUESTA NITIDEZ, y hay que decirlo.** `hero-portada-movil-graduada.webp`
es la escena ENTERA en 2000x1416, y el encuadre del hero sólo usa 732 px de su
ancho. Un móvil de 440 px a 3x pide 1.320, así que hay que ampliar un 80%.
Medido (varianza del laplaciano a tamaño real): el detalle cae de 167 a 35. El
archivo vertical anterior daba 1.450 px para ese mismo encuadre y no ampliaba
nada. **Para tener su graduación SIN perder nitidez hace falta esa misma
graduación aplicada sobre el vertical (1800x2726), o un export del recorte más
grande.** Está pendiente de que ella lo mande.

**Los velos son tres y ninguno tapa la escena entera**: lateral izquierdo,
  una diagonal en la esquina inferior izquierda -- donde de verdad cae el
  párrafo, y así no apaga la grava de la derecha -- y un dedo en el borde de
  abajo.

**EL CONTRASTE NO LLEGA A LA NORMA, Y ES A PROPÓSITO.** Con la foto al brillo
que ella aprobó, el peor píxel deja el párrafo en 2,32:1 y el titular en
1,51:1, cuando WCAG AA pide 4,5 y 3. Las medianas sí van bien (3,7 y 9,0) y el
texto lleva sombra, así que en la práctica se lee. Su propia referencia está
peor: 1,63:1 bajo el párrafo. **Para cumplir la norma hay que oscurecer la
franja de abajo hasta el 50%, que es justo la versión que ella rechazó por
apagada.** Es una decisión suya, no un descuido: si vuelve a salir el tema, es
esto.

**El cuerpo del titular lo manda la figura.** El encargo pedía 34-40 px a 390.
Al medirlo con el encuadre nuevo la figura queda mucho más a la derecha, así
que ya caben 32 px sin tocarla. **Al medir esto hay que esconder el texto del
hero**: si no, el detector toma los propios glifos blancos por el vestido --
pasó, y daba 211 px de solape falso.

**Cuidado con `md:max-w-none` y compañía.** Poner una utilidad `md:` nueva
puede pisar una que ya estaba: `md:max-w-none` en el párrafo se llevó por
delante el `md:max-w-[34ch]` de escritorio, el bloque se acortó y el
`-translate-y-[52%]` bajó el titular 34 px. Se detectó porque escritorio se
mide antes y después; hay que seguir haciéndolo.

**Las cifras salen de la foto en móvil**: franja marfil plana debajo, tres
columnas a la izquierda con dos separadores finos y "CLIENTES RECURRENTES" en
dos líneas. Mismo marcado y mismo dato que en escritorio -- sólo cambian las
clases. Lo hace `.mt-hero-cifras` en `index.css`, que apaga el cristal por
debajo de 768px. **Ojo con el color**: `.mt-glass` declara `background` en
atajo, que deja el `background-color` en transparente, y esa hoja va DESPUÉS de
las utilidades de Tailwind; un `bg-[#fbfaf6]` no sobrevive. El marfil tiene que
ir dentro de esa misma regla. Pasó: la franja salía negra.

**Diferencias respecto a la referencia, a propósito:**
- El cuerpo del titular es menor que el 34-40 px pedido, por lo de la figura.
- El blanco y negro va sólo en móvil. En escritorio la foto sigue con
  `saturate(.84)`, que es lo que había; la escena es casi monocroma de por sí,
  así que apenas se distingue. Si se quiere unificar, es quitar `md:grayscale-0
  md:saturate-[.84]`.

### Las dos fotos del hero las encuadra ella, y no llevan ningún filtro

Mayurlin manda **dos archivos, uno por pantalla**, ya encuadrados y graduados
por ella. El código no recorta, no colorea y no oscurece: sólo llena la caja.

- `hero-portada.jpg` — escritorio. Original 5465x3869 (15 MB), publicado a
  2880 px (una caja de 1440 a 2x). 2,7 MB.
- `hero-movil.jpg` — móvil. Original 2176x3793 (6,3 MB), publicado a 1600 px
  (un móvil de 430 pt a 3x pide 1.290). 2,0 MB.

Los originales enteros viven en `/originales`, **fuera de `public/`** — si se
dejan dentro se publican en el sitio y son 21 MB que nadie descarga a propósito.
Al reducir: JPEG `quality=97, subsampling=0`. Se probó WebP q95 (1,1 MB, PSNR
43,5 frente a 46,1 del JPEG) y se descartó por la regla de máxima calidad.

**Instrucción literal de ella, y es una regla, no una preferencia:** *"no quiero
que le pongas filtros… no quiero que se vean diferentes, repeta al 100% todo.
solo agregale un degradado ligero a la izquierda donde esta el texto. pero
ligero. de un 15% para probar inicialmente"*.

Así que desaparecieron **todos**: el `saturate(.84)` de escritorio, los tres
velos de móvil (lateral, diagonal inferior y el dedo de abajo), los dos de
escritorio, el `bg-black/10` y las cinco `text-shadow` del texto. Queda una
sola capa, la misma en los dos tamaños:

```
linear-gradient(90deg, rgba(0,0,0,.15), transparent 55%)
```

**El recorte al llenar la caja** (ninguna de las dos tiene exactamente su
proporción) se tira hacia arriba, nunca hacia abajo: abajo está la grava sobre
la que cae el texto y, en escritorio, los pies de la figura.
`object-[50%_72%]` en móvil, `md:object-[50%_66%]`.

**EL TEXTO VUELVE AL BLANCO, Y ES UNA DECISIÓN DE DISEÑO, NO DE MEDIDA.**
Se probó el párrafo y el botón en tinta `#1a1918` y resolvía el contraste
(1,89 → 9,16:1), pero Mayurlin lo descartó: *"prefiero que esté todo el texto
en un solo color"*, con el titular en blanco justo encima. Lo que sostiene la
lectura ahora es **cuerpo**, no velo:

- párrafo móvil 15 → 16 px y `font-medium`
- párrafo escritorio 16 px → `clamp(20px, 1.6vw, 26px)`, a 30ch
- titular escritorio `clamp(48px, 6.5vw, 104px)` — 93,6 px a 1.440 — para que
  no compita con el párrafo, ya grande
- CTA móvil 11 → 12 px, subrayado a 1,5 px
- **una sola** `text-shadow` por texto, suave y ancha (`.38` y `.42`), no las
  cinco de antes

**La banda de cristal de escritorio SÍ se queda en tinta.** Es el único sitio
donde ella dijo que se lee mejor así, y ahí vive el CTA de escritorio.

**LA LEGIBILIDAD SE RESUELVE CON UNA ELIPSE, NO TOCANDO LA FOTO.** Mayurlin
aceptó la recomendación con una condición: *"no quiero que edites la foto,
sino que agregues un degradado al texto... tan sutil que no debe ser
perceptible a la vista"*, y marcó en negro dónde podía caer (la mitad inferior
izquierda, desde el titular hasta el CTA). Va en su propia capa encima, así
que el archivo sigue intacto. Dos capas:

```
linear-gradient(90deg, rgba(0,0,0,.15), transparent 55%),
radial-gradient(130% 66% at 16% 108%, rgba(0,0,0,.46), rgba(0,0,0,.28) 40%,
                rgba(0,0,0,.11) 68%, transparent 90%)      /* móvil     */
radial-gradient(95% 78% at 6% 112%,  …mismas paradas…)     /* escritorio */
```

**Lo que la hace invisible es el anclaje, no la opacidad.** La elipse se ancla
FUERA del encuadre (`at 16% 108%`, por debajo de la esquina) y tarda el 90% de
su radio en llegar a cero: no tiene borde y se lee como la sombra que el muro
ya proyecta. Un óvalo centrado sobre el párrafo, aunque fuese más flojo, se
vería como una mancha en mitad de la grava. Si hay que retocarlo, mover
opacidad; **no** mover el centro hacia dentro del encuadre.

Medido en el párrafo de móvil (mediana sobre los glifos), con la serie
completa que se probó:

| | móvil | escritorio |
|---|---|---|
| sin nada | 1,88:1 | 2,10:1 |
| al 34% | 2,59:1 | 3,03:1 |
| **al 46% (el que va)** | **2,99:1** | **3,56:1** |
| al 58% | 3,50:1 | 4,25:1 — ya se ve, descartado |

El enlace sube a 4,22:1. Las `text-shadow` bajan a `.26` y `.28` con radio de
20-22 px: más difusas, porque el degradado ya hace el trabajo. **4,5:1 no se
alcanza sin que el degradado se note; está hablado con ella y es su decisión.**

**LA FRANJA DE CIFRAS DE MÓVIL MIDE 87 px, NO 115.** *"Está robando mucho
protagonismo a la foto."* El relleno pasa de `py-7` (28/28) a `pt-[18px]
pb-[15px]` y la cifra de 30 a 27 px con `mb-1` en vez de `mb-1.5`. Los 18/15
no son un descuido: el `leading-none` de la cifra deja aire de ascendente
arriba, así que con relleno igual el bloque se veía bajo. Medido, el margen
real queda en 18,0 arriba y 17,7 abajo. La banda de escritorio no cambia:
sigue fija en 76 px y ella no se quejó de esa.

**LA FOTO DE MÓVIL: `w-[123%]` y `object-[50%_65%]`.** Los dos números van
juntos y cambiar uno obliga a revisar el otro. Bajar la foto un 2% (72 → 65 de
`object-position`) mete en la franja del titular la parte ANCHA de la falda,
así que el 118% que antes despejaba dejó de hacerlo y hubo que subir a 123%.
Regla práctica: si se mueve la foto en vertical, hay que volver a mirar el
cruce del titular con el vestido, porque la silueta no tiene el mismo ancho a
todas las alturas.

### El índice de hoteles es sólo una flecha, abajo a la derecha

Llevaba "Hoteles (9) ▲" centrado abajo, y en Proyectos eso cae justo encima
del nombre del hotel — lo único que hay que leer en ese punto. Mayurlin mandó
la referencia: la misma caja de cristal con **la flecha sola**, en la esquina
inferior derecha, flotando siempre para poder saltar a cualquier hotel (o
volver arriba) desde el final de la página.

`IndiceHoteles.tsx`: el botón es un cuadrado de 44x44 con el `▲`, el rótulo se
fue a `aria-label` (no se pierde para lectores de pantalla), el contenedor pasa
de `inset-x-0 items-center` a `right-5 items-end` (`md:right-8`), y el panel se
ancla con `right-0` y se limita a `min(20rem, 100vw - 2.5rem)` para no salirse
en móvil. Dentro sigue estando "Ir a un hotel", que es lo que el rótulo decía.

### La franja de cifras: el fondo no se anima, sólo su contenido

Al cargar en móvil aparecía **un bloque negro a pantalla completa** debajo de
la foto que luego se aclaraba hasta marfil. La caja entera llevaba el `rise`
(opacidad 0 → 1) y durante ese segundo se veía el `bg-[#1a1918]` de la sección
por detrás. En escritorio no se notaba porque ahí la banda flota sobre la
fotografía, no sobre el fondo de la sección.

El arreglo es mover el `motion` un nivel hacia dentro: la caja con el fondo es
un `div` normal y lo que anima es un `motion.div` (`md:h-full`) que envuelve la
rejilla. Verificado a 120, 260, 420, 700 y 1.200 ms: el marfil está desde el
primer fotograma (brillo medio 237) y lo que entra son las cifras.

### La calidad de la foto del hero: la graduación de ella sobre el recorte nítido

Mayurlin notó "una gran pérdida de calidad" en el hero de móvil, y tenía razón.
El archivo que ella graduó (`hero-portada-movil-graduada.webp`) es **la escena
entera en 2000x1416**, y el hero sólo usa una ventana de **732 px de ancho** de
ella. Un móvil de 440 pt a 3x pide 1.320 px: ampliación del 80%.

**La solución, y por qué la primera falló.** El origen vertical
(`hero-portada-movil.jpg`, 1800x2726) da 1.450 px para esa misma ventana, o sea
no amplía nada — pero no tiene su graduación. Hay que trasplantarla:

- **Primer intento (MAL): ajuste de tono por bloques** (gain/offset por bloque
  de 58 px, interpolado). El color quedó clavado, pero el gradiente medio bajó
  a **2,53** frente a **3,95** del original: forzar cada bloque a parecerse al
  de la versión *ampliada* aplana el detalle. Salió peor que el problema.
- **Lo que sí funciona: una curva GLOBAL por canal** (emparejado de histogramas,
  256 entradas) **+ una corrección de muy baja frecuencia** (diferencia entre
  las dos imágenes desenfocadas con sigma = lado/18) para su degradado y su
  oscurecido. Una tabla global es monótona: cambia el tono sin poder tocar el
  detalle local.

Resultado medido a 1.320 px, el tamaño real de pantalla:

| | gradiente medio | luz | sd | RGB |
|---|---|---|---|---|
| su archivo (antes) | 3,99 | 118,9 | 58,0 | 129/116/109 |
| nítida (ahora) | **6,33** | 118,9 | 58,0 | 129/116/109 |

Mismo tono, mismo contraste, mismo color, **1,6x más detalle**. En pantalla a
2x el gradiente pasa de 7,56 a 9,77 y la correlación de encuadre entre antes y
después es 0,9971 — es la misma composición aprobada, sólo más nítida. Pesa
695 KB frente a 442 KB: aceptado, su regla es máxima calidad siempre.

**La ventana hay que medirla en el navegador, no deducirla.** El primer recorte
salió de la correlación entre los dos archivos y quedó 112 px corto por abajo.
Lo correcto es leer la geometría real de la versión publicada: la `<img>` se
dibujaba a 1065,5x754,4 con x=-285,5 e y=-42,1 en una caja de 390x627,7, lo que
da la ventana `(536, 79) - (1268, 1257)` en su archivo, y por la escala medida
entre ambos (1,981) la ventana `(25, 174) - (1475, 2507)` en el vertical.

Como el archivo nuevo **ya es** la ventana, en `HeroSection.tsx` desaparecieron
los tres porcentajes calculados a mano (`-73,22% / -6,71% / 273,22%`) y ahora
basta `absolute inset-0 h-full w-full object-cover`. Su proporción (0,6215)
coincide con la de la caja (0,6213).

**Si vuelve a mandar una foto para el hero**, lo que evita todo esto es pedirle
un export **ya recortado a la ventana, en vertical, de 1.400x2.100 px o más**.
El chat recomprime a WebP y limita a ~2.000 px **de ancho** (ver "Limitaciones
del entorno"), así que un vertical de ese tamaño llega intacto y gasta todos
sus píxeles en la parte que el hero enseña — no en una escena de la que se usa
un tercio.

### Dónde va el vídeo horizontal dentro de la galería de su hotel

Cada vídeo horizontal se mete TAMBIÉN en la galería del hotel al que
pertenece, con `galleryEmbed` en `data/hotels.ts`. El sitio exacto no lo elige
el dato: lo fija a mano la variante correspondiente de `GALLERY_LAYOUTS` en
`HotelDetail.tsx`, porque depende de qué fotos tiene alrededor.

**Las tres reglas que puso Mayurlin**, y hay que comprobarlas en móvil Y en
escritorio, que no siempre dan el mismo resultado:

1. **No de primero.** Tiene que haber algo antes.
2. **Entre los primeros, y nunca de la mitad para abajo** — "debe tener
   protagonismo". Medido, los tres caen entre el 26% y el 41% del alto de la
   página.
3. **No pegado a una foto en formato horizontal.** El vídeo es una banda 16:9
   a sangre; con otra horizontal encima o debajo se leen como dos bandas
   iguales. Sus dos vecinas tienen que ser verticales.
4. Y con continuidad lógica: el vídeo es una pieza de la propiedad entera, así
   que cae bien donde el recorrido cambia de capítulo.

**Cuidado con las filas de dos columnas.** Es la trampa de esto: en móvil una
fila `md:flex-row` se apila, así que meter el vídeo dentro de la fila lo deja
en el sitio correcto; pero en ESCRITORIO la fila son dos columnas y el vídeo
acaba DESPUÉS de las dos fotos, que puede ser justo encima de una horizontal.
Le pasaba a Ritz-Carlton: en móvil cumplía y en escritorio caía pegado a la
foto de la playa. La solución que se usa ahora en los tres es sacar esas dos
fotos de la fila y centrarlas por separado, con el vídeo entre medias — así el
orden es el mismo en los dos tamaños y sobra la doble copia del vídeo (y con
ella el `useEsMovil` que hacía falta para elegir).

| Hotel | Variante | Va entre | Posición medida |
|---|---|---|---|
| Ritz-Carlton Abama | 0 | el paseo y la habitación | 4ª de 10, al 35-41% |
| Vestige, Binidufà | 1 | el salón y la vasija | 5ª de 12, al 38-39% |
| GPRO Valparaíso | 4 | el cartel del jardín y la habitación | 4ª de 15, al 26-27% |

En GPRO no hizo falta separar nada: la foto del cartel ya iba sola.

### El índice flotante de hoteles vive en Proyectos, no en Inicio

`components/IndiceHoteles.tsx`. Era un bloque dentro de `HomeMain`; se sacó a
su propio archivo al mudarlo, para que no queden dos copias que se separen.

Mayurlin: "me hace hacer dos pasos para algo tan simple como ir directamente a
la galería... ya que la galería está unificada con los proyectos y galerías".
En Inicio era un atajo hacia otra página; en Proyectos es el índice de lo que
ya estás mirando.

- **Los nueve, en el orden de la página.** El componente no reordena: recibe la
  lista ya ordenada. Si la página los pinta en otro orden, saltar de uno a otro
  se vuelve adivinar.
- **Sin el pie "Ver todas las propiedades"**, que en Inicio abría `WorkModal`.
  Ahí mandaría a donde ya estás.
- **`WorkModal` (el carrusel 3D) se quedó SIN PUERTA DE ENTRADA.** Ese pie era
  su único disparador. Se deja montado en `App.tsx`, no borrado, porque ella
  dijo que no sabe si lo querrá para otra sección. Si se decide que no, hay que
  quitar el componente, su estado y el `openWork` que ahora no llama nadie.
- **Posición: centrado abajo (`fixed bottom-8`), igual que en Inicio.** Es lo
  que ella pidió para probarlo — "ponlo por ahora en el medio... y vemos qué tal
  queda". **Medido: la píldora tapa la ficha del hotel 37 px en móvil y 36 en
  escritorio** (peor caso, Ritz-Carlton Abama), que es justo lo que le molestaba
  en Inicio. Pendiente de que ella decida en la siguiente ronda.
- Se ve mientras haya CUALQUIER bloque de hotel en pantalla, y marca el que
  ocupa el centro exacto. Son dos observadores a propósito: en un bloque de
  1.400 px, "tocar la pantalla" y "ser el que miras" no significan lo mismo.

### El CTA del hero en móvil, en prueba con la línea

`HeroSection.tsx`. Era un botón relleno (`bg-[#f5f3ed]`); ahora lleva el mismo
subrayado que se dibuja solo de izquierda a derecha que el CTA de la banda de
cristal en escritorio — mismo tiempo (1,5 s), mismo retardo (1,2 s) y misma
curva, para que sea el mismo gesto y no dos parecidos.

Es una prueba de ella: "quiero probar si con la línea es muy sutil y si no
funciona visualmente, pues nada, rehacemos y volvemos al botón". **Para
revertir**: `bg-[#f5f3ed] px-6 py-3 text-[11px] ... font-semibold
text-[#1a1918]`, sin el `motion.span`.

Legibilidad medida (390x844, sobre el píxel más claro del fondo real, con el
texto escondido para no medir los propios glifos): el CTA cae dentro del
degradado inferior, no sobre la grava, así que el fondo más claro bajo él es
rgb(74,74,74). **Texto blanco 8,86:1 y línea blanca al 80% 7,29:1** — WCAG AA
pide 4,5 y 3,0. No es un problema de contraste; si no convence, será de gusto.

**El bloque de vídeos mide 160vh en móvil y 220vh en escritorio.** En móvil el
vídeo horizontal es una banda 16:9 de 219 px en una pantalla de 844, así que
con 220vh había que recorrer 1.857 px casi todos negros. Y la tira de vídeos
va pegada bajo el vídeo en móvil, no al fondo de la pantalla. El negro que
queda alrededor es geometría pura: un 16:9 en pantalla vertical. Quitarlo
exigiría recortar el vídeo, y ella pidió verlo entero.

**El menú dice "Proyectos y portafolio"**, igual que el titular de la página,
para que un hotel sepa dónde están las fotos. El indicador pequeño de la
esquina superior sigue diciendo sólo "Proyectos": ahí el espacio es escaso y
es un rótulo de estado, no navegación.

## Decisiones de diseño ya tomadas (no revertir sin que ella lo pida)

- Logo actual: sin efecto de sombra/resplandor (el anterior sí lo tenía, ella
  lo pidió quitar). Tamaño reducido en tres rondas: -15%, luego -18%, y
  ahora otro -12% porque pesaba demasiado al lado del rótulo de página y del
  icono de menú. **Actual: 22px móvil / 26px escritorio en navbar, 22px en
  footer.** Son tres sitios en dos archivos (`Navbar.tsx` dos veces --
  la barra y el menú abierto -- y `Footer.tsx`): hay que tocar los tres.
- Foto del Hero (`hero-portada.jpg`): lleva un tinte plano negro al 10%
  (`bg-black/10`) sobre toda la foto para que el titular blanco tenga más
  contraste — pedido explícito, revierte la decisión anterior de "sin
  ningún filtro". Además el degradado inferior (detrás del texto del pie)
  y la franja blanca del Navbar (logo/menú) para legibilidad, ver
  `HeroSection.tsx`. Esta misma foto es la vista previa de "Inicio" en el
  menú, que es justo lo que se va a encontrar al pulsar.
- Titular del Hero: centrado en ambos ejes, blanco puro (`text-white`),
  copy elegido por Mayurlin entre 4 opciones que generé con la skill de
  copywriting: "Contamos lo que se siente, no solo lo que se ve."
- Video de intro: se reproduce en **cada** carga/recarga (no solo la primera
  vez) — pedido explícito de ella, acepta el costo de carga adicional.
  Cache-busting por montaje (`?v=timestamp`) para evitar reconstrucción
  corrupta desde caché del navegador en recargas rápidas. **Sin contador de
  porcentaje** — se probó un contador 0-100% renderizado en código
  (reemplazando uno que venía quemado en el video y se veía borroso), pero
  no quedó bien y se eliminó por completo; el video se reproduce solo.
- La página "Portafolio" fue eliminada — el enlace (menú y footer) ahora
  lleva a Inicio.
- **Las cuatro vistas previas del menú son cuatro fotos distintas**
  (`MENU_ITEMS` en `Navbar.tsx`, constantes en `data/media.ts`): Inicio =
  el fondo del hero, Proyectos y portafolio = `sec1-gal5-reflejo-v.jpg`,
  Equipo = `menu-pareja.jpg`, Contacto = el retrato de Mayurlin. Inicio y
  Proyectos compartían foto y el menú enseñaba dos veces la misma imagen.
  El recuadro aplica `grayscale contrast-[1.12] brightness-[0.98]` a todas,
  así que **cualquier foto que se ponga ahí sale en blanco y negro sola** —
  no hace falta preparar una copia. Lo que sí hay que mirar es cómo aguanta
  ese recorte de 300x375 con `object-[50%_20%]`: se descartó la piscina de
  Honeymoon Petra Villas porque dejaba el tercio de arriba en cielo vacío.
- Marquee de marcas (`BrandsMarquee.tsx`, página Contacto): padding vertical
  simétrico y reducido (`py-8 md:py-10`) — cuidado si se vuelve a tocar, ya
  hubo una ronda donde un padding asimétrico rompió tanto el centrado de los
  logos como el espacio antes del footer.

## Migración futura a hosting propio

Cuando Mayurlin migre todo el sitio a su dominio propio: el único lugar
donde el path de GitHub Pages está hardcodeado es la línea `base:
command === 'build' ? '/New-Portafolio/' : '/'` en `vite.config.ts`. Cambiar
ese valor (a `/` si el sitio queda en la raíz del dominio), volver a
compilar, y subir el contenido completo de `dist/` (código + `public/images/`
con todas las fotos y `content.json` que ya estén puestas) al hosting nuevo.
Nada más necesita cambios — todas las rutas de fotos/contenido usan
`import.meta.env.BASE_URL` dinámicamente, así que se ajustan solas.
