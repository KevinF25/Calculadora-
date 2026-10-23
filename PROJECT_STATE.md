# Estado del proyecto: Calculadora de fórmulas de perfume

_Última actualización: 23 oct 2026 · main en `fe090c0` (PR #23)_

## 1. Resumen del estado actual

Calculadora de fórmulas de perfumería instalable en el iPhone como app (PWA), con aspecto y comportamiento de app nativa de iOS. Sirve para:

- crear y escalar fórmulas manteniendo la proporción olfativa;
- pesar los lotes paso a paso y registrar lo que se pesó de verdad;
- analizar y comparar fórmulas;
- importar recetas externas;
- consultar una ficha detallada de cada material.

**Estado:** estable y en producción. Se han unido 23 PRs a `main` y Vercel publica cada cambio automáticamente. La última auditoría de cálculos pasó 38 de 38 pruebas numéricas. No hay errores conocidos abiertos.

- **Producción:** Vercel, desplegado desde `main`. GitHub Pages está desactivado a propósito, porque si está activo Vercel no publica.
- **Vista previa de cada PR:** https://calculadora-git-claude-calculator-design-opti-fed283-kevin-b086.vercel.app
- **Repositorio:** `KevinF25/Calculadora-`. Rama de trabajo: `claude/calculator-design-optimization-6guco2`, que se recrea desde `origin/main` en cada ronda.

## 2. Arquitectura y tecnologías

| Pieza | Detalle |
|---|---|
| `index.html` (~150 KB) | Toda la app en un solo archivo: HTML, CSS y JavaScript vanilla (estilo ES5, sin frameworks ni build). |
| `catalogo.js` (~51 KB) | `var CATALOGO=[...]` con 120 materiales (familia, posición, notas, potencia, duración, uso, IFRA, CAS, fuente, alias). |
| `sw.js` | Service worker para uso sin conexión. Las páginas van primero a la red (timeout de 4 s); los archivos base (incluidos `catalogo.js` y el script de Supabase) se guardan en caché `formulas-v2`. Nunca guarda en caché `supabase.co`. |
| `manifest.webmanifest` + iconos | PWA en modo `standalone`, pantalla completa en el iPhone. |
| Datos | `localStorage` (clave `perfcalc-v1`, separada por usuario) y sincronización con **Supabase** (tabla `calc_data`, una fila JSON por `user_id`). Inicio de sesión con correo y contraseña, o "Usar sin cuenta". |
| Despliegue | Vercel conectado a GitHub (cuenta `kevin-b086`). Vercel publica un comentario con la vista previa en cada PR. |

### Matemática central

- **Modo puro** (el predeterminado): las partes son de material puro.
  - Peso de cada fila: `x = p / (d/100)`, donde `p` son las partes y `d` la dilución del frasco.
  - Gramos de cada fila: `g = x/Σx × total`.
  - Al cambiar una dilución, cambian los gramos pero se mantiene la proporción olfativa.
- **Modo pesar:** las partes son lo que se pesa del frasco.
- **Funciones clave:**
  - Calculadora: `fracs()`, `calc()`; para fórmulas guardadas, `calcOf(x)`, que usa la misma matemática.
  - Análisis: `pureMix()`, `splitBy()`, `simil()`.
  - Importar: `impCalc()`, `impResult()`.
  - Pesada: `pesStats()`.
- **Importar:** convierte la receta a puro (partes × dilución) y normaliza a 1000 partes. La receta original se guarda aparte, solo para consultar.
- **Pesada:** la desviación se mide contra el grupo más grande de materiales pesados en la misma proporción (±2 %); en empate gana el más cercano al objetivo.
  - Pesar todo de más por igual cuenta como "fiel".
  - El error se atribuye al material que se desvió, también cuando la fórmula tiene solo 2.
  - Colores: verde ≤2 %, ámbar ≤5 %, rojo por encima.

### Modelo de datos

- **Fórmula:**
  ```
  {id, name, cat (lote), ts, mt, tot, mode, note,
   rows:[{n,d,p}],
   evals:[{id,ts,when,score,note,pes}],
   pes:[{id,ts,k,note,rows:[{n,d,g,r}]}],
   orig}
  ```
- **Material:** `{n, d[], note, fam, pos, own, tags[], pot, dur, uso, ifra, info, cas, fuente, seedv, catv}`.
- **Migraciones que se ejecutan una sola vez:**
  - `seedv=1`: carga los datos de Fraterworks de los 8 materiales del usuario.
  - `NOTOWN`: marca como "no lo tengo" los materiales predeterminados que el usuario no tiene.
  - `catv=1`: rellena los materiales desde el catálogo, solo si `CATALOGO` cargó.

### Patrones de interfaz (estilo iOS)

- Barras superiores fijas y translúcidas (`.hdr`, `.ebar`) y barra inferior con el total (`.sumbar`).
- Hojas que suben desde abajo (`.bsheet`), menú de acciones `actionSheet(title,[{label,bad,fn}])`, avisos `toast()` y ventanas `.modal`.
- Edición sobre un borrador (`editId`, `dirty()`, `saveEdit()`, `discardEdit()`, `leaveCalc()`): pregunta antes de salir si hay cambios sin guardar.
- Colores por familia (`FAM`, `famColor()`, `famBar()`). Siempre van acompañados de nombre o porcentaje, nunca se usa solo el color.

## 3. Lo que ya está construido y funciona

**Calculadora**
- Diseño iOS con un material por fila: dilución, partes, %, gramos y franja de color de su familia.
- Hoja de edición de cada material con diluciones disponibles y sugerencias.
- Total en la barra inferior con atajos. Aviso de límite de la balanza con el botón "Subir el total a…".
- Etiqueta "No lo tengo" en los materiales que no tienes.
- Compartir o copiar la fórmula.
- Calculadora de dilución real (material + solvente).
- Los números con coma (`1,5`) se convierten solos a punto.

**Fórmulas**
- Lista agrupada por lote, con buscador y mini barra de familias.
- **Detalle de la fórmula:**
  - líneas con punto de color;
  - menú ⋯ con duplicar, renombrar, exportar PDF y borrar;
  - edición con confirmación al guardar.
- **Información (ⓘ):** datos, huella (barras de Familias y Pirámide), **Pesadas**, notas, receta original y evaluaciones.
- **Evaluaciones:** estrellas, cuándo se probó, notas y lote pesado asociado.
- **Analizar:** vistas para ver la estructura común de las fórmulas.
- **Comparar:** tabla de % de puro con cambios (▲▼, nuevo o quitado) y % de parecido.
- **Importar receta externa:**
  - partes "tal como se pesa" o "de puro";
  - normaliza a 1000 partes y las muestra con 1 decimal;
  - guarda la receta original aparte.

**Pesada (registro de lotes)**
- Asistente paso a paso con los gramos objetivo en grande, sin que se apague la pantalla (wake lock). Se puede cambiar el orden.
- Campo para lo que marcó la báscula, con aviso en vivo (verde, ámbar o rojo).
- **Ajustar el resto:** si te pasas, recalcula todo para mantener la proporción. Los materiales ya pesados que se quedan cortos se marcan como "falta añadir".
- **Resumen:**
  - veredicto del lote ("fiel" o "N materiales se desviaron");
  - objetivo original → ajustado, y qué material provocó el ajuste;
  - nota del lote;
  - botón "Guardar pesada".
- Las pesadas aparecen en Información. Al tocar una se abre su detalle, con las evaluaciones de ese lote y la opción de borrarla.

**Materiales**
- Lista iOS por familia, con colores y edición en hoja.
- Página de detalle con la información completa y el interruptor "Lo tengo".
- Los 8 materiales del usuario tienen los datos de Fraterworks: Iso E Super, Hedione, Ambrofix, Habanolide, Helvetolide, Cashmeran, Javanol y Ambrocenide.
- Catálogo de 120 materiales para crear materiales nuevos con la información ya rellena.

**App**
- PWA en pantalla completa, funciona sin conexión.
- Sincronización con Supabase o modo sin cuenta.
- Modo claro y oscuro.

## 4. Tareas pendientes

### Acordadas para más adelante (solo cuando el usuario lo pida)

1. **Sustitutos de materiales.** El diseño ya está acordado:
   - Proponer solo materiales que el usuario tiene, con un papel igual o cercano en la pirámide (nunca Salida ↔ Fondo).
   - Puntuación: familia 35 %, etiquetas 55 %, papel 10 %. Mismo CAS = 100 %. Mínimo 45 %. Mostrar los 3 mejores.
   - "Usar este" mantiene las mismas partes, avisa de la diferencia de potencia y marca la fila "en lugar de X", con opción de deshacer.
   - Dónde aparece: hoja del material en la calculadora, importar, página del material y un aviso "Te faltan N materiales".

### Ideas comentadas, aún sin decidir

2. **Inventario o stock de cada material:** restar gramos al guardar una pesada. Es un proyecto aparte.
3. **Fotos del lote** en cada pesada.
4. **Colores por lote** en la lista de fórmulas (opcional, se descartó por ahora).

### Revisiones pendientes

5. Comprobar en un iPhone real que escribir `1,5` funciona bien. La corrección se probó solo en el navegador del ordenador.
6. Si algún día cambian `catalogo.js` o los iconos, subir la versión de la caché en `sw.js` (`formulas-v2` → `v3`) para que el iPhone baje los archivos nuevos.

## Forma de trabajar (para nuevas sesiones)

- El usuario habla en español y quiere que la app **se parezca a una app real de iPhone**.
- En los cambios grandes, **primero se habla** de cómo quedaría y después se hace.
- Flujo de cada cambio:
  1. Rama desde `origin/main`.
  2. Probar con Playwright (Chromium en `/opt/pw-browsers/chromium`) en modo claro y oscuro, con capturas para el usuario.
  3. Commit y push.
  4. Abrir el PR y pasar el enlace de la vista previa de Vercel.
  5. Unir (squash) solo cuando el usuario diga **"únelo"**.
- No guardar capturas ni archivos de prueba en el repositorio.
- Fraterworks.com no se puede abrir desde el entorno. No usar WebSearch sin pedir permiso al usuario.
- Explicar en lenguaje sencillo y con ejemplos, sin términos técnicos.
