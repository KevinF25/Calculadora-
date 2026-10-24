# DESIGN.md — Calculadora de perfume

Referencia visual de `index.html`. Los valores viven en `:root` dentro de `<style>`; si cambian ahí, actualizar esta tabla.

## Principios

- Parecer una app nativa de iOS: barras translúcidas, hojas desde abajo, menús de acción y confirmación antes de borrar.
- Colores solo con variables de `:root`. Nunca un color fijo en un componente.
- Nunca transmitir información solo con color: acompañar con texto o icono (ejemplo: `.nohave` en la lista de materiales).
- Textos de la interfaz en español, cortos y sencillos.

## Tokens de color

| Token | Modo claro | Modo oscuro | Uso |
|---|---|---|---|
| `--bg` | `#f2f5f3` | `#0f1917` | Fondo de la página |
| `--card` | `#fff` | `#17252a` | Tarjetas y hojas |
| `--ink` | `#17302b` | `#e3eeea` | Texto principal |
| `--mute` | `#5f726d` | `#8fa59f` | Texto secundario |
| `--line` | `#d5ded9` | `#2b3f3b` | Bordes y separadores |
| `--acc` | `#1d6b58` | `#5fc4a5` | Color de acción principal |
| `--accbg` | `#e1efe9` | `#183a31` | Fondo suave de acción |
| `--acc2` | `#9fcab9` | `#2f6b5a` | Acento secundario |
| `--py1` / `--py2` / `--py3` | `#b5dfcf` / `#4a9e83` / `#1d5e4d` | `#2c5e50` / `#4fae8f` / `#a3e3cb` | Escala de la pirámide de notas |
| `--pyt1` / `--pyt3` | `#17302b` / `#fff` | `#fff` / `#0f1917` | Texto sobre la pirámide |
| `--bgt` / `--cardt` | fondos translúcidos claros | fondos translúcidos oscuros | Barras y hojas con desenfoque |
| `--shadow` | sombra suave | `none` | Sombra de tarjetas |
| `--warn` / `--warnbg` | `#9a5b00` / `#fdf0d5` | `#f0b955` / `#3a2d12` | Avisos |
| `--bad` | `#b3261e` | `#ff8a80` | Errores y borrado |

## Reglas de modo oscuro

Cada token nuevo necesita su valor en los **dos** bloques de modo oscuro:

1. `@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){…}}`
2. `:root[data-theme="dark"]{…}`

## Componentes

| Clase | Qué es |
|---|---|
| `.hdr` | Barra superior pegada (rejilla de 3 columnas: botón, título, botón) |
| `.ebar` | Barra de edición |
| `.nav` | Barra inferior translúcida |
| `.sumbar` | Barra de resumen sobre la barra inferior |
| `.bsheet` | Hoja que sube desde abajo |
| `.card` | Tarjeta blanca con sombra |
| `.mrow2` | Fila de material (`.miss` cuando falta; `.nohave` avisa con texto) |
| `.wzc` | Tarjeta del asistente de frasco |

## Tamaños táctiles

- Los botones y filas interactivas usan alturas mínimas de 44 px (`min-height:44px`), según el patrón de iOS.
- Respetar `env(safe-area-inset-*)` en barras fijas y en el borde superior e inferior.

## Movimiento y capas

- Barras fijas con `backdrop-filter: saturate(180%) blur(18px)`.
- Usar `toast()` para avisos breves y `actionSheet()` para menús.
