"use client"
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const WorldMap = dynamic(() => import('./WorldMap'), { ssr: false })

export default function MapContainer({ alumniData }: { alumniData: any[] }) {
  const [selectedAlumni, setSelectedAlumni] = useState(alumniData[0] || null);

  // Cada vez que cambie el año (datos nuevos), seleccionamos al primero de la lista
  useEffect(() => {
    if (alumniData.length > 0) {
      setSelectedAlumni(alumniData[0]);
    } else {
      setSelectedAlumni(null);
    }
  }, [alumniData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* COLUMNA IZQUIERDA: Lista de Alumnos (3 de 12 columnas) */}
      <div className="lg:col-span-3 space-y-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase px-2 mb-4 tracking-widest">
          Estudiantes ({alumniData.length})
        </h3>
        
        <div className="space-y-2 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
          {alumniData.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-zinc-600 italic text-sm">No hay registros para este año</p>
            </div>
          ) : (
            alumniData.map((alumno) => (
              <button
                key={alumno.id}
                onClick={() => setSelectedAlumni(alumno)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${
                  selectedAlumni?.id === alumno.id 
                  ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <p className={`font-bold text-sm ${selectedAlumni?.id === alumno.id ? 'text-blue-400' : 'text-zinc-300'}`}>
                  {alumno.full_name}
                </p>
                <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                  <span className="opacity-50">📍 Origen:</span> {alumno.origin?.name}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* COLUMNA DERECHA: Mapa (9 de 12 columnas) */}
      <div className="lg:col-span-9">
        <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 p-2 shadow-2xl overflow-hidden">
          <WorldMap 
            experiences={selectedAlumni?.experiences || []} 
            originCoords={selectedAlumni?.origin} 
          />
        </div>
        
        {/* Aquí es donde irá el Pasaporte Académico del alumno seleccionado */}
        {selectedAlumni && (
          <div className="mt-6 p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
             <h2 className="text-xl font-bold text-white mb-2">Detalle de {selectedAlumni.full_name}</h2>
             {/* Próximo paso: El Pasaporte Académico completo aquí */}
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  )
}