import { motion } from "framer-motion";
import mapImg from "@/assets/map-volcanic.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={mapImg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <span className="font-body text-primary font-bold text-sm tracking-[0.3em] uppercase">
            Tower Defense × NFT
          </span>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
            Defense{" "}
            <span className="text-primary text-glow-gold">Heroes</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Zbieraj legendarnych bohaterów, buduj potężne wieże obronne i broń 
            swojego królestwa przed hordami wrogów. Twoje NFT — Twoja armia.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-3.5 bg-primary text-primary-foreground font-body font-bold text-base rounded-lg hover:opacity-90 transition-opacity border-glow-legendary">
            Rozpocznij Grę
          </button>
          <button className="px-8 py-3.5 bg-secondary text-foreground font-body font-bold text-base rounded-lg hover:bg-secondary/80 transition-colors border border-border">
            Odkryj Marketplace
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 pt-8"
        >
          {[
            { value: "12K+", label: "Graczy" },
            { value: "50+", label: "Bohaterów NFT" },
            { value: "30+", label: "Map" },
            { value: "∞", label: "Strategii" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="font-body text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
