/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row
  const rows = [['Accordion (accordion41)']];

  // Find all accordion items (collapsible sections with [data-testid="expand"])
  const accordionItems = Array.from(element.querySelectorAll('[data-testid="expand"]'));

  accordionItems.forEach(item => {
    // Title: extract visible text from the clickable area
    let titleText = '';
    const titleSpan = item.querySelector('.search-expand-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      titleText = titleSpan.textContent.trim();
    } else {
      // If no dedicated span, pull from button or fallback to element text
      const button = item.querySelector('button');
      if (button && button.textContent.trim()) {
        titleText = button.textContent.trim();
      } else {
        titleText = item.textContent.trim().split('\n')[0];
      }
    }

    // Content: everything inside the expanded panel except the title/button
    // Usually div.sc-b01a7e1f-7 KiXBY, but fallback to any element after button
    const contentElements = [];
    const contentDiv = item.querySelector('.sc-b01a7e1f-7');
    if (contentDiv) {
      // Push all child elements (paragraphs, callouts, lists, etc)
      Array.from(contentDiv.childNodes).forEach(node => {
        if (node.nodeType === 1) {
          contentElements.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // Text node
          const span = document.createElement('span');
          span.textContent = node.textContent;
          contentElements.push(span);
        }
      });
    } else {
      // Fallback: find all siblings after button and add them
      const button = item.querySelector('button');
      let node = button ? button.nextSibling : null;
      while (node) {
        if (node.nodeType === 1) {
          contentElements.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          contentElements.push(span);
        }
        node = node.nextSibling;
      }
    }
    // If no content found, add an empty div so structure is retained
    const cellContent = contentElements.length ? contentElements : document.createElement('div');
    rows.push([titleText, cellContent]);
  });

  // Only proceed if we found at least one accordion item
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
