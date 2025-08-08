/* global WebImporter */
export default function parse(element, { document }) {
  // Find the resolved issues table (the tabular content)
  const resolvedTable = element.querySelector('table');
  if (!resolvedTable) return;

  // We want to wrap the entire found table inside a single cell in the block table
  // The block table must have only one column in every row

  // Build cells: first row is block name, second row is the table itself
  const cells = [
    ['Table (table7)'],
    [resolvedTable]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
