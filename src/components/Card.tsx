import { motion } from "framer-motion";

interface CardProps {
  text: string;
  index: number;
  title: string;
  icon: string;
}

function Card({ text, index, title, icon }: CardProps) {
  const isOdd = index % 2 !== 0;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: isOdd ? -50 : 50,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 100,
          delay: index * 0.1,
        },
      }}
      whileHover={{
        scale: 1.02,
        transition: {
          type: "spring",
          damping: 7,
          stiffness: 400,
        },
      }}
      viewport={{ once: true, margin: "-100px" }}
      className={`relative mx-auto mb-12 w-[95%] max-w-[1000px] min-h-[300px] md:min-h-[250px] p-12 md:p-6 lg:p-12 rounded-3xl bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md border border-white/20 dark:border-blue-200/10 shadow-lg dark:shadow-black/30 dark:shadow-xl transition-all duration-400 ease-[cubic-bezier(0.175, 0.885, 0.32, 1.275)] lg:mx-4 ${isOdd ? "lg:ml-[2%] lg:mr-[10%]" : "lg:mr-[2%] lg:ml-[10%]"} md:w-[95%] md:p-8 md:ml-0 md:mr-0`}
    >
      <div className="flex flex-col h-full gap-6">
        <div className="text-5xl md:text-3xl w-fit p-5 md:p-3 rounded-2xl bg-gradient-to-br from-indigo-500/90 to-purple-500/90 shadow-indigo-300/20 shadow-lg dark:shadow-purple-400/30">
          {icon}
        </div>
        <h2 className="text-2xl md:text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-lg md:text-sm leading-relaxed text-gray-700 dark:text-gray-200/90">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

export default Card;
