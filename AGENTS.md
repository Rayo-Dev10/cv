# AGENTS Instructions

Este proyecto contiene un CV en formato HTML. La información principal se administra a través de varios archivos JSON:

- `profile.json`: datos personales, habilidades e intereses.
- `experiencia.json`: historial de experiencia laboral.
- `formacion.json`: formación académica.
- `certificaciones.json`: listado de certificaciones agrupadas en categorías.

Al modificar secciones del CV que involucren estos datos, actualiza primero los archivos JSON correspondientes y luego verifica que `scripts/dataLoader.js` siga presentando la información correctamente en la página.

## Lineamientos
- Mantén la estructura de los objetos en cada archivo JSON.
- No agregues comentarios dentro de los archivos JSON.
- Los estilos personalizados deben residir en `styles/main.css` o en archivos importados desde él. No uses bloques `<style>` en `index.html`.
- Los scripts propios deben colocarse en la carpeta `scripts/` y estar escritos como módulos ES6.
- Usa `npm` o `yarn` sólo si es estrictamente necesario; el proyecto no requiere herramientas adicionales para funcionar.
- Ejecuta `python -m json.tool <archivo>` para validar los cambios en cualquier archivo JSON que edites.

Consulta también los AGENTS de las carpetas `scripts/` y `styles/` para lineamientos específicos.

## Programmatic Checks
Para validar la integridad de los JSON se recomienda ejecutar:

```bash
python -m json.tool profile.json
python -m json.tool experiencia.json
python -m json.tool formacion.json
python -m json.tool certificaciones.json
```

Todos deben completarse sin errores antes de realizar un commit.

## Mejores prácticas para un codigo mas conciso
- Centraliza la creación de elementos HTML en funciones reutilizables para evitar duplicaciones.
- Simplifica los bucles y transformaciones de datos usando métodos como `map`, `filter` y `reduce`.
- Extrae la lógica de formateo o selección de datos a helpers importados desde `scripts/` (por ejemplo `scripts/helpers.js`).
- Mantén CSS modular combinando reglas comunes y eliminando estilos no utilizados.
- Documenta brevemente cada módulo para que sea claro su propósito y evitar redundancias futuras.
