import * as vscode from 'vscode';
import * as fs from 'fs';
import { sortImports } from './utils/sortImports';
import { getAndValidateConfig } from './utils/getAndValidateConfig';

export function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand('groupSortImports.sortImports', () => {
    try {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const fileName = document.fileName;
        const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (/^[jt]sx?$/.test(extension)) {
          const configArray = getAndValidateConfig();
          console.log("configArr.json", JSON.stringify(configArray));
          const text = document.getText();
          console.log("text.txt", text);
          const sortedText = sortImports(text, configArray);
          if (text !== sortedText) {
            editor.edit((editBuilder) => {
              editBuilder.replace(
                new vscode.Range(
                  new vscode.Position(0, 0),
                  new vscode.Position(document.lineCount, 0),
                ),
                sortedText,
              );
            });
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(error.message);
      }
    }
  });

  // run groupSortImports.sortImports on save if enabled
  context.subscriptions.push(
    vscode.workspace.onWillSaveTextDocument(() => {
      const config = vscode.workspace.getConfiguration('groupSortImports');

      if (config.get('sortOnSave')) {
        vscode.commands.executeCommand('groupSortImports.sortImports');
      }

      if (config.sortOnSavePreservingComments) {
        vscode.commands.executeCommand(
          'groupSortImports.sortImportsPreservingComments',
        );
      }
    }),
  );
}

export function deactivate() {
  // nothing to do
}
