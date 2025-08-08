/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the Resolved Issues section
  const h2s = element.querySelectorAll('h2');
  let resolvedIssuesHeader = null;
  for (const h2 of h2s) {
    if (h2.textContent.trim().toLowerCase().startsWith('resolved issues')) {
      resolvedIssuesHeader = h2;
      break;
    }
  }
  if (!resolvedIssuesHeader) return;

  // Find the General Availability header after Resolved Issues
  let current = resolvedIssuesHeader.nextElementSibling;
  let gaHeader = null;
  while (current) {
    if (
      current.tagName &&
      (current.tagName.toLowerCase() === 'h3' || current.tagName.toLowerCase() === 'h4') &&
      current.textContent.includes('General Availability')
    ) {
      gaHeader = current;
      break;
    }
    current = current.nextElementSibling;
  }
  if (!gaHeader) return;

  // Find the summary paragraph and table after the GA header
  let table = null;
  current = gaHeader.nextElementSibling;
  while (current) {
    // Look for table inside a div or as an immediate table
    if (current.tagName && current.tagName.toLowerCase() === 'div') {
      table = current.querySelector('table');
      if (table) break;
    } else if (current.tagName && current.tagName.toLowerCase() === 'table') {
      table = current;
      break;
    }
    current = current.nextElementSibling;
  }
  if (!table) return;

  // Get table header row (preserve as <tr>)
  const headerTr = table.querySelector('thead tr');
  let headerRowElements = [];
  if (headerTr) {
    headerRowElements = Array.from(headerTr.children);
  }

  // Get data rows (preserve as <tr>)
  const dataRows = [];
  const tbody = table.querySelector('tbody');
  if (tbody) {
    tbody.querySelectorAll('tr').forEach(tr => {
      // Gather all cells (preserve links/elements)
      const row = [];
      tr.querySelectorAll('td').forEach(td => {
        const link = td.querySelector('a');
        if (link) {
          row.push(link);
        } else {
          const span = td.querySelector('span');
          if (span) {
            row.push(span.textContent.trim());
          } else {
            row.push(td.textContent.trim());
          }
        }
      });
      dataRows.push(row);
    });
  }

  // Compose cells array with block header as a single cell row
  const blockHeader = ['Table (bordered, tableBordered20)'];
  // Next row is the table's header exactly as in the source (as HTML elements)
  const cells = [blockHeader, headerRowElements, ...dataRows];

  // Create block table and replace original table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  table.replaceWith(block);
}
