import notion2md from './notion2md';
import md2slides from './md2slides';
import { getPageId } from './utils';

const opener = require('opener');

// check the env variable
const NOTION_TOKEN: string | undefined = process.env.NOTION_TOKEN;
if (!NOTION_TOKEN) {
  console.error('Please set the NOTION_TOKEN env variable')
  process.exit(1)
}

// get the url and extract page id from it
const url = process.argv[2];
if (!url) {
  console.error('Please provide a url')
  process.exit(1)
}
const pageId = getPageId(url);

// download the page and convert it to markdown slides
(async () => {
  const mdString = await notion2md(pageId, NOTION_TOKEN);
  const tmpFilePath = md2slides(mdString);
  opener(tmpFilePath);
})();