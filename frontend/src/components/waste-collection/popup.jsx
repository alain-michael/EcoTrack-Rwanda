import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';


const PopUp = ({ time, distance}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      variants={{
        hidden: { opacity: 0, x: 0, y: -50 },
        visible: { opacity: 1, x: 0, y: 0 },
      }}
    >
      <div className="flex flex-col gap-1 bg-white rounded-sm px-3 py-2 text-slate-600">
        <div>
          <p className="font-bold font-cursive text-[18px]">
            Route Information
          </p>
        </div>
        <div className="flex gap-4">
          <p className="text-[15px]">Distance: {distance}</p>
          <p className="text-[15px]"> Time: {time}</p>
        </div>
      </div>
    </motion.div>
  );
};
export default PopUp;
