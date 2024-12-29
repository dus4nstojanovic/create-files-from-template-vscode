import * as vscode from "vscode";
import { getOrCreateConfig } from "@beezydev/create-files-from-template-base/config";
import { createAllDirectoriesAndFilesFromTemplate } from "@beezydev/create-files-from-template-base/files";
import { getOptions } from "./options";
import path from 'path';
import fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const cfftExecuteCommand = vscode.commands.registerCommand(
    "cfft.newFileFromTemplate",
    async (uri: vscode.Uri) => {
      const currentFolderPath = uri.fsPath;

      const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;
      
      let configPaths: ReturnType<typeof getCFFTConfigPaths>;
      try {
        configPaths = getCFFTConfigPaths({ currentFolderPath, rootPath });
      } catch (e) {
        vscode.window.showErrorMessage(e.message);
        return;
      }

      const { config, created } = await getOrCreateConfig(configPaths);

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
          configPaths.cfftFolderPath,
        );
      } catch (e) {
        if (e.message === "Aborted") return;

        vscode.window.showErrorMessage(e.message);
      }
    }
  );

  context.subscriptions.push(cfftExecuteCommand);
}

/**
 * Retrieves the configuration paths for the CFFT folder.
 *
 * @param params - The input parameters containing the current folder path and root path.
 * @param params.currentFolderPath - The path to the current folder.
 * @param params.rootPath - The root path of the project.
 * @returns An object containing the resolved `currentFolderPath` and `cfftFolderPath`.
 * @throws Will throw an error if the resolved `cfftFolderPath` does not exist.
 */
function getCFFTConfigPaths({ currentFolderPath, rootPath }: { currentFolderPath: string, rootPath: string }) {
  const result = {
    currentFolderPath,
    cfftFolderPath: rootPath,
  };
      
  let cfftRootFolderFromConfig = vscode.workspace.getConfiguration("CFFT").get<string>("rootFolder");

  if (cfftRootFolderFromConfig) {
    cfftRootFolderFromConfig = path.normalize(cfftRootFolderFromConfig);

    result.cfftFolderPath = path.isAbsolute(cfftRootFolderFromConfig)
      ? cfftRootFolderFromConfig
      : path.join(rootPath, cfftRootFolderFromConfig);

    result.currentFolderPath = result.cfftFolderPath;

    if (!fs.existsSync(result.cfftFolderPath)) {
      throw Error(`cfft.rootFolder does not exist: ${cfftRootFolderFromConfig}`);
    }
  }

  return result;
}
