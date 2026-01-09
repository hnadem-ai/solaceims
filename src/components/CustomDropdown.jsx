import './CustomDropdown.css';

export default function CustomDropdown({elements, setState, setSelfState}){
    return (
        <div className='custom-dropdown-container'>
            {
                elements.map(element => (
                    <div onClick={(e) => {setState(element.value); setSelfState(false)}}>
                        <h1 className='text-sm text-thin text-dark'>{element.heading}</h1>
                        <h1 className='text-sm text-thin text-light'>{element.subHeading}</h1>
                    </div>
                ))
            }
        </div>
    )
}