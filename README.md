# eslint-plugin-coffeescript-es7

Transpiles .coffee and .cjsx files before with coffeescript, then runs eslint checks on them.
The plugin ignores some rules that are impossible to satisfy from coffeescript (see [this file](lib/index.js#L22))

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-coffeescript-es7`:

```
$ npm install eslint-plugin-coffeescript-es7 --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-coffeescript-es7` globally.

## Usage

Add `coffeescript` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json5
{
    "plugins": [
        "coffeescript", // ...
    ]
}
```

To have imports resolve properly with the `eslint-plugins-imports` module, you must set this plugin to wrap your default parser:
```json5
{
  "parser": "eslint-plugin-coffeescript-es7",
  "parserOptions": { 
    "parser": "babel-eslint", // original parser goes here (you must specify one to use this option).
    "sourceType": "module", // any original parser config options you had.
    "ecmaVersion": 6
  }
}
```

## Contributors

Big thanks for awesome contributors:
- [@aminland](https://github.com/aminland)
- [@ericls](https://github.com/ericls)
