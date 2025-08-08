/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the example exactly
  const headerRow = ['Accordion (accordion31)'];

  // Find all h3 elements - these are likely accordion titles
  const h3s = Array.from(element.querySelectorAll('h3'));
  const rows = [];

  h3s.forEach((h3) => {
    // Title cell: capture the text content from the h3
    const titleCell = h3.textContent.trim();

    // Content cell: everything between this h3 and the next h3/h2/h4 or end
    let content = [];
    let node = h3.nextSibling;
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE && /^H[234]$/.test(node.tagName)) break;
      if (node.nodeType === Node.TEXT_NODE) {
        // Only keep non-empty text nodes
        const txt = node.textContent.trim();
        if (txt) {
          // Wrap plain text in a <span> for semantic meaning and consistent rendering
          const span = document.createElement('span');
          span.textContent = txt;
          content.push(span);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Reference existing elements directly
        content.push(node);
      }
      node = node.nextSibling;
    }
    // If all content is empty, use empty string
    let contentCell;
    if (content.length === 0) {
      contentCell = '';
    } else if (content.length === 1) {
      contentCell = content[0];
    } else {
      contentCell = content;
    }
    rows.push([titleCell, contentCell]);
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
