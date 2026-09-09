import React from 'react';
import { Badge, Checkbox, SearchBar } from '../design-system/index.js';
/** קטלוג האמצעים: חיפוש, מסננים ותצוגת רשת או רשימה. */
export default function CatalogScreen({ v }) {
  const {
    clearAllFilters, clearAllStyle, displayItems, domainOptions, emptyRemoveChipStyle, emptyStateBody,
    emptyStateTitle, filterButtonStyle, filterChips, filterCountSuffix, filterIconStyle, filtersOpen,
    gridButtonStyle, gridIconStyle, hasActiveFilters, isCatalogScreen, listButtonStyle, listIconStyle,
    listRowStyle, noResults, onSearchInputChange, resultsCountText, searchInput, setGridView,
    setListView, showGrid, showList, submitSearch, tagOptions, toggleFilters, typeOptions,
    viewToggleWrapStyle,
  } = v;
  return (
    <>
      {/* CATALOG */}
      {isCatalogScreen && (<>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 auto', minWidth: '240px', maxWidth: '520px' }}>
              <SearchBar value={searchInput} onValueChange={onSearchInputChange} onSearch={submitSearch} placeholder="חפשו פריט..." />
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={toggleFilters} style={filterButtonStyle}>
                <span style={filterIconStyle}></span>
                <span>מסננים{filterCountSuffix}</span>
              </button>
              {filtersOpen && (<>
                <div style={{ position: 'absolute', top: '46px', left: '0', width: '240px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-dropdown)', padding: '16px', zIndex: '30' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>סוג האמצעי</span><span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '11px', lineHeight: '1', padding: '4px 8px', border: '1px dashed var(--border)', borderRadius: '9999px', background: 'var(--surface)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>הצעה · ממצא 5</span></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {(typeOptions || []).map((opt, optIdx) => (<React.Fragment key={optIdx}>
                      <Checkbox checked={opt.checked} onChange={opt.onToggle} label={opt.label} size="sm" />
                    </React.Fragment>))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>זירה או תחום</span><span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '11px', lineHeight: '1', padding: '4px 8px', border: '1px dashed var(--border)', borderRadius: '9999px', background: 'var(--surface)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>הצעה · ממצא 5</span></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {(domainOptions || []).map((opt, optIdx) => (<React.Fragment key={optIdx}>
                      <Checkbox checked={opt.checked} onChange={opt.onToggle} label={opt.label} size="sm" />
                    </React.Fragment>))}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>תגיות</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(tagOptions || []).map((opt, optIdx) => (<React.Fragment key={optIdx}>
                      <Checkbox checked={opt.checked} onChange={opt.onToggle} label={opt.label} size="sm" />
                    </React.Fragment>))}
                  </div>
                </div>
              </>)}
            </div>
            <div style={viewToggleWrapStyle}>
              <button onClick={setGridView} style={gridButtonStyle}>
                <span style={gridIconStyle}></span>
                רשת
              </button>
              <button onClick={setListView} style={listButtonStyle}>
                <span style={listIconStyle}></span>
                רשימה
              </button>
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', marginInlineStart: 'auto' }}>{resultsCountText}</div>
          </div>

          {hasActiveFilters && (<>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {(filterChips || []).map((chip, chipIdx) => (<React.Fragment key={chipIdx}>
                <span style={chip.chipStyle}>
                  {chip.label}
                  <button onClick={chip.onRemove} aria-label="הסר" style={chip.removeBtnStyle}>✕</button>
                </span>
              </React.Fragment>))}
              <button onClick={clearAllFilters} style={clearAllStyle}>נקה הכל</button>
            </div>
          </>)}

          {noResults && (<>
            <div style={{ margin: '60px auto', maxWidth: '440px', textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '17px', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>{emptyStateTitle}</div>
              <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '18px' }}>{emptyStateBody}</div>
              {hasActiveFilters && (<>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {(filterChips || []).map((chip, chipIdx) => (<React.Fragment key={chipIdx}>
                    <button onClick={chip.onRemove} style={emptyRemoveChipStyle}>הסר: {chip.label}</button>
                  </React.Fragment>))}
                </div>
              </>)}
            </div>
          </>)}

          {showGrid && (<>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
              {(displayItems || []).map((item, itemIdx) => (<React.Fragment key={itemIdx}>
                <div onClick={item.onOpen} className="ht-card ht-card--raised ht-card--interactive">
                  <div className="ht-card__media" style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>תמונה</div>
                  <div className="ht-card__body">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', borderBottom: '1px solid var(--tw-gray-200)', padding: '6px 10px' }}>
                      <Badge variant="neutral" size="sm">{item.body}</Badge>
                      <Badge variant={item.statusVariant} size="sm" withDot={true}>{item.status}</Badge>
                    </div>
                    <div style={{ padding: '10px' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: '700', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '4px', minHeight: '34px' }}>{item.name}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</div>
                    </div>
                  </div>
                </div>
              </React.Fragment>))}
            </div>
          </>)}

          {showList && (<>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
              {(displayItems || []).map((item, itemIdx) => (<React.Fragment key={itemIdx}>
                <div onClick={item.onOpen} style={listRowStyle}>
                  <div style={{ width: '56px', height: '40px', borderRadius: '6px', background: 'var(--tw-gray-100)', flexShrink: '0' }}></div>
                  <div style={{ flex: '1 1 auto', minWidth: '0' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <span style={item.bodyPillStyle}>{item.body}</span>
                  </div>
                  <Badge variant={item.statusVariant} size="sm" withDot={true}>{item.status}</Badge>
                </div>
              </React.Fragment>))}
            </div>
          </>)}
        </div>
      </>)}
    </>
  );
}