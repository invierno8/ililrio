import React from 'react';

/** SpecTable — label/value technical spec rows with LTR-isolated values. */
function SpecTable({
  title,
  rows,
  striped = true,
  dense = false,
  emptyMessage = 'אין מפרט טכני זמין',
  className = ''
}) {
  const cell = 'ht-spec__cell' + (dense ? ' ht-spec__cell--dense' : '');
  return /*#__PURE__*/React.createElement("section", {
    dir: "rtl",
    className: ('ht-spec ' + className).trim()
  }, title ? /*#__PURE__*/React.createElement("h3", {
    className: "ht-spec__title"
  }, title) : null, rows.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      padding: '24px 20px',
      textAlign: 'center',
      fontSize: 'var(--text-sm)',
      color: 'var(--tw-gray-500)'
    }
  }, emptyMessage) : /*#__PURE__*/React.createElement("table", null, title ? /*#__PURE__*/React.createElement("caption", {
    className: "ht-sr"
  }, title) : null, /*#__PURE__*/React.createElement("tbody", null, rows.map((row, index) => /*#__PURE__*/React.createElement("tr", {
    key: row.label,
    className: striped && index % 2 === 1 ? 'ht-spec__zebra' : undefined
  }, /*#__PURE__*/React.createElement("th", {
    scope: "row",
    className: cell
  }, row.label), /*#__PURE__*/React.createElement("td", {
    className: cell
  }, /*#__PURE__*/React.createElement("span", {
    dir: "ltr",
    className: "ht-spec__val"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, row.value), row.unit ? /*#__PURE__*/React.createElement("span", {
    className: "ht-spec__unit"
  }, row.unit) : null)))))));
}

export { SpecTable };
