import { PERSONAS } from '../../data/personas.js';
import { MY_ITEMS_IDS } from '../../data/seeds.js';
import { emptyForm } from '../../data/form.js';

/** ניווט בין מסכים, מעבר בין פרסונות וקיפול תפריט הצד. */
export function attachShellActions(store) {
  store.toggleSidebar = () => store.setState(s => ({ sidebarCollapsed: !s.sidebarCollapsed }));
  store.toggleFilters = () => store.setState(s => ({ filtersOpen: !s.filtersOpen }));
  store.setGridView = () => store.setState({ viewMode: 'grid' });
  store.setListView = () => store.setState({ viewMode: 'list' });
  store.goToCatalogHome = () => store.setState({ activeScreenId: 'catalog' });
  store.switchPersona = (code) => store.setState({ currentPersona: code, activeScreenId: PERSONAS[code].nav[0].id, filtersOpen: false, expandedNavId: null });
  store.setMyItemsTab = (tab) => store.setState({ activeMyItemsTab: tab });
  store.goToNav = (id) => {
    if (id === 'who-interested') { store.openWhoInterested(store.state.whoInterestedItemId || MY_ITEMS_IDS[0]); return; }
    if (id === 'pending-approvals') { store.setState({ activeScreenId: 'my-items', activeMyItemsTab: 'pending', expandedNavId: 'my-items' }); return; }
    if (id === 'item-form') { store.setState(s => ({ activeScreenId: 'add-item', addItemTab: 'form', expandedNavId: 'add-item', itemForm: s.itemForm || emptyForm(), formMode: s.itemForm ? s.formMode : 'new' })); return; }
    if (id === 'batch-import') { store.setState({ activeScreenId: 'add-item', addItemTab: 'batch', expandedNavId: 'add-item' }); return; }
    if (id === 'add-item') { store.setState(s => ({ activeScreenId: 'add-item', expandedNavId: 'add-item', addItemTab: s.addItemTab || 'form', itemForm: s.itemForm || emptyForm(), formMode: s.itemForm ? s.formMode : 'new' })); return; }
    if (id === 'tags-thesaurus') { store.setState({ activeScreenId: 'managed-lists', p4ManagedListsTab: 'tags', expandedNavId: 'managed-lists' }); return; }
    const parent = PERSONAS[store.state.currentPersona].nav.find(n => n.id === id);
    const patch = { activeScreenId: id, filtersOpen: false };
    if (id === 'my-items') patch.activeMyItemsTab = 'items';
    if (parent && parent.children && parent.children.length) patch.expandedNavId = id;
    store.setState(patch);
  };
}
