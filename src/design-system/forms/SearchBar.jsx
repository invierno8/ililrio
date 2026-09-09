import React from 'react';
import { Icon } from '../core/Icon.jsx';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  forwardRef,
  useCallback,
  useId,
  useState
} = React;
const SIZES = {
  sm: {
    h: 36,
    pad: 36,
    icon: 16,
    font: 'var(--text-sm)',
    start: 10,
    end: 4
  },
  md: {
    h: 44,
    pad: 44,
    icon: 20,
    font: 'var(--text-base)',
    start: 12,
    end: 6
  },
  lg: {
    h: 48,
    pad: 48,
    icon: 20,
    font: 'var(--text-lg)',
    start: 14,
    end: 8
  }
};

/** SearchBar — site search field with leading magnifier and a clear affordance. */
const SearchBar = forwardRef(function SearchBar({
  value,
  defaultValue = '',
  onValueChange,
  onSearch,
  placeholder = 'חיפוש כלי עבודה...',
  label = 'חיפוש',
  clearLabel = 'ניקוי החיפוש',
  clearable = true,
  size = 'md',
  disabled = false,
  className = '',
  onKeyDown,
  ...inputProps
}, ref) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;
  const inputId = useId();
  const s = SIZES[size];
  const setValue = useCallback(next => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  }, [isControlled, onValueChange]);
  const handleKeyDown = event => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Enter') onSearch?.(currentValue);
    if (event.key === 'Escape' && currentValue) setValue('');
  };
  const showClear = clearable && String(currentValue).length > 0 && !disabled;
  return /*#__PURE__*/React.createElement("div", {
    dir: "rtl",
    className: ('ht-search ' + className).trim()
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    className: "ht-sr"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "ht-search__icon",
    style: {
      insetInlineStart: s.start,
      color: disabled ? 'var(--tw-gray-300)' : undefined
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Search",
    size: s.icon
  })), /*#__PURE__*/React.createElement("input", _extends({}, inputProps, {
    id: inputId,
    ref: ref,
    type: "search",
    dir: "rtl",
    disabled: disabled,
    value: currentValue,
    placeholder: placeholder,
    onChange: e => setValue(e.target.value),
    onKeyDown: handleKeyDown,
    className: "ht-search__input",
    style: {
      height: s.h,
      paddingInlineStart: s.pad,
      paddingInlineEnd: s.pad,
      fontSize: s.font
    }
  })), showClear ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": clearLabel,
    onClick: () => setValue(''),
    className: "ht-search__clear",
    style: {
      insetInlineEnd: s.end
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: s.icon
  })) : null);
});

export { SearchBar };
