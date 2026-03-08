import { useState } from 'react';
import { motion } from 'framer-motion';

interface NameInputProps {
  score: number;
  onSubmit: (name: string) => void;
  onSkip: () => void;
}

const NameInput = ({ score, onSubmit, onSkip }: NameInputProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name.trim() || 'Anonim');
  };

  return (
    <div className="fixed inset-0 z-[90] bg-background/80 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center space-y-5"
      >
        <div className="text-4xl">🏆</div>
        <h3 className="font-display text-xl font-bold text-foreground">Koniec Gry!</h3>
        <p className="font-body text-sm text-muted-foreground">
          Twój wynik: <span className="text-legendary font-bold text-lg">{score}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Wpisz swoją nazwę..."
            maxLength={20}
            className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            autoFocus
          />
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={onSkip}
              className="px-4 py-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pomiń
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              Zapisz wynik
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NameInput;
