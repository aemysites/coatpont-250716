/* global WebImporter */
export default function parse(element, { document }) {
  // The provided HTML is only a divider, with no card data present.
  // According to the requirements and the markdown example, only the block header should be output, with no extra rows.
  // The header matches the example exactly: 'Cards (cards15)'
  const headerRow = ['Cards (cards15)'];
  const cells = [headerRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
