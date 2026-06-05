import { WORK_培训_OPTIONS } from "../data/schoolData";
import { Monitor, Receipt } from "lucide-react";

export default function AcademicSection() {
  return (
    <section id="academico" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-tebaev-green uppercase bg-tebaev-green/5 px-3.5 py-1.5 rounded-full">
            FORMACIÓN Y COMPLEMENTO
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Talleres Prácticos y Actividades
          </h2>
          <div className="h-1.5 w-16 bg-tebaev-gold mx-auto mt-4 rounded-full"></div>
          <p className="text-sm sm:text-base text-slate-600 mt-5 leading-relaxed">
            Nuestros estudiantes se forman con un enfoque integral que combina talleres especializados de capacitación para el trabajo con múltiples disciplinas artísticas, culturales y deportivas.
          </p>
        </div>

        {/* Capacitaciones para el Trabajo */}
        <div className="mb-10 text-left">
          <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
            Capacitación Laboral Práctica
          </h3>
          <p className="text-sm text-slate-600 mb-8 max-w-2xl">
            Herramientas ocupacionales diseñadas para dar competencias prácticas inmediatas a nuestros jóvenes, preparándolos para incursionar en el ámbito laboral y comercial de Coatepec y la región.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {WORK_培训_OPTIONS.map((option, idx) => {
              const worksIcon = option.icon === "Monitor" ? <Monitor className="h-6 w-6" /> : <Receipt className="h-6 w-6" />;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row gap-5 items-start hover:border-tebaev-green/25 transition-colors relative"
                >
                  <div className="p-3.5 rounded-xl bg-tebaev-green text-tebaev-gold shrink-0">
                    {worksIcon}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-slate-800">{option.title}</h4>
                    <p className="text-xs text-tebaev-lightgreen font-mono tracking-widest uppercase mt-0.5">Capacitación semestral de 3º a 6º</p>
                    <p className="text-sm text-slate-600 mt-3 leading-relaxed font-light">{option.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
