import React, { useState } from "react";
import { ENROLLMENT_REQUIREMENTS } from "../data/schoolData";
import { FileText, ClipboardList, CheckCircle, Smile, AlertTriangle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EnrollmentSectionProps {
  schoolData?: any;
}

export default function EnrollmentSection({ schoolData }: EnrollmentSectionProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    tutoraNombre: "",
    alumnoNombre: "",
    curp: "",
    celular: "",
    correo: "",
    secundariaDeOrigen: "",
    promedioSecundaria: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate pre-registration submission
    setFormSubmitted(true);
  };

  return (
    <section id="inscripciones" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-tebaev-green uppercase bg-tebaev-green/5 px-3.5 py-1.5 rounded-full">
            ADMISIONES
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Inscripciones y Requisitos
          </h2>
          <div className="h-1.5 w-16 bg-tebaev-gold mx-auto mt-4 rounded-full"></div>
          <p className="text-sm sm:text-base text-slate-600 mt-5 leading-relaxed">
            Consulte la documentación requerida para formalizar la inscripción de estudiantes de nuevo ingreso. También puede realizar un pre-registro digital inmediato en esta sección.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          
          {/* Column 1: Requirements (Col span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h3 className="font-display font-extrabold text-xl text-slate-800 mb-4 flex items-center gap-2.5">
                <FileText className="h-5.5 w-5.5 text-tebaev-green" />
                Documentación Obligatoria
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 font-light">
                Es mandatorio entregar los siguientes documentos originales acompañados de dos copias impresas legibles para formalizar el expediente del alumno en el Departamento de Control Escolar del plantel:
              </p>

              <div className="space-y-3.5">
                {ENROLLMENT_REQUIREMENTS.map((req, idx) => (
                  <div key={idx} className="flex gap-3 items-start text-sm text-slate-700">
                    <div className="bg-emerald-50 text-tebaev-green p-1 rounded-full shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="font-medium font-sans leading-relaxed">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Pre-registration Simulation Form (Col span 5) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-lg relative">
              <span className="absolute -top-3.5 -right-3.5 bg-tebaev-gold text-tebaev-green font-mono font-bold text-[10px] uppercase.tracking-wider px-3 py-1.5 rounded-full shadow-md border border-amber-300 flex items-center gap-1">
                Ficha instantánea
              </span>

              <h3 className="font-display font-bold text-slate-800 text-lg mb-1 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-tebaev-green" />
                Pre-Registro Digital
              </h3>
              <p className="text-xs text-slate-500 mb-6 font-light">
                Agiliza el trámite rellenando los datos preliminares del alumno para reservar su lugar académico en el ciclo escolar.
              </p>

              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form
                    key="pre-reg-form"
                    onSubmit={handlePreRegister}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                        Nombre completo del Tutor
                      </label>
                      <input
                        type="text"
                        name="tutoraNombre"
                        required
                        placeholder="Ej. Juan Carlos Flores Méndez"
                        value={formData.tutoraNombre}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                        Nombre completo del Alumno
                      </label>
                      <input
                        type="text"
                        name="alumnoNombre"
                        required
                        placeholder="Ej. Sofía Flores Pérez"
                        value={formData.alumnoNombre}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                          CURP del Alumno
                        </label>
                        <input
                          type="text"
                          name="curp"
                          required
                          placeholder="FOPA100517M..."
                          maxLength={18}
                          value={formData.curp}
                          onChange={handleInputChange}
                          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green uppercase"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                          Celular del Tutor
                        </label>
                        <input
                          type="tel"
                          name="celular"
                          required
                          placeholder="Ej. 2282313410"
                          value={formData.celular}
                          onChange={handleInputChange}
                          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                        Secundaria de Procedencia
                      </label>
                      <input
                        type="text"
                        name="secundariaDeOrigen"
                        required
                        placeholder="Ej. General Mahuixtlan, o Técnica Coatepec"
                        value={formData.secundariaDeOrigen}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 mt-4 rounded-xl bg-tebaev-green text-white font-semibold text-xs tracking-wider uppercase hover:bg-tebaev-lightgreen transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      Enviar Pre-registro
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="pre-reg-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-6 flex flex-col items-center justify-center gap-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                      <Smile className="h-10 w-10 animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-display font-extrabold text-slate-800 text-lg">¡Pre-registro enviado!</h4>
                      <p className="text-xs text-slate-600 max-w-sm font-light leading-relaxed">
                        Muchas gracias, **{formData.tutoraNombre}**. Hemos registrado la solicitud de inscripción para el alumno **{formData.alumnoNombre}**.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 text-[11px] text-slate-500 max-w-sm mt-3 leading-relaxed">
                      **Próximo paso**: Se le notificará a su celular **{formData.celular}** para programar la entrega física de los documentos originales en el plantel de Mahuixtlan. ¡Le esperamos con gusto!
                    </div>

                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs font-semibold text-tebaev-green hover:underline cursor-pointer pt-3"
                    >
                      Registrar otro alumno
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
