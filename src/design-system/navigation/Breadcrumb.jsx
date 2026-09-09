import React from 'react';

/** Breadcrumb — hairline trail. The separator chevron follows reading direction. */
function Breadcrumb({
  items,
  ariaLabel = 'Breadcrumb',
  dir = 'rtl',
  className = '',
  onNavigate
}) {
  if (!items || items.length === 0) return null;
  const separator = dir === 'rtl' ? '\u2039' : '\u203A';
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": ariaLabel,
    dir: dir,
    className: ('ht-crumbs ' + className).trim()
  }, /*#__PURE__*/React.createElement("ol", {
    className: "ht-crumbs__list"
  }, items.map((item, index) => {
    const isCurrent = index === items.length - 1;
    return /*#__PURE__*/React.createElement("li", {
      key: `${item.label}-${index}`,
      className: "ht-crumbs__item"
    }, index > 0 ? /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      className: "ht-crumbs__sep"
    }, separator) : null, isCurrent || !item.href ? /*#__PURE__*/React.createElement("span", {
      "aria-current": isCurrent ? 'page' : undefined,
      className: isCurrent ? 'ht-crumbs__current' : 'ht-crumbs__link'
    }, item.label) : /*#__PURE__*/React.createElement("a", {
      href: item.href,
      className: "ht-crumbs__link",
      onClick: e => {
        if (onNavigate) {
          e.preventDefault();
          onNavigate(item, index);
        }
      }
    }, item.label));
  })));
}

export { Breadcrumb };
