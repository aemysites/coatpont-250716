/* global WebImporter */
export default function parse(element, { document }) {
  // Find all tables with <th> headers (indicating a data table)
  const tables = Array.from(element.querySelectorAll('table'));
  tables.forEach((table) => {
    const headerCells = table.querySelectorAll('thead th');
    // Only process tables that have header cells
    if (!headerCells.length) return;
    // Get columns headers as text or elements
    const colHeaderRow = Array.from(headerCells).map((th) => th.textContent.trim());
    // Get all body rows
    const bodyRows = Array.from(table.querySelectorAll('tbody tr'));
    // If no tbody, fall back to all tr except first (header)
    const dataTrs = bodyRows.length ? bodyRows : Array.from(table.querySelectorAll('tr')).slice(1);
    // Parse data rows as array of arrays (keep links as elements)
    const dataRows = dataTrs.map(tr => {
      return Array.from(tr.children).map(cell => {
        const anchor = cell.querySelector('a');
        if (anchor) return anchor;
        return cell.textContent.trim();
      });
    });
    // Compose rows: block name header (single col), then col headers, then data rows
    const cells = [['Table (table26)'], colHeaderRow, ...dataRows];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    table.replaceWith(block);
  });
}