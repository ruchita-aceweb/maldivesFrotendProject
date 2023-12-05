import Breadcrumb from '../components/Breadcrumb';
import React, { useEffect, ChangeEvent, useState } from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Settings = () => {
  const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const apiUrl = 'https://baatestapi.hash.mv/';
  const requestConfig = {
    headers: {
      'token': localStorage.getItem('token'),
      'uu_id': localStorage.getItem('uuID')

    }
  }
 
  const initialFValues = {
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    username: "",
    address: "",
    city: "",
    state: "",
    confirm_password: "",
    id: 0,
    base64: '',
    image_name:''
  }
  const [values, setValues] = useState(initialFValues);
  const [gender, setGender] = useState('');
  const [selectedFiles, setSelectedFile] = useState<File | null>(null);
  const [permission, setPermission] = useState('False');


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(values)
    console.log(gender)

    if (!regex.test(values.email) || values.email == '') {
      toast.error("Please check your email", { theme: 'colored' })
    } else if (values.first_name == '') {
      toast.error("Please check your first name", { theme: 'colored' })
    }
    else if (values.last_name == '') {
      toast.error("Please check your last name", { theme: 'colored' })
    }
    else if (values.phone_number == '') {
      toast.error("Please check your  phone number", { theme: 'colored' })
    }


    else if (values.username == '') {
      toast.error("Please check your username", { theme: 'colored' })
    }
    else if (values.address == '') {
      toast.error("Please check your address", { theme: 'colored' })
    }
    else if (values.city == '') {
      toast.error("Please check your city", { theme: 'colored' })
    }
    else if (values.state == '') {
      toast.error("Please check your state", { theme: 'colored' })
    }
    else if (gender == '') {
      toast.error("Please check your gender", { theme: 'colored' })
    }

    else if (values.password.length > 0) {
      if (values.confirm_password == '') {
        toast.error("Please check your confirm password", { theme: 'colored' })
      }
      else if (values.confirm_password != values.password) {
        toast.error("Password do not match", { theme: 'colored' })
      }
      else if (values.password.length < 8 || !/[a-z]/.test(values.password) || !/[A-Z]/.test(values.password) || !/\d/.test(values.password) || !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(values.password)) {
        toast.error("Check for password at least one lowercase letter,at least one uppercase letter,at least one number,at least one special character and minimum length requirement", { theme: 'colored' })
      }
      else {
        const requestBody = {
          "email": values.email,
          "first_name": values.first_name,
          "last_name": values.last_name,
          "gender": gender,
          "phone_number": values.phone_number,
          "username": values.username,
          "password": values.password,
          "address": values.address,
          "city": values.city,
          "state": values.state,
          "id": values.id
        }
        await axios.post(`${apiUrl}user/details/update`, requestBody, requestConfig).then(response => {
          toast.success("User Details Updated", { theme: 'colored' })
          getUser()
          setValues((prevValues) => ({
            ...prevValues,
            password: '',
            confirm_password: ''
          }));


        }).catch(error => {
          toast.error(error.response.data.error, { theme: 'colored' })
        })

      }
    }


    else {
      const requestBody = {
        "email": values.email,
        "first_name": values.first_name,
        "last_name": values.last_name,
        "gender": gender,
        "phone_number": values.phone_number,
        "username": values.username,
        "address": values.address,
        "city": values.city,
        "state": values.state,
        "id": values.id
      }
      await axios.post(`${apiUrl}user/details/update`, requestBody, requestConfig).then(response => {
        console.log(response)
        localStorage.setItem("token", response.data.token)
        toast.success("User Details Updated", { theme: 'colored' })
        getUser()
        setValues((prevValues) => ({
          ...prevValues,
          password: '',
          confirm_password: ''
        }));


      }).catch(error => {
        toast.error(error.response.data.error, { theme: 'colored' })
      })

    }
  }
  
  const handleImageUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    const id = values.id
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    
    if (fileInput.files && fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append('id', String(id));
      formData.append('file', fileInput.files[0]);

      try {
        const response = await axios.post(`${apiUrl}user/profile/update`, formData, requestConfig);
        toast.success("User Image Updated", { theme: 'colored' })
        getUser();
        console.log('Upload successful:', response.data);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.error('No file selected');
    }
  }
  const getUser = async () => {
    await axios.get(`${apiUrl}user/details`, requestConfig).then(response => {
      //setProductsFilter(response.data.user_details.reverse())
      setValues((prevValues) => ({
        ...prevValues,
        email: response.data.user_details.email,
        first_name: response.data.user_details.first_name,
        last_name: response.data.user_details.last_name,
        phone_number: response.data.user_details.phone_number,
        username: response.data.user_details.username,
        address: response.data.user_details.address,
        city: response.data.user_details.city,
        state: response.data.user_details.first_name,
        id: response.data.user_details.id,
        image_name:`${apiUrl}/${response.data.user_details.image_name}`
      }));
      setGender(response.data.user_details.gender)
    }).catch(error => {
      toast.error(error.response.data.error, { theme: 'colored' })
    })


  }
  const getUserPermissions = async () => {
    await axios.get(`${apiUrl}user/permissions`, requestConfig).then(response => {
     for(let i=0;i<response.data.user_permissions.length;i++){
        if(response.data.user_permissions[i].Name=="profile"){
          if(response.data.user_permissions[i].Value){
           setPermission(response.data.user_permissions[i].Value)
          }
          if(!response.data.user_permissions[i].Value){
           setPermission('False')
          }
       }
      }
   }).catch(error => {
     console.log(error)
    })


  }
  useEffect(() => {
    getUser();



  }, [])
  getUserPermissions()
  const handleCancel = async (event: React.FormEvent) => {
    event.preventDefault();
    getUser();
    setValues((prevValues) => ({
      ...prevValues,
      password: '',
      confirm_password: ''
    }));

  }

  return (
    <>
    {permission &&
     <div className="mx-auto max-w-270">

     <Breadcrumb pageName="My Profile" />

     <div className="grid grid-cols-5 gap-8">
       <div className="col-span-5 xl:col-span-3">
         <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
           <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
             <h3 className="font-medium text-black dark:text-white">
               Personal Information
             </h3>
           </div>
           <div className="p-7">
             <form action="#">
               <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                 <div className="w-full sm:w-1/2">
                   <label
                     className="mb-3 block text-sm font-medium text-black dark:text-white"
                     htmlFor="fullName"
                   >
                     First Name
                   </label>
                   <div className="relative">
                     <input
                       className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                       type="text"
                       id="first_name"
                       placeholder="First Name"
                       name="first_name" value={values.first_name} onChange={handleInputChange}
                     />
                   </div>
                 </div>

                 <div className="w-full sm:w-1/2">
                   <label
                     className="mb-3 block text-sm font-medium text-black dark:text-white"
                     htmlFor="Last Name"
                   >
                     Last Name
                   </label>
                   <input
                     className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                     type="text"
                     name="last_name" value={values.last_name} onChange={handleInputChange}
                     id="last_name"
                     placeholder="Last name"
                   />
                 </div>


               </div>

               <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                 <div className="w-full sm:w-1/2">
                   <label
                     className="mb-3 block text-sm font-medium text-black dark:text-white"
                     htmlFor="fullName"
                   >
                     Username
                   </label>
                   <div className="relative">
                     <input
                       className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                       type="text"
                       name="username" value={values.username} onChange={handleInputChange}
                       id="username"
                       placeholder="Username"
                     />
                   </div>
                 </div>

                 <div className="w-full sm:w-1/2">
                   <label
                     className="mb-3 block text-sm font-medium text-black dark:text-white"
                     htmlFor="Last Name"
                   >
                     Email
                   </label>
                   <input
                     className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                     type="email"
                     name="email" value={values.email} onChange={handleInputChange}
                     id="phonemaileNumber"
                     placeholder="Email"

                   />
                 </div>


               </div>

               <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                 <div className="w-full sm:w-1/2">
                   <label
                     className="mb-3 block text-sm font-medium text-black dark:text-white"
                     htmlFor="fullName"
                   >
                     Phone Number
                   </label>
                   <div className="relative">
                     <input
                       className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                       type="text"
                       name="phone_number" value={values.phone_number} onChange={handleInputChange}
                       id="phone_number"
                       placeholder="Phone number"

                     />
                   </div>
                 </div>

                 <div className="w-full sm:w-1/2">
                   <label
                     className="mb-3 block text-sm font-medium text-black dark:text-white"
                     htmlFor="Last Name"
                   >
                     Gender
                   </label>
                   {/* <input
                     className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                     type="text"
                     name="phoneNumber"
                     id="phoneNumber"
                    
                   /> */}
                   <select
                     id="gender"
                     name="gender" value={gender} onChange={(e) => setGender(e.target.value)}
                     className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                   >
                     <option value="male">Male</option>
                     <option value="female">Female</option>
                   </select>
                 </div>


               </div>

               <div className="mb-5.5">
                 <label
                   className="mb-3 block text-sm font-medium text-black dark:text-white"
                   htmlFor="emailAddress"
                 >
                   Address
                 </label>
                 <div className="relative">
                   {/* <span className="absolute left-4.5 top-4">
                     <svg
                       className="fill-current"
                       width="20"
                       height="20"
                       viewBox="0 0 20 20"
                       fill="none"
                       xmlns="http://www.w3.org/2000/svg"
                     >
                       <g opacity="0.8">
                         <path
                           fillRule="evenodd"
                           clipRule="evenodd"
                           d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                           fill=""
                         />
                         <path
                           fillRule="evenodd"
                           clipRule="evenodd"
                           d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                           fill=""
                         />
                       </g>
                     </svg>
                   </span> */}
                   <input
                     className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                     type="email"
                     name="address" value={values.address} onChange={handleInputChange}
                     id="emailAddress"
                     placeholder="Address"

                   />
                 </div>
               </div>


               <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                 <div className="w-full sm:w-1/2">
                   <label
                     className="mb-3 block text-sm font-medium text-black dark:text-white"
                     htmlFor="fullName"
                   >
                     City
                   </label>
                   <div className="relative">
                     <input
                       className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                       type="text"
                       name="city" value={values.city} onChange={handleInputChange}
                       id="fullName"
                       placeholder="Devid Jhon"
                       defaultValue="Devid Jhon"
                     />
                   </div>
                 </div>

                 <div className="w-full sm:w-1/2">
                   <label
                     className="mb-3 block text-sm font-medium text-black dark:text-white"
                     htmlFor="Last Name"
                   >
                     State
                   </label>
                   <input
                     className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                     type="text"
                     name="state" value={values.state} onChange={handleInputChange}
                     id="phoneNumber"
                     placeholder="+990 3343 7865"
                     defaultValue="+990 3343 7865"
                   />
                 </div>


               </div>

               <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                 <div className="w-full sm:w-1/2">
                   <label
                     className="mb-3 block text-sm font-medium text-black dark:text-white"
                     htmlFor="fullName"
                   >
                     New Password
                   </label>
                   <div className="relative">
                     <input
                       className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                       type="password"
                       name="password"
                       value={values.password} onChange={handleInputChange}
                       placeholder="New Password"

                     />
                   </div>
                 </div>

                 <div className="w-full sm:w-1/2">
                   <label
                     className="mb-3 block text-sm font-medium text-black dark:text-white"
                     htmlFor="Last Name"
                   >
                     Confirm Password
                   </label>
                   <input
                     className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                     type="password"
                     name="confirm_password"
                     id="phoneNumber"
                     value={values.confirm_password} onChange={handleInputChange}
                     placeholder="Confirm Password"

                   />
                 </div>


               </div>


               <div className="flex justify-end gap-4.5">
                 <button
                   className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                   type="submit"
                   onClick={handleCancel}
                 >
                   Cancel
                 </button>
                 <button
                   className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                   type="submit"
                   onClick={handleSubmit}
                 >
                   Save
                 </button>
               </div>
             </form>
           </div>
         </div>
       </div>
       <div className="col-span-5 xl:col-span-2">
         <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
           <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
             <h3 className="font-medium text-black dark:text-white">
               Your Photo
             </h3>
           </div>
           <div className="p-7">
             <div>

               
                 {/* <div>

                   <img src='https://baatestapi.hash.mv/pdf/file-1700799972947.png' alt="Uploaded" style={{ maxWidth: '100%' }} />
                 </div> */}
             
             </div>
             <form action="#">
               <div className="mb-4 flex items-center justify-center gap-3">
                 <div className="h-165 w-175 rounded-full">
                   <img className="mx-auto" src={values.image_name} alt="User" />
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

               <div className="flex justify-end gap-4.5">
                 <button
                   className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                   type="submit"
                 >
                   Cancel
                 </button>
                 <button
                   className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                   type="submit"
                   onClick={handleImageUpload}
                 >
                   Save
                 </button>
               </div>
             </form>
           </div>
         </div>
       </div>

     </div>
     <ToastContainer />
   </div>
    }
    {!permission && <h2>No Access For You.!</h2>}
     </>
  );
};

export default Settings;
