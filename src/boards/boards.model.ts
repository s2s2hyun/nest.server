export interface BoardType {
  id: string;
  title: string;
  description: string;
  status: BoardStatus;
}
export enum BoardStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
