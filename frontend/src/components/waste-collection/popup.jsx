import React from 'react';
import { motion } from 'framer-motion';
import createAxiosInstance from '../../features/AxiosInstance';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setSelectedItem } from '../../features/SharedDataSlice/SharedData';

const PopUp = ({ time, distance, id }) => {
  const dispatch = useDispatch();
  const instance = createAxiosInstance();
  const markAsCompleted = async (id) => {
    const body = {
      id: parseInt(id),
    };
    instance.patch('/jobs/manage-job', body).then((response) => {
      toast.success('Job completed successfully');
      dispatch(setSelectedItem('Dashboard'));
    });
  };
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
      <div className="popup-container">
        <div>
          <p className="font-bold font-cursive text-18">Route Information</p>
        </div>
        <div className="flex items-center gap-5 mb-3">
          <p className="text-15">Distance: {distance}</p>
          <p className="text-15">Time: {time}</p>
          <div className="center">
            <button
              className="px-3 py-2 bg-[#207855] text-white rounded-md  outline-none"
              onClick={() => markAsCompleted(id)}
            >
              Mark as Completed
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PopUp;
