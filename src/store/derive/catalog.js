import { ITEMS } from '../../data/items.js';
import { AXIS_TYPE_VALUES, AXIS_DOMAIN_VALUES } from '../../data/taxonomy.js';
import { controlBtnBase, chipBase, chipRemoveBtnStyle } from './shared.js';

/** מסך הקטלוג: חיפוש, מסננים, מצב רשת/רשימה ומצבי ריק. */
export function deriveCatalog(s, store) {
  const filtered = ITEMS.filter((it) => {
    const q = s.searchQuery.trim();
    const matchesSearch = !q || (it.name + it.body + it.desc).includes(q);
    const matchesType = s.typeFilters.length === 0 || s.typeFilters.includes(it.type);
    const matchesDomain = s.domainFilters.length === 0 || s.domainFilters.includes(it.domain);
    const matchesTag = s.tagFilters.length === 0 || (it.tags || []).some((t) => s.tagFilters.includes(t));
    return matchesSearch && matchesType && matchesDomain && matchesTag;
  });

  const filterChips = [
    ...s.typeFilters.map((v) => ({ axis: 'type', value: v, label: 'סוג: ' + v })),
    ...s.domainFilters.map((v) => ({ axis: 'domain', value: v, label: 'זירה: ' + v })),
    ...s.tagFilters.map((v) => ({ axis: 'tag', value: v, label: 'תגית: ' + v })),
  ].map((chip) => ({ ...chip, onRemove: () => store.removeFilter(chip.axis, chip.value) }));
  const hasActiveFilters = filterChips.length > 0;
  const filterCountSuffix = hasActiveFilters ? ' (' + filterChips.length + ')' : '';

  let emptyStateTitle = '';
  let emptyStateBody = '';
  if (filtered.length === 0) {
    if (hasActiveFilters) {
      emptyStateTitle = 'הסינון הנוכחי לא החזיר תוצאות';
      emptyStateBody = 'אחד או יותר מהמסננים הפעילים חוסם את כל התוצאות. הסירו מסנן כדי להרחיב את החיפוש:';
    } else {
      emptyStateTitle = 'לא נמצאו תוצאות';
      emptyStateBody = 'נסו לנסח מחדש את החיפוש או להרחיב את הקריטריונים.';
    }
  }

  const allTags = [...new Set(ITEMS.flatMap((it) => it.tags || []))];
  const typeOptions = AXIS_TYPE_VALUES.map((v) => ({ value: v, label: v, checked: s.typeFilters.includes(v), onToggle: () => store.toggleTypeFilter(v) }));
  const domainOptions = AXIS_DOMAIN_VALUES.map((v) => ({ value: v, label: v, checked: s.domainFilters.includes(v), onToggle: () => store.toggleDomainFilter(v) }));
  const tagOptions = allTags.map((v) => ({ value: v, label: v, checked: s.tagFilters.includes(v), onToggle: () => store.toggleTagFilter(v) }));

  const displayItems = filtered.map((it) => ({
    ...it,
    statusLabel: it.status,
    onOpen: () => store.openItem(it.id, 'catalog', 'קטלוג'),
    bodyPillStyle: { display: 'inline-block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--surface)', borderRadius: '4px', padding: '2px 8px', marginTop: '4px' },
  }));

  const noResults = filtered.length === 0;
  const showGrid = !noResults && s.viewMode === 'grid';
  const showList = !noResults && s.viewMode === 'list';

  const filterButtonStyle = { ...controlBtnBase, border: '1px solid ' + (hasActiveFilters ? 'var(--tw-neutral-900)' : 'var(--border)'), borderRadius: 'var(--radius-field)', color: 'var(--text-primary)', background: '#fff' };
  const filterIconStyle = { width: '13px', height: '13px', display: 'inline-block', borderTop: '2px solid currentColor', position: 'relative' };
  const viewToggleWrapStyle = { display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-field)', overflow: 'hidden' };
  const segBtn = (on) => ({ ...controlBtnBase, borderRadius: 0, background: on ? 'var(--action-solid)' : '#fff', color: on ? '#fff' : 'var(--text-secondary)' });
  const gridIconStyle = { width: '12px', height: '12px', display: 'inline-block', backgroundImage: 'linear-gradient(currentColor,currentColor)', backgroundSize: '5px 5px', backgroundRepeat: 'space' };
  const listIconStyle = { width: '12px', height: '10px', display: 'inline-block', borderTop: '2px solid currentColor', borderBottom: '2px solid currentColor' };
  const listRowStyle = { display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' };

  return {
    searchInput: s.searchInput,
    onSearchInputChange: store.onSearchInputChange,
    submitSearch: store.submitSearch,
    toggleFilters: store.toggleFilters,
    filtersOpen: s.filtersOpen,
    filterButtonStyle,
    filterIconStyle,
    filterCountSuffix,
    typeOptions,
    domainOptions,
    tagOptions,
    viewToggleWrapStyle,
    gridButtonStyle: segBtn(s.viewMode === 'grid'),
    listButtonStyle: segBtn(s.viewMode === 'list'),
    gridIconStyle,
    listIconStyle,
    setGridView: store.setGridView,
    setListView: store.setListView,
    resultsCountText: filtered.length + ' תוצאות מתוך ' + ITEMS.length,
    hasActiveFilters,
    filterChips: filterChips.map((c) => ({ ...c, chipStyle: chipBase, removeBtnStyle: chipRemoveBtnStyle })),
    clearAllFilters: store.clearAllFilters,
    noResults,
    emptyStateTitle,
    emptyStateBody,
    showGrid,
    showList,
    displayItems,
    listRowStyle,
  };
}
