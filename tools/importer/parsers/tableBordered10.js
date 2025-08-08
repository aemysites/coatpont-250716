/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the example
  const headerRow = ['Table (bordered, tableBordered10)'];

  // Find the 'Resolved issues' heading (<h2>), case-insensitive
  let resolvedHeading = null;
  const h2s = element.querySelectorAll('h2');
  for (const h2 of h2s) {
    if (h2.textContent.trim().toLowerCase().startsWith('resolved issues')) {
      resolvedHeading = h2;
      break;
    }
  }

  // If found, collect all content from the heading until the next H2 or end
  let blockContent = [];
  if (resolvedHeading) {
    blockContent.push(resolvedHeading);
    let curr = resolvedHeading.nextSibling;
    while (curr) {
      if (curr.nodeType === Node.ELEMENT_NODE && curr.tagName === 'H2') {
        break;
      }
      // Include non-empty text nodes
      if (curr.nodeType === Node.TEXT_NODE && curr.textContent.trim().length > 0) {
        const span = document.createElement('span');
        span.textContent = curr.textContent;
        blockContent.push(span);
      } else if (curr.nodeType === Node.ELEMENT_NODE) {
        blockContent.push(curr);
      }
      curr = curr.nextSibling;
    }
  } else {
    // fallback: include all children and text from the element
    for (let node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        blockContent.push(span);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        blockContent.push(node);
      }
    }
  }

  // Compose the cells as required
  const cells = [
    headerRow,
    [blockContent]
  ];

  // Create the table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
