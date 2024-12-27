import {motion} from "framer-motion";
import "./card.css";
interface CardProps {
    text: string;
    index: number;
}
function Card({text, index}: CardProps){
    return(
        <motion.div
        className="card"
        initial={{
            opacity:0,
            x: index%2 ===0? 50:-50
        }}
        whileInView={{
            opacity:1,
            x:0,
            transition:{
                duration:1
            }
        }}
        viewport={{once:false}}>
            <p className="card-text">{text}</p>
        </motion.div>
    );
}
export default Card;