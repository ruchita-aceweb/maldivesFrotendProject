import { useState, useEffect, ChangeEvent } from "react";
//import { ToastContainer, toast } from 'react-toastify';
import { toast ,ToastContainer} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'



const AddRental = () => {

  const { id } = useParams<{ id: string }>();
  const initialFValues = {
    id: 0,
    title: "",
    rent_frequency: "",
    rate: "",
    image: ""


  }

  const [values, setValues] = useState(initialFValues);
  const [loading, setLoading] = useState(false);
  const [imageShow, setImageShow] = useState(false);

  
  const [type, setType] = useState('');
  const [rental, setRental] = useState<any[]>([])
  const [category, setCategory] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [permission, setPermission] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedFilesNewOwner, setSelectedFileNewOwner] = useState<File | null>(null);


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
  const handleSelectChangeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value.length > 0) {

      setType(event.target.value)
    }
  }
  const handleSelectChangeCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value.length > 0) {

      setCategory(event.target.value)
    }

  };

  const navigate = useNavigate();
  const backSRental = async (event: React.FormEvent) => {
    event.preventDefault();
    navigate('/rental')

  }

  
  const handleFileChangeNewOwner = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log(selectedFile);
  
      setSelectedFileNewOwner(selectedFile);
  
      if (selectedFile) {
        setValues((prevValues) => ({ ...prevValues, image: URL.createObjectURL(selectedFile) }));
        setImageShow(true)
       
      }
    }
   
  };
 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const getAdminRentals = async () => {
    await axios.get(`${apiUrl}user/property/details`, requestConfig).then(response => {
      setRental(response.data.admin_property.reverse())
    }).catch(error => {
      toast.error(error.response.data.error, { theme: 'colored' })
    })


  }

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFilesNewOwner) {
      toast.error("Please upload the documents", { theme: 'colored' });
      return;
    } else if (values.title === "") {
      toast.error("Please file the title", { theme: 'colored' });
    }
    else if (type === "") {
      toast.error("Please select the property type", { theme: 'colored' });
    }
    else if (category === "") {
      toast.error("Please select the property category", { theme: 'colored' });
    }
    else if (values.rent_frequency === "") {
      toast.error("Please file the rent frequency", { theme: 'colored' });
    }
    else if (values.rate === "") {
      toast.error("Please file the rate", { theme: 'colored' });
    }
    else if (description === "") {
      toast.error("Please file the description", { theme: 'colored' });
    }
    else {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('uuID', String(requestConfig.headers.uu_id));
      formData.append('file', selectedFilesNewOwner);
      formData.append('type', type);
      formData.append('category', category);
      formData.append('rent_frequency', values.rent_frequency);
      formData.append('rate', values.rate);
      formData.append('description', description);

      if(id != null){
        formData.append('id', id);
      }
       console.log(formData)
      try {
      let res=  await axios.post(`${apiUrl}user/rental/property`, formData, requestConfig);
        toast.success(res.data.status, { theme: 'colored' });
        setValues(initialFValues);
        setType('')
        setCategory('')
        setDescription('')
        setSelectedFileNewOwner(null);

        setShow(false);
        navigate('/rental')
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

  const clearData = async (event: React.FormEvent) => {
    event.preventDefault();
    setValues(initialFValues)
    setShow(false)
    setSelectedFileNewOwner(null)


  }
  const getUserPermissions = async () => {
    await axios.get(`${apiUrl}user/permissions`, requestConfig).then(response => {
      for (let i = 0; i < response.data.user_permissions.length; i++) {
        if (response.data.user_permissions[i].Name == "rental_property") {
          setPermission(response.data.user_permissions[i].Value)
          if (!response.data.user_permissions[i].Value) {
            setPermission(false)
          }
        }
        if (response.data.user_permissions[i].Name == "admin") {
          setPermission(response.data.user_permissions[i].Value)
          if (!response.data.user_permissions[i].Value) {
            setPermission(false)
          }
        }



      }
    }).catch(error => {
      console.log(error)
    })


  }
  const getEditRental = async () => {
    if (id != null) {
      await axios.get(`${apiUrl}user/rental/view/${id}`, requestConfig).then(response => {
        setValues((prevValues) => ({
          ...prevValues,
          id: response.data.property.id,
          title: response.data.property.title,
          rent_frequency: response.data.property.rent_frequency,
          rate: response.data.property.rate,
          image: response.data.property.image


        }));

        setType(response.data.property.type)
        setCategory(response.data.property.category)
        setDescription(response.data.property.description)
        setSelectedFileNewOwner(response.data.property.image)
        setImageShow(true)
        setImageUrl(response.data.property.image)
      }).catch(error => {
        console.log(error)
      })
    }



  }
  useEffect(() => {
    const token = localStorage.getItem('token');
    if ((token === null)) {
      navigate('/auth/signin')
    }
    getUserPermissions()
    getAdminRentals();
    getEditRental()

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
                      name="title"
                      value={values.title}
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
                      name="rent_frequency"
                      value={values.rent_frequency}
                      onChange={handleInputChange}
                      placeholder="Rent Frequency"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="flex-col w-full">
                    <label className="mb-3 block text-black dark:text-white">Rate</label>
                    <input
                      type="text"
                      placeholder="Rate"
                      name="rate"
                      value={values.rate}
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
                    <select
                      value={type}
                      onChange={handleSelectChangeType}
                      name="category"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="" selected>Select a Type</option>
                      {rental.map((item, index) => {


                        return (

                          <option value={item.property_type}>{item.property_type}</option>
                        );
                      })}


                    </select>
                  </div>
                  <div className="flex-col w-full">
                    <label className="mb-3 block text-black dark:text-white">Property Category</label>
                    <select
                      value={category}
                      onChange={handleSelectChangeCategory}
                      name="category"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="" selected>Select a Category</option>
                      {rental.map((item, index) => {


                        return (

                          <option value={item.property_category}>{item.property_category}</option>
                        );
                      })}
                    </select>


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
                      <p className="mt-1.5 text-danger">Rental Property Image</p>
                      {/* <p>(max, 800 X 800px)</p> */}

                    </div>

                  </div>
                </div>
              </div>

              {/* <img src={values.image}/>   
              <div className="flex flex-row gap-5.5 p-6.5">
                <textarea
                  name="comment" value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full mb-3 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />



              </div> */}
              <div className="flex flex-row gap-5.5 p-6.5">
                

                <textarea
                  name="comment"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="flex-1 mb-3 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                  {imageShow &&
                  <img src={values.image} alt="image" className="max-h-[100px] rounded-lg" />
                  
                  
                  }
                
              </div>
            

            </div>


          </div>


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

          <ToastContainer />
        </div>
      }



    </>
  )
}


export default AddRental;