import { MapPin, Phone, Mail, Award, CheckCircle, Flame, Sprout, Camera } from "lucide-react";
import { INSTITUTIONAL_DATA } from "../data/schoolData";
import { motion } from "motion/react";
import schoolActivitiesImg from "../assets/images/school_activities_1780596803770.png";

interface AboutSectionProps {
  schoolData?: any;
}

export default function AboutSection({ schoolData }: AboutSectionProps) {
  const currentAddress = schoolData?.location?.address || INSTITUTIONAL_DATA.location.address;
  const currentMunicipality = schoolData?.location?.municipality || INSTITUTIONAL_DATA.location.municipality;
  const currentPostalCode = schoolData?.location?.postalCode || INSTITUTIONAL_DATA.location.postalCode;
  const currentPhone = schoolData?.phone || INSTITUTIONAL_DATA.phone;
  const currentEmail = schoolData?.email || INSTITUTIONAL_DATA.email;
  const currentDirector = schoolData?.director || INSTITUTIONAL_DATA.director;
  const currentCoordinatingTitle = schoolData?.coordinatingTitle || INSTITUTIONAL_DATA.coordinatingTitle;

  return (
    <section id="nosotros" className="py-20 bg-slate-50 relative overflow-hidden">
      
      {/* Decorative vectors */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute left-0 bottom-1/4 w-72 h-72 bg-amber-50 rounded-full blur-2xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-tebaev-green uppercase bg-tebaev-green/5 px-3.5 py-1.5 rounded-full">
            IDENTIDAD INSTITUCIONAL
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Nuestra Escuela en Mahuixtlan
          </h2>
          <div className="h-1.5 w-16 bg-tebaev-gold mx-auto mt-4 rounded-full"></div>
          <p className="text-sm sm:text-base text-slate-600 mt-5 leading-relaxed">
            Fundada para dar cobertura de educación media superior a los hijos de trabajadores cañeros, cafetaleros y comerciantes de Mahuixtlan, Coatepec. Nos enorgullece ser un pilar de superación académica.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Mission & Vision Bento Cards (Col span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden text-left"
            >
              <div className="w-12 h-12 bg-tebaev-green/10 rounded-xl flex items-center justify-center text-tebaev-green">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-800">Nuestra Misión</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Brindar educación de nivel medio superior en la modalidad de Telebachillerato, formando integralmente a los egresados mediante la adquisición de conocimientos, competencias laborales y valores éticos indispensables para incorporarse eficientemente al desarrollo comunitario regional o continuar sus estudios de nivel superior.
              </p>
              {/* Corner decor */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-tebaev-green/5 to-transparent rounded-bl-3xl"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden text-left"
            >
              <div className="w-12 h-12 bg-tebaev-gold/15 rounded-xl flex items-center justify-center text-tebaev-gold-dark">
                <CheckCircle className="h-6.5 w-6.5" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-800">Nuestra Visión</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ser una escuela líder y de excelencia en educación media superior en la zona de Coatepec, Veracruz. Nos proyectamos como una institución vinculada con su entorno sociocultural, con infraestructura actualizada, equipamiento de punta y egresados líderes capaces de incidir positivamente en el sector productivo y cultural.
              </p>
              {/* Corner decor */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-tebaev-gold/5 to-transparent rounded-bl-3xl"></div>
            </motion.div>
          </div>

          {/* Quick Contact & CCT Box (Col span 5) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-tebaev-green text-white rounded-2xl p-6 sm:p-8 border border-tebaev-green shadow-lg flex flex-col justify-between h-full relative overflow-hidden text-left"
            >
              <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>
              
              <div>
                <h4 className="font-display text-xs font-bold text-tebaev-gold tracking-widest uppercase mb-1">CÉDULA INSTITUCIONAL</h4>
                <h3 className="font-display text-2xl font-bold tracking-tight mb-6">Información Local</h3>
                
                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <MapPin className="h-5 w-5 text-tebaev-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-emerald-250 font-mono tracking-wider">DIRECCIÓN</p>
                      <p className="text-sm text-slate-100 font-medium mt-0.5">{currentAddress}</p>
                      <p className="text-xs text-slate-200">{currentMunicipality}, C.P. {currentPostalCode}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <Sprout className="h-5 w-5 text-tebaev-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-emerald-250 font-mono tracking-wider">ENTORNO PRODUCTIVO</p>
                      <p className="text-sm text-slate-100 font-medium mt-0.5">Comunidad Agroindustrial de Mahuixtlan</p>
                      <p className="text-xs text-slate-200">Zonas de cultivos de caña de azúcar e ingenio alcoholero rústico.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <Phone className="h-5 w-5 text-tebaev-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-emerald-250 font-mono tracking-wider">TELÉFONO DE CONTACTO</p>
                      <p className="text-sm text-slate-100 mt-0.5 font-mono">{currentPhone}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <Mail className="h-5 w-5 text-tebaev-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-emerald-250 font-mono tracking-wider">CORREO ELECTRÓNICO</p>
                      <p className="text-sm text-slate-100 mt-0.5 font-mono break-all">{currentEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coordinator signature citation */}
              <div className="mt-8 pt-6 border-t border-white/10 text-left">
                <p className="text-xs text-slate-300 italic">"Garantizando una formación pública inclusiva y equitativa de calidad."</p>
                <p className="text-xs text-tebaev-gold font-semibold mt-2">{currentDirector}</p>
                <p className="text-[10px] text-slate-300">{currentCoordinatingTitle}</p>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Context info for Local traditional spirit-making and Sugar Mill (Ingenio) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-white border border-slate-100 flex flex-col md:flex-row gap-6 items-center text-left shadow-xs"
        >
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-display font-bold text-slate-800 text-base">Vínculo con la comunidad de Mahuixtlan</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Mahuixtlan se localiza a 10 minutos de la cabecera municipal de Coatepec. Su tradición económica gira en torno a la molienda de caña, el trapiche y el cultivo del café. El **TEBAEV Mahuixtlan** capacita activamente a sus estudiantes en informática, contabilidad y negocios de modo que puedan aplicar estos conocimientos para tecnificar, administrar y hacer crecer los negocios cooperativos, cañeros y comerciales tradicionales de su familia.
            </p>
          </div>
        </motion.div>

        {/* Active School Life Showcase (Actividades en Acción) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left bg-gradient-to-br from-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-10 border border-emerald-500/20 shadow-xl overflow-hidden relative"
        >
          {/* Decorative light */}
          <div className="absolute -left-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>

          <div className="lg:col-span-5 z-10">
            <span className="text-[10px] font-mono font-bold tracking-widest text-tebaev-gold uppercase bg-white/10 px-3 py-1 rounded-full border border-white/5">
              Vida Estudiantil
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-4 tracking-tight leading-snug">
              Actividades y Talleres dentro del Plantel
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed font-light">
              Nuestros jóvenes no solo adquieren bases teóricas sólidas, sino que participan activamente en talleres prácticos grupales, proyectos de tecnología aplicada en nuestro aula de cómputo, clubes cívicos e investigación cooperativa local encaminada al crecimiento de Mahuixtlan.
            </p>
            
            <div className="mt-6 space-y-3">
              {[
                "Trabajo colaborativo y dinámicas en aula de cómputo",
                "Integración con proyectos productivos locales",
                "Desarrollo socioemocional mediante actividades cívicas"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-tebaev-gold shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 z-10 flex justify-center w-full">
            <div className="relative group overflow-hidden rounded-2xl border-4 border-white/5 shadow-2xl transition-all duration-300 hover:border-tebaev-gold/40 w-full max-w-2xl">
              <img
                src={schoolData?.activitiesImage || schoolActivitiesImg}
                alt="Estudiantes en el aula de cómputo de TEBAEV desarrollando actividades prácticas del plantel"
                className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Image dark vignette overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-4 flex justify-between items-end">
                <div>
                  <p className="text-xs font-semibold text-white font-display">Taller de Informática y Contabilidad</p>
                  <p className="text-[10px] text-slate-300 font-mono mt-0.5 font-light">Integración y Práctica Digital Colectiva</p>
                </div>
                <span className="text-[9px] font-mono text-tebaev-gold uppercase bg-black/50 px-2.5 py-0.5 rounded border border-white/10 font-bold">
                  En Acción
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic School Gallery Section */}
        <div className="mt-20 pt-10 border-t border-slate-200">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-tebaev-green mb-3">
              <Camera className="h-4 w-4" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Galería del Plantel</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Nuestras Instalaciones y Espacios de Aprendizaje
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto font-light">
              Un recorrido fotográfico por los salones de clase, áreas de cómputo, espacios cívicos y deportivos que componen el TEBAEV Centro Mahuixtlan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(schoolData?.gallery || INSTITUTIONAL_DATA.gallery || []).map((img: any, index: number) => (
              <motion.div
                key={img.id || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all group text-left"
              >
                {/* Image Block */}
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                  <img
                    src={img.url}
                    alt={img.description || "Imagen del plantel"}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white tracking-widest uppercase font-bold">
                    Espacio {index + 1}
                  </div>
                </div>

                {/* Caption / Context directly below the image as requested */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                  <span className="text-[9px] font-mono font-bold text-tebaev-green bg-emerald-50 px-1.5 py-0.5 rounded uppercase block w-fit mb-2">
                    Contexto Escolar
                  </span>
                  <p className="text-xs text-slate-650 leading-relaxed font-normal">
                    {img.description || "Sin descripción disponible para este sector de la escuela."}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
