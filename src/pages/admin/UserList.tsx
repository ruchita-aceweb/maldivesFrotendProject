import { useState, useEffect } from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UserList = () => {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const initialFValues = {
        id: 0,
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone_number: "",
        address: "",
        city: "",
        state: "",
        gender: "",
        created_at: "",
        image_name: ""
    }
    const initialFValuesAddUser = {
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
        id:0
    }
    const [values_add_users, setValuesAddUsers] = useState(initialFValuesAddUser);
    const [gender, setGender] = useState('');

    const [values, setValues] = useState(initialFValues);
    const [permission, setPermission] = useState<boolean>(false);
    const [product, setProduct] = useState<boolean>(false);
    const [edit_user, setEditUser] = useState<boolean>(false);
    const [profile, setProfile] = useState<boolean>(false);
    const [showAddModalAddUser, setShowAddModalAddUser] = useState<boolean>(false);
    const [admin, setAdmin] = useState<boolean>(false);
    const [users, setUsers] = useState<any[]>([])
    const [userFilter, setUsersFilter] = useState<any[]>([])
    const [showModal, setShowModal] = useState(false);
    const [showPermission, setShowPermission] = useState(false);
    const [query, setQuery] = useState("")

    const apiUrl = 'http://localhost:3005/';
    const requestConfig = {
        headers: {
            'token': localStorage.getItem('token'),
            'uu_id': localStorage.getItem('uuID')

        }
    }
    const getUsers = async () => {
        await axios.get(`${apiUrl}admin/all/users`, requestConfig).then(response => {
            console.log(response.data.users)
            console.log((response.data.users).reverse())
            setUsersFilter((response.data.users).reverse())
           setUsers((response.data.users).reverse())
        }).catch(error => {
            toast.error(error.response.data.error, { theme: 'colored' })
        })

    }
    async function getUserDetails(first_name: any, last_name: any, username: any, email: any, phone_number: any, address: any, city: any, state: any, gender: any, image_name: any, created_at: any) {
        setValues((prevValues) => ({
            ...prevValues,
            first_name: first_name,
            last_name: last_name,
            username: username,
            email: email,
            phone_number: phone_number,
            address: address,
            city: city,
            state: state,
            gender: gender,
            image_name: image_name,
            created_at: created_at

        }));

        setShowModal(true)
    }
    const openModalEditUser = async (first_name: any, last_name: any, username: any, email: any, phone_number: any, address: any, city: any, state: any, gender: any, image_name: any, created_at: any,id:any) =>{
        setValuesAddUsers((prevValues) => ({
            ...prevValues,
            first_name: first_name,
            last_name: last_name,
            username: username,
            email: email,
            phone_number: phone_number,
            address: address,
            city: city,
            state: state,
            gender: gender,
            image_name: image_name,
            created_at: created_at,
            id:id

        }));
        setGender(gender)

        setEditUser(true)
        setShowAddModalAddUser(true)
    }
    const addPermissionModalOpen = async (id: any) => {
        setShowPermission(true);
        setValues((prevValues) => ({
            ...prevValues,
            id: id

        }));
        await axios.get(`${apiUrl}admin/permissions/${id}`, requestConfig).then(response => {
            console.log(response.data.user_permissions);
            for (let i = 0; i < response.data.user_permissions.length; i++) {
                if (response.data.user_permissions[i].Name === "profile") {
                    setProfile(response.data.user_permissions[i].Value)
                }
                if (response.data.user_permissions[i].Name === "product") {
                    setProduct(response.data.user_permissions[i].Value)
                }
                if (response.data.user_permissions[i].Name === "admin") {
                    setAdmin(response.data.user_permissions[i].Value)
                }
            }
        }).catch(error => {
            toast.error(error.response.data.error, { theme: 'colored' });
        });
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const requestBody = {
            "user_id": values.id,
            "data": [
                { "Name": "profile", "Value": profile },
                { "Name": "admin", "Value": admin },
                { "Name": "product", "Value": product }]
        }
        await axios.post(`${apiUrl}admin/add/user/roles`, requestBody).then(response => {
            toast.success("Permissions Added Successfully", { theme: 'colored' })
            setShowPermission(false);
        }).catch(error => {
            toast.error(error.response.data.error, { theme: 'colored' })
        })

    }
    const openModalAddUsers = async (event: React.FormEvent) => {
        setShowAddModalAddUser(true)
        setValuesAddUsers(initialFValuesAddUser)
    }

    const getUserPermissions = async () => {
        await axios.get(`${apiUrl}user/permissions`, requestConfig).then(response => {
            for (let i = 0; i < response.data.user_permissions.length; i++) {
                if (response.data.user_permissions[i].Name == "admin") {
                    setPermission(response.data.user_permissions[i].Value)
                }



            }
        }).catch(error => {
            console.log(error)
        })


    }
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const getSearch = e.target.value
        if (getSearch.length > 0) {
            const searchData = users.filter((item) => item.email.toLowerCase().includes(getSearch.toLowerCase()) || item.email.toUpperCase().includes(getSearch.toUpperCase()) || item.username.toUpperCase().includes(getSearch.toUpperCase()) || item.username.toUpperCase().includes(getSearch.toUpperCase()))
            setUsersFilter(searchData)

        } else {
            setUsersFilter(users)
        }
        setQuery(getSearch)
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValuesAddUsers({
            ...values_add_users,
            [name]: value,
        });
    };
    const handleSubmitAddUsers = async (event: React.FormEvent) => {
        event.preventDefault();


        if (!regex.test(values_add_users.email) || values_add_users.email == '') {
            toast.error("Please check your email", { theme: 'colored' })
        } else if (values_add_users.first_name == '') {
            toast.error("Please check your first name", { theme: 'colored' })
        }
        else if (values_add_users.last_name == '') {
            toast.error("Please check your last name", { theme: 'colored' })
        }
        // else if (values_add_users.phone_number == '') {
        //     toast.error("Please check your  phone number", { theme: 'colored' })
        // }
        // else if (values_add_users.password == '') {
        //     toast.error("Please check your password", { theme: 'colored' })
        // }

        // else if (values_add_users.username == '') {
        //     toast.error("Please check your username", { theme: 'colored' })
        // }
        // else if (values_add_users.address == '') {
        //     toast.error("Please check your address", { theme: 'colored' })
        // }
        // else if (values_add_users.city == '') {
        //     toast.error("Please check your city", { theme: 'colored' })
        // }
        // else if (values_add_users.state == '') {
        //     toast.error("Please check your state", { theme: 'colored' })
        // }
        // else if (gender == '') {
        //     toast.error("Please check your gender", { theme: 'colored' })
        // }
        // else if (values_add_users.confirm_password == '') {
        //     toast.error("Please check your confirm password", { theme: 'colored' })
        // }
        // else if (values_add_users.confirm_password != values_add_users.password) {
        //     toast.error("Password do not match", { theme: 'colored' })
        // }
        // else if (values_add_users.password.length < 8 || !/[a-z]/.test(values_add_users.password) || !/[A-Z]/.test(values_add_users.password) || !/\d/.test(values_add_users.password) || !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(values_add_users.password)) {
        //     toast.error("Check for password at least one lowercase letter,at least one uppercase letter,at least one number,at least one special character and minimum length requirement", { theme: 'colored' })
        // }
        else {
            const requestBody = {
                "email": values_add_users.email,
                "first_name": values_add_users.first_name,
                "last_name": values_add_users.last_name,
                "gender": '-',
                "phone_number": 'pending',
                "password": 'pending',
                "username": 'pending',
                "address": 'pending',
                "city": 'pending',
                "state": 'pending'
            }
            await axios.post(`${apiUrl}admin/add/users`, requestBody).then(response => {
                toast.success("User Added Successfully", { theme: 'colored' })
                getUsers();
                setShowAddModalAddUser(false);
                setValuesAddUsers(initialFValuesAddUser);


            }).catch(error => {
                toast.error(error.response.data.error, { theme: 'colored' })
            })

        }
    }

    const clearDataAddUser = async (event: React.FormEvent) => {
        event.preventDefault();
        setValuesAddUsers(initialFValuesAddUser);
    }
    const handleUserDetailsEdit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(values)
        console.log(gender)
    
        if (!regex.test(values_add_users.email) || values_add_users.email == '') {
          toast.error("Please check your email", { theme: 'colored' })
        } else if (values_add_users.first_name == '') {
          toast.error("Please check your first name", { theme: 'colored' })
        }
        else if (values_add_users.last_name == '') {
          toast.error("Please check your last name", { theme: 'colored' })
        }
        else if (values_add_users.phone_number == '') {
          toast.error("Please check your  phone number", { theme: 'colored' })
        }
    
    
        else if (values_add_users.username == '') {
          toast.error("Please check your username", { theme: 'colored' })
        }
        else if (values_add_users.address == '') {
          toast.error("Please check your address", { theme: 'colored' })
        }
        else if (values_add_users.city == '') {
          toast.error("Please check your city", { theme: 'colored' })
        }
        else if (values_add_users.state == '') {
          toast.error("Please check your state", { theme: 'colored' })
        }
        else if (gender == '') {
          toast.error("Please check your gender", { theme: 'colored' })
        }
    
       
    
        else {
          const requestBody = {
            "email": values_add_users.email,
            "first_name": values_add_users.first_name,
            "last_name": values_add_users.last_name,
            "gender": gender,
            "phone_number": values_add_users.phone_number,
            "username": values_add_users.username,
            "address": values_add_users.address,
            "city": values_add_users.city,
            "state": values_add_users.state,
            "id": values_add_users.id
          }
          await axios.post(`${apiUrl}user/details/update`, requestBody, requestConfig).then(response => {
            toast.success("User Details Updated", { theme: 'colored' })
            getUsers();
            setGender('')
            setEditUser(false)
            setShowAddModalAddUser(false)
    
    
          }).catch(error => {
            toast.error(error.response.data.error, { theme: 'colored' })
          })
    
        }
      }

      
    useEffect(() => {

        getUsers();
        getUserPermissions()

    }, [])
    return (
        <>
            {!permission && <h2>No Access For You.!</h2>}
            {permission &&
                <div>
                    <div>
                        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                                User List
                            </h4>
                            <div className="flex mb-2.5 flex-col gap-8 xl:flex-row">
                                <div className="flex-1">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Search User Name Or email
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            onChange={handleSearch}
                                            placeholder="Search Username Name or Email"
                                            className="flex-1 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />

                                    </div>
                                </div>

                                <div className="flex-1">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Add new user
                                    </label>
                                    <button className="w-full rounded bg-danger p-3 font-medium text-white" onClick={openModalAddUsers}>
                                        ADD USER
                                    </button>
                                </div>
                            </div>






                            <div className="flex flex-col">

                                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                                    <div className="max-w-full overflow-x-auto">
                                        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                                            View Users
                                        </h4>


                                        <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                                           
                                            <div className="col-span-1 flex items-center">
                                                <p className="font-medium">Name</p>
                                            </div>
                                            <div className="col-span-1 hidden items-center sm:flex">
                                                <p className="font-medium">Username</p>
                                            </div>
                                            <div className="col-span-2 flex items-center">
                                                <p className="font-medium">Email</p>
                                            </div>
                                            {/* <div className="col-span-2 flex items-center">
                                                <p className="font-medium">Phone Number</p>
                                            </div> */}

                                            {/* <div className="col-span-2 flex items-center">
                                                <p className="font-medium">Created At</p>
                                            </div> */}
                                            <div className="col-span-4 flex items-center">
                                                <p className="font-medium">Actions</p>
                                            </div>
                                        </div>
                                        {userFilter.map((item, index) => {
                                            return (
                                                <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5" key={index}>

                                                    <div className="col-span-1 flex items-center">

                                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                                            <div className="h-12.5 w-15 rounded-md">
                                                                <img src={`${apiUrl}/${item.image_name}`} alt="User" />
                                                            </div>
                                                            <p className="text-sm text-black dark:text-white">
                                                                {item.first_name} {item.last_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-1 hidden items-center sm:flex">
                                                        <p className="text-sm text-black dark:text-white">{item.username}</p>
                                                    </div>
                                                    <div className="col-span-2 flex items-center">
                                                        <p className="text-sm text-black dark:text-white">{item.email}</p>
                                                    </div>
                                                    {/* <div className="col-span-1 flex items-center">
                                                        <p className="text-sm text-black dark:text-white">{item.phone_number}</p>
                                                    </div> */}


                                                    {/* <div className="col-span-1 flex items-center">
                                                        <p className="text-sm text-meta-3">{item.created_at}</p>
                                                    </div> */}
                                                    <div className="col-span-1 flex items-center">
                                                        <p className="text-sm text-meta-3"><button onClick={() => getUserDetails(item.first_name, item.last_name, item.username, item.email, item.phone_number, item.address, item.city, item.state, item.gender, item.image_name, item.created_at)}>View More</button></p>
                                                    </div>
                                                    <div className="col-span-1 flex items-center">
                                                        <p className="text-sm text-meta-3"><button onClick={() => addPermissionModalOpen(item.id)}>Add Permissions</button></p>
                                                    </div>
                                                    <div className="col-span-1 flex items-center">
                                                        <p className="text-sm text-meta-3"><button  onClick={()=>openModalEditUser(item.first_name, item.last_name, item.username, item.email, item.phone_number, item.address, item.city, item.state, item.gender, item.image_name, item.created_at,item.id)}>Edit User Details</button></p>
                                                    </div>
                                                </div>


                                            );

                                        })}


                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                    {showModal ? (
                        <>
                            <div
                                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                            >
                                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                    {/*content*/}
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                        {/*header*/}
                                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                            <h3 className="text-3xl font-semibold">
                                                User Details
                                            </h3>
                                            <button
                                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                onClick={() => setShowModal(false)}
                                            >
                                                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                    ×
                                                </span>
                                            </button>
                                        </div>
                                        {/*body*/}


                                        <div className="relative p-6 flex-auto">
                                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">  <img className="mx-auto" src={`${apiUrl}/${values.image_name}`} alt="User" /></p>
                                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                First Name: {values.first_name}

                                            </p>
                                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                Last Name: {values.last_name}
                                            </p>
                                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                Username: {values.username}
                                            </p>
                                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                Email: {values.email}
                                            </p>
                                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                Phone Number: {values.phone_number}
                                            </p>
                                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                Address: {values.address}
                                            </p>
                                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                City: {values.city}
                                            </p>
                                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                State: {values.state}
                                            </p>
                                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                Gender: {values.gender}
                                            </p>
                                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                Created date: {values.created_at}
                                            </p>

                                        </div>


                                        {/*footer*/}
                                        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                            <button
                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => { setShowModal(false), setValues(initialFValues) }}
                                            >
                                                Close
                                            </button>


                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                        </>
                    ) : null}
                    {showPermission ? (
                        <>
                            <div
                                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                            >
                                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                    {/*content*/}
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                        {/*header*/}
                                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                            <h3 className="text-3xl font-semibold">
                                                Add Permission
                                            </h3>
                                            <button
                                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                onClick={() => setShowModal(false)}
                                            >
                                                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                    ×
                                                </span>
                                            </button>
                                        </div>
                                        {/*body*/}
                                        <div className="relative p-6 flex-auto">

                                            <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                                                <input
                                                    className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                                    type="checkbox"
                                                    checked={admin}
                                                    id="checkboxChecked"
                                                    name="profile"
                                                    onChange={() => {
                                                        setAdmin(!admin);
                                                    }}


                                                />
                                                <label
                                                    className="inline-block pl-[0.15rem] hover:cursor-pointer"
                                                    htmlFor="checkboxChecked">
                                                    Admin Access
                                                </label>
                                            </div>
                                            <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                                                <input
                                                    className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                                    type="checkbox"
                                                    value="True"
                                                    id="checkboxChecked"
                                                    checked={product}
                                                    onChange={() => {
                                                        setProduct(!product);
                                                    }}
                                                    name="product"

                                                />
                                                <label
                                                    className="inline-block pl-[0.15rem] hover:cursor-pointer"
                                                    htmlFor="checkboxChecked">
                                                    Product
                                                </label>
                                            </div>
                                            <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                                                <input
                                                    className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                                    type="checkbox"
                                                    checked={profile}
                                                    id="checkboxChecked"
                                                    name="profile"
                                                    onChange={() => {
                                                        setProfile(!profile);
                                                    }}


                                                />
                                                <label
                                                    className="inline-block pl-[0.15rem] hover:cursor-pointer"
                                                    htmlFor="checkboxChecked">
                                                    Profile
                                                </label>
                                            </div>


                                        </div>
                                        {/*footer*/}
                                        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                            <button
                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setShowPermission(false)}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded bg-danger hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={handleSubmit}

                                            >
                                                Add Permissions
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                        </>
                    ) : null}


                    {showAddModalAddUser ? (
                        <>


                            <div
                                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                            >
                                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                    {/*content*/}
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                        {/*header*/}
                                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                            <h3 className="text-3xl font-semibold">
                                                Add User Form
                                            </h3>
                                            <button
                                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"

                                            >
                                                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                    ×
                                                </span>
                                            </button>
                                        </div>
                                        {/*body*/}
                                        <div className="relative p-6 flex-auto">
                                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                {/* <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        Add Product Form
        </h2> */}

                                                <nav>
                                                    <ol className="flex items-center gap-2">
                                                        <li>

                                                        </li>
                                                        <li className="text-primary"></li>
                                                    </ol>
                                                </nav>
                                            </div>

                                            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                                                <div className="flex flex-col gap-9">
                                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                                        {/* <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Add Product Form
              </h3>
            </div> */}
                                                        <form action="#">
                                                            <div className="p-6.5">
                                                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                                    <div className="w-full xl:w-1/2">
                                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                                            First Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="First Name"
                                                                            name="first_name" value={values_add_users.first_name} onChange={handleInputChange}
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                        />
                                                                    </div>

                                                                    <div className="w-full xl:w-1/2">
                                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                                            Last Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Last Name"
                                                                            name="last_name" value={values_add_users.last_name} onChange={handleInputChange}
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                                    {/* <div className="w-full xl:w-1/2">
                                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                                            Username
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Username"
                                                                            name="username" value={values_add_users.username} onChange={handleInputChange}
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                        />
                                                                    </div> */}

                                                                    <div className="w-full xl:w-1/1">
                                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                                            Email
                                                                        </label>
                                                                        <input
                                                                            type="email"
                                                                            placeholder="Email"
                                                                            name="email" value={values_add_users.email} onChange={handleInputChange}
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                                    {/* <div className="w-full xl:w-1/2">
                                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                                            Phone Number
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Phone Number"
                                                                            name="phone_number" value={values_add_users.phone_number} onChange={handleInputChange}
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                        />
                                                                    </div> */}

                                                                    {/* <div className="w-full xl:w-1/2">
                                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                                            Gender
                                                                        </label>
                                                                        <select
                                                                            id="gender"
                                                                            name="gender" value={gender} onChange={(e) => setGender(e.target.value)}
                                                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                        >
                                                                            <option value="" disabled selected>Select your gender</option>
                                                                            <option value="Male">Male</option>
                                                                            <option value="Female">Female</option>
                                                                        </select>
                                                                    </div> */}
                                                                </div>

                                                                {/* <div className="w-full xl:w-1/1">
                                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                                        Address
                                                                    </label>
                                                                    <input
                                                                        type="tetx"
                                                                        placeholder="Address"
                                                                        name="address" value={values_add_users.address} onChange={handleInputChange}
                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                    />
                                                                </div> */}



                                                                {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                                    <div className="w-full xl:w-1/2">
                                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                                            City
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="City"
                                                                            name="city" value={values_add_users.city} onChange={handleInputChange}
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                        />
                                                                    </div>

                                                                    <div className="w-full xl:w-1/2">
                                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                                            State
                                                                        </label>
                                                                        <input
                                                                            type="tetx"
                                                                            placeholder="State"
                                                                            name="state" value={values_add_users.state} onChange={handleInputChange}
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                </div> */}
                                                                {/* {!edit_user && 
                                                                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                                  <div className="w-full xl:w-1/2">
                                                                      <label className="mb-2.5 block text-black dark:text-white">
                                                                          Password
                                                                      </label>
                                                                      <input
                                                                          type="password"
                                                                          placeholder="Password"
                                                                          name="password" value={values_add_users.password} onChange={handleInputChange}
                                                                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                      />
                                                                  </div>

                                                                  <div className="w-full xl:w-1/2">
                                                                      <label className="mb-2.5 block text-black dark:text-white">
                                                                          Confirm Password
                                                                      </label>
                                                                      <input
                                                                          type="password"
                                                                          placeholder="Confirm Password"
                                                                          name="confirm_password" value={values_add_users.confirm_password} onChange={handleInputChange}
                                                                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                      />
                                                                  </div>
                                                              </div>
                                                                } */}
                                                               


                                                                {!edit_user &&   <button className="flex w-full justify-center rounded bg-success p-3 font-medium text-white mb-4" onClick={handleSubmitAddUsers} >
                                                                    SAVE  
                                                                </button> }
                                                                {edit_user && <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white mb-4" onClick={handleUserDetailsEdit}>
                                                                 Edit User Details
                                                                  </button>}
                                                                <button className="flex w-full justify-center rounded bg-secondary p-3 font-medium text-white mb-4" onClick={clearDataAddUser}  >
                                                                    Clear
                                                                </button>



                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*footer*/}
                                        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                            <button
                                                className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded bg-danger hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setShowAddModalAddUser(false)}

                                            >
                                                Close
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>



                        </>
                    ) : null}
                </div>


            }

            <ToastContainer />
        </>
    )
}
export default UserList;
