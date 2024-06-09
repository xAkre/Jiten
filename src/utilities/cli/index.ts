import { colors, withColor } from './colors';

const HIDE_CURSOR_ESCAPE_SEQUENCE = '\x1b[?25l';
const SHOW_CURSOR_ESCAPE_SEQUENCE = '\x1b[?25h';

/**
 * Hides the cursor in the terminal
 */
const hideCursor = () => {
    process.stdout.write(HIDE_CURSOR_ESCAPE_SEQUENCE);
};

/**
 * Shows the cursor in the terminal
 */
const showCursor = () => {
    process.stdout.write(SHOW_CURSOR_ESCAPE_SEQUENCE);
};

export { colors, withColor, hideCursor, showCursor };
