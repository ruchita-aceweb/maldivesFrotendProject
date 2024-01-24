import React, {useState} from "react"; 
import Datepicker from "react-tailwindcss-datepicker"; 

//import TimeKeeper from 'react-timekeeper';


const DatePicker = () => { 
const [time, setTime] = useState('12:34pm')
const [value, setValue] = useState({ 

startDate: null ,
endDate: null 

});  

const handleValueChange = (newValue :any) => {
console.log("newValue:", newValue); 
setValue(newValue); 

} 
const [selectedTime, setSelectedTime] = useState<string>('');

const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSelectedTime(event.target.value);
};

return (
    <div>
         <Datepicker 
            primaryColor={"blue"} 
            value={value} 
            onChange={handleValueChange} 
            showShortcuts={true} 
    /> 
    <div className="flex items-center space-x-2">
      <label className="text-sm text-gray-600">Select Time:</label>
      <input
        type="time"
        value={selectedTime}
        onChange={handleTimeChange}
        className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring focus:border-blue-300"
      />
      <span className="text-gray-500">{selectedTime}</span>
    </div>
      
    </div>
   
   

);
}; 
export default DatePicker;




