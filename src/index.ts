
import { Greeter } from './Greeter'

const args = process.argv.slice(2)
const urlIndex = args.indexOf('--url')

if (urlIndex === -1) {
  console.log('Please provide a URL')
  process.exit(1)
}

const url = args[urlIndex + 1]

const greeter = new Greeter()

greeter.greet(url)