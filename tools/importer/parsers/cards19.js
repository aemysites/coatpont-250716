/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract the icon span for the first cell
  function extractIcon(blurbEl) {
    const iconSpan = blurbEl.querySelector('.et_pb_main_blurb_image .et_pb_image_wrap span');
    return iconSpan || null; // reference existing span
  }

  // Find all columns (cards)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [];

  for (const col of columns) {
    const blurb = col.querySelector('.et_pb_blurb');
    if (!blurb) continue;

    // First cell: the icon span (reference)
    const iconEl = extractIcon(blurb);

    // Second cell: Text content
    const blurbContainer = blurb.querySelector('.et_pb_blurb_container');
    const cellContent = [];
    // Title
    if (blurbContainer) {
      const title = blurbContainer.querySelector('.et_pb_module_header');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        cellContent.push(strong);
        cellContent.push(document.createElement('br'));
      }
      // Description (may have <p>, <br>, etc)
      const desc = blurbContainer.querySelector('.et_pb_blurb_description');
      if (desc) {
        // Reference all child nodes of desc
        desc.childNodes.forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            cellContent.push(child);
          } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
            cellContent.push(document.createTextNode(child.textContent));
          }
        });
      }
    }
    // CTA (button)
    const buttonWrapper = col.querySelector('.et_pb_button_module_wrapper');
    if (buttonWrapper) {
      const btn = buttonWrapper.querySelector('a');
      if (btn) {
        cellContent.push(document.createElement('br'));
        cellContent.push(btn);
      }
    }

    rows.push([
      iconEl, // icon
      cellContent // referenced elements for text/call-to-action
    ]);
  }

  // Header row as per block definition
  const headerRow = ['Cards (cards19)'];
  const tableArr = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(block);
}
