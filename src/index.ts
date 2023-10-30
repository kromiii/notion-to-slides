import { getPageId } from './utils';
import notion2md from './notion2md';

const pageId = getPageId();
(async () => {
  const mdString = await notion2md(pageId);
  console.log(mdString);
})();