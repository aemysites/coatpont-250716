/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Hero (hero8)'];

  // Background image row: not present in origin HTML, so leave cell blank
  const bgRow = [''];

  // Content row: gather all .et_pb_text_inner content (headings, subheading, paragraphs)
  // This will preserve the semantic meaning and original element structure
  const textInners = Array.from(element.querySelectorAll('.et_pb_text_inner'));
  const contentArr = [];
  textInners.forEach(inner => {
    // Add each child node in order (preserves headings, paragraphs, etc)
    Array.from(inner.childNodes).forEach((node) => {
      // Skip empty text nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      // Avoid adding empty <p>s at the end
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'p' && !node.textContent.trim()) return;
      contentArr.push(node);
    });
  });

  const contentRow = [contentArr];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
