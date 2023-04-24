import * as vscode from 'vscode';
const { Configuration, OpenAIApi } = require("openai");

const config = vscode.workspace.getConfiguration('gptAssistant');
const apiKey = config.get<string>('apiKey') || '';
const maxTokens = config.get<number>('maxTokens') || 2000;
const unitTestsPrompt = config.get<string>('unitTestsPrompt') || '';
const refactoringPrompt = config.get<string>('refactoringPrompt') || '';
const model = config.get<string>('model') || '';

const configuration = new Configuration({
	apiKey
});
const openai = new OpenAIApi(configuration);

export function activate(context: vscode.ExtensionContext) {
	let unitTestsCommand = vscode.commands.registerCommand('gpt-assistant.generateUnitTests', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No hay un editor activo.');
			return;
		}

		const selectedText = editor.document.getText(editor.selection);

		if (selectedText.length === 0) {
			vscode.window.showErrorMessage('Por favor, selecciona un fragmento de código antes de generar pruebas unitarias.');
			return;
		}

		callGpt(selectedText, unitTestsPrompt, 'Generando pruebas unitarias...', 'No se pudo generar ninguna prueba unitaria', 'Error al generar pruebas unitarias',
			(code: string) => {
				displayResponse(code, 'Pruebas unitarias generadas con éxito');
			});
	});

	let refactoringCommand = vscode.commands.registerCommand('gpt-assistant.refactoring', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No hay un editor activo.');
			return;
		}

		const selectedText = editor.document.getText(editor.selection);

		if (selectedText.length === 0) {
			vscode.window.showErrorMessage('Por favor, selecciona un fragmento de código antes de refactorizar.');
			return;
		}

		callGpt(selectedText, refactoringPrompt, 'Refactorizando...', 'No se pudo refactorizar', 'Error al refactorizar',
			(code: string) => {
				displayResponse(code, 'Código refactorizado con éxito');
			});
	});

	context.subscriptions.push(unitTestsCommand, refactoringCommand);
}

async function callGpt(
	selectedCode: string,
	actionPrompt: string,
	title: string,
	generationError: string,
	operationError: string,
	displayCallback: (code: string) => void) {
	const prompt = `${actionPrompt} ${selectedCode}`;

	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Window,
			title,
			cancellable: false,
		},
		async (progress) => {
			try {
				const response = await openai.createCompletion({
					model,
					prompt,
					temperature: 0,
					max_tokens: maxTokens,
				});

				const choices = response.data.choices;
				if (choices && choices.length > 0) {
					const responseCode = choices[0].text.trim();
					displayCallback(responseCode);
				} else {
					vscode.window.showErrorMessage(generationError);
				}
			} catch (error: any) {
				vscode.window.showErrorMessage(`${operationError}: ${error.message}`);
			}
		}
	);


}

async function displayResponse(code: string, sucessMessage: string) {
	// Abrir un nuevo editor sin guardar el archivo y pegar el código allí
	const untitledFileUri = vscode.Uri.parse('untitled:result.ts');
	const newDocument = await vscode.workspace.openTextDocument(untitledFileUri);
	const editor = await vscode.window.showTextDocument(newDocument, vscode.ViewColumn.Beside);

	// Insertar el código de las pruebas unitarias en el nuevo editor
	await editor.edit((editBuilder) => {
		editBuilder.insert(newDocument.lineAt(0).range.start, code);
		vscode.window.showInformationMessage(sucessMessage);
	});
}


export function deactivate() { }
