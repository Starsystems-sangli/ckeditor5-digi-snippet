/**
 * For a given model text node, it returns white spaces that precede other characters in that node.
 * This corresponds to the indentation part of the code block line.
 */
export function getLeadingWhiteSpaces(textNode) {
    return textNode.data.match(/^(\s*)/)[0];
}
