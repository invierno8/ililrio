import React from 'react';

const {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState
} = React;
const TabsContext = createContext(null);
function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsPanel must be rendered inside a Tabs component');
  return ctx;
}

/** Tabs — underline tab list with optional count badges; arrow keys follow writing direction. */
function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  fullWidth = false,
  children,
  className = '',
  ...rest
}) {
  const generatedId = useId();
  const baseId = `tabs-${String(generatedId).replace(/[:]/g, '')}`;
  const firstEnabled = items.find(i => !i.disabled)?.value ?? items[0]?.value ?? '';
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? firstEnabled);
  const activeValue = value ?? uncontrolledValue;
  const listRef = useRef(null);
  const selectTab = useCallback(next => {
    if (value === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
  }, [onValueChange, value]);
  const focusTabAt = useCallback(index => {
    const nodes = listRef.current?.querySelectorAll('[role="tab"]:not([disabled])');
    if (!nodes || nodes.length === 0) return;
    const target = nodes[(index + nodes.length) % nodes.length];
    target?.focus();
    target?.click();
  }, []);
  const enabledValues = useMemo(() => items.filter(i => !i.disabled).map(i => i.value), [items]);
  const handleKeyDown = event => {
    const currentIndex = enabledValues.indexOf(activeValue);
    if (currentIndex === -1) return;
    const isRtl = listRef.current ? getComputedStyle(listRef.current).direction === 'rtl' : false;
    const forward = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = isRtl ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward) {
      event.preventDefault();
      focusTabAt(currentIndex + 1);
    } else if (event.key === backward) {
      event.preventDefault();
      focusTabAt(currentIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusTabAt(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusTabAt(enabledValues.length - 1);
    }
  };
  const contextValue = useMemo(() => ({
    activeValue,
    baseId
  }), [activeValue, baseId]);
  return /*#__PURE__*/React.createElement(TabsContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement("div", {
    className: ('ht-tabs ' + className).trim()
  }, /*#__PURE__*/React.createElement("div", {
    ref: listRef,
    role: "tablist",
    "aria-label": rest['aria-label'],
    onKeyDown: handleKeyDown,
    className: "ht-tabs__list"
  }, items.map(item => {
    const selected = item.value === activeValue;
    return /*#__PURE__*/React.createElement("button", {
      key: item.value,
      type: "button",
      role: "tab",
      id: `${baseId}-tab-${item.value}`,
      "aria-selected": selected,
      "aria-controls": `${baseId}-panel-${item.value}`,
      tabIndex: selected ? 0 : -1,
      disabled: item.disabled,
      onClick: () => selectTab(item.value),
      className: ['ht-tab', selected ? 'ht-tab--on' : '', item.disabled ? 'ht-tab--disabled' : ''].filter(Boolean).join(' '),
      style: fullWidth ? {
        flex: 1
      } : undefined
    }, /*#__PURE__*/React.createElement("span", null, item.label), item.badge !== undefined ? /*#__PURE__*/React.createElement("span", {
      className: 'ht-tab__badge' + (selected ? ' ht-tab__badge--on' : '')
    }, item.badge) : null);
  })), children != null ? /*#__PURE__*/React.createElement("div", {
    className: "ht-tabs__panel"
  }, children) : null));
}
function TabsPanel({
  value,
  children,
  className = ''
}) {
  const {
    activeValue,
    baseId
  } = useTabsContext();
  if (value !== activeValue) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "tabpanel",
    id: `${baseId}-panel-${value}`,
    "aria-labelledby": `${baseId}-tab-${value}`,
    tabIndex: 0,
    className: className
  }, children);
}

export { useTabsContext, Tabs, TabsPanel };
