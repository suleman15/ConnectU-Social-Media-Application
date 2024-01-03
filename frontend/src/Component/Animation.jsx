import { useInView } from "framer-motion";
import { useAnimation } from "framer-motion";
import { motion } from "framer-motion";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
const Animation = ({ children, className }) => {
  const control = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);
  console.log(ref);
  useEffect(() => {
    if (inView) {
      control.start("visible");
    }
    // else {
    //   control.start("hidden");
    // }
  }, [control, inView]);
  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { x: -75, y: 75, opacity: 0, scale: 0.4 },
        visible: { x: 0, y: 0, opacity: 1, scale: 1 },
      }}
      initial={"hidden"}
      animate={control}
      transition={{ duration: 1 }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Animation;