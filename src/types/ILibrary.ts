import { IReference } from './IReference';

export interface ILibrary {
  name: string;

  references: IReference[];

  filePath: string;
}
