import React from 'react';
import { Icon } from '../core/Icon.jsx';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  forwardRef,
  useId
} = React;
/**
 * Input — RTL label-above-field text input. Numeric, tel and email values are
 * bidi-isolated as an LTR run so digits never reorder inside Hebrew copy.
 */
const Input = forwardRef(function Input({
  label,
  helperText,
  error,
  size = 'md',
  fullWidth = true,
  ltrValue,
  suffix,
  required,
  className = '',
  id,
  type = 'text',
  disabled,
  dir,
  style,
  ...rest
}, ref) {
  const generatedId = useId();
  const inputId = id ?? `input-${generatedId}`;
  const describedById = error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined;
  const isNumeric = ltrValue ?? (type === 'number' || type === 'tel' || type === 'email');
  return /*#__PURE__*/React.createElement("div", {
    dir: "rtl",
    className: "ht-field",
    style: {
      width: fullWidth ? '100%' : 'auto'
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    className: 'ht-field__label' + (disabled ? ' ht-field__label--disabled' : '')
  }, label, required ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "ht-field__req"
  }, "*") : null) : null, /*#__PURE__*/React.createElement("div", {
    className: "ht-field__wrap"
  }, /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    ref: ref,
    id: inputId,
    type: type,
    dir: dir ?? (isNumeric ? 'ltr' : 'rtl'),
    disabled: disabled,
    required: required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedById,
    style: isNumeric ? {
      unicodeBidi: 'isolate',
      textAlign: 'right',
      ...style
    } : style,
    className: ['ht-input', 'ht-input--' + size, error ? 'ht-input--error' : '', className].filter(Boolean).join(' ')
  })), suffix ? /*#__PURE__*/React.createElement("span", {
    className: "ht-field__suffix",
    "aria-hidden": "true"
  }, suffix) : null), error ? /*#__PURE__*/React.createElement("p", {
    id: `${inputId}-error`,
    role: "alert",
    className: "ht-field__error"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "AlertCircle",
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, error)) : helperText ? /*#__PURE__*/React.createElement("p", {
    id: `${inputId}-helper`,
    className: "ht-field__hint"
  }, helperText) : null);
});

export { Input };
