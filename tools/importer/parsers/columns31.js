/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as a single cell (spanning all columns), matching example
  const cells = [
    ['Columns (columns31)']
  ];
  // Get all immediate columns in the element
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // For each column, extract the .et_pb_text_inner (the main content block)
  const row = columns.map(col => {
    const module = col.querySelector('.et_pb_module');
    if (module) {
      const inner = module.querySelector('.et_pb_text_inner');
      if (inner) return inner;
      return module;
    }
    return col;
  });
  // Add one row with N cells (one for each column)
  cells.push(row);
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
