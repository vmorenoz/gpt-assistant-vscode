# GPT Assistant

GPT Assistant es una extensión para Visual Studio Code que utiliza el modelo GPT-3 de OpenAI para generar automáticamente pruebas unitarias y refactorizar el código TypeScript. Mejora la productividad del desarrollador al proporcionar asistencia inteligente en el proceso de desarrollo de software.

## Características

- Generar pruebas unitarias automáticamente para funciones TypeScript en proyectos de Angular utilizando Karma.
- Refactorizar el código TypeScript sin perder funcionalidad.
- Integración fácil con la API de OpenAI GPT-3.

## Requisitos previos

- Debes tener una API Key de OpenAI GPT-3 para utilizar esta extensión. Si aún no tienes una, puedes solicitarla en la [página web de OpenAI](https://beta.openai.com/signup/).

## Instalación

1. Abre Visual Studio Code.
2. Ve al panel de extensiones (Ctrl+Shift+X en Windows, Cmd+Shift+X en macOS) y busca "GPT Assistant".
3. Haz clic en "Install" para instalar la extensión.

## Configuración

1. Abre la configuración de Visual Studio Code (Ctrl+, en Windows, Cmd+, en macOS).
2. Busca "GPT Assistant" en la barra de búsqueda.
3. Establece la API Key de OpenAI GPT-3 en el campo "API Key".
4. (Opcional) Establece el número máximo de tokens para las respuestas de GPT-3 en el campo "Max Tokens".

## Uso

### Generar pruebas unitarias

1. Abre un archivo TypeScript en un proyecto de Angular.
2. Selecciona una función en el código.
3. Haz clic con el botón derecho del ratón y selecciona "Generar prueba unitaria" en el menú contextual.
4. La extensión generará automáticamente pruebas unitarias para la función seleccionada y las mostrará en un nuevo archivo.

### Refactorizar código

1. Abre un archivo TypeScript.
2. Selecciona un fragmento de código.
3. Haz clic con el botón derecho del ratón y selecciona "Refactorizar código" en el menú contextual.
4. La extensión refactorizará automáticamente el código seleccionado y lo mostrará en un nuevo archivo.

## Contribuciones

Las contribuciones son siempre bienvenidas. Por favor, siéntete libre de informar de problemas o solicitudes de características a través de [GitHub Issues](https://github.com/vmorenoz/gpt-assistant-vscode/issues).

## Licencia

[MIT License](https://opensource.org/licenses/MIT)
