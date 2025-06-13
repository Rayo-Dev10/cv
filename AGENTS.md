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
Valida únicamente los archivos JSON que hayas editado durante el trabajo.

```bash
python -m json.tool <archivo-editado>
```

Asegúrate de que todos los JSON modificados se procesen sin errores antes de hacer commit.
