export interface Comment {
  description: string;
  created_at: { toDate: Function };
  author_name: string;
}
