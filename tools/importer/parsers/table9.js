/* global WebImporter */
export default function parse(element, { document }) {
  // Locate GA section header
  const gaHeader = element.querySelector('h3#saas-sprint-259-ga');
  if (!gaHeader) return;

  // Find the resolved issues table that follows the GA header
  let table = null;
  let sibling = gaHeader.nextElementSibling;
  while (sibling) {
    if (sibling.tagName && sibling.tagName.toLowerCase() === 'div') {
      const maybeTable = sibling.querySelector('table');
      if (maybeTable) {
        table = maybeTable;
        break;
      }
    }
    sibling = sibling.nextElementSibling;
  }
  if (!table) return;

  // Parse rows from the table
  const rows = Array.from(table.rows);
  if (!rows.length) return;

  // Extract header row's text content for each column (not the <th> element itself)
  const tableHeaderRow = Array.from(rows[0].cells).map(cell => cell.textContent.trim());

  // Extract each data row as an array of elements: if there is an anchor, use it; otherwise use full cell
  const dataRows = rows.slice(1).map(tr => {
    return Array.from(tr.cells).map(td => {
      const anchor = td.querySelector('a');
      if (anchor) return anchor;
      // If the cell has a <span> or other elements, include all children
      if (td.childNodes.length > 0) {
        return Array.from(td.childNodes);
      }
      // Otherwise, text content
      return td.textContent.trim();
    });
  });

  // Construct the block table array as per specifications
  const cells = [
    ['Table (table9)'],           // header row, single cell
    tableHeaderRow                // actual table column headers
  ];
  dataRows.forEach(row => cells.push(row));

  // Create the block table and replace original table's parent
  const block = WebImporter.DOMUtils.createTable(cells, document);
  table.parentNode.replaceChild(block, table);
}
