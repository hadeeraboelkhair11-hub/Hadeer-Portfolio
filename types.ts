
export interface Project {
  id: number;
  title: string;
  category: 'store' | 'landing';
  image: string;
  description: string;
}

export interface Service {
  id: number;
  title: string;
  icon: string;
  description: string;
}

export interface Message {
  role: 'user' | 'assistant';
  text: string;
}
