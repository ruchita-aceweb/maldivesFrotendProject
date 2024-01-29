import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { GrView } from "react-icons/gr";

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
    const addServices = async (event: React.FormEvent) => {
        event.preventDefault();
        navigate('/add/service')
       
      }
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
        const token= localStorage.getItem('token');
    if( (token=== null)){
       navigate('/auth/signin') 
    }
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
                
                            <div className="flex justify-between mb-4  rounded-sm border border-stroke bg-white px-5 py-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 ">
    <h1 className="text-xl text-black font-bold">Service Request</h1>
    <button className="flex font-medium w-30 text-xs mt-auto justify-center rounded-full bg-danger px-1 py-1 pr-2  text-white " onClick={addServices}>
    <span className="mt-0.5 text-white  "><IoMdAdd /></span> Add Product 
    </button>
  </div>
                     <div className="flex flex-col">

                            <div className="mb-1 rounded-sm border border-stroke bg-white px-5 pt-3 pb-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-3">
                                <div className="max-w-full overflow-x-auto">
                                    <h4 className="text-lg font-semibold text-black dark:text-white">
                                        View Requests
                                    </h4>
                                    </div>
                                    </div>
                                    <div className="rounded-sm border border-stroke bg-white px-3 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-3 xl:pb-1">
                                    <div className="max-w-full overflow-x-auto">
<table className="w-full table-auto">
<thead>
<tr className="bg-gray-2 text-left dark:bg-meta-4">
 <th className="min-w-[50px] py-3 px-2 font-medium text-black dark:text-white">
   #
 </th>
 <th className="min-w-[100px] py-3 px-4 font-medium text-black dark:text-white">
 Email
 </th>
 <th className="min-w-[100px] py-3 px-4 font-medium text-black dark:text-white">
 Name
 </th>
 <th className="min-w-[100px] py-3 px-4 font-medium text-black dark:text-white">
 Phone Number
 </th>
 <th className="min-w-[170px] py-3 px-4 font-medium text-black dark:text-white">
 Service Type
 </th>
 <th className="min-w-[100px] py-3 px-4 font-medium text-black dark:text-white">
 Created At
 </th>
 <th className="py-4 px-4 text-right font-medium text-black dark:text-white">
   Actions
 </th>
</tr>
</thead>
<tbody>
{requestsFilter.map((item,index) => (
 <tr key={item.id}>
    <td className="border-b text-sm border-[#eee] py-2 px-4 dark:border-strokedark"> <p className="text-black dark:text-white">{index + 1}</p></td>
   <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
     <p className="text-black dark:text-white">{item.email}</p>
   </td>
   <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
     <p className="text-black dark:text-white">{item.name}</p>
   </td>
   <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
     <p className="text-black dark:text-white">{item.phone_number}</p>
   </td>
   <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
     <p className="text-black dark:text-white">{item.service_type}</p>
   </td>
   <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
     <p className="text-black dark:text-white">{item.created_at}</p>
   </td>
   <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
     <div className="flex justify-end text-sm items-center space-x-3.5">
       <button className="text-xs px-3 py-1" onClick={() => ViewMoreModalOpen(item.id, item.user_id)}>
      {/* view More */}<GrView />
       </button>
     
     </div>
   </td>
 </tr>
))}
</tbody>
</table>
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