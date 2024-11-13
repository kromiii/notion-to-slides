#!/usr/bin/env node

import yargs from 'yargs'
import express from 'express'; 

import notion2md from './notion2md';
import md2slides from './md2slides';
import { getPageId } from './utils';

const args = yargs
  .scriptName('notion2slides')
  .usage('Usage: $0 <command> [options]')
  .option('url', {
    alias: 'u',
    describe: 'The url of the Notion page to convert',
    type: 'string',
    demandOption: true
  })
  .option('theme', {
    alias: 't',
    describe: 'The theme to use for the slides',
    type: 'string',
    default: 'default',
    demandOption: false
  })
.option('port', {
    alias: 'p',
    describe: 'The port to use for the server',
    type: 'number',
    default: 8080,
    demandOption: false
  })
  .help()
  .parseSync()

// check the env variable
const NOTION_TOKEN: string | undefined = process.env.NOTION_TOKEN;
if (!NOTION_TOKEN) {
  console.error('Please set the NOTION_TOKEN env variable')
  process.exit(1)
}

// get the url and extract page id from it
const url = args.url as string;
const pageId = getPageId(url);

// get the theme from the --theme flag
const theme = args.theme as string;

// prepare to open the file in the browser
// const opener = require('opener');

// download the page and convert it to markdown slides
const app = express();
console.debug('args.port', args.port);
const port = args.port as number;

app.get('/', async (req: express.Request, res: express.Response) => {
  const mdString = await notion2md(pageId, NOTION_TOKEN);
  const htmlString = md2slides(mdString, theme);
  res.send(`
    <html>
    <head>
      <title>Notion to Slides</title>
      <script>
        setInterval(async () => {
          try {
            const response = await fetch('/');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const newHtmlString = await response.text();
            if (document.body.innerHTML !== newHtmlString) {
              document.body.innerHTML = newHtmlString;
              console.log('Page updated!');
            }
          } catch (error) {
            console.error('Error fetching updates:', error);
          }
        }, 5000);
      </script>
    </head>
    <body>
      ${htmlString}
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
