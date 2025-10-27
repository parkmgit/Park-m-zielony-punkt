'use client';

import Navbar from './Navbar';
import OfflineIndicator from './OfflineIndicator';
import UpdateNotification from './UpdateNotification';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <OfflineIndicator />
      <UpdateNotification />
    </>
  );
}
