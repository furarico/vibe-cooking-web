'use client';

import { useEffect } from 'react';

export function FirebaseInit() {
  useEffect(() => {
    const initFirebase = async () => {
      await import('@/lib/firebase');
    };

    initFirebase();
  }, []);

  return null;
}
