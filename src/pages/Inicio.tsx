const Inicio = () => {
  return (
    <section className="py-28 bg-cover bg-center relative flex items-center">
      <div className="max-w-2xl ml-10 md:ml-24 space-y-6">
        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Gestiona tu equipo con{" "}
          <span className="text-green-500">eficiencia</span>
        </h1>

        <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
          Este espacio fue diseñado para nosotros: un lugar donde podemos
          organizarnos, compartir avances y mantener nuestras tareas bajo
          control. Aquí empieza el camino hacia un trabajo más claro y
          eficiente.
        </p>

        <div className="mt-10">
          <img
            src="/src/assets/fundacion-logo.png"
            alt="Logo Fundación"
            className="w-25 h-20 opacity-100"
          />
        </div>
      </div>
    </section>
  );
};

export default Inicio;
