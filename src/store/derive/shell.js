import { PERSONAS } from '../../data/personas.js';
import { CURRENT_USER } from '../../data/people.js';
import { pendingApprovalsCount } from './shared.js';

/** תפריט הצד: פריטי הניווט, מחליף הפרסונות ומצב הקיפול. */
export function deriveShell(s, store) {
  const sidebarExpanded = !s.sidebarCollapsed;
  const sidebarCollapsed = s.sidebarCollapsed;
  const pendingCount = pendingApprovalsCount(s);

  const navRowStyle = (active, indent) => ({ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: s.sidebarCollapsed ? '7px' : ('7px 10px 7px ' + (indent || 10) + 'px'), borderRadius: 'var(--radius-control)', border: 'none', background: active ? 'var(--surface)' : 'transparent', color: active ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: active ? 700 : 500, fontSize: indent ? '11px' : '12px', fontFamily: 'var(--font-body)', cursor: 'pointer', justifyContent: s.sidebarCollapsed ? 'center' : 'flex-start' });
  const navBadgeStyle = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '16px', height: '16px', borderRadius: '9999px', background: 'var(--action-solid)', color: '#fff', fontSize: '9.5px', fontWeight: 700, padding: '0 4px' };
  const navDotStyle = (active) => ({ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, background: active ? 'var(--tw-neutral-900)' : 'var(--tw-neutral-300)' });

  const navItems = PERSONAS[s.currentPersona].nav.map((item) => {
    const active = item.id === s.activeScreenId || (item.id === 'my-items' && s.activeScreenId === 'my-items');
    const unread = item.id === 'notifications' ? s.notifications.filter((n) => !n.read).length : item.id === 'my-items' ? pendingCount : 0;
    const childrenVisible = sidebarExpanded && s.expandedNavId === item.id && (item.children || []).length > 0;
    return {
      label: item.label,
      onClick: () => store.goToNav(item.id),
      hasBadge: unread > 0,
      badgeCount: unread,
      style: navRowStyle(active),
      badgeStyle: navBadgeStyle,
      iconDotStyle: navDotStyle(active),
      hasChildren: (item.children || []).length > 0,
      childrenVisible,
      chevronStyle2: { width: '5px', height: '5px', borderTop: '1.4px solid currentColor', borderRight: '1.4px solid currentColor', transform: childrenVisible ? 'rotate(-45deg)' : 'rotate(135deg)', flexShrink: 0 },
      children: (item.children || []).map((c) => {
        const cActive = c.id === 'who-interested' ? (s.activeScreenId === 'my-items' && s.activeMyItemsTab === 'interest')
          : c.id === 'pending-approvals' ? (s.activeScreenId === 'my-items' && s.activeMyItemsTab === 'pending')
          : c.id === 'item-form' ? (s.activeScreenId === 'add-item' && s.addItemTab !== 'batch')
          : c.id === 'batch-import' ? (s.activeScreenId === 'add-item' && s.addItemTab === 'batch')
          : c.id === 'tags-thesaurus' ? (s.activeScreenId === 'managed-lists' && s.p4ManagedListsTab === 'tags')
          : c.id === s.activeScreenId;
        return { label: c.label, onClick: () => store.goToNav(c.id), style: navRowStyle(cActive, 30) };
      }),
    };
  });

  const personaOptions = Object.keys(PERSONAS).map((code) => ({
    code,
    label: PERSONAS[code].label,
    onSelect: () => store.switchPersona(code),
    style: { display: 'flex', alignItems: 'center', gap: '6px', width: '100%', padding: '5px 8px', borderRadius: 'var(--radius-control)', border: 'none', background: s.currentPersona === code ? 'var(--surface)' : 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-body)' },
    codeStyle: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0, fontSize: '9px', fontWeight: 700, background: s.currentPersona === code ? 'var(--tw-neutral-900)' : 'var(--tw-neutral-100)', color: s.currentPersona === code ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' },
  }));

  const sidebarStyle = { width: s.sidebarCollapsed ? '52px' : '176px', flexShrink: 0, borderInlineStart: '1px solid var(--border)', background: '#fff', display: 'flex', flexDirection: 'column', height: '100vh', transition: 'width var(--duration-base)' };
  const sidebarHeaderStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 10px', borderBottom: '1px solid var(--border)', minHeight: '48px' };
  const sidebarFooterStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderTop: '1px solid var(--border)' };
  const chevronStyle = { width: '7px', height: '7px', borderTop: '1.6px solid var(--text-secondary)', borderRight: '1.6px solid var(--text-secondary)', transform: s.sidebarCollapsed ? 'rotate(-45deg)' : 'rotate(135deg)' };

  return {
    currentUserName: CURRENT_USER,
    navItems,
    sidebarExpanded,
    sidebarCollapsed,
    sidebarCollapsedInv: s.sidebarCollapsed,
    sidebarStyle,
    sidebarHeaderStyle,
    sidebarFooterStyle,
    chevronStyle,
    toggleSidebar: store.toggleSidebar,
    personaOptions,
    currentPersona: s.currentPersona,

    isCatalogScreen: s.activeScreenId === 'catalog',
    isDetailScreen: s.activeScreenId === 'item-detail',
    isMyFollowsScreen: s.activeScreenId === 'my-follows',
    isNotificationsScreen: s.activeScreenId === 'notifications',
  };
}
