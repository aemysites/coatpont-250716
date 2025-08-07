/* global WebImporter */
export default function parse(element, { document }) {
  // Header row according to the block/component name
  const headerRow = ['Cards (cardsNoImages21)'];
  const rows = [headerRow];

  // Find all testimonial modules that represent cards
  // We'll check for .et_pb_testimonial elements inside the given element, or if the element itself is one
  let testimonialModules = Array.from(element.querySelectorAll(':scope .et_pb_testimonial'));

  // Handle the edge case that the element itself IS a testimonial card
  if (testimonialModules.length === 0 && element.classList.contains('et_pb_testimonial')) {
    testimonialModules = [element];
  }

  // If it's a row wrapper (as in the given HTML), extract all .et_pb_testimonial in the descendants
  if (testimonialModules.length === 0) {
    testimonialModules = Array.from(element.querySelectorAll('.et_pb_testimonial'));
  }

  testimonialModules.forEach(testimonial => {
    // The content is inside .et_pb_testimonial_description_inner
    // We'll reference the full container (contains heading and description)
    let contentContainer = testimonial.querySelector('.et_pb_testimonial_description_inner');
    // Defensive fallback: if not found, use the testimonial as is
    if (!contentContainer) {
      contentContainer = testimonial;
    }
    rows.push([contentContainer]);
  });

  // Only create the table if we have at least the header row and one content row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
