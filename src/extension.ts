import { log } from "console";
import * as vscode from "vscode";
const { Configuration, OpenAIApi } = require("openai");

const config = vscode.workspace.getConfiguration("gptAssistant");
const apiKey = config.get<string>("apiKey") || "";
const lang = config.get<string>("lang") || "";
const maxTokens = config.get<number>("maxTokens") || 2000;
const unitTestsCharacterPrompt = (
  config.get<string>("unitTestsCharacterPrompt") || ""
).replace("{LANG}", lang);
const refactoringCharacterPrompt = (
  config.get<string>("refactoringCharacterPrompt") || ""
).replace("{LANG}", lang);
const model = config.get<string>("model") || "";
const actionPrompts = {
  unitTests:
    "Analyze the following code and generate efficient unit tests with high code coverage, give back only {LANG} code without natural language descriptions, Here is the code:".replace('{LANG}', lang),
  refactoring:
    "Refactor the following code to make it cleaner, more maintainable, SOLID principies, DRY and efficient, without losing any functionality, give back only {LANG} code without natural language descriptions, Here is the code:".replace('{LANG}', lang),
};

const configuration = new Configuration({
  apiKey,
});
const openai = new OpenAIApi(configuration);

export function activate(context: vscode.ExtensionContext) {
  let unitTestsCommand = vscode.commands.registerCommand(
    "gpt-assistant.generateUnitTests",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No hay un editor activo.");
        return;
      }

      const selectedText = editor.document.getText(editor.selection);

      if (selectedText.length === 0) {
        vscode.window.showErrorMessage(
          "Por favor, selecciona un fragmento de código antes de generar pruebas unitarias."
        );
        return;
      }

      callGpt(
        selectedText,
        unitTestsCharacterPrompt,
        actionPrompts.unitTests,
        "Generando pruebas unitarias...",
        "No se pudo generar ninguna prueba unitaria",
        "Error al generar pruebas unitarias",
        (code: string) => {
          displayResponse(code, "Pruebas unitarias generadas con éxito");
        }
      );
    }
  );

  let refactoringCommand = vscode.commands.registerCommand(
    "gpt-assistant.refactoring",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No hay un editor activo.");
        return;
      }

      const selectedText = editor.document.getText(editor.selection);

      if (selectedText.length === 0) {
        vscode.window.showErrorMessage(
          "Por favor, selecciona un fragmento de código antes de refactorizar."
        );
        return;
      }

      callGpt(
        selectedText,
        refactoringCharacterPrompt,
        actionPrompts.refactoring,
        "Refactorizando...",
        "No se pudo refactorizar",
        "Error al refactorizar",
        (code: string) => {
          displayResponse(code, "Código refactorizado con éxito");
        }
      );
    }
  );

  context.subscriptions.push(unitTestsCommand, refactoringCommand);
}

async function callGpt(
  code: string,
  characterPromt: string,
  actionPrompt: string,
  title: string,
  generationError: string,
  operationError: string,
  displayCallback: (code: string) => void
) {
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title,
      cancellable: false,
    },
    async (progress) => {
      try {
        console.log(`Starting GPT with model: ${model}`);

        var messages = [
          {
            role: "system",
            content: "Stay in character. " + characterPromt + 'and response without natural language dialogs, only code generated.',
          },
          {
            role: "user",
            content: `${actionPrompt} \n${code}`,
          },
        ];

        const completion = await openai.createChatCompletion({
          model,
          messages,
          temperature: 0.5,
          max_tokens: maxTokens,
        });

        var choices = completion.data.choices;

        if (choices && choices.length > 0) {
          const responseCode = choices[0].message.content;
          displayCallback(responseCode);
        } else {
          vscode.window.showErrorMessage(generationError);
        }
      } catch (error: any) {
        console.log(`Error: ${error}`);
        vscode.window.showErrorMessage(`${operationError}: ${error}`);
      }
    }
  );
}

async function displayResponse(code: string, sucessMessage: string) {
  // Abrir un nuevo editor sin guardar el archivo y pegar el código allí
  const untitledFileUri = vscode.Uri.parse("untitled:result.ts");
  const newDocument = await vscode.workspace.openTextDocument(untitledFileUri);
  const editor = await vscode.window.showTextDocument(
    newDocument,
    vscode.ViewColumn.Beside
  );

  // Insertar el código de las pruebas unitarias en el nuevo editor
  await editor.edit((editBuilder) => {
    editBuilder.insert(newDocument.lineAt(0).range.start, code);
    vscode.window.showInformationMessage(sucessMessage);
  });
}

export function deactivate() {}
