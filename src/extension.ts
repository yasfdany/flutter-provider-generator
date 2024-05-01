import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('flutter-provider-generator.newProviderTemplate', async () => {
		const featureName = await vscode.window.showInputBox({
			placeHolder: "Enter feature name",
			validateInput(value) {
				const featureNameRegex = /^[a-z]+(_[a-z]+)*$/;

				if (value && !featureNameRegex.test(value)) {
					return 'Invalid feature name. Please use snake_case.';
				}
				return null;
			},
		});
		
		vscode.window.showInformationMessage(`${featureName} feature created!`);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
