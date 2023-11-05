# notion-to-slides

A simple npm script to convert a Notion page to a Marp Slides presentation.

## Usage

### 1. Prepare the notion token

1. Create an [integration token](https://www.notion.so/my-integrations) in Notion
1. Open the Notion page you want to convert
1. Add your integration token by connections

### 2. Set the notion token to the environment variable

```bash
$ export NOTION_TOKEN=[your notion token]
```

### 3. Install and run the script

```bash
$ npx @kromiii/notion-to-slides --url [your notion page url] --theme [marp theme]
```

### 4. Check and export the slides as pdf

Once the script is finished, it will open the browser with the slides. You can check the slides by clicking the "Print" button (cmd + P on Mac). Then you can export the slides as pdf.

## Example

```bash
$ npx notion-to-slides --url https://www.notion.so/khiroyuki1993/R-Github-Repository-041ce04de0874cc8bb116d525c69cf7b --theme uncover
```

## Options

| Option | Description | Default | Required |
| --- | --- | --- | --- |
| `--url` | The Notion page URL to convert | | `required` |
| `--theme` | The Marp theme to use | `default` | `optional` |

## Development

```bash
$ git clone
$ npm i
$ npm run build
$ node dist/index.js --url [your notion page url] --theme [marp theme]
```

## License

MIT
