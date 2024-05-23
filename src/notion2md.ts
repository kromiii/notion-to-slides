// import { NotionToMarkdown } from 'notion-to-md'
// import { Client } from '@notionhq/client'
// 
// export default async function notion2md(pageId: string, token: string): Promise<string> {
//   const notion = new Client({
//     auth: token
//   })
// 
//   const n2m = new NotionToMarkdown({
//     notionClient: notion,
//     config: {
//       parseChildPages: false, // default: parseChildPages
//     }
//   });
// 
//   const mdblocks = await n2m.pageToMarkdown(pageId);
//   const mdString = await n2m.toMarkdownString(mdblocks);
//   return mdString.parent;
// 
// }


import { NotionToMarkdown } from 'notion-to-md';
import { Client } from '@notionhq/client';

let n2m: NotionToMarkdown | null = null;

export default async function notion2md(pageId: string, token: string): Promise<string> {
  if (!n2m) {
    const notion = new Client({
      auth: token,
    });

    n2m = new NotionToMarkdown({
      notionClient: notion,
      config: {
        parseChildPages: false, // default: parseChildPages
      },
    });
  }

  // 並列リクエストを使用してページデータを取得
  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = await n2m.toMarkdownString(mdblocks);
  
  return mdString.parent;
}
