import { useEffect } from 'react';
import './CustomDropdown.css';

export default function CustomDropdown({elements, setState, setSelfState, setText}){
    useEffect(() => {
        if(elements.length === 0) {
            setSelfState(false);
        }
    }, [elements])
    return (
        <div className='custom-dropdown-container'>
            {
                elements.map((element, index) => (
                    <div key={index} onClick={(e) => {setState(element?.value); setSelfState(false); setText(element?.heading + " " + (element?.subHeading ? element?.subHeading : '') + (element?.valueAdd ? " " + element?.valueAdd : ''))}} className='custom-dropdown-item'>
                        <h1 className='text-sm text-thin text-dark'>{element?.heading}</h1>
                        <h1 className='text-sm text-thin text-light'>{element?.subHeading}</h1>
                    </div>
                ))
            }
        </div>
    )
}