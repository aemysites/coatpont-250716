/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row matches exactly
  const headerRow = ['Columns (columns5)'];

  // 2. Find the centered title h3 (first in the section)
  let titleCell = null;
  const titleH3 = element.querySelector('.et_pb_text_inner h3');
  if (titleH3) {
    // Reference the parent .et_pb_text to include all relevant content and context
    titleCell = titleH3.closest('.et_pb_text');
  }

  // 3. Find the stats/counter row, which contains 4 columns
  let countersCells = [];
  // Find the .et_pb_row with 4 columns, each with a .et_pb_number_counter
  const rows = element.querySelectorAll('.et_pb_row');
  for (const row of rows) {
    const columns = row.querySelectorAll(':scope > .et_pb_column');
    if (columns.length === 4 && Array.from(columns).every(col => col.querySelector('.et_pb_number_counter'))) {
      countersCells = Array.from(columns).map(col => {
        // Reference the module inside (the .et_pb_number_counter)
        const counter = col.querySelector('.et_pb_number_counter');
        return counter || '';
      });
      break;
    }
  }

  // Compose rows for the table (header, title cell, counters)
  const rowsArr = [headerRow];
  if (titleCell) {
    rowsArr.push([titleCell]);
  }
  if (countersCells.length === 4) {
    rowsArr.push(countersCells);
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rowsArr, document);
  element.replaceWith(table);
}
