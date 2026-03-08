import { motion } from "framer-motion";
import GameNav from "@/components/GameNav";
import HeroSection from "@/components/HeroSection";
import HeroCard from "@/components/HeroCard";
import MapCard from "@/components/MapCard";
import BossShowcase from "@/components/BossShowcase";
import TowerShowcase from "@/components/TowerShowcase";

import paladinImg from "@/assets/hero-paladin.png";
import fireMageImg from "@/assets/hero-fire-mage.png";
import rangerImg from "@/assets/hero-ranger.png";
import mapVolcanic from "@/assets/map-volcanic.png";
import mapTundra from "@/assets/map-tundra.png";

const heroes = [
  {
    name: "Paladyn Światłości",
    title: "Wojownik Legendarny",
    image: paladinImg,
    rarity: "legendary" as const,
    attack: 85,
    defense: 95,
    mana: 60,
    element: "⚡ Światło",
  },
  {
    name: "Zaklinacz Ognia",
    title: "Arcymag Płomieni",
    image: fireMageImg,
    rarity: "legendary" as const,
    attack: 98,
    defense: 45,
    mana: 95,
    element: "🔥 Ogień",
  },
  {
    name: "Łowczyni z Puszczy",
    title: "Ranger Elfów",
    image: rangerImg,
    rarity: "epic" as const,
    attack: 88,
    defense: 60,
    mana: 72,
    element: "🌿 Natura",
  },
];

const maps = [
  {
    name: "Wulkaniczna Pustkowie",
    image: mapVolcanic,
    difficulty: 4,
    waves: 25,
    reward: "Legendarny Łup",
  },
  {
    name: "Śnieżna Tundra",
    image: mapTundra,
    difficulty: 3,
    waves: 20,
    reward: "Epicki Łup",
  },
];

const SectionTitle = ({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="text-center space-y-3 mb-12"
  >
    <span className="font-body text-primary font-bold text-xs tracking-[0.3em] uppercase">{badge}</span>
    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
    <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">{subtitle}</p>
  </motion.div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-game-gradient">
      <GameNav />
      <HeroSection />

      {/* Heroes Section */}
      <section id="heroes" className="py-24 container mx-auto px-4">
        <SectionTitle
          badge="Kolekcja NFT"
          title="Legendarni Bohaterowie"
          subtitle="Zbieraj i ulepszaj potężnych bohaterów, każdy z unikalnymi zdolnościami"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {heroes.map((hero, i) => (
            <motion.div
              key={hero.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <HeroCard {...hero} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Maps Section */}
      <section id="maps" className="py-24 container mx-auto px-4">
        <SectionTitle
          badge="Level Design"
          title="Pola Bitewne"
          subtitle="Strategicznie rozmieszczaj wieże na unikalnych mapach pełnych wyzwań"
        />
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {maps.map((map, i) => (
            <motion.div
              key={map.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <MapCard {...map} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Towers Section */}
      <TowerShowcase />

      {/* Boss Section */}
      <BossShowcase />

      {/* Marketplace CTA */}
      <section id="marketplace" className="py-24 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-border p-12 md:p-16 text-center bg-card"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              NFT Marketplace
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Kupuj, sprzedawaj i wymieniaj legendarnych bohaterów, wieże obronne 
              i rzadkie przedmioty z innymi graczami.
            </p>
            <button className="px-8 py-3.5 bg-primary text-primary-foreground font-body font-bold text-base rounded-lg hover:opacity-90 transition-opacity border-glow-legendary">
              Wejdź do Marketplace
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-body text-sm text-muted-foreground">
            © 2026 Defense Heroes. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
