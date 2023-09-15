import chalk from 'chalk'

const cyan = chalk.hex('#0bb')

export const log = message => console.log(`\n${cyan(message)}`)
