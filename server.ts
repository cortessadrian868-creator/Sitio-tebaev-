import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// List of mock students for lookup (Clave / Matrícula)
const INITIAL_MOCK_STUDENTS = [
  {
    matricula: "24ETH001",
    nombre: "Juan Carlos Flores Pérez",
    semestre: "4º Semestre (Grupo A)",
    promedio: 9.4,
    asistencia: "95%",
    estatus: "Regular",
    tutor: "Carlos Flores Méndez",
    capacitacion: "Informática (Sistemas)",
    foto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=260&auto=format&fit=crop",
    materias: [
      { nombre: "Matemáticas IV", calificacion: 9.0, faltas: 2 },
      { nombre: "Física II", calificacion: 10.0, faltas: 0 },
      { nombre: "Inglés IV", calificacion: 9.0, faltas: 1 },
      { nombre: "Informática IV", calificacion: 10.0, faltas: 0 },
      { nombre: "Química II", calificacion: 9.0, faltas: 2 },
    ]
  },
  {
    matricula: "24ETH002",
    nombre: "María Elena Ortiz García",
    semestre: "4º Semestre (Grupo B)",
    promedio: 8.8,
    asistencia: "92%",
    estatus: "Regular",
    tutor: "Sofía García Landa",
    capacitacion: "Informática (Sistemas)",
    foto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=260&auto=format&fit=crop",
    materias: [
      { nombre: "Matemáticas IV", calificacion: 8.0, faltas: 3 },
      { nombre: "Física II", calificacion: 9.0, faltas: 2 },
      { nombre: "Inglés IV", calificacion: 10.0, faltas: 0 },
      { nombre: "Informática IV", calificacion: 9.0, faltas: 1 },
      { nombre: "Química II", calificacion: 8.5, faltas: 3 },
    ]
  },
  {
    matricula: "23ETH042",
    nombre: "Diego Armando Suárez Morales",
    semestre: "6º Semestre (Grupo A)",
    promedio: 9.7,
    asistencia: "98%",
    estatus: "Graduando regular",
    tutor: "Silvia Morales Ruiz",
    capacitacion: "Administración y Contabilidad",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=260&auto=format&fit=crop",
    materias: [
      { nombre: "Matemáticas VI", calificacion: 10.0, faltas: 0 },
      { nombre: "Ecología", calificacion: 10.0, faltas: 1 },
      { nombre: "Geografía", calificacion: 9.0, faltas: 1 },
      { nombre: "Filosofía", calificacion: 10.0, faltas: 0 },
      { nombre: "Metodología de la Investigación", calificacion: 9.5, faltas: 0 },
    ]
  },
  {
    matricula: "25ETH105",
    nombre: "Sofía Hernández Juárez",
    semestre: "2º Semestre (Grupo A)",
    promedio: 7.9,
    asistencia: "88%",
    estatus: "Sujeto a tutorías obligatorias (Índice de asistencia bajo)",
    tutor: "Pedro Hernández Salazar",
    capacitacion: "Tronco Común",
    foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=260&auto=format&fit=crop",
    materias: [
      { nombre: "Matemáticas II", calificacion: 7.0, faltas: 5 },
      { nombre: "Química I", calificacion: 8.0, faltas: 3 },
      { nombre: "Taller de Lectura y Redacción II", calificacion: 9.0, faltas: 1 },
      { nombre: "Inglés II", calificacion: 8.0, faltas: 2 },
      { nombre: "Ética y Valores II", calificacion: 7.5, faltas: 4 },
    ]
  }
];

let CURRENT_MOCK_STUDENTS = [...INITIAL_MOCK_STUDENTS];

