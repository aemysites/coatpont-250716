/* global WebImporter */
export default function parse(element, { document }) {
  // The header row: single column with the block name
  const cells = [['Table (striped, bordered, tableStripedBordered11)']];

  // Find the first relevant summary table (the one with two columns: 'Component', 'Resolved issues')
  let foundTable = null;
  const tables = element.querySelectorAll('table');
  for (const table of tables) {
    const thead = table.querySelector('thead');
    const ths = thead ? thead.querySelectorAll('th') : [];
    if (ths.length === 2 && ths[0].textContent.trim().toLowerCase() === 'component' && ths[1].textContent.trim().toLowerCase().includes('resolved')) {
      foundTable = table;
      break;
    }
  }

  if (foundTable) {
    // The actual table header (should be a regular data row, not a block header)
    const thead = foundTable.querySelector('thead');
    if (thead) {
      const ths = thead.querySelectorAll('th');
      const headerRow = Array.from(ths).map(th => th.textContent.trim());
      cells.push(headerRow);
    }
    // Data rows from tbody
    const tbody = foundTable.querySelector('tbody');
    if (tbody) {
      const trs = tbody.querySelectorAll('tr');
      trs.forEach(tr => {
        const row = Array.from(tr.querySelectorAll('td')).map(td => {
          // If the cell contains children (like links), include them directly
          return td.children.length ? Array.from(td.childNodes) : td.textContent.trim();
        });
        cells.push(row);
      });
    }
  } else {
    // Fallback: put all content in a single cell
    const content = Array.from(element.childNodes);
    cells.push([content]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
