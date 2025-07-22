/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero2) block: 1 col, 3 rows (header, optional image bg, content)
  // 1. Table header
  const headerRow = ['Hero (hero2)'];
  // 2. Background image row: none detected in HTML, so leave empty
  const bgRow = [''];
  // 3. Content row: headings, subheadings, CTA
  const row = element.querySelector('.et_pb_row');
  let contentCell = [];
  if (row) {
    const column = row.querySelector('.et_pb_column');
    if (column) {
      const textModule = column.querySelector('.et_pb_text .et_pb_text_inner');
      if (textModule) contentCell.push(textModule);
      const buttonModule = column.querySelector('.et_pb_button_module_wrapper');
      if (buttonModule) {
        const btn = buttonModule.querySelector('a');
        if (btn) contentCell.push(btn);
      }
    }
  }
  // As required, reference existing elements; do not clone or create new elements
  const cells = [
    headerRow,
    bgRow,
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
