import { NotionToMarkdown } from "notion-to-md";
import { Client } from "@notionhq/client";

export default async function notion2md(
  pageId: string,
  token: string
): Promise<string> {
  const notion = new Client({
    auth: token,
  });

  const n2m = new NotionToMarkdown({
    notionClient: notion,
    config: {
      parseChildPages: false, // default: parseChildPages
    },
  });

  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = await n2m.toMarkdownString(mdblocks);
  return mdString.parent;
}
