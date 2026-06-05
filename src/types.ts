export interface Subject {
  nombre: string;
  calificacion: number;
  faltas: number;
}

export interface Student {
  matricula: string;
  nombre: string;
  semestre: string;
  promedio: number;
  asistencia: string;
  estatus: string;
  tutor: string;
  capacitacion: string;
  materias: Subject[];
  foto?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ContactForm {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  description: string;
}

