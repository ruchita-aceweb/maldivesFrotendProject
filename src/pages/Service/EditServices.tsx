import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import { IoMdArrowRoundBack } from "react-icons/io";
const EditServices = () => {
    const navigate = useNavigate();
    const [permission, setPermission] = useState(false);
    const backServices = async (event: React.FormEvent) => {
        event.preventDefault();
        navigate('/service')
       
      }
      const apiUrl = 'http://localhost:3005/';
      const requestConfig = {
        headers: {
          'token': localStorage.getItem('token'),
          'uu_id': localStorage.getItem('uuID')
    
        }
      }
      const getUserPermissions = async () => {
        await axios.get(`${apiUrl}user/permissions`, requestConfig).then(response => {
         for(let i=0;i<response.data.user_permissions.length;i++){
             if(response.data.user_permissions[i].Name=="service"){
                setPermission(response.data.user_permissions[i].Value)
               if(!response.data.user_permissions[i].Value){
                setPermission(false)
               }
              }
              if(response.data.user_permissions[i].Name=="admin"){
                setPermission(response.data.user_permissions[i].Value)
               if(!response.data.user_permissions[i].Value){
                setPermission(false)
               }
              }
              
             
    
          }
       }).catch(error => {
         console.log(error)
        })
    
    
      }
      useEffect(() => {
        const token= localStorage.getItem('token');
    if( (token=== null)){
       navigate('/auth/signin') 
    }
        getUserPermissions()
    
    
      }, [])
      
    return (
        <>
  {!permission && <h2>No Access For You.!</h2>}
  {permission && 
  <div>
  
            <div className="flex justify-between mb-4  rounded-sm border border-stroke bg-white px-5 py-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 ">
    <h1 className="text-xl text-black font-bold"> Service </h1>
    <button className="flex font-medium w-30 text-xs mt-auto justify-center rounded-full bg-danger px-1 py-1 pr-2  text-white "onClick={backServices}>
    <span className="mt-0.5 text-white  "><IoMdArrowRoundBack /></span>  Back to Service
    </button>
  </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-xl text-black dark:text-white">
                Input Fields
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 px-6.5 pt-6.5">
              <div>
                <label className="mb-3 block text-black text-sm dark:text-white">
                  Default Input
                </label>
                <input
                  type="text"
                  placeholder="Default Input"
                  className="w-full rounded-lg border-[1.5px] text-sm border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black text-sm dark:text-white">
                  Active Input
                </label>
                <input
                  type="text"
                  placeholder="Active Input"
                  className="w-full rounded-lg text-sm border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                />
              </div>

              <div>
              
              </div>
            </div>
        
          <div className='flex justify-end gap-2 px-5'>
            <div>
          <button className="flex text-sm w-20 justify-center rounded-full bg-warning p-2 font-medium text-white mb-4">
                  Edit
                </button>
                </div>
                <div>
               
                <button className="flex text-sm w-20 justify-center rounded-full bg-secondary p-2 font-medium text-white mb-4"  >
                  Clear
                </button>
                </div>
                </div>
  </div>
  </div>
  }
            
                
        </>
    )
}

export default EditServices;