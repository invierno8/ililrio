import React from 'react';
import { Icon } from '../core/Icon.jsx';

const {
  useEffect,
  useRef,
  useState
} = React;
const VARIANTS = {
  success: {
    icon: 'CheckCircle2',
    color: 'var(--tw-emerald-600)',
    ring: 'var(--tw-emerald-200)',
    role: 'status'
  },
  error: {
    icon: 'XCircle',
    color: 'var(--tw-red-600)',
    ring: 'var(--tw-red-200)',
    role: 'alert'
  },
  warning: {
    icon: 'AlertTriangle',
    color: 'var(--tw-amber-600)',
    ring: 'var(--tw-amber-200)',
    role: 'alert'
  },
  info: {
    icon: 'Info',
    color: 'var(--tw-slate-600)',
    ring: 'var(--tw-slate-200)',
    role: 'status'
  }
};

/** Toast — transient confirmation. Auto-dismisses after 4s; pauses while hovered. */
function Toast({
  message,
  description,
  variant = 'success',
  dir = 'rtl',
  open = true,
  duration = 4000,
  dismissible = true,
  onDismiss,
  dismissLabel,
  className = ''
}) {
  const [visible, setVisible] = useState(open);
  const paused = useRef(false);
  const v = VARIANTS[variant] || VARIANTS.success;
  const label = dismissLabel ?? (dir === 'rtl' ? 'סגירה' : 'Dismiss');
  useEffect(() => {
    setVisible(open);
  }, [open]);
  useEffect(() => {
    if (!visible || duration == null) return;
    const timer = window.setTimeout(() => {
      if (!paused.current) {
        setVisible(false);
        onDismiss?.();
      }
    }, duration);
    return () => window.clearTimeout(timer);
  }, [visible, duration]);
  if (!visible) return null;
  return /*#__PURE__*/React.createElement("div", {
    dir: dir,
    role: v.role,
    "aria-live": v.role === 'alert' ? 'assertive' : 'polite',
    onMouseEnter: () => {
      paused.current = true;
    },
    onMouseLeave: () => {
      paused.current = false;
    },
    className: ('ht-toast ' + className).trim(),
    style: {
      '--ht-toast-ring': v.ring
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 2,
      flexShrink: 0,
      color: v.color,
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: v.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1,
      textAlign: 'end'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "ht-toast__msg"
  }, message), description ? /*#__PURE__*/React.createElement("p", {
    className: "ht-toast__desc"
  }, description) : null), dismissible ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setVisible(false);
      onDismiss?.();
    },
    "aria-label": label,
    className: "ht-iconbtn",
    style: {
      marginTop: 2,
      flexShrink: 0,
      color: 'var(--tw-slate-400)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    size: 16
  })) : null);
}

/** ToastStack — fixed container; toasts stack downward from the top, aligned to the reading start. */
function ToastStack({
  children,
  dir = 'rtl',
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    dir: dir,
    className: ('ht-toast-stack ' + className).trim()
  }, children);
}

export { Toast, ToastStack };
