export type StatusType = "active" | "upcoming" | "closed";

export interface Program {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  status: StatusType;
  startDate: string;
  content: string;
}

export interface SchoolLevel {
  slug: string;
  name: string;
}

export interface School {
  id?: string;
  slug: string;
  name: string;
  npsn?: string;
  type: "yayasan" | "sekolah";
  level: "TK" | "SD" | "SMP" | "SMA" | "SMK" | "MI" | "MTs" | "MA" | "OTHER";
  address: string;
  city?: string;
  district?: string;
  ward?: string;
  image: string;
  accreditation?: string;
  studentCount?: number;
  description: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  registrationUrl?: string;
  googleMapsUrl?: string;
  principalName?: string;
}


export interface NewsItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  views: number;
  tab: "terpopuler" | "terbaru" | "terkait";
}

export interface Training {
  slug: string;
  title: string;
  image: string;
  date: string;
  location: string;
  quota: number;
  status: StatusType;
  description: string;
  content: string;
}
