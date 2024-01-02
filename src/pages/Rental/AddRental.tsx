import { useState, useEffect,ChangeEvent } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'



const AddRental = () => {
 
  const initialImagesUrl = {
    imag_1: "",
    imag_2: "",
    imag_3: ""
} 
const initialFValues = {
  id: 0,
  service_type: "",
  vehicle_type: "",
  model:"",
  vehicle_number:"",
  engine_serial_no:""
}

const [values, setValues] = useState(initialFValues); 
const [loading, setLoading] = useState(false);

const [imag_urls, setImgUrls] = useState(initialImagesUrl);
const [service_type, setServiceType] = useState('');
const [permission, setPermission] = useState(false);
const [road_worthiness, setRoadWorthiness] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [imag_1, setImag_1] = useState(false);
  const [imag_2, setImag_2] = useState(false);
  const [imag_3, setImag_3] = useState(false);
  const apiUrl = 'http://localhost:3005/';
  const requestConfig = {
    headers: {
      'token': localStorage.getItem('token'),
      'uu_id': localStorage.getItem('uuID')

    }
  }
  const spinnerStyle = {
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTop: '4px solid #ffffff',
    width: '20px',
    height: '20px',
    animation: 'spin 1s linear infinite',
};
  const [selectedFilesNewOwner, setSelectedFileNewOwner] = useState<File | null>(null); 
  const [selectedFilesCurrentOwner, setSelectedFileCurrentOwner] = useState<File | null>(null);
  const [selectedFilesRegistry, setSelectedFileNewRegistry] = useState<File | null>(null);
  const navigate = useNavigate();
  const backSRental = async (event: React.FormEvent) => { 
    event.preventDefault();
    navigate('/rental')

  }
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
   
    if(value.length>0){
      setShow(true)
      setServiceType(event.target.value)
    }else{
      setShow(false)
    }
   
  };
  const handleFileChangeNewOwner = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files[0].name)
      setSelectedFileNewOwner(e.target.files[0]) 
      
    }
    
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleFileChangeCurrentOwner = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files[0])
      setSelectedFileCurrentOwner(e.target.files[0]) 
     
      
    }
    
  };
  const handleFileChangeVehicalCopy = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files[0])
      setSelectedFileNewRegistry(e.target.files[0])
      
    }
    
  };
  const getDocuments = async () => {
    await axios.get(`${apiUrl}user/upload/list`, requestConfig).then(response => {
        console.log(response)
    
    }).catch(error => {
      toast.error(error.response.data.error, { theme: 'colored' })
    })


  }
  
  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFilesNewOwner || !selectedFilesRegistry || !selectedFilesCurrentOwner) {
      toast.error("Please upload the documents", { theme: 'colored' });
      return;
    } else if (service_type === "") {
      toast.error("Please select the service type", { theme: 'colored' });
    } else if (values.vehicle_type === "") {
      toast.error("Please select the vehicle type", { theme: 'colored' });
    } else if (values.vehicle_number === "") {
      toast.error("Please select the vehicle number", { theme: 'colored' });
    } else if (values.model === "") {
      toast.error("Please select the model", { theme: 'colored' });
    } else if (values.engine_serial_no === "") {
      toast.error("Please select the engine serial number", { theme: 'colored' });
    } else {
      setLoading(true);
     // toast.success("Processing...", { theme: 'colored' });

      var data = [{
        vehicle_type: values.vehicle_type,
        vehicle_number: values.vehicle_number,
        model: values.model,
        engine_serial_no: values.engine_serial_no,
      }];

      const formData = new FormData();
      formData.append('type', String('vehicle_registry_copy'));
      formData.append('uu_id', String(requestConfig.headers.uu_id));
      formData.append('file_1', selectedFilesNewOwner);
      formData.append('file_2', selectedFilesRegistry);
      formData.append('file_3', selectedFilesCurrentOwner);
      formData.append('service_type', service_type);
      formData.append('data', JSON.stringify(data));

      try {
        await axios.post(`${apiUrl}user/images/upload`, formData, requestConfig);
        toast.success("New Service Request Added", { theme: 'colored' });
        setValues(initialFValues);
        setSelectedFileNewOwner(null);
        setSelectedFileCurrentOwner(null);
        setSelectedFileNewRegistry(null);
        setShow(false);
      } catch (error) {
        console.log("Error")
      } finally {
        setLoading(false);
      }
    }
  };

  const clearData  = async (event: React.FormEvent) =>{
    event.preventDefault();
    setValues(initialFValues)
    setShow(false)
    setSelectedFileNewOwner(null)
    setSelectedFileCurrentOwner(null)
    setSelectedFileNewRegistry(null)

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
          
          if(response.data.user_permissions[i].Name=="road_worthiness"){
            setRoadWorthiness(response.data.user_permissions[i].Value)
           if(!response.data.user_permissions[i].Value){
            setRoadWorthiness(false)
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
    getDocuments();

  }, [])
  
  return (
    <>
   {!permission && <h2>No Access For You.!</h2>}
   {permission && 
    <div>
       <div className="w-full xl:w-1/4">
        <label className="mb-2.5 block text-black dark:text-white">
          Add Rental Property
        </label>
        <button className="flex w-full justify-center rounded bg-danger p-3 font-medium text-white mb-4" onClick={backSRental}>
          BACK RENTAL
        </button>


      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            New Rental Property
          </h3>
        </div>
        

   <div>
   <div className="flex flex-col gap-5.5 p-6.5">
  {/* <h6 className="font-medium text-black dark:text-white">Vehicle Information</h6> */}
  <div className="flex gap-5.5">
    <div className="flex-col w-full">
      <label className="mb-3 block text-black dark:text-white">Title</label>
      <input
        name="vehicle_number"
        value={values.vehicle_number}
        onChange={handleInputChange}
        type="text"
        placeholder="Title"
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
    </div>
    <div className="flex-col w-full">
      <label className="mb-3 block text-black dark:text-white">Rent Frequency</label>
      <input
        type="text"
        name="vehicle_type"
        value={values.vehicle_type}
        onChange={handleInputChange}
        placeholder="Rent Frequency"
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
    </div>
    <div className="flex-col w-full">
      <label className="mb-3 block text-black dark:text-white">Rent</label>
      <input
        type="text"
        placeholder="Rent"
        name="model"
        value={values.model}
        onChange={handleInputChange}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
    </div>
  </div>
</div>

<div className="flex flex-col gap-5.5 p-6.5">
  
  <div className="flex gap-5.5">
    <div className="flex-col w-full">
      <label className="mb-3 block text-black dark:text-white">Property Type</label>
      <input
        name="vehicle_number"
        value={values.vehicle_number}
        onChange={handleInputChange}
        type="text"
        placeholder="Property Type"
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
    </div>
    <div className="flex-col w-full">
      <label className="mb-3 block text-black dark:text-white">Property Category</label>
      <input
        type="text"
        name="vehicle_type"
        value={values.vehicle_type}
        onChange={handleInputChange}
        placeholder="Property Category"
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
    </div>
    <div
       id="FileUpload"
       className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
     >
      {selectedFilesNewOwner &&
        <h1>{selectedFilesNewOwner.name}</h1>
      }
     
      
     
       <input
         type="file"
         onChange={handleFileChangeNewOwner}
         accept="image/*"
         id="file-input"
         className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
       />
       <div className="flex flex-col items-center justify-center space-y-3">
         <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
           <svg
             width="16"
             height="16"
             viewBox="0 0 16 16"
             fill="none"
             xmlns="http://www.w3.org/2000/svg"
           >
             <path
               fillRule="evenodd"
               clipRule="evenodd"
               d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
               fill="#3C50E0"
             />
             <path
               fillRule="evenodd"
               clipRule="evenodd"
               d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
               fill="#3C50E0"
             />
             <path
               fillRule="evenodd"
               clipRule="evenodd"
               d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
               fill="#3C50E0"
             />
           </svg>
         </span>
         <p>
           <span className="text-primary">Click to upload</span> or
           drag and drop
         </p>
         <p className="mt-1.5 text-danger"> ID Copy of New Owner </p>
         {/* <p>(max, 800 X 800px)</p> */}
       </div>

     </div>
  </div>
</div>


   <div className="flex flex-row gap-5.5 p-6.5">
   
     


   </div>
   </div>

   
  </div> 

     {show && 
       <div>
       
        <button
                                       className={`flex w-full mb-3 justify-center rounded p-3 font-medium text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black'}`}
                                     
                                        style={{
                                            flex: '1',
                                            marginBottom: '3px',
                                            justifyContent: 'center',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            fontWeight: 'medium',
                                            color: 'white',
                                            backgroundColor: loading ? '#808080' : 'black',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                        }}
                                        onClick={handleEditSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? <div style={spinnerStyle} /> : 'SUBMIT'}
                                    </button>
      
       <button className="flex w-full justify-center rounded bg-secondary p-3 font-medium text-white mb-4" onClick={clearData}  >
         Clear
       </button>
       </div>
     }
     <ToastContainer/>
    </div>
   }
     
     

    </>
  )
}

export default AddRental;