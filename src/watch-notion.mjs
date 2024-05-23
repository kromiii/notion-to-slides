import { exec } from 'child_process';
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import os from 'os';
import yargs from 'yargs';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { Client } from '@notionhq/client';
import open from 'open';

// HTTPサーバーを作成
const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  console.log('WebSocket connection established');
});

function notifyClients() {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('reload');
    }
  });
}

// コマンドライン引数の設定
const argv = yargs(process.argv.slice(2))
  .option('url', {
    alias: 'u',
    description: 'The URL of the Notion page',
    type: 'string',
    demandOption: true
  })
  .option('theme', {
    alias: 't',
    description: 'The Marp theme',
    type: 'string',
    demandOption: true
  })
  .help()
  .alias('help', 'h')
  .argv;

const notionUrl = argv.url;
const marpTheme = argv.theme;

// Notionクライアントの初期化
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pageId = notionUrl.split('-').pop().split('?')[0];

// 一時ディレクトリにHTMLファイルを生成
const tempDir = os.tmpdir();
const htmlFile = path.join(tempDir, `${pageId}.html`);

// NotionページをHTMLスライドに変換するコマンド
const convertNotionToHtml = `node dist/index.js --url ${notionUrl} --theme ${marpTheme}`;

// HTMLファイルにJavaScriptコードを追加する関数
function addLiveReloadScript(filePath) {
  const script = `
  <script>
    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (message) => {
      if (message.data === 'reload') {
        window.location.reload();
      }
    };
  </script>
  </body>`; // 閉じるbodyタグの前に挿入

  let htmlContent = fs.readFileSync(filePath, 'utf8');
  if (!htmlContent.includes('<script>const ws = new WebSocket')) {
    htmlContent = htmlContent.replace('</body>', script);
    fs.writeFileSync(filePath, htmlContent, 'utf8');
  }
}

// NotionページをHTMLに変換し、スライドを更新する関数
function updateSlides(openTab = false) {
  console.log('Updating slides...');
  exec(convertNotionToHtml, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${stderr}`);
    } else {
      console.log(`Converted: ${stdout}`);
      // HTMLファイルが生成されたか確認
      if (fs.existsSync(htmlFile)) {
        // HTMLファイルにスクリプトを追加
        addLiveReloadScript(htmlFile);
        if (openTab) {
          open(htmlFile); // 最初の実行時にタブを開く
        } else {
          // HTMLファイルが変更されたことをシミュレート
          fs.utimesSync(htmlFile, new Date(), new Date());
          notifyClients(); // クライアントに通知
        }
      } else {
        console.error(`Error: The HTML file ${htmlFile} does not exist.`);
      }
    }
  });
}

// 初回実行
updateSlides(true); // 最初の実行時はタブを開く

// Notionページの最終更新日時を取得する関数
async function getNotionPageLastEditedTime(pageId) {
  const page = await notion.pages.retrieve({ page_id: pageId });
  return new Date(page.last_edited_time);
}

// Notionページの変更をチェックする関数
async function checkForNotionPageUpdates() {
  const lastEditedTime = await getNotionPageLastEditedTime(pageId);
  if (!global.lastCheckedTime || global.lastCheckedTime < lastEditedTime) {
    global.lastCheckedTime = lastEditedTime;
    updateSlides(); // 以降はopenTabをfalseにして呼び出す
  }
}

// 定期的にNotionページの変更をチェック
setInterval(checkForNotionPageUpdates, 5000); // 1秒ごとにチェック

// HTMLファイルを監視して変更があればスライドをブラウザに通知
chokidar.watch(htmlFile).on('change', () => {
  console.log(`File ${htmlFile} has been changed`);
  // スライドファイルが存在するかチェックし、クライアントに通知
  if (fs.existsSync(htmlFile)) {
    notifyClients();
  } else {
    console.error(`Error: The slide file ${htmlFile} does not exist.`);
  }
});

// HTTPサーバーを指定のポートでリッスン
server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
