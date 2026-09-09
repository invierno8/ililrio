import React from 'react';
import {
  AlertCircle, Check, ChevronDown, ChevronLeft, ChevronRight, Loader2, Minus,
  MoreHorizontal, Plus, Search, ShoppingBag, Star, Trash2, X,
} from 'lucide';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

/**
 * Icon — thin wrapper around the Lucide icon set (lucide 0.522.0). Renders the
 * named icon's paths inside a stroke-based 24x24 svg.
 *
 * The design-system bundle looked the icon set up off `window.lucide`; here the
 * icons the components actually reference are imported by name, so the bundler
 * only ships those.
 */
const ICONS = {
  AlertCircle, Check, ChevronDown, ChevronLeft, ChevronRight, Loader2, Minus,
  MoreHorizontal, Plus, Search, ShoppingBag, Star, Trash2, X,
};

function Icon({
  name,
  size = 16,
  strokeWidth = 2,
  color = 'currentColor',
  className = '',
  style,
  ...rest
}) {
  const node = ICONS[name] || ICONS[name && name.replace(/Icon$/, '')];
  const children = Array.isArray(node) ? node : node && node.length ? node : [];
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
    className: className,
    style: style
  }, rest), children.map(([tag, attrs], i) => React.createElement(tag, {
    key: i,
    ...attrs
  })));
}

export { Icon };
