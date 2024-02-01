import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const ViewMore = () => {
  const { id } = useParams<{ id: string }>();
  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate();
  const apiUrl = "http://localhost:3005/";

  const requestConfig = {
    headers: {
      token: localStorage.getItem("token"),
      uu_id: localStorage.getItem("uuID"),
    },
  };
  const socketRef = useRef<WebSocket | null>(null);
  const socket = new WebSocket("ws://localhost:3006");
  const initialFValues = {
    id: 0,
    service_type: "",
    name: "",
    phone_number: "",
    customer_id: "",
    email: "",
    engine_serial_no: "",
    model: "",
    vehicle_number: "",
    vehicle_type: "",
    ID_copy_of_current_owner: "",
    ID_copy_of_new_owne: "",
    vehicle_registry_copy: "",
    file_name_1: "",
    file_name_2: "",
    file_name_3: "",
    location: "",
  };

  const [doc_status, setDpcStatus] = useState("");
  const [message, setMessage] = useState<string>("");

  const [values, setValues] = useState(initialFValues);
  const [service, setService] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newDoc, setNowDoc] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [permission, setPermission] = useState(false);
  const [permission_service, setPermission_service] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [isDivVisible, setIsDivVisible] = useState(false);

  // const [isDivVisible, setDivVisibility] = useState(true);

  // Add your other state variables and event handlers

  



  const handleButtonClick = () => {
    setIsDivVisible(!isDivVisible);
  };
  const closemodel=() =>{
    setIsDivVisible(false);
  }

  const spinnerStyle = {
    border: "4px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTop: "4px solid #ffffff",
    width: "20px",
    height: "20px",
    animation: "spin 1s linear infinite",
  };
  const [selectedFiles, setSelectedFile] = useState<File | null>(null);
  const getService = async () => {
    await axios
      .get(`${apiUrl}admin/view/more/${id}`, requestConfig)
      .then((response) => {
        console.log(response.data);
        setService(response.data);
        setNowDoc(response.data.location);
        setValues((prevValues) => ({
          ...prevValues,
          service_type: response.data.data.service_type,
          name:
            response.data.data.first_name + " " + response.data.data.last_name,
          phone_number: response.data.data.phone_number,
          customer_id: response.data.data.id,
          email: response.data.data.email,
          vehicle_type: response.data.data.data[0].vehicle_type,
          engine_serial_no: response.data.data.data[0].engine_serial_no,
          vehicle_number: response.data.data.data[0].vehicle_number,
          model: response.data.data.data[0].model,
          ID_copy_of_current_owner: `${response.data.data.location}${response.data.location[0].Key}`,
          ID_copy_of_new_owne: `${response.data.data.location}${response.data.location[1].Key}`,
          vehicle_registry_copy: `${response.data.data.location}${response.data.location[2].Key}`,
          file_name_1: response.data.location[0].Key.split("--")[1],
          file_name_2: response.data.location[1].Key.split("--")[1],
          file_name_3: response.data.location[2].Key.split("--")[1],
          location: response.data.data.location,
        }));
      })
      .catch((error) => {
        toast.error(error.response.data.error, { theme: "colored" });
      });
  };
  useEffect(() => {
    const handleOpen = (event: Event) => {
      console.log("Connected");
    };

    const handleMessage = (event: MessageEvent) => {
      console.log(JSON.parse(event.data).reverse());
      setComments(JSON.parse(event.data).reverse());
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    socket.send(JSON.stringify(id));
  };

  const sendReview = async (event: React.FormEvent) => {
    event.preventDefault();

    if (comment === "") {
      toast.error("Please comment", { theme: "colored" });
    } else {
      setLoading(true);

    
    
      const requestBody = {
        service_request_id: id,
        comment: comment,
        "Content-Type": "application/json",
      };

      try {
        await axios.post(
          `${apiUrl}admin/send/review`,
          requestBody,
          requestConfig
        );

        toast.success("Send Successfully Review", { theme: "colored" });
        setComment("");
        getService();
        getComments();
        sendMessage();
      } catch (error) {
        //toast.error(error.response.data.error, { theme: 'colored' });
        console.log("err");
      } finally {
        setLoading(false);
      }
    }
    // after button click hide div
    setIsDivVisible(false);
  };
  const getUserPermissions = async () => {
    await axios
      .get(`${apiUrl}user/permissions`, requestConfig)
      .then((response) => {
        for (let i = 0; i < response.data.user_permissions.length; i++) {
          if (response.data.user_permissions[i].Name == "admin") {
            //if(response.data.user_permissions[i].Value){
            setPermission(response.data.user_permissions[i].Value);
            setPermission_service(response.data.user_permissions[i].Value);
            // }
            if (!response.data.user_permissions[i].Value) {
              setPermission(false);
              setPermission_service(false);
            }
          }
          if (response.data.user_permissions[i].Name == "service") {
            // setPermission(response.data.user_permissions[i].Value)
            setPermission_service(response.data.user_permissions[i].Value);
            if (!response.data.user_permissions[i].Value) {
              //setPermission(false)
              setPermission_service(false);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getComments = async () => {
    await axios
      .get(`${apiUrl}user/view/comments/${id}`, requestConfig)
      .then((response) => {
        setComments(response.data.services.reverse());
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateRequest = async () => {
    navigate(`/update/service/${id}`);
  };

  const approveStatus = async (event: React.FormEvent) => {
    event.preventDefault();

    if (doc_status === "") {
      toast.error("Please check status", { theme: "colored" });
    } else {
      setLoadingApprove(true);

      const requestBody = {
        service_request_id: id,
        status: doc_status,
        "Content-Type": "application/json",
      };

      try {
        await axios.post(
          `${apiUrl}admin/approve/documents`,
          requestBody,
          requestConfig
        );

        toast.success("Status updated!", { theme: "colored" });
        setDpcStatus(doc_status);
        getService();
        getComments();
        sendMessage();
      } catch (error) {
        //toast.error(error.response.data.error, { theme: 'colored' });
        console.log("err");
      } finally {
        setLoadingApprove(false);
      }
    }

    setIsDivVisible(false);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      const formData = new FormData();
      formData.append("service_id", String(id));
      formData.append("file", e.target.files[0]);
      formData.append("user_id", String(values.customer_id));

      axios
        .post(`${apiUrl}user/admin/doc`, formData, requestConfig)
        .then((response) => {
          console.log(response);
          toast.success("New Document Updated", { theme: "colored" });
          getService();
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
    getService();
    getUserPermissions();
    getComments();
  }, []);

  useEffect(() => {
    socket.addEventListener("open", function (event) {
      console.log("Connected");
    });

    socket.addEventListener("message", function (event) {
      console.log(JSON.parse(event.data));
      setComments(JSON.parse(event.data).reverse());
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      {!permission_service && <h2>No Access For You.!</h2>}
      {permission_service && (
        <div>

          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 ">
             
         
      <div className="flex justify-between mb-4  rounded-sm border border-stroke bg-white px-5 py-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 ">
    <h1 className="text-xl text-black font-bold">  Service Request - Admin View</h1>
    <button className="flex font-medium w-30 text-xs mt-auto justify-center rounded-full bg-danger px-1 py-1 pr-2  text-white " onClick={handleButtonClick}>
    <span className="mt-0.5 text-white  "><IoMdAdd /></span>       Action
    </button>
  </div>
      


             <div className="flex flex-row  gap-20">
               <div className="flex flex-col ml-2 gap-6  bg-white p-5 dark:border-strokedark mt-8  sm:p-7.5 xl:p-1 rounded-lg w-96"> 
  
  <div className="border bg-white py-3 px-5 shadow-default dark:border-strokedark dark:bg-boxdark rounded-lg  border-success">
    <h1 className="text-lg font-bold text-success">Details</h1>
    <p className="text-m"><span className="font-bold ">Service type : </span>{values.service_type}</p>
    <p className="text-m"><span className="font-bold ">Customer name : </span> {values.name}</p>
    <p className="text-m"><span className="font-bold ">Customer ID :  </span>{values.customer_id}</p>
    <p className="text-m"><span className="font-bold ">Customer Phone: </span> {values.phone_number}</p>
    <p className="text-m"><span className="font-bold ">Customer Email : </span> {values.email}</p>
  </div>

  <div className="border border-stroke bg-white px-5 py-3 shadow-default dark:border-strokedark dark:bg-boxdark rounded-lg  border-success">
    <h1 className="text-lg font-bold text-danger">Vehicle information</h1>
    <p className="text-m"><span className="font-bold ">Vehicle No. : </span>{values.vehicle_number}</p>
    <p className="text-m"><span className="font-bold ">Vehicle Type :</span> {values.vehicle_type}</p>
    <p className="text-m"><span className="font-bold ">Model : </span>{values.model}</p>
    <p className="text-m"><span className="font-bold ">Customer Phone :</span> {values.phone_number}</p>
    <p className="text-m"><span className="font-bold ">Engine Serial No. :</span> {values.engine_serial_no}</p>
  </div>

  <div className="border border-stroke bg-white px-5 py-3 shadow-default dark:border-strokedark dark:bg-boxdark rounded-lg border-success">
    <h1 className="text-lg font-bold text-primary">Uploaded Files (Click to download files)</h1>

    <div className="flex">
      <div className="w-full xl:w-1/2 mr-4">
        <label className="mb-2.5 block text-black dark:text-white">
          <a href={values.ID_copy_of_current_owner}>{values.file_name_1}</a>
        </label>
      </div>
    </div>

    <div className="flex">
      <div className="w-full xl:w-1/2 mr-4">
        <label className="mb-2.5 block text-black dark:text-white">
          <a href={values.ID_copy_of_new_owne}>{values.file_name_2}</a>
        </label>
      </div>
    </div>

    <div className="flex">
      <div className="w-full xl:w-1/2 mr-4">
        <label className="mb-2.5 block text-black dark:text-white">
          <a href={values.vehicle_registry_copy}>{values.file_name_3}</a>
        </label>
      </div>
    </div>
  </div>
  <div className="border border-stroke bg-white p-5 shadow-default dark:border-strokedark mb-4 dark:bg-boxdark rounded-lg  border-success">
                        <h5 className="mb-2  font-semibold text-success dark:text-white">
                          Admin Uploaded Files(Click to download files)
                        </h5>
                        {newDoc.map((item, index) => {
                          const splitValue = item.Key.split(
                            "admin_upload_document"
                          );
                          if (splitValue.length > 1) {
                            var href = `${values.location}${item.Key}`;

                            return (
                              <div key={index} className="w-full xl:w-1/2 mr-4">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  <a href={href}>{splitValue[1]}</a>
                                </label>
                              </div>
                            );
                          }



                        })}
                        </div>

</div>

<div className="  py-4 mt-4 bg-white px-3  rounded-lg">
         <div className="mb-4.5 flex flex-col gap-6 xl:flex-row w-100  ">
              {permission && (
              
<div>
              <div>
               <div className="flex justify-between mb-2">
                <div>
                    <h2 className="mb-2  font-semibold text-success dark:text-white"> Request Status </h2>
                    </div>
                    <div className="">
                      <button className="bg-meta-6 px-2 py-1 text-white rounded-full text-xs">Proccessing</button>
                    </div>
                    </div>
                  {permission && comments.length > 0 && (
                    <div>
                      <div className="container mx-auto " style={{width:"25rem"}}>

     <div className="border border-stroke bg-white p-5 mb-4 shadow-default dark:border-strokedark dark-bg-boxdark rounded-lg border-success">
 
  <div className="mt-4">
    {comments.map((item, index) => (
       <div key={index} className={`mb-4 border p-2 shadow-default rounded-lg ${
        item.status === "rejected" ? "border-danger   " :
        item.status === "approve" ? "border-success   " :
        item.status === "approve" ? "border-success   " :
          item.status === "processing" ? "border-meta-6  " :
          item.status === "on hold" ? "border-grey  " :""
      } ${
        item.status === "rejected" ? "" :
        item.status === "complete" ? "" : ""
      } `}>
        <div className="flex justify-between">
        <p
  className={`mb-4  px-2 rounded-full ${
    item.status === "rejected" ? "bg-danger text-white" :
    item.status === "approve" ? "bg-success text-white" :
      item.status === "processing" ? "bg-meta-6 text-white" :
      item.status === "on hold" ? "bg-grey text-white" :""
  } ${
    item.status === "rejected" ? "text-danger" :
    item.status === "complete" ? "text-success" : ""
  }`}
>
        {item.status}
      </p>
      <p className="text-sm ">{item.updated_at}</p>
    </div>

        <h6 className="text-sm">Required Actions:</h6>
        <p className="text-sm">{item.comment}</p>

        <br />

        {permission && (
          <div className="flex justify-end">
            {(item.status === "reject" || item.status === "rejected") && (
              <button
                className="bg-success rounded-full px-2 py-1 font-medium text-white text-xs "
                onClick={updateRequest}
              >Update Request
            
              </button>
            )}
            {/* Add additional conditions as needed for other statuses */}
          </div>
        )}
      </div>
    ))}
  </div>
</div>

                       
                      </div>
                    </div>
                  )}
                </div>
              </div>

)}



              {!permission && (
                <div className="w-full xl:w-full">

<div className="w-full xl:w-full">
                    <div className=" mr-4">
                      <h5 className="mb-2  font-semibold text-success dark:text-white">
                        Request Status
                      </h5>
                    </div>
                  </div>


                  {comments.length < 1 && <h2>Processing</h2>}
                  {comments.length > 0 && (
                    
                      <div className="border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark rounded-lg  border-success">
                         
                        <div className="min-w-full bg-white border border-gray-300">
  {/* <div className="bg-gray-100 flex">
    <div className="py-2 px-4 border w-1/4">Date</div>
    <div className="py-2 px-4 border">Status</div>
    <div className="py-2 px-4 border">Comment</div>
  </div> */}
  <div>
    {comments.map((item, index) => (
      <div key={index} className="flex ">
        <div className="py-2 px-2 border w-1/4">{item.updated_at}</div>
        <div
          className={`py-2 px-4 border ${
            item.status === "reject" ? "text-red-500" : item.status === "complete" ? "text-success" : ""
          }`}
        >
          {item.status}
        </div>
        <div className="py-2 px-4 border">{item.comment}</div>
      </div>
    ))}
  </div>
</div>

                        <br></br>
                        <button
                          className="flex w-full justify-center rounded bg-black p-3 font-medium text-white mb-4"
                          onClick={updateRequest}
                        >
                        
                          <h1 className="text-xl font-bold text-success">Update Request</h1>
                        </button>
                      






                      <h5 className="mb-2  font-semibold text-black dark:text-white">
                        
                        <h1 className="text-xl font-bold text-success">Uploaded New Files(Click to download files)</h1>
                      </h5>
                      {newDoc.map((item, index) => {
                        if (item.Key.split("new_upload_document")) {
                          var href = `${values.location}${item.Key}`;
                          return (
                            <div key={index} className="w-full xl:w-1/2 mr-4">
                              <label className="mb-2.5 block text-black dark:text-white">
                                <a href={href}>
                                  {item.Key.split("new_upload_document")[1]}
                                </a>
                              </label>
                            </div>
                          );
                        }
                      })}
                    </div>
                  )}

                     


                     
                  <h5 className="mb-2  font-semibold text-black dark:text-white">
                    

                    <h1 className="text-xl font-bold text-success">Admin Uploaded Files(Click to download files)</h1>

                  </h5>

                  {newDoc.map((item, index) => {
                    const splitValue = item.Key.split("admin_upload_document");
                    if (splitValue.length > 1) {
                      var href = `${values.location}${item.Key}`;
                      <h5 className="mb-2  font-semibold text-black dark:text-white">
                       
                    <h1 className="text-xl font-bold text-success"> Admin Uploaded Files(Click to download files)</h1>

                      </h5>;
                      return (
                        <div key={index} className="w-full xl:w-1/2 mr-4">
                          <label className="mb-2.5 block text-black dark:text-white">
                            <a href={href}>{splitValue[1]}</a>
                          </label>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
           </div>
           </div>
  
           
{isDivVisible && (
    <div className="absolute  inset-0 mt-80 xl:pr-21  flex justify-end items-center">

<div className="border border-stroke  w-100  bg-white p-5 shadow-2xl dark:border-strokedark dark:bg-boxdark rounded-lg ">
  <div className="flex justify-between">
  <div>
                  <h5 className="mb-2  font-semibold text-success dark:text-white">
                    Administration
                  </h5>
                  </div>
                  <div>
                  <button onClick={ closemodel}><IoClose /></button>
                  </div>
                  </div>
                  <label className="mb-2.5 text-sm block text-black dark:text-white">
                  <h6 className="mb-2   text-black dark:text-white font-semibold">
          
                    Status
                    </h6>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={doc_status}
                    onChange={(e) => setDpcStatus(e.target.value)}
                    className="w-full text-sm rounded-lg border border-stroke bg-transparent py-3  px- pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="" selected>
                      Select status
                    </option>
                    <option value="processing">Processing</option>
                    <option value="approve">Approve</option>
                    <option value="rejected">Rejected</option>
                    <option value="on hold">On Hold</option>
                  </select>
  <br /><br />
                  <h5 className="mb-2 text-sm   text-success font-bold dark:text-white ">
                    Send Amendments
                  </h5>
                  <label className="mb-2.5 text-sm block text-black dark:text-white font-semibold">
                    Comments
                  </label>
                  <textarea
  name="comment"
  value={comment}
  onChange={(e) => setComment(e.target.value)}
  placeholder="Comments"
  className="w-full mb-3 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
/>

<div className="flex justify-end gap-2">
<div className="">
                  <button
                    className= "mb-3 bg-meta-6 text-xs justify-center  px-2 py-1 text-white rounded-full font-medium " style={{color:"white"}}
                  
                    onClick={sendReview}
                    disabled={loading}
                  >
                 Send For Review
                  </button>

<br />
</div>
<div>
                  <button
                    className="bg-success text-xs w-full justify-center rounded-full px-3 py-1 font-medium  text-white " style={{color:"white"}}
                   
                    onClick={approveStatus}
                    disabled={loadingApprove}
                  >
                Approve
                  </button>
                <br />
                </div>
              </div>
                  <h3 className="mb-2  font-semibold text-success dark:text-white">
                    Upload Files
                  </h3>
                  <div
                    id="FileUpload"
                    className="relative mb-4.5 block w-full h-30 cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-1 px-1 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="*/*"
                      id="file-input"
                      onChange={handleFileChange}
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
                        <span className="text-primary">Click to upload</span> 
                       
                      </p>
                      {/* <p className="mt-1.5 text-success">Atteche File</p> */}
                    </div>
                   
                  </div>
                  <div className="border border-stroke bg-white p-5 shadow-default dark:border-strokedark mb-4 dark:bg-boxdark rounded-lg  border-success">
                        <h5 className="mb-2  font-semibold text-success dark:text-white">
                          Uploaded New Files(Click to download files)
                        </h5>
                        {newDoc.map((item, index) => {
                          if (item.Key.split("new_upload_document")) {
                            var href = `${values.location}${item.Key}`;
                            return (
                              <div key={index} className="w-full xl:w-1/2 mr-4">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  <a href={href}>
                                    {item.Key.split("new_upload_document")[1]}
                                  </a>
                                </label>
                              </div>
                            );
                          }
                        })}
                        </div>
    </div>
    </div>
)}       




  

               
        







       
          <ToastContainer />

        </div>
        </div>
      )}
    </>
  );
};

export default ViewMore;
