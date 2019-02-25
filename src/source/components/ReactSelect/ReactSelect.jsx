import React from 'react';
import Select from 'react-select';
import './ReactSelect.css';

export default (props) => 
    <Select 
        placeholder="Click to select"
        { ...props } 
        classNamePrefix="custom-react-select" 
    />;