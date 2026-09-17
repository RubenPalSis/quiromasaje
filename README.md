# AA Quiromasaje Zaragoza

Web del centro de quiromasaje de Andrés Aldea (C/ Miguel Servet, 72 · 50013 Zaragoza).

Sitio estático: HTML, CSS y JavaScript a pelo. **Sin build, sin dependencias, sin `npm install`.**
Lo que hay en `Quiromasaje/` es exactamente lo que se sube al servidor.

## Estructura

```
Quiromasaje/                 ← la web actual (esto es lo que se publica)
  index.html                 ← única página de contenido
  aviso-legal.html
  politica-de-privacidad.html
  politica-de-cookies.html
  styles.css
  script.js
  images/                    ← .webp, ya optimizadas

quiromasajezaragoza.es/      ← copia local del WordPress antiguo (7,5 MB, fuera de git)
```

`quiromasajezaragoza.es/` es una descarga del sitio anterior en WordPress + Divi. **No se publica, no se
mantiene y no está en git** (`.gitignore`): vive solo en local como referencia para recuperar textos,
precios o imágenes originales. Los textos legales de la web nueva salen de ahí literalmente. Si trabajas
desde un clon nuevo no la tendrás; hay que copiarla aparte o tirar del historial anterior a este commit.

## Trabajar en local

No basta con abrir el `index.html` desde el explorador de archivos: las rutas relativas y el `iframe`
del mapa se comportan mejor sobre HTTP. Levanta un servidor cualquiera:

```bash
cd Quiromasaje
python3 -m http.server 8000
# http://localhost:8000
```

## Publicar

Copiar el contenido de `Quiromasaje/` a la raíz del hosting. Nada más: no hay paso de compilación.

Ojo con las rutas absolutas: el `canonical` de las cuatro páginas, y en `index.html` además `og:url`,
`og:image` y el JSON-LD. Todas apuntan a `https://quiromasajezaragoza.es/`; si cambia el dominio, hay
que tocarlas una por una.

## Cómo está montado

**Una sola página.** `index.html` lleva todas las secciones y el menú navega por anclas:
`#inicio`, `#tratamientos`, `#precios`, `#acerca`, `#regalo`, `#contacto`. Las páginas legales son
independientes, llevan `class="page-legal"` en el `<body>` y enlazan de vuelta con `index.html#ancla`.

**CSS.** Todo en `styles.css`, con variables en `:root` para la paleta (`--olive`, `--sage`, `--cream`,
`--ink`…), tipografías, radios y sombras. Cambiar el color de marca es cambiar `--olive`.

Puntos de ruptura:

| Ancho | Qué cambia |
|---|---|
| ≤ 980 px | «Sobre mí», tarjetas regalo y contacto pasan a una columna |
| ≤ 860 px | Aparece el menú hamburguesa (panel lateral) |
| ≤ 560 px | Botones a ancho completo, aviso de cookies en vertical |

Además hay bloques para `(hover:none)` —táctil— y `prefers-reduced-motion`.

**JS.** `script.js` es un único IIFE sin dependencias: menú móvil, cabecera compacta al hacer scroll,
aparición progresiva de bloques con `IntersectionObserver`, enlace activo según la sección visible,
aviso de cookies (preferencia en `localStorage`, clave `aaq-cookies`) y el año del pie.

## Trampas conocidas

Cosas que ya han roto la web una vez. Merece la pena leerlas antes de tocar el CSS.

**No pongas `backdrop-filter` en `.site-header` por debajo de 860 px.** El panel del menú móvil es
`position:fixed` y vive dentro de la cabecera. `backdrop-filter` (igual que `transform`, `filter` o
`will-change`) crea un bloque contenedor para los descendientes `fixed`: el panel deja de medir la
pantalla entera y se queda en los 76 px de alto de la cabecera, con los enlaces desparramados por
encima del hero. En móvil la cabecera usa fondo opaco justamente por esto.

**Cuidado con `flex-basis` en el aviso de cookies.** Por debajo de 560 px el aviso pasa a
`flex-direction:column`, y ahí `flex:1 1 320px` reserva 320 px de **alto**, no de ancho. Eso hacía que
el banner ocupase toda la pantalla y tapase el botón de llamar.

**Los textos legales tienen URLs larguísimas en texto plano.** `.legal-body` lleva `overflow-wrap`
por eso: sin él, la página se desplaza en horizontal en móvil. La tabla de cookies va envuelta en
`.table-wrap`, que le da scroll horizontal propio con `min-width:700px` — no le quites el contenedor.

**`.reveal` depende de la clase `js`.** El `<html>` recibe `class="js"` desde un `<script>` en línea en
el `<head>`. Si se quita, y `script.js` no llega a cargar, todo el contenido se queda a `opacity:0` y
la página se ve en blanco.

**El menú móvil se oculta con `visibility:hidden`,** no solo desplazándolo fuera de pantalla. Si se
cambia a solo `transform`, los enlaces del menú cerrado vuelven a ser navegables con el tabulador y
los lee el lector de pantalla.

## Pendiente

- **Consentimiento de cookies real.** El botón «Rechazar» guarda la preferencia pero no cambia nada:
  el `iframe` de Google Maps se carga siempre y pone cookies de terceros antes de que nadie acepte.
  Para cumplir el RGPD habría que cargar el mapa solo después de aceptar.
- **Foto del hero.** `images/hero.webp` es una suculenta morada: no tiene que ver con el sector y
  choca con la paleta verde. Además mide 828×591, así que en móvil vertical se amplía unas 2,7 veces
  y se ve borrosa. Hace falta una imagen apaisada de al menos 1600 px de ancho, o una versión vertical
  aparte.
- **Contenido de los textos legales.** Vienen tal cual del WordPress antiguo y mencionan servicios que
  la web nueva no usa (Google Analytics, Sendinblue, Stripe, Drift…). Habría que revisarlos.
