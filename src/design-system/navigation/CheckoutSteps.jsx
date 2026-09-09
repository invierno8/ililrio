import React from 'react';
import { Icon } from '../core/Icon.jsx';

const defaultCheckoutSteps = [{
  id: 'details',
  label: 'פרטים'
}, {
  id: 'shipping',
  label: 'משלוח'
}, {
  id: 'payment',
  label: 'תשלום'
}, {
  id: 'confirmation',
  label: 'אישור'
}];
function getStepStatus(index, activeStep) {
  if (index < activeStep) return 'complete';
  if (index === activeStep) return 'current';
  return 'upcoming';
}

/** CheckoutSteps — numbered stepper; the connector chevron follows reading flow. */
function CheckoutSteps({
  steps = defaultCheckoutSteps,
  activeStep = 0,
  dir = 'rtl',
  onStepChange,
  ariaLabel = 'שלבי התשלום',
  className = ''
}) {
  const chevron = dir === 'rtl' ? 'ChevronLeft' : 'ChevronRight';
  return /*#__PURE__*/React.createElement("nav", {
    dir: dir,
    "aria-label": ariaLabel,
    className: ('ht-steps ' + className).trim()
  }, /*#__PURE__*/React.createElement("ol", {
    className: "ht-steps__list"
  }, steps.map((step, index) => {
    const status = getStepStatus(index, activeStep);
    const isInteractive = Boolean(onStepChange) && index <= activeStep;
    const isLast = index === steps.length - 1;
    const content = /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      className: ['ht-steps__circle', status === 'complete' ? 'ht-steps__circle--complete' : '', status === 'current' ? 'ht-steps__circle--current' : ''].filter(Boolean).join(' ')
    }, status === 'complete' ? /*#__PURE__*/React.createElement(Icon, {
      name: "Check",
      size: 16,
      strokeWidth: 3
    }) : index + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: ['ht-steps__label', status === 'current' ? 'ht-steps__label--current' : '', status === 'complete' ? 'ht-steps__label--complete' : ''].filter(Boolean).join(' ')
    }, step.label), step.description ? /*#__PURE__*/React.createElement("span", {
      className: "ht-steps__desc"
    }, step.description) : null));
    return /*#__PURE__*/React.createElement("li", {
      key: step.id,
      className: "ht-steps__item",
      "aria-current": status === 'current' ? 'step' : undefined
    }, isInteractive ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onStepChange?.(index, step),
      style: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        border: 0,
        background: 'transparent',
        padding: 4,
        cursor: 'pointer',
        borderRadius: 'var(--radius-control)'
      }
    }, content) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 4
      }
    }, content), !isLast ? /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      className: "ht-steps__conn"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'ht-steps__rule' + (status === 'complete' ? ' ht-steps__rule--complete' : '')
    }), /*#__PURE__*/React.createElement(Icon, {
      name: chevron,
      size: 16,
      strokeWidth: 2.5,
      style: {
        flexShrink: 0,
        color: status === 'complete' ? 'var(--tw-slate-900)' : 'var(--tw-slate-300)'
      }
    })) : null);
  })));
}

export { defaultCheckoutSteps, getStepStatus, CheckoutSteps };
