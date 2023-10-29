# notion-to-slides

A simple script to convert a Notion.so page to a Marp Slides presentation.

## Usage

```bash
$ npm i @kromiii/notion-to-slides
$ npx notion-to-slides --url [your notion page url] --output [output file name]
```

## Example

```bash
$ npx notion-to-slides --url https://www.notion.so/Notion-Test-Page-1-0b0e1e1e1e1e1e1e1e1e1e1e1e1e1e1 --output test
```

## Options

| Option | Description | Default |
| --- | --- | --- |
| `--url` | The Notion page URL to convert | `undefined` |
| `--output` | The output file name | `output` |
| `--theme` | The Marp theme to use | `gaia` |

## License

MIT
