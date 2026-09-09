import React from 'react';

const {
  createContext,
  useContext,
  useId,
  useMemo,
  useState
} = React;
const SIZES = {
  sm: {
    control: 16,
    dot: 6,
    label: 'var(--text-sm)',
    desc: 'var(--text-xs)'
  },
  md: {
    control: 20,
    dot: 8,
    label: 'var(--text-base)',
    desc: 'var(--text-sm)'
  }
};
const RadioGroupContext = createContext(null);

/** RadioGroup — card-style radio rows; the selected row gets a blue border and tint. */
function RadioGroup({
  label,
  description,
  options,
  value,
  defaultValue,
  onChange,
  name,
  size = 'md',
  disabled = false,
  required = false,
  error,
  className = ''
}) {
  const reactId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const selected = isControlled ? value : internalValue;
  const handleSelect = next => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };
  const context = useMemo(() => ({
    name: name ?? `radio-group-${reactId}`,
    value: selected,
    size,
    invalid: Boolean(error),
    groupDisabled: disabled,
    onSelect: handleSelect
  }), [name, reactId, selected, size, error, disabled]);
  const descriptionId = description ? `${reactId}-description` : undefined;
  const errorId = error ? `${reactId}-error` : undefined;
  return /*#__PURE__*/React.createElement("fieldset", {
    className: ('ht-radio-group ' + className).trim(),
    "aria-describedby": [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
    "aria-invalid": error ? true : undefined,
    disabled: disabled
  }, label ? /*#__PURE__*/React.createElement("legend", {
    className: "ht-radio-group__legend"
  }, label, required ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginInlineStart: 4,
      color: 'var(--tw-red-600)'
    },
    "aria-hidden": "true"
  }, "*") : null) : null, description ? /*#__PURE__*/React.createElement("p", {
    id: descriptionId,
    className: "ht-radio-group__desc"
  }, description) : null, /*#__PURE__*/React.createElement(RadioGroupContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    "aria-label": label,
    className: "ht-radio-group__list"
  }, options.map(option => /*#__PURE__*/React.createElement(RadioGroupItem, {
    key: option.value,
    option: option
  })))), error ? /*#__PURE__*/React.createElement("p", {
    id: errorId,
    role: "alert",
    style: {
      margin: '8px 0 0',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      color: 'var(--tw-red-600)'
    }
  }, error) : null);
}
function RadioGroupItem({
  option
}) {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error('RadioGroupItem must be rendered inside a RadioGroup');
  const {
    name,
    value,
    size,
    invalid,
    groupDisabled,
    onSelect
  } = context;
  const s = SIZES[size];
  const isSelected = value === option.value;
  const isDisabled = groupDisabled || Boolean(option.disabled);
  return /*#__PURE__*/React.createElement("label", {
    className: ['ht-radio', 'ht-radio--' + size, isSelected ? 'ht-radio--on' : '', isDisabled ? 'ht-radio--disabled' : ''].filter(Boolean).join(' '),
    style: invalid && !isSelected ? {
      borderColor: 'var(--tw-red-200)'
    } : undefined
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      minWidth: 0,
      flexDirection: 'column',
      textAlign: 'start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ht-radio__label",
    style: {
      fontSize: s.label
    }
  }, option.label), option.description ? /*#__PURE__*/React.createElement("span", {
    className: "ht-radio__desc",
    style: {
      fontSize: s.desc
    }
  }, option.description) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexShrink: 0,
      alignItems: 'center',
      gap: 12
    }
  }, option.meta ? /*#__PURE__*/React.createElement("span", {
    className: "ht-radio__meta",
    style: {
      fontSize: s.desc
    }
  }, option.meta) : null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: option.value,
    checked: isSelected,
    disabled: isDisabled,
    onChange: () => onSelect(option.value),
    className: "ht-sr"
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: 'ht-radio__control' + (isSelected ? ' ht-radio__control--on' : ''),
    style: {
      width: s.control,
      height: s.control
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: 'ht-radio__dot' + (isSelected ? ' ht-radio__dot--on' : ''),
    style: {
      width: s.dot,
      height: s.dot
    }
  }))));
}

export { RadioGroup, RadioGroupItem };
