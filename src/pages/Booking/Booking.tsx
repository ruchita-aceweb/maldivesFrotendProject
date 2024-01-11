import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const Booking = () => {
    const navigate = useNavigate();
    const [booking, setBooking] = useState<any[]>([])
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
      const getBooking = async () => {
        await axios.get(`${apiUrl}user/view/bookings`, requestConfig).then(response => {
            console.log(response.data.booking)
            setBooking(response.data.booking.reverse())
    
        }).catch(error => {
          toast.error(error.response.data.error, { theme: 'colored' })
        })
    
    
      }
       useEffect(() => {
        const token = localStorage.getItem('token');
        if ((token === null)) {
            navigate('/auth/signin')
        }
        getBooking()
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
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                     #
                    </th>

                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Property 
                    </th>

                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Type
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Caregory
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Adults
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Kids
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Start Date
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      End Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {booking.map((item, index) => {
                    return (

                      <tr>
                        <td className="py-5 px-4">
                          <p className="text-black dark:text-white">{index+1}</p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-black dark:text-white">{item.title}</p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                            {item.type}
                          </p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                            {item.caregory}
                          </p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                            {item.adults}
                          </p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                            {item.kids}
                          </p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                            {item.start_date}
                          </p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                            {item.end_date}
                          </p>
                        </td>
                      </tr>
                    );
                  })}


                </tbody>
              </table>
            </div>
            <ToastContainer />
          </div>
        </div>
        <ToastContainer />
        </>
        
)
}
export default Booking;
