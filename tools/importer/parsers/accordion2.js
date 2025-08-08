/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Accordion block, matching example
  const headerRow = ['Accordion (accordion2)'];

  // Find the main content area (right-side, not sidebar)
  let contentRoot = element.querySelector('.search-content.content');
  if (!contentRoot) {
    // Fallback if selector fails
    contentRoot = element;
  }

  // Find all top-level h2[data-testid="heading"] elements: these are section headers
  const h2s = Array.from(contentRoot.querySelectorAll('h2[data-testid="heading"]'));

  // Build rows: for each h2, extract its title and section content until next h2
  const rows = [];
  h2s.forEach(h2 => {
    // Title cell: reference the heading element itself (including children)
    const titleCell = h2;
    // Content cell: gather all sibling elements after h2 until the next h2
    const contentCell = [];
    let sibling = h2.nextElementSibling;
    while (sibling && !(sibling.tagName === 'H2' && sibling.getAttribute('data-testid') === 'heading')) {
      contentCell.push(sibling);
      sibling = sibling.nextElementSibling;
    }
    // Only add the row if there is some content
    if (contentCell.length > 0) {
      rows.push([titleCell, contentCell]);
    }
  });

  // Create the block table using existing elements
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the element with the new block table
  element.replaceWith(table);
}
