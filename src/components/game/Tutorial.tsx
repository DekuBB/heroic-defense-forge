import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  title: string;
  description: string;
  emoji: string;
  highlight?: string;
}

const STEPS: TutorialStep[] = [
  {
    title: 'Witaj w Defense Heroes!',
    description: 'Twoim celem jest obrona bazy przed falami wrogów. Rozmieszczaj wieże strategicznie na mapie!',
    emoji: '⚔️',
  },
  {
    title: 'Wybierz Wieżę',
    description: 'Kliknij jedną z wież w panelu po prawej stronie. Każda wieża ma inne statystyki i koszt.',
    emoji: '🏹',
    highlight: 'tower-panel',
  },
  {
    title: 'Postaw Wieżę',
    description: 'Po wybraniu wieży kliknij na podświetlone (pulsujące) pole na mapie, aby ją postawić.',
    emoji: '🗺️',
    highlight: 'game-board',
  },
  {
    title: 'Ulepszaj i Sprzedawaj',
    description: 'Kliknij postawioną wieżę na mapie, aby zobaczyć opcje ulepszenia lub sprzedaży.',
    emoji: '⬆️',
  },
  {
    title: 'Rozpocznij Falę',
    description: 'Kiedy jesteś gotowy, kliknij przycisk "Rozpocznij Falę". Użyj pauzy (⏸️) i przyspieszenia (2x/3x) w trakcie walki.',
    emoji: '🌊',
    highlight: 'hud',
  },
  {
    title: 'Minimapa i Info',
    description: 'Podczas walki na panelu bocznym pojawi się minimapa i informacje o wrogach na polu.',
    emoji: '📍',
  },
  {
    title: 'Powodzenia!',
    description: 'Pokonaj wszystkie 12 fal i bossa na końcu. Twój wynik trafi do rankingu! 🏆',
    emoji: '🎮',
  },
];

const STORAGE_KEY = 'defense-heroes-tutorial-seen';

const Tutorial = () => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setVisible(true);
  }, []);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem(STORAGE_KEY, 'true');
      setVisible(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] bg-background/70 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center space-y-5"
        >
          <div className="text-5xl">{current.emoji}</div>
          <h3 className="font-display text-xl font-bold text-foreground">{current.title}</h3>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">{current.description}</p>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-primary' : i < step ? 'bg-primary/40' : 'bg-border'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleSkip}
              className="px-4 py-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pomiń
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              {step < STEPS.length - 1 ? 'Dalej →' : 'Zaczynajmy! 🎮'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Tutorial;
