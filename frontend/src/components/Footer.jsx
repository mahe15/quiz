export default function Footer() {
  return (
    <footer className="relative z-10 px-6 py-10 border-t border-white/5">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-[#636e72] text-sm">
          Built with ⚡ by{' '}
          <span className="text-[#a29bfe] font-semibold">QuizBattle</span>
          {' · '}
          React + Socket.IO + MySQL
        </p>
      </div>
    </footer>
  );
}
