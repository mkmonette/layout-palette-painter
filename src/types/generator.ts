export interface GeneratedPalette {
  id: string;
  timestamp: string;
  colors: string[];
  templateId: string;
  templateName: string;
}

export interface AdminSettings {
  maxPalettesPerBatch: number;
  retentionDays: number;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  maxPalettesPerBatch: 10,
  retentionDays: 30,
};