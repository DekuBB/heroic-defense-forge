import { motion } from "framer-motion";
import { Sword, Shield, Zap } from "lucide-react";

import towerArcane from "@/assets/tower-arcane.png";
import towerArcher from "@/assets/tower-archer.png";
import towerCannon from "@/assets/tower-cannon.png";

const towers = [
  {
    name: "Wieża Magiczna",
    subtitle: "Arcane Spire – Tier 3",
    image: towerArcane,
    rarity: "legendary" as const,
    attack: 65,
    range: 3.5,
    special: "🌀 Splash AoE",
    description: "Starożytna wieża z wirującym worteksem magicznej energii. Zadaje obrażenia obszarowe wszystkim wrogom w zasięgu.",
  },
  {
    name: "Wieża Łuczników",
    subtitle: "Ranger Garrison – Tier 4",
    image: towerArcher,
    rarity: "epic" as const,
    attack: 40,
    range: 4,
    special: "🎯 Szybki Ostrzał",
    description: "Wielopoziomowa strażnica z platformami łuczników. Najszybsza szybkostrzelność ze wszystkich wież.",
  },
  {
    name: "Działo Oblężnicze",
    subtitle: "Gnome Cannon – Tier 3",
    image: towerCannon,
    rarity: "legendary" as const,
    attack: 140,
    range: 4,
    special: "💥 Potężny Wybuch",
    description: "Mechaniczne działo gnomów z zaawansowaną technologią steampunk. Zadaje masywne obrażenia obszarowe.",
  },
];

const rarityBorder = {
  legendary: "border-legendary/30 border-glow-legendary",
  epic: "border-epic/30 border-glow-epic",
};

const TowerShowcase = () => {
  return (
    <section id="towers" className="py-24 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center space-y-3 mb-12"
      >
        <span className="font-body text-primary font-bold text-xs tracking-[0.3em] uppercase">Arsenał</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Wieże Obronne</h2>
        <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
          Potężne fortyfikacje z unikalnymi zdolnościami do obrony przed hordami wrogów
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {towers.map((tower, i) => (
          <motion.div
            key={tower.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative rounded-xl overflow-hidden bg-card border cursor-pointer group ${rarityBorder[tower.rarity]}`}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-b from-secondary/30 to-card flex items-center justify-center">
                <img
                  src={tower.image}
                  alt={tower.name}
                  className="w-48 h-48 object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>

              {/* Info */}
              <div className="relative p-5 space-y-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{tower.name}</h3>
                  <p className="font-body text-sm text-muted-foreground">{tower.subtitle}</p>
                </div>

                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {tower.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Sword className="w-3.5 h-3.5 text-fire" />
                    <span className="text-xs font-bold font-body text-foreground">{tower.attack} ATK</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-accent" />
                    <span className="text-xs font-bold font-body text-foreground">{tower.range} RNG</span>
                  </div>
                  <span className="text-xs font-body text-legendary">{tower.special}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TowerShowcase;
