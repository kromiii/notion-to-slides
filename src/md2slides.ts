import { Marp } from '@marp-team/marp-core'

export default function md2slides(md: string, theme: string): string {
  const marpit = new Marp()

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