const DEFAULT_INSTITUTIONAL_DATA = {
  name: "Telebachillerato del Estado de Veracruz",
  center: "Centro Mahuixtlan",
  acronym: "TEBAEV",
  cct: "30ETH0185M",
  coordinatingTitle: "Coordinador del Centro",
  director: "Mtro. Arturo Ramírez Solano",
  motto: "Estudio, Patria y Progreso",
  phone: "228 816 0215",
  email: "tebaevmahuixtlan@sev.gob.mx",
  location: {
    address: "Calle Principal s/n, Localidad de Mahuixtlan",
    municipality: "Coatepec, Veracruz",
    postalCode: "91615"
  },
  schedule: "Lunes a Viernes, Turno Vespertino: 14:00 - 19:30 hrs",
  announcementActive: true,
  announcementText: "¡Inscripciones Abiertas! Reserva de cupo para nuevo ingreso y reinscripción activa en ventanilla académica.",
  stats: [
    { label: "Estudiantes Activos", value: "+120" },
    { label: "Zona Escolar", value: "Coatepec" },
    { label: "Aulas Equipadas", value: "6" },
    { label: "Talleres Laborales", value: "2" }
  ],
  gallery: [
    {
      id: "gal-1",
      url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
      description: "Fachada del acceso principal de nuestro plantel TEBAEV Mahuixtlan, con áreas verdes y accesos seguros para toda la comunidad escolar."
    },
    {
      id: "gal-2",
      url: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=600&auto=format&fit=crop",
      description: "Aula de informática equipada, donde los alumnos realizan actividades de capacitación laboral y proyectos tecnológicos."
    },
    {
      id: "gal-3",
      url: "https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?q=80&w=600&auto=format&fit=crop",
      description: "Área de biblioteca escolar y cubículos de estudio, un lugar diseñado para el autoaprendizaje y debate académico cooperativo."
    },
    {
      id: "gal-4",
      url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=600&auto=format&fit=crop",
      description: "Explanada central cívica del plantel donde se efectúan los honores semanales a la bandera y se celebran eventos culturales veracruzanos."
    }
  ]
};

let CURRENT_INSTITUTIONAL_DATA = { ...DEFAULT_INSTITUTIONAL_DATA };

// Function to dynamically compile School Context for Gemini based on custom administrative edits
function getSchoolContext() {
  const statStr = CURRENT_INSTITUTIONAL_DATA.stats.map(s => `${s.label}: ${s.value}`).join(", ");
  return `
Eres la Inteligencia Artificial oficial del Telebachillerato de Mahuixtlan (TEBAEV Mahuixtlan). 
Tu función es asistir a alumnos, padres de familia, postulantes e interesados acerca de los servicios de la institución escolar.
Responde de manera formal, cálida, amable y amigable en español.

Información institucional oficial sobre TEBAEV Mahuixtlan (EDITABLE EN TIEMPO REAL):
- Nombre del Plantel: ${CURRENT_INSTITUTIONAL_DATA.name}, ${CURRENT_INSTITUTIONAL_DATA.center}.
- Clave de Centro de Trabajo (CCT): ${CURRENT_INSTITUTIONAL_DATA.cct}.
- Ubicación física: ${CURRENT_INSTITUTIONAL_DATA.location.address}, ${CURRENT_INSTITUTIONAL_DATA.location.municipality}, Código Postal ${CURRENT_INSTITUTIONAL_DATA.location.postalCode}. Mahuixtlan es una localidad conocida por el cultivo de la caña de azúcar y sus tradiciones veracruzanas.
- Director / Coordinador del Plantel: ${CURRENT_INSTITUTIONAL_DATA.director}.
- Lema escolar oficial: "${CURRENT_INSTITUTIONAL_DATA.motto}".
- Horarios de Clases: ${CURRENT_INSTITUTIONAL_DATA.schedule}.
- Contactos rápidos: Teléfono ${CURRENT_INSTITUTIONAL_DATA.phone}, Correo: ${CURRENT_INSTITUTIONAL_DATA.email}.
- Estadísticas Generales del Periodo: ${statStr}.

Capacitaciones de Trabajo Ofrecidas:
Ofrecemos capacitaciones laborales continuas de "Informática" y de "Administración y Contabilidad" para preparar a los jóvenes en el sector de negocios y herramientas digitales locales.
Áreas de Especialización (Fase terminal para 5º y 6º semestre): Físico-Matemático, Químico-Biólogo, Económico-Administrativo, y Humanidades y Ciencias Sociales.

Requisitos de inscripción:
1. Acta de Nacimiento (original y copia)
2. CURP (copia en formato oficial actualizado)
3. Certificado de Secundaria (original y copia)
4. Carta de Buena Conducta de la escuela secundaria de origen
5. Certificado Médico Vigente emitido por un organismo público de Salud.
6. 6 fotografías tamaño infantil blanco y negro en papel mate, camisa blanca.
7. Comprobante de domicilio (recibo de luz o teléfono, copia).
8. Solicitud de inscripción llenada y firmada.

Servicios e Instalaciones:
- Salones con pantallas multimedia Smart TV y proyectores.
- Aula de Cómputo moderna conectada a Internet.
- Cancha de Usos Múltiples techada.
- Biblioteca "José Vasconcelos".

Si la persona pregunta por calificaciones de alumnos, recuérdale que puede consultar su boleta en tiempo real en la página en la sección "Portal de Consulta de Boletas" ingresando la matrícula del alumno de interés.
`;
}

