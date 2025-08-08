/* global WebImporter */
export default function parse(element, { document }) {
  // Find all tables in the element
  const tables = Array.from(element.querySelectorAll('table'));
  if (!tables.length) return;

  tables.forEach(table => {
    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length < 2) return;

    // Block table header row, always single column with block name
    const blockHeader = ['Table (table38)'];
    const cells = [blockHeader];

    // Get column headers (second row in block table)
    const headerRow = Array.from(rows[0].querySelectorAll('th'));
    if (headerRow.length) {
      // Use text content only, not the <th> element itself!
      cells.push(headerRow.map(th => th.textContent.trim()));
    }

    // Data rows
    for (let i = 1; i < rows.length; i++) {
      const tds = Array.from(rows[i].querySelectorAll('td'));
      if (!tds.length) continue;
      // For each cell, reference the first child element if present, else text
      cells.push(tds.map(td => {
        // If td contains only a link, reference the link element directly
        const a = td.querySelector('a');
        if (a && td.childNodes.length === 1) return a;
        // Otherwise return all direct child nodes as array, or text if just text
        if (td.childNodes.length > 1) {
          return Array.from(td.childNodes).filter(n => n.nodeType === 1 || n.nodeType === 3).map(n => n.nodeType === 3 ? n.textContent.trim() : n);
        }
        return td.textContent.trim();
      }));
    }

    // Create table and replace
    const block = WebImporter.DOMUtils.createTable(cells, document);
    table.replaceWith(block);
  });
}
