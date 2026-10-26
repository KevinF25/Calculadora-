# CLAUDE.md

Calculadora de fórmulas de perfume: PWA para iPhone, en español. Para ver el avance, lo que funciona y lo que falta, consulta **`PROJECT_STATE.md`**.

## Ejecutar y probar

No hay `npm`, ni build, ni dependencias: son archivos estáticos.

```sh
python3 -m http.server 8765      # abrir http://localhost:8765
```

 - Abrir `index.html` directamente con `file://` también funciona, pero sin service worker.
- Para pruebas en el navegador, usar Playwright con `executablePath: '/opt/pw-browsers/chromium'`.
  - Bloquear `supabase` y `fonts` con `page.route` y pulsar `#ggu` ("Usar sin cuenta").
  - Probar en modo claro y oscuro (`colorScheme`) con viewport de 390×844 e `isMobile`.
  - Revisar que `pageerror` quede vacío.
- Los scripts de prueba y las capturas van en el scratchpad, **nunca en el repo**.
- Si cambias la matemática, verifica con números calculados a mano: `fracs()`, `calc()`, `calcOf()`, `impResult()`, `pesStats()`.
- **Despliegue:** Vercel publica `main` y comenta una vista previa en cada PR. GitHub Pages debe seguir desactivado.

## Tecnologías

| Archivo | Qué es |
|---|---|
| `index.html` | Toda la app: HTML, CSS y JavaScript vanilla en un solo archivo |
| `catalogo.js` | `var CATALOGO=[...]`, con 120 materiales |
| `sw.js` | Service worker sin conexión. Si cambian archivos base, sube `CACHE` (`formulas-vN`) |
| `manifest.webmanifest` | PWA `standalone` con sus iconos |

- **Datos:** `localStorage` (`perfcalc-v1`) sincronizado con Supabase (tabla `calc_data`, un JSON por usuario).
- **Supabase:** se carga desde la CDN. No hay backend propio.

## Estilo de código

- JavaScript estilo ES5: `var` y `function(){}`, sin arrow functions ni módulos. Línea compacta como el código existente.
- Usar los helpers existentes:
  - `$()` para elementos, `esc()` para escapar texto en HTML;
  - `f(n,d)` para decimales fijos y `fp()` para partes;
  - `fdate()`, `toast()`, `actionSheet()`;
  - hojas `.bsheet` y barras `.hdr` / `.ebar`.
- Todo texto que venga del usuario o de los datos pasa por `esc()` antes de entrar en el HTML.
- Comentarios breves en español, solo cuando expliquen el porqué.
- Textos de la interfaz en español, cortos y sencillos.
- **CSS:**
  - colores solo con variables de `:root` (`--acc`, `--warn`, `--bad`, `--mute`…);
  - cada color nuevo necesita su versión oscura en los dos bloques de modo oscuro;
  - nunca transmitir información solo con color.
- **Diseño:** debe parecer una app nativa de iOS: barras translúcidas, hojas desde abajo, menús de acción y confirmación antes de borrar.
- **Datos:**
  - no romper datos guardados;
  - los campos nuevos deben ser opcionales;
  - las migraciones se ejecutan una sola vez y se marcan con una bandera (`seedv`, `catv`).

## Forma de trabajar

- El usuario habla en español. Explica en lenguaje sencillo, con ejemplos.
- En cambios grandes, primero se habla de cómo quedaría y después se implementa.
- Rama `claude/calculator-design-optimization-6guco2`, recreada desde `origin/main`.
- Flujo: commit → PR → enviar el enlace de la vista previa de Vercel y capturas. Unir (squash) solo cuando el usuario diga **"únelo"**.
- No usar WebSearch sin permiso. Fraterworks.com no se puede abrir desde el entorno.
