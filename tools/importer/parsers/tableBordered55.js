/* global WebImporter */
export default function parse(element, { document }) {
  // The Table (bordered, tableBordered55) block expects one table from the example (the Resolved Issues table)
  // 1. Find the Resolved Issues table section
  const resolvedIssuesHeading = element.querySelector('h3#saas-sprint-231-ga');
  if (!resolvedIssuesHeading) return;

  // 2. Find the next table (the one under General Availability)
  let resolvedTable = null;
  let sibling = resolvedIssuesHeading.nextElementSibling;
  while (sibling) {
    if (sibling.querySelector && sibling.querySelector('table')) {
      resolvedTable = sibling.querySelector('table');
      break;
    }
    sibling = sibling.nextElementSibling;
  }
  if (!resolvedTable) return;

  // 3. Prepare header row (block name), second row (table headers), then the rest of the rows (table data)
  const cells = [];
  cells.push(['Table (bordered, tableBordered55)']);
  
  // Table headers (second row)
  const ths = Array.from(resolvedTable.querySelectorAll('thead th'));
  // Ensure that headers are included exactly as in the table for the second row
  cells.push(ths.map(th => th.textContent.trim()));

  // Table body rows
  const trs = Array.from(resolvedTable.querySelectorAll('tbody tr'));
  trs.forEach(tr => {
    const row = [];
    Array.from(tr.children).forEach(td => {
      // Preserve all nodes (links and text) from the cell in order and reference them directly
      const contentNodes = [];
      td.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          contentNodes.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          contentNodes.push(node.textContent.trim());
        }
      });
      if (contentNodes.length === 1) {
        row.push(contentNodes[0]);
      } else if (contentNodes.length > 1) {
        row.push(contentNodes);
      } else {
        row.push('');
      }
    });
    cells.push(row);
  });

  // 4. Create the block table and replace the original element
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
