import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquareCode, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { INSTITUTIONAL_DATA } from "../data/schoolData";
import { motion, AnimatePresence } from "motion/react";

interface ContactSectionProps {
  schoolData?: any;
}

export default function ContactSection({ schoolData }: ContactSectionProps) {
  const currentAddress = schoolData?.location?.address || INSTITUTIONAL_DATA.location.address;
  const currentEmail = schoolData?.email || INSTITUTIONAL_DATA.email;
  const currentPhone = schoolData?.phone || INSTITUTIONAL_DATA.phone;
  const currentLat = schoolData?.location?.coordinates?.lat || INSTITUTIONAL_DATA.location.coordinates.lat;
  const currentLng = schoolData?.location?.coordinates?.lng || INSTITUTIONAL_DATA.location.coordinates.lng;

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "Inscripciones",
    mensaje: ""
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message);
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          asunto: "Inscripciones",
          mensaje: ""
        });
      } else {
        setErrorMsg(data.error || "Algo salió mal al procesar su mensaje.");
      }
    } catch (err) {
      setErrorMsg("Ocurrió un error al contactar al servidor. Reintente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-tebaev-green uppercase bg-tebaev-green/5 px-3.5 py-1.5 rounded-full">
            ATENCIÓN A PADRES Y ALUMNOS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Oficina de Contacto y Orientación
          </h2>
          <div className="h-1.5 w-16 bg-tebaev-gold mx-auto mt-4 rounded-full"></div>
          <p className="text-sm sm:text-base text-slate-600 mt-5 leading-relaxed">
            ¿Tiene alguna pregunta directa? Comuníquese usando el formulario de abajo o visítenos directamente en la localidad de Mahuixtlan, Coatepec.
          </p>
        </div>

        {/* Form and Contact details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch text-left">
          
          {/* Form container (Col span 7) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-2xl">
            <h3 className="font-display font-extrabold text-lg text-slate-800 mb-6">
              Enviar Mensaje Directo
            </h3>

            <AnimatePresence mode="wait">
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-800 flex gap-3 text-xs sm:text-sm items-start"
                >
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                  <p className="leading-relaxed font-light">{successMsg}</p>
                </motion.div>
              )}

              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex gap-3 text-xs sm:text-sm items-start"
                >
                  <AlertCircle className="h-5 w-5 text-red-550 shrink-0 animate-bounce" />
                  <p className="leading-relaxed font-semibold">{errorMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} id="contact-school-form" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Tu nombre completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    placeholder="Ej. Ana María Ramírez"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Ej. anamaria@correo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Teléfono celular o fijo (10 dígitos)
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Ej. 2281234567"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Asunto de la consulta
                  </label>
                  <select
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                  >
                    <option value="Inscripciones">Requisitos de Inscripción / Admisiones</option>
                    <option value="Calificaciones">Boleta de Calificaciones / Portal</option>
                    <option value="Constancia">Trámite de Constancia de Estudios</option>
                    <option value="Buzon">Buzón de Sugerencias / Comentario</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
                  Tu mensaje u opinión
                </label>
                <textarea
                  name="mensaje"
                  required
                  rows={4}
                  placeholder="Escriba aquí su duda para el departamento de orientación..."
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-tebaev-green text-white font-semibold text-xs tracking-wider uppercase hover:bg-tebaev-lightgreen transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-75 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-3.5.w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Enviando mensaje...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar mensaje administrativo</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map and contact details sidebar (Col span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Direct details box */}
            <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4">
              <h3 className="font-display font-extrabold text-slate-800 text-lg">
                Ubicación Física del Plantel
              </h3>
              
              <div className="flex gap-3 items-start text-xs sm:text-sm text-slate-650">
                <MapPin className="h-5 w-5 text-tebaev-green shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Dirección Oficial:</p>
                  <p className="text-slate-600 mt-0.5 leading-relaxed font-light">{currentAddress}</p>
                  <p className="text-slate-500 text-xs">Localidad de Mahuixtlan, Coatepec, Veracruz, México, C.P. {schoolData?.location?.postalCode || "91615"}.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-xs sm:text-sm text-slate-655">
                <Mail className="h-5 w-5 text-tebaev-green shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Soporte y Orientación:</p>
                  <p className="text-xs text-tebaev-lightgreen font-mono break-all mt-0.5 font-bold">{currentEmail}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-xs sm:text-sm text-slate-655">
                <Phone className="h-5 w-5 text-tebaev-green shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Línea Telefónica:</p>
                  <p className="text-xs font-mono text-slate-700 mt-0.5">{currentPhone}</p>
                </div>
              </div>
            </div>

            {/* Embedded google map widget or lovely styled visual layout representation since embedding dynamic maps needs iframe, we can show an elegant card styling with map coordinates */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col justify-between h-auto relative overflow-hidden">
              {/* Sugarcane field graphic outline background */}
              <div className="absolute inset-0 bg-emerald-500/5 -z-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px]"></div>
              
              <div>
                <span className="text-[9px] font-mono bg-white/10 text-tebaev-gold border border-white/20 rounded px-2 py-0.5 font-bold uppercase tracking-wider">
                  REFERENCIA DE ACCESO
                </span>
                <h4 className="font-display font-semibold text-base mt-2">Ubicación de Acceso</h4>
                <p className="text-xs text-slate-350 leading-relaxed font-light mt-1.5">
                  Ubicado a un costado de la carretera principal Coatepec-Mahuixtlan, frente a las oficinas cañeras ejidales. El acceso es pavimentado y seguro para el descenso y ascenso de transportes escolares colectivos e individuales.
                </p>
                
                {/* Visual reference badge */}
                <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between font-mono text-xs text-slate-300">
                  <span>Coatepec - Mahuixtlan</span>
                  <span>Acceso Pavimentado</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-tebaev-gold">
                <span>Zona Escolar: Xalapa-Coatepec</span>
                <span className="flex items-center gap-1">
                  Ver mapa <Eye className="h-3.5 w-3.5 text-white" />
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
