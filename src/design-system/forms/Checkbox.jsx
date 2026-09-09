import React from 'react';
import { Icon } from '../core/Icon.jsx';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  forwardRef,
  useId,
  useState
} = React;
/** Checkbox — RTL row with the box at the inline start, optional description and error. */
const Checkbox = forwardRef(function Checkbox({
  label,
  description,
  error,
  indeterminate = false,
  size = 'md',
  className = '',
  disabled,
  id,
  checked,
  defaultChecked,
  onChange,
  ...inputProps
}, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(Boolean(defaultChecked));
  const on = isControlled ? checked : internal;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const iconSize = size === 'sm' ? 12 : 14;
  return /*#__PURE__*/React.createElement("div", {
    dir: "rtl",
    className: ('ht-check ' + className).trim()
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    className: 'ht-check__row' + (disabled ? ' ht-check__row--disabled' : '')
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({}, inputProps, {
    id: inputId,
    ref: ref,
    type: "checkbox",
    disabled: disabled,
    checked: on,
    onChange: e => {
      if (!isControlled) setInternal(e.target.checked);
      onChange?.(e);
    },
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      margin: 0,
      appearance: 'none',
      opacity: 0,
      cursor: 'inherit'
    }
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: ['ht-check__box', 'ht-check__box--' + size, on || indeterminate ? 'ht-check__box--on' : '', error ? 'ht-check__box--error' : ''].filter(Boolean).join(' ')
  }, on || indeterminate ? /*#__PURE__*/React.createElement(Icon, {
    name: indeterminate && !on ? 'Minus' : 'Check',
    size: iconSize,
    strokeWidth: 3
  }) : null)), label || description ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'right'
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    className: "ht-check__label",
    style: {
      fontSize: size === 'sm' ? 'var(--text-sm)' : 'var(--text-base)'
    }
  }, label) : null, description ? /*#__PURE__*/React.createElement("span", {
    id: descriptionId,
    className: "ht-check__desc"
  }, description) : null) : null), error ? /*#__PURE__*/React.createElement("span", {
    id: errorId,
    style: {
      textAlign: 'right',
      fontSize: 'var(--text-sm)',
      color: 'var(--tw-red-600)'
    }
  }, error) : null);
});

export { Checkbox };
