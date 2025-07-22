/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row as in the example
  const headerRow = ['Cards (cardsNoImages26)'];
  const cells = [headerRow];

  // Find all blurbs (cards) in DOM order
  const blurbNodes = element.querySelectorAll('.et_pb_blurb');
  blurbNodes.forEach((blurb) => {
    // We'll collect existing elements for this card in order
    const cardContent = [];
    // Heading (optional)
    const heading = blurb.querySelector('.et_pb_module_header');
    if (heading) {
      cardContent.push(heading);
    }
    // Description area (may contain p, em, ul, etc)
    const descr = blurb.querySelector('.et_pb_blurb_description');
    if (descr) {
      // Remove empty <p> tags (but only those that are truly empty)
      descr.querySelectorAll('p').forEach((p) => {
        if (!p.textContent.trim()) {
          p.remove();
        }
      });
      // Push all children in order (em, ul, etc)
      Array.from(descr.childNodes).forEach((node) => {
        // Only include nodes that have meaningful text OR are a list
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            (node.tagName === 'P' && node.textContent.trim()) ||
            node.tagName === 'EM' ||
            node.tagName === 'UL' ||
            node.tagName === 'OL' ||
            node.tagName === 'SPAN' ||
            node.tagName === 'STRONG'
          ) {
            cardContent.push(node);
          }
        }
      });
    }
    // Only add row if there is meaningful content
    if (cardContent.length > 0) {
      cells.push([cardContent]);
    }
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
