import { useInView } from "framer-motion";
import { useAnimation } from "framer-motion";
import { motion } from "framer-motion";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
const Animation = ({ children, className, index }) => {
  const control = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);
  console.log(ref);
  useEffect(() => {
    if (inView) {
      control.start("visible");
    } else {
      control.start("hidden");
    }
  }, [control, inView]);
  console.log(index);
  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: {
          opacity: 0,
          // if odd index card,slide from right instead of left
          x: index % 2 === 0 ? 50 : -50,
        },
        visible: {
          opacity: 1,
          // if odd index card,slide from right instead of left
          x: 0,
        },
      }}
      initial={"hidden"}
      animate={control}
      exit="hidden"
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Animation;
