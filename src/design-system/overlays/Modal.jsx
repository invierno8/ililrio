import React from 'react';
import { Icon } from '../core/Icon.jsx';

const {
  useCallback,
  useEffect,
  useRef
} = React;
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Modal — centered dialog with overlay blur, focus trap and Escape-to-close. */
function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  dir = 'rtl',
  hideCloseButton = false,
  closeLabel = 'סגירה',
  closeOnOverlayClick = true
}) {
  const panelRef = useRef(null);
  const ids = useRef({
    title: 'modal-title-' + Math.random().toString(36).slice(2, 9),
    desc: 'modal-desc-' + Math.random().toString(36).slice(2, 9)
  }).current;
  const handleKeyDown = useCallback(event => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !panelRef.current) return;
    const nodes = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter(n => n.offsetParent !== null);
    if (nodes.length === 0) {
      event.preventDefault();
      panelRef.current.focus();
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
  }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    const raf = requestAnimationFrame(() => {
      (panelRef.current?.querySelector(FOCUSABLE) ?? panelRef.current)?.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, handleKeyDown]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    dir: dir,
    className: "ht-modal-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ht-overlay ht-overlay--blur",
    "aria-hidden": "true",
    onClick: closeOnOverlayClick ? onClose : undefined
  }), /*#__PURE__*/React.createElement("div", {
    ref: panelRef,
    role: "dialog",
    "aria-modal": "true",
    tabIndex: -1,
    "aria-labelledby": title ? ids.title : undefined,
    "aria-describedby": description ? ids.desc : undefined,
    className: 'ht-modal ht-modal--' + size
  }, title || !hideCloseButton ? /*#__PURE__*/React.createElement("header", {
    className: "ht-modal__header"
  }, !hideCloseButton ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": closeLabel,
    className: "ht-iconbtn",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 20
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1,
      textAlign: 'start'
    }
  }, title ? /*#__PURE__*/React.createElement("h2", {
    id: ids.title,
    className: "ht-modal__title"
  }, title) : null, description ? /*#__PURE__*/React.createElement("p", {
    id: ids.desc,
    className: "ht-modal__desc"
  }, description) : null)) : null, /*#__PURE__*/React.createElement("div", {
    className: "ht-modal__body"
  }, children), footer ? /*#__PURE__*/React.createElement("footer", {
    className: "ht-modal__footer"
  }, footer) : null));
}

export { Modal };
