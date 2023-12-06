import { useState, useEffect } from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TableOne = () => {
  const apiUrl = 'http://localhost:3005/';
  const requestConfig = {
    headers: {
      'token': localStorage.getItem('token'),
      'uu_id': localStorage.getItem('uuID')

    }
  }
  const initialFValues = {
    id: 0,
    product_name: "",
    price: 0,
  }
 
  const initialFValuesReplicate = {
    id: 0,
    product_name: "",
    price: 0,
    created_at:""
  }
  const [permission, setPermission] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddRepModal, setShowAddRepModal] = useState(false);
  const [showModalActive, setShowModalActive] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [delete_ID, setDeleteID] = useState(0);
  const [values, setValues] = useState(initialFValues);
  const [value_rep, setValuesRep] = useState(initialFValuesReplicate);
  const [products, setProducts] = useState<any[]>([])
  const [productsFilter, setProductsFilter] = useState<any[]>([])
  const [edit, setEdit] = useState(false);
  const [active, setActive] = useState(true);
  const [query, setQuery] = useState("")
  const [rep_product_name, setRepProductName] = useState("")
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleInputChangeRep = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValuesRep({
      ...value_rep,
      [name]: value,
    });
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const getSearch = e.target.value
    if (getSearch.length > 0) {
      const searchData = products.filter((item) => item.product_name.toLowerCase().includes(getSearch.toLowerCase()) || item.product_name.toUpperCase().includes(getSearch.toUpperCase()))
      setProductsFilter(searchData)

    } else {
      setProductsFilter(products)
    }
    setQuery(getSearch)
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(values.product_name)
    if (values.product_name == "") {
      toast.error("Please check product name", { theme: 'colored' })
    }
    else if (values.price == 0 || values.price < 0) {
      toast.error("Please check price", { theme: 'colored' })
    }
    else {
      const requestBody = {
        "product_name": values.product_name,
        "price": values.price,
        "Content-Type": 'application/json'
      }

      await axios.post(`${apiUrl}user/product/add`, requestBody, requestConfig).then(response => {
        toast.success("Product Added Successfully", { theme: 'colored' })
        setValues(initialFValues)
        setShowAddModal(false)
        getProduct()

      }).catch(error => {
        toast.error(error.response.data.error, { theme: 'colored' })
      })

    }
  }
  const handleSubmitRep = async (event: React.FormEvent) => {
    event.preventDefault();
   
    if (rep_product_name == "") {
      toast.error("Please check product name", { theme: 'colored' })
    }
    else if (value_rep.price == 0 || value_rep.price < 0) {
      toast.error("Please check price", { theme: 'colored' })
    }
    else {
      const requestBody = {
        "product_name": rep_product_name,
        "price": value_rep.price,
        "created_at":value_rep.created_at,
        "Content-Type": 'application/json'
      }

      await axios.post(`${apiUrl}user/product/add`, requestBody, requestConfig).then(response => {
        toast.success("Product Added Successfully", { theme: 'colored' })
        setValuesRep(initialFValuesReplicate)
        setShowAddRepModal(false)
        getProduct()

      }).catch(error => {
        toast.error(error.response.data.error, { theme: 'colored' })
      })

    }
  }
  const getProduct = async () => {
    await axios.get(`${apiUrl}user/product/view`, requestConfig).then(response => {

      setProductsFilter(response.data.products.reverse())
      setProducts(response.data.products.reverse())
    }).catch(error => {
      toast.error(error.response.data.error, { theme: 'colored' })
    })


  }
  const deleteProduct = async (event: React.FormEvent) => {

    event.preventDefault();
    await axios.get(`${apiUrl}user/product/delete/${delete_ID}`, requestConfig).then(response => {
      toast.success("Product Added To Recycle", { theme: 'colored' })
      getProduct()
      setShowModal(false)
    }).catch(error => {
      toast.error(error.response.data.error, { theme: 'colored' })
    })
  }
  const deleteRecycleProduct = async (event: React.FormEvent) => {

    event.preventDefault();
    await axios.delete(`${apiUrl}user/product/delete/${delete_ID}`, requestConfig).then(response => {
      toast.success("Product Deleted", { theme: 'colored' })
      getProduct()
      setShowModalDelete(false)
    }).catch(error => {
      toast.error(error.response.data.error, { theme: 'colored' })
    })
  }
  const activeProduct = async (event: React.FormEvent) => {

    event.preventDefault();
    await axios.get(`${apiUrl}user/product/active/${delete_ID}`, requestConfig).then(response => {
      toast.success("Product Activated", { theme: 'colored' })
      getProduct()
      setShowModalActive(false)
    }).catch(error => {
      toast.error(error.response.data.error, { theme: 'colored' })
    })
  }
  const clearData = async (event: React.FormEvent) => {
    event.preventDefault();
    setValues(initialFValues)
    setEdit(false)
  }
  const clearDataRep = async (event: React.FormEvent) => {
    event.preventDefault();
    setValuesRep(initialFValuesReplicate)
    setRepProductName('')
    
  }
  async function editProduct(id: any, product_name: any, price: number) {
    setEdit(true)
    setShowAddModal(true)
    setValues({
      id: id,
      product_name: product_name,
      price: price
    })
  }
  async function openDeleteModalReplicate(id: any, product_name: any, price: number,date:any) {
    setShowAddRepModal(true)
    setValuesRep({
      id: id,
      product_name: product_name,
      price: price,
      created_at:date
    })
  }
  
  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (values.product_name == "") {
      toast.error("Please check product name", { theme: 'colored' })
    }
    else if (values.price == 0 || values.price < 0) {
      toast.error("Please check price", { theme: 'colored' })
    }
    else {
      const requestBody = {
        "product_name": values.product_name,
        "price": values.price,
        "id": values.id,
        "Content-Type": 'application/json'
      }

      await axios.post(`${apiUrl}user/product/add`, requestBody, requestConfig).then(response => {
        toast.success("Product Updated Successfully", { theme: 'colored' })
        setValues(initialFValues)
        getProduct()
        setEdit(false)
        setShowAddModal(false)

      }).catch(error => {
        toast.error(error.response.data.error, { theme: 'colored' })
      })

    }
  }
  const handleActive = async (event: React.FormEvent) => {
    event.preventDefault();
    setActive(false)

  }
  const handleRecycled = async (event: React.FormEvent) => {
    event.preventDefault();
    setActive(true)

  }
  const getUserPermissions = async () => {
    await axios.get(`${apiUrl}user/permissions`, requestConfig).then(response => {
     for(let i=0;i<response.data.user_permissions.length;i++){
         if(response.data.user_permissions[i].Name=="product"){
           //if(response.data.user_permissions[i].Value){
            setPermission(response.data.user_permissions[i].Value)
          // }
           if(!response.data.user_permissions[i].Value){
            setPermission(false)
           }
        }
          
         

      }
   }).catch(error => {
     console.log(error)
    })


  }
  async function openDeleteModal(id: any) {
    setShowModal(true)
    setDeleteID(id)
  }
  async function openActiveModal(id: any) {
    setShowModalActive(true)
    setDeleteID(id)
  }
  async function openRecycleModal(id: any) {
    setShowModalDelete(true)
    setDeleteID(id)
  }

  useEffect(() => {
    getUserPermissions()
    getProduct();

  }, [])
  return (
     <>
     {!permission && <h2>No Access For You.!</h2>}
     {permission && 
      <div>
      <div className="w-full xl:w-1/4">
              <label className="mb-2.5 block text-black dark:text-white">
               Add new product
              </label>
              <button className="flex w-full justify-center rounded bg-danger p-3 font-medium text-white mb-4"  onClick={() => setShowAddModal(true)}>
              ADD PRODUCT
              </button>
            </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Your Products List
        </h4>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Search Prosuct Name
            </label>
            <input
              type="text"
              placeholder="Search Prosuct Name"
              onChange={handleSearch}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          {active && <div className="w-full xl:w-1/4">
            <label className="mb-2.5 block text-black dark:text-white">
              View Active Product
            </label>
            <button className="flex w-full justify-center rounded bg-warning p-3 font-medium text-white mb-4" onClick={handleActive} >
             Tresh
            </button>
          </div>}

          {!active &&
            <div className="w-full xl:w-1/4">
              <label className="mb-2.5 block text-black dark:text-white">
                View Recycled Product
              </label>
              <button className="flex w-full justify-center rounded bg-danger p-3 font-medium text-white mb-4" onClick={handleRecycled}>
                Recycled Product
              </button>
            </div>
          }

        </div>

        {/* Active Product */}
        {active && <div className="flex flex-col">

          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
              <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                View Active Product
              </h4>
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      #
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Product Name
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Price
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Date
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>


                  {productsFilter.map((item, index) => {
                    if ((item.status) == "1") {
                      return (
                        <tr key={index} >
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"> <p className="text-black dark:text-white">{index + 1}</p></td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"> <p className="text-black dark:text-white">{item.product_name}</p></td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"><p className="text-black dark:text-white">{item.price}</p></td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"><p className="text-black dark:text-white">{item.created_at}</p></td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <div className="flex items-center space-x-3.5">
                              <button className="hover:text-primary" style={{ color: 'green' }} onClick={() => editProduct(item.id, item.product_name, item.price)}>
                                Edit
                              </button>
                              <button className="hover:text-primary" style={{ color: '#FFA533' }} onClick={() => openDeleteModalReplicate(item.id, item.product_name, item.price,item.created_at)}>
                                Replicate
                              </button>

                              <button className="hover:text-primary" style={{ color: 'red' }} onClick={() => openDeleteModal(item.id)}>
                                Add To Recycle
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    }

                  })}

                </tbody>
              </table>
            </div>
          </div>

        </div>}


        {/* Recycled Product */}
        {!active &&
          <div className="flex flex-col">

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <div className="max-w-full overflow-x-auto">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                  View Recycled Product
                </h4>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                        #
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Product Name
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Price
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Date
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>


                    {productsFilter.map((item, index) => {
                      if ((item.status) == "2") {
                        return (
                          <tr key={index} >
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"> <p className="text-black dark:text-white">{index + 1}</p></td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"> <p className="text-black dark:text-white">{item.product_name}</p></td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"><p className="text-black dark:text-white">{item.price}</p></td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"><p className="text-black dark:text-white">{item.created_at}</p></td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <div className="flex items-center space-x-3.5">
                                <button className="hover:text-primary" style={{ color: 'green' }} onClick={() => editProduct(item.id, item.product_name, item.price)}>
                                  Edit 
                                </button>

                                <button className="hover:text-primary" style={{ color: '#3333FF' }} onClick={() => openActiveModal(item.id)}>
                                  Active
                                </button>
                                <button className="hover:text-primary" style={{ color: 'red' }} onClick={() => openRecycleModal(item.id)}>
                                  Delete
                                </button>

                              </div>
                            </td>

                          </tr>
                        );
                      }

                    })}

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        }

      </div>
      <ToastContainer />
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
                    Delete Product
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
                    Are you sure you want to add this product to recycle?
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
                    onClick={deleteProduct}
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

      {showModalActive ? (
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
                    Active Product
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalActive(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    Are you sure you want to add this product to active?
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModalActive(false)}
                  >
                    No
                  </button>
                  <button
                    className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded bg-danger hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={activeProduct}
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

     

      {showModalDelete ? (
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
                    Delete Product
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalDelete(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    Are you sure you want to add this product to delete?
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModalDelete(false)}
                  >
                    No
                  </button>
                  <button
                    className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded bg-danger hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={deleteRecycleProduct}
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

{showAddModal ? (
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
                  Add Product Form
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowAddModal(false)}
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
                      Prosuct Name
                    </label>
                    <input
                      type="text"
                      placeholder="Prosuct Name"
                      name="product_name" value={values.product_name} onChange={handleInputChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Product Price
                    </label>
                    <input
                      type="number"
                      placeholder="Prosuct Price"
                      name="price" value={values.price} onChange={handleInputChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                {!edit && <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white mb-4" onClick={handleSubmit}>
                  Add Product
                </button>}
                {edit && <button className="flex w-full justify-center rounded bg-success p-3 font-medium text-white mb-4" onClick={handleEditSubmit} >
                  Edit Product
                </button>}
                <button className="flex w-full justify-center rounded bg-secondary p-3 font-medium text-white mb-4" onClick={clearData} >
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
                    onClick={() => setShowAddModal(false)}
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


{showAddRepModal ? (
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
                  Replicate Product Form
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowAddRepModal(false)}
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
                      Prosuct Name
                    </label>
                    <input
                      type="text"
                      placeholder="Prosuct Name"
                      name="product_name_rep" value={rep_product_name} onChange={(e)=>setRepProductName(e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Product Price
                    </label>
                    <input
                      type="number"
                      placeholder="Prosuct Price"
                      name="price_rep" value={value_rep.price} onChange={handleInputChangeRep}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                 <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white mb-4" onClick={handleSubmitRep}>
                  Replicate Product
                </button>
               
                <button className="flex w-full justify-center rounded bg-secondary p-3 font-medium text-white mb-4" onClick={clearDataRep} >
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
                    onClick={() => setShowAddRepModal(false)}
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
     </>
    

  );
};

export default TableOne;
