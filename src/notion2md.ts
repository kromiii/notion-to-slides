import { NotionToMarkdown } from 'notion-to-md'
import { Client } from '@notionhq/client'

export default async function notion2md(pageId: string): Promise<string> {
  const NOTION_TOKEN: string | undefined = process.env.NOTION_TOKEN;

  if (!NOTION_TOKEN) {
    console.error('Please provide a NOTION_TOKEN')
    process.exit(1)
  }

  const notion = new Client({
    auth: NOTION_TOKEN
  })

  const n2m = new NotionToMarkdown({
    notionClient: notion,
    config: {
      parseChildPages: false, // default: parseChildPages
    }
  });

  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = await n2m.toMarkdownString(mdblocks);
  return mdString.parent;

}