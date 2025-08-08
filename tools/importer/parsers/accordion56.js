/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area
  const mainContent = element.querySelector('div.sc-173633c2-2.gQKIZx');
  if (!mainContent) return;

  // Helper: get all direct children after a node until a selector
  function getSiblingsUntil(start, untilSelector) {
    const siblings = [];
    let node = start.nextSibling;
    while (node) {
      if (node.nodeType === 1 && node.matches(untilSelector)) break;
      if (node.nodeType === 1) siblings.push(node);
      node = node.nextSibling;
    }
    return siblings;
  }

  // Helper: flatten <ul><li> to paragraphs, preserving any rich content
  function ulToParagraphs(ul) {
    if (!ul) return [];
    return Array.from(ul.children).map(li => {
      if (li.tagName.toLowerCase() === 'p') return li;
      const p = document.createElement('p');
      while (li.childNodes.length) p.appendChild(li.childNodes[0]);
      return p;
    });
  }

  // Helper: Remove shortlink SVG from heading
  function cleanHeading(heading) {
    let svg = heading.querySelector('span.heading-shortlink');
    if (svg) svg.remove();
    return heading;
  }

  // Find all top-level h2s (accordion sections)
  const accordionH2s = mainContent.querySelectorAll('h2.sc-365c8523-0.cZTgHq');
  const cells = [['Accordion (accordion56)']];

  accordionH2s.forEach(h2 => {
    // Use original element reference for heading, minus shortlink SVG
    cleanHeading(h2);
    // Collect all content until the next h2
    const siblings = getSiblingsUntil(h2, 'h2.sc-365c8523-0.cZTgHq');
    let contents = [];
    siblings.forEach(el => {
      // Flatten ul lists to paragraphs (preserving formatting)
      if (el.tagName && el.tagName.toLowerCase() === 'ul') {
        contents.push(...ulToParagraphs(el));
      } else {
        contents.push(el);
      }
    });
    // If only one element, use it; otherwise, array
    let contentCell = contents.length === 1 ? contents[0] : contents.length > 0 ? contents : '';
    cells.push([h2, contentCell]);
  });

  // Replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
