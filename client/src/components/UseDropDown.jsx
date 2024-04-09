import { useState } from 'react';

const useDropDown = (initialValue ="") => {
  const[isOpen, setIsOpen] = useState(false);
  const[selectedValue, setSelectedValue] = useState(initialValue);

  // toggle list is default false until clicked on
  const toggleList = () => 
    setIsOpen(!isOpen);
  
  // selection of item from a dropdown menu
  const selectList = (value) =>{
    // logs the selected values
    console.log("Selected: ", value)
    setSelectedValue(value);
  };
  return {isOpen, selectedValue, toggleList, selectList}

};

export default useDropDown;