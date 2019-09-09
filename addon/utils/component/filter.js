import escapeRegExp from '../general/escape-regexp';
import collapseWhitespace from '../general/collapse-whitespace';

export function filterComponentsByTextContent(components, query) {
  query = escapeRegExp(query);

  const pattern = new RegExp(`^${query}`, 'i');

  return components.filter(option => {
    return pattern.test(collapseWhitespace(option.domElement.textContent));
  });
}