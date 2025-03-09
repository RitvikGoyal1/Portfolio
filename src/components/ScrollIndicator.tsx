import { motion } from "framer-motion";
import { Box } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ScrollIndicator = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        opacity: 0.7,
        "&:hover": {
          opacity: 1,
        },
      }}
      onClick={() => {
        window.scrollTo({
          top: window.innerHeight,
          behavior: "smooth",
        });
      }}
    >
      <motion.div
        animate={{
          y: [0, 12, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <KeyboardArrowDownIcon fontSize="large" />
      </motion.div>
    </Box>
  );
};

export default ScrollIndicator;
