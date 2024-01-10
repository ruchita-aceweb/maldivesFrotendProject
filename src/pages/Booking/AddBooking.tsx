import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Datepicker ,{ DateRangeType }from "react-tailwindcss-datepicker";

interface FormValues {
    id: number | undefined;
    adults: number;
    kids: number;
    rental_property_id: string;
    start_date: string;
    end_date: string;
    message:string


}
const AddBooking = () => {
    const navigate = useNavigate();
    const initialFValues: FormValues = {
        id: undefined,
        adults: 1,
        kids: 0,
        rental_property_id: "",
        end_date: "",
        start_date: "",
        message:""

    }
    const [values, setValues] = useState(initialFValues);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [property_type, setPropertyType] = useState('');
    const [property, setProperty] = useState('');
    const apiUrl = 'http://localhost:3005/';
    const [permission, setPermission] = useState(false);
    const [type, setTypes] = useState<any[]>([])
    const [rental, setRental] = useState<any[]>([])
    const [show, setShow] = useState(false);
    const requestConfig = {
        headers: {
            'token': localStorage.getItem('token'),
            'uu_id': localStorage.getItem('uuID')

        }
    }
    const [date, setDate] = useState({

        startDate: null,
        endDate: null

    });
    const [loadingApprove, setLoadingApprove] = useState(false);
    const spinnerStyle = {
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        borderTop: '4px solid #ffffff',
        width: '20px',
        height: '20px',
        animation: 'spin 1s linear infinite',
    };
    const handleValueChange = (newValue: any) => {
        console.log("newValue:", newValue);
        setDate(newValue);

    }

    const handleSelectChangeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        if (value.length > 0) {
            setPropertyType(event.target.value)
            setShow(true)
        } else {
            setPropertyType('')
            setShow(false)
        }

    };
    const handleSelectChangeProperty = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        if (value.length > 0) {
            setProperty(event.target.value)
        }

    };
    const backBooking = async (event: React.FormEvent) => {
        event.preventDefault();
        navigate('/booking')

    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'adults' && !isNaN(Number(value)) && parseInt(value) < 0) {
            // If it's a negative number, don't update the state
            return;
        }
        if (name === 'kids' && !isNaN(Number(value)) && parseInt(value) < 0) {
            // If it's a negative number, don't update the state
            return;
        }
        setValues({
            ...values,
            [name]: value,
        });
    };

    const plusAdults = async (event: React.FormEvent) => {
        event.preventDefault();
        var plus_adults = +values.adults + 1
        setValues((prevValues) => ({
            ...prevValues,
            adults: plus_adults,
        }));
    }
    const plusKids = async (event: React.FormEvent) => {
        event.preventDefault();
        var plus_kids = +values.kids + 1
        setValues((prevValues) => ({
            ...prevValues,
            kids: plus_kids,
        }));
    }
    const minusAdults = async (event: React.FormEvent) => {
        event.preventDefault();
        var minus_adults = values.adults - 1
        if (minus_adults < 0) {
            minus_adults = 0
        }
        setValues((prevValues) => ({
            ...prevValues,
            adults: minus_adults,
        }));
    }
    const minusKids = async (event: React.FormEvent) => {
        event.preventDefault();
        var minus_kids = values.kids - 1
        if (minus_kids < 0) {
            minus_kids = 0
        }
        setValues((prevValues) => ({
            ...prevValues,
            kids: minus_kids,
        }));
    }
    const handleEditSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (values.adults == 0) {
            toast.error("Please enter adults count", { theme: 'colored' });
        }
        else if (property === "") {
            toast.error("Please select the property", { theme: 'colored' });
        }
        else if (property_type === "") {
            toast.error("Please select the property type", { theme: 'colored' });
        }
        else if (date.startDate == null || date.endDate == null) {
            toast.error("Please select date", { theme: 'colored' });
        }


        else {
            setLoading(true);


            const formData: FormValues = {
                rental_property_id: property,
                adults: values.adults,
                kids: values.kids,
                end_date: date.endDate,
                start_date: date.startDate,
                message:description,
                id: values.id !== undefined ? values.id : 0,
            };
            console.log(formData)
           try {
                await axios.post(`${apiUrl}user/add/booking`, formData, requestConfig);
                toast.success("New Booking Added", { theme: 'colored' });
                setValues(initialFValues);
                 navigate('/booking')

            }
            catch (error) {
                console.log(error)
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
    const getTypes = async () => {

        await axios.get(`${apiUrl}user/view/rental/type`, requestConfig).then(response => {
            setTypes(response.data.type)
        }).catch(error => {
            toast.error(error.response.data.error, { theme: 'colored' })
        })

    }
    const getRental = async () => {
        await axios.get(`${apiUrl}user/rental/property/details`, requestConfig).then(response => {
          setRental(response.data.property)
    
        }).catch(error => {
          toast.error(error.response.data.error, { theme: 'colored' })
        })
    
    
      }
    useEffect(() => {
        const token = localStorage.getItem('token');
        if ((token === null)) {
            navigate('/auth/signin')
        }
        getTypes();
        getRental()


    }, [])
    const disabledDates: DateRangeType[] = [
        {
          startDate: new Date(0), // Start of time
          endDate: new Date(),
        },
      ];
   

    return (
        <>
            <div>
                <div className="w-full xl:w-1/4">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Booking
                    </label>
                    <button className="flex w-full justify-center rounded bg-danger p-3 font-medium text-white mb-4" onClick={backBooking}>
                        BACK
                    </button>
                </div>
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            New Booking Requests
                        </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                        <div className="flex gap-5.5">
                            <div className="flex-col flex-1">
                                <label className="mb-3 block text-black dark:text-white">
                                    Select a property type
                                </label>
                                <select
                                    id="gender"
                                    value={property_type}
                                    onChange={handleSelectChangeType}
                                    name="property_type"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    <option value="" selected>Select a service</option>
                                    {type.map((item, index) => {
                                        return (
                                            <option value={item.id}>{item.title}</option>
                                        );
                                    })}

                                </select>
                            </div>
                            {show &&
                                <div className="flex-col flex-1">
                                    <label className="mb-3 block text-black dark:text-white">
                                        Select a property
                                    </label>
                                    <select
                                        id="gender"
                                        name="property"
                                        value={property}
                                        onChange={handleSelectChangeProperty}

                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    >
                                        <option value="" selected>Select a service</option>
                                        {rental.map((item, index) => {
                                            if(item.type_id==property_type){
                                                return (
                                                    <option value={item.id}>{item.title}</option>
                                                );
                                            }
                                        
                                    })}
                                    </select>
                                </div>

                            }

                            <div className="flex-col flex-1 ">
                                <label className="mb-3 block text-black dark:text-white">
                                    Select a period
                                </label>
                                <div className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    
                                    <Datepicker
                                       primaryColor="blue"
                                        value={date}
                                        onChange={handleValueChange}
                                        showShortcuts={true}
                                        disabledDates={disabledDates}
                                        
                                    />
                                </div>

                            </div>

                        </div>

                        <div className="flex gap-5.5">
                            <div className="flex-col flex-1">
                                <label className="mb-3 block text-black dark:text-white">
                                    Adults
                                </label>
                                <div className="flex gap-2"> {/* Added flex container for buttons and input */}
                                    <button className="px-4 py-2 border rounded-md" onClick={minusAdults}>-</button>
                                    <input
                                        name="adults"
                                        value={values.adults}
                                        onChange={handleInputChange}
                                        type="number"
                                        placeholder="Adults"
                                        className="flex-1 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                    <button className="px-4 py-2 border rounded-md" onClick={plusAdults}>+</button>
                                </div>
                            </div>
                            <div className="flex-col flex-1">
                                <label className="mb-3 block text-black dark:text-white">
                                    Kids
                                </label>
                                <div className="flex gap-2"> {/* Added flex container for buttons and input */}
                                    <button className="px-4 py-2 border rounded-md" onClick={minusKids}>-</button>
                                    <input
                                        name="kids"
                                        value={values.kids}
                                        onChange={handleInputChange}
                                        type="number"
                                        placeholder="Kids"
                                        className="flex-1 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-11 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                    <button className="px-4 py-2 border rounded-md" onClick={plusKids}>+</button>
                                </div>
                            </div>
                        </div>


                        <div className="flex gap-5.5">
                            <div className="flex-col flex-1">
                                <label className="mb-3 block text-black dark:text-white">
                                    Message/Special Request
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    name="comment"
                                    placeholder="Description"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="flex gap-5.5">
                            <div className="flex-col flex-1">
                                <button
                                    className={`flex w-full justify-center rounded p-3 mb-4 font-medium text-white ${loadingApprove ? 'bg-gray-500 cursor-not-allowed' : 'bg-black'}`}
                                    style={{
                                        flex: '1',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        fontWeight: 'medium',
                                        color: 'white',
                                        backgroundColor: loadingApprove ? '#808080' : 'black',
                                        cursor: loadingApprove ? 'not-allowed' : 'pointer',
                                    }}
                                    disabled={loadingApprove}
                                    onClick={handleEditSubmit}
                                >
                                    {loadingApprove ? <div style={spinnerStyle} /> : 'SUBMIT'}
                                </button>
                                <button className="flex w-full justify-center rounded bg-secondary p-3 font-medium text-white mb-4">
                                    Clear
                                </button>
                            </div>
                        </div>




                    </div>
                </div>




            </div>
            <ToastContainer />
        </>

    )
}
export default AddBooking;
