import { leadService } from '@/services/leadService';
import {
  LeadContextType,
  LeadProfile,
  LeadProfileForm,
  LeadProviderProps,
  LeadStatus,
} from '@/types/lead';
import { createContext, useState } from 'react';

export const LeadContext = createContext<LeadContextType | undefined>(
  undefined,
);

export function LeadProvider({ children }: LeadProviderProps) {
  const [leads, setLeads] = useState<LeadProfile[]>([]);

  async function getLeads() {
    try {
      const res = await leadService.getLeads();
      const active = res.data.data.leads.filter(
        (l: LeadProfile) => !l.is_archived,
      );

      setLeads(active);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function addLead(data: LeadProfileForm) {
    try {
      const res = await leadService.addLead(data);
      const lead = res.data.data.lead;
      setLeads((prev) => [lead, ...prev]);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function editLead(
    id: number,
    data: LeadProfileForm,
  ): Promise<LeadProfile> {
    try {
      const res = await leadService.editLead(id, data);
      // console.log(JSON.stringify(res.data.data.lead, null, 2));
      const updated: LeadProfile = res.data.data.lead;
      console.log(updated);

      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      return updated;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function advanceLead(
    id: number,
    status: LeadStatus,
  ): Promise<LeadProfile> {
    try {
      const res = await leadService.advanceLead(id, status);
      const updated: LeadProfile = res.data.data.lead;
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      return updated;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function deleteLead(id: number) {
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function archiveLead(id: number) {
    try {
      await leadService.archiveLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function searchLead(query: string) {
    try {
      const res = await leadService.searchLead(query);
      const active = res.data.filter((l: LeadProfile) => !l.is_archived);
      setLeads(active);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  return (
    <LeadContext.Provider
      value={{
        leads,
        getLeads,
        addLead,
        editLead,
        advanceLead,
        deleteLead,
        archiveLead,
        searchLead,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}
