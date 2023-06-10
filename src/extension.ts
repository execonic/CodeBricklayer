// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CodeBricklayer } from './codeBricklayer';
import { SnippetString } from 'vscode';
import { Position } from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, the extension "code-bricklayer" is now active!');
	var cb = new CodeBricklayer();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('code-bricklayer.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		let selection = editor.selection;
		let text = editor.document.getText(selection);

		cb.pushBluePrint(text);
		cb.archPrase();
		cb.bricklay();

		let snippet = new SnippetString(cb.popContent());
		let insertPos = new Position(selection.end.line + 2, 0);

		editor.insertSnippet(snippet, insertPos);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