// Initialize GoogleGenAI Client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    throw new Error("Missing Gemini API Key");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API: Student lookup
app.post("/api/students/lookup", (req, res) => {
  const { matricula } = req.body;
  if (!matricula) {
    return res.status(400).json({ error: "Debe ingresar una matrícula de consulta." });
  }

  const cleanMatricula = matricula.trim().toUpperCase();
  const student = CURRENT_MOCK_STUDENTS.find(s => s.matricula === cleanMatricula);

  if (student) {
    return res.json({ found: true, student });
  } else {
    const listDemo = CURRENT_MOCK_STUDENTS.slice(0, 4).map(s => s.matricula).join(", ");
    return res.status(404).json({
      found: false,
      message: `No se encontró ningún estudiante con la matrícula "${matricula}". Intente con: ${listDemo}.`
    });
  }
});

// Extra APIs for Interactive Editing Integration
app.get("/api/institution", (req, res) => {
  return res.json(CURRENT_INSTITUTIONAL_DATA);
});

app.post("/api/institution", (req, res) => {
  CURRENT_INSTITUTIONAL_DATA = { ...CURRENT_INSTITUTIONAL_DATA, ...req.body };
  return res.json({ success: true, data: CURRENT_INSTITUTIONAL_DATA });
});

app.get("/api/students", (req, res) => {
  return res.json(CURRENT_MOCK_STUDENTS);
});

app.post("/api/students/sync", (req, res) => {
  const { students } = req.body;
  if (Array.isArray(students)) {
    CURRENT_MOCK_STUDENTS = [...students];
    return res.json({ success: true, count: CURRENT_MOCK_STUDENTS.length });
  }
  return res.status(400).json({ error: "Invalid data format or missing students parameter." });
});

app.post("/api/reset", (req, res) => {
  CURRENT_MOCK_STUDENTS = [...INITIAL_MOCK_STUDENTS];
  CURRENT_INSTITUTIONAL_DATA = { ...DEFAULT_INSTITUTIONAL_DATA };
  return res.json({ success: true, data: CURRENT_INSTITUTIONAL_DATA, students: CURRENT_MOCK_STUDENTS });
});

