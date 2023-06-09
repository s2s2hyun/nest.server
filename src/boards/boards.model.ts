export interface BoardType {
  id: string;
  title: string;
  description: string;
  status: BoardStatus;
  createdAt: Date | string; // 타입을 Date 또는 string으로 변경\
  category: string;
  writer: string;
  commentCount: number;
}
export enum BoardStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
