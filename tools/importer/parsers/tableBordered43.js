/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first summary table in the element matching the required columns
  const tables = Array.from(element.querySelectorAll('table'));
  let mainTable = null;
  for (const table of tables) {
    const ths = table.querySelectorAll('thead th');
    if (
      ths.length === 2 &&
      ths[0].textContent.trim() === 'Component' &&
      ths[1].textContent.trim() === 'Resolved issues'
    ) {
      mainTable = table;
      break;
    }
  }
  if (!mainTable) return;

  // Header row: block name, exactly as in the example, single column
  const headerRow = ['Table (bordered, tableBordered43)'];

  // Second row: table column headers, use <strong> for each header, and put ALL in a single row in the array
  const ths = Array.from(mainTable.querySelectorAll('thead th'));
  const colHeaderRow = ths.map(th => {
    const strong = document.createElement('strong');
    strong.textContent = th.textContent.trim();
    return strong;
  });

  // Remaining rows: one array per row, each cell is text content or referenced elements
  const dataRows = [];
  const trs = Array.from(mainTable.querySelectorAll('tbody tr'));
  trs.forEach(tr => {
    // Two columns per row
    const tds = Array.from(tr.children);
    const row = tds.map(td => {
      // If cell contains elements (links, spans, etc.), bundle all child nodes
      const nodes = Array.from(td.childNodes).filter(node => {
        // Don't include unnecessary whitespace-only text nodes
        if (node.nodeType === 3) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      if (nodes.length === 1 && nodes[0].nodeType === 3) {
        return nodes[0].textContent.trim();
      } else if (nodes.length > 0) {
        return nodes;
      } else {
        return td.textContent.trim();
      }
    });
    // Only add row if it has at least one non-empty cell
    if (row.some(cell => {
      if (Array.isArray(cell)) {
        return cell.length > 0;
      }
      return cell && cell !== '';
    })) {
      dataRows.push(row);
    }
  });

  // Compose the block: first row is single cell (block name),
  // then one row of column headers, then all data rows
  const cells = [
    headerRow,
    colHeaderRow,
    ...dataRows
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
