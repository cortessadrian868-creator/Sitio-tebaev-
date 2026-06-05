import React, { useState, useEffect } from "react";
import { 
  X, Save, RotateCcw, Building, BarChart2, Megaphone, Users, Plus, Trash2, Edit2, Check, Sparkles, HelpCircle 
} from "lucide-react";
import { Student, Subject } from "../types";
import { motion, AnimatePresence } from "motion/react";
import schoolActivitiesImg from "../assets/images/school_activities_1780596803770.png";

interface EditorPanelProps {
  schoolData: any;
  setSchoolData: (data: any) => void;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>> | ((val: any) => void);
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSchoolData: any, newStudents: Student[]) => Promise<void>;
  onReset: () => Promise<void>;
}

export default function EditorPanel({
  schoolData,
  setSchoolData,
  students,
  setStudents,
  isOpen,
  onClose,
  onSave,
  onReset
}: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<"general" | "stats" | "announcements" | "students" | "gallery">("general");
  
  // Local states for editing schoolData
  const [localSchoolData, setLocalSchoolData] = useState<any>({ ...schoolData });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for adding/editing a student
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudentMatricula, setEditingStudentMatricula] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState({
    matricula: "",
    nombre: "",
    semestre: "4º Semestre (Grupo A)",
    promedio: 8.5,
    asistencia: "90%",
    estatus: "Regular",
    tutor: "",
    capacitacion: "Informática (Sistemas)",
    foto: ""
  });

  // Keep localState in sync when schoolData prop changes (e.g. from reset)
  useEffect(() => {
    setLocalSchoolData({ ...schoolData });
  }, [schoolData]);

  const handleSchoolInputChange = (path: string, value: any) => {
    setLocalSchoolData((prev: any) => {
      const updated = { ...prev };
      // Handle simple nested paths like 'location.address'
      if (path.includes(".")) {
        const [parent, child] = path.split(".");
        updated[parent] = { ...updated[parent], [child]: value };
      } else {
        updated[path] = value;
      }
      return updated;
    });
  };

  // School image gallery states and handlers
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryDesc, setNewGalleryDesc] = useState("");

  const handleGalleryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 768;
          const MAX_HEIGHT = 576;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            try {
              const compressed = canvas.toDataURL("image/jpeg", 0.75);
              setNewGalleryUrl(compressed);
            } catch (err) {
              console.error("Canvas compression failed, falling back to raw data.", err);
              setNewGalleryUrl(event.target?.result as string);
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl) {
      alert("Por favor seleccione un archivo foto o peque una URL de imagen.");
      return;
    }
    const newImg = {
      id: "gal-" + Date.now(),
      url: newGalleryUrl,
      description: newGalleryDesc.trim() || "Nueva área o espacio del plantel."
    };
    
    setLocalSchoolData((prev: any) => {
      const currentGallery = prev.gallery || [];
      return {
        ...prev,
        gallery: [...currentGallery, newImg]
      };
    });
    
    // Reset inputs
    setNewGalleryUrl("");
    setNewGalleryDesc("");
  };

  const handleReplaceGalleryImageFile = (idToReplace: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 768;
          const MAX_HEIGHT = 576;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            try {
              const compressed = canvas.toDataURL("image/jpeg", 0.75);
              setLocalSchoolData((prev: any) => {
                const currentGallery = prev.gallery || [];
                return {
                  ...prev,
                  gallery: currentGallery.map((gi: any) => {
                    if (gi.id === idToReplace) {
                      return { ...gi, url: compressed };
                    }
                    return gi;
                  })
                };
              });
            } catch (err) {
              console.error("Canvas compression failed, falling back to raw data.", err);
              const fallbackUrl = event.target?.result as string;
              setLocalSchoolData((prev: any) => {
                const currentGallery = prev.gallery || [];
                return {
                  ...prev,
                  gallery: currentGallery.map((gi: any) => {
                    if (gi.id === idToReplace) {
                      return { ...gi, url: fallbackUrl };
                    }
                    return gi;
                  })
                };
              });
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteGalleryImage = (idToDelete: string) => {
    setLocalSchoolData((prev: any) => {
      const currentGallery = prev.gallery || [];
      return {
        ...prev,
        gallery: currentGallery.filter((img: any) => img.id !== idToDelete)
      };
    });
  };

  const handleGalleryDescChange = (imgId: string, newText: string) => {
    setLocalSchoolData((prev: any) => {
      const currentGallery = prev.gallery || [];
      return {
        ...prev,
        gallery: currentGallery.map((img: any) => {
          if (img.id === imgId) {
            return { ...img, description: newText };
          }
          return img;
        })
      };
    });
  };

  const handleStatChange = (idx: number, field: "label" | "value", val: string) => {
    setLocalSchoolData((prev: any) => {
      const updatedStats = [...prev.stats];
      updatedStats[idx] = { ...updatedStats[idx], [field]: val };
      return { ...prev, stats: updatedStats };
    });
  };

  const handleStudentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({
      ...prev,
      [name]: name === "promedio" ? parseFloat(value) || 0 : value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 256;
          const MAX_HEIGHT = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            try {
              const compressed = canvas.toDataURL("image/jpeg", 0.75);
              setStudentForm((prev) => ({
                ...prev,
                foto: compressed
              }));
            } catch (err) {
              console.error("Canvas compression failed, falling back to raw data.", err);
              setStudentForm((prev) => ({
                ...prev,
                foto: event.target?.result as string
              }));
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrUpdateStudent = () => {
    if (!studentForm.matricula || !studentForm.nombre) {
      alert("Por favor rellene la matrícula y el nombre del estudiante.");
      return;
    }

    const cleanMatricula = studentForm.matricula.trim().toUpperCase();

    // Map default subjects based on semester selection so the grades are realistic and detailed
    const getMockSubjects = (sem: string): Subject[] => {
      if (sem.includes("6º")) {
        return [
          { nombre: "Matemáticas VI", calificacion: studentForm.promedio, faltas: 1 },
          { nombre: "Ecología", calificacion: studentForm.promedio + 0.3 > 10 ? 10 : studentForm.promedio + 0.3, faltas: 0 },
          { nombre: "Geografía", calificacion: studentForm.promedio - 0.5 < 5 ? 5 : studentForm.promedio - 0.5, faltas: 2 },
          { nombre: "Filosofía", calificacion: studentForm.promedio, faltas: 1 },
          { nombre: "Metodología", calificacion: 9.0, faltas: 0 }
        ];
      }
      if (sem.includes("2º")) {
        return [
          { nombre: "Matemáticas II", calificacion: studentForm.promedio, faltas: 2 },
          { nombre: "Química I", calificacion: studentForm.promedio + 0.2 > 10 ? 10 : studentForm.promedio + 0.2, faltas: 1 },
          { nombre: "Taller Lectura II", calificacion: studentForm.promedio + 0.5 > 10 ? 10 : studentForm.promedio + 0.5, faltas: 0 },
          { nombre: "Inglés II", calificacion: studentForm.promedio, faltas: 3 },
          { nombre: "Ética y Valores II", calificacion: 8.0, faltas: 1 }
        ];
      }
      // Default to 4th Semester subjects
      return [
        { nombre: "Matemáticas IV", calificacion: studentForm.promedio, faltas: 2 },
        { nombre: "Física II", calificacion: studentForm.promedio + 0.4 > 10 ? 10 : studentForm.promedio + 0.4, faltas: 0 },
        { nombre: "Inglés IV", calificacion: studentForm.promedio, faltas: 1 },
        { nombre: "Informática IV", calificacion: studentForm.promedio + 0.1 > 10 ? 10 : studentForm.promedio + 0.1, faltas: 1 },
        { nombre: "Química II", calificacion: 8.5, faltas: 2 }
      ];
    };

    const targetSubjects = getMockSubjects(studentForm.semestre);

    const newStudent: Student = {
      matricula: cleanMatricula,
      nombre: studentForm.nombre.trim(),
      semestre: studentForm.semestre,
      promedio: studentForm.promedio,
      asistencia: studentForm.asistencia,
      estatus: studentForm.estatus,
      tutor: studentForm.tutor.trim() || "Tutor No Asignado",
      capacitacion: studentForm.capacitacion,
      materias: targetSubjects,
      foto: studentForm.foto || ""
    };

    setStudents((prev) => {
      let updated;
      if (editingStudentMatricula) {
        // Edit mode
        updated = prev.map(s => s.matricula === editingStudentMatricula ? newStudent : s);
      } else {
        // Add mode - remove existing with same matricula if any, then append
        const filtered = prev.filter(s => s.matricula !== cleanMatricula);
        updated = [...filtered, newStudent];
      }
      return updated;
    });

    // Reset student form state
    setIsAddingStudent(false);
    setEditingStudentMatricula(null);
    setStudentForm({
      matricula: "",
      nombre: "",
      semestre: "4º Semestre (Grupo A)",
      promedio: 8.5,
      asistencia: "90%",
      estatus: "Regular",
      tutor: "",
      capacitacion: "Informática (Sistemas)",
      foto: ""
    });
  };

  const handleEditStudentSelect = (student: Student) => {
    setEditingStudentMatricula(student.matricula);
    setStudentForm({
      matricula: student.matricula,
      nombre: student.nombre,
      semestre: student.semestre,
      promedio: student.promedio,
      asistencia: student.asistencia,
      estatus: student.estatus,
      tutor: student.tutor,
      capacitacion: student.capacitacion,
      foto: student.foto || ""
    });
    setIsAddingStudent(true);
  };

  const handleDeleteStudent = (mat: string) => {
    if (confirm(`¿Estás seguro que deseas eliminar el registro del estudiante con matrícula ${mat}?`)) {
      setStudents((prev) => prev.filter(s => s.matricula !== mat));
    }
  };

  const handleGlobalSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await onSave(localSchoolData, students);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Hubo un contratiempo al procesar el guardado del servidor.");
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreDefaults = async () => {
    if (confirm("¿Estás seguro que deseas RESTAURAR toda la información a los valores originales de fábrica? Se borrarán tus ediciones locales y alumnos customizados.")) {
      setSaving(true);
      try {
        await onReset();
        setSaving(false);
        alert("¡Restauración exitosa! Se han recargado los datos iniciales.");
      } catch (err) {
        setSaving(false);
        alert("Error al intentar restaurar.");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay with slight blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-all duration-300"
          />

          {/* Editor Right Sidebar Drawer */}
          <motion.div
            id="editor-sidebar-container"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md md:max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-hidden text-left border-l border-slate-100"
          >
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-tebaev-gold/20 text-tebaev-gold flex items-center justify-center border border-tebaev-gold/10">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm tracking-tight flex items-center gap-1.5 leading-none">
                    Consola de Edición Web
                  </h3>
                  <p className="text-[10px] text-slate-300 font-medium mt-1 leading-none">
                    Modifica contenidos escolares • En Vivo
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Cerrar panel de control"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Informational Tip */}
            <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-100 text-[10.5px] text-emerald-800 flex items-center gap-2 shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-tebaev-green shrink-0 animate-pulse" />
              <span>
                <strong>Modo Administrador Activo:</strong> Cualquier cambio que guardes se aplicará interactivamente sobre el sitio e incluso entrenará al <strong>Consultor Gemini IA</strong>.
              </span>
            </div>

            {/* Tabs Selector Bar */}
            <div className="flex border-b border-slate-150 bg-slate-50 overflow-x-auto shrink-0 scrollbar-none font-mono text-[10px] font-bold tracking-wider upper">
              <button
                type="button"
                onClick={() => { setActiveTab("general"); setIsAddingStudent(false); }}
                className={`flex-1 py-3 px-3 text-center border-b-2 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shrink-0 ${
                  activeTab === "general"
                    ? "border-tebaev-green text-tebaev-green bg-white"
                    : "border-transparent text-slate-500"
                }`}
              >
                <Building className="h-3.5 w-3.5" />
                🏫 Datos Plantel
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab("stats"); setIsAddingStudent(false); }}
                className={`flex-1 py-3 px-3 text-center border-b-2 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shrink-0 ${
                  activeTab === "stats"
                    ? "border-tebaev-green text-tebaev-green bg-white"
                    : "border-transparent text-slate-500"
                }`}
              >
                <BarChart2 className="h-3.5 w-3.5" />
                📊 Alumnos/Stats
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab("announcements"); setIsAddingStudent(false); }}
                className={`flex-1 py-3 px-3 text-center border-b-2 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shrink-0 ${
                  activeTab === "announcements"
                    ? "border-tebaev-green text-tebaev-green bg-white"
                    : "border-transparent text-slate-500"
                }`}
              >
                <Megaphone className="h-3.5 w-3.5" />
                📢 Boletín
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("students")}
                className={`flex-1 py-3 px-3 text-center border-b-2 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shrink-0 ${
                  activeTab === "students"
                    ? "border-tebaev-green text-tebaev-green bg-white"
                    : "border-transparent text-slate-500"
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                📁 Matrículas
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab("gallery"); setIsAddingStudent(false); }}
                className={`flex-1 py-3 px-3 text-center border-b-2 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shrink-0 pr-4 ${
                  activeTab === "gallery"
                    ? "border-tebaev-gold text-tebaev-green bg-white"
                    : "border-transparent text-slate-500"
                }`}
              >
                <Building className="h-3.5 w-3.5 text-tebaev-gold" />
                📷 Galería
              </button>
            </div>

            {/* Scrollable Form Body Container */}
            <form onSubmit={handleGlobalSaveSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
              
              {/* TAB 1: General Info */}
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="bg-slate-900/5 px-2 py-1 rounded text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">
                    Configuración de Identidad Escolar
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                        Nombre General SEV
                      </label>
                      <input
                        type="text"
                        required
                        value={localSchoolData.name || ""}
                        onChange={(e) => handleSchoolInputChange("name", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                        Nombre de Centro
                      </label>
                      <input
                        type="text"
                        required
                        value={localSchoolData.center || ""}
                        onChange={(e) => handleSchoolInputChange("center", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                        Clave CCT Escolar
                      </label>
                      <input
                        type="text"
                        required
                        value={localSchoolData.cct || ""}
                        onChange={(e) => handleSchoolInputChange("cct", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-850 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                        Lema Escolar (Lema)
                      </label>
                      <input
                        type="text"
                        required
                        value={localSchoolData.motto || ""}
                        onChange={(e) => handleSchoolInputChange("motto", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                      Director / Coordinador
                    </label>
                    <input
                      type="text"
                      required
                      value={localSchoolData.director || ""}
                      onChange={(e) => handleSchoolInputChange("director", e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                        Teléfono de Soporte
                      </label>
                      <input
                        type="text"
                        required
                        value={localSchoolData.phone || ""}
                        onChange={(e) => handleSchoolInputChange("phone", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                        E-mail de Contacto
                      </label>
                      <input
                        type="email"
                        required
                        value={localSchoolData.email || ""}
                        onChange={(e) => handleSchoolInputChange("email", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                      Dirección Física
                    </label>
                    <input
                      type="text"
                      required
                      value={localSchoolData.location?.address || ""}
                      onChange={(e) => handleSchoolInputChange("location.address", e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                        Municipio y Estado
                      </label>
                      <input
                        type="text"
                        required
                        value={localSchoolData.location?.municipality || ""}
                        onChange={(e) => handleSchoolInputChange("location.municipality", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                        Código Postal (CP)
                      </label>
                      <input
                        type="text"
                        required
                        value={localSchoolData.location?.postalCode || ""}
                        onChange={(e) => handleSchoolInputChange("location.postalCode", e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                      Horario del Plantel
                    </label>
                    <input
                      type="text"
                      required
                      value={localSchoolData.schedule || ""}
                      onChange={(e) => handleSchoolInputChange("schedule", e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs text-left">
                    <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Fotografía Principal de Talleres / Actividades</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={localSchoolData.activitiesImage || schoolActivitiesImg}
                        alt="Actividades"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] text-slate-500 font-medium block leading-none">Sube la foto del taller de tu escuela:</span>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            id="activities-image-input"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const img = new Image();
                                  img.onload = () => {
                                    const canvas = document.createElement("canvas");
                                    const MAX_WIDTH = 1024;
                                    const MAX_HEIGHT = 768;
                                    let width = img.width;
                                    let height = img.height;
                                    if (width > height) {
                                      if (width > MAX_WIDTH) {
                                        height *= MAX_WIDTH / width;
                                        width = MAX_WIDTH;
                                      }
                                    } else {
                                      if (height > MAX_HEIGHT) {
                                        width *= MAX_HEIGHT / height;
                                        height = MAX_HEIGHT;
                                      }
                                    }
                                    canvas.width = width;
                                    canvas.height = height;
                                    const ctx = canvas.getContext("2d");
                                    if (ctx) {
                                      ctx.drawImage(img, 0, 0, width, height);
                                      try {
                                        const compressed = canvas.toDataURL("image/jpeg", 0.75);
                                        setLocalSchoolData((prev: any) => ({ ...prev, activitiesImage: compressed }));
                                      } catch (err) {
                                        setLocalSchoolData((prev: any) => ({ ...prev, activitiesImage: event.target?.result as string }));
                                      }
                                    }
                                  };
                                  img.src = event.target?.result as string;
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="activities-image-input"
                            className="px-2.5 py-1.5 rounded bg-tebaev-green hover:bg-tebaev-green/95 text-white font-semibold text-[9.5px] uppercase tracking-wider cursor-pointer inline-block transition-all shadow-xs"
                          >
                            Seleccionar Foto
                          </label>
                          {localSchoolData.activitiesImage && (
                            <button
                              type="button"
                              onClick={() => setLocalSchoolData((prev: any) => ({ ...prev, activitiesImage: "" }))}
                              className="px-2.5 py-1.5 rounded bg-red-50 hover:bg-red-100 text-red-650 font-bold text-[9.5px] uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Restaurar Original
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: Stats */}
              {activeTab === "stats" && (
                <div className="space-y-4">
                  <div className="bg-slate-900/5 px-2 py-1 rounded text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">
                    Indicadores Clave de la Tarjeta Hero
                  </div>

                  <p className="text-[11px] text-slate-500 leading-normal">
                    Estos 4 bloques se cargan sobre la sección principal del sitio. Modifica cada concepto y su número asociado:
                  </p>

                  <div className="space-y-3">
                    {localSchoolData.stats?.map((stat: any, idx: number) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl grid grid-cols-3 gap-3.5">
                        <div className="col-span-2">
                          <label className="text-[9px] font-mono font-bold tracking-wider text-slate-400 block mb-0.5 uppercase">
                            Concepto #{idx + 1}
                          </label>
                          <input
                            type="text"
                            required
                            value={stat.label}
                            onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono font-bold tracking-wider text-slate-400 block mb-0.5 uppercase">
                            Valor
                          </label>
                          <input
                            type="text"
                            required
                            value={stat.value}
                            onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 text-center font-bold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Bulletins / Alerts */}
              {activeTab === "announcements" && (
                <div className="space-y-4">
                  <div className="bg-slate-900/5 px-2 py-1 rounded text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">
                    Estructura del Boletín Informativo
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Mostrar Banner de Alerta</span>
                      <button
                        type="button"
                        onClick={() => handleSchoolInputChange("announcementActive", !localSchoolData.announcementActive)}
                        className={`w-12 h-6 pl-0.5 rounded-full flex items-center transition-all cursor-pointer ${
                          localSchoolData.announcementActive ? "bg-tebaev-green justify-end pr-0.5 text-white" : "bg-slate-300 justify-start"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-white shadow-md block"></span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block">
                        Texto de Aviso (Marquesina rotativa)
                      </label>
                      <textarea
                        rows={4}
                        value={localSchoolData.announcementText || ""}
                        onChange={(e) => handleSchoolInputChange("announcementText", e.target.value)}
                        placeholder="Escriba aquí los avisos principales..."
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed font-light">
                    * Si está activo, aparecerá una banda informativa flotante en la parte superior del menú institucional informándole a los visitantes sobre comunicados urgentes del plantel de Mahuixtlan de forma inmediato.
                  </div>
                </div>
              )}

              {/* TAB 4: Students List Database */}
              {activeTab === "students" && (
                <div className="space-y-4">
                  <div className="bg-slate-900/5 px-2 py-1 rounded text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase flex justify-between items-center">
                    <span>Expedientes del Alumnado</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingStudent(!isAddingStudent);
                        setEditingStudentMatricula(null);
                        setStudentForm({
                          matricula: "",
                          nombre: "",
                          semestre: "4º Semestre (Grupo A)",
                          promedio: 8.5,
                          asistencia: "90%",
                          estatus: "Regular",
                          tutor: "",
                          capacitacion: "Informática (Sistemas)"
                        });
                      }}
                      className="px-2 py-1 rounded bg-tebaev-green text-white hover:bg-tebaev-lightgreen font-sans font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shrink-0"
                    >
                      {isAddingStudent ? "Cancelar" : <><Plus className="h-3 w-3" /> Añadir Alumno</>}
                    </button>
                  </div>

                  {/* Add / Edit Student Form */}
                  <AnimatePresence>
                    {isAddingStudent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white p-4 border border-slate-200 rounded-xl space-y-3 overflow-hidden"
                      >
                        <h4 className="font-display font-extrabold text-xs text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 uppercase">
                          <Plus className="h-3.5 w-3.5 text-tebaev-green" />
                          {editingStudentMatricula ? "Modificar Alumno" : "Nuevo Estudiante de Prueba"}
                        </h4>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[8.5px] font-mono font-bold text-slate-400 uppercase block">Matrícula</label>
                            <input
                              type="text"
                              name="matricula"
                              required
                              disabled={!!editingStudentMatricula}
                              placeholder="Ej. 24ETH250"
                              value={studentForm.matricula}
                              onChange={handleStudentFormChange}
                              className="w-full p-2.5 rounded border border-slate-300 font-mono text-xs uppercase"
                            />
                          </div>
                          <div>
                            <label className="text-[8.5px] font-mono font-bold text-slate-400 uppercase block">Nombre Completo</label>
                            <input
                              type="text"
                              name="nombre"
                              required
                              placeholder="Ej. Sofía Landa"
                              value={studentForm.nombre}
                              onChange={handleStudentFormChange}
                              className="w-full p-2.5 rounded border border-slate-300 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[8.5px] font-mono font-bold text-slate-400 uppercase block">Semestre</label>
                            <select
                              name="semestre"
                              value={studentForm.semestre}
                              onChange={handleStudentFormChange}
                              className="w-full p-2 rounded border border-slate-300 text-xs text-slate-700 bg-white font-medium"
                            >
                              <option value="2º Semestre (Grupo A)">2º Semestre (A)</option>
                              <option value="4º Semestre (Grupo A)">4º Semestre (A)</option>
                              <option value="4º Semestre (Grupo B)">4º Semestre (B)</option>
                              <option value="6º Semestre (Grupo A)">6º Semestre (A)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[8.5px] font-mono font-bold text-slate-400 uppercase block">Promedio</label>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              name="promedio"
                              required
                              value={studentForm.promedio}
                              onChange={handleStudentFormChange}
                              className="w-full p-2 rounded border border-slate-300 font-mono text-xs text-center font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[8.5px] font-mono font-bold text-slate-400 uppercase block">Capacitación de Trabajo</label>
                            <select
                              name="capacitacion"
                              value={studentForm.capacitacion}
                              onChange={handleStudentFormChange}
                              className="w-full p-2 rounded border border-slate-300 text-xs text-slate-700 bg-white font-medium"
                            >
                              <option value="Informática (Sistemas)">Informática (Sistemas)</option>
                              <option value="Administración y Contabilidad">Administrar & Contabilidad</option>
                              <option value="Tronco Común">Tronco Común</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[8.5px] font-mono font-bold text-slate-400 uppercase block">Firma de Tutor</label>
                            <input
                              type="text"
                              name="tutor"
                              placeholder="Ej. Juan Landa"
                              value={studentForm.tutor}
                              onChange={handleStudentFormChange}
                              className="w-full p-2 rounded border border-slate-300 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[8.5px] font-mono font-bold text-slate-400 uppercase block">Estatus Boletín</label>
                            <input
                              type="text"
                              name="estatus"
                              placeholder="Ej. Alumno aprobado titular"
                              value={studentForm.estatus}
                              onChange={handleStudentFormChange}
                              className="w-full p-2 rounded border border-slate-300 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[8.5px] font-mono font-bold text-slate-400 uppercase block">Porcentaje Asistencia</label>
                            <input
                              type="text"
                              name="asistencia"
                              placeholder="Ej. 94%"
                              value={studentForm.asistencia}
                              onChange={handleStudentFormChange}
                              className="w-full p-2 rounded border border-slate-300 font-mono text-xs text-center"
                            />
                          </div>
                        </div>

                        {/* Fotografía de Expediente */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
                          <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Fotografía de Expediente</label>
                          <div className="flex items-center gap-3">
                            {studentForm.foto ? (
                              <img
                                src={studentForm.foto}
                                alt="Previsualizar"
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-2xs shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 border border-slate-300">
                                <Users className="h-5 w-5" />
                              </div>
                            )}
                            <div className="flex-1 space-y-1">
                              <span className="text-[10px] text-slate-500 font-medium block leading-none">Carga una foto local (recomendado):</span>
                              <div className="flex gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  id="student-image-file-input"
                                  onChange={handlePhotoUpload}
                                  className="hidden"
                                />
                                <label
                                  htmlFor="student-image-file-input"
                                  className="px-2.5 py-1.5 rounded bg-tebaev-green hover:bg-tebaev-green/95 text-white font-semibold text-[9.5px] uppercase tracking-wider cursor-pointer inline-block transition-all shadow-xs"
                                >
                                  Seleccionar Foto
                                </label>
                                {studentForm.foto && (
                                  <button
                                    type="button"
                                    onClick={() => setStudentForm(prev => ({ ...prev, foto: "" }))}
                                    className="px-2.5 py-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[9.5px] uppercase tracking-wider transition-colors cursor-pointer"
                                  >
                                    Remover
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-slate-200/60 pt-2.5">
                            <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider block mb-1">O selecciona una foto rápida</span>
                            <div className="flex items-center gap-1.5">
                              {[
                                { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=260&auto=format&fit=crop", label: "Alumno A" },
                                { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=260&auto=format&fit=crop", label: "Alumna B" },
                                { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=260&auto=format&fit=crop", label: "Alumno C" },
                                { url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=260&auto=format&fit=crop", label: "Alumna D" }
                              ].map((p, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setStudentForm(prev => ({ ...prev, foto: p.url }))}
                                  className={`p-0.5 rounded-lg border transition-all hover:scale-105 active:scale-95 shrink-0 ${studentForm.foto === p.url ? "border-tebaev-green bg-tebaev-green/5" : "border-slate-200 hover:border-slate-350"}`}
                                  title={p.label}
                                >
                                  <img src={p.url} alt={p.label} className="w-8 h-8 rounded-md object-cover" referrerPolicy="no-referrer" />
                                </button>
                              ))}
                              
                              <div className="flex-1 pl-1">
                                <input
                                  type="text"
                                  placeholder="Pegar URL de foto..."
                                  value={studentForm.foto && !studentForm.foto.startsWith("data:") ? studentForm.foto : ""}
                                  onChange={(e) => setStudentForm(prev => ({ ...prev, foto: e.target.value }))}
                                  className="w-full px-2 py-1.5 rounded border border-slate-300 text-[10px] font-mono text-slate-600 bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2.5 pt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={handleAddOrUpdateStudent}
                            className="flex-1 py-1 px-3 text-[10.5px] font-bold bg-tebaev-green hover:bg-tebaev-green/90 text-white rounded uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            {editingStudentMatricula ? "Actualizar Alumno" : "Confirmar Inserción"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingStudent(false);
                              setEditingStudentMatricula(null);
                            }}
                            className="py-1 px-3 text-[10.5px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-650 rounded uppercase tracking-wider"
                          >
                            Cancelar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Registered Students ListView */}
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1">
                      LISTA GENERAL DEL CICLO ESCOLAR ({students.length})
                    </p>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {students.map((st) => (
                        <div
                          key={st.matricula}
                          className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-left relative hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Photo Thumbnail */}
                            <div className="shrink-0">
                              {st.foto ? (
                                <img
                                  src={st.foto}
                                  alt={st.nombre}
                                  className="w-9 h-9 rounded-lg object-cover border border-slate-200/80"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
                                  <Users className="h-4.5 w-4.5 text-emerald-600/70" />
                                </div>
                              )}
                            </div>

                            <div className="truncate">
                              <p className="font-semibold text-xs text-slate-800 flex items-center gap-1">
                                {st.nombre}
                                <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-1 font-bold">
                                  {st.promedio}
                                </span>
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                                <span>Matrícula: <strong className="text-slate-700">{st.matricula}</strong></span>
                                <span>•</span>
                                <span>{st.semestre.split(" ")[0]} sem.</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-slate-400">
                            <button
                              type="button"
                              onClick={() => handleEditStudentSelect(st)}
                              className="p-1 px-2 rounded-md hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-0.5"
                              title="Editar estudiante"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(st.matricula)}
                              className="p-1 px-1.5 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                              title="Eliminar del sistema"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Gallery Management */}
              {activeTab === "gallery" && (
                <div className="space-y-4">
                  <div className="bg-slate-900/5 px-2 py-1 rounded text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">
                    Gestión de Galería de Fotos del Plantel
                  </div>

                  {/* Form to insert a new photo */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 text-xs shadow-2xs">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Plus className="h-4 w-4 text-tebaev-green" />
                      Añadir Nueva Foto al Plantel
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end text-left">
                      <div className="md:col-span-8 space-y-3">
                        {/* URL input */}
                        <div>
                          <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">
                            Enlace (URL) de la Imagen (opcional si subes archivo)
                          </label>
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/photo-... o selecciona una foto"
                            value={newGalleryUrl}
                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                          />
                        </div>

                        {/* Local File Selector */}
                        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          {newGalleryUrl ? (
                            <img
                              src={newGalleryUrl}
                              alt="Previsualizar"
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-200 text-slate-400 flex items-center justify-center shrink-0 border border-slate-300">
                              <Building className="h-6 w-6 text-slate-400/85" />
                            </div>
                          )}
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-medium block leading-none">Carga una foto local de forma instantánea:</span>
                            <div className="flex gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                id="gallery-file-uploader"
                                onChange={handleGalleryPhotoUpload}
                                className="hidden"
                              />
                              <label
                                htmlFor="gallery-file-uploader"
                                className="px-2.5 py-1.5 rounded bg-tebaev-green hover:bg-tebaev-green/95 text-white font-semibold text-[9.5px] uppercase tracking-wider cursor-pointer inline-block transition-all shadow-xs"
                              >
                                Seleccionar Foto
                              </label>
                              {newGalleryUrl && (
                                <button
                                  type="button"
                                  onClick={() => setNewGalleryUrl("")}
                                  className="px-2.5 py-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[9.5px] uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  Remover
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Photo Description (Context) */}
                      <div className="md:col-span-4 space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase">
                          Contexto de la Imagen
                        </label>
                        <textarea
                          placeholder="Escriba aquí la descripción o historia que se mostrará justo debajo de la foto..."
                          value={newGalleryDesc}
                          onChange={(e) => setNewGalleryDesc(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleAddGalleryImage}
                        className="px-4 py-2 rounded-lg bg-tebaev-green hover:bg-tebaev-lightgreen text-white font-bold text-xs uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                      >
                        <Plus className="h-4 w-4" />
                        Añadir a la Galería
                      </button>
                    </div>
                  </div>

                  {/* Existing gallery images list */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 tracking-wide uppercase text-left">
                      Imágenes del Plantel Registradas ({ (localSchoolData.gallery || []).length })
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(localSchoolData.gallery || []).map((img: any, idx: number) => (
                        <div
                          key={img.id || idx}
                          className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col gap-3 relative hover:border-slate-300 transition-colors text-left"
                        >
                          {/* Image preview and delete lever */}
                          <div className="relative aspect-[16/10] bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                            <img
                              src={img.url}
                              alt="Vista previa"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Local replace selector */}
                            <div className="absolute bottom-2 left-2">
                              <input
                                type="file"
                                accept="image/*"
                                id={`replace-image-${img.id}`}
                                onChange={(e) => handleReplaceGalleryImageFile(img.id, e)}
                                className="hidden"
                              />
                              <label
                                htmlFor={`replace-image-${img.id}`}
                                className="px-2 py-1 rounded bg-black/70 hover:bg-black/90 text-white border border-white/25 hover:border-white/50 text-[9px] font-bold uppercase tracking-wider cursor-pointer inline-block transition-all shadow-xs select-none"
                              >
                                Reemplazar Foto
                              </label>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryImage(img.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md cursor-pointer transition-colors"
                              title="Eliminar de galería"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Editable URL fallback option */}
                          <div className="space-y-0.5">
                            <label className="text-[8.5px] font-mono font-bold text-slate-400 uppercase tracking-widest block font-light">
                              Enlace (URL) de Imagen (Alternativo)
                            </label>
                            <input
                              type="text"
                              value={img.url && !img.url.startsWith("data:") ? img.url : ""}
                              onChange={(e) => {
                                const newUrl = e.target.value;
                                setLocalSchoolData((prev: any) => {
                                  const currentGallery = prev.gallery || [];
                                  return {
                                    ...prev,
                                    gallery: currentGallery.map((g: any) => g.id === img.id ? { ...g, url: newUrl } : g)
                                  };
                                });
                              }}
                              placeholder="Archivo local cargado. Pega URL externa para cambiar..."
                              className="w-full px-2 py-1.5 rounded border border-slate-300 text-[10px] font-mono text-slate-650 bg-slate-50/50"
                            />
                          </div>

                          {/* Editable context description underneath */}
                          <div className="space-y-1">
                            <label className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                              Contexto / Descripción de la Foto
                            </label>
                            <textarea
                              value={img.description}
                              onChange={(e) => handleGalleryDescChange(img.id, e.target.value)}
                              placeholder="Escribe la explicación o contexto que se mostrará abajo de la foto..."
                              rows={3}
                              className="w-full px-2.5 py-2 rounded border border-slate-300 text-xs text-slate-650 bg-slate-50/50 leading-relaxed focus:bg-white resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </form>

            {/* Bottom Actions persistent drawer bar */}
            <div className="p-4 bg-white border-t border-slate-150 flex gap-3 shrink-0 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={handleRestoreDefaults}
                disabled={saving}
                className="flex-1 py-3 text-2xs sm:text-[11px] font-mono font-bold tracking-wider uppercase border border-slate-250 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Por Defecto
              </button>

              <button
                type="button"
                onClick={handleGlobalSaveSubmit}
                disabled={saving}
                className="flex-1 py-3 text-[11px] font-extrabold tracking-wider uppercase bg-tebaev-green hover:bg-tebaev-lightgreen text-white rounded-xl shadow-md shadow-tebaev-green/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Guardando...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>¡Guardado!</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
