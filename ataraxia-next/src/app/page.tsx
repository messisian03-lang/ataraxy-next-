export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold">Ataraxia</h1>
        <p className="text-sm md:text-base text-slate-300 max-w-md mx-auto">
          Bienvenido. Usá el menú o ve a /dashboard para probar el layout privado.
        </p>
      </div>
    </main>
  );
}
