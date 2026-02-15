import { supabase } from '@/lib/supabase'
import MapContainer from '@/components/MapContainer'
import YearFilter from '@/components/YearFilter'

export default async function Home({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const params = await searchParams;
  const selectedYear = params.year ? parseInt(params.year) : 2023;

  // Corregimos la consulta: eliminamos los "..." y especificamos los campos
  const { data: alumni, error } = await supabase
    .from('profiles')
    .select(`
      id, 
      full_name, 
      batch_year,
      origin:countries!origin_country_id(
        name, 
        latitude, 
        longitude
      ),
      experiences(
        id,
        semester_number,
        is_thesis_semester,
        thesis_title,
        thesis_area,
        story_and_challenges,
        institution:institutions(
          name, 
          city, 
          latitude, 
          longitude, 
          country:countries(name)
        )
      )
    `)
    .eq('batch_year', selectedYear)
    .order('semester_number', { referencedTable: 'experiences', ascending: true });

  if (error) {
    console.error("Error en la base de datos:", error.message);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 md:p-6 font-sans max-w-[1800px] mx-auto flex flex-col gap-6">
      
      {/* 1. Header Minimalista */}
      <header className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-black tracking-tighter text-blue-400">
          ALUMNI <span className="text-white">MAP</span>
        </h1>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live Database</span>
        </div>
      </header>

      {/* 2. Slider - Centrado y ancho completo */}
      <YearFilter selectedYear={selectedYear} />

      {/* 3. Contenedor de Contenido */}
      <section className="flex-grow">
        {/* Verificación de seguridad: si no hay datos, pasamos array vacío */}
        <MapContainer alumniData={alumni || []} />
      </section>

    </main>
  );
}