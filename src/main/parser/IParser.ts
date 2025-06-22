import Library from '../model/Library';

export interface IParser {
  parse(content: string, filePath: string): Library;
}
