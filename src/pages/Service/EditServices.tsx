import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const EditServices = () => {
    const navigate = useNavigate();
    const backServices = async (event: React.FormEvent) => {
        event.preventDefault();
        navigate('/service')
       
      }
      
    return (
        <>

            <div className="w-full xl:w-1/4">
              <label className="mb-2.5 block text-black dark:text-white">
                Services
              </label>
              <button className="flex w-full justify-center rounded bg-danger p-3 font-medium text-white mb-4"  onClick={backServices}>
              BACK SERVICES
              </button>

                
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Input Fields
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Default Input
                </label>
                <input
                  type="text"
                  placeholder="Default Input"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Active Input
                </label>
                <input
                  type="text"
                  placeholder="Active Input"
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                />
              </div>

              <div>
              
              </div>
            </div>
          </div>
          <button className="flex w-full justify-center rounded bg-warning p-3 font-medium text-white mb-4">
                  Edit
                </button>
               
                <button className="flex w-full justify-center rounded bg-secondary p-3 font-medium text-white mb-4"  >
                  Clear
                </button>
                
        </>
    )
}

export default EditServices;