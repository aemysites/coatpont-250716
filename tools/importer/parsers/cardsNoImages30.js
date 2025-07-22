/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row
  const headerRow = ['Cards (cardsNoImages30)'];
  const rows = [headerRow];

  // Locate article cards inside the element
  const articles = element.querySelectorAll('article');
  articles.forEach((article) => {
    const cardContent = [];

    // Title (usually h2, possibly with link)
    const titleEl = article.querySelector('.entry-title');
    if (titleEl) {
      cardContent.push(titleEl);
    }

    // Date (span.published)
    const dateEl = article.querySelector('.post-meta .published');
    if (dateEl && dateEl.textContent.trim()) {
      cardContent.push(dateEl);
    }

    // Description/content
    const descEl = article.querySelector('.post-content .post-content-inner p');
    if (descEl && descEl.textContent.trim()) {
      cardContent.push(descEl);
    }

    // CTA link (if present)
    const ctaLink = article.querySelector('.post-content a.more-link');
    if (ctaLink && ctaLink.textContent.trim()) {
      cardContent.push(ctaLink);
    }

    // Only add the card if there is card content (should always be true if article exists)
    if (cardContent.length > 0) {
      rows.push([cardContent]);
    }
  });

  // Replace only if we have at least the header and one card
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
