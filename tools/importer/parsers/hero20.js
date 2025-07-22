/* global WebImporter */
export default function parse(element, { document }) {
  // Define table header row exactly as required
  const headerRow = ['Hero (hero20)'];
  // No background image in provided HTML, so second row is empty string
  const bgRow = [''];

  // Collect all relevant content from the block
  // We'll gather all .et_pb_text_inner and .et_pb_contact_form_container in DOM order
  const content = [];
  // Get all immediate children
  const children = Array.from(element.querySelectorAll(':scope > div'));
  children.forEach(child => {
    // Skip dividers and irrelevant containers
    if (
      child.classList.contains('et_pb_top_inside_divider') ||
      child.classList.contains('et_pb_top_divider') ||
      child.classList.contains('et_pb_bottom_divider')
    ) {
      return;
    }
    // Add all .et_pb_text_inner descendants in DOM order
    const textBlocks = Array.from(child.querySelectorAll('.et_pb_text_inner'));
    textBlocks.forEach(tb => content.push(tb));
    // Add all .et_pb_contact_form_container descendants in DOM order
    const forms = Array.from(child.querySelectorAll('.et_pb_contact_form_container'));
    forms.forEach(form => {
      // Replace any iframe inside forms with a link to src
      const iframes = form.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        const src = iframe.getAttribute('src');
        if (src) {
          const link = document.createElement('a');
          link.href = src;
          link.textContent = src;
          iframe.replaceWith(link);
        }
      });
      content.push(form);
    });
  });

  // If we somehow missed everything, just put original element content as fallback
  const contentRow = [content.length ? content : [element]];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}
