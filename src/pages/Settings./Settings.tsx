import { useState, useEffect ,ChangeEvent} from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFile] = useState<File | null>(null);
    const apiUrl = 'http://localhost:3005/';
    const requestConfig = {
        headers: {
            'token': localStorage.getItem('token'),
            'uu_id': localStorage.getItem('uuID')

        }
    }
    const initialFValues = {
        id: 0,
        key: "",
        value: ""
    }
    const initialTextFields = {
        text_1: "",

    }
    interface TextItem {
        key: string;
        value: string;
        label: string;
        placeholder: string;
       // setValue: (value: string) => void; // Assuming setValue is a function taking a string parameter
    }
 //
 const initialFValuesImage = {
    image_name:''
  }
  const [values_image, setValuesImage] = useState(initialFValuesImage);
  const [image_name, setImage_name] = useState('');
    const [text, setText] = useState<TextItem[]>([]);
    const [values, setValues] = useState(initialFValues);
    const [textField, setTextField] = useState(initialTextFields);
    const [permission, setPermission] = useState(false);
    const handleInputChange = (index: number, newValue: string) => {
        const newText = [...text];
        newText[index].value = newValue;
        setText(newText);
       
       
       
    };
    const handleSubmit = async () => {
         const requestBody = {
                "key": "test123456",
                "value":"HASH NEW2",
                "label": "TEST 123452",
                "placeholder": "TEST 123452",
                "Content-Type": 'application/json'
            }

            await axios.post(`${apiUrl}user/settings`, requestBody, requestConfig).then(response => {
                getSettings();
                //toast.success("Settings Added Successfully", { theme: 'colored' })


            }).catch(error => {
               // toast.error(error.response.data.error, { theme: 'colored' })
              // console.log(error)
            })

        
    }
    const clearData = async (event: React.FormEvent) => {
        setValues(initialFValues)
    }
 
    const getSettings = async () => {
        await axios.get(`${apiUrl}user/view/settings`, requestConfig).then(response => {
            console.log(response.data.settings.reverse())
          setText(response.data.settings.reverse())
        
        }).catch(error => {
          toast.error(error.response.data.error, { theme: 'colored' })
        })
    
    
      }
      const getLogo = async () => {
     
        await axios.get(`${apiUrl}user/view/logo`, requestConfig).then(response => {
           //http://localhost:3005/pdf/file-logo.png
              setImage_name(`${apiUrl}/pdf/${response.data.location.value}`)
             // image_name:`${apiUrl}/${response.data.location.image_url}`
        
        }).catch(error => {
          toast.error(error.response.data.error, { theme: 'colored' })
        })
    
    
      }
      const handleEdit = async (event: React.FormEvent) => {
        event.preventDefault();
      //async (event: React.FormEvent) => {
        const requestBody = {
            "data": text,
            "Content-Type": 'application/json'
        }

        await axios.post(`${apiUrl}user/edit/settings`, requestBody, requestConfig).then(response => {
            getSettings();
            toast.success("Settings Added Successfully", { theme: 'colored' })
            //location.reload();
           
            //window.location.reload();


        }).catch(error => {
            toast.error(error.response.data.error, { theme: 'colored' })
        })
      }

      const getUserPermissions = async () => {
        await axios.get(`${apiUrl}user/permissions`, requestConfig).then(response => {
         for(let i=0;i<response.data.user_permissions.length;i++){
             if(response.data.user_permissions[i].Name=="settings"){
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
      const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          setSelectedFile(e.target.files[0]);
          const formData = new FormData();
          formData.append('file', e.target.files[0]);
          axios.post(`${apiUrl}user/logo/settings`, formData, requestConfig).then(response => {
            getLogo()
           // console.log()
           // setImage_name(response.data.location)
           // setImage_name(response.data.location)
          // setImage_name(`${apiUrl}/pdf/${response.data.location.image_url}`)
            toast.success("New Logo Updated", { theme: 'colored' })
           window.location.reload();
            

        }).catch(error => {
           console.log(error)
            //toast.error(error.response.data.error, { theme: 'colored' })
        })
        }
      }
      useEffect(() => {
        getUserPermissions()
        getLogo()
    
    
      }, [])
      useEffect(() => {
        getSettings();
        handleSubmit();
    
      }, [])
    return (
        <>
        {!permission && <h2>No Access For You.!</h2>}
        {permission && <div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        ADD SETTINGS 
                    </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                <form action="#">
               <div className="mb-4 flex items-center justify-center gap-3">
                 <div className="h-165 w-175 rounded-full">
                   {/* <img className="mx-auto" src={values.image_name} alt="User" /> */}
                 </div>
               </div>
               {/* <div className="flex flex-col gap-1.5 p-1.5">
               <img src="https://hash-test-media.s3.ap-south-1.amazonaws.com/logo/logo"/>
               </div> */}
                <div className="mb-4 flex items-center justify-center gap-3">
                 <div className="h-165 w-175 rounded-full">
              
                
                 <img src={image_name}/>
                 </div>
               </div>
               
               <div
                 id="FileUpload"
                 className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
               >
                 <input
                   type="file"
                   onChange={handleFileChange} 
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
                   <p className="mt-1.5"> PNG, JPG </p>
                   <p>(max, 800 X 800px)</p>
                 </div>
               </div>
                </form>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    {text.map((item, index) => {

                        return (
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    {item.label}
                                </label>
                                <input
                                    type="text"
                                    placeholder={item.placeholder}
                                    name={item.key}
                                    value={item.value}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                                />
                            </div>
                        )
                    })}

                </div>
            </div>

            <button className="flex w-full justify-center rounded bg-secondary p-3 font-medium text-white mb-4" onClick={handleEdit} >
                Update
            </button>
            <ToastContainer />
            </div>}
            
        </>
    )
}

export default Settings;