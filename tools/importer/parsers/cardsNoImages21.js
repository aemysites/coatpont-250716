/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area
  const content = element.querySelector('.search-content.content');
  if (!content) return;

  // Find the Product news section
  const productNews = content.querySelector('[id="release-notes-product-news"]');
  if (!productNews) return;

  // Find all card list containers in Product news section
  const lists = productNews.querySelectorAll('ul._16276mt0-1-7-3');
  let cards = [];
  // Each list contains li items as cards
  lists.forEach((ul) => {
    const liCards = ul.querySelectorAll('li._16276mt1-1-7-3');
    liCards.forEach((li) => {
      // Heading: look for <a>
      const headingLink = li.querySelector('a');
      let headingElem = null;
      if (headingLink && headingLink.childNodes.length > 0) {
        // Use <strong> for heading text, keep semantic meaning
        headingElem = document.createElement('strong');
        headingElem.textContent = headingLink.childNodes[0].textContent.trim();
      }
      // Description: look for p
      const descElem = li.querySelector('p');
      // Compose cell content
      const cellContent = [];
      if (headingElem) cellContent.push(headingElem);
      if (descElem) cellContent.push(descElem);
      // Only add cards with actual content
      if (cellContent.length) {
        cards.push([cellContent]);
      }
    });
  });
  if (!cards.length) return;
  // Table header as specified
  const headerRow = ['Cards'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cards
  ], document);
  // Replace element
  element.replaceWith(table);
}
