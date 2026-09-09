import React from 'react';
import { Badge } from '../../design-system/index.js';
/** כרטיס משתמש מתוך קבוצת המאשרים (P4). */
export default function UserDetailScreen({ v }) {
  const {
    isP4UserDetailScreen, p4ApproverDetailStatusLabel, p4ApproverDetailStatusVariant, p4ApproverDetailUser,
    p4BackFromUserDetail,
  } = v;
  return (
    <>
      {/* P4: USER DETAIL */}
      {isP4UserDetailScreen && (<>
        <div style={{ maxWidth: '520px' }}>
          <a onClick={p4BackFromUserDetail} style={{ fontSize: '12.5px', cursor: 'pointer', display: 'inline-block', marginBottom: '18px' }}>← חזרה לקבוצת המאשרים</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '700' }}>{p4ApproverDetailUser.name}</div>
            <Badge variant={p4ApproverDetailStatusVariant} size="sm">{p4ApproverDetailStatusLabel}</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div><div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '2px' }}>מזהה ארגוני</div><div style={{ fontSize: '13.5px' }}><bdi dir="ltr">{p4ApproverDetailUser.orgId}</bdi></div></div>
            <div><div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '2px' }}>תפקיד ארגוני</div><div style={{ fontSize: '13.5px' }}>{p4ApproverDetailUser.orgRole}</div></div>
            <div><div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '2px' }}>גוף</div><div style={{ fontSize: '13.5px' }}>{p4ApproverDetailUser.body}</div></div>
            <div><div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '2px' }}>כתובת מייל</div><a href={`mailto:${p4ApproverDetailUser.email}`} style={{ fontSize: '13.5px' }}><bdi dir="ltr">{p4ApproverDetailUser.email}</bdi></a></div>
            <div><div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '2px' }}>טלפון</div><div style={{ fontSize: '13.5px' }}><bdi dir="ltr">{p4ApproverDetailUser.phone}</bdi></div></div>
          </div>
        </div>
      </>)}
    </>
  );
}