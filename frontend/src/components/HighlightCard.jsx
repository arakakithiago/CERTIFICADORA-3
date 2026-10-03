function HighlightCard() {
  return (
    <div className="bg-gradient-to-br from-purple-800 to-purple-950 rounded-2xl p-6 text-white relative overflow-hidden">
      <h2 className="text-lg font-bold mb-4">Destaques</h2>

      <p className="text-lg font-medium leading-relaxed mb-4">
        "Tecnologia também é feita de meninas." 💜
      </p>

      <button className="text-sm font-semibold text-purple-200 hover:text-white transition flex items-center gap-1">
        Conheça o projeto →
      </button>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl"></div>
    </div>
  )
}

export default HighlightCard