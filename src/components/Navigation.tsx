import { useState, useEffect } from "react";
import { GraduationCap, Menu, X, MessageSquare, BookOpen, Clock, Phone, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenPortal: () => void;
  onOpenAssistant: () => void;
  schoolData?: any;
}

export default function Navigation({ activeSection, setActiveSection, onOpenPortal, onOpenAssistant, schoolData }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "inicio", label: "Inicio", icon: GraduationCap },
    { id: "nosotros", label: "Nosotros", icon: Users },
    { id: "academico", label: "Académico", icon: BookOpen },
    { id: "inscripciones", label: "Inscripciones", icon: Clock },
    { id: "contacto", label: "Contacto", icon: Phone },
  ];

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      id="main-nav"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100"
          : "bg-gradient-to-b from-black/50 to-transparent text-white"
      }`}
    >
      <AnimatePresence>
        {schoolData?.announcementActive && schoolData?.announcementText && (
          <motion.div
            id="school-global-announcement"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-400 text-slate-950 font-bold text-[10.5px] py-2 px-4 text-center select-none flex items-center justify-center gap-1.5 transition-all w-full leading-normal border-b border-amber-500/20 shadow-xs uppercase tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping shrink-0" />
            <span className="truncate max-w-5xl">{schoolData.announcementText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? "py-3" : "py-5"}`}>
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick("inicio")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`p-2 rounded-xl transition-all duration-300 ${isScrolled ? "bg-tebaev-green text-white" : "bg-white text-tebaev-green"}`}>
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-display text-lg font-bold tracking-tight transition-colors duration-300`}>
                  {schoolData?.acronym || "TEBAEV"} <span className="text-tebaev-gold">{schoolData?.center?.replace("Centro ", "") || "Mahuixtlan"}</span>
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${isScrolled ? "bg-slate-100 text-slate-600" : "bg-white/10 text-white/80"}`}>
                  CCT {schoolData?.cct || "30ETH0185M"}
                </span>
              </div>
              <p className={`text-[11px] font-medium tracking-wide transition-colors duration-300 ${isScrolled ? "text-slate-500" : "text-slate-200"}`}>
                {schoolData?.name || "Telebachillerato del Estado de Veracruz"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? isScrolled
                        ? "bg-tebaev-green/10 text-tebaev-green font-semibold"
                        : "bg-white/15 text-white font-semibold"
                      : isScrolled
                      ? "text-slate-600 hover:bg-slate-50 hover:text-tebaev-green"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Fast Actions (Portal & AI) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="cta-student-portal-nav"
              onClick={onOpenPortal}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isScrolled
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              }`}
            >
              Control Escolar
            </button>
            <button
              id="cta-ai-assistant-nav"
              onClick={onOpenAssistant}
              className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-tebaev-gold text-tebaev-green hover:bg-tebaev-gold-dark hover:scale-105 transition-all duration-200 shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Consultor IA
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenAssistant}
              className={`p-2 rounded-lg ${isScrolled ? "text-tebaev-green bg-tebaev-green/5" : "text-tebaev-gold bg-white/10"}`}
              title="Consultor IA"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg cursor-pointer ${isScrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-tebaev-green/10 text-tebaev-green font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-slate-400" />
                    {item.label}
                  </button>
                );
              })}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                <button
                  id="mobile-portal-btn"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenPortal();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  <GraduationCap className="h-4 w-4" />
                  Portal de Alumnos (Boletas)
                </button>
                <button
                  id="mobile-ai-btn"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAssistant();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold bg-tebaev-green text-white hover:bg-tebaev-green/90 shadow-sm cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 text-tebaev-gold" />
                  Consultar con IA (WhatsApp-Style)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
