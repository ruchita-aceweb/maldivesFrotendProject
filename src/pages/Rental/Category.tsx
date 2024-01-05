

import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

interface FormValues {
  id: number | undefined;
  title: string;
 
  
}
const Category = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<any[]>([])
  const [delete_ID, setDeleteID] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = 'http://localhost:3005/';
  const [permission, setPermission] = useState(false);
  const requestConfig = {
    headers: {
      'token': localStorage.getItem('token'),
      'uu_id': localStorage.getItem('uuID')

    }
  }

const initialFValues: FormValues = {
  id: undefined,
  title: "",
  
};

const [values, setValues] = useState<FormValues>(initialFValues);

  const addCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    setValues(initialFValues);
    setShowModalAdd(true)

  }

  const getUserPermissions = async () => {
    await axios.get(`${apiUrl}user/permissions`, requestConfig).then(response => {
      for (let i = 0; i < response.data.user_permissions.length; i++) {
        
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
  const getCategory = async () => {
    await axios.get(`${apiUrl}admin/view/rental/category`, requestConfig).then(response => {

      setCategory(response.data.caregory.reverse())
    }).catch(error => {
      toast.error(error.response.data.error, { theme: 'colored' })
    })


  }
  async function openDeleteModal(id: any) {
    setShowModal(true)
    setDeleteID(id)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const deleteCategory = async (event: React.FormEvent) => {

    event.preventDefault();
    await axios.delete(`${apiUrl}admin/rental/category/delete/${delete_ID}`, requestConfig).then(response => {
      toast.success("Category Deleted", { theme: 'colored' })
      getCategory()
      setShowModal(false)
    }).catch(error => {
      toast.error(error.response.data.error, { theme: 'colored' })
    })
  }
  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

   if (values.title === "") {
      toast.error("Please select the property type", { theme: 'colored' });
    }  else {
      setLoading(true);
     
  
   
    const formData: FormValues = {
      title:values.title,
      id: values.id !== undefined ? values.id : 0,
    };
      try {
        await axios.post(`${apiUrl}admin/add/rental/category`, formData, requestConfig);
        toast.success("New category Added", { theme: 'colored' });
        setValues(initialFValues);
        setShowModalAdd(false);
        getCategory()
        
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
  async function editCategory(id: any,title:any) {
   
    setValues({
      id: id,
      title: title,
    })
    setShowModalAdd(true)
  }
  useEffect(() => {
    getUserPermissions()
    getCategory()

  }, [])
  return (
    <>
      {!permission && <h2>No Access For You.!</h2>}
      {permission &&
        <div>
          <div className="w-full xl:w-1/4">
            <label className="mb-2.5 block text-black dark:text-white">
              Rental Property
            </label>
            <button className="flex w-full justify-center rounded bg-danger p-3 font-medium text-white mb-4" onClick={addCategory}>
              ADD CATEGORY
            </button>
          </div>

          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">

              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      #
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Property Type
                    </th>
                    
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Areated At
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Updated At
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {category.map((item, index) => {

                    return (

                      <tr>
                        <td className="py-5 px-4 pl-9 xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">

                          </h5>
                          <p className="text-sm">{index + 1}</p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-black dark:text-white">{item.title}</p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                            {item.created_at}
                          </p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                            {item.updated_at}
                          </p>
                        </td>
                        <td className="py-5 px-4">
                          <div className="flex items-center space-x-3.5">
                            <button className="hover:text-primary"
                              onClick={() => editCategory(item.id,item.title)}
                             
                            >
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >

                                <path
                                  d="M4.66748 15.3296L14.684 5.31306L12.6869 3.31594L2.67041 13.3324L4.66748 15.3296ZM15.0909 4.84247C15.1849 4.74848 15.1849 4.586 15.0909 4.49198L13.2023 2.60342C13.1083 2.50944 12.9458 2.50944 12.8518 2.60342L11.3742 4.081L13.3713 6.07812L14.8489 4.60055C14.9429 4.50656 15.1054 4.50656 15.1994 4.60055L15.0909 4.84247Z"
                                  fill=""
                                />
                              </svg>

                            </button>
                            <button className="hover:text-primary"
                              onClick={() => openDeleteModal(item.id)}
                            >
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                  fill=""
                                />
                                <path
                                  d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                  fill=""
                                />
                                <path
                                  d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                  fill=""
                                />
                                <path
                                  d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                  fill=""
                                />
                              </svg>
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })}


                </tbody>
              </table>
            </div>
            <ToastContainer />
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
                        Delete Category
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
                      <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                        Are you sure you want to delete this category?
                      </p>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        No
                      </button>
                      <button
                        className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded bg-danger hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={deleteCategory}
                      >
                        Yes
                      </button>

                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}




          {showModalAdd ? (
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
                        Add  Rent Property Category Title
                      </h3>
                      <button
                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => setShowModalAdd(false)}
                      >
                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                          ×
                        </span>
                      </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto">
                      <div className="flex-col w-full">
                        <label className="mb-3 block text-black dark:text-white">Title</label>
                        <input
                          name="title"
                          value={values.title}
                          onChange={handleInputChange}
                          type="text"
                          placeholder="Property Category"
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModalAdd(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded bg-danger hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleEditSubmit}
                  >
                    Save
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
   </>
  )
}

export default Category;
