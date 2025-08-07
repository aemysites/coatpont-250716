/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Hero (hero20)'];
  // Background image row (optional in this case, empty string)
  const bgRow = [''];

  // Collect all content for the content cell
  const contentCell = [];

  // 1. Headings: Find all headings that are direct or indirect descendants
  // We want to preserve their order and hierarchy
  // Also include any containers with headings/subheadings
  const headingBlocks = [];
  // Find all elements that look like content blocks (with text/heading)
  // First, gather all .et_pb_text_inner blocks
  element.querySelectorAll('.et_pb_text_inner').forEach(inner => {
    // Only add if contains at least one heading (h1/h2/h3)
    if (inner.querySelector('h1, h2, h3')) {
      headingBlocks.push(inner);
    }
  });
  headingBlocks.forEach(block => contentCell.push(block));

  // 2. Description or instruction paragraph (not inside form)
  element.querySelectorAll('.et_pb_text_inner').forEach(inner => {
    // If contains only paragraphs and not already added
    if (!headingBlocks.includes(inner)) {
      contentCell.push(inner);
    }
  });

  // 3. Contact form
  const formContainer = element.querySelector('.et_pb_contact_form_container');
  if (formContainer) {
    // Replace non-img [src] with a link to its src
    formContainer.querySelectorAll('[src]:not(img)').forEach(el => {
      const src = el.getAttribute('src');
      if (src) {
        const link = document.createElement('a');
        link.href = src;
        link.textContent = src;
        el.replaceWith(link);
      }
    });
    contentCell.push(formContainer);
  }

  // Make sure all relevant text content is included (avoid missing lone headings/paragraphs)
  // (Fallback in case e.g. headings are not in .et_pb_text_inner)
  // Collect any top-level headings/paragraphs not already in contentCell
  element.querySelectorAll('h1, h2, h3, p').forEach(elm => {
    let alreadyIncluded = false;
    for (const block of contentCell) {
      if (block.contains && block.contains(elm)) {
        alreadyIncluded = true;
        break;
      }
    }
    if (!alreadyIncluded) {
      contentCell.push(elm);
    }
  });

  // Construct the final table
  const rows = [
    headerRow,
    bgRow,
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
