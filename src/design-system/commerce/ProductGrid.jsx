import React from 'react';

const COLUMNS = {
  1: '1fr',
  2: 'repeat(2, minmax(0, 1fr))',
  3: 'repeat(3, minmax(0, 1fr))',
  4: 'repeat(4, minmax(0, 1fr))',
  5: 'repeat(5, minmax(0, 1fr))',
  6: 'repeat(6, minmax(0, 1fr))'
};

/** ProductGrid — responsive grid wrapper with loading skeletons and an empty state. */
function ProductGrid({
  children,
  columns = 4,
  gap = 'md',
  dir = 'rtl',
  emptyState,
  loading = false,
  loadingCount,
  label = 'מוצרים',
  className = ''
}) {
  const items = React.Children.toArray(children).filter(Boolean);
  const skeletonCount = loadingCount ?? columns * 2;
  const gridStyle = {
    gridTemplateColumns: COLUMNS[columns]
  };
  const cls = ['ht-grid', 'ht-grid--gap-' + gap, className].filter(Boolean).join(' ');
  if (loading) {
    return /*#__PURE__*/React.createElement("section", {
      dir: dir,
      "aria-label": label,
      "aria-busy": "true",
      style: {
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement("ul", {
      className: cls,
      style: gridStyle
    }, Array.from({
      length: skeletonCount
    }).map((_, index) => /*#__PURE__*/React.createElement("li", {
      key: index
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        borderRadius: 'var(--radius-field)',
        border: '1px solid var(--tw-neutral-200)',
        background: '#fff',
        padding: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "ht-skeleton",
      style: {
        aspectRatio: '1 / 1',
        width: '100%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "ht-skeleton",
      style: {
        marginTop: 12,
        height: 12,
        width: '75%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "ht-skeleton",
      style: {
        marginTop: 8,
        height: 12,
        width: '33%'
      }
    }))))));
  }
  if (items.length === 0) {
    return /*#__PURE__*/React.createElement("section", {
      dir: dir,
      "aria-label": label,
      style: {
        width: '100%'
      }
    }, emptyState ?? /*#__PURE__*/React.createElement("div", {
      className: "ht-grid__empty"
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        color: 'var(--tw-neutral-900)'
      }
    }, "\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '4px 0 0',
        fontSize: 'var(--text-sm)',
        color: 'var(--tw-neutral-500)'
      }
    }, "\u05E0\u05E1\u05D5 \u05DC\u05E9\u05E0\u05D5\u05EA \u05D0\u05EA \u05D4\u05E1\u05D9\u05E0\u05D5\u05DF \u05D0\u05D5 \u05D0\u05EA \u05DE\u05D9\u05DC\u05D5\u05EA \u05D4\u05D7\u05D9\u05E4\u05D5\u05E9.")));
  }
  return /*#__PURE__*/React.createElement("section", {
    dir: dir,
    "aria-label": label,
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("ul", {
    className: cls,
    style: gridStyle
  }, items.map((child, index) => /*#__PURE__*/React.createElement("li", {
    key: child?.key ?? index
  }, child))));
}

export { ProductGrid };
