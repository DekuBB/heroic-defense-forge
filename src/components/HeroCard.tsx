import { motion } from "framer-motion";
import { Sword, Shield, Zap } from "lucide-react";

interface HeroCardProps {
  name: string;
  title: string;
  image: string;
  rarity: "legendary" | "epic" | "rare";
  attack: number;
  defense: number;
  mana: number;
  element: string;
}

const rarityColors = {
  legendary: "border-legendary text-legendary border-glow-legendary",
  epic: "border-epic text-epic border-glow-epic",
  rare: "border-rare text-rare",
};

const rarityLabels = {
  legendary: "LEGENDARNY",
  epic: "EPICKI",
  rare: "RZADKI",
};

const HeroCard = ({ name, title, image, rarity, attack, defense, mana, element }: HeroCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-xl overflow-hidden card-${rarity} cursor-pointer group`}
    >
      {/* Rarity badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`px-3 py-1 text-xs font-bold font-body tracking-widest rounded-full bg-background/80 backdrop-blur-sm border ${rarityColors[rarity]}`}>
          {rarityLabels[rarity]}
        </span>
      </div>

      {/* Element badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-1 text-xs font-bold font-body tracking-wider rounded-full bg-background/80 backdrop-blur-sm text-foreground border border-border">
          {element}
        </span>
      </div>

      {/* Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="relative p-5 space-y-3">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">{name}</h3>
          <p className="font-body text-sm text-muted-foreground">{title}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatItem icon={<Sword className="w-3.5 h-3.5" />} label="ATK" value={attack} color="text-fire" />
          <StatItem icon={<Shield className="w-3.5 h-3.5" />} label="DEF" value={defense} color="text-accent" />
          <StatItem icon={<Zap className="w-3.5 h-3.5" />} label="MANA" value={mana} color="text-legendary" />
        </div>

        {/* Stat bars */}
        <div className="space-y-1.5">
          <StatBar label="Atak" value={attack} max={100} />
          <StatBar label="Obrona" value={defense} max={100} />
          <StatBar label="Mana" value={mana} max={100} />
        </div>
      </div>
    </motion.div>
  );
};

const StatItem = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) => (
  <div className="flex flex-col items-center gap-1 bg-secondary/50 rounded-lg p-2">
    <div className={color}>{icon}</div>
    <span className="text-xs text-muted-foreground font-body">{label}</span>
    <span className="text-sm font-bold font-body text-foreground">{value}</span>
  </div>
);

const StatBar = ({ label, value, max }: { label: string; value: number; max: number }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-muted-foreground font-body w-12">{label}</span>
    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, delay: 0.2 }}
        className="h-full stat-bar rounded-full"
      />
    </div>
    <span className="text-xs text-foreground font-body w-6 text-right">{value}</span>
  </div>
);

export default HeroCard;
