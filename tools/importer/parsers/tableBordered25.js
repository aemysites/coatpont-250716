/* global WebImporter */
export default function parse(element, { document }) {
  // Find the summary table containing resolved issues
  const gaTable = element.querySelector('table');
  if (!gaTable) return;

  // Create the header row as required by the block spec
  const blockHeader = ['Table (bordered, tableBordered25)'];

  // Extract the table column headers (second row)
  let tableHeaders = [];
  // Try thead first
  const thead = gaTable.querySelector('thead');
  if (thead) {
    tableHeaders = Array.from(thead.querySelectorAll('th')).map(th => th.textContent.trim());
  } else {
    // Fallback: first tr
    const firstTr = gaTable.querySelector('tr');
    if (firstTr) {
      tableHeaders = Array.from(firstTr.querySelectorAll('th, td')).map(th => th.textContent.trim());
    }
  }

  // Extract all table body rows and include all content
  const rows = [];
  const tbody = gaTable.querySelector('tbody');
  const trs = tbody ? tbody.querySelectorAll('tr') : gaTable.querySelectorAll('tr');
  trs.forEach((tr, idx) => {
    // Skip header row if no thead
    if (!thead && idx === 0) return;
    const tds = Array.from(tr.children);
    const row = tds.map(td => {
      // Collect all content: text nodes + elements
      const cellContent = [];
      td.childNodes.forEach(node => {
        if (node.nodeType === 3) { // text
          const txt = node.textContent.trim();
          if (txt) cellContent.push(txt);
        } else if (node.nodeType === 1) { // element
          cellContent.push(node);
        }
      });
      // Prefer original element if just one, else array
      return cellContent.length === 1 ? cellContent[0] : cellContent;
    });
    // Only add non-empty rows
    if (row.length > 0) rows.push(row);
  });

  // Compose the cells array
  const cells = [blockHeader, tableHeaders, ...rows];

  // Create the block table and replace
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
