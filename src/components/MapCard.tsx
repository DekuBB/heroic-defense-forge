import { motion } from "framer-motion";
import { MapPin, Star, Skull } from "lucide-react";

interface MapCardProps {
  name: string;
  image: string;
  difficulty: number;
  waves: number;
  reward: string;
}

const MapCard = ({ name, image, difficulty, waves, reward }: MapCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-xl overflow-hidden bg-card border border-border cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

        {/* Difficulty */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skull
              key={i}
              className={`w-4 h-4 ${i < difficulty ? "text-fire" : "text-muted-foreground/30"}`}
            />
          ))}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-display text-base font-bold text-foreground">{name}</h3>
        <div className="flex items-center justify-between text-sm font-body">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{waves} fal</span>
          </div>
          <div className="flex items-center gap-1.5 text-legendary">
            <Star className="w-3.5 h-3.5" />
            <span>{reward}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MapCard;
