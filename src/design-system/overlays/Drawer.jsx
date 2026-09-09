import React from 'react';
import { Icon } from '../core/Icon.jsx';

const {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState
} = React;
const INLINE_SIZES = {
  sm: 320,
  md: 448,
  lg: 672,
  full: '100%'
};
const BLOCK_SIZES = {
  sm: '25%',
  md: '40%',
  lg: '75%',
  full: '100%'
};
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Drawer — edge-anchored panel. The "side" prop is logical: 'end' resolves to
 * the left edge in RTL and the right edge in LTR.
 */
function Drawer({
  open,
  onClose,
  title,
  description,
  side = 'end',
  size = 'md',
  hideHeader = false,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  dir,
  className = '',
  children
}) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);
  const [rtl, setRtl] = useState(dir ? dir === 'rtl' : true);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    if (dir) {
      setRtl(dir === 'rtl');
      return;
    }
    if (typeof window !== 'undefined') setRtl(getComputedStyle(document.body).direction === 'rtl');
  }, [dir, open]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    previouslyFocused.current = document.activeElement;
    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (panel) (panel.querySelector(FOCUSABLE) ?? panel).focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);
  const handleKeyDown = useCallback(event => {
    if (event.key === 'Escape' && closeOnEscape) {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !panelRef.current) return;
    const nodes = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null);
    if (nodes.length === 0) {
      event.preventDefault();
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, [closeOnEscape, onClose]);
  if (!open) return null;
  const isHorizontal = side === 'start' || side === 'end';
  const physical = isHorizontal ? side === 'end' ? rtl ? 'left' : 'right' : rtl ? 'right' : 'left' : side;
  const pos = {
    left: {
      top: 0,
      bottom: 0,
      left: 0,
      borderRight: '1px solid var(--tw-slate-200)'
    },
    right: {
      top: 0,
      bottom: 0,
      right: 0,
      borderLeft: '1px solid var(--tw-slate-200)'
    },
    top: {
      left: 0,
      right: 0,
      top: 0,
      borderBottom: '1px solid var(--tw-slate-200)'
    },
    bottom: {
      left: 0,
      right: 0,
      bottom: 0,
      borderTop: '1px solid var(--tw-slate-200)'
    }
  }[physical];
  const sizing = isHorizontal ? {
    width: '100%',
    maxWidth: INLINE_SIZES[size]
  } : {
    height: BLOCK_SIZES[size]
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ht-drawer-root",
    dir: rtl ? 'rtl' : 'ltr',
    onKeyDown: handleKeyDown
  }, /*#__PURE__*/React.createElement("div", {
    className: "ht-overlay",
    style: {
      background: 'rgba(15,23,42,.5)'
    },
    "aria-hidden": "true",
    onClick: closeOnOverlayClick ? onClose : undefined
  }), /*#__PURE__*/React.createElement("div", {
    ref: panelRef,
    role: "dialog",
    "aria-modal": "true",
    tabIndex: -1,
    "aria-labelledby": title && !hideHeader ? titleId : undefined,
    "aria-describedby": description && !hideHeader ? descriptionId : undefined,
    "aria-label": hideHeader ? title : undefined,
    className: ('ht-drawer ' + className).trim(),
    style: {
      ...pos,
      ...sizing
    }
  }, !hideHeader ? /*#__PURE__*/React.createElement("header", {
    className: "ht-drawer__header"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, title ? /*#__PURE__*/React.createElement("h2", {
    id: titleId,
    className: "ht-drawer__title"
  }, title) : null, description ? /*#__PURE__*/React.createElement("p", {
    id: descriptionId,
    className: "ht-drawer__desc"
  }, description) : null), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "\u05E1\u05D2\u05D9\u05E8\u05D4",
    className: "ht-iconbtn",
    style: {
      width: 36,
      height: 36,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 20
  }))) : null, /*#__PURE__*/React.createElement("div", {
    className: "ht-drawer__body"
  }, children), footer ? /*#__PURE__*/React.createElement("footer", {
    className: "ht-drawer__footer"
  }, footer) : null));
}

export { Drawer };
