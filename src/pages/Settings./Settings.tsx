import { useState, useEffect, ChangeEvent } from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from './TextField';
import FileUpload from './FileUpload';
import Checkedbox from './Checkedbox';
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
  interface TextItem {
    label: string;
    placeholder: string;
    key: string;
    value: string;
    type: string; // Add the type property here
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
    id: string

  }

  const initialFValuesImage = {
    image_name: ''
  }

  const settingArray = [
    { "key": "abc", "label": "abc", "placeholder": "abc", "type": "text" }, //text
    { "key": "abc2", "label": "abc2", "placeholder": "ab2c", "type": "text" }, //text
    { "key": "logo", "label": "logo label", "placeholder": "logo", "type": "file" },//file
    { "key": "logo2", "label": "logo label2", "placeholder": "logo2", "type": "file" },//file
    { "key": "logo3", "label": "logo label3", "placeholder": "logo3", "type": "file" },//file


  ]
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
      data: settingArray,


    }

    await axios.post(`${apiUrl}user/settings`, requestBody, requestConfig).then(response => {
      getSettings();

      //toast.success("Settings Added Successfully", { theme: 'colored' })


    }).catch(error => {
      // toast.error(error.response.data.error, { theme: 'colored' })
      console.log(error)
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
      //setImage_name(`${apiUrl}/pdf/${response.data.location.value}`)
      setImage_name(`${response.data.location.value}`)

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
      for (let i = 0; i < response.data.user_permissions.length; i++) {
        if (response.data.user_permissions[i].Name == "settings") {
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

                </div>
              </div>

              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="h-165 w-175 rounded-full">
                  {text.map((item, index) => {

                    if (item.type === "file") {
                      return (
                        <FileUpload
                          key={index} value={item.value}
                          placeholder={item.placeholder}
                          id={item.id}

                        />
                      )
                    }


                  })}

                  {/* <img src={image_name} /> */}
                </div>
              </div>

            </form>
          </div>
          <div className="flex flex-col gap-5.5 p-6.5">
            {text.map((item, index) => {
              if (item.type === "text") {
                return (
                  <TextField
                    label={item.label}
                    placeholder={item.placeholder}
                    key={item.key}
                    value={item.value}
                    onChange={(value) => handleInputChange(index, value)}
                  />
                );
              }



            })}
            {text.map((item, index) => {
              if (item.type === "checkbox") {
                return (
                  <Checkedbox
                    label={item.label}
                    placeholder={item.placeholder}
                    key={item.key}
                    value={item.value}
                    onChange={(value) => handleInputChange(index, value)}
                  />
                );
              }



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