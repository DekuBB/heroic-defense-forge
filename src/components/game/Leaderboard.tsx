import { useState, useEffect } from 'react';
import { getLeaderboard, LeaderboardEntry } from '@/game/difficulty';

const Leaderboard = ({ onClose }: { onClose: () => void }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(getLeaderboard());
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">🏆 Ranking</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
        </div>

        {entries.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground text-center py-8">
            Brak wyników. Zagraj, aby pojawić się w rankingu!
          </p>
        ) : (
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs border-b border-border">
                <th className="py-2 text-left">#</th>
                <th className="py-2 text-left">Gracz</th>
                <th className="py-2 text-left">Mapa</th>
                <th className="py-2 text-left">Trudność</th>
                <th className="py-2 text-right">Fala</th>
                <th className="py-2 text-right">Wynik</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 font-bold text-primary">{i + 1}</td>
                  <td className="py-2 text-foreground">{entry.name}</td>
                  <td className="py-2 text-muted-foreground">{entry.map}</td>
                  <td className="py-2">{entry.difficulty === 'easy' ? '🟢' : entry.difficulty === 'normal' ? '🟡' : '🔴'}</td>
                  <td className="py-2 text-right text-accent">{entry.wave}</td>
                  <td className="py-2 text-right font-bold text-legendary">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
