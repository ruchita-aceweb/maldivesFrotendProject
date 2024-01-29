import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import { GrView } from "react-icons/gr";


const UserList = () => {
  const navigate = useNavigate();
  const regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
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
    image_name: "",
  };
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
    id: 0,
  };
  const [values_add_users, setValuesAddUsers] = useState(initialFValuesAddUser);
  const [gender, setGender] = useState("");

  const [values, setValues] = useState(initialFValues);
  const [permission, setPermission] = useState<boolean>(false);
  const [product, setProduct] = useState<boolean>(false);
  const [edit_user, setEditUser] = useState<boolean>(false);
  const [profile, setProfile] = useState<boolean>(false);
  const [road_worthiness, setRoadWorthiness] = useState<boolean>(false);
  const [rental_property, setRentalProperty] = useState<boolean>(false);
  const [service, setService] = useState<boolean>(false);
  const [settings, setSettings] = useState<boolean>(false);
  const [showAddModalAddUser, setShowAddModalAddUser] =
    useState<boolean>(false);
  const [admin, setAdmin] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userFilter, setUsersFilter] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showPermission, setShowPermission] = useState(false);
  const [query, setQuery] = useState("");

  const apiUrl = "http://localhost:3005/";
  const requestConfig = {
    headers: {
      token: localStorage.getItem("token"),
      uu_id: localStorage.getItem("uuID"),
    },
  };
  const getUsers = async () => {
    await axios
      .get(`${apiUrl}admin/all/users`, requestConfig)
      .then((response) => {
        console.log(response.data.users);
        console.log(response.data.users.reverse());
        setUsersFilter(response.data.users.reverse());
        setUsers(response.data.users.reverse());
      })
      .catch((error) => {
        toast.error(error.response.data.error, { theme: "colored" });
      });
  };
  async function getUserDetails(
    first_name: any,
    last_name: any,
    username: any,
    email: any,
    phone_number: any,
    address: any,
    city: any,
    state: any,
    gender: any,
    image_name: any,
    created_at: any
  ) {
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
      created_at: created_at,
    }));

    setShowModal(true);
  }
  const openModalEditUser = async (
    first_name: any,
    last_name: any,
    username: any,
    email: any,
    phone_number: any,
    address: any,
    city: any,
    state: any,
    gender: any,
    image_name: any,
    created_at: any,
    id: any
  ) => {
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
      id: id,
    }));
    setGender(gender);

    setEditUser(true);
    setShowAddModalAddUser(true);
  };
  const addPermissionModalOpen = async (id: any) => {
    setShowPermission(true);
    setValues((prevValues) => ({
      ...prevValues,
      id: id,
    }));
    setService(false);
    setProduct(false);
    setAdmin(false);
    setProfile(false);
    setRoadWorthiness(false);
    setRentalProperty(false);
    await axios
      .get(`${apiUrl}admin/permissions/${id}`, requestConfig)
      .then((response) => {
        console.log(response.data.user_permissions);
        for (let i = 0; i < response.data.user_permissions.length; i++) {
          if (response.data.user_permissions[i].Name === "profile") {
            setProfile(response.data.user_permissions[i].Value);
          }
          if (response.data.user_permissions[i].Name === "product") {
            setProduct(response.data.user_permissions[i].Value);
          }
          if (response.data.user_permissions[i].Name === "admin") {
            setAdmin(response.data.user_permissions[i].Value);
          }
          if (response.data.user_permissions[i].Name === "service") {
            setService(response.data.user_permissions[i].Value);
          }
          if (response.data.user_permissions[i].Name === "road_worthiness") {
            setRoadWorthiness(response.data.user_permissions[i].Value);
          }
          if (response.data.user_permissions[i].Name === "rental_property") {
            setRentalProperty(response.data.user_permissions[i].Value);
          }
        }
      })
      .catch((error) => {
        toast.error(error.response.data.error, { theme: "colored" });
      });
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const requestBody = {
      user_user_id: values.id,
      data: [
        { Name: "profile", Value: profile },
        { Name: "admin", Value: admin },
        { Name: "service", Value: service },
        { Name: "settings", Value: settings },
        { Name: "road_worthiness", Value: road_worthiness },
        { Name: "rental_property", Value: rental_property },
        { Name: "product", Value: product },
      ],
    };
    console.log(requestBody.data);
    await axios
      .post(`${apiUrl}admin/add/user/roles`, requestBody, requestConfig)
      .then((response) => {
        toast.success("Permissions Added Successfully", { theme: "colored" });
        setShowPermission(false);
      })
      .catch((error) => {
        toast.error(error.response.data.error, { theme: "colored" });
      });
  };
  const openModalAddUsers = async (event: React.FormEvent) => {
    setShowAddModalAddUser(true);
    setValuesAddUsers(initialFValuesAddUser);
  };

  const getUserPermissions = async () => {
    await axios
      .get(`${apiUrl}user/permissions`, requestConfig)
      .then((response) => {
        for (let i = 0; i < response.data.user_permissions.length; i++) {
          if (response.data.user_permissions[i].Name == "admin") {
            setPermission(response.data.user_permissions[i].Value);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const getSearch = e.target.value;
    if (getSearch.length > 0) {
      const searchData = users.filter(
        (item) =>
          item.email.toLowerCase().includes(getSearch.toLowerCase()) ||
          item.email.toUpperCase().includes(getSearch.toUpperCase()) ||
          item.username.toUpperCase().includes(getSearch.toUpperCase()) ||
          item.username.toUpperCase().includes(getSearch.toUpperCase())
      );
      setUsersFilter(searchData);
    } else {
      setUsersFilter(users);
    }
    setQuery(getSearch);
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

    if (!regex.test(values_add_users.email) || values_add_users.email == "") {
      toast.error("Please check your email", { theme: "colored" });
    } else if (values_add_users.first_name == "") {
      toast.error("Please check your first name", { theme: "colored" });
    } else if (values_add_users.last_name == "") {
      toast.error("Please check your last name", { theme: "colored" });
    } else {
      const requestBody = {
        email: values_add_users.email,
        first_name: values_add_users.first_name,
        last_name: values_add_users.last_name,
        gender: "-",
        phone_number: "pending",
        password: "pending",
        username: "pending",
        address: "pending",
        city: "pending",
        state: "pending",
      };
      await axios
        .post(`${apiUrl}admin/add/users`, requestBody)
        .then((response) => {
          toast.success("User Added Successfully", { theme: "colored" });
          getUsers();
          setShowAddModalAddUser(false);
          setValuesAddUsers(initialFValuesAddUser);
        })
        .catch((error) => {
          toast.error(error.response.data.error, { theme: "colored" });
        });
    }
  };

  const clearDataAddUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setValuesAddUsers(initialFValuesAddUser);
  };
  const handleUserDetailsEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(values);
    console.log(gender);

    if (!regex.test(values_add_users.email) || values_add_users.email == "") {
      toast.error("Please check your email", { theme: "colored" });
    } else if (values_add_users.first_name == "") {
      toast.error("Please check your first name", { theme: "colored" });
    } else if (values_add_users.last_name == "") {
      toast.error("Please check your last name", { theme: "colored" });
    } else if (values_add_users.phone_number == "") {
      toast.error("Please check your  phone number", { theme: "colored" });
    } else if (values_add_users.username == "") {
      toast.error("Please check your username", { theme: "colored" });
    } else if (values_add_users.address == "") {
      toast.error("Please check your address", { theme: "colored" });
    } else if (values_add_users.city == "") {
      toast.error("Please check your city", { theme: "colored" });
    } else if (values_add_users.state == "") {
      toast.error("Please check your state", { theme: "colored" });
    } else if (gender == "") {
      toast.error("Please check your gender", { theme: "colored" });
    } else {
      const requestBody = {
        email: values_add_users.email,
        first_name: values_add_users.first_name,
        last_name: values_add_users.last_name,
        gender: gender,
        phone_number: values_add_users.phone_number,
        username: values_add_users.username,
        address: values_add_users.address,
        city: values_add_users.city,
        state: values_add_users.state,
        id: values_add_users.id,
      };
      await axios
        .post(`${apiUrl}user/details/update`, requestBody, requestConfig)
        .then((response) => {
          toast.success("User Details Updated", { theme: "colored" });
          getUsers();
          setGender("");
          setEditUser(false);
          setShowAddModalAddUser(false);
        })
        .catch((error) => {
          toast.error(error.response.data.error, { theme: "colored" });
        });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      navigate("/auth/signin");
    }
    getUsers();
    getUserPermissions();
  }, []);
  return (
    <>
      {!permission && <h2>No Access For You.!</h2>}
      {permission && (
        <div>
          <div>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <h4 className="mb-6 text-2xl font-semibold text-black dark:text-white">
                User List
              </h4>
              <div className="flex mb-2.5 flex-col gap-8 xl:flex-row">
                <div className="flex-1">
                  <label className="mb-2.5 block text-sm text-black dark:text-white">
                    Search User Name or email
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      onChange={handleSearch}
                      placeholder="Search Username Name or Email"
                      className="flex-1 text-sm rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="mb-2.5 block text-sm text-black dark:text-white">
                    Add new user
                  </label>
                  <button
                    className="w-full rounded-full text-sm bg-danger p-2.5 font-medium text-white"
                    onClick={openModalAddUsers}
                  >
                    Add User
                  </button>
                </div>
              </div>
              </div>
              <div className="flex flex-col">
                <div className="rounded-sm border border-stroke bg-white px-5 pt-2.5 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 ">
                  <div className="max-w-full overflow-x-auto">
                    <h4 className=" text-xl font-semibold text-black dark:text-white">
                      View Users
                    </h4>
                    </div>
                    </div>
                    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark  xl:pb-1">
            
                  <div className="max-w-full overflow-x-auto">
                    {/* <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                      View Recycled Product
                    </h4> */}
                    <table className="w-full table-auto">
  <thead>
    <tr className="bg-gray-2 text-left dark:bg-meta-4">
    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white ">
Profile
      </th>
      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white ">
      Name
      </th>
      <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
      Username
      </th>
      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
      Email
      </th>
      <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
      Phone Number
      </th>
     
      <th className="py-4 px-4 font-medium text-black dark:text-white">
      Action
      </th>
    </tr>
  </thead>
  <tbody>
    {userFilter.map((item, index) => {
      return (
        <tr key={index}>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
          <img
                                  src={`${apiUrl}/${item.image_name}`}
                                  alt="User"
                                />
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            <p className="text-black dark:text-white">  {item.first_name} {item.last_name}</p>
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            <p className="text-black dark:text-white"> {item.username}</p>
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            <p className="text-black dark:text-white">   {item.email}</p>
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            <p className="text-black dark:text-white">{item.phone_number}</p>
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            <div className="flex items-center space-x-3.5">
              <button className="text-sm px-1 py-1"   onClick={() =>
                                  getUserDetails(
                                    item.first_name,
                                    item.last_name,
                                    item.username,
                                    item.email,
                                    item.phone_number,
                                    item.address,
                                    item.city,
                                    item.state,
                                    item.gender,
                                    item.image_name,
                                    item.created_at
                                  )
                                }>
                 {/* View More */}<GrView />

              </button>
              <button className="text-sm  px-1 py-1"     onClick={() => addPermissionModalOpen(item.id)}>
              {/* Add Permissions */}<MdOutlineSecurity />
              </button>
              <button className="text-sm w-25  px-1 py-1"    onClick={() =>
                                  openModalEditUser(
                                    item.first_name,
                                    item.last_name,
                                    item.username,
                                    item.email,
                                    item.phone_number,
                                    item.address,
                                    item.city,
                                    item.state,
                                    item.gender,
                                    item.image_name,
                                    item.created_at,
                                    item.id
                                  )
                                }>
                  <MdModeEdit />
              </button>
            </div>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>

                  </div>
                </div>
                  
                
              </div>
            
          </div>
          {showModal ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-2xl text-black font-bold">User Details</h3>
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
                      <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                        {" "}
                        <img
                          className="mx-auto"
                          src={`${apiUrl}/${values.image_name}`}
                          alt="User"
                        />
                      </p>
                      <p className="my-4  text-sm ">
                    <span className="font-bold text-sm">First Name: </span>    {values.first_name}
                      </p>
                      <p className="my-4 text-blueGray-500 text-sm leading-relaxed">
                      <span className="font-bold text-sm"> Last Name:</span>{values.last_name}
                      </p>
                      <p className="my-4 text-blueGray-500 text-sm leading-relaxed">
                      <span className="font-bold text-sm"> Username: </span>{values.username}
                      </p>
                      <p className="my-4 text-blueGray-500 text-sm leading-relaxed">
                      <span className="font-bold text-sm">  Email: </span>{values.email}
                      </p>
                      <p className="my-4 text-blueGray-500 text-sm leading-relaxed">
                      <span className="font-bold text-sm"> Phone Number:</span> {values.phone_number}
                      </p>
                      <p className="my-4 text-blueGray-500 text-sm leading-relaxed">
                      <span className="font-bold text-sm">  Address: </span>{values.address}
                      </p>
                      <p className="my-4 text-blueGray-500 text-sm leading-relaxed">
                      <span className="font-bold text-sm"> City:</span> {values.city}
                      </p>
                      <p className="my-4 text-blueGray-500 text-sm leading-relaxed">
                      <span className="font-bold text-sm"> State: </span>{values.state}
                      </p>
                      <p className="my-4 text-blueGray-500 text-sm leading-relaxed">
                      <span className="font-bold text-sm">    Gender: </span>{values.gender}
                      </p>
                      <p className="my-4 text-blueGray-500 text-sm leading-relaxed">
                      <span className="font-bold text-sm">  Created date:</span> {values.created_at}
                      </p>
                    </div>

                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-red-500 rounded-full bg-danger text-white  px-6 py-2 text-xs outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          setShowModal(false), setValues(initialFValues);
                        }}
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
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-2xl text-black font-bold">Add Permission</h3>
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
                          htmlFor="checkboxChecked"
                        >
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
                          htmlFor="checkboxChecked"
                        >
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
                          htmlFor="checkboxChecked"
                        >
                          Profile
                        </label>
                      </div>
                      <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                        <input
                          className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                          type="checkbox"
                          checked={rental_property}
                          id="checkboxChecked"
                          name="rental_property"
                          onChange={() => {
                            setRentalProperty(!rental_property);
                          }}
                        />
                        <label
                          className="inline-block pl-[0.15rem] hover:cursor-pointer"
                          htmlFor="checkboxChecked"
                        >
                          Rental Property
                        </label>
                      </div>
                      <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                        <input
                          className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                          type="checkbox"
                          checked={service}
                          id="checkboxChecked"
                          name="service"
                          onChange={() => {
                            setService(!service);
                          }}
                        />
                        <label
                          className="inline-block pl-[0.15rem] hover:cursor-pointer"
                          htmlFor="checkboxChecked"
                        >
                          Service
                        </label>
                      </div>
                      <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                        <input
                          className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                          type="checkbox"
                          checked={settings}
                          id="checkboxChecked"
                          name="settings"
                          onChange={() => {
                            setSettings(!settings);
                          }}
                        />
                        <label
                          className="inline-block pl-[0.15rem] hover:cursor-pointer"
                          htmlFor="checkboxChecked"
                        >
                          Settings
                        </label>
                      </div>

                      <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                        <input
                          className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                          type="checkbox"
                          checked={road_worthiness}
                          id="checkboxChecked"
                          name="road_worthiness"
                          onChange={() => {
                            setRoadWorthiness(!road_worthiness);
                          }}
                        />
                        <label
                          className="inline-block pl-[0.15rem] hover:cursor-pointer"
                          htmlFor="checkboxChecked"
                        >
                          Road Worthiness
                        </label>
                      </div>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                        className=" text-white active:bg-blue-600 font-semibold px-6 py-2 text-xs rounded-full bg-danger hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={handleSubmit}
                      >
                        Add Permissions
                      </button>
                      <button
                        className="text-red-500 background-transparent font-semibold text-xs px-6 py-2 bg-danger rounded-full text-white  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowPermission(false)}
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

          {showAddModalAddUser ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-2xl font-bold text-black">
                        Add User Form
                      </h3>
                      <button className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
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
                            <li></li>
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
                                    <label className="mb-2.5 block text-black text-sm dark:text-white">
                                      First Name
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="First Name"
                                      name="first_name"
                                      value={values_add_users.first_name}
                                      onChange={handleInputChange}
                                      className="w-full rounded border-[1.5px] border-stroke bg-transparent text-sm py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                  </div>

                                  <div className="w-full xl:w-1/2">
                                    <label className="mb-2.5  text-sm block text-black dark:text-white">
                                      Last Name
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Last Name"
                                      name="last_name"
                                      value={values_add_users.last_name}
                                      onChange={handleInputChange}
                                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 text-sm px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                                    <label className="mb-2.5 text-sm block text-black dark:text-white">
                                      Email
                                    </label>
                                    <input
                                      type="email"
                                      placeholder="Email"
                                      name="email"
                                      value={values_add_users.email}
                                      onChange={handleInputChange}
                                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 text-sm px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
 <div className="flex justify-end gap-2">
    <div>
                                {!edit_user && (
                                   
                                  <button
                                    className="flex text-xs w-30 justify-center rounded bg-success p-2 font-medium text-white mb-2"
                                    onClick={handleSubmitAddUsers}
                                  >
                                    Save
                                  </button>
                                )}
                                </div>
                                
                                {edit_user && (
                                  <button
                                    className="flex text-xs w-30 justify-center rounded-full bg-primary p-2 font-medium text-white mb-2"
                                    onClick={handleUserDetailsEdit}
                                  >
                                    Edit User Details
                                  </button>
                                )}
                                <div>
                                <button
                                  className="flex text-xs w-30 justify-center rounded-full bg-secondary p-2 font-medium text-white mb-2"
                                  onClick={clearDataAddUser}
                                >
                                  Clear
                                </button>
                                </div>
                              </div>
                              </div>
                            </form>
                          </div>
                        </div>
                       
                      </div>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-xs rounded-full text-white active:bg-blue-600 font-bold   px-6 py-2 rounded bg-danger hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
      )}

      <ToastContainer />
    
    </>
  );
};
export default UserList;
