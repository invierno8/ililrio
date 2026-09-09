import React from 'react';
import rioLogo from '../assets/rio-logo.svg';
/** תפריט הצד: לוגו, ניווט לפי פרסונה, מחליף פרסונות וכרטיס המשתמש. */
export default function Sidebar({ v }) {
  const {
    chevronStyle, currentUserName, navItems, personaOptions, sidebarCollapsed, sidebarCollapsedInv,
    sidebarExpanded, sidebarFooterStyle, sidebarHeaderStyle, sidebarStyle, toggleSidebar,
  } = v;
  return (
    <>
    {/* SIDENAV */}
    <aside style={sidebarStyle}>
      <div style={sidebarHeaderStyle}>
        {sidebarExpanded && (
          <img src={rioLogo} alt="RIO" style={{ width: '60px', height: '60px', flexShrink: '0', display: 'block' }} />
        )}
        {sidebarCollapsed && (
          <img src={rioLogo} alt="RIO" style={{ width: '32px', height: '32px', flexShrink: '0', display: 'block' }} />
        )}
        {sidebarExpanded && (
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '12.5px', lineHeight: '1.3', flex: '1 1 auto' }}>קטלוג האמצעים</div>
        )}
        <button onClick={toggleSidebar} title="כווץ/הרחב" style={{ width: '20px', height: '20px', borderRadius: '5px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', flexShrink: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0' }}>
          <span style={chevronStyle}></span>
        </button>
      </div>

      <nav style={{ flex: '1 1 auto', overflowY: 'auto', padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {(navItems || []).map((nav, navIdx) => (<React.Fragment key={navIdx}>
          <div>
            <button onClick={nav.onClick} style={nav.style}>
              <span style={nav.iconDotStyle}></span>
              {sidebarExpanded && (<>
                <span style={{ flex: '1 1 auto', textAlign: 'right' }}>{nav.label}</span>
                {nav.hasBadge && (
                  <span style={nav.badgeStyle}>{nav.badgeCount}</span>
                )}
                {nav.hasChildren && (
                  <span style={nav.chevronStyle2}></span>
                )}
              </>)}
            </button>
            {nav.childrenVisible && (<>
              {(nav.children || []).map((child, childIdx) => (<React.Fragment key={childIdx}>
                <button onClick={child.onClick} style={child.style}>{child.label}</button>
              </React.Fragment>))}
            </>)}
          </div>
        </React.Fragment>))}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', padding: '8px 6px' }}>
        {sidebarExpanded && (<>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '5px', padding: '0 3px' }}>משתמש לדוגמה</div>
          {(personaOptions || []).map((p, pIdx) => (<React.Fragment key={pIdx}>
            <div onClick={p.onSelect} style={p.style}>
              <span style={p.codeStyle}>{p.code}</span>
              <span style={{ fontSize: '10.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.label}</span>
            </div>
          </React.Fragment>))}
        </>)}
        {sidebarCollapsedInv && (<>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
            {(personaOptions || []).map((p, pIdx) => (<React.Fragment key={pIdx}>
              <div onClick={p.onSelect} style={p.codeStyle}>{p.code}</div>
            </React.Fragment>))}
          </div>
        </>)}
      </div>

      <div style={sidebarFooterStyle}>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--tw-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9.5px', fontWeight: '700', color: 'var(--tw-neutral-600)', flexShrink: '0' }}>רא</div>
        {sidebarExpanded && (
          <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUserName}</span>
        )}
      </div>
    </aside>
    </>
  );
}