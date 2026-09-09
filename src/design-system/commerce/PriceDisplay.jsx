import React from 'react';

const SIZES = {
  sm: {
    price: 'var(--text-base)',
    weight: 600,
    compare: 'var(--text-xs)',
    unit: 'var(--text-xs)',
    gap: 6
  },
  md: {
    price: 'var(--text-2xl)',
    weight: 600,
    compare: 'var(--text-sm)',
    unit: 'var(--text-sm)',
    gap: 8
  },
  lg: {
    price: 'var(--text-4xl)',
    weight: 700,
    compare: 'var(--text-base)',
    unit: 'var(--text-base)',
    gap: 10
  }
};
function formatShekelAmount(amount, fractionDigits) {
  const digits = typeof fractionDigits === 'number' ? fractionDigits : Number.isInteger(amount) ? 0 : 2;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(amount);
}
function PriceRun({
  amount,
  fractionDigits,
  symbolPosition,
  style,
  className = ''
}) {
  const digits = formatShekelAmount(amount, fractionDigits);
  const text = symbolPosition === 'before' ? `₪${digits}` : `${digits}₪`;
  return /*#__PURE__*/React.createElement("bdi", {
    dir: "ltr",
    className: ('ht-price__run ' + className).trim(),
    style: style
  }, text);
}

/**
 * PriceDisplay — shekel price as a single bidi-isolated run so the ₪ sign and
 * digits never reorder inside Hebrew copy. Sale prices turn red.
 */
function PriceDisplay({
  amount,
  compareAtAmount,
  unitLabel,
  unitPosition = 'after',
  symbolPosition = 'before',
  fractionDigits,
  size = 'md',
  highlightSale = true,
  className = ''
}) {
  const s = SIZES[size];
  const isSale = typeof compareAtAmount === 'number' && compareAtAmount > amount;
  const priceColor = isSale && highlightSale ? 'var(--price-sale)' : 'var(--price-default)';
  const accessibleLabel = [`${formatShekelAmount(amount, fractionDigits)} ₪`, unitLabel, isSale ? `במקום ${formatShekelAmount(compareAtAmount, fractionDigits)} ₪` : undefined].filter(Boolean).join(' ');
  const unit = unitLabel ? /*#__PURE__*/React.createElement("span", {
    className: "ht-price__unit",
    style: {
      fontSize: s.unit
    }
  }, unitLabel) : null;
  return /*#__PURE__*/React.createElement("div", {
    dir: "rtl",
    role: "img",
    "aria-label": accessibleLabel,
    className: ('ht-price ' + className).trim(),
    style: {
      columnGap: s.gap
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      columnGap: s.gap
    }
  }, unitPosition === 'before' ? unit : null, /*#__PURE__*/React.createElement(PriceRun, {
    amount: amount,
    fractionDigits: fractionDigits,
    symbolPosition: symbolPosition,
    style: {
      fontSize: s.price,
      fontWeight: s.weight,
      color: priceColor
    }
  }), unitPosition === 'after' ? unit : null), isSale ? /*#__PURE__*/React.createElement(PriceRun, {
    amount: compareAtAmount,
    fractionDigits: fractionDigits,
    symbolPosition: symbolPosition,
    className: "ht-price__compare",
    style: {
      fontSize: s.compare
    }
  }) : null);
}

export { formatShekelAmount, PriceDisplay };
