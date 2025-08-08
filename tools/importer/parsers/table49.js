/* global WebImporter */
export default function parse(element, { document }) {
  // The Table (table49) block should contain a single table as a single cell in the second row, with the header as the first row
  // 1. Find the first table (either native <table> or strato-table-contained div)
  let tableEl = element.querySelector('table');
  if (!tableEl) {
    // Look for div-based strato table
    tableEl = element.querySelector('div[class*="strato-table-contained"]');
  }
  // Build the cells array for the block table
  const cells = [['Table (table49)']];
  if (tableEl) {
    cells.push([tableEl]);
  } else {
    // If no table found, fallback: include all content as a single cell
    cells.push([element]);
  }
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}