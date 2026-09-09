import React from 'react';

const SIZE_PX = {
  sm: 24,
  md: 32,
  lg: 48
};
/** Brand arc colors, clockwise from the top-right. */
const ARC_COLORS = ['#2563eb', '#16a34a', '#eab308', '#dc2626'];

/**
 * Logo — circular brand emblem built from four colored arcs.
 * Always rendered at a fixed size and never mirrored or flipped for RTL.
 */
function Logo({
  size = 'md',
  title = 'Hatal',
  className = ''
}) {
  const px = SIZE_PX[size] || SIZE_PX.md;
  const decorative = title.trim().length === 0;
  return /*#__PURE__*/React.createElement("svg", {
    width: px,
    height: px,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    dir: "ltr",
    role: decorative ? 'presentation' : 'img',
    "aria-hidden": decorative ? true : undefined,
    "aria-label": decorative ? undefined : title,
    className: className,
    style: {
      transform: 'none',
      flexShrink: 0
    }
  }, !decorative && /*#__PURE__*/React.createElement("title", null, title), ARC_COLORS.map((color, index) => /*#__PURE__*/React.createElement("circle", {
    key: color,
    cx: "24",
    cy: "24",
    r: "18",
    stroke: color,
    strokeWidth: "7",
    strokeLinecap: "butt",
    strokeDasharray: "26 87.1",
    transform: `rotate(${-45 + index * 90} 24 24)`
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "5",
    fill: "#111827"
  }));
}

/** Wordmark lockup: emblem + brand name in the heading face. */
function LogoLockup({
  size = 'md',
  name = 'הטל',
  className = ''
}) {
  const fontSize = size === 'lg' ? 24 : size === 'sm' ? 15 : 19;
  return /*#__PURE__*/React.createElement("span", {
    dir: "rtl",
    className: className,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: size,
    title: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize,
      letterSpacing: '-0.01em',
      color: 'var(--text-primary)'
    }
  }, name));
}

export { Logo, LogoLockup };
