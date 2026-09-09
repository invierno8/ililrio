import React from 'react';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — RTL-first action button. Deep blue #0B63A6 fill for primary actions,
 * 6px radius, subtle elevation on hover. Icons render at the logical start of
 * the label, which appears visually on the right in RTL.
 */
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  children,
  type = 'button',
  dir = 'rtl',
  ...props
}) {
  const isDisabled = disabled || loading;
  const cls = ['ht-btn', 'ht-btn--' + size, 'ht-btn--' + variant, fullWidth ? 'ht-btn--full' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({}, props, {
    type: type,
    dir: dir,
    disabled: isDisabled,
    "aria-busy": loading || undefined,
    className: cls
  }), loading ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "ht-btn__spinner"
  }) : icon ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "ht-btn__icon"
  }, icon) : null, /*#__PURE__*/React.createElement("span", null, children));
}

export { Button };
