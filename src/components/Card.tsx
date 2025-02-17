import { motion } from "framer-motion";
import "./card.css";

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
                    delay: index * 0.1
                }
            }}
            whileHover={{
                scale: 1.02,
                transition: {
                    type: "spring",
                    damping: 7,
                    stiffness: 400
                }
            }}
            viewport={{ once: true, margin: "-100px" }}
            className={`card-container ${isOdd ? 'card-left' : 'card-right'}`}
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