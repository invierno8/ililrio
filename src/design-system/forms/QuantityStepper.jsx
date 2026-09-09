import React from 'react';
import { Icon } from '../core/Icon.jsx';

const {
  useCallback,
  useId,
  useState
} = React;
const SIZES = {
  sm: {
    btn: 32,
    icon: 14,
    input: 36,
    font: 'var(--text-sm)'
  },
  md: {
    btn: 40,
    icon: 16,
    input: 48,
    font: 'var(--text-base)'
  }
};
function clampQuantity(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** QuantityStepper — minus / value / plus. Decrement sits at the inline start in both directions. */
function QuantityStepper({
  value,
  defaultValue = 1,
  min = 1,
  max = 99,
  step = 1,
  disabled = false,
  loading = false,
  size = 'md',
  label = 'כמות',
  onChange,
  className = ''
}) {
  const [internalValue, setInternalValue] = useState(() => clampQuantity(defaultValue, min, max));
  const isControlled = value !== undefined;
  const current = clampQuantity(isControlled ? value : internalValue, min, max);
  const inputId = useId();
  const s = SIZES[size];
  const commit = useCallback(next => {
    const clamped = clampQuantity(next, min, max);
    if (clamped === current) return;
    if (!isControlled) setInternalValue(clamped);
    onChange?.(clamped);
  }, [current, isControlled, max, min, onChange]);
  const isBusy = disabled || loading;
  const canDecrement = !isBusy && current > min;
  const canIncrement = !isBusy && current < max;
  return /*#__PURE__*/React.createElement("div", {
    className: ['ht-qty', 'ht-qty--' + size, className].filter(Boolean).join(' '),
    style: isBusy ? {
      opacity: 0.6
    } : undefined
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => commit(current - step),
    disabled: !canDecrement,
    "aria-controls": inputId,
    "aria-label": `הפחתת ${label}`,
    className: "ht-qty__btn",
    style: {
      width: s.btn
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Minus",
    size: s.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "ht-qty__value"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    className: "ht-sr"
  }, label), /*#__PURE__*/React.createElement("input", {
    id: inputId,
    type: "text",
    inputMode: "numeric",
    dir: "ltr",
    role: "spinbutton",
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": current,
    "aria-busy": loading || undefined,
    disabled: isBusy,
    value: String(current),
    onChange: e => {
      const digits = e.target.value.replace(/[^0-9]/g, '');
      if (digits === '') return;
      commit(Number(digits));
    },
    onBlur: e => commit(Number(e.target.value.replace(/[^0-9]/g, ''))),
    className: "ht-qty__input",
    style: {
      width: s.input,
      fontSize: s.font
    }
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => commit(current + step),
    disabled: !canIncrement,
    "aria-controls": inputId,
    "aria-label": `הוספת ${label}`,
    className: "ht-qty__btn",
    style: {
      width: s.btn
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    size: s.icon
  })));
}

export { clampQuantity, QuantityStepper };
