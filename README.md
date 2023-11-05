# notion-to-slides

A simple npm script to convert a Notion page to a Marp Slides presentation.

H1 and H2 Heading in the notion page will be used as the slide title, and the rest of the content will be used as the slide body.

The sample notion page is [here](https://khiroyuki1993.notion.site/CTOA-LT-4-c2769d7bc90a4f428adae7a2192d258a?pvs=4) and the converted slides are [here](https://www.docswell.com/s/kromiii/ZP9JW2-2023-10-24-213756).

## Usage

### 1. Prepare the notion token

1. Create an [integration token](https://www.notion.so/my-integrations) in Notion
1. Open the Notion page you want to convert
1. Add your integration to the page

### 2. Set the notion token to the environment variable

```bash
$ export NOTION_TOKEN=[your notion token]
```

### 3. Install and run the script

```bash
$ npx @kromiii/notion-to-slides --url [your notion page url] --theme [marp theme]
```

You can change the theme by setting the `--theme` option. The default theme is `default`.

Available themes are: default, uncover, and gaia. See [Marp Core Themes](https://github.com/marp-team/marp-core/tree/main/themes) for more details.

### 4. Check and export the slides as pdf

Once the script is finished, it will open the browser with the slides. You can check the slides by clicking the "Print" button (cmd + P on Mac). Then you can export the slides as pdf.

## Example

```bash
$ npx notion-to-slides --url https://www.notion.so/khiroyuki1993/CTOA-LT-4-c2769d7bc90a4f428adae7a2192d258a --theme uncover
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
