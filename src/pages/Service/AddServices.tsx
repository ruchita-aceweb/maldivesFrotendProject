import { useState, useEffect,ChangeEvent } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../css/AddService.css";
import { TiTick } from "react-icons/ti";
import { IoMdArrowRoundBack } from "react-icons/io";




const AddServices = () => {
 
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
const [vechicle_type, setVechicleType]= useState('');
const [permission, setPermission] = useState(false);
const [road_worthiness, setRoadWorthiness] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [showcontent, setContent] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [selectVisible,setSelectVisible] = useState(true);

  
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
  const backServices = async (event: React.FormEvent) => { 
    event.preventDefault();
    navigate('/service')

  }
  // const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = event.target.value;
   
   
  //   if(value.length>0){
  //     setShow(true)
  //     setServiceType(event.target.value)
     
         
  //   }else{
  //     setShow(false)
  //   }
   
  // };
  const handleSelectChange = () => {
    setShow(true);
    setServiceType('');
    setSelectVisible(false);
  };
  

  
  
  const uploadfiles = () => {
      setContent(true);
      setVechicleType('');
      setButtonVisible(false);
      
  };
  const handlebackbutton = () => {
    setShow(false);;
    setSelectVisible(true);
 
  }
  const backbuttonhandle = () => {
    setContent(false);
    setButtonVisible(true);

  }
  
 
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
      formData.append('vechicle_type', vechicle_type);
      formData.append('data', JSON.stringify(data));

      try {
        await axios.post(`${apiUrl}user/images/upload`, formData, requestConfig);
        toast.success("New Service Request Added", { theme: 'colored' });
        setValues(initialFValues);
        setSelectedFileNewOwner(null);
        setSelectedFileCurrentOwner(null);
        setSelectedFileNewRegistry(null);
        setShow(false);
        setContent(false);
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
    setContent(false);
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
  const steps = ["", "", ""];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  const handleNext = () => {
    setCurrentStep((prev) => (prev === steps.length ? prev : prev + 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => (prev === 1 ? prev : prev - 1));
  };

  
  
  return (
    <>
   {!permission && <h2>No Access For You.!</h2>}
   {permission && 
    <div>
  
  
  <div className="flex justify-between mb-4  rounded-sm border border-stroke bg-white px-5 py-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 ">
    <h1 className="text-xl text-black font-bold"> Service </h1>
    <button className="flex font-medium w-30 text-xs mt-auto justify-center rounded-full bg-danger px-1 py-1 pr-2  text-white "onClick={backServices}>
    <span className="mt-0.5 text-white  "><IoMdArrowRoundBack /></span> Back to Product
    </button>
  </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
      
      
        <div className="flex justify-between">
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && "active"} ${
              (i + 1 < currentStep || complete) && "complete"
            } `}
          >
            <div className="step">
              {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-gray-500">{step}</p>
          </div>
        ))}
      </div>
      {/* <div className="flex justify-between mt-4">
        <button className="btn" onClick={handlePrevious} disabled={currentStep === 1}>
          Previous
        </button>
      
          <button className="btn" onClick={() => currentStep === steps.length ? setComplete(true) : handleNext()}>
            {currentStep === steps.length ? "Finish" : "Next"}
          </button>
        
      </div> */}
        </div>
        {selectVisible && (
        <div className="flex flex-col gap-5.5 p-6.5">
          <h6 className="font-bold text-black dark:text-white text-center">
          New Services Requests
          </h6>

          {road_worthiness &&  
           <div >
             
          
              <div>
           <label className="mb-3 text-sm block text-black dark:text-white">
             Service Type
           </label>
           <select onClick={() => currentStep === steps.length ? setComplete(true) : handleNext()}
  

  id="gender" 
  name="service_type"
  value={service_type}
  onChange={handleSelectChange}
  className="w-full text-sm rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
>  {currentStep === steps.length ? "" : ""}
  <option value="" disabled hidden>Select a service</option>
  <option value="Marine Vehicle Registry">Marine Vehicle Registry</option>
  <option value="Road Worthiness">Road Worthiness</option>
  <option value="Hull Number">Hull Number</option>
  <option value="Land Vehicle Registry">Land Vehicle Registry</option>
</select>

<div className="flex justify-end" onClick={() => currentStep === steps.length ? setComplete(true) : handleNext()}>
  {currentStep === steps.length ? "" : ""} 
  <button
    className={` ${service_type ? '' : 'cursor-not-allowed'}`}
    onClick={service_type ? handleSelectChange : undefined}
    disabled={!service_type}
  >
    
  </button>
</div>

           </div>
          
        
           </div>

      
      }

{!road_worthiness &&
           <div>
           <label className="mb-3 block text-black dark:text-white">
             Service Type
           </label>
           <select
             id="gender" 
             name="service_type" value={service_type} onChange={handleSelectChange}
             className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
             required >
             <option value="" selected>Select a service</option>
             <option value="Marine Vehicle Registry">Marine Vehicle Registry</option>
             {/* <option value="Road Worthiness">Road Worthiness</option> */}
             <option value="Hull Number">Hull Number</option>
             <option value="Land Vehicle Registry">Land Vehicle Registry</option>
           </select>

         </div>
      }
          

         
          <div>

          </div>
        
        </div>
          )}
  {show &&
   <div >
     {buttonVisible && (
   <div className="flex flex-col gap-5.5 p-6.5 vechicleinfoblock">
     <h6 className="font-bold text-center text-black dark:text-white">
       Vehicle Information
     </h6>
     <div className="flex  gap-5 ">
  <div className="flex-col ">
    <label className="mb-3 block text-sm text-black dark:text-white">
      Vehicle Number
    </label>
    <input
      name="vehicle_number" value={values.vehicle_number} onChange={handleInputChange}
      type="text"
      placeholder="Vehicle Number"
      className="w-full text-sm rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11  outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
    />
  </div>
  <div className="flex-col">
    <label className="mb-3 text-sm block text-black dark:text-white">
      Vehicle Type
    </label>
    <input
      type="text"
      name="vehicle_type" value={values.vehicle_type} onChange={handleInputChange}
      placeholder="Vehicle Type"
      className="w-full text-sm rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11  outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
    />
  </div>
  <div className="flex-col">
    <label className="mb-3 text-sm block text-black dark:text-white">
      Model
    </label>
    <input
      type="text"
      placeholder="Model"
      name="model" value={values.model} onChange={handleInputChange}
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
    />
  </div>
  <div className="flex-col">
    <label className="mb-3 text-sm block text-black dark:text-white">
      Engine Serial No
    </label>
    <input
      type="text"
      placeholder="Engine Serial No"
      name="engine_serial_no" value={values.engine_serial_no} onChange={handleInputChange}
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
    />
  </div>
</div>

<div className="flex justify-end gap-2" onClick={() => currentStep === steps.length ? setComplete(true) : handleNext()}>
  {currentStep === steps.length ? "" : ""}
  <div>
    <button className="p-1 bg-danger font-medium text-white text-sm text-center w-25 rounded-full" 
onClick={handlebackbutton}>Back</button>
  </div>
  <div>
  <button
  onClick={uploadfiles}
  className={`p-1 text-sm text-center w-25 font-medium rounded-full ${
    values.vehicle_number && values.vehicle_type && values.model && values.engine_serial_no
      ? 'bg-success text-white cursor-pointer'
      : 'bg-grey text-white cursor-not-allowed'
  }`}
  disabled={!values.vehicle_number || !values.vehicle_type || !values.model || !values.engine_serial_no}
>
  Next
</button>

  </div>
  
</div>

   </div>
 )}
   </div>

}
{showcontent &&
  <div>
  <h6 className="font-bold text-center mt-6 mb-4 text-black dark:text-white">
    Upload   Vehicle Information
     </h6>
   <div className="flex flex-row gap-5.5 px-4 pt-6"  onClick={() => currentStep === steps.length ? setComplete(true) : handleNext()}>
  
    {currentStep === steps.length ? "" : ""}
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
         accept="*/*"
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

     <div
       id="FileUpload"
       className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
     >
       {selectedFilesRegistry  &&
        <h1>{selectedFilesRegistry.name}</h1>
      }
       
       <input
         type="file"
         onChange={handleFileChangeVehicalCopy} 
         accept="*/*"
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
         <p className="mt-1.5 text-warning"> Vehicle Registry Copy </p>
         {/* <p>(max, 800 X 800px)</p> */}
       </div>

     </div>

     <div
       id="FileUpload"
       className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
     >
       {selectedFilesCurrentOwner &&
        <h1>{selectedFilesCurrentOwner.name}</h1>
      }
      
       <input
         type="file"
         onChange={handleFileChangeCurrentOwner}
         accept="*/*"
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
         <p className="mt-1.5 text-success">ID Copy of Current Owner</p>

         {/* <p>(max, 800 X 800px)</p> */}
       </div>

     </div>


   </div>
  </div>
    }
      

     {showcontent && 
       <div className="flex justify-end px-4 pb-4 gap-2 ">
       {/* <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white mb-4" onClick={handleEditSubmit}>
         SUBMIT
       </button> */}
       <div>
       <div>
    <button  className="p-1 bg-danger text-sm 
     text-white text-center w-25 rounded-full font-medium" onClick={ backbuttonhandle } >Back</button>
  </div>
       </div>
        {/* <div>
       <button className="flex w-25 justify-center rounded-lg bg-primary p-1 font-medium text-white mb-3" onClick={clearData}  >
         Clear
       </button>
       </div> */}
       <div>
        <button
                                       className={`flex w-25 text-sm font-medium mb-3 justify-center rounded-full  p-1  text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-success'}`}
                                     
                                    
                                        onClick={handleEditSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? <div style={spinnerStyle} /> : 'Submit'}
                                    </button>
                                    </div>
        {/* <button
        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white mb-4"
        style={{
          flex: '1',
          justifyContent: 'center',
          borderRadius: '8px',
          padding: '12px',
          fontWeight: 'medium',
          color: 'white',
          backgroundColor: loading ? '#808080' : 'blue',  // Adjust colors as needed
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
        onClick={handleEditSubmit}
        disabled={loading}
      >
        {loading ? 'SUBMITTING...' : 'SUBMIT'}
      </button> */}

       </div>
     }
     <ToastContainer/>
    </div>
    </div> 
   }
     
     

    </>
  )
}

export default AddServices;