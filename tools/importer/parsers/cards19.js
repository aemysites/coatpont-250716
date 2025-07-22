/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const rows = [['Cards (cards19)']];

  // Get all columns directly under the row (the cards)
  const columns = element.querySelectorAll(':scope > div');
  columns.forEach((col) => {
    // Icon or image cell
    let iconCell = null;
    const blurb = col.querySelector('.et_pb_blurb');
    if (blurb) {
      const iconWrap = blurb.querySelector('.et_pb_main_blurb_image');
      if (iconWrap) {
        iconCell = iconWrap;
      }
      // Text cell
      const textContainer = document.createElement('div');
      // Title (make <strong> to match card style)
      const header = blurb.querySelector('.et_pb_module_header');
      if (header && header.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = header.textContent.trim();
        textContainer.appendChild(strong);
      }
      // Add <br> if both title and description
      const desc = blurb.querySelector('.et_pb_blurb_description');
      if (desc && desc.textContent.trim()) {
        if (textContainer.childNodes.length > 0) {
          textContainer.appendChild(document.createElement('br'));
        }
        Array.from(desc.childNodes).forEach((node) => {
          textContainer.appendChild(node.cloneNode(true));
        });
      }
      // CTA button
      const buttonWrap = col.querySelector('.et_pb_button_module_wrapper');
      if (buttonWrap) {
        const btn = buttonWrap.querySelector('a');
        if (btn) {
          if (textContainer.childNodes.length > 0) {
            textContainer.appendChild(document.createElement('br'));
          }
          textContainer.appendChild(btn);
        }
      }
      rows.push([iconCell, textContainer]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
