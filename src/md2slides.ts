import { Marpit } from '@marp-team/marpit'
import fs from 'fs'

export default function md2slides(md: string): void {
  const marpit = new Marpit()
  const { css, html } = marpit.render(md)
  const htmlFile = `
<!DOCTYPE html>
<html><body>
  <style>${css}</style>
  ${html}
</body></html>
`
  fs.writeFileSync('example.html', htmlFile.trim())
}