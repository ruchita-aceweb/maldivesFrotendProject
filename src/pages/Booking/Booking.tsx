import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const Booking = () => {
    const navigate = useNavigate();
    const addBooking = async (event: React.FormEvent) => {
        event.preventDefault();
        navigate('/add/booking')
       
      }
    return (
        <>
        <div>
        <div className="w-full xl:w-1/4">
              <label className="mb-2.5 block text-black dark:text-white">
                Booking
              </label>
              <button className="flex w-full justify-center rounded bg-danger p-3 font-medium text-white mb-4"  onClick={addBooking}>
              ADD BOOKING
              </button>
            </div>
        </div>
        <ToastContainer />
        </>
        
)
}
export default Booking;
