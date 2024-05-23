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
import util from 'util';

// execをプロミス化
const execPromise = util.promisify(exec);

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

// 日本時間のタイムスタンプを生成する関数
function getJapanTime() {
  const now = new Date();
  const japanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return japanTime.toISOString().replace('T', ' ').replace(/\..+/, '') + ' JST';
}

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

let currentTask = null;
let nextTask = null;
let isProcessing = false;

// タスクを処理する関数
async function processTask(task) {
  isProcessing = true;
  console.log(`Updating slides... Task created at: ${task.timestamp}`);
  const startTime = Date.now();
  try {
    const { stdout, stderr } = await execPromise(task.cmd);
    const endTime = Date.now();
    console.log(`Total processing time: ${endTime - startTime} ms`);
    if (stderr) {
      console.error(`Error: ${stderr}`);
    } else {
      console.log(`Converted: ${stdout}`);
      // HTMLファイルが生成されたか確認
      if (fs.existsSync(htmlFile)) {
        // HTMLファイルにスクリプトを追加
        addLiveReloadScript(htmlFile);
        if (task.openTab) {
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
  } catch (error) {
    console.error(`Execution failed: ${error}`);
  }
  isProcessing = false;
  if (nextTask) {
    const nextTaskToProcess = nextTask;
    nextTask = null;
    processTask(nextTaskToProcess); // キューに残っている最新のタスクを処理
  }
}

// NotionページをHTMLに変換し、スライドを更新する関数
function updateSlides(openTab = false) {
  const task = { cmd: convertNotionToHtml, openTab, timestamp: getJapanTime() };
  if (isProcessing) {
    nextTask = task; // 現在のタスクが処理中なら次のタスクとして保存
  } else {
    processTask(task); // 現在タスクが処理中でないならすぐに実行
  }
}

// 初回実行
updateSlides(true); // 最初の実行時はタブを開く

// Notionページの最終更新日時を取得する関数
async function getNotionPageLastEditedTime(pageId) {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    return new Date(page.last_edited_time);
  } catch (error) {
    console.error('Failed to retrieve Notion page:', error);
    return null;
  }
}

// Notionページの変更をチェックする関数
async function checkForNotionPageUpdates() {
  const startCheckTime = Date.now();
  console.log(`Checking for updates at: ${getJapanTime()}`);
  const lastEditedTime = await getNotionPageLastEditedTime(pageId);
  if (lastEditedTime && (!global.lastCheckedTime || global.lastCheckedTime < lastEditedTime)) {
    global.lastCheckedTime = lastEditedTime;
    updateSlides();
  }
  const endCheckTime = Date.now();
  console.log(`Update check took: ${endCheckTime - startCheckTime} ms`);
  scheduleNextCheck();
}

// 次のチェックをスケジュールする関数
function scheduleNextCheck() {
  setTimeout(checkForNotionPageUpdates, 5000); // 5秒ごとにチェック
}

// 定期的にNotionページの変更をチェック（リクエストの間隔を最適化）
scheduleNextCheck();

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
