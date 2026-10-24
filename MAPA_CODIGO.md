# MAPA_CODIGO.md — funciones de `index.html`

Líneas aproximadas al momento de escribir este mapa. Para comprobar una función:

```sh
grep -n "function nombre(" index.html
```

Regenerar la lista de funciones:

```sh
grep -n "^\s*function [A-Za-z_$][A-Za-z0-9_$]*(" index.html
```

## Estructura del archivo

| Líneas | Parte |
|---|---|
| 1–19 | Cabecera, metas PWA y scripts (Supabase desde CDN, `catalogo.js`) |
| 20–357 | `<style>`: tokens de color en `:root` (ver `DESIGN.md`), componentes |
| 513–1536 | `<script>`: toda la lógica |

## Funciones por área

**Materiales y catálogo (537–599)**
`catFind` 537 · `catApply` 541 · `newMat` 544 · `migrate` 545 · `saveMats` 553 · `loadMats` 554 · `findMat` 557 · `avail` 558 · `noteFor` 559 · `selOpts` 560 · `fillList` 561 · `refreshRow` 564 · `refreshAll` 565 · `owns` 566 · `allTags` 567 · `famOf` 568 · `pyr` 569 · `matPage` 574 · `openMat` 597 · `renderMats` 599

**Utilidades y guardado (616–631)**
`prep` 616 · `snap` 623 · `store` 624 · `load` 625 · `f` 626 (decimales) · `fp` 628 (partes) · `esc` 629 (escapar HTML)

**Vista de fórmula (631–672)**
`render` 631 · `rowFill` 645 · `rowInfo` 649 · `rowOpen` 651 · `rowClose` 652 · `totShow` 667 · `toast` 672

**Cálculo (673–738)**
`fracs` 673 · `calc` 677 · `saveState` 702 · `saveEdit` 704 · `discardEdit` 706 · `leaveCalc` 709 · `dil` 715 · `text` 721 · `renderVers` 729 · `shareFormula` 738

**Biblioteca, menús y hojas (762–877)**
`mnewClose` 762 · `catPrev` 763 · `toggleM` 787 · `addTag` 794 · `fdate` 809 · `clone` 810 · `findF` 811 · `fPanel` 812 · `renderLib` 821 · `saveLib` 838 · `toggleF` 840 · `showTab` 854 · `closeMenu` 864 · `actionSheet` 871 · `closeSheet` 877

**Asistente de frasco (887–975)**
`wzBuild` 887 · `wzSort` 891 · `wzG` 892 · `wzR` 893 · `wzV` 894 · `devCls` 896 · `pct` 897 · `fdt` 898 · `wzKmax` 900 · `wzInd` 901 · `wzNext` 911 · `wzAdjust` 912 · `wzRec` 917 · `pesStats` 919 · `pesTag` 928 · `pesBody` 929 · `wzRender` 941 · `wzDirty` 967 · `wzSave` 968 · `wzLockOn` 973 · `wzLockOff` 974 · `wzClose` 975

**Sincronización y sesión (1001–1110)**
`setNS` 1001 · `defReg` 1002 · `resetState` 1003 · `redraw` 1006 · `saveLocal` 1007 · `lockUI` 1009 · `useSpace` 1010 · `setSync` 1014 · `touch` 1015 · `schedulePush` 1016 · `push` 1017 · `applyRemote` 1024 · `sbOk` 1037 · `gmsg` 1038 · `showGate` 1039 · `mkRef` 1040 · `startSync` 1045 · `pull` 1053 · `clearGate` 1066 · `setMode` 1067 · `showLogin` 1076 · `wipeSession` 1077 · `logout` 1078 · `initAuth` 1089 · `creds` 1110

**Importación y PDF (1156–1275)**
`evLote` 1156 · `evBlock` 1157 · `fExtra` 1170 · `dupF` 1184 · `delF` 1189 · `calcOf` 1191 · `pdfText` 1198 · `buildPDF` 1200 · `exportPDF` 1257

**Análisis y comparación (1275–1338)**
`disarmAll` 1275 · `pureMix` 1286 · `evAvg` 1288 · `simil` 1289 · `splitBy` 1291 · `famParts` 1294 · `famBar` 1296 · `famLeg` 1298 · `famColor` 1299 · `barHTML` 1300 · `barRows` 1302 · `anaHTML` 1314 · `item` 1323 · `pickHTML` 1333 · `cmpHTML` 1338

**Impuros e importación de mezcla (1358–1406)**
`impDil` 1358 · `impPart` 1359 · `impPure` 1360 · `impCalc` 1361 · `impResult` 1363 · `impHTML` 1366 · `impUpdate` 1379 · `impOpen` 1386 · `impAdd` 1387 · `impFill` 1388 · `impInfo` 1393 · `impEdit` 1396 · `impClose` 1397 · `impSave` 1406

**Pesos y fichas (1422–1440)**
`pesSorted` 1422 · `pesList` 1423 · `pesOpen` 1428 · `pesClose` 1434

**Fórmulas guardadas (1440–1532)**
`fInfo` 1440 · `fDet` 1453 · `sig` 1491 · `dirty` 1492 · `rescue` 1494 · `ebar` 1500 · `newClose` 1513 · `renameF` 1515 · `flush` 1532

## Identificadores útiles

- `CACHE` en `sw.js`: versión de la caché sin conexión (`formulas-vN`). Subirla si cambian archivos base.
- `perfcalc-v1` (`localStorage`) y tabla `calc_data` en Supabase: datos del usuario.
- Banderas de migración `seedv` y `catv`: no quitarlas, ya protegen datos guardados.
