import { Marp } from '@marp-team/marp-core'
import fs from 'fs'
import path from 'path'
import os from 'os'

export default function md2slides(md: string, theme: string): string {
  const marpit = new Marp()

  // ホームディレクトリを取得
  const homeDir = os.homedir()

  // カスタムテーマのパスを構築
  const themePath = path.resolve(homeDir, '.marp/themes', `${theme}.css`)

  // カスタムテーマを読み込む
  if (fs.existsSync(themePath)) {
    const customTheme = fs.readFileSync(themePath, 'utf-8')
    
    // テーマをMarpインスタンスに登録
    marpit.themeSet.add(customTheme)
  } else {
    console.error(`Theme file ${themePath} does not exist.`)
    return ''
  }

  const prefix = `
  <!--
headingDivider: 2
theme: ${theme}
-->
  `
  const mdstring = prefix + md
  const { css, html } = marpit.render(mdstring)
  const htmlFile = `
<!DOCTYPE html>
<html><body>
  <style>${css}</style>
  ${html}
</body></html>
`
  return htmlFile.trim()
}
