/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section title (if any), must be outside the block table
  const headerTextModule = element.querySelector('.et_pb_text_inner > h2');
  let sectionTitleElem = null;
  if (headerTextModule) {
    sectionTitleElem = headerTextModule.closest('.et_pb_text'); // get the wrapper module
  }

  // Accordion rows
  const rows = [];
  rows.push(['Accordion']); // Header row as specified

  // Each accordion item is .et_pb_toggle
  const toggles = element.querySelectorAll('.et_pb_toggle');
  toggles.forEach(toggle => {
    // Title: always in .et_pb_toggle_title
    const title = toggle.querySelector('.et_pb_toggle_title');
    // Content: always in .et_pb_toggle_content
    const content = toggle.querySelector('.et_pb_toggle_content');
    if (!title || !content) return; // Defensive

    // For the content cell, reference all children of .et_pb_toggle_content
    const nodes = Array.from(content.childNodes).filter(n => !(n.nodeType === 3 && !n.textContent.trim()));
    let cellContents;
    if (nodes.length === 1) {
      cellContents = nodes[0];
    } else {
      // Use array so createTable flattens all elements
      cellContents = nodes;
    }
    rows.push([title, cellContents]);
  });

  // Construct Accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Insert the section title above the block, referencing the original element if present
  if (sectionTitleElem) {
    element.parentNode.insertBefore(sectionTitleElem, element);
  }
  element.replaceWith(block);
}
