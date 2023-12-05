import { useState, useEffect } from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    const apiUrl = 'https://baatestapi.hash.mv/';
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

    const [text, setText] = useState<TextItem[]>([]);
    const [values, setValues] = useState(initialFValues);
    const [textField, setTextField] = useState(initialTextFields);
   
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

      const handleEdit = async (event: React.FormEvent) => {
        const requestBody = {
            "data": text,
            "Content-Type": 'application/json'
        }

        await axios.post(`${apiUrl}user/edit/settings`, requestBody, requestConfig).then(response => {
            getSettings();
            toast.success("Settings Added Successfully", { theme: 'colored' })


        }).catch(error => {
            toast.error(error.response.data.error, { theme: 'colored' })
        })
      }
      useEffect(() => {
        getSettings();
        handleSubmit();
    
      }, [])
    return (
        <>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        ADD SETTINGS
                    </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    {/* <div>
                <label className="mb-3 block text-black dark:text-white">
                   Text 1
                </label>
                <input
                  type="text"
                  name="key" value={textField.text_1} onChange={handleInputChange}
                  placeholder="Default Input"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                   Text 2
                </label>
                <input
                  type="text"
                  placeholder="Active Input"
                  name="value" value={values.value} onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                />
              </div> */}
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
            {/* <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white mb-4" onClick={handleSubmit}>
                Add Settings
            </button> */}

            <button className="flex w-full justify-center rounded bg-secondary p-3 font-medium text-white mb-4" onClick={handleEdit} >
                Update
            </button>
            <ToastContainer />
        </>
    )
}

export default Settings;