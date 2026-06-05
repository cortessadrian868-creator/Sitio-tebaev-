import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import AcademicSection from "./components/AcademicSection";
import EnrollmentSection from "./components/EnrollmentSection";
import ContactSection from "./components/ContactSection";
import StudentPortal from "./components/StudentPortal";
import ChatAssistant from "./components/ChatAssistant";
import EditorPanel from "./components/EditorPanel";
import { INSTITUTIONAL_DATA } from "./data/schoolData";
import { Student } from "./types";
import { MessageSquare, ArrowUp, GraduationCap, X, Sparkles, ShieldAlert, CheckCircle, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Dynamic state for School Data and Students Database
  const [schoolData, setSchoolData] = useState<any>(INSTITUTIONAL_DATA);
  const [students, setStudents] = useState<Student[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Fetch dynamic institutional configurations and student arrays
  useEffect(() => {
    const fetchData = async () => {
      try {
        const instRes = await fetch("/api/institution");
        if (instRes.ok) {
          const instData = await instRes.json();
          setSchoolData(instData);
        }
        
        const studRes = await fetch("/api/students");
        if (studRes.ok) {
          const studData = await studRes.json();
          setStudents(studData);
        }
      } catch (err) {
        console.error("Error loading server data:", err);
      }
    };
    fetchData();
  }, []);

  // Save changes on the backend
  const handleSaveData = async (newSchoolData: any, newStudents: Student[]) => {
    try {
      // 1. Sync General school configurations
      const instRes = await fetch("/api/institution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchoolData)
      });
      if (!instRes.ok) throw new Error("Fallo la sincronización de datos de plantel.");
      const updatedInst = await instRes.json();
      setSchoolData(updatedInst.data);

      // 2. Sync student records
      const studRes = await fetch("/api/students/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: newStudents })
      });
      if (!studRes.ok) throw new Error("Fallo la sincronización de base de matrículas.");
      
      setStudents(newStudents);
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  // Restore Default Factory presets on server
  const handleResetData = async () => {
    try {
      const res = await fetch("/api/reset", {
        method: "POST"
      });
      if (!res.ok) throw new Error("Fallo la restauración en el servidor.");
      const defaultState = await res.json();
      setSchoolData(defaultState.data);
      setStudents(defaultState.students);
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  // Monitor scroll height to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Automatically highlight active navigation link based on scroll position
      const sections = ["inicio", "nosotros", "academico", "inscripciones", "contacto"];
      const scrollPosition = window.scrollY + 120; // Offset for sticky navbar

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveSection("inicio");
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col pt-0">
      
      {/* Decorative background grid line watermark */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none -z-10"></div>

      {/* Header and navigation bar */}
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        schoolData={schoolData}
        onOpenPortal={() => {
          setIsPortalOpen(true);
          setIsAssistantOpen(false);
          // Scroll cleanly to lookup section so it grabs user's focus
          setTimeout(() => {
            document.getElementById("interactive-modules-section")?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }}
        onOpenAssistant={() => {
          setIsAssistantOpen(true);
          setIsPortalOpen(false);
          setTimeout(() => {
            document.getElementById("interactive-modules-section")?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }}
      />

      {/* Hero display block */}
      <Hero
        schoolData={schoolData}
        onOpenPortal={() => {
          setIsPortalOpen(true);
          setIsAssistantOpen(false);
          setTimeout(() => {
            document.getElementById("interactive-modules-section")?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }}
        onOpenAssistant={() => {
          setIsAssistantOpen(true);
          setIsPortalOpen(false);
          setTimeout(() => {
            document.getElementById("interactive-modules-section")?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }}
        onNavigate={scrollToSection}
      />

      {/* About Section: History and Mission */}
      <AboutSection schoolData={schoolData} />

      {/* Academic section: Plan of studies, Work training options and Clubs */}
      <AcademicSection />

      {/* Interactive Floating Services Section (Portal and AI Counselor) */}
      <section id="interactive-modules-section" className="py-20 bg-slate-50 border-t border-b border-slate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-tebaev-green uppercase bg-tebaev-green/5 px-3.5 py-1.5 rounded-full">
              SERVICIOS DIGITALES ACTIVOS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 tracking-tight">
              Portal del Estudiante y Consejería IA
            </h2>
            <p className="text-sm text-slate-500 mt-3 max-w-xl mx-auto leading-relaxed font-light">
              Utilice nuestros módulos digitales interactivos. Puede consultar boletas del ciclo escolar de inmediato o conversar con nuestro consejero vocacional inteligente.
            </p>

            <div className="flex items-center justify-center gap-3.5 mt-6">
              <button
                id="portal-toggle-btn"
                onClick={() => {
                  setIsPortalOpen(true);
                  setIsAssistantOpen(false);
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer flex items-center gap-2 ${
                  isPortalOpen
                    ? "bg-tebaev-green text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                Portal Escolar
              </button>

              <button
                id="assistant-toggle-btn"
                onClick={() => {
                  setIsAssistantOpen(true);
                  setIsPortalOpen(false);
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer flex items-center gap-2 ${
                  isAssistantOpen
                    ? "bg-tebaev-green text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <MessageSquare className="h-4 w-4 text-tebaev-gold" />
                Asistente Virtual (IA)
              </button>
            </div>
          </div>

          {/* Render Active services inside the container */}
          <div className="max-w-4xl mx-auto transition-all duration-300">
            <AnimatePresence mode="wait">
              {isPortalOpen && (
                <motion.div
                  key="portal-module"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <StudentPortal onClose={() => setIsPortalOpen(false)} />
                </motion.div>
              )}

              {isAssistantOpen && (
                <motion.div
                  key="assistant-module"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatAssistant onClose={() => setIsAssistantOpen(false)} />
                </motion.div>
              )}

              {!isPortalOpen && !isAssistantOpen && (
                <motion.div
                  key="empty-module"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 px-6 bg-white border border-dashed border-slate-250 rounded-3xl text-center max-w-xl mx-auto flex flex-col items-center justify-center gap-4 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-tebaev-green flex items-center justify-center font-bold">
                    <Sparkles className="h-6 w-6 text-tebaev-gold animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <h4 className="font-display font-bold text-slate-800 text-base">Módulos Escolares Digitales</h4>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                    Haga clic sobre cualquiera de los botones superiores para desplegar e interactuar con la plataforma de calificaciones o el consultor inteligente en tiempo real.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Admissions and document requirements section */}
      <EnrollmentSection schoolData={schoolData} />

      {/* Contact submission section with Map information */}
      <ContactSection schoolData={schoolData} />

      {/* Footer Branding section */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-left font-sans text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-white text-base font-extrabold tracking-tight">
                TEBAEV <span className="text-tebaev-gold">Mahuixtlan</span>
              </span>
            </div>
            <p className="text-slate-400 font-light max-w-sm leading-relaxed">
              Telebachillerato del Estado de Veracruz centrado en Mahuixtlan, Coatepec. Garantizando una educación integral, cívica y científica vinculada eficientemente con el desarrollo laboral y la tradición regional de Veracruz.
            </p>
            <p className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} TEBAEV Mahuixtlan • Oficial. Reservados todos los derechos.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3.5">
            <h5 className="font-display font-semibold text-slate-200 uppercase tracking-widest text-[10px]">Enlaces Rápidos</h5>
            <div className="flex flex-col gap-2 font-medium">
              <button onClick={() => scrollToSection("inicio")} className="hover:text-white transition-colors cursor-pointer text-left w-fit">Inicio</button>
              <button onClick={() => scrollToSection("nosotros")} className="hover:text-white transition-colors cursor-pointer text-left w-fit">Nosotros y Valores</button>
              <button onClick={() => scrollToSection("academico")} className="hover:text-white transition-colors cursor-pointer text-left w-fit">Oferta Académica</button>
              <button onClick={() => scrollToSection("inscripciones")} className="hover:text-white transition-colors cursor-pointer text-left w-fit">Admisiones</button>
              <button onClick={() => scrollToSection("contacto")} className="hover:text-white transition-colors cursor-pointer text-left w-fit">Contacto</button>
            </div>
          </div>

          <div className="md:col-span-4 space-y-3.5">
            <h5 className="font-display font-semibold text-slate-200 uppercase tracking-widest text-[10px]">Estructura de Regulación</h5>
            <p className="text-slate-400 font-light leading-relaxed">
              Dependencia: Dirección General de Telebachillerato de Veracruz (DGTEBAEV) de la Secretaría de Educación (SEV), Gobierno del Estado de Veracruz.
            </p>
            <div className="flex items-center gap-2 text-[10px] bg-white/5 border border-white/10 px-3 py-2 rounded-lg w-fit text-slate-300 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Servidor local: Puerto Ingress 3000 activo
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (Scroll to top) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top-fab"
            onClick={handleScrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-tebaev-green hover:bg-tebaev-lightgreen text-white shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-white/10"
            title="Volver al inicio"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Slide-out Control Administrative Panel */}
      <EditorPanel
        schoolData={schoolData}
        setSchoolData={setSchoolData}
        students={students}
        setStudents={setStudents}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveData}
        onReset={handleResetData}
      />

      {/* Persistent floating Admin configurations toggler button */}
      <motion.button
        id="control-school-admin-trigger"
        onClick={() => setIsEditorOpen(true)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 left-6 z-40 px-5 py-3 rounded-full bg-slate-900 border border-slate-800 text-white shadow-xl hover:bg-slate-950 font-sans text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        title="Consola de Edición Web"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <Settings className="h-4 w-4 text-tebaev-gold" />
        Editar Sitio
      </motion.button>

    </div>
  );
}
