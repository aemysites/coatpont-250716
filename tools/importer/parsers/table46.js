/* global WebImporter */
export default function parse(element, { document }) {
  // Find the correct GA table for OneAgent release notes (Build 1.263.138)
  let table = null;
  const gaHeading = element.querySelector('h3[id^="oneagent-sprint-263-ga"]');
  if (gaHeading) {
    let sibling = gaHeading.nextElementSibling;
    while (sibling) {
      table = sibling.querySelector('table');
      if (table) break;
      sibling = sibling.nextElementSibling;
    }
  }
  if (!table) {
    // Fallback: find by header cell text
    const tables = element.querySelectorAll('table');
    for (const t of tables) {
      const ths = t.querySelectorAll('th');
      if (ths.length && ths[0].textContent.trim() === 'Component') {
        table = t;
        break;
      }
    }
  }

  const cells = [];
  // Block header: single column with block/component name ONLY
  cells.push(['Table (table46)']);
  if (table) {
    // Extract the column header row from <th> in <thead>, but add as FIRST data row after block header
    const thead = table.querySelector('thead');
    let headerRow = [];
    if (thead) {
      const ths = thead.querySelectorAll('th');
      headerRow = Array.from(ths).map(th => th.textContent.trim());
    }
    // Add column header row as first data row
    if (headerRow.length > 0) {
      cells.push(headerRow);
    }
    // Extract data rows (all <tr> in <tbody>)
    const tbody = table.querySelector('tbody');
    if (tbody) {
      const trs = tbody.querySelectorAll('tr');
      trs.forEach(tr => {
        const tds = tr.querySelectorAll('td');
        const row = Array.from(tds).map(td => {
          // If the cell has children, include all (links, spans, etc.)
          if (td.children.length > 0) {
            return Array.from(td.childNodes);
          }
          return td.textContent.trim();
        });
        if (row.length && row.some(cell => (typeof cell === 'string' ? cell.length : true))) {
          cells.push(row);
        }
      });
    }
  } else {
    // Fallback if no table found
    cells.push([element.textContent.trim()]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
