# CFFT - Create Files From Template

Create Files From Template is a simple but powerful Visual Studio Code extension to generate a list of files from templates.

Stop copying/pasting and renaming files and folders or creating these manually, repeating the same file structures every time. CFFT generates custom file structure easily and quickly.

You can use this extension for any language or framework (JavaScript, Node, React, Angular, .NET, Java, Python, ...)

## Features

- Create a custom file structure from a context menu command
- **Search and replace** - Replace file content with a custom text or file name (text, regex, inject files, ...)
- Create **multiple templates**
- Set **options** by configuring extension using a .**config JSON file** for each template - _cfft.config.json_, or:
- Provide missing options by answering IDE questions

## Releases

See [Releases](https://github.com/dus4nstojanovic/create-files-from-template-vscode/releases/) to see what is changed in the latest version.

## Related repositories

[Create Files From Template CLI](https://github.com/dus4nstojanovic/create-files-from-template-cli) - CLI - Use a terminal to create a list of files from templates.
[Create Files From Template Base](https://github.com/dus4nstojanovic/create-files-from-template-base) - Includes core utilities required for CFFT apps to work.

## Table of contents

- [Getting started (Tutorial)](#getting-started-tutorial)
- [Filling the missing configuration options](#filling-the-missing-configuration-options)
- [Search and replace - replace multiple placeholders](#search-and-replace---replace-multiple-placeholders)
- [Inject a file content](#injecting-a-file-content)
- [The order of the search and replace execution](#the-order-of-the-search-and-replace-execution)
- [Ignoring the case of the letters on text searching](#ignoring-the-case-of-the-letters-on-text-searching)
- [Using the special replacement placeholders](#using-the-special-replacement-placeholders)
- [Custom hooks](#custom-hooks)
- [Creating a single file](#creating-a-single-file)
- [Configuration](#configuration)
- [Search and replace options](#search-and-replace-options)
- [Special replacement placeholders](#special-replacement-placeholders)
- [Placeholders](#placeholders)

## Getting started (Tutorial)

1. Create a configuration file - _cfft.config.json_. It can be done automatically (recommended), or you can do it manually.

2. **Click on any directory in your project** and select **New From Template... (CFFT)**:

You should see the message that _cfft.config.json_ is created with a default values prefilled:

```json
{
  "defaultTemplateName": "component",
  "templates": [
    {
      "name": "component",
      "options": {
        "templatePath": "/.cfft.templates/component",
        "dirPath": "./{fileName}",
        "fileNameTextToBeReplaced": "component",
        "searchAndReplace": [
          {
            "search": "FileName",
            "replace": "{fileName}"
          }
        ]
      }
    }
  ]
}
```

You can edit these values however you want. See the _Options_ section where it is explained which options exist.

Additionally, this command also creates the `.cfft.templates` directory and the `component` files for demo purposes.

> Feel free to edit or remove these files.

3. At this moment, the configuration for demo purposes is ready, and you can start using the extension. To see how it works, right click on any directory in your project and select **New From Template... (CFFT)**. Enter any file name you want (for example "Test") and confirm. The extension should generate a new directory and two files inside with updated content:

```
├── [YOUR DIRECTORY]
│   ├── Test
│   │   ├── Test.tsx
│   │   ├── Test.module.scss
```

4. The next step is to create your templates (you can create one or more templates). Let's use a default `templatePath`. In your _root_ folder, create the following structure:

```
├── .cfft.templates
│   ├── component
│   │   ├── component.tsx
│   │   ├── component.styles.ts
│   │   ├── index.ts
```

> Note: You can also create inner folders. For example:

```
├── .cfft.templates
│   ├── component
│   │   ├── component-inner
│   │   │   ├── component-inner.styles.tsx
│   │   │   ├── component-inner.tsx
│   │   │   ├── index.ts
│   │   ├── component.tsx
│   │   ├── component.styles.ts
│   │   ├── index.ts
```

> Note: If you use **GIT**, you can ignore cfft.config.json and your templates if you wish to.

5. Insert some content into your newly created files `component.tsx`, `component.styles.ts` and `index.ts`:

_component.styles.ts_

```js
export const style = {
  backgroundColor: "black",
  color: "white",
};
```

_component.tsx_

```js
import React, { FC } from "react";
import { style } from "./FileName.styles";

const FileName: FC = () => {
  return (
    <div style={style}>
      <p>TODO: FileName</p>
    </div>
  );
};

export default FileName;
```

_index.ts_

```js
export { default } from "./FileName";
```

6. Right click on any directory in which you want to create files and choose **New From Template... (CFFT)**.

7. Enter a file name. For example `MyFile`.

8. CFFT Extensions created new files in the selected folder.

```
├── [SELECTED FOLDER]
│   ├── MyFile
│   │   ├── MyFile.tsx
│   │   ├── MyFile.styles.ts
│   │   ├── index.ts
```

Additionally, the extension replaced the _FileName_ text with the entered file name:

_MyFile.styles.ts_ (unchanged)

```js
export const style = {
  backgroundColor: "black",
  color: "white",
};
```

_MyFile.tsx_

```js
import React, { FC } from "react";
import { style } from "./MyFile.styles";

const MyFile: FC = () => {
  return (
    <div style={style}>
      <p>TODO: MyFile</p>
    </div>
  );
};

export default MyFile;
```

_index.ts_

```js
export { default } from "./MyFile";
```

## Filling the missing configuration options

CFFT Extension is interactive. You can remove all default options from your template, and CFFT extension will ask you for missing information every time you run it.

### Example

_If you were following the previous example, remove the MyFile folder._

1. Remove all options from your **cfft.config.json** file:

```json
{}
```

2. Right click in the `root` folder in your project and select **New From Template... (CFFT)**.

3. Answer questions:

```sh
? Enter template name: component
? Enter file name: MyFile
? Enter dir path: ./MyFile
? Enter template path: /.cfft.templates/component
? Should replace file name text? Yes
? Enter file name text to be replaced: component
? Should replace text? Yes
? Enter text to be replaced: FileName
? Replace text with: MyFile
```

4. The extension will create files using the provided options.

## Search and replace - replace multiple placeholders

CFFT extension allows you to search and replace multiple placeholders. This is possible by adding the additional items in the `searchAndReplace` array.

### Example

_If you were following one of the previous examples, remove the MyFile folder._

1. Update the `searchAndReplace` in the **cfft.config.json**:

```json
{
  "defaultTemplateName": "component",
  "templates": [
    {
      "name": "component",
      "options": {
        "templatePath": "/.cfft.templates/component",
        "dirPath": "./{fileName}",
        "fileNameTextToBeReplaced": "component",
        "searchAndReplace": [
          {
            "search": "FileName",
            "replace": "{fileName}"
          },
          {
            "search": "FC",
            "replace": "FunctionComponent"
          }
        ]
      }
    }
  ]
}
```

- An alternative is to enter the list of placeholders and replacement values separated by the `searchAndReplaceSeparator` character to both `textToBeReplaced` and `replaceTextWith`:

```json
{
  "defaultTemplateName": "component",
  "templates": [
    {
      "name": "component",
      "options": {
        "templatePath": "/.cfft.templates/component",
        "dirPath": "./{fileName}",
        "fileNameTextToBeReplaced": "component",
        "searchAndReplaceSeparator": ";",
        "textToBeReplaced": "FileName;FC",
        "replaceTextWith": "{fileName};FunctionComponent"
      }
    }
  ]
}
```

> Note: It is important that textToBeReplaced and replaceTextWith have the same number of segments.

2. Execute the **New From Template... (CFFT)** command:

3. The extension will create files and replace both, _FileName_ with _MyFile_ and _FC_ with _FunctionComponent_.

```js
import React, { FunctionComponent } from "react";
import { style } from "./MyFile.styles";

const MyFile: FunctionComponent = () => {
  return (
    <div style={style}>
      <p>TODO: MyFile</p>
    </div>
  );
};

export default MyFile;
```

## Add additional templates

While you can use only one template, it is also possible to create and use multiple templates. To achieve this, you need to create the template folder and files, to update the **cfft.config.json** and to select the `--template` when VS Code extension asks you.

> Note: If the `defaultTemplateName` is not specified in the configuration and multiple templates are defined, the extension will ask for the template name. The extension will use the first template if only one template has been defined.

### Example

_If you were following one of the previous examples, remove the MyFile folder._

1. Add a new template folder next to the existing one - **css**, and add a file inside it **main.scss** (in the **.cfft.templates** folder):

```
├── .cfft.templates
│   ├── component
│   │   ├── component.tsx
│   │   ├── component.styles.ts
│   │   ├── index.ts
│   ├── css
│   │   ├── main.scss
```

2. Fill the file content:

_main.scss_

```scss
#root {
  box-sizing: border-box;
}
```

3. Update the **cfft.config.json** file:

```json
{
  "defaultTemplateName": "component",
  "templates": [
    {
      "name": "component",
      "options": {
        "templatePath": "/.cfft.templates/component",
        "dirPath": "./{fileName}",
        "fileNameTextToBeReplaced": "component",
        "searchAndReplace": [
          {
            "search": "FileName",
            "replace": "{fileName}"
          },
          {
            "search": "FC",
            "replace": "FunctionComponent"
          }
        ]
      }
    },
    {
      "name": "css",
      "options": {
        "templatePath": "/.cfft.templates/css",
        "dirPath": "./{fileName}",
        "shouldReplaceFileContent": false,
        "shouldReplaceFileName": false
      }
    }
  ]
}
```

4. Execute the **New From Template... (CFFT)** command:

5. Select the template: `css`.

6. Enter the file name: `my-styles`.

7. The CFFT extension will generate the following folder and file in selected directory:

```
├── [SELECTED DIRECTORY]
│   ├── my-styles
│   │   ├── main.scss
```

The **main.scss**, will be exactly the same, since we were not replacing the file content.

## Injecting a file content

Besides replacing the placeholders with text, it is possible to do the replacement with the file content. To inject the file content, set the `injectFile` to **true**.

### Example

_If you were following one of the previous examples, remove the MyFile folder._

1. Add the **table.html** file to **.cfft.templates** directory:

```
├── .cfft.templates
│   ├── component
│   │   ├── component.tsx
│   │   ├── component.styles.ts
│   │   ├── index.ts
│   ├──table.html
```

_table.html_

```html
<table>
  <thead>
    <tr>
      <th>Head 1</th>
      <th>Head 2</th>
      <th>Head 3</th>
      <th>Head 4</th>
      <th>Head 5</th>
    </tr>
  </thead>
  <tr>
    <td>Cell 1.1</td>
    <td>Cell 1.2</td>
    <td>Cell 1.3</td>
    <td>Cell 1.4</td>
    <td>Cell 1.5</td>
  </tr>
  <tr>
    <td>Cell 2.1</td>
    <td>Cell 2.2</td>
    <td>Cell 2.3</td>
    <td>Cell 2.4</td>
    <td>Cell 2.5</td>
  </tr>
</table>
```

2. Update the template file:

_component.tsx_

```js
import { FC } from "react";
import { style } from "./FileName.styles";

const FileName: FC = () => {
  return (
    <div style={style}>
      <p>TODO: FileName</p>

      {table}
    </div>
  );
};

export default FileName;
```

3. Update the **cfft.config.json**:

```json
{
  "defaultTemplateName": "component",
  "templates": [
    {
      "name": "component",
      "options": {
        "templatePath": "/.cfft.templates/component",
        "dirPath": "./{fileName}",
        "fileNameTextToBeReplaced": "component",
        "searchAndReplace": [
          {
            "search": "{table}",
            "replace": "/.cfft.templates/table.html",
            "injectFile": true
          }
        ]
      }
    }
  ]
}
```

4. Execute the **New From Template... (CFFT)** command.

5. The extension will create files and inject the table in the _MyFile.tsx_ file:

```js
import { FC } from "react";
import { style } from "./FileName.styles";

const FileName: FC = () => {
  return (
    <div style={style}>
      <p>TODO: FileName</p>

      <table>
        <thead>
          <tr>
            <th>Head 1</th>
            <th>Head 2</th>
            <th>Head 3</th>
            <th>Head 4</th>
            <th>Head 5</th>
          </tr>
        </thead>
        <tr>
          <td>Cell 1.1</td>
          <td>Cell 1.2</td>
          <td>Cell 1.3</td>
          <td>Cell 1.4</td>
          <td>Cell 1.5</td>
        </tr>
        <tr>
          <td>Cell 2.1</td>
          <td>Cell 2.2</td>
          <td>Cell 2.3</td>
          <td>Cell 2.4</td>
          <td>Cell 2.5</td>
        </tr>
      </table>
    </div>
  );
};

export default FileName;
```

## The order of the search and replace execution

In some cases, the replacement order may matter. For example, you may want to inject file content and after that to replace parts of it.

### Default orders

| **Method**                             | **Order** |
| :------------------------------------- | :-------: |
| _textToBeReplaced_ & _replaceTextWith_ |     0     |
| searchAndReplace                       |     1     |
| Special replacement placeholders       |   last    |

### Example

_If you were following one of the previous examples, remove the MyFile folder._

1. Update the **cfft.config.json** file:

```json
{
  "defaultTemplateName": "component",
  "templates": [
    {
      "name": "component",
      "options": {
        "templatePath": "/.cfft.templates/component",
        "dirPath": "./{fileName}",
        "fileNameTextToBeReplaced": "component",
        "searchAndReplace": [
          {
            "search": "{table}",
            "replace": "/.cfft.templates/table.html",
            "injectFile": true,
            "order": -2
          },
          { "search": "Cell 1.5", "replace": "HELLO!", "order": -1 }
        ]
      }
    }
  ]
}
```

2. Execute the **New From Template... (CFFT)** command and enter the file name: `MyFile`.

3. The extension will create files and inject the table in the _MyFile.tsx_ file:

```js
import { FC } from "react";
import { style } from "./FileName.styles";

const FileName: FC = () => {
  return (
    <div style={style}>
      <p>TODO: FileName</p>

      <table>
        <thead>
          <tr>
            <th>Head 1</th>
            <th>Head 2</th>
            <th>Head 3</th>
            <th>Head 4</th>
            <th>Head 5</th>
          </tr>
        </thead>
        <tr>
          <td>Cell 1.1</td>
          <td>Cell 1.2</td>
          <td>Cell 1.3</td>
          <td>Cell 1.4</td>
          <td>HELLO!</td>
        </tr>
        <tr>
          <td>Cell 2.1</td>
          <td>Cell 2.2</td>
          <td>Cell 2.3</td>
          <td>Cell 2.4</td>
          <td>Cell 2.5</td>
        </tr>
      </table>
    </div>
  );
};

export default FileName;
```

## Ignoring the case of the letters on text searching

By default, searching by text is case-sensitive. You can change this behavior by using the `ignoreCase` option. For example:

```json
"searchAndReplace": [
  { "search": "FileName", "replace": "{fileName}", "ignoreCase": true }
]
```

## Using the special replacement placeholders

The special replacement placeholders (for example: _{env:ENV_VARIABLE_NAME}_ or _{dateTimeNow:DNS_FORMAT}_) are replaced as the last replacement task. See the **Special replacement placeholders** table for more info. This allows you to add specific or dynamic values during the file creation.

### Example

_If you were following one of the previous examples, remove the MyFile folder._

1. Add environment variables or use the existing ones. In this example, we are going to use _TEST_ENV=myEnv_ and _ANOTHER_ENV=anotherEnv_.

2. Update your template by adding the following tags:

_component.tsx_

```js
import { FC } from "react";
import { style } from "./FileName.styles";

const FileName: FC = () => {
  return (
    <div style={style}>
      <p>My env variable: {env:TEST_ENV} and {env:ANOTHER_ENV}</p>
      <p>{dateTimeNow:yyyy-MM-dd}</p>
    </div>
  );
};

export default FileName;
```

3. Execute the **New From Template... (CFFT)** command and enter the file name: `MyFile`.

4. The extension will create files and replace the special tags with the values in the _MyFile.tsx_ file:

```js
import { FC } from "react";
import { style } from "./MyFile.styles";

const MyFile: FC = () => {
  return (
    <div style={style}>
      <p>My env variable: myEnv and anotherEnv</p>
      <p>2023-05-06</p>
    </div>
  );
};

export default MyFile;
```

## Custom hooks

### onFileCreated

CFFT allows you to specify the custom logic to be executed after each file creation. To achieve so, you should create a custom `.js` file and implement and export the `onFileCreated()` function. This can be used for various tasks, but one logical and useful task is to use the prettier.

#### Example

_If you were following one of the previous examples, remove the MyFile folder._

> Note: If you want to implement the same behavior make sure to install and configure the prettier for your project.

1. Update your _package.json_ by adding the `node script`:

_package.json_

```json
"scripts": {
  "prettier:only": "prettier",
}
```

2. Update the **cfft.config.json** file:

```json
{
  "defaultTemplateName": "component",
  "templates": [
    {
      "name": "component",
      "options": {
        "templatePath": "/.cfft.templates/component",
        "dirPath": "./{fileName}",
        "fileNameTextToBeReplaced": "component",
        "hooksPath": "/.cfft.templates/hooks/component.js",
        "searchAndReplace": [
          {
            "search": "{table}",
            "replace": "/.cfft.templates/table.html",
            "injectFile": true,
            "order": -2
          },
          { "search": "Cell 1.5", "replace": "HELLO!", "order": -1 }
        ]
      }
    }
  ]
}
```

3. Add the `component.js` file:

```
├── .cfft.templates
│   ├── component
│   │   ├── component.tsx
│   │   ├── component.styles.ts
│   │   ├── index.ts
│   ├── hooks
│   │   ├── component.js
│   ├──table.html
```

_component.js_

```js
const { execSync } = require("child_process");

const onFileCreated = ({ filePath, templatePath }) => {
  // Run prettier on a created file
  execSync(`npm run prettier:only -- ${filePath} --write`);
};

module.exports = {
  onFileCreated,
};
```

> Note: In this example, we are executing the prettier, but you can specify whatever logic you want.

5. Execute the **New From Template... (CFFT)** command and enter the file name: `MyFile`.

6. The extension will create files and execute the `onFileCreated()` hook for each created file!

## Creating a single file

It is also useful to create a single file. To achieve that, the `templatePath` must point to a file. To create a file in the current folder, update the `dirPath` to `.`.

### Example

1. Add a `component.styles.tsx` file to you templates folder:

```
├── .cfft.templates
│   ├── component
│   │   ├── component.tsx
│   │   ├── component.styles.ts
│   │   ├── index.ts
│   ├── hooks
│   │   ├── component.js
│   ├──table.html
│   ├──component.styles.tsx
```

_component.styles.tsx_

```js
import { styled } from "@mui/material";

const COMPONENT_NAME = "FileName";

export const FileNameRoot = styled("div", {
  name: COMPONENT_NAME,
  slot: "Root",
})(({ theme }) => ({}));
```

2. Add a new template to the **cfft.config.json** file:

```json
{
  "defaultTemplateName": "component-styles-file",
  "templates": [
    {
      "name": "component-styles-file",
      "options": {
        "templatePath": "/.cfft.templates/component.styles.tsx",
        "dirPath": ".",
        "fileNameTextToBeReplaced": "component",
        "searchAndReplace": [{ "search": "FileName", "replace": "{fileName}" }]
      }
    }
  ]
}
```

3. Execute the **New From Template... (CFFT)** command and enter the file name: `_MyComponent`.

4. The extension will create the `MyComponent.styles.tsx` file and replace the _FileName_ with the provided name (_MyComponent_) file:

_MyComponent.styles.tsx_

```js
import { styled } from "@mui/material";

const COMPONENT_NAME = "MyComponent";

export const MyComponentRoot = styled("div", {
  name: COMPONENT_NAME,
  slot: "Root",
})(({ theme }) => ({}));
```

## The cfft.config.json structure

```json
{
  "defaultTemplateName": "component",
  "templates": [
    {
      "name": "component",
      "options": {
        "templatePath": "/.cfft.templates/component",
        "dirPath": "./{fileName}",
        "fileNameTextToBeReplaced": "component",
        "searchAndReplace": [
          {
            "search": "FileName",
            "replace": "{fileName}"
          }
        ]
      }
    }
  ]
}
```

## Configuration

### Root fields

| **Command**             | **Description**                  | **Type** |
| :---------------------- | :------------------------------- | :------- |
| **defaultTemplateName** | Default template name to be used | string   |
| **templates**           | List of template configurations  | array    |

### Template fields

| **Command** | **Description**          | **Type** |
| :---------- | :----------------------- | :------- |
| **name**    | Template name            | string   |
| **options** | List of template options | object   |

### Template options

| **Command**                   | **Description**                                                                | **Type** |
| :---------------------------- | :----------------------------------------------------------------------------- | :------- |
| **dirPath**                   | Path to the location where to generate files                                   | string   |
| **templatePath**              | Path to the specific template folder                                           | string   |
| **shouldReplaceFileName**     | Should or not extension replace a file name                                    | boolean  |
| **fileNameTextToBeReplaced**  | Which part of the file name should be replaced                                 | string   |
| **shouldReplaceFileContent**  | Should or not extension replace a file content                                 | boolean  |
| **textToBeReplaced**          | Text (or regex) to be replaced separated by a search and replace separator     | string   |
| **replaceTextWith**           | Text to be used for replacement separated by a separator                       | string   |
| **searchAndReplaceSeparator** | Custom separator for search and replace                                        | string   |
| **searchAndReplace**          | Add additional search and replace items through config (with extended options) | array    |

### Search and replace options

| **Description**                                                              | **Field**      | **required** | **default** |
| :--------------------------------------------------------------------------- | :------------- | :----------: | :---------: |
| Text (or regex) to be replaced                                               | **search**     |      ✓       |             |
| Text to be used for replacement - or path to the file when _injectFile=true_ | **replace**    |      ✓       |             |
| Should ignore the letters case                                               | **ignoreCase** |              |    false    |
| Should inject a file content at the found placeholder                        | **injectFile** |              |    false    |
| In which order to do the search and replace (lower order has precedence)     | **order**      |              |      1      |

## Special replacement placeholders

| **Tag**                       | **Description**                                                                                                                                         |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| {env:ENV_VARIABLE_NAME}       | Replaces the placeholder with the specified environment variable                                                                                        |
| {dateTimeNow:DATE_FNS_FORMAT} | Replaces the placeholder with the current date and time using the **date-fns** format. See: [date-fns format](https://date-fns.org/v2.29.3/docs/format) |

### Placeholders

- **{fileName}** is a special value to indicate that specific text should be replaced with a specified file name (_--fileName_)

## License

MIT
