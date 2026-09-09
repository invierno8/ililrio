import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { StockIndicator } from './StockIndicator.jsx';

const {
  useState
} = React;
function formatPrice(value, currency, locale) {
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

/** ProductCard — catalog tile: square image, name, price, stock line, near-black quick-add. */
function ProductCard({
  name,
  imageUrl,
  imageAlt,
  price,
  originalPrice,
  currency = 'ILS',
  locale = 'he-IL',
  stock = 'in-stock',
  stockCount,
  badge,
  onAddToCart,
  className = ''
}) {
  const [status, setStatus] = useState('idle');
  const soldOut = stock === 'out-of-stock';
  const discounted = typeof originalPrice === 'number' && originalPrice > price;
  const stockLabel = stock === 'low-stock' && typeof stockCount === 'number' ? `נותרו ${stockCount} יחידות` : undefined;
  async function handleAdd() {
    if (soldOut || status === 'pending') return;
    try {
      setStatus('pending');
      await onAddToCart?.();
      setStatus('added');
      window.setTimeout(() => setStatus('idle'), 1600);
    } catch {
      setStatus('error');
    }
  }
  return /*#__PURE__*/React.createElement("article", {
    dir: "rtl",
    className: ('ht-pcard ' + className).trim()
  }, /*#__PURE__*/React.createElement("div", {
    className: "ht-pcard__media"
  }, imageUrl ? /*#__PURE__*/React.createElement("img", {
    src: imageUrl,
    alt: imageAlt ?? name,
    loading: "lazy",
    style: {
      opacity: soldOut ? 0.6 : 1
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%'
    },
    "aria-hidden": "true"
  }), badge ? /*#__PURE__*/React.createElement("span", {
    className: "ht-pcard__badge"
  }, badge) : null), /*#__PURE__*/React.createElement("div", {
    className: "ht-pcard__body"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "ht-pcard__name"
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: '4px 8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    dir: "ltr",
    style: {
      fontSize: 'var(--text-lg)',
      fontWeight: 700,
      color: 'var(--tw-neutral-900)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, formatPrice(price, currency, locale)), discounted ? /*#__PURE__*/React.createElement("span", {
    dir: "ltr",
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--tw-neutral-500)',
      textDecoration: 'line-through'
    }
  }, formatPrice(originalPrice, currency, locale)) : null), /*#__PURE__*/React.createElement(StockIndicator, {
    status: stock,
    label: stockLabel
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleAdd,
    disabled: soldOut || status === 'pending',
    "aria-label": `הוספה לסל: ${name}`,
    className: "ht-action ht-pcard__cta"
  }, status === 'pending' ? /*#__PURE__*/React.createElement(Icon, {
    name: "Loader2",
    size: 16,
    style: {
      animation: 'ht-spin .8s linear infinite'
    }
  }) : status === 'added' ? /*#__PURE__*/React.createElement(Icon, {
    name: "Check",
    size: 16
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    size: 16
  }), soldOut ? 'אזל מהמלאי' : status === 'pending' ? 'מוסיף…' : status === 'added' ? 'נוסף לסל' : 'הוספה לסל'), status === 'error' ? /*#__PURE__*/React.createElement("p", {
    role: "alert",
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      color: 'var(--tw-red-600)'
    }
  }, "\u05D4\u05D4\u05D5\u05E1\u05E4\u05D4 \u05E0\u05DB\u05E9\u05DC\u05D4, \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1") : null));
}

export { formatPrice, ProductCard };
