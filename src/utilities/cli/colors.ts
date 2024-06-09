/**
 * Background colors, foreground colors, and text styles for the CLI.
 */
const colors = {
    fgBlack: '\x1b[30m',
    fgRed: '\x1b[31m',
    fgGreen: '\x1b[32m',
    fgYellow: '\x1b[33m',
    fgBlue: '\x1b[34m',
    fgMagenta: '\x1b[35m',
    fgCyan: '\x1b[36m',
    fgWhite: '\x1b[37m',
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
    reset: '\x1b[0m',
};

/**
 * Format text with a color
 *
 * @param text - The text to format
 * @param color - The color to apply
 * @returns
 */
const withColor = (text: string, color: string) => {
    return `${color}${text}${colors.reset}`;
};

export { colors, withColor };
