import {
  Config,
  getTemplateFromConfig,
  TemplateConfig,
} from "@beezydev/create-files-from-template-base/config";
import {
  getConfirmArg,
  getInputArg,
  getTemplatesQuickPickItems,
  setArg,
} from ".";
import { Options } from "@beezydev/create-files-from-template-base/options";
import { DEFAULT_LABEL, ExtensionArg } from "./options.constants";
import * as vscode from "vscode";
import path from "path";

/**
 * Gets all option using the provided configuration, console arguments or inputs
 * @param config The configuration read from the cfft.config.json file
 * @returns All provided options
 */
export const getOptions = async (config: Config): Promise<Options> => {
  let answers: Partial<Options> = {};

  answers = await getTemplateName({ config, answers });

  const templateConfig = getTemplateFromConfig(
    config,
    (answers as Options)[ExtensionArg.TEMPLATE_NAME]
  );

  answers = await getFileName(answers);

  answers = await getDirPath({ templateConfig, answers });

  answers = await getTemplatePath({ config, templateConfig, answers });

  // abort in case of missing required data
  if (
    !templateConfig ||
    !answers.fileName ||
    !answers.dirPath ||
    !answers.templatePath
  ) {
    throw new Error("Aborted");
  }

  answers = await getFileNameTextReplacement({ templateConfig, answers });

  answers = await getFileContentTextReplacement({ templateConfig, answers });

  answers = getSearchAndReplaceCharacter({ templateConfig, answers });

  answers = getSearchAndReplaceItems({ templateConfig, answers });

  answers.hooksPath = templateConfig?.options?.hooksPath;

  answers.configDir = config.folder;

  return answers as Options;
};

const getTemplateName = async ({
  config,
  answers,
}: {
  config: Config;
  answers: Partial<Options>;
}): Promise<Partial<Options>> => {
  const templates = getTemplatesQuickPickItems(config);

  let templateName: string;
  if (templates.length > 1) {
    const templateQuickPick = await vscode.window.showQuickPick(templates);

    templateName = templateQuickPick?.label;

    if (config?.defaultTemplateName && templateName.includes(DEFAULT_LABEL)) {
      templateName = templateName.replace(DEFAULT_LABEL, "").trim();
    }
  } else {
    templateName = templates?.[0]?.label;
  }

  answers = setArg(ExtensionArg.TEMPLATE_NAME, templateName, answers);

  return answers;
};

const getFileName = async (
  answers: Partial<Options>
): Promise<Partial<Options>> => {
  answers = await getInputArg({
    arg: ExtensionArg.FILE_NAME,
    message: "Enter file name:",
    answers,
  });

  return answers;
};

const getDirPath = async ({
  templateConfig,
  answers,
}: {
  templateConfig: TemplateConfig | undefined;
  answers: Partial<Options>;
}): Promise<Partial<Options>> => {
  answers = await getInputArg({
    arg: ExtensionArg.DIR_PATH,
    message: "Enter dir path:",
    answers,
    defaultValue: `./${answers[ExtensionArg.FILE_NAME]}`,
    templateConfig,
  });

  return answers;
};

const getTemplatePath = async ({
  config,
  templateConfig,
  answers,
}: {
  config: Config;
  templateConfig: TemplateConfig | undefined;
  answers: Partial<Options>;
}): Promise<Partial<Options>> => {
  answers = await getInputArg({
    arg: ExtensionArg.TEMPLATE_PATH,
    message: "Enter template path:",
    answers,
    templateConfig,
  });

  if (answers[ExtensionArg.TEMPLATE_PATH].startsWith("/")) {
    answers[ExtensionArg.TEMPLATE_PATH] = path.join(
      config.folder,
      answers[ExtensionArg.TEMPLATE_PATH]
    );
  }

  return answers;
};

