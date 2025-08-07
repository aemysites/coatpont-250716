/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all immediate columns
  const columns = Array.from(element.querySelectorAll(':scope > .et_pb_column'));
  // For each column, gather all direct module's .et_pb_text_inner contents
  const columnContents = columns.map(col => {
    const modules = Array.from(col.querySelectorAll(':scope > .et_pb_module'));
    const content = modules.map(mod => {
      // Prefer the .et_pb_text_inner div, else fallback to full module
      const inner = mod.querySelector(':scope > .et_pb_text_inner');
      return inner ? inner : mod;
    });
    // If only one content node, just return that, else return as array
    return content.length === 1 ? content[0] : content;
  });

  // The header row should be a single cell, not multiple columns
  const tableData = [
    ['Columns (columns18)'],
    columnContents
  ];

  // Create the table with the correct structure
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
