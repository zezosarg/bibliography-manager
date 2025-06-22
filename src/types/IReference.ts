export interface IReference {
  id: string;

  key?: string;

  entryType?: string;

  title?: string;

  author?: string;

  journal?: string;

  volume?: string;

  number?: string;

  pages?: string;

  year?: number;

  publisher?: string;

  issn?: string;

  doi?: string;

  url?: string;

  keywords?: string;

  abstract?: string;

  linkedFilePath?: string;

  metadata: Record<string, any>; // Property to store additional (not recognized) fields
}
