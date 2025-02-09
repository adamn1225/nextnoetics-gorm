import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../motionConfig";

const AboutSection = () => {
  return (
    <motion.section
      id="about"
      className="bg-zinc-950 text-zinc-100 dark:bg-zinc-950 dark:text-white py-20"
      {...fadeInUp}
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h2 className="text-4xl text-primary font-bold mb-6" {...fadeInUp}>
          The Foundry
        </motion.h2>
        <motion.p className="text-lg leading-relaxed mb-8 max-w-3xl mx-auto" {...fadeInUp}>
          We’re not just creators—we’re **curators of the digital wild**. We uproot the stale, the safe, and the forgettable, making room for **brands that demand attention**. From high-impact web apps to automated efficiency, we build digital experiences that refuse to blend in.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          {/* Team Member 1 */}
          <motion.div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-lg" {...fadeInUp}>
            <h3 className="text-xl font-bold text-zinc-950 dark:text-white">Adam Noah</h3>
            <p className="text-lg text-primary dark:text-foreground">Founder & Lead Developer</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-200 mt-2">
              Architect of the unconventional. Turns wild ideas into working realities.
            </p>
          </motion.div>

          {/* Team Member 3 */}
          <motion.div className="p-6 bg-zinc-100 text-zinc-950 dark:bg-zinc-800 rounded-lg shadow-lg" {...fadeInUp}>
            <h3 className="text-xl font-bold dark:text-white">Raz Fluxman</h3>
            <p className="text-lg text-primary dark:text-foreground">Project Manager</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Strategy disruptor. Turns brands into movements.
            </p>
          </motion.div>
          {/* Team Member 4 */}

        </div>
      </div>

    </motion.section>
  );
};

export default AboutSection;