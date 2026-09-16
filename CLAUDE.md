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
- **Tres carruseles hermanos**, con el mismo esqueleto y **alineados a la
  izquierda**: ancla a la izquierda (comilla o cifra) → foto flotada 3/4 →
  el texto en serif grande envolviéndola → firma. Son el bloque de valor de
  Inicio, "El proceso" (Acerca de) y "Voces de la industria" (Contacto).
  Cambiar uno es cambiar los tres.
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

Fotos con nombre propio (no numeradas): `hero-portada.jpg` (fondo de Inicio,
también usada en la vista previa de "Portafolio" en el menú),
`sobre-mi-mayurlin.jpg`, `sobre-mi-yerfran.jpg` (retratos en "Acerca de").

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

## Decisiones de diseño ya tomadas (no revertir sin que ella lo pida)

- Logo actual: sin efecto de sombra/resplandor (el anterior sí lo tenía, ella
  lo pidió quitar). Tamaño reducido en dos rondas: -15% y luego -18%
  adicional (actual: 25px móvil / 30px escritorio en navbar, 25px en footer).
- Foto del Hero (`hero-portada.jpg`): lleva un tinte plano negro al 10%
  (`bg-black/10`) sobre toda la foto para que el titular blanco tenga más
  contraste — pedido explícito, revierte la decisión anterior de "sin
  ningún filtro". Además el degradado inferior (detrás del texto del pie)
  y la franja blanca del Navbar (logo/menú) para legibilidad, ver
  `HeroSection.tsx`. Esta misma foto se reutiliza como vista previa al
  pasar el cursor sobre "Portafolio" en el menú.
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
  lleva a Inicio. La foto de vista previa al pasar el mouse sobre
  "Portafolio" en el menú es la misma que el fondo del Hero.
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
