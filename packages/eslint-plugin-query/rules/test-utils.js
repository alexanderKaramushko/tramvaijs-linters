export function normalizeIndent(template) {
  const codeLines = template[0]?.split('\n') ?? [''];
  const leftPadding = codeLines[1]?.match(/\s+/)?.[0] ?? '';

  return codeLines.map((line) => line.slice(leftPadding.length)).join('\n');
}
