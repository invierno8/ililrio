import React, { useEffect, useRef } from 'react';
import { useRio } from './store/index.js';
import Sidebar from './components/Sidebar.jsx';
import ScreenSkeleton, { BootSkeleton } from './components/Skeleton.jsx';

import CatalogScreen from './screens/CatalogScreen.jsx';
import ItemDetailScreen from './screens/ItemDetailScreen.jsx';
import MyFollowsScreen from './screens/MyFollowsScreen.jsx';
import NotificationsScreen from './screens/NotificationsScreen.jsx';
import MyItemsScreen from './screens/MyItemsScreen.jsx';
import AddItemScreen from './screens/AddItemScreen.jsx';
import MyTasksScreen from './screens/MyTasksScreen.jsx';
import UsersScreen from './screens/admin/UsersScreen.jsx';
import ApproversScreen from './screens/admin/ApproversScreen.jsx';
import UserDetailScreen from './screens/admin/UserDetailScreen.jsx';
import RoleTransferScreen from './screens/admin/RoleTransferScreen.jsx';
import ManagedListsScreen from './screens/admin/ManagedListsScreen.jsx';
import ActivityLogScreen from './screens/admin/ActivityLogScreen.jsx';
import EntryGateScreen from './screens/admin/EntryGateScreen.jsx';

/** כמה זמן מוצג שלד — קצר מספיק כדי לא לעכב, ארוך מספיק כדי לא להבהב. */
const BOOT_MS = 650;
const SCREEN_MS = 320;

const shellStyle = { display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: 'var(--background)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: '1.4' };
const mainStyle = { flex: '1 1 auto', height: '100vh', overflowY: 'auto', padding: '18px 20px 48px', zoom: '0.88' };
const bannerStyle = { display: 'flex', alignItems: 'center', height: '34px', padding: '0 12px', margin: '-18px -20px 16px', background: 'var(--tw-amber-50, #fffbeb)', borderBottom: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)' };

/**
 * מעטפת הדמו: תפריט הצד, אזור התוכן וכל המסכים. כל מסך מחליט בעצמו אם הוא
 * מוצג, לפי הדגלים שמגיעים מ-v — בדיוק כמו באב-הטיפוס המקורי.
 */
export default function App() {
  const { state, store, v } = useRio();
  const mainRef = useRef(null);

  // אזור התוכן הוא שגולל, ולא החלון — לכן החנות מקבלת אליו הפניה.
  useEffect(() => {
    store.mainScrollEl = mainRef.current;
  });

  // טעינת פתיחה
  useEffect(() => {
    const t = setTimeout(() => store.setState({ bootLoading: false }), BOOT_MS);
    return () => clearTimeout(t);
  }, [store]);

  // מעבר מסך, פריט או פרסונה — שלד קצר במקום החלפה פתאומית.
  const screenKey = [state.currentPersona, state.activeScreenId, state.selectedItemId ?? ''].join(':');
  const lastKey = useRef(screenKey);
  useEffect(() => {
    if (lastKey.current === screenKey) return;
    lastKey.current = screenKey;
    store.setState({ screenLoading: true });
    const t = setTimeout(() => store.setState({ screenLoading: false }), SCREEN_MS);
    return () => clearTimeout(t);
  }, [screenKey, store]);

  if (state.bootLoading) {
    return (
      <div dir="rtl" style={shellStyle}>
        <BootSkeleton />
      </div>
    );
  }

  return (
    <div dir="rtl" style={shellStyle}>
      <Sidebar v={v} />

      <main ref={mainRef} style={mainStyle}>
        <div style={bannerStyle}>
          ערכי צירי הסינון, רמות הסיווג, סוגי המסמכים ומצאי שדות המאפיינים מוצגים כהצעה לצורך הדגמה. ממצאים 1, 5, 7 ו-54 פתוחים.
        </div>

        {state.screenLoading ? (
          <ScreenSkeleton screenId={state.activeScreenId} />
        ) : (
          <div className="rio-screen" key={screenKey}>
            <CatalogScreen v={v} />
            <ItemDetailScreen v={v} />
            <MyFollowsScreen v={v} />
            <NotificationsScreen v={v} />
            <MyItemsScreen v={v} />
            <AddItemScreen v={v} />
            <MyTasksScreen v={v} />
            <UsersScreen v={v} />
            <ApproversScreen v={v} />
            <UserDetailScreen v={v} />
            <RoleTransferScreen v={v} />
            <ManagedListsScreen v={v} />
            <ActivityLogScreen v={v} />
            <EntryGateScreen v={v} />
          </div>
        )}
      </main>
    </div>
  );
}
