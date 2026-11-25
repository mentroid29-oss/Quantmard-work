'use client';

import React, { useState, useEffect } from 'react';
import { TeamManagement } from '@/components/team/TeamManagement';
import { TeamMember, ActivityLog, UserRole } from '@/types';

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeamData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/team');
      const data = await res.json();
      if (data.success) {
        setTeam(data.team);
        setActivityLogs(data.activityLogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleInviteMember = async (memberData: { name: string; email: string; role: UserRole; department: string }) => {
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      const data = await res.json();
      if (data.success) {
        setTeam(prev => [...prev, data.member]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading && team.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading Team & RBAC Directory...</p>
        </div>
      </div>
    );
  }

  return (
    <TeamManagement
      team={team}
      activityLogs={activityLogs}
      onInviteMember={handleInviteMember}
    />
  );
}
