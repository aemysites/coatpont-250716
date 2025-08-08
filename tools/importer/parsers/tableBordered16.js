/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first resolved issues table in this section
  // (Matches the plant-like example table structure: 3 columns, multiple rows)
  const headerRow = ['Table (bordered, tableBordered16)'];
  // Find the main 'General Availability' resolved issues <table>
  // Only transform the first such table (matches the example)
  let blockTable = null;
  const tables = element.querySelectorAll('table');
  for (let tbl of tables) {
    // Check if table has 3+ rows and 3 columns (to match the structure)
    const thead = tbl.querySelector('thead');
    const tbody = tbl.querySelector('tbody');
    if (!thead || !tbody) continue;
    const ths = thead.querySelectorAll('th');
    if (ths.length !== 3) continue;
    // Passed: treat this as the block table
    const headerCells = Array.from(ths);
    const dataRows = [];
    for (const tr of tbody.querySelectorAll('tr')) {
      const tds = Array.from(tr.querySelectorAll('td'));
      if (tds.length === 3) {
        dataRows.push(tds);
      }
    }
    if (dataRows.length > 0) {
      // Compose block table as in example
      const cells = [headerRow, headerCells, ...dataRows];
      blockTable = WebImporter.DOMUtils.createTable(cells, document);
      // Replace the original table with the block table
      tbl.parentNode.replaceChild(blockTable, tbl);
    }
    break; // Only process the first matching table
  }
}