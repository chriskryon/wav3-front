'use client';

import { useState, useEffect } from 'react';
import {
  setUserGlobal,
} from '@/services/api-service';
import { ProfileView } from '@/components/profile-view';
import Wav3Loading from '@/components/loading-wav3';
import { useUser } from '@/hooks/useUser';
import { ProfileForm } from './ProfileForm';


// KYC Test Warning Card
function KycTestWarningCard() {
  return (
    <div className="mb-8">
      <div className="rounded-xl border border-yellow-400 bg-yellow-50 p-4 flex items-center gap-4 shadow-sm animate-pulse-slow">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="orange" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <title>KYC Warning</title>
        </svg>
        <div>
          <div className="font-semibold text-yellow-800 mt-1">
            Test Environment: Fill KYC with fake/test data only.<br />
            <span className="font-normal text-yellow-700 text-sm">Do not use real personal information in this environment.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user: userData } = useUser();
  const [kycCompleted, setKycCompleted] = useState(userData?.hasBetaAccount === true);

  useEffect(() => {
    setKycCompleted(userData?.hasBetaAccount === true);
  }, [userData]);

  function renderMainContent() {
    if (userData === undefined) {
      return <Wav3Loading />;
    } else if (kycCompleted) {
      const account = userData?.account || {};
      return <><div className='text-center mb-2'></div><ProfileView local={account} /></>;
    } else {
      return <ProfileForm userData={userData} setUserGlobal={setUserGlobal} setKycCompleted={setKycCompleted} />;
    }
  }

  return (
    <div className="content-height p-8 scroll-area bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {renderMainContent()}
      </div>
    </div>
  );
}
