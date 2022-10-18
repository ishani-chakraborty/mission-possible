import AsyncSelect from "react-select/async";
import React, { useState } from 'react';
//import Select from 'react-select';


export default function DataComparison(){

    // const handleChange = (selectedOption) => {
    //     console.log("handleChange", selectedOption);
    // };

    // const loadOptions = (searchValue, callback) => {
    //     setTimeout(() => {
    //         const filteredOptions = options.filter((option) => 
    //         option.label.toLowerCase().includes(searchValue.toLowerCase())
    //         );
    //         console.log("loadOptions", searchValue, filteredOptions);
    //         callback(filteredOptions); 
    //     }, 2000);
    // };
    // return <AsyncSelect loadOptions={loadOptions} onChange={handleChange} />;  

    // return <h1>Data Comparison</h1>

    const options = [
        {value: "test1", label: "Test1"},
        {value: "test2", label: "Test2"},
        {value: "test3", label: "Test3"},
    ];

  // set value for default selection

  const handleChange = (selectedOption) => {
        console.log("handleChange", selectedOption);
  };

//   function error_message1() {
//     alert("Please select an end date!"); 
//   }

//   function error_message2() {
//     alert("Please select a start date!"); 
//   }

  const loadOptions = (searchValue, callback) => {
        setTimeout(() => {
            const filteredOptions = options.filter((option) => 
            option.label.toLowerCase().includes(searchValue.toLowerCase())
            );
            console.log("loadOptions", searchValue, filteredOptions);
            callback(filteredOptions); 
        }, 2000);
    };

    const [show, setShow] = useState(false);
    const handleOnClick = () => {
        setShow(true);
    };

  return (
    <div className="datacomparison"> Data Comparison
    <hr
        style={{
        background: 'white',
        color: 'white',
        borderColor: 'white',
        height: '2px',
        }}/>
        <div className="dropdowns">
            <AsyncSelect
                className="dropdown1"
                placeholder="- Select start date -"
                value={loadOptions}
                onChange={handleChange} // assign onChange function
                isClearable
            />
            <br />
            <AsyncSelect
                className="dropdown2"
                placeholder="- Select end date -"
                value={loadOptions}
                onChange={handleChange} // assign onChange function
                isClearable
            />
            <br />
            <AsyncSelect
                className="dropdown3"
                placeholder="- Select Scenario 1 -"
                value={loadOptions}
                onChange={handleChange} // assign onChange function
                isClearable
            />
            <br />
            <AsyncSelect
                className="dropdown4"
                placeholder="- Select Scenario 2 -"
                value={loadOptions}
                onChange={handleChange} // assign onChange function
                isClearable
            />
        </div>
        <button onClick={handleOnClick}>Create Graph</button>
        <div className="img1">
            {show && (
                    <img
                        src="/grid-dashboard/images/mp_scatter.png"
                        alt=""
                    />
                )}
        </div> 
     </div>
    
  );

};