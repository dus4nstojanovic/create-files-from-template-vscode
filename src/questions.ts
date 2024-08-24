import { Options } from "@beezydev/create-files-from-template-base/options";
import * as vscode from "vscode";
import { QuickPickItem } from "vscode";

/**
 * Asks the input (text) question
 * @param name The question name
 * @param message The question to be asked
 * @param answers The current answers
 * @param defaultValue The default value to be used if none is provided
 * @returns The updated answers
 */
export const askInputQuestion = async (
  name: string,
  message: string,
  answers: Partial<Options>,
  defaultValue?: string
): Promise<Partial<Options>> => {
  const answer = await vscode.window.showInputBox({
    prompt: message,
    value: defaultValue,
  });

  answers = { ...answers, [name]: answer };

  return answers;
};

/**
 * Asks the confirmation question (yes/no)
 * @param name The question name
 * @param message The question to be asked
 * @param answers The current answers
 * @returns The updated answers
 */
export const askConfirmQuestion = async (
  name: string,
  message: string,
  answers: Partial<Options>
): Promise<Partial<Options>> => {
  const quickPickAnswer = await vscode.window.showQuickPick(["Yes", "No"], {
    title: message,
  });

  answers = { ...answers, [name]: quickPickAnswer === "Yes" };

  return answers;
};
