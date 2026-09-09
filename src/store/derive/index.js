import { sharedVals } from './shared.js';
import { deriveShell } from './shell.js';
import { deriveCatalog } from './catalog.js';
import { deriveDetail } from './detail.js';
import { deriveFollows } from './follows.js';
import { deriveNotifications } from './notifications.js';
import { deriveMyItems } from './myItems.js';
import { deriveItemForm } from './itemForm.js';
import { deriveBatch } from './batch.js';
import { deriveMyTasks } from './myTasks.js';
import { deriveAdmin } from './admin.js';

/**
 * הופך את המצב הגולמי לערכים שהמסכים מציגים: תוויות, שורות טבלה, סגנונות
 * ומטפלי אירועים. כל מסך מקבל את התוצאה כאובייקט אחד (v).
 */
export function deriveVals(s, store) {
  return {
    ...sharedVals,
    ...deriveShell(s, store),
    ...deriveCatalog(s, store),
    ...deriveDetail(s, store),
    ...deriveFollows(s, store),
    ...deriveNotifications(s, store),
    ...deriveMyItems(s, store),
    ...deriveItemForm(s, store),
    ...deriveBatch(s, store),
    ...deriveMyTasks(s, store),
    ...deriveAdmin(s, store),
  };
}
