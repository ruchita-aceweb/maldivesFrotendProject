import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import axios from 'axios'
const ServiceRequests = () => {
    const apiUrl = 'http://localhost:3005/';
    const navigate = useNavigate();
    
    const [requests, setRequests] = useState<any[]>([])
    const [requestsFilter, setRequestsFilter] = useState<any[]>([])
    const [permission, setPermission] = useState<boolean>(false);
    const [service, setService] = useState<boolean>(false);
    const requestConfig = {
        headers: {
            'token': localStorage.getItem('token'),
            'uu_id': localStorage.getItem('uuID'),
           

        }
    }
   
    const ViewMoreModalOpen = async (id: any,user_id:any) => {
       
        navigate(`/view/more/${id}`)

    };
    const getUserPermissions = async () => {
        await axios.get(`${apiUrl}user/permissions`, requestConfig).then(response => {
            for (let i = 0; i < response.data.user_permissions.length; i++) {
                if (response.data.user_permissions[i].Name == "admin") {
                    setPermission(response.data.user_permissions[i].Value)
                    setService(response.data.user_permissions[i].Value)
                    
                    const request = {
                        headers: {
                            'token': localStorage.getItem('token'),
                            'uu_id': localStorage.getItem('uuID'),
                            'admin_type':response.data.user_permissions[i].Value
                           
                
                        }
                    }
                     axios.get(`${apiUrl}user/request/list`, request).then(response => {
                        console.log(response.data.services)
                        console.log((response.data.services).reverse())
                       setRequestsFilter((response.data.services).reverse())
                        setRequests((response.data.services).reverse())
                    }).catch(error => {
                        toast.error(error.response.data.error, { theme: 'colored' })
                    })
                }
                if(response.data.user_permissions[i].Name=="service"){
                    setService(response.data.user_permissions[i].Value)
                    if(!response.data.user_permissions[i].Value){
                        setService(false)
                    }
                 }



            }
        }).catch(error => {
            console.log(error)
        })


    }
    useEffect(() => {
        getUserPermissions()
       // getRequests();

    }, [])
    return (
        <>
         {!service && <h2>No Access For You.!</h2>}
         {service && 
         <div>
            <div>
                <div>
                    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                            Services Requests
                        </h4>
                        <div className="flex mb-2.5 flex-col gap-8 xl:flex-row">
                            {/* <div className="flex-1">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Search User Name Or email
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"

                                        placeholder="Search Username Name or Email"
                                        className="flex-1 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />

                                </div>
                            </div> */}


                        </div>
                     <div className="flex flex-col">

                            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                                <div className="max-w-full overflow-x-auto">
                                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                                        View Requests
                                    </h4>
                                    <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                                           
                                            <div className="col-span-0.3 flex items-center">
                                                <p className="font-medium">#</p>
                                            </div>
                                            <div className="col-span-2 flex items-center">
                                                <p className="font-medium">Email</p>
                                            </div>
                                            <div className="col-span-1 hidden items-center sm:flex">
                                                <p className="font-medium">Name</p>
                                            </div>
                                            <div className="col-span-1 hidden items-center sm:flex">
                                                <p className="font-medium">Phone Number</p>
                                            </div>
                                            <div className="col-span-1 flex items-center">
                                                <p className="font-medium">Service Type</p>
                                            </div>
                                            

                                            <div className="col-span-1 flex items-center">
                                                <p className="font-medium">Created At</p>
                                            </div>
                                            <div className="col-span-1 flex items-center">
                                                <p className="font-medium">Actions</p>
                                            </div>
                                        </div>

                                    {requestsFilter.map((item, index) => {
                                        return (
                                            <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5" key={index}>

                                                <div className="col-span-1 flex items-center">

                                                <div className="col-span-0.3 hidden items-center sm:flex">
                                                    <p className="text-sm text-black dark:text-white"> {index+1}</p>
                                                </div>
                                                {/* <div className="col-span-1 hidden items-center sm:flex">
                                                    <p className="text-sm text-black dark:text-white">{item.service_type}</p>
                                                </div> */}
                                                   
                                                </div>

                                                <div className="col-span-2 hidden items-center sm:flex">
                                                    <p className="text-sm text-black dark:text-white">{item.email}</p>
                                                </div>


                                                <div className="col-span-1 hidden items-center sm:flex">
                                                    <p className="text-sm text-black dark:text-white">{item.name}</p>
                                                </div>
                                                <div className="col-span-1 flex items-center">
                                                    <p className="text-sm text-black dark:text-white">{item.phone_number}</p>
                                                </div>
                                               
                                                <div className="col-span-1 flex items-center">
                                                    <p className="text-sm text-black dark:text-white">{item.service_type}</p>
                                                </div>
                                                <div className="col-span-1 flex items-center">
                                                    <p className="text-sm text-meta-3">{item.created_at}</p>
                                                </div>
                                                <div className="col-span-1 flex items-center">
                                                    <p className="text-sm text-meta-3"><button  onClick={() => ViewMoreModalOpen(item.id, item.user_id)}>View More</button></p>
                                                </div>
                                            </div>


                                        );

                                    })}

                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <div>
            
            </div>
         </div>
         }
            
        </>
    )
}

export default ServiceRequests;