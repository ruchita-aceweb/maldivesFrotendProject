import { useState,useEffect} from "react";
import { Link,useNavigate } from 'react-router-dom';
import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from '../../images/logo/logo.svg';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sigingradent from "../../images/sigin/signingradient.jpeg";
import signin from "../../images/sigin/signin.jpg";



const SignUp = () => {
  const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const apiUrl = 'http://localhost:3005/';
  const navigate = useNavigate();
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
    confirm_password: ""
  } 
  const [values, setValues] = useState(initialFValues);
  const [gender, setGender] = useState('');
  const handleSubmitSigiIn = async(event: React.FormEvent)=>{
  
    localStorage.clear() 
   
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(values)
    console.log(gender)
    
    if (!regex.test(values.email) ||values.email=='' ) {
      toast.error("Please check your email",{theme:'colored'})
    }else if(values.first_name==''){
      toast.error("Please check your first name",{theme:'colored'})
    }
    else if(values.last_name==''){
      toast.error("Please check your last name",{theme:'colored'})
    }
    else if(values.phone_number==''){
      toast.error("Please check your  phone number",{theme:'colored'})
    }
    else if(values.password==''){
      toast.error("Please check your password",{theme:'colored'})
    }

    else if(values.username==''){
      toast.error("Please check your username",{theme:'colored'})
    }
    else if(values.address==''){
      toast.error("Please check your address",{theme:'colored'})
    }
    else if(values.city==''){
      toast.error("Please check your city",{theme:'colored'})
    }
    else if(values.state==''){
      toast.error("Please check your state",{theme:'colored'})
    }
    else if(gender==''){
      toast.error("Please check your gender",{theme:'colored'})
    }
    else if(values.confirm_password==''){
      toast.error("Please check your confirm password",{theme:'colored'})
    }
    else if(values.confirm_password!=values.password){
      toast.error("Password do not match",{theme:'colored'})
    }
    else if(values.password.length<8 || !/[a-z]/.test(values.password) || !/[A-Z]/.test(values.password) || !/\d/.test(values.password) ||!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(values.password)){
      toast.error("Check for password at least one lowercase letter,at least one uppercase letter,at least one number,at least one special character and minimum length requirement",{theme:'colored'})
    }
    else{
     const requestBody={
      "email":values.email,
      "first_name":values.first_name,
      "last_name":values.last_name,
      "gender":gender,
      "phone_number":values.phone_number,
      "password":values.password,
      "username":values.username,
      "address":values.address,
      "city":values.city,
      "state":values.state
    }
    await axios.post(`${apiUrl}user/signup`,requestBody).then(response=>{
      //  toast.success("Registration Successfully",{theme:'colored'})
        localStorage.setItem("username",values.username)
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("first_name",values.first_name)
        localStorage.setItem("last_name",values.last_name)
        localStorage.setItem("user_type",response.data.user_type)
        localStorage.setItem("phone_number",values.phone_number)
        localStorage.setItem("uuID",response.data.uuID)
        localStorage.setItem("email",values.email)
         navigate('/profile');
         window.location.reload();
         setValues(initialFValues)
         setGender('')
        

    }).catch(error=>{
       toast.error(error.response.data.error,{theme:'colored'})
         })

    }
  }

  const getUserParams = async () => {
    if(window.location.href.split("?time_samp=")[1] !=undefined ){
      var uu_id=window.location.href.split("?time_samp=")[1]

      
      await axios.get(`${apiUrl}user/signup/${uu_id}`,).then(response=>{
        
          console.log(response.data.email)
          console.log(response.data.first_name)
          console.log(response.data.last_name)
         
          setValues((prevValues) => ({
            ...prevValues,
            email:response.data.email,
            last_name: response.data.last_name,
            first_name: response.data.first_name,
            

        }));
          
  
      }).catch(error=>{
         toast.error(error.response.data.error,{theme:'colored'})
           })
  
     
    }
  }
  useEffect(() => {
    getUserParams();
  

}, [])
  return (

    <>
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
     
        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <div className="flex flex-wrap items-center">
            <div>
          <img src={sigingradent} alt="" style={{width:"30px"}}></img>
          </div>

         <div className="ml-5 mt-9">
            <span className="mb-1.5 block font-medium text-2xl"> Welcome To</span>
            
            <h2 className="mb-9 text-4xl font-bold text-black dark:text-white sm:text-title-xl2">
              BAA ATOLL
            </h2>
            </div>
         </div>
         <div className="mb-5">
                <input
                  type="submit"
                  onClick={handleSubmit}
                  value="SignUp to BAA ATOLL"
                  className="w-full text-1xl cursor-pointer  text-black  p-2  transition hover:bg-opacity-90" 
                />
              </div>
            <form>
              <div className="mb-4">

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Email
                    </label> */}
                    <input
                      type="email"
                      id="email"
                      name="email" value={values.email} onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full text-sm rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="relative">
                    {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Username
                    </label> */}
                    <input
                      type="text"
                      id="username"
                      name="username" value={values.username} onChange={handleInputChange}
                      placeholder="Enter  username"
                      className="w-full text-sm rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
                      First Name
                    </label> */}
                    <input
                      type="text"
                      id="first_name"
                      name="first_name" value={values.first_name} onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className="w-full text-sm rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="relative">
                    {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Last Name
                    </label> */}
                    <input
                      type="text"
                      id="last_name"
                      name="last_name" value={values.last_name} onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className="w-full text-sm rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Gender
                    </label> */}
                    <select
                      id="gender"
                      name="gender" value={gender} onChange={(e) => setGender(e.target.value)}
                      className="w-full text-sm rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="" disabled selected>Select your gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="relative">
                    {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Phone Number
                    </label> */}
                    <input
                      type="text"
                      id="phone_number"
                      name="phone_number" value={values.phone_number} onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full text-sm rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Address
                </label> */}
                <div className="relative">
                  <input
                    type="text"
                    name="address" value={values.address} onChange={handleInputChange}
                    placeholder="Enter your address"
                    className="w-full text-sm rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />

                </div>
              </div>

              <div className="mb-4">

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
                      State
                    </label> */}
                    <input
                      type="text"
                      id="state"
                      name="state" value={values.state} onChange={handleInputChange}
                      placeholder="Enter your state"
                      className="w-full text-sm rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="relative">
                    {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
                      City
                    </label> */}
                    <input
                      type="text"
                      id="city"
                      name="city" value={values.city} onChange={handleInputChange}
                      placeholder="Enter your city"
                      className="w-full text-sm rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Password
                    </label> */}
                    <input
                      type="password"
                      id="password"
                      name="password" value={values.password} onChange={handleInputChange}
                      placeholder="Enter password"
                      className="w-full text-sm rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="relative">
                    {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Re-type Password
                    </label> */}
                    <input
                      type="password"
                      id="confirm_password"
                      name="confirm_password" value={values.confirm_password} onChange={handleInputChange}
                      placeholder=" Re-type Password"
                      className="w-full text-sm rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>


              <div className="mb-5">
                <input
                  type="submit"
                  onClick={handleSubmit}
                  value="Sign-Up"
                  className="w-full  cursor-pointer rounded-lg border p-4 text-white transition hover:bg-opacity-90" style={{background:"rgb(2 89 62)"}}
                />
              </div>
              <div className="mt-6 text-center">
                <p>
                  Already have an account?{' '}
                  <Link to="/auth/signin" className="text-primary">
                    <button onClick={handleSubmitSigiIn}>
                     Sign in
                    </button>
                    
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden w-full xl:block xl:w-1/2" style={{marginTop:"-35rem"}}>
          <div className=" text-center">
           <Link className="mb-5.5 inline-block" to="/">
              {/* <img className="hidden dark:block" src={Logo} alt="Logo" />
              <img className="dark:hidden" src={LogoDark} alt="Logo" /> */}
            </Link>

            <img className="w-full  object-cover" src={signin} alt="island" style={{height:"91rem"}} />


          </div>
        </div>

      </div>
      <ToastContainer />
    </div>
  </>
  );
};

export default SignUp;
