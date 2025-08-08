/* global WebImporter */
export default function parse(element, { document }) {
  // Find the table with headers City, Country, Time Zone
  const tables = element.querySelectorAll('table');
  let matchTable = null;
  for (const table of tables) {
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
    if (
      headers.length === 3 &&
      headers[0].toLowerCase() === 'city' &&
      headers[1].toLowerCase() === 'country' &&
      headers[2].toLowerCase() === 'time zone'
    ) {
      matchTable = table;
      break;
    }
  }
  if (!matchTable) {
    return;
  }
  // Create the block table structure with block name header row
  const cells = [
    ['Table (table36)'], // Header row as required
    [matchTable] // Second row, single cell containing the referenced table
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
