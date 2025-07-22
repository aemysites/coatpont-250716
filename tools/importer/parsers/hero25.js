/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (from example: 'Hero (hero25)')
  const headerRow = ['Hero (hero25)'];

  // Background image row: in this HTML, there is no <img> or background-image set inline, so the cell is empty
  const bgImageRow = [''];

  // Content row: find the title (h1), and use the existing element
  // In this structure, h1 is under .et_pb_title_container
  let contentEls = [];
  const titleContainers = element.querySelectorAll('.et_pb_title_container');
  titleContainers.forEach(container => {
    // Use all heading and paragraph elements in order (for future flexibility)
    Array.from(container.children).forEach(child => {
      contentEls.push(child);
    });
  });

  // Fallback: direct h1 if no container
  if (contentEls.length === 0) {
    const h1 = element.querySelector('h1');
    if (h1) contentEls.push(h1);
  }

  if (contentEls.length === 0) {
    contentEls = [''];
  }

  const cells = [
    headerRow,
    bgImageRow,
    [contentEls]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
