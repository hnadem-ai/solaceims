import './InventoryForm.css';
import { useState } from 'react';

export default function InventoryForm({setInventory}){
    const [unitNo, setUnitNo] = useState(0);
    const [floor, setFloor] = useState(0);
    const [size, setSize] = useState(0);
    const [utilities, setUtilities] = useState(0);
    const [remarks, setRemarks] = useState('');

    return (
        <div className='inventory-form-container'>
            <input type="number" onChange={setUnitNo} placeholder='Unit No.'/>
            <input type="number" onChange={setFloor} placeholder='Floor No.'/>
            <input type="number" onChange={setSize} placeholder='Size'/>
            <input type="number" onChange={setUtilities} placeholder='Utilities'/>
            <textarea type="text" onChange={setRemarks} placeholder='Remarks (optional)'/>
            <div>
                <button>Add</button>
                <button>Cancel</button>
            </div>
        </div>
    )
}