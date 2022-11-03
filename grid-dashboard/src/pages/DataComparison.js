import AsyncSelect from "react-select/async";
import "./dc_styles.css"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import React,{useState} from 'react';
export default function DataComparison(){
    const options = [
       {value: "temp", label: "Temp"},
       {value: "temp1", label: "Temp1"},
    ];
    const [selectedDate, setSelectedDate]=useState(null);
    const [selectedDate1, setSelectedDate1]=useState(null);
  const [value, onChange] = useState('10:00');


    const loadOptions = (searchValue, callback) => {
      setTimeout(()=> {
        const filterOptions = options.filter(option => 
            option.label.toLowerCase().includes(searchValue.toLowerCase()));
            callback(filterOptions);
      },2000)  
    };
    return (
        <>
            <h1 className="datacomp">Data Comparison</h1>
            <hr></hr>
            <h1 className="config">Configuration</h1>
            <hr></hr>
            <ul className="headers">
                <li>Date</li>
                <li>From</li>
                <li>To</li>
                <li>Scenario 1</li>
                <li>Scenario 2</li>
            </ul>
            <ul className="dropdowns">
                <li><AsyncSelect loadOptions={loadOptions} defaultOptions placeholder="- Select -" isClearable/></li>
                <li>
                <div>
                <DatePicker 
                selected={selectedDate} 
                onChange={(date)=>{setSelectedDate(date);console.log(date);}}
                ></DatePicker>
                <TimePicker onChange={onChange} value={value} />
                </div>
                
                        </li>
                        <li>
                <div>
                <DatePicker 
                selected={selectedDate1} 
                onChange={(date)=>{setSelectedDate1(date);console.log(date);}}
                ></DatePicker>
                <TimePicker onChange={onChange} value={value} />
                </div>
        
                </li>
                <li><AsyncSelect loadOptions={loadOptions} defaultOptions placeholder="- Select -" isClearable/></li>
                <li><AsyncSelect loadOptions={loadOptions} defaultOptions placeholder="- Select -" isClearable/></li>
            </ul>
            <button className="button">Create Graphs</button>
            
        </>
    );

};