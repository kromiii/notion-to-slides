import { getPageId } from './utils';
import notion2md from './notion2md';
import md2slides from './md2slides';

const pageId = getPageId();
(async () => {
  const mdString = await notion2md(pageId);
  console.log(mdString);
  md2slides(mdString);
})();