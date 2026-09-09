import React from 'react';
import { Icon } from '../core/Icon.jsx';

const ELLIPSIS = 'ellipsis';
function getPageItems(page, totalPages, siblingCount) {
  const total = Math.max(1, totalPages);
  const maxSlots = siblingCount * 2 + 5;
  if (total <= maxSlots) return Array.from({
    length: total
  }, (_, i) => i + 1);
  const left = Math.max(2, page - siblingCount);
  const right = Math.min(total - 1, page + siblingCount);
  const items = [1];
  if (left > 2) items.push(ELLIPSIS);
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push(ELLIPSIS);
  items.push(total);
  return items;
}

/** Pagination — page list with mirrored prev/next chevrons for RTL. */
function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  disabled = false,
  label = 'עמודים',
  className = ''
}) {
  const total = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), total);
  const items = getPageItems(current, total, siblingCount);
  const goTo = next => {
    if (disabled) return;
    const clamped = Math.min(Math.max(1, next), total);
    if (clamped !== current) onPageChange(clamped);
  };
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": label,
    className: ('ht-pager ' + className).trim()
  }, /*#__PURE__*/React.createElement("ul", {
    className: "ht-pager__list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ht-pager__btn",
    onClick: () => goTo(current - 1),
    disabled: disabled || current === 1,
    "aria-label": "\u05D4\u05E2\u05DE\u05D5\u05D3 \u05D4\u05E7\u05D5\u05D3\u05DD"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronRight",
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, "\u05D4\u05E7\u05D5\u05D3\u05DD"))), items.map((item, index) => item === ELLIPSIS ? /*#__PURE__*/React.createElement("li", {
    key: `ellipsis-${index}`,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ht-pager__ellipsis"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MoreHorizontal",
    size: 16
  }))) : /*#__PURE__*/React.createElement("li", {
    key: item
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    dir: "ltr",
    style: {
      unicodeBidi: 'isolate'
    },
    className: 'ht-pager__btn' + (item === current ? ' ht-pager__btn--on' : ''),
    onClick: () => goTo(item),
    disabled: disabled,
    "aria-label": `עמוד ${item}`,
    "aria-current": item === current ? 'page' : undefined
  }, item))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ht-pager__btn",
    onClick: () => goTo(current + 1),
    disabled: disabled || current === total,
    "aria-label": "\u05D4\u05E2\u05DE\u05D5\u05D3 \u05D4\u05D1\u05D0"
  }, /*#__PURE__*/React.createElement("span", null, "\u05D4\u05D1\u05D0"), /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronLeft",
    size: 16
  })))));
}

export { getPageItems, Pagination };
