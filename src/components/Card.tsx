import { motion } from "framer-motion";
import "./card.css";

interface CardProps {
    text: string;
    index: number;
    title: string;
    icon: string;
}

function Card({ text, index, title, icon }: CardProps) {
    const isEven = index % 2 === 0;
    
    return (
        <motion.div
            initial={{ 
                opacity: 0, 
                y: 50,
                x: isEven ? -50 : 50 
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                x: 0,
                transition: {
                    type: "spring",
                    damping: 20,
                    stiffness: 100,
                    delay: index * 0.2
                }
            }}
            whileHover={{
                scale: 1.02,
                x: isEven ? -10 : 10,
                transition: {
                    type: "spring",
                    damping: 7,
                    stiffness: 400
                }
            }}
            viewport={{ once: true, margin: "-100px" }}
            className={`card-container ${isEven ? 'card-right' : 'card-left'}`}
        >
            <div className="card-content">
                <div className="icon-wrapper">{icon}</div>
                <h2 className="card-title">{title}</h2>
                <p className="card-description">{text}</p>
            </div>
        </motion.div>
    );
}

export default Card;