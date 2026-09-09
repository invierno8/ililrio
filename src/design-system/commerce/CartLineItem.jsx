import React from 'react';
import { Icon } from '../core/Icon.jsx';

const {
  useState
} = React;
function formatCurrency(value, currency = 'ILS', locale = 'he-IL') {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

/** LinePrice — stacked unit/compare-at price used inside cart rows. */
function LinePrice({
  price,
  originalPrice,
  currency = 'ILS',
  locale = 'he-IL'
}) {
  const discounted = typeof originalPrice === 'number' && originalPrice > price;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      lineHeight: 1.25
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
      color: discounted ? 'var(--tw-red-600)' : 'var(--tw-neutral-900)'
    }
  }, formatCurrency(price, currency, locale)), discounted ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--tw-neutral-400)',
      textDecoration: 'line-through'
    }
  }, formatCurrency(originalPrice, currency, locale)) : null);
}

/** CartLineItem — one row in the cart: thumbnail, name/spec, price, stepper, remove. */
function CartLineItem({
  name,
  spec,
  imageUrl,
  imageAlt,
  quantity,
  price,
  originalPrice,
  currency = 'ILS',
  locale = 'he-IL',
  showLineTotal = false,
  minQuantity = 1,
  maxQuantity = 99,
  disabled = false,
  loading = false,
  error,
  onQuantityChange,
  onRemove
}) {
  const [internalQuantity, setInternalQuantity] = useState(quantity);
  const currentQuantity = onQuantityChange ? quantity : internalQuantity;
  const handleQuantityChange = next => {
    const clamped = Math.min(maxQuantity, Math.max(minQuantity, next));
    if (onQuantityChange) onQuantityChange(clamped);else setInternalQuantity(clamped);
  };
  const multiplier = showLineTotal ? currentQuantity : 1;
  const stepBtn = {
    display: 'flex',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    border: 0,
    background: 'transparent',
    color: 'var(--tw-neutral-600)',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("article", {
    dir: "rtl",
    className: "ht-line"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ht-line__thumb"
  }, imageUrl ? /*#__PURE__*/React.createElement("img", {
    src: imageUrl,
    alt: imageAlt ?? name,
    dir: "ltr",
    loading: "lazy"
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%'
    },
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minWidth: 0,
      flex: 1,
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "ht-line__name"
  }, name), spec ? /*#__PURE__*/React.createElement("p", {
    className: "ht-line__spec"
  }, spec) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexShrink: 0,
      alignItems: 'flex-start',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(LinePrice, {
    price: price * multiplier,
    originalPrice: typeof originalPrice === 'number' ? originalPrice * multiplier : undefined,
    currency: currency,
    locale: locale
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onRemove,
    disabled: disabled || loading,
    className: "ht-line__remove",
    "aria-label": `הסרת ${name} מהעגלה`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Trash2",
    size: 16
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ht-qty ht-qty--sm",
    role: "group",
    "aria-label": `כמות עבור ${name}`,
    style: {
      position: 'relative',
      borderColor: 'var(--tw-neutral-200)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: stepBtn,
    onClick: () => handleQuantityChange(currentQuantity - 1),
    disabled: disabled || loading || currentQuantity <= minQuantity,
    "aria-label": "\u05D4\u05E4\u05D7\u05EA\u05EA \u05DB\u05DE\u05D5\u05EA"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Minus",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      textAlign: 'center',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--tw-neutral-900)',
      alignSelf: 'center'
    },
    "aria-live": "polite"
  }, currentQuantity), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: stepBtn,
    onClick: () => handleQuantityChange(currentQuantity + 1),
    disabled: disabled || loading || currentQuantity >= maxQuantity,
    "aria-label": "\u05D4\u05D5\u05E1\u05E4\u05EA \u05DB\u05DE\u05D5\u05EA"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    size: 16
  })), loading ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,.75)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Loader2",
    size: 16,
    style: {
      animation: 'ht-spin .8s linear infinite',
      color: 'var(--tw-neutral-500)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "ht-sr"
  }, "\u05DE\u05E2\u05D3\u05DB\u05DF \u05DB\u05DE\u05D5\u05EA\u2026")) : null), !showLineTotal ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--tw-neutral-500)'
    }
  }, "\u05E1\u05D4\u05F4\u05DB ", formatCurrency(price * currentQuantity, currency, locale)) : null), error ? /*#__PURE__*/React.createElement("p", {
    role: "alert",
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      color: 'var(--tw-red-600)'
    }
  }, error) : null));
}

export { formatCurrency, LinePrice, CartLineItem };
