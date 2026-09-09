import React from 'react';

const LABELS = {
  'in-stock': 'במלאי',
  'low-stock': 'מלאי אחרון',
  'out-of-stock': 'אזל מהמלאי'
};
const TONES = {
  'in-stock': {
    dot: 'var(--stock-in)',
    text: 'var(--stock-in-text)'
  },
  'low-stock': {
    dot: 'var(--stock-low)',
    text: 'var(--stock-low-text)'
  },
  'out-of-stock': {
    dot: 'var(--stock-out)',
    text: 'var(--stock-out-text)'
  }
};
const SIZES = {
  sm: {
    dot: 6,
    text: 'var(--text-xs)',
    gap: 6
  },
  md: {
    dot: 8,
    text: 'var(--text-sm)',
    gap: 8
  }
};

/** StockIndicator — dot + Hebrew availability label. */
function StockIndicator({
  status,
  label,
  size = 'md',
  className = ''
}) {
  const tone = TONES[status] || TONES['in-stock'];
  const s = SIZES[size];
  return /*#__PURE__*/React.createElement("span", {
    dir: "rtl",
    role: "status",
    className: ('ht-stock ' + className).trim(),
    style: {
      gap: s.gap,
      fontSize: s.text,
      color: tone.text
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "ht-stock__dot",
    style: {
      width: s.dot,
      height: s.dot,
      background: tone.dot
    }
  }), /*#__PURE__*/React.createElement("span", null, label ?? LABELS[status]));
}

export { StockIndicator };
