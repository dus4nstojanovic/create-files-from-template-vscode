import * as vscode from "vscode";
import { getOrCreateConfig } from "@beezydev/create-files-from-template-base/config";
import { createAllDirectoriesAndFilesFromTemplate } from "@beezydev/create-files-from-template-base/files";
import { getOptions } from "./options";

export function activate(context: vscode.ExtensionContext) {
  const cfftExecuteCommand = vscode.commands.registerCommand(
    "cfft.newFileFromTemplate",
    async (uri: vscode.Uri) => {
      const currentFolderPath = uri.fsPath;

      const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

      const { config, created } = await getOrCreateConfig({
        currentFolderPath,
        cfftFolderPath: rootPath,
      });

      if (created) {
        vscode.window.showInformationMessage(
          `cfft.config.json has been created!`
        );
        return;
      }

      try {
        const options = await getOptions(config);

        await createAllDirectoriesAndFilesFromTemplate(
          currentFolderPath,
          options,
          rootPath,
        );
      } catch (e) {
        if (e.message === "Aborted") return;

        vscode.window.showErrorMessage(e.message);
      }
    }
  );

  context.subscriptions.push(cfftExecuteCommand);
}
