import React, { useState, useRef } from "react";
import { GraduationCap, Search, AlertCircle, FileText, CheckCircle, ChevronRight, User, Award, ShieldCheck, Printer } from "lucide-react";
import { Student } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface StudentPortalProps {
  onClose?: () => void;
}

export default function StudentPortal({ onClose }: StudentPortalProps) {
  const [matricula, setMatricula] = useState("");
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState<string | null>(null);

  const lookupResultRef = useRef<HTMLDivElement>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matricula.trim()) return;

    setLoading(true);
    setNotFound(null);
    setStudentData(null);

    // Minor loading latency so the user feels the real query happening
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const response = await fetch("/api/students/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula: matricula.trim() }),
      });
      const data = await response.json();
      if (response.ok && data.found) {
        setStudentData(data.student);
        setTimeout(() => {
          lookupResultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
      } else {
        setNotFound(data.message || "Matrícula no encontrada");
      }
    } catch (err) {
      setNotFound("Error al comunicarse con el servidor escolar. Por favor, reintente.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoMatricula = (demoMat: string) => {
    setMatricula(demoMat);
    setNotFound(null);
    setStudentData(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="portal-seccion-contenedor" className="p-1.5 sm:p-4 rounded-3xl bg-slate-900/5 border border-slate-200 shadow-xs">
      <div className="bg-white rounded-2xl p-6 sm:p-8 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-tebaev-green text-white shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-800">
                Portal de Consulta de Boleta
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Consulta oficial de calificaciones del Ciclo Escolar Activo
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cerrar portal
            </button>
          )}
        </div>

        {/* Form panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Query controls */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              Ingrese la matrícula proporcionada por el personal de control escolar para consultar calificaciones por materia, porcentaje de asistencia y acreditación semestral.
            </p>

            <form onSubmit={handleLookup} id="portal-lookup-form" className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold tracking-wider text-slate-600 uppercase block mb-1.5">
                  MATRÍCULA DEL ALUMNO
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ej. 24ETH001"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-350 bg-slate-50 focus:bg-white text-slate-800 text-sm font-semibold tracking-wider font-mono focus:outline-hidden focus:ring-1 focus:ring-tebaev-green focus:border-tebaev-green transition-all uppercase placeholder:normal-case"
                  />
                  <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-tebaev-green text-white font-semibold text-sm hover:bg-tebaev-lightgreen transition-all shadow-md shadow-tebaev-green/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Buscando registro...</span>
                  </>
                ) : (
                  <span>Buscar calificaciones</span>
                )}
              </button>
            </form>

            {/* Hint / Demo Accounts */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <span className="text-[10px] font-mono font-extrabold tracking-wider text-amber-800 block uppercase">
                MATRÍCULAS DE DEMOSTRACIÓN
              </span>
              <p className="text-[11px] text-slate-600 mt-1">
                La plataforma de TEBAEV Mahuixtlan cuenta con registros de demostración activos para pruebas escolares. Haz clic en cualquiera para autocompletar:
              </p>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => fillDemoMatricula("24ETH001")}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] font-bold text-slate-700 text-center hover:bg-slate-50 hover:border-tebaev-green/30 cursor-pointer active:scale-95 transition-transform"
                >
                  24ETH001
                  <span className="text-[9px] block font-sans text-slate-400 font-normal mt-0.5">Juan Carlos (excelente)</span>
                </button>

                <button
                  onClick={() => fillDemoMatricula("23ETH042")}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] font-bold text-slate-700 text-center hover:bg-slate-50 hover:border-tebaev-green/30 cursor-pointer active:scale-95 transition-transform"
                >
                  23ETH042
                  <span className="text-[9px] block font-sans text-slate-400 font-normal mt-0.5">Diego A. (graduando)</span>
                </button>

                <button
                  onClick={() => fillDemoMatricula("24ETH002")}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] font-bold text-slate-700 text-center hover:bg-slate-50 hover:border-tebaev-green/30 cursor-pointer active:scale-95 transition-transform"
                >
                  24ETH002
                  <span className="text-[9px] block font-sans text-slate-400 font-normal mt-0.5">María Ortiz (regular)</span>
                </button>

                <button
                  onClick={() => fillDemoMatricula("25ETH105")}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] font-bold text-slate-700 text-center hover:bg-slate-50 hover:border-tebaev-green/30 cursor-pointer active:scale-95 transition-transform"
                >
                  25ETH105
                  <span className="text-[9px] block font-sans text-slate-400 font-normal mt-0.5">Sofía Hdez (condicional)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results display panel */}
          <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8 pt-6 lg:pt-0" ref={lookupResultRef}>
            <AnimatePresence mode="wait">
              {studentData ? (
                <motion.div
                  key="result-card"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Action row */}
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-emerald-500" /> Registro oficial localizado
                    </span>
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-xs border border-slate-200 cursor-pointer transition-colors"
                      title="Imprimir boleta de calificaciones"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Imprimir
                    </button>
                  </div>

                  {/* Print and view Area */}
                  <div id="print-boleta-area" className="p-6 rounded-2xl bg-slate-50/60 border border-slate-200/90 relative text-left">
                    {/* Official badge header watermark */}
                    <div className="absolute top-4 right-4 text-[10px] uppercase font-mono font-semibold tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                      BOLETA DIGITAL
                    </div>

                    {/* School Identity details */}
                    <div className="mb-5 pb-4 border-b border-slate-200">
                      <h4 className="font-display font-extrabold text-sm text-slate-800 tracking-tight uppercase">
                        Telebachillerato del Estado de Veracruz
                      </h4>
                      <div className="flex justify-between items-center flex-wrap gap-2 text-slate-500 text-xs font-mono mt-1">
                        <span>Lugar: Mahuixtlan, Veracruz</span>
                        <span>CCT: 30ETH0185M</span>
                        <span>Zona: Coatepec</span>
                      </div>
                    </div>

                    {/* Student Metadata Card */}
                    <div className="mb-5 p-4 rounded-xl bg-white border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                      {/* Photo Thumbnail */}
                      <div className="shrink-0">
                        {studentData.foto ? (
                          <img
                            src={studentData.foto}
                            alt={studentData.nombre}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200/85 shadow-2xs"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-emerald-50 text-tebaev-green flex items-center justify-center border border-emerald-100">
                            <User className="h-8 w-8 text-tebaev-green/60" />
                          </div>
                        )}
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full text-left">
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono tracking-wider">ESTUDIANTE</span>
                          <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                            {studentData.nombre}
                          </p>
                          <span className="text-xs text-slate-500 font-mono">{studentData.matricula}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 font-mono tracking-wider">SEMESTRE / GRUPO</span>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">
                            {studentData.semestre}
                          </p>
                          <p className="text-xs text-slate-500">Talleres: {studentData.capacitacion}</p>
                        </div>

                        <div className="pt-2 sm:pt-0 sm:border-t-0 border-t border-slate-105">
                          <span className="text-[10px] text-slate-400 font-mono tracking-wider">TUTOR REGISTRADO</span>
                          <p className="text-xs font-medium text-slate-700 mt-0.5">{studentData.tutor}</p>
                        </div>

                        <div className="pt-2 sm:pt-0 sm:border-t-0 border-t border-slate-105">
                          <span className="text-[10px] text-slate-400 font-mono tracking-wider">PROMEDIO Y ASISTENCIA</span>
                          <div className="flex items-center gap-4 mt-0.5 text-slate-800">
                            <div className="flex items-center gap-1.5">
                              <Award className="h-3.5 w-3.5 text-tebaev-gold" />
                              <span className="text-sm font-bold font-mono">{studentData.promedio}</span>
                            </div>
                            <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold">{studentData.asistencia} asis.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subject Score Table */}
                    <h5 className="font-display font-semibold text-slate-800 text-xs mb-2 tracking-wide uppercase">Asignaturas cursadas y rendimiento</h5>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white mb-5">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="py-2.5 px-3.5 font-semibold text-slate-600">Nombre de la Asignatura</th>
                            <th className="py-2.5 px-3.5 font-semibold text-slate-650 text-center font-mono">Calificación</th>
                            <th className="py-2.5 px-3.5 font-semibold text-slate-600 text-center">Faltas acumuladas</th>
                            <th className="py-2.5 px-3.5 font-semibold text-slate-600 text-right">Estatus</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentData.materias.map((materia, idx) => {
                            const isPassing = materia.calificacion >= 6.0;
                            return (
                              <tr key={idx} className="border-b last:border-b-0 border-slate-105 hover:bg-slate-50/50">
                                <td className="py-2.5 px-3.5 font-medium text-slate-800">{materia.nombre}</td>
                                <td className="py-2.5 px-3.5 text-center font-mono font-bold text-slate-900">{materia.calificacion.toFixed(1)}</td>
                                <td className="py-2.5 px-3.5 text-center font-mono font-medium text-slate-600">{materia.faltas}</td>
                                <td className="py-2.5 px-3.5 text-right font-medium">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isPassing ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                    {isPassing ? "Aprobada" : "Reprobada"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Director stamp & observation */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-150 text-left">
                      <div className="flex gap-2 items-start text-xs rounded">
                        <ShieldCheck className="h-4.5 w-4.5 text-tebaev-green shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-800">Estatus final:</p>
                          <p className="text-slate-600 mt-0.5 leading-relaxed font-light">{studentData.estatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : notFound ? (
                <motion.div
                  key="notfound-card"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 px-6 rounded-2xl bg-red-50/50 border border-red-200/50 flex flex-col items-center justify-center text-center gap-3"
                >
                  <AlertCircle className="h-10 w-10 text-red-500 animate-bounce" />
                  <h4 className="font-display font-bold text-slate-800">Búsqueda sin coincidencia</h4>
                  <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
                    {notFound}
                  </p>
                </motion.div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center gap-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-250">
                  <FileText className="h-12 w-12 text-slate-300" />
                  <p className="text-xs text-slate-400 font-medium max-w-xs leading-relaxed">
                    Cargue una matrícula escolar válida para desplegar la boleta y el historial académico.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
