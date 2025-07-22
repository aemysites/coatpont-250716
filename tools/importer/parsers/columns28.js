/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all immediate columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Prepare one cell per column for the content row
  const contentCells = columns.map((col) => {
    const blurb = col.querySelector('.et_pb_blurb');
    const button = col.querySelector('.et_pb_button_module_wrapper');
    if (blurb && button) return [blurb, button];
    if (blurb) return blurb;
    if (button) return button;
    return col;
  });

  // Create the table with a single-cell header row
  const tableRows = [
    ['Columns (columns28)'],
    contentCells
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
