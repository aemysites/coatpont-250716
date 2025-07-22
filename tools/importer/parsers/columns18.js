/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate column divs
  const columns = Array.from(element.querySelectorAll(':scope > .et_pb_column'));

  // For each column, get its direct module contents
  const columnContent = columns.map(col => {
    // Get all direct et_pb_module children
    const modules = Array.from(col.querySelectorAll(':scope > .et_pb_module'));
    // For each module, get its content (prefer .et_pb_text_inner if present)
    const contents = modules.map(mod => {
      const inner = mod.querySelector('.et_pb_text_inner');
      return inner ? inner : mod;
    }).filter(Boolean);
    // If multiple content blocks, return as array; if just one, the single element
    if (contents.length === 1) {
      return contents[0];
    }
    return contents;
  });

  // Compose the table header and row (header is single cell, not one per column!)
  const cells = [
    ['Columns (columns18)'], // single-cell header row
    columnContent // columns as the second row
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
