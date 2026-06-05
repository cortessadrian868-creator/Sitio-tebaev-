import { motion } from "motion/react";
import { ArrowRight, BookOpen, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { INSTITUTIONAL_DATA } from "../data/schoolData";

interface HeroProps {
  onOpenPortal: () => void;
  onOpenAssistant: () => void;
  onNavigate: (sectionId: string) => void;
  schoolData?: any;
}

export default function Hero({ onOpenPortal, onOpenAssistant, onNavigate, schoolData }: HeroProps) {
  const currentStats = schoolData?.stats || INSTITUTIONAL_DATA.stats;
  const currentMotto = schoolData?.motto || INSTITUTIONAL_DATA.motto;
  const currentCct = schoolData?.cct || INSTITUTIONAL_DATA.cct;
  const currentDirector = schoolData?.director || INSTITUTIONAL_DATA.director;
  const currentSchedule = schoolData?.schedule || "Lunes a Viernes, Turno Vespertino: 14:00 - 19:30 hrs";

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 bg-gradient-to-br from-tebaev-green via-tebaev-lightgreen to-slate-900 text-white overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-tebaev-gold mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-emerald-400 mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
        <div
          className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"
          style={{ maskImage: "radial-gradient(ellipse at center, black, transparent)" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Text */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-tebaev-gold tracking-wide"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>SITIO WEB OFICIAL • CICLO ESCOLAR ACTIVO</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-left"
            >
              Forjando el futuro de <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-tebaev-gold to-amber-300">
                Mahuixtlan, Veracruz
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-left text-base sm:text-lg text-slate-100 max-w-xl font-sans font-light leading-relaxed"
            >
              Bienvenidos al **Telebachillerato Mahuixtlan**. Ofrecemos bachillerato general de alta calidad con capacitación para el trabajo y soporte multimedia innovador, propiciando el desarrollo integral de la juventud de nuestra comunidad cañera.
            </motion.p>

            {/* School Motto Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full sm:w-auto p-4 rounded-xl bg-black/25 border-l-4 border-tebaev-gold text-slate-200 text-left font-mono italic text-sm"
            >
              "{currentMotto}"
            </motion.div>

            {/* CTA Actions */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button
                id="hero-enrollment-cta"
                onClick={() => onNavigate("inscripciones")}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide bg-tebaev-gold hover:bg-tebaev-gold-dark text-tebaev-green transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/25"
              >
                Inscripciones Abiertas
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                id="hero-portal-cta"
                onClick={onOpenPortal}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide bg-white/10 hover:bg-white/20 hover:border-white/40 text-white border border-white/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-tebaev-gold" />
                Consulta de Calificaciones
              </button>
            </motion.div>

            {/* AI Callout badge */}
            <motion.button
              id="hero-ai-badge"
              onClick={onOpenAssistant}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-2 text-xs flex items-center gap-2 text-slate-300 hover:text-white transition-colors py-1 group cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              ¿Tienes dudas dudosas? <span className="text-tebaev-gold underline group-hover:no-underline">Pregúntale a nuestro Consultor IA en tiempo real →</span>
            </motion.button>
          </div>

          {/* School Card Preview / Statistics widget */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 1 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
              className="w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative"
            >
              {/* Gold light ring around the card */}
              <div className="absolute inset-0 -m-0.5 rounded-3xl bg-gradient-to-tr from-tebaev-gold/10 to-emerald-400/10 -z-10 blur-xl"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-100">Ficha Informativa</h4>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">Clave CCT: {currentCct}</p>
                </div>
                <div className="px-2.5 py-1 rounded bg-tebaev-green-light/20 text-tebaev-green border border-emerald-400/20 text-[10px] font-mono font-semibold tracking-wider text-emerald-300">
                  SEV VERACRUZ
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentStats.map((stat: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">{stat.value}</span>
                    <span className="text-[11px] text-slate-300 mt-1 font-medium text-center">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Quick details block */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 rounded-lg bg-white/5 text-tebaev-gold mb-auto">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">TURNO Y HORARIO</p>
                    <p className="text-xs text-slate-200 mt-0.5 font-medium">{currentSchedule}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 rounded-lg bg-white/5 text-tebaev-gold mb-auto">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">COORDINADOR</p>
                    <p className="text-xs text-slate-200 mt-0.5 font-medium">{currentDirector}</p>
                  </div>
                </div>
              </div>

              {/* Quick test student credentials callout */}
              <div className="mt-6 p-3 rounded-lg bg-slate-900/40 border border-white/5">
                <span className="text-[10px] text-tebaev-gold font-mono font-semibold uppercase block text-center">DEMO DEL PORTAL DE ALUMNOS</span>
                <p className="text-[11px] text-slate-300 text-center mt-1">
                  Matrículas prueba: <span className="font-mono text-white select-all">24ETH001</span> o <span className="font-mono text-white select-all">23ETH042</span>
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
