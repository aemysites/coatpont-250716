/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one cell
  const headerRow = ['Columns (columns5)'];

  // Extract the main heading element (if exists)
  const headingEl = element.querySelector('.et_pb_text_inner');
  const headingContent = headingEl ? headingEl.firstElementChild : '';

  // Find the row containing the number columns
  const numbersRow = element.querySelector('.et_pb_row_4col');
  let columns = [];
  if (numbersRow) {
    columns = Array.from(numbersRow.querySelectorAll(':scope > .et_pb_column')).map(col => {
      // Reference all direct children from this column
      const contents = Array.from(col.children);
      return contents.length === 1 ? contents[0] : contents;
    });
  }

  // Second row: as many cells as columns, heading in the first cell, rest blank
  const headingRow = columns.length > 0 ? Array(columns.length).fill('') : [];
  if (columns.length > 0 && headingContent) headingRow[0] = headingContent;

  // Third row: one cell per column, actual content
  const contentRow = columns;

  // Compose the table: first row is a single header cell,
  // then rows with columns.length columns each (headingRow, contentRow)
  const rows = [
    headerRow
  ];
  if (headingRow.length) rows.push(headingRow);
  if (contentRow.length) rows.push(contentRow);

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
