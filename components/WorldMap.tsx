"use client"

import React, { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from "react-simple-maps"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface MapProps {
  experiences?: any[];
  originCoords?: { latitude: number; longitude: number } | null;
}

export default function WorldMap({ experiences = [], originCoords }: MapProps) {
  const [position, setPosition] = useState({ coordinates: [20, 0], zoom: 1 });

  // 1. Definimos los colores por tramo (Semestre 1-2, 2-3, 3-4)
  const colors = ["#FBBF24", "#F472B6", "#10B981", "#A78BFA"]; // Amarillo, Rosa, Verde, Morado

  // 2. Transformamos las experiencias en marcadores
  const markers = experiences.map(exp => ({
    name: exp.institution.name,
    coordinates: [exp.institution.longitude, exp.institution.latitude] as [number, number]
  }));

  function handleMoveEnd(position: { coordinates: [number, number]; zoom: number }) {
    setPosition(position);
  }

  return (
    <div className="w-full h-[450px] bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden relative shadow-inner cursor-grab active:cursor-grabbing">
      <ComposableMap projectionConfig={{ 
    scale: 145, 
    center: [20, -10] // [Longitud, Latitud]
  }} width={1200} height={500}>
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={handleMoveEnd}
          maxZoom={10}
          minZoom={1}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill="#18181b" 
                  stroke="#27272a" 
                  strokeWidth={0.5 / position.zoom} 
                />
              ))
            }
          </Geographies>

          {/* TRAMO 0: De País de Origen a la Primera Universidad (Blanco y Punteado) */}
          {originCoords && markers.length > 0 && (
            <Line
              from={[originCoords.longitude, originCoords.latitude]}
              to={markers[0].coordinates}
              stroke="#FFFFFF"
              strokeWidth={1.5 / position.zoom}
              strokeDasharray={`${3 / position.zoom} ${3 / position.zoom}`}
            />
          )}

          {/* TRAMOS ENTRE UNIVERSIDADES (Con colores distintos) */}
          {markers.map((marker, index) => {
            if (index === 0) return null;
            const prevMarker = markers[index - 1];
            
            return (
              <Line
                key={`line-${index}`}
                from={prevMarker.coordinates}
                to={marker.coordinates}
                // Asigna color según el tramo, si se acaba el array usa azul por defecto
                stroke={colors[index - 1] || "#3b82f6"} 
                strokeWidth={2.5 / position.zoom}
                strokeLinecap="round"
              />
            );
          })}

          {/* DIBUJAR LOS PUNTOS (MARCADORES) */}
          {markers.map((marker, index) => (
            <Marker key={`marker-${index}`} coordinates={marker.coordinates}>
              <circle 
                r={3.5 / position.zoom} 
                fill="#3b82f6" 
                stroke="#fff" 
                strokeWidth={1 / position.zoom} 
              />
              <text
                textAnchor="middle"
                // Alternamos la posición del texto para que no choquen tanto
                y={index % 2 === 0 ? 15 / position.zoom : -10 / position.zoom}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fill: "#ffffff",
                  fontSize: `${11 / position.zoom}px`,
                  fontWeight: 600,
                  pointerEvents: "none",
                  textShadow: "0px 0px 3px rgba(0,0,0,1)"
                }}
              >
                {marker.name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* LEYENDA FLOTANTE */}
      <div className="absolute bottom-6 left-6 flex flex-wrap gap-4 bg-zinc-900/80 backdrop-blur-md p-4 rounded-xl border border-zinc-800 text-[10px] uppercase tracking-widest font-bold">
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 bg-white border-t border-dashed"></span>
          <span className="text-zinc-300">Viaje desde Origen</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-[#FBBF24]"></span>
          <span className="text-zinc-300">Sem 1 a 2</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-[#F472B6]"></span>
          <span className="text-zinc-300">Sem 2 a 3</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-[#10B981]"></span>
          <span className="text-zinc-300">Tesis (Final)</span>
        </div>
      </div>
    </div>
  )
}