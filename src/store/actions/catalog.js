/** חיפוש וסינון בקטלוג. */
export function attachCatalogActions(store) {
  store.onSearchInputChange = (v) => store.setState({ searchInput: v });
  store.submitSearch = () => { if (store.state.searchInput.trim() !== '') store.setState({ searchQuery: store.state.searchInput.trim() }); };
  store.toggleTypeFilter = (v) => store.setState(s => ({ typeFilters: s.typeFilters.includes(v) ? s.typeFilters.filter(x => x !== v) : [...s.typeFilters, v] }));
  store.toggleDomainFilter = (v) => store.setState(s => ({ domainFilters: s.domainFilters.includes(v) ? s.domainFilters.filter(x => x !== v) : [...s.domainFilters, v] }));
  store.toggleTagFilter = (v) => store.setState(s => ({ tagFilters: s.tagFilters.includes(v) ? s.tagFilters.filter(x => x !== v) : [...s.tagFilters, v] }));
  store.removeFilter = (axis, v) => { if (axis === 'type') store.toggleTypeFilter(v); else if (axis === 'domain') store.toggleDomainFilter(v); else store.toggleTagFilter(v); };
  store.clearAllFilters = () => store.setState({ typeFilters: [], domainFilters: [], tagFilters: [] });
}
