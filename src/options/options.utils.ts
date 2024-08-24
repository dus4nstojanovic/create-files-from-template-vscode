import {
  Config,
  SearchAndReplaceItem,
  TemplateConfig,
} from "@beezydev/create-files-from-template-base/config";
import { DEFAULT_LABEL, ExtensionArg } from "./options.constants";
import { Options } from "@beezydev/create-files-from-template-base/options";
import { askConfirmQuestion, askInputQuestion } from "../questions";
import { QuickPickItem } from "vscode";

/**
 * Sets the argument and its value
 * @param arg The argument name to be set
 * @param value The value to be set
 * @param answers The current answers
 * @returns The updated answers
 */
export const setArg = (
  arg: ExtensionArg,
  value: any,
  answers: Partial<Options>
): Partial<Options> => {
  (answers[arg] as any) = value;
  return answers;
};

/**
 * Gets an input (text) arg
 * @param args.arg The argument name to be set
 * @param args.message The question to be asked
 * @param args.answers The current answers
 * @param args.templateConfig The selected template configuration
 * @param args.defaultValue The default value to be used if none is provided
 * @param args.shouldAsk Should ask the user if there is no value
 * @returns The updated answers
 */
export const getInputArg = (args: {
  arg: ExtensionArg;
  message: string;
  answers: Partial<Options>;
  templateConfig?: TemplateConfig;
  defaultValue?: any;
  shouldAsk?: boolean;
}): Promise<Partial<Options>> =>
  getArg({
    ...args,
    askCallback: askInputQuestion,
    templateConfig: args?.templateConfig,
    shouldAsk: args?.shouldAsk,
  });

/**
 * Gets a confirmation (yes/no) arg
 * @param args.arg The argument name to be set
 * @param args.message The question to be asked
 * @param args.answers The current answers
 * @param args.templateConfig The selected template configuration
 * @param args.defaultValue The default value to be used if none is provided
 * @param args.shouldAsk Should ask the user if there is no value
 * @returns The updated answers
 */
export const getConfirmArg = (args: {
  arg: ExtensionArg;
  message: string;
  answers: Partial<Options>;
  templateConfig?: TemplateConfig;
  defaultValue?: any;
  shouldAsk?: boolean;
}): Promise<Partial<Options>> =>
  getArg({
    ...args,
    askCallback: askConfirmQuestion,
    templateConfig: args?.templateConfig,
    shouldAsk: args?.shouldAsk,
  });

// const getAnswerFromArgs = (arg: CLIArg, answers: Answers): Answers => {
//   const value = extractArg(arg);
//   if (value) answers[arg] = value;
//   return answers;
// };

const getAnswerFromConfig = (
  arg: ExtensionArg,
  templateConfig: TemplateConfig | undefined,
  answers: Partial<Options>
): Partial<Options> => {
  const configValue =
    templateConfig?.options?.[arg as keyof typeof templateConfig.options];

  if (configValue) {
    (answers[arg] as string | true | SearchAndReplaceItem[]) = configValue;
  }

  return answers;
};

/**
 * Gets the argument in the following priority (Configuration -> Question and Answer)
 * @param param.arg The argument name
 * @param args.message The question to be asked
 * @param param.askCallback The callback with the question
 * @param args.answers The current answers
 * @param args.defaultValue The default value to be used if none is provided
 * @param args.templateConfig The selected template configuration
 * @param args.shouldAsk Should ask the user if there is no value
 * @returns The updated answers
 */
const getArg = async ({
  arg,
  message,
  askCallback,
  answers,
  defaultValue,
  templateConfig,
  shouldAsk = true,
}: {
  arg: ExtensionArg;
  message: string;
  askCallback: (
    name: string,
    message: string,
    answers: Partial<Options>,
    defaultValue?: any
  ) => Promise<Partial<Options>>;
  answers: Partial<Options>;
  defaultValue?: any;
  templateConfig: TemplateConfig | undefined;
  shouldAsk?: boolean;
}): Promise<Partial<Options>> => {
  // If answer was not provided, get the answer from the configuration file (cfft.config.json)
  if (answers[arg] === undefined) {
    answers = getAnswerFromConfig(arg, templateConfig, answers);
  }

  // If answer was not provided in arguments and configuration, ask for it
  if (answers[arg] === undefined && shouldAsk) {
    answers = await askCallback(arg, message, answers, defaultValue);
  }

  // Replace the {fileName} with the fileName answer (value)
  const shouldReplace =
    arg !== ExtensionArg.FILE_NAME && typeof answers[arg] === "string";
  if (shouldReplace) {
    const value = (answers[arg] as string).replace(
      new RegExp("{fileName}", "g"),
      answers[ExtensionArg.FILE_NAME]
    );

    (answers[arg] as string) = value;
  }

  return answers;
};

export const getTemplatesQuickPickItems = (config: Config): QuickPickItem[] => {
  const templates = config?.templates;
  const defaultTemplate = config?.defaultTemplateName;

  let items = templates?.map<QuickPickItem>((template) => ({
    label: template.name,
    description: template.description,
  }));

  if (items?.length) {
    if (defaultTemplate) {
      items = items.sort((current, next) =>
        current.label === defaultTemplate
          ? 1
          : next.label === defaultTemplate
          ? -1
          : 0
      );

      items[0].label = `${items[0].label}${DEFAULT_LABEL}`;
    }
  }

  return items;
};