const getFileNameTextReplacement = async ({
  templateConfig,
  answers,
}: {
  templateConfig: TemplateConfig | undefined;
  answers: Partial<Options>;
}): Promise<Partial<Options>> => {
  const hasFileNameTextToBeReplaced =
    !!templateConfig?.options?.[ExtensionArg.FILE_NAME_TEXT_TO_BE_REPLACED];

  const shouldAskForReplaceFileName =
    templateConfig?.options?.[ExtensionArg.SHOULD_REPLACE_FILE_NAME] !== false;

  if (!hasFileNameTextToBeReplaced && shouldAskForReplaceFileName) {
    answers = await getConfirmArg({
      arg: ExtensionArg.SHOULD_REPLACE_FILE_NAME,
      message: "Should replace file name text?",
      answers,
      templateConfig,
    });
  } else {
    answers = setArg(
      ExtensionArg.SHOULD_REPLACE_FILE_NAME,
      hasFileNameTextToBeReplaced,
      answers
    );
  }

  if (answers[ExtensionArg.SHOULD_REPLACE_FILE_NAME]) {
    answers = await getInputArg({
      arg: ExtensionArg.FILE_NAME_TEXT_TO_BE_REPLACED,
      message: "Enter file name text to be replaced:",
      answers,
      templateConfig,
    });
  }

  return answers;
};

const getFileContentTextReplacement = async ({
  templateConfig,
  answers,
}: {
  templateConfig: TemplateConfig | undefined;
  answers: Partial<Options>;
}): Promise<Partial<Options>> => {
  const hasSearchAndReplaceItems =
    !!templateConfig?.options?.searchAndReplace?.length;

  const hasTextToBeReplaced =
    !!templateConfig?.options?.[ExtensionArg.TEXT_TO_BE_REPLACED] ||
    hasSearchAndReplaceItems;

  const shouldAskForReplaceFileContent =
    templateConfig?.options?.[ExtensionArg.SHOULD_REPLACE_FILE_CONTENT] !==
      false && !hasSearchAndReplaceItems;

  if (!hasTextToBeReplaced && shouldAskForReplaceFileContent) {
    answers = await getConfirmArg({
      arg: ExtensionArg.SHOULD_REPLACE_FILE_CONTENT,
      message: "Should replace text?",
      answers,
      templateConfig,
    });
  } else {
    answers = setArg(
      ExtensionArg.SHOULD_REPLACE_FILE_CONTENT,
      hasTextToBeReplaced,
      answers
    );
  }

  if (answers[ExtensionArg.SHOULD_REPLACE_FILE_CONTENT]) {
    answers = await getInputArg({
      arg: ExtensionArg.TEXT_TO_BE_REPLACED,
      message: "Enter text to be replaced:",
      answers,
      templateConfig,
      shouldAsk: !hasSearchAndReplaceItems,
    });

    answers = await getInputArg({
      arg: ExtensionArg.REPLACE_TEXT_WITH,
      message: `Replace text with:`,
      answers,
      defaultValue: answers[ExtensionArg.FILE_NAME],
      templateConfig,
      shouldAsk: !hasSearchAndReplaceItems,
    });
  }

  return answers;
};

const getSearchAndReplaceCharacter = ({
  templateConfig,
  answers,
}: {
  templateConfig: TemplateConfig | undefined;
  answers: Partial<Options>;
}): Partial<Options> => {
  answers[ExtensionArg.SEARCH_AND_REPLACE_SEPARATOR] =
    templateConfig?.options?.[ExtensionArg.SEARCH_AND_REPLACE_SEPARATOR] || ";";

  return answers;
};

const getSearchAndReplaceItems = ({
  templateConfig,
  answers,
}: {
  templateConfig: TemplateConfig | undefined;
  answers: Partial<Options>;
}): Partial<Options> => {
  answers.searchAndReplace = templateConfig?.options?.searchAndReplace?.map(
    (sr) => ({
      ...sr,
      replace: sr.replace?.replace(
        new RegExp("{fileName}", "g"),
        answers[ExtensionArg.FILE_NAME]
      ),
    })
  );

  return answers;
};
