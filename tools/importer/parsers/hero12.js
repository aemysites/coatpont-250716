/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row; must exactly match the specification
  const headerRow = ['Hero (hero12)'];

  // Background Image row: No background image in the HTML, so keep empty string
  const bgImageRow = [''];

  // Hero content row: icon, heading, description
  // Get the blurb content block
  const blurbContent = element.querySelector('.et_pb_blurb_content');
  const heroContent = [];

  if (blurbContent) {
    // Get the icon or image element (if any)
    const iconContainer = blurbContent.querySelector('.et_pb_main_blurb_image');
    if (iconContainer && iconContainer.firstElementChild) {
      // Insert the entire icon container, as it may contain spans and special styling
      heroContent.push(iconContainer);
    }

    // Get the container for text
    const blurbContainer = blurbContent.querySelector('.et_pb_blurb_container');
    if (blurbContainer) {
      // Heading
      const heading = blurbContainer.querySelector('h2');
      if (heading) heroContent.push(heading);
      // Description (et_pb_blurb_description can have multiple paragraphs)
      const desc = blurbContainer.querySelector('.et_pb_blurb_description');
      if (desc) heroContent.push(desc);
    }
  }

  const contentRow = [heroContent];

  // Compose table
  const cells = [headerRow, bgImageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
