/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row (must match example exactly)
  const headerRow = ['Hero (hero3)'];

  // Background image row (there is no image in the input HTML)
  const backgroundRow = [''];

  // Content row: gather all heading/paragraph content from the element
  // This block's content is found inside the .et_pb_column_4_4 element
  const col = element.querySelector('.et_pb_column_4_4');
  const contentEls = [];
  if (col) {
    // Each module contains a .et_pb_text_inner div with the actual heading(s)
    const modules = Array.from(col.querySelectorAll(':scope > .et_pb_module'));
    for (const module of modules) {
      const inner = module.querySelector('.et_pb_text_inner');
      if (inner) {
        // If .et_pb_text_inner has block children (e.g. h1, h2, p), include all of them
        if (inner.children.length > 0) {
          for (const child of inner.children) {
            contentEls.push(child);
          }
        } else if (inner.textContent.trim()) {
          // Rare case: only text, no children
          const span = document.createElement('span');
          span.textContent = inner.textContent;
          contentEls.push(span);
        }
      }
    }
  }

  const contentRow = [contentEls]; // cell should be array of HTMLElements

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundRow,
    contentRow
  ], document);

  // Replace the original element with the new block
  element.replaceWith(table);
}