// 2. API: Gemini chat assistant
app.post("/api/gemini/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid body parameters: messages is required" });
  }

  try {
    let ai;
    try {
      ai = getGeminiClient();
    } catch {
      // Return a rule-based fallback if no API key is specified so the app operates nicely!
      const userLastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let mockReply = "";
      
      if (userLastMsg.includes("inscrip") || userLastMsg.includes("requisito") || userLastMsg.includes("entrar")) {
        mockReply = `**[Modo Demo - API Key Faltante]** Los requisitos de inscripción en el ${CURRENT_INSTITUTIONAL_DATA.name} son: \n` +
          "1. Acta de Nacimiento (original y copia).\n" +
          "2. CURP (formato oficial actualizado).\n" +
          "3. Certificado de Secundaria original.\n" +
          "4. Carta de Buena Conducta de la escuela de procedencia.\n" +
          "5. Certificado Médico emitido por un organismo público de Salud.\n" +
          "6. 6 fotos tamaño infantil blanco y negro, papel mate.\n" +
          "7. Comprobante de domicilio (recibo de servicios públicos).\n\n" +
          "*(Nota: Puedes registrar tu propia API Key de Gemini en el panel de Secrets de AI Studio para activar las respuestas dinámicas con IA)*";
      } else if (userLastMsg.includes("director") || userLastMsg.includes("autoridad") || userLastMsg.includes("coordinador")) {
        mockReply = `**[Modo Demo - API Key Faltante]** El coordinador y director del plantel es el **${CURRENT_INSTITUTIONAL_DATA.director}**.\n\n` +
          "*(Nota: Configura tu GEMINI_API_KEY en la configuración de la app para habilitar la experiencia de Inteligencia Artificial completa)*";
      } else if (userLastMsg.includes("clave") || userLastMsg.includes("cct")) {
        mockReply = `**[Modo Demo - API Key Faltante]** La Clave de Centro de Trabajo (CCT) de la institución es **${CURRENT_INSTITUTIONAL_DATA.cct}**, perteneciente a la Zona Escolar Coatepec.\n\n` +
          "*(Nota: Configura tu GEMINI_API_KEY en Secrets para hablar interactivamente con la IA del plantel)*";
      } else if (userLastMsg.includes("uniforme") || userLastMsg.includes("ropa") || userLastMsg.includes("vestir")) {
        mockReply = "**[Modo Demo - API Key Faltante]** El uniforme escolar obligatorio es:\n" +
          `- *Diario*: Playera polo blanca de la escuela, pantalón gris oxford (hombres) o falda tableada escocesa verde/gris (mujeres), zapatos negros escolares y calcetas blancas.\n` +
          `- *Deportivo*: Pants verde oficial de TEBAEV, camiseta blanca deportiva y tenis blancos.\n\n` +
          "*(Nota: Registra tu API key en los Secrets de la barra superior para explorar otras preguntas académicas interactivas)*";
      } else if (userLastMsg.includes("materia") || userLastMsg.includes("capacitacion") || userLastMsg.includes("comput")) {
        mockReply = "**[Modo Demo - API Key Faltante]** TEBAEV Mahuixtlan ofrece capacitación laboral en **Informática (Sistemas)** y de **Administración y Contabilidad**, ideal para complementar el aprendizaje tecnológico de los estudiantes. Para la fase terminal, se dividen en áreas: Físico-Matemático, Químico-Biólogo, Económico-Administrativo, y Humanidades y Ciencias Sociales.\n\n" +
          "*(Nota: Para conversar con la IA de forma libre, agrega tu clave de Gemini API en Secrets)*";
      } else {
        mockReply = `**[Modo Demo - API Key Faltante]** ¡Hola! Bienvenido al asistente escolar interactivo de ${CURRENT_INSTITUTIONAL_DATA.name}.\n\n` +
          "Actualmente la aplicación está en modo de demostración porque no has configurado tu **GEMINI_API_KEY** en la pestaña de Secrets. Sin embargo, puedes preguntarme sobre las **inscripciones**, el **director**, la **clave de la escuela (CCT)**, el **uniforme**, o las **capacitaciones laborales**, y responderé con los datos cargados en el plantel.\n\n" +
          "¿En qué más te puedo asistir hoy?";
      }
      return res.json({ text: mockReply });
    }

    // Convert chat history format from user to Gemini expected content structure
    // Format: { role: "user" | "model", parts: [{ text: "..." }] }
    const formattedContents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }]
    }));

    // Call the Gemini API with our model and the complete context of the school as systemInstructions
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: getSchoolContext(),
        temperature: 0.7,
      },
    });

    return res.json({ text: response.text || "No obtuve una respuesta clara en este momento. Por favor, intenta de nuevo." });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: "Fallo la comunicación con el servicio de Inteligencia Artificial: " + (error.message || error) });
  }
});

// 3. API: Contact Submit Form
app.post("/api/contact", (req, res) => {
  const { nombre, email, telefono, mensaje, asunto } = req.body;
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Los campos Nombre, Correo y Mensaje son obligatorios." });
  }

  // Simulate storing contact info, return success
  console.log(`Mensaje de contacto recibido de ${nombre} (${email}) - Motivo: ${asunto || "General"}`);
  return res.json({
    success: true,
    message: `¡Muchas gracias, ${nombre}! Tu mensaje ha sido recibido exitosamente. En breve, el personal administrativo de TEBAEV Mahuixtlan se pondrá en contacto contigo al correo ${email}.`
  });
});

// Vite server in Development, or serve Static files in Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA routing - all other requests go to index.html
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
