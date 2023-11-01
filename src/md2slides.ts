import { Marp } from '@marp-team/marp-core'
import fs from 'fs'

export default function md2slides(md: string): void {
  const marpit = new Marp()
  // const theme = `
  // /* @theme example */

  // section {
  //   background-color: #369;
  //   color: #fff;
  //   font-size: 30px;
  //   padding: 40px;
  // }

  // h1,
  // h2 {
  //   text-align: center;
  //   margin: 0;
  // }

  // h1 {
  //   color: #8cf;
  // }
  // `
  // marpit.themeSet.default = marpit.themeSet.add(theme)

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
  fs.writeFileSync('example.html', htmlFile.trim())
}