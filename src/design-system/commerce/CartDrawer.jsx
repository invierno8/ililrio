import React from 'react';
import { Icon } from '../core/Icon.jsx';

const {
  useEffect,
  useRef
} = React;
function formatCartPrice(value, currency = 'ILS', locale = 'he-IL') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
}
function Money({
  value,
  currency,
  locale,
  emphasis = false
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums',
      fontSize: emphasis ? 'var(--text-base)' : 'var(--text-sm)',
      fontWeight: emphasis ? 600 : 400,
      color: emphasis ? 'var(--tw-neutral-900)' : 'var(--tw-neutral-700)'
    }
  }, formatCartPrice(value, currency, locale));
}
function Row({
  item,
  currency,
  locale,
  disabled,
  onQuantityChange,
  onRemove
}) {
  const btn = {
    display: 'flex',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    border: 0,
    background: 'transparent',
    color: 'var(--tw-neutral-700)',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("li", {
    style: {
      display: 'flex',
      gap: 12,
      padding: '16px 0',
      borderBottom: '1px solid var(--tw-neutral-200)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      flexShrink: 0,
      overflow: 'hidden',
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--tw-neutral-200)',
      background: 'var(--tw-neutral-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--tw-neutral-400)'
    }
  }, item.imageUrl ? /*#__PURE__*/React.createElement("img", {
    src: item.imageUrl,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingBag",
    size: 20
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
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      color: 'var(--tw-neutral-900)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, item.name), item.variant ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: 'var(--tw-neutral-500)'
    }
  }, item.variant) : null), /*#__PURE__*/React.createElement(Money, {
    value: item.price * item.quantity,
    currency: currency,
    locale: locale
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--tw-neutral-300)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: btn,
    "aria-label": "\u05D4\u05E4\u05D7\u05EA\u05EA \u05DB\u05DE\u05D5\u05EA",
    disabled: disabled || item.quantity <= 1,
    onClick: () => onQuantityChange?.(item.id, item.quantity - 1)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Minus",
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 32,
      textAlign: 'center',
      fontSize: 'var(--text-sm)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--tw-neutral-900)'
    }
  }, item.quantity), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: btn,
    "aria-label": "\u05D4\u05D5\u05E1\u05E4\u05EA \u05DB\u05DE\u05D5\u05EA",
    disabled: disabled,
    onClick: () => onQuantityChange?.(item.id, item.quantity + 1)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    size: 14
  }))), onRemove ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    onClick: () => onRemove(item.id),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      border: 0,
      background: 'transparent',
      borderRadius: 'var(--radius-control)',
      padding: '4px 6px',
      fontSize: 'var(--text-xs)',
      color: 'var(--tw-neutral-500)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Trash2",
    size: 14
  }), "\u05D4\u05E1\u05E8\u05D4") : null)));
}

/** CartDrawer — the mini-cart. Pinned to the inline-start edge, so it enters from the visual right in RTL. */
function CartDrawer({
  open,
  items,
  currency = 'ILS',
  locale = 'he-IL',
  note,
  loading = false,
  error = null,
  onClose,
  onCheckout,
  onQuantityChange,
  onRemove
}) {
  const closeRef = useRef(null);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const isEmpty = !loading && items.length === 0;
  useEffect(() => {
    if (!open) return;
    const onKeyDown = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    dir: "rtl",
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 'var(--z-index-modal)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ht-overlay",
    style: {
      background: 'var(--overlay-soft)'
    },
    onClick: onClose,
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "\u05E1\u05DC \u05D4\u05E7\u05E0\u05D9\u05D5\u05EA",
    className: "ht-cart"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ht-cart__header"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      fontWeight: 600,
      color: 'var(--tw-neutral-900)'
    }
  }, "\u05E1\u05DC \u05D4\u05E7\u05E0\u05D9\u05D5\u05EA", /*#__PURE__*/React.createElement("span", {
    style: {
      marginInlineStart: 8,
      fontSize: 'var(--text-sm)',
      fontWeight: 400,
      color: 'var(--tw-neutral-500)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, count, " \u05E4\u05E8\u05D9\u05D8\u05D9\u05DD")), /*#__PURE__*/React.createElement("button", {
    ref: closeRef,
    type: "button",
    onClick: onClose,
    "aria-label": "\u05E1\u05D2\u05D9\u05E8\u05EA \u05D4\u05E1\u05DC",
    className: "ht-iconbtn",
    style: {
      width: 32,
      height: 32
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ht-cart__body"
  }, error ? /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      margin: '16px 0',
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--tw-red-200)',
      background: 'var(--tw-red-50)',
      padding: '8px 12px',
      fontSize: 'var(--text-sm)',
      color: 'var(--tw-red-700)'
    }
  }, error) : null, isEmpty ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '64px 0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShoppingBag",
    size: 32,
    color: "var(--tw-neutral-300)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      color: 'var(--tw-neutral-900)'
    }
  }, "\u05D4\u05E1\u05DC \u05E9\u05DC\u05DA \u05E8\u05D9\u05E7"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 224,
      fontSize: 'var(--text-xs)',
      color: 'var(--tw-neutral-500)'
    }
  }, "\u05E2\u05D1\u05E8\u05D5 \u05DC\u05E7\u05D8\u05DC\u05D5\u05D2 \u05D5\u05D4\u05D5\u05E1\u05D9\u05E4\u05D5 \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD \u05DC\u05E1\u05DC.")) : /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
  }, items.map(item => /*#__PURE__*/React.createElement(Row, {
    key: item.id,
    item: item,
    currency: currency,
    locale: locale,
    disabled: loading,
    onQuantityChange: onQuantityChange,
    onRemove: onRemove
  })))), /*#__PURE__*/React.createElement("footer", {
    className: "ht-cart__footer"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--tw-neutral-600)'
    }
  }, "\u05E1\u05D4\u05F4\u05DB"), /*#__PURE__*/React.createElement(Money, {
    value: subtotal,
    currency: currency,
    locale: locale,
    emphasis: true
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 'var(--text-xs)',
      color: 'var(--tw-neutral-500)'
    }
  }, note ?? 'מיסים ומשלוח מחושבים בתשלום.'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCheckout,
    disabled: loading || isEmpty || !!error,
    className: "ht-action",
    style: {
      marginTop: 16,
      height: 44,
      width: '100%'
    }
  }, loading ? 'טוען…' : 'המשך לתשלום'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    style: {
      marginTop: 8,
      display: 'inline-flex',
      height: 36,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      border: 0,
      background: 'transparent',
      borderRadius: 'var(--radius-control)',
      fontSize: 'var(--text-sm)',
      color: 'var(--tw-neutral-600)',
      cursor: 'pointer'
    }
  }, "\u05D4\u05DE\u05E9\u05DA \u05D1\u05E7\u05E0\u05D9\u05D5\u05EA"))));
}

export { formatCartPrice, CartDrawer };
