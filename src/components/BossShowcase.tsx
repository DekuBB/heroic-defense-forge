import { motion } from "framer-motion";
import bossImg from "@/assets/boss-necromancer.png";
import { Skull, Zap, Shield } from "lucide-react";

const BossShowcase = () => {
  return (
    <section id="enemies" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-dark/10 blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Boss image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-dark/30 border-glow-gold">
              <img src={bossImg} alt="Cyber-Nekromanta" className="w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            </div>
          </motion.div>

          {/* Boss info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <span className="text-fire font-body font-bold text-sm tracking-widest uppercase">Raid Boss</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold mt-2 text-foreground">
                Cyber-Nekromanta
              </h2>
              <p className="text-muted-foreground font-body text-lg mt-3 leading-relaxed">
                Potężny boss łączący mroczną magię z cybertechnologią. 
                Zbierz drużynę legendarnych bohaterów, aby pokonać tego przerażającego przeciwnika 
                i zdobyć najrzadsze NFT w grze.
              </p>
            </div>

            {/* Boss stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-secondary rounded-xl p-4 text-center space-y-1">
                <Skull className="w-6 h-6 mx-auto text-fire" />
                <div className="font-body text-2xl font-bold text-foreground">50K</div>
                <div className="font-body text-xs text-muted-foreground">HP</div>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center space-y-1">
                <Zap className="w-6 h-6 mx-auto text-legendary" />
                <div className="font-body text-2xl font-bold text-foreground">980</div>
                <div className="font-body text-xs text-muted-foreground">Atak</div>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center space-y-1">
                <Shield className="w-6 h-6 mx-auto text-accent" />
                <div className="font-body text-2xl font-bold text-foreground">750</div>
                <div className="font-body text-xs text-muted-foreground">Obrona</div>
              </div>
            </div>

            <button className="px-8 py-3 bg-fire text-foreground font-body font-bold text-base rounded-lg hover:opacity-90 transition-opacity">
              Rozpocznij Rajd →
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BossShowcase;
