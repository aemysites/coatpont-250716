/* global WebImporter */
export default function parse(element, { document }) {
  // Header row according to spec
  const headerRow = ['Hero (hero7)'];

  // For this HTML, there is no explicit background image. If background is needed, parse from e.g. inline style or child images.
  let backgroundCell = '';

  // Main content: grab heading, subheading, CTA, in order, referencing the original DOM elements.
  let mainCellContent = [];
  // Find the .et_pb_row (should only be one)
  const row = element.querySelector('.et_pb_row');
  if (row) {
    // Find the column
    const column = row.querySelector('.et_pb_column');
    if (column) {
      // All .et_pb_module direct children in order
      const modules = Array.from(column.querySelectorAll(':scope > .et_pb_module'));
      // For each module, get its main content
      modules.forEach(module => {
        // For .et_pb_text, use the .et_pb_text_inner
        if (module.classList.contains('et_pb_text')) {
          const inner = module.querySelector('.et_pb_text_inner');
          if (inner) mainCellContent.push(inner);
        } else if (module.classList.contains('et_pb_button_module_wrapper')) {
          // For button, reference the entire wrapper (contains the <a>)
          mainCellContent.push(module);
        }
      });
    }
  }

  // Build table cells array: header, background, content
  const cells = [
    headerRow,
    [backgroundCell],
    [mainCellContent]
  ];
  
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
