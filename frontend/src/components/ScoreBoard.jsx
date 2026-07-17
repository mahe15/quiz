import PlayerCard from './PlayerCard';

export default function ScoreBoard({ players, myId, questionIndex, totalQuestions }) {
  const me = players?.find((p) => p.id === myId);
  const opponent = players?.find((p) => p.id !== myId);

  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between gap-4 flex-wrap">
      <PlayerCard
        name={me?.name || 'You'}
        score={me?.score || 0}
        isYou={true}
      />

      {/* VS / Question Count */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-[#636e72] uppercase tracking-widest mb-1">Question</span>
        <span
          className="text-lg font-bold text-[#a29bfe]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {questionIndex + 1}/{totalQuestions}
        </span>
      </div>

      <PlayerCard
        name={opponent?.name || 'Opponent'}
        score={opponent?.score || 0}
        isYou={false}
      />
    </div>
  );
}
