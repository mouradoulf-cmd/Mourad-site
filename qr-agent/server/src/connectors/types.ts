export interface Candidate {
  name: string; country: string; city: string; type: string; website?: string | null; email?: string | null; email_source?: string | null; phone?: string | null;
  address?: string | null; lat?: number | null; lng?: number | null; source: string; source_id?: string | null; source_url?: string | null; language?: string;
}
export interface Connector { id: string; label: string; configured(): boolean; note: string; discover(t: { country: string; city: string; types?: string[]; limit: number }): Promise<Candidate[]> }
