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
      const apiUrl = 'http://localhost:3005/';
      const requestConfig = {
          headers: {
              'token': localStorage.getItem('token'),
              'uu_id': localStorage.getItem('uuID')
  
          }
      }
    //   const getUsers = async () => {
       
    //     await axios.get(`${apiUrl}user/add/booking`, requestConfig).then(response => {
    //         console.log(response.data)
    //     }).catch(error => {
    //         toast.error(error.response.data.error, { theme: 'colored' })
    //     })

    // }
      useEffect(() => {
        const token = localStorage.getItem('token');
        if ((token === null)) {
            navigate('/auth/signin')
        }
       // getUsers();
        

    }, [])
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
