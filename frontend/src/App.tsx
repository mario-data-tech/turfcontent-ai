import React, { useState } from 'react';

interface AnalyzedHorse {
  horse_name: string;
  jockey: string;
  trainer: string;
  odds: float;
  rating: number;
  model_prob: number;
  market_prob: number;
  edge: number;
}

export default function App() {
  const [track, setTrack] = useState('Palermo');
  const [raceNumber, setRaceNumber] = useState(7);
  const [distance, setDistance] = useState('1400m');
  
  // Datos del caballo de prueba
  const [horseName, setHorseName] = useState('Storm Horse');
  const [jockey, setJockey] = useState('J. Pérez');
  const [trainer, setTrainer] = useState('M. Gómez');
  const [odds, setOdds] = useState(3.40);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalyzedHorse[] | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      track: track,
      date: new Date().toISOString().split('T')[0],
      race_number: Number(raceNumber),
      distance: distance,
      surface: 'Arena',
      going: 'Normal',
      entries: [
        {
          horse_name: horseName,
          jockey: jockey,
          trainer: trainer,
          odds: Number(odds),
          form_score: 85.0,
          distance_score: 80.0,
          track_score: 82.0,
          jockey_score: 78.0,
          trainer_score: 80.0
        },
        {
          horse_name: 'Lunar Speed',
          jockey: 'C. Montaña',
          trainer: 'R. Benítez',
          odds: 5.20,
          form_score: 78.0,
          distance_score: 75.0,
          track_score: 76.0,
          jockey_score: 80.0,
          trainer_score: 75.0
        }
      ]
    };

    try {
      const response = await fetch('http://localhost:8000/api/races/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.status === 'success') {
        setResults(data.analysis);
      }
    } catch (err) {
      console.error('Error al conectar con la API:', err);
      alert('Error al conectar con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans antialiased">
      {/* Header móvil */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h1 className="text-xl font-black tracking-wider text-amber-500">🏇 TURFCONTENT AI</h1>
          <p className="text-xs text-slate-400">Mobile Racing Intelligence V0.3</p>
        </div>
        <div className="bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-xs font-medium text-amber-400">
          PROD ACTIVE
        </div>
      </header>

      {/* Formulario de Carga / Análisis */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">
          📍 Configurar Carrera
        </h2>
        <form onSubmit={handleAnalyze} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-semibold text-slate-400">Hipódromo</label>
              <input 
                type="text" 
                value={track} 
                onChange={(e) => setTrack(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500" 
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-semibold text-slate-400">Carrera N°</label>
              <input 
                type="number" 
                value={raceNumber} 
                onChange={(e) => setRaceNumber(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500" 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400">Distancia</label>
            <input 
              type="text" 
              value={distance} 
              onChange={(e) => setDistance(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500" 
            />
          </div>

          <div className="pt-2 border-t border-slate-800">
            <label className="text-[10px] uppercase font-semibold text-slate-400">Principal Aspirante</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <input 
                type="text" 
                placeholder="Ej. Storm Horse"
                value={horseName} 
                onChange={(e) => setHorseName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-100" 
              />
              <input 
                type="number" 
                step="0.01"
                placeholder="Cuota (Odds)"
                value={odds} 
                onChange={(e) => setOdds(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-amber-400 font-bold" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? 'ANALIZANDO DATOS...' : '📊 ANALIZAR Y CALCULAR EDGE'}
          </button>
        </form>
      </section>

      {/* Resultados y Ranking Quant */}
      {results && (
        <section className="space-y-3 pb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
            <span>🏆 Ranking & Market Edge</span>
            <span className="text-[10px] text-slate-400 font-normal">Cuantitativo V0.3</span>
          </h2>

          {results.map((horse, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-amber-500">#{idx + 1} SELECCIÓN</span>
                  <h3 className="text-lg font-bold text-slate-100">{horse.horse_name}</h3>
                  <p className="text-xs text-slate-400">Jock: {horse.jockey} | Ent: {horse.trainer}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Cuota</span>
                  <p className="text-base font-black text-amber-400">${horse.odds}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-center text-xs">
                <div className="bg-slate-950 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Rating</span>
                  <span className="font-bold text-slate-200">{horse.rating}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Prob. Modelo</span>
                  <span className="font-bold text-indigo-400">{horse.model_prob}%</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Market Edge</span>
                  <span className={`font-bold ${horse.edge >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {horse.edge > 0 ? `+${horse.edge}%` : `${horse.edge}%`}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => alert(`Generando video vertical para ${horse.horse_name}... (Próximamente conexión de render cloud)`)}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow"
              >
                🎬 GENERAR VIDEO 9:16
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
