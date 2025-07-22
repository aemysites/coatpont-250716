/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Cards (cards16)'];
  // Get all direct card columns
  const columns = element.querySelectorAll(':scope > div');
  const rows = [];
  columns.forEach((col) => {
    // Card icon or image (always in ".et_pb_blurb .et_pb_main_blurb_image")
    let icon = null;
    const blurb = col.querySelector('.et_pb_blurb');
    if (blurb) {
      const iconWrap = blurb.querySelector('.et_pb_main_blurb_image');
      if (iconWrap) {
        icon = iconWrap;
      }
    }
    // Card text content
    const textContent = document.createElement('div');
    if (blurb) {
      // Title
      const title = blurb.querySelector('.et_pb_module_header');
      if (title && title.textContent.trim()) {
        // Use <strong> for title for visual weight (as in example)
        const strong = document.createElement('strong');
        strong.innerHTML = title.textContent.trim();
        textContent.appendChild(strong);
        textContent.appendChild(document.createElement('br'));
      }
      // Description (may contain <br> and inline elements)
      const desc = blurb.querySelector('.et_pb_blurb_description');
      if (desc) {
        // Copy all child nodes to preserve formatting
        Array.from(desc.childNodes).forEach((node) => {
          textContent.appendChild(node.cloneNode(true));
        });
      }
    }
    // Card CTA button (if exists)
    const button = col.querySelector('a.et_pb_button');
    if (button && button.textContent.trim()) {
      textContent.appendChild(document.createElement('br'));
      // Reference the existing anchor element
      textContent.appendChild(button);
    }
    rows.push([
      icon,
      textContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
