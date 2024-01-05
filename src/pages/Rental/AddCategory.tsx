

import { useState, useEffect,ChangeEvent } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate ,useParams } from 'react-router-dom';
import axios from 'axios'


interface FormValues {
    id: number | undefined;
    property_type: string;
    property_category: string;
    
  }
const AddCategory = () => {
 
    const { id } = useParams<{ id: string }>();
// const initialFValues = {
//   id: 0,
//   property_type: "",
//   property_category: "", 
// }

// const [values, setValues] = useState(initialFValues); 
const initialFValues: FormValues = {
    id: undefined,
    property_type: "",
    property_category: "",
  };

  const [values, setValues] = useState<FormValues>(initialFValues);
const [loading, setLoading] = useState(false);

const [permission, setPermission] = useState(false);

  const [show, setShow] = useState(false);
  
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

  const navigate = useNavigate();
  const backSRental = async (event: React.FormEvent) => { 
    event.preventDefault();
    navigate('/category')

  }
  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const clearData  = async (event: React.FormEvent) =>{
    event.preventDefault();
    setValues(initialFValues)
    setShow(false)
   

  }
 
  
  
  
  const getUserPermissions = async () => {
    await axios.get(`${apiUrl}user/permissions`, requestConfig).then(response => {
     for(let i=0;i<response.data.user_permissions.length;i++){
        //  if(response.data.user_permissions[i].Name=="rental_property"){
        //     setPermission(response.data.user_permissions[i].Value)
        //    if(!response.data.user_permissions[i].Value){
        //     setPermission(false)
        //    }
        //   }
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
  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

   if (values.property_type === "") {
      toast.error("Please select the property type", { theme: 'colored' });
    } else if (values.property_category === "") {
      toast.error("Please select the vproperty category", { theme: 'colored' });
    } else {
      setLoading(true);
     
    const formData: FormValues = {
        property_type: values.property_type,
        property_category: values.property_category,
        id: values.id !== undefined ? values.id : 0,
      };
      console.log(formData)
    
      try {
        await axios.post(`${apiUrl}admin/add/rentals`, formData, requestConfig);
        toast.success("New category Added", { theme: 'colored' });
        setValues(initialFValues);
        setShow(false);
        navigate('/category')
      } 
      catch (error) {
        if (axios.isAxiosError(error)) {
           if (error.response && error.response.data) {
           
            toast.error(error.response.data.error, { theme: 'colored' });
          } else {
            console.log("Unexpected error format");
          }
        } else {
          console.log("Non-Axios error");
        }
      }
      finally {
        setLoading(false);
      }
    }
  };
  const getEditCatergory = async () => {
    if (id != null) {
      await axios.get(`${apiUrl}admin/rental/${id}`, requestConfig).then(response => {
        setValues((prevValues) => ({
          ...prevValues,
          property_type: response.data.property.property_type,
          property_category: response.data.property.property_category,
          id: response.data.property.id,
          

        }));

       
      }).catch(error => {
        console.log(error)
      })
    }



  }

  useEffect(() => {
    const token= localStorage.getItem('token');
    if( (token=== null)){
       navigate('/auth/signin') 
    }
    getUserPermissions()
    getEditCatergory()
   
   

  }, [])
  
  return (
    <>
   {!permission && <h2>No Access For You.!</h2>}
   {permission && 
    <div>
       <div className="w-full xl:w-1/4">
        <label className="mb-2.5 block text-black dark:text-white">
          Add Category
        </label>
        <button className="flex w-full justify-center rounded bg-danger p-3 font-medium text-white mb-4" onClick={backSRental}>
          Back Category
        </button>


      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            New Category
          </h3>
        </div>
        

   <div>
   <div className="flex flex-col gap-5.5 p-6.5">
  {/* <h6 className="font-medium text-black dark:text-white">Vehicle Information</h6> */}
  <div className="flex gap-5.5">
    <div className="flex-col w-full">
      <label className="mb-3 block text-black dark:text-white">Property Type</label>
      <input
        name="property_type"
        value={values.property_type}
        onChange={handleInputChange}
        type="text"
        placeholder="Property Type"
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
    </div>
    <div className="flex-col w-full">
      <label className="mb-3 block text-black dark:text-white">Rent Frequency</label>
      <input
        type="text"
        name="property_category"
        value={values.property_category}
        onChange={handleInputChange}
        placeholder="Property Category"
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
    </div>
   
  </div>
</div>


   </div>

   
  </div> 

     {!show && 
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

export default AddCategory;