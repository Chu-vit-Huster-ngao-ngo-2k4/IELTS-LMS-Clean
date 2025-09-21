export interface Course {
  id: number;
  title: string;
  description: string;
  createdat?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  courseid: number;
  orderindex: number;
  assets?: Asset[];
}

export interface Asset {
  id: number;
  title: string;
  assettype: string;
  providerkey: string;
  mimetype: string;
  sizebytes: number;
  lessonid: number;
}
