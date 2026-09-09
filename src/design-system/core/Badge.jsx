import React from 'react';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  neutral: {
    bg: 'var(--tw-slate-100)',
    fg: 'var(--tw-slate-700)',
    ring: 'var(--tw-slate-200)',
    dot: 'var(--tw-slate-400)'
  },
  info: {
    bg: 'var(--tw-blue-50)',
    fg: 'var(--tw-blue-700)',
    ring: 'var(--tw-blue-200)',
    dot: 'var(--tw-blue-500)'
  },
  success: {
    bg: 'var(--tw-green-50)',
    fg: 'var(--tw-green-700)',
    ring: 'var(--tw-green-200)',
    dot: 'var(--tw-green-500)'
  },
  warning: {
    bg: 'var(--tw-amber-50)',
    fg: 'var(--tw-amber-800)',
    ring: 'var(--tw-amber-200)',
    dot: 'var(--tw-amber-500)'
  },
  danger: {
    bg: 'var(--tw-red-50)',
    fg: 'var(--tw-red-700)',
    ring: 'var(--tw-red-200)',
    dot: 'var(--tw-red-500)'
  }
};

/** Badge — inline status pill with an optional leading dot or icon. */
function Badge({
  variant = 'neutral',
  size = 'md',
  withDot = false,
  icon,
  children,
  className = '',
  style,
  ...rest
}) {
  const tone = TONES[variant] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['ht-badge', 'ht-badge--' + size, className].filter(Boolean).join(' '),
    style: {
      background: tone.bg,
      color: tone.fg,
      '--ht-badge-ring': tone.ring,
      ...style
    }
  }, rest), withDot ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "ht-badge__dot",
    style: {
      background: tone.dot
    }
  }) : null, icon ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "ht-badge__icon"
  }, icon) : null, children);
}

export { Badge };
