
import { Greeter } from './Greeter'
import { NotionToMarkdown } from 'notion-to-md'
import { Client } from '@notionhq/client'

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

(async () => {
  const mdblocks = await n2m.pageToMarkdown("c2769d7bc90a4f428adae7a2192d258a");
  const mdString = n2m.toMarkdownString(mdblocks);
  console.log(mdString.parent);
})();

const greeter = new Greeter()

greeter.greet(NOTION_TOKEN)

// function init() {
//   const args = process.argv.slice(2)
//   const urlIndex = args.indexOf('--url')
//   if (urlIndex === -1) {
//     console.log('Please provide a URL')
//     process.exit(1)
//   }

//   const url = args[urlIndex + 1]
// }

// function get_notion_page(url: string) {
//   const notion = new Client {
//     auth: NOTION_TOKEN
//   }
// }


// const greeter = new Greeter()

// greeter.greet(url)