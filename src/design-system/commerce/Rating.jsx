import React from 'react';
import { Icon } from '../core/Icon.jsx';

const {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState
} = React;
const SIZES = {
  sm: {
    star: 14,
    text: 'var(--text-xs)',
    gap: 2
  },
  md: {
    star: 20,
    text: 'var(--text-sm)',
    gap: 4
  },
  lg: {
    star: 28,
    text: 'var(--text-base)',
    gap: 6
  }
};
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
function Star({
  fill,
  size
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "ht-rating__star",
    style: {
      width: size,
      height: size
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Star",
    size: size,
    strokeWidth: 1.5
  }), fill > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "ht-rating__fill",
    style: {
      width: `${fill * 100}%`
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Star",
    size: size,
    strokeWidth: 1.5,
    style: {
      fill: 'currentColor'
    }
  })) : null);
}

/** Rating — read-only fractional stars, or an interactive whole-star radiogroup when onChange is given. */
function Rating({
  value,
  max = 5,
  size = 'md',
  onChange,
  showValue = false,
  count,
  disabled = false,
  label = 'דירוג',
  className = ''
}) {
  const s = SIZES[size];
  const interactive = typeof onChange === 'function' && !disabled;
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [isRtl, setIsRtl] = useState(false);
  const labelId = useId();
  useEffect(() => {
    const node = groupRef.current;
    if (node) setIsRtl(getComputedStyle(node).direction === 'rtl');
  }, []);
  const safeValue = clamp(value, 0, max);
  const displayed = hovered ?? safeValue;
  const select = useCallback(next => {
    if (interactive) onChange?.(clamp(next, 0, max));
  }, [interactive, onChange, max]);
  const handleKeyDown = event => {
    if (!interactive) return;
    const forward = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = isRtl ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward || event.key === 'ArrowUp') {
      event.preventDefault();
      select(Math.floor(safeValue) + 1);
    } else if (event.key === backward || event.key === 'ArrowDown') {
      event.preventDefault();
      select(Math.ceil(safeValue) - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      select(1);
    } else if (event.key === 'End') {
      event.preventDefault();
      select(max);
    }
  };
  const stars = Array.from({
    length: max
  }, (_, index) => {
    const fill = clamp(displayed - index, 0, 1);
    const starValue = index + 1;
    if (!interactive) return /*#__PURE__*/React.createElement(Star, {
      key: starValue,
      fill: fill,
      size: s.star
    });
    const checked = Math.round(safeValue) === starValue;
    return /*#__PURE__*/React.createElement("button", {
      key: starValue,
      type: "button",
      role: "radio",
      "aria-checked": checked,
      "aria-label": `${starValue} כוכבים`,
      tabIndex: checked || safeValue === 0 && starValue === 1 ? 0 : -1,
      onClick: () => select(starValue),
      onMouseEnter: () => setHovered(starValue),
      onFocus: () => setHovered(starValue),
      onBlur: () => setHovered(null),
      className: "ht-rating__btn"
    }, /*#__PURE__*/React.createElement(Star, {
      fill: fill,
      size: s.star
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: ('ht-rating ' + className).trim(),
    style: {
      gap: s.gap,
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: groupRef,
    role: interactive ? 'radiogroup' : 'img',
    "aria-labelledby": interactive ? labelId : undefined,
    "aria-label": interactive ? undefined : `${label}: ${safeValue} מתוך ${max}`,
    "aria-disabled": disabled || undefined,
    onKeyDown: handleKeyDown,
    onMouseLeave: () => setHovered(null),
    className: "ht-rating",
    style: {
      gap: s.gap
    }
  }, interactive ? /*#__PURE__*/React.createElement("span", {
    id: labelId,
    className: "ht-sr"
  }, label) : null, stars), showValue ? /*#__PURE__*/React.createElement("bdi", {
    dir: "ltr",
    className: "ht-rating__value",
    style: {
      fontSize: s.text
    }
  }, safeValue.toFixed(1)) : null, typeof count === 'number' ? /*#__PURE__*/React.createElement("span", {
    className: "ht-rating__count",
    style: {
      fontSize: s.text
    }
  }, "(", /*#__PURE__*/React.createElement("bdi", {
    dir: "ltr",
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, count.toLocaleString()), ")") : null);
}

export { Rating };
