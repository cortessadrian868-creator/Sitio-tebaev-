import persistentSchoolData from "./persistent_school_data.json";

export const INSTITUTIONAL_DATA = {
  ...persistentSchoolData,
  location: {
    ...persistentSchoolData.location,
    coordinates: { lat: 19.4147, lng: -96.9292 }
  }
};

export const COURSES_BY_SEMESTER = [
  {
    semester: "1º Semestre",
    subjects: ["Matemáticas I", "Química I", "Ética I", "Metodología de la Investigación", "Taller de Lectura y Redacción I", "Inglés I"]
  },
  {
    semester: "2º Semestre",
    subjects: ["Matemáticas II", "Química II", "Ética II", "Introducción a las Ciencias Sociales", "Taller de Lectura y Redacción II", "Inglés II", "Informática I"]
  },
  {
    semester: "3º Semestre",
    subjects: ["Matemáticas III", "Física I", "Biología I", "Historia de México I", "Literatura I", "Inglés III", "Informática II", "Capacitación para el Trabajo"]
  },
  {
    semester: "4º Semestre",
    subjects: ["Matemáticas IV", "Física II", "Biología II", "Historia de México II", "Literatura II", "Inglés IV", "Capacitación para el Trabajo"]
  },
  {
    semester: "5º Semestre",
    subjects: ["Geografía", "Estructura Socioeconómica de México", "Área de Especialidad Terminal I", "Capacitación para el Trabajo", "Orientación Educativa V"]
  },
  {
    semester: "6º Semestre",
    subjects: ["Filosofía", "Ecología y Medio Ambiente", "Área de Especialidad Terminal II", "Capacitación para el Trabajo", "Derecho o Contabilidad"]
  }
];

export const WORK_培训_OPTIONS = [
  {
    title: "Informática",
    description: "Desarrollo de habilidades digitales, algoritmos, mantenimiento de sistemas informáticos, hojas de cálculo en línea, bases de datos y diseño básico para comercios locales.",
    icon: "Monitor"
  },
  {
    title: "Administración y Contabilidad",
    description: "Formación en gestión administrativa de microempresas, cálculo de impuestos, arqueo de cajas, contabilidad básica y apoyo comercial adaptado a la industria cafetalera y azucarera del municipio.",
    icon: "Receipt"
  }
];

export const ENROLLMENT_REQUIREMENTS = [
  "Acta de Nacimiento (original y 2 copias legibles)",
  "Clave Única de Registro de Población (CURP, formato actualizado, 2 copias)",
  "Certificado de Secundaria (original y 2 copias)",
  "Carta de Buena Conducta original expedida por la escuela secundaria",
  "Certificado Médico vigente con tipo de sangre (Centro de Salud de Coatepec, Cruz Roja, IMSS o ISSSTE)",
  "6 fotografías tamaño infantil (B/N, papel mate, fondo blanco, playera o camisa polo blanca)",
  "Comprobante de domicilio reciente de la localidad de Mahuixtlan (recibo de luz, agua o teléfono)",
  "Solicitud de Inscripción con firma del Padre, Madre o Tutor Tutor"
];

export const EXTRACURRICULAR_CLUBS = [
  {
    name: "Banda de Guerra",
    description: "Formación de valores cívicos y participación en los desfiles solemnes del municipio de Coatepec.",
    days: "Martes y Jueves (13:00 - 13:55 hrs)"
  },
  {
    name: "Danza Folclórica",
    description: "Fomento de bailes tradicionales veracruzanos (Sones Jarochos, Sones de Tarima) y presentación en galas locales.",
    days: "Miércoles y Viernes (13:00 - 13:55 hrs)"
  },
  {
    name: "Club de Ajedrez",
    description: "Desarrollo del pensamiento crítico y lógico mediante torneos internos y encuentros inter-escolares.",
    days: "Lunes y Miércoles (13:00 - 13:55 hrs)"
  },
  {
    name: "Deportes (Fútbol y Voleibol)",
    description: "Entrenamiento de selecciones oficiales masculinas y femeninas para los juegos inter-telebachilleratos de la SEV.",
    days: "Lunes, Miércoles y Viernes (19:30 - 20:30 hrs)"
  }
];
