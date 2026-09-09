import React from 'react';
import { Icon } from '../core/Icon.jsx';

const {
  useId,
  useState
} = React;
function createEmptyFilterValue(priceFloor = 0, priceCeiling = 1000) {
  return {
    category: '',
    brands: [],
    voltage: '',
    priceMin: priceFloor,
    priceMax: priceCeiling
  };
}
function countActiveFilters(value, priceFloor = 0, priceCeiling = 1000) {
  let count = 0;
  if (value.category) count += 1;
  count += value.brands.length;
  if (value.voltage) count += 1;
  if (value.priceMin > priceFloor || value.priceMax < priceCeiling) count += 1;
  return count;
}
function Facet({
  title,
  children,
  defaultOpen = true
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  return /*#__PURE__*/React.createElement("section", {
    className: "ht-facet"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(p => !p),
    "aria-expanded": open,
    "aria-controls": contentId,
    className: "ht-facet__btn"
  }, title, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronDown",
    size: 16,
    className: "ht-facet__chev",
    style: {
      transform: open ? 'rotate(180deg)' : 'none'
    }
  }))), open ? /*#__PURE__*/React.createElement("div", {
    id: contentId,
    className: "ht-facet__body"
  }, children) : null);
}

/** FilterSidebar — catalog facets: category select, brand checkboxes, voltage radios, price range. */
function FilterSidebar({
  categories,
  brands,
  voltages,
  value,
  onChange,
  priceFloor = 0,
  priceCeiling = 1000,
  currency = '₪',
  resultCount,
  disabled = false,
  className = ''
}) {
  const groupId = useId();
  const activeCount = countActiveFilters(value, priceFloor, priceCeiling);
  const update = patch => onChange({
    ...value,
    ...patch
  });
  const toggleBrand = brand => update({
    brands: value.brands.includes(brand) ? value.brands.filter(b => b !== brand) : [...value.brands, brand]
  });
  return /*#__PURE__*/React.createElement("aside", {
    dir: "rtl",
    "aria-label": "\u05E1\u05D9\u05E0\u05D5\u05DF \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD",
    className: ('ht-filters ' + className).trim()
  }, /*#__PURE__*/React.createElement("div", {
    className: "ht-filters__head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "ht-filters__title"
  }, "\u05E1\u05D9\u05E0\u05D5\u05DF"), activeCount > 0 ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    className: "ht-filters__clear",
    onClick: () => onChange(createEmptyFilterValue(priceFloor, priceCeiling))
  }, "\u05E0\u05E7\u05D4 \u05D4\u05DB\u05DC") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Facet, {
    title: "\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", {
    "aria-label": "\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4",
    disabled: disabled,
    value: value.category,
    onChange: e => update({
      category: e.target.value
    }),
    className: "ht-facet__select"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u05DB\u05DC \u05D4\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D5\u05EA"), categories.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label, typeof o.count === 'number' ? ' (' + o.count + ')' : ''))), /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronDown",
    size: 16,
    style: {
      position: 'absolute',
      insetInlineEnd: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--tw-gray-500)'
    }
  }))), /*#__PURE__*/React.createElement(Facet, {
    title: "\u05DE\u05D5\u05EA\u05D2"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "ht-facet__list"
  }, brands.map(option => {
    const checked = value.brands.includes(option.value);
    return /*#__PURE__*/React.createElement("li", {
      key: option.value
    }, /*#__PURE__*/React.createElement("label", {
      className: "ht-facet__row",
      style: disabled ? {
        cursor: 'not-allowed',
        color: 'var(--tw-gray-400)'
      } : undefined
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex',
        width: 16,
        height: 16,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: checked,
      disabled: disabled,
      onChange: () => toggleBrand(option.value),
      style: {
        width: 16,
        height: 16,
        margin: 0,
        appearance: 'none',
        borderRadius: 4,
        border: '1px solid ' + (checked ? 'var(--tw-gray-900)' : 'var(--tw-gray-300)'),
        background: checked ? 'var(--tw-gray-900)' : '#fff'
      }
    }), checked ? /*#__PURE__*/React.createElement(Icon, {
      name: "Check",
      size: 12,
      strokeWidth: 3,
      color: "#fff",
      style: {
        position: 'absolute',
        pointerEvents: 'none'
      }
    }) : null), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, option.label), typeof option.count === 'number' ? /*#__PURE__*/React.createElement("span", {
      className: "ht-facet__count"
    }, option.count) : null));
  }))), /*#__PURE__*/React.createElement(Facet, {
    title: "\u05DE\u05EA\u05D7"
  }, /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    "aria-label": "\u05DE\u05EA\u05D7",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, [{
    value: '',
    label: 'כל המתחים'
  }, ...voltages].map(option => /*#__PURE__*/React.createElement("label", {
    key: option.value || 'any',
    className: "ht-facet__row"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: groupId + '-voltage',
    value: option.value,
    checked: value.voltage === option.value,
    disabled: disabled,
    onChange: () => update({
      voltage: option.value
    }),
    style: {
      width: 16,
      height: 16,
      margin: 0,
      appearance: 'none',
      borderRadius: '50%',
      background: '#fff',
      border: value.voltage === option.value ? '5px solid var(--tw-gray-900)' : '1px solid var(--tw-gray-300)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, option.label))))), /*#__PURE__*/React.createElement(Facet, {
    title: "\u05D8\u05D5\u05D5\u05D7 \u05DE\u05D7\u05D9\u05E8\u05D9\u05DD"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 'var(--text-sm)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--tw-gray-700)'
    }
  }, /*#__PURE__*/React.createElement("span", null, currency, value.priceMin), /*#__PURE__*/React.createElement("span", null, currency, value.priceMax)), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      color: 'var(--tw-gray-500)'
    }
  }, "\u05DE\u05D9\u05E0\u05D9\u05DE\u05D5\u05DD", /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: priceFloor,
    max: priceCeiling,
    value: value.priceMin,
    disabled: disabled,
    onChange: e => update({
      priceMin: Math.min(Number(e.target.value), value.priceMax)
    }),
    className: "ht-facet__range",
    style: {
      marginTop: 4
    }
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      color: 'var(--tw-gray-500)'
    }
  }, "\u05DE\u05E7\u05E1\u05D9\u05DE\u05D5\u05DD", /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: priceFloor,
    max: priceCeiling,
    value: value.priceMax,
    disabled: disabled,
    onChange: e => update({
      priceMax: Math.max(Number(e.target.value), value.priceMin)
    }),
    className: "ht-facet__range",
    style: {
      marginTop: 4
    }
  }))))), typeof resultCount === 'number' ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '16px 0 0',
      fontSize: 'var(--text-xs)',
      color: 'var(--tw-gray-500)'
    }
  }, resultCount, " \u05EA\u05D5\u05E6\u05D0\u05D5\u05EA") : null);
}

export { createEmptyFilterValue, countActiveFilters, FilterSidebar };
