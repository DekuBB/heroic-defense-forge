export type Difficulty = 'easy' | 'normal' | 'hard';

export const DIFFICULTY_SETTINGS: Record<Difficulty, { gold: number; lives: number; label: string; emoji: string; scoreMultiplier: number }> = {
  easy: { gold: 350, lives: 30, label: 'Łatwy', emoji: '🟢', scoreMultiplier: 0.5 },
  normal: { gold: 200, lives: 20, label: 'Normalny', emoji: '🟡', scoreMultiplier: 1 },
  hard: { gold: 120, lives: 10, label: 'Trudny', emoji: '🔴', scoreMultiplier: 2 },
};

export interface LeaderboardEntry {
  name: string;
  score: number;
  map: string;
  difficulty: Difficulty;
  wave: number;
  date: string;
}

const STORAGE_KEY = 'defense-heroes-leaderboard';

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export function addToLeaderboard(entry: LeaderboardEntry): LeaderboardEntry[] {
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  const top = board.slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(top));
  return top;
}
