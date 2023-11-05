import { getPageId } from './utils';
import notion2md from './notion2md';
import md2slides from './md2slides';

const opener = require('opener');

// get the url and extract page id from it
const url = process.argv[2];
if (!url) {
  console.error('Please provide a url')
  process.exit(1)
}
const pageId = getPageId(url);


(async () => {
  const mdString = await notion2md(pageId);
  const tmpFilePath = md2slides(mdString);
  opener(tmpFilePath);
})();