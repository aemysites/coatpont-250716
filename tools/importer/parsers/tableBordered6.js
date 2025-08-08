/* global WebImporter */
export default function parse(element, { document }) {
  // Critical review: Only process the release notes summary table as per the example
  // No Section Metadata block required (not present in example)
  // Table header must be exactly 'Table (bordered, tableBordered6)'
  // Reference existing elements from the source document
  // DO NOT hardcode table content, use only live DOM extraction
  // Properly handle missing or empty tables

  // Find the release notes issues summary table (the only table of this kind)
  // Look for the h3 heading with id 'saas-sprint-255-ga'
  const gaHeading = element.querySelector('h3#saas-sprint-255-ga');
  let tableEl;
  if (gaHeading) {
    // The summary table should be the next table after the heading
    let next = gaHeading.nextElementSibling;
    while (next && !(next.tagName === 'DIV' && next.querySelector('table'))) {
      next = next.nextElementSibling;
    }
    if (next) {
      tableEl = next.querySelector('table');
    }
  } else {
    // Fallback: find the summary table by its class
    tableEl = element.querySelector('table._a28ief0-1-10-0');
  }
  if (!tableEl) return;

  // Parse table head and body
  const rows = Array.from(tableEl.querySelectorAll('tr'));
  if (rows.length < 2) return; // Must have header and at least one data row

  // Table header: collect THs
  const headerRow = Array.from(rows[0].querySelectorAll('th')).map(th => {
    // Use the actual element to preserve formatting (bold, etc.)
    return th.childNodes.length ? Array.from(th.childNodes) : th.textContent.trim();
  });

  // Data rows
  const dataRows = rows.slice(1).map(row => {
    return Array.from(row.querySelectorAll('td')).map(td => {
      // Reference actual nodes for links/text
      if (td.childNodes.length > 0) {
        return Array.from(td.childNodes);
      }
      return td.textContent.trim();
    });
  });

  // Compose the cells array
  const cells = [];
  // Block header row (per instructions)
  cells.push(['Table (bordered, tableBordered6)']);
  // Table header row
  cells.push(headerRow);
  // Data rows
  dataRows.forEach(row => cells.push(row));

  // Create and replace the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original table only (not the whole element)
  tableEl.parentElement.replaceChild(blockTable, tableEl);
}
