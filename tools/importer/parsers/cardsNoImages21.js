/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the table exactly as required
  const headerRow = ['Cards (cardsNoImages21)'];

  // The testimonial card content is inside .et_pb_testimonial_content
  // We'll reference the full content block for semantic meaning
  const testimonialContent = element.querySelector('.et_pb_testimonial_content');
  if (!testimonialContent) return; // Defensive: skip if not found

  // Build the table for the block
  const rows = [
    headerRow,
    [testimonialContent]
  ];

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
