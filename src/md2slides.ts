import { Marp } from '@marp-team/marp-core'
import fs from 'fs'
import { tmpdir } from 'os'

export default function md2slides(md: string): string {
  const marpit = new Marp()

  const prefix = `
  <!--
headingDivider: 2
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
  const hash = Math.random().toString(32).substring(2)
  const tmpFilePath = tmpdir() + `/${hash}.html`
  fs.writeFileSync(tmpFilePath, htmlFile.trim())
  return tmpFilePath
}