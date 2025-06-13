# AGENTS Instructions

Este proyecto contiene un CV en formato HTML. La información principal se administra a través de tres archivos JSON:

- `experiencia.json`: historial de experiencia laboral.
- `formacion.json`: formación académica.
- `certificaciones.json`: listado de certificaciones agrupadas en categorías.

Al modificar secciones del CV que involucren estos datos, actualiza primero los archivos JSON correspondientes y luego verifica que el script en `index.html` siga presentando la información correctamente.

## Lineamientos
- Mantén la estructura de los objetos en cada archivo JSON.
- No agregues comentarios dentro de los archivos JSON.
- Usa `npm` o `yarn` sólo si es estrictamente necesario; el proyecto no requiere herramientas adicionales para funcionar.
- Ejecuta `python -m json.tool <archivo>` para validar los cambios en cualquier archivo JSON que edites.

A partir de ahora los estilos personalizados deben colocarse en `styles/main.css` y los scripts propios en la carpeta `scripts/`. No incluyas bloques `<style>` o código JavaScript incrustado en `index.html`.

## Programmatic Checks
Para validar la integridad de los JSON se recomienda ejecutar:

```bash
python -m json.tool experiencia.json
python -m json.tool formacion.json
python -m json.tool certificaciones.json
```

Todos deben completarse sin errores antes de realizar un commit.
