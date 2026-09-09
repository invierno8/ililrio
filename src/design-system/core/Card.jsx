import React from 'react';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PAD = {
  none: 'ht-pad-none',
  sm: 'ht-pad-sm',
  md: 'ht-pad-md',
  lg: 'ht-pad-lg'
};
const ASPECT = {
  square: '1 / 1',
  '4/3': '4 / 3',
  '16/9': '16 / 9'
};

/** Card — hairline container with optional media, header and footer slots. */
function Card({
  mediaSrc,
  mediaAlt = '',
  mediaAspect = '4/3',
  mediaPosition = 'top',
  media,
  header,
  footer,
  padding = 'md',
  elevation = 'raised',
  interactive = false,
  as: Component = 'div',
  className = '',
  children,
  ...rest
}) {
  const pad = PAD[padding];
  const hasMedia = Boolean(media || mediaSrc);
  const sideMedia = hasMedia && mediaPosition === 'start';
  const cls = ['ht-card', sideMedia ? 'ht-card--row' : '', elevation === 'raised' ? 'ht-card--raised' : '', interactive ? 'ht-card--interactive' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Component, _extends({
    className: cls
  }, rest), hasMedia ? /*#__PURE__*/React.createElement("div", {
    className: 'ht-card__media' + (sideMedia ? ' ht-card__media--side' : ''),
    style: sideMedia ? undefined : {
      aspectRatio: ASPECT[mediaAspect]
    }
  }, media ?? /*#__PURE__*/React.createElement("img", {
    src: mediaSrc,
    alt: mediaAlt,
    loading: "lazy"
  })) : null, /*#__PURE__*/React.createElement("div", {
    className: "ht-card__body"
  }, header ? /*#__PURE__*/React.createElement("div", {
    className: 'ht-card__header ' + pad
  }, header) : null, /*#__PURE__*/React.createElement("div", {
    className: pad,
    style: {
      flex: 1
    }
  }, children), footer ? /*#__PURE__*/React.createElement("div", {
    className: 'ht-card__footer ' + pad
  }, footer) : null));
}
function CardTitle({
  as: Heading = 'h3',
  className = '',
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Heading, _extends({
    className: ('ht-card__title ' + className).trim()
  }, rest), children);
}
function CardDescription({
  className = '',
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("p", _extends({
    className: ('ht-card__desc ' + className).trim()
  }, rest), children);
}

export { Card, CardTitle, CardDescription };
