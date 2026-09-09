import React from 'react';
import { Icon } from '../core/Icon.jsx';

const {
  useEffect,
  useRef,
  useState
} = React;
/** CategoryNav — top-level category bar with optional dropdown submenus. */
function CategoryNav({
  items,
  activeId,
  onSelect,
  dir = 'rtl',
  className = '',
  ariaLabel = 'קטגוריות'
}) {
  const [openId, setOpenId] = useState(null);
  const navRef = useRef(null);
  useEffect(() => {
    if (!openId) return;
    const handlePointer = e => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenId(null);
    };
    const handleKey = e => {
      if (e.key === 'Escape') setOpenId(null);
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [openId]);
  return /*#__PURE__*/React.createElement("nav", {
    ref: navRef,
    dir: dir,
    "aria-label": ariaLabel,
    className: ('ht-catnav ' + className).trim()
  }, /*#__PURE__*/React.createElement("ul", {
    className: "ht-catnav__list"
  }, items.map(item => {
    const hasMenu = Boolean(item.items?.length);
    const isOpen = openId === item.id;
    const isActive = activeId === item.id;
    return /*#__PURE__*/React.createElement("li", {
      key: item.id,
      className: "ht-catnav__item"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-haspopup": hasMenu ? 'true' : undefined,
      "aria-expanded": hasMenu ? isOpen : undefined,
      "aria-current": isActive ? 'page' : undefined,
      onClick: () => {
        if (hasMenu) setOpenId(isOpen ? null : item.id);else {
          setOpenId(null);
          onSelect?.(item);
        }
      },
      className: 'ht-catnav__btn' + (isActive ? ' ht-catnav__btn--on' : '')
    }, /*#__PURE__*/React.createElement("span", null, item.label), hasMenu ? /*#__PURE__*/React.createElement(Icon, {
      name: "ChevronDown",
      size: 16,
      style: {
        flexShrink: 0,
        transition: 'transform var(--duration-fast)',
        transform: isOpen ? 'rotate(180deg)' : 'none'
      }
    }) : null), hasMenu && isOpen ? /*#__PURE__*/React.createElement("div", {
      role: "menu",
      "aria-label": item.label,
      className: "ht-catnav__menu"
    }, /*#__PURE__*/React.createElement("ul", null, item.items.map(sub => /*#__PURE__*/React.createElement("li", {
      key: sub.id
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      role: "menuitem",
      className: "ht-catnav__mitem",
      onClick: () => {
        setOpenId(null);
        onSelect?.(sub, item.id);
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block'
      }
    }, sub.label), sub.description ? /*#__PURE__*/React.createElement("span", {
      className: "ht-catnav__mdesc"
    }, sub.description) : null))))) : null);
  })));
}

export { CategoryNav };
