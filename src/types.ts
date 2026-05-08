export interface Tool {
  id: string;
  name: string;
  url: string;
  desc: string;
  category: string;
  importance: string;
  tags: string;
  favorite: number;
  visits: number;
  favicon: string;
  last_visited_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ToolFormData {
  name: string;
  url: string;
  desc: string;
  category: string;
  importance: string;
  tags: string[];
  favicon: string;
}

export interface Stats {
  total: number;
  favoritas: number;
  totalVisits: number;
  porCategoria: CategoryStat[];
  porImportancia: ImportanceStat[];
  masVisitadas: Tool[];
  topTags: TagStat[];
  nuncaVisitadas: Tool[];
  prioSinVisitar: PriorityTool[];
}

export interface CategoryStat {
  category: string;
  count: number;
  tools: { id: string; name: string; url: string }[];
}

export interface ImportanceStat {
  importance: string;
  count: number;
  tools: { id: string; name: string; url: string }[];
}

export interface TagStat {
  tag: string;
  count: number;
}

export interface PriorityTool {
  id: string;
  name: string;
  url: string;
  importance: string;
  visits: number;
  last_visited_at: string | null;
}

export interface ApiListResponse {
  tools: Tool[];
  total: number;
  limit: number;
  offset: number;
}

export interface DomainHint {
  name: string;
  desc: string;
  cat: string;
  tags: string[];
}

export interface DetectedTool {
  name: string;
  category: string;
  tags: string[];
  desc: string;
  url: string;
  detected: boolean;
}

export type TabId = 'tools' | 'dashboard' | 'import';
