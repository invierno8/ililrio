import React from 'react';
import { Icon } from '../core/Icon.jsx';

const {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} = React;
/** Select — listbox-pattern dropdown with keyboard support and optional option descriptions. */
function Select({
  options,
  value,
  defaultValue = null,
  onChange,
  label,
  placeholder = 'בחר אפשרות',
  hint,
  error,
  dir,
  size = 'md',
  disabled = false,
  fullWidth = true,
  name,
  className = ''
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = isControlled ? value ?? null : internalValue;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const reactId = useId();
  const listboxId = `${reactId}-listbox`;
  const labelId = `${reactId}-label`;
  const describedById = error ? `${reactId}-error` : hint ? `${reactId}-hint` : undefined;
  const selectedOption = useMemo(() => options.find(o => o.value === selectedValue) ?? null, [options, selectedValue]);
  const firstEnabledIndex = options.findIndex(o => !o.disabled);
  const commit = useCallback(option => {
    if (option.disabled) return;
    if (!isControlled) setInternalValue(option.value);
    onChange?.(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }, [isControlled, onChange]);
  const openList = useCallback(index => {
    if (disabled) return;
    const selectedIndex = options.findIndex(o => o.value === selectedValue);
    setActiveIndex(index ?? (selectedIndex >= 0 ? selectedIndex : firstEnabledIndex));
    setOpen(true);
  }, [disabled, firstEnabledIndex, options, selectedValue]);
  const moveActive = useCallback(step => {
    setActiveIndex(current => {
      let next = current;
      for (let i = 0; i < options.length; i += 1) {
        next = (next + step + options.length) % options.length;
        if (!options[next]?.disabled) return next;
      }
      return current;
    });
  }, [options]);
  useEffect(() => {
    if (!open) return;
    const handle = e => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);
  const handleKeyDown = event => {
    if (disabled) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        open ? moveActive(1) : openList();
        break;
      case 'ArrowUp':
        event.preventDefault();
        open ? moveActive(-1) : openList();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!open) openList();else if (options[activeIndex]) commit(options[activeIndex]);
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  };
  const invalid = Boolean(error);
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    dir: dir,
    className: ['ht-select', className].filter(Boolean).join(' '),
    style: {
      width: fullWidth ? '100%' : 256
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    id: labelId,
    htmlFor: `${reactId}-trigger`,
    className: "ht-select__label"
  }, label) : null, /*#__PURE__*/React.createElement("button", {
    id: `${reactId}-trigger`,
    ref: triggerRef,
    type: "button",
    role: "combobox",
    "aria-haspopup": "listbox",
    "aria-expanded": open,
    "aria-controls": open ? listboxId : undefined,
    "aria-describedby": describedById,
    "aria-invalid": invalid || undefined,
    disabled: disabled,
    onClick: () => open ? setOpen(false) : openList(),
    onKeyDown: handleKeyDown,
    className: ['ht-select__trigger', 'ht-select__trigger--' + size, invalid ? 'ht-select__trigger--error' : ''].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("span", {
    className: 'ht-select__value' + (selectedOption ? '' : ' ht-select__value--placeholder')
  }, selectedOption ? selectedOption.label : placeholder), /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronDown",
    size: 16,
    style: {
      flexShrink: 0,
      transition: 'transform var(--duration-fast)',
      transform: open ? 'rotate(180deg)' : 'none',
      color: disabled ? 'var(--tw-neutral-300)' : 'var(--tw-neutral-500)'
    }
  })), name ? /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: name,
    value: selectedValue ?? ''
  }) : null, open ? /*#__PURE__*/React.createElement("ul", {
    id: listboxId,
    role: "listbox",
    "aria-labelledby": label ? labelId : undefined,
    tabIndex: -1,
    className: "ht-select__list"
  }, options.length === 0 ? /*#__PURE__*/React.createElement("li", {
    className: "ht-select__opt ht-select__opt--disabled"
  }, "\u05D0\u05D9\u05DF \u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA") : null, options.map((option, index) => {
    const isSelected = option.value === selectedValue;
    const isActive = index === activeIndex;
    return /*#__PURE__*/React.createElement("li", {
      key: option.value,
      role: "option",
      "aria-selected": isSelected,
      "aria-disabled": option.disabled || undefined,
      onMouseEnter: () => !option.disabled && setActiveIndex(index),
      onClick: () => commit(option),
      className: ['ht-select__opt', option.disabled ? 'ht-select__opt--disabled' : '', isActive && !option.disabled ? 'ht-select__opt--active' : ''].filter(Boolean).join(' ')
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontWeight: isSelected ? 500 : 400
      }
    }, option.label), option.description ? /*#__PURE__*/React.createElement("span", {
      className: "ht-select__opt-desc"
    }, option.description) : null), isSelected ? /*#__PURE__*/React.createElement(Icon, {
      name: "Check",
      size: 16,
      style: {
        marginTop: 2,
        flexShrink: 0
      }
    }) : null);
  })) : null, error ? /*#__PURE__*/React.createElement("p", {
    id: `${reactId}-error`,
    style: {
      margin: '6px 0 0',
      fontSize: 'var(--text-xs)',
      color: 'var(--tw-red-600)'
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("p", {
    id: `${reactId}-hint`,
    style: {
      margin: '6px 0 0',
      fontSize: 'var(--text-xs)',
      color: 'var(--tw-neutral-500)'
    }
  }, hint) : null);
}

export { Select };
