import './InventoryForm.css';
import { useState } from 'react';

export default function InventoryForm({setInventory, setShowNewInventory}){
    const [unitNo, setUnitNo] = useState('');
    const [floor, setFloor] = useState('');
    const [size, setSize] = useState('');
    const [utilities, setUtilities] = useState('');
    const [remarks, setRemarks] = useState('');

    function onAdd(e){
        e.preventDefault();
        if(!unitNo) {
            document.getElementById('unitNo').style.borderColor = 'red';
            return;
        }
        if(!floor) {
            document.getElementById('floor').style.borderColor = 'red';
            return;
        }
        if(!size) {
            document.getElementById('size').style.borderColor = 'red';
            return;
        }
        if(!utilities) {
            document.getElementById('utilities').style.borderColor = 'red';
            return;
        }
        const payload = {
            id: Date.now(),
            unitNo: Number(unitNo),
            size: Number(size),
            floor: Number(floor),
            utilities: Number(utilities),
            remarks,
        }
        setInventory(prev => [...prev, payload])
        setShowNewInventory(false)
    }

    return (
        <div className='inventory-form-container'>
            <h2 className='text-sm text-dark'>New Inventory</h2>
            <div className='input-container'>
                <input id='unitNo' type="number" value={unitNo} onChange={(e) => setUnitNo(e.target.value)} placeholder='Unit No.'/>
                <input id='floor' type="number" value={floor} onChange={(e) => setFloor(e.target.value)} placeholder='Floor No.'/>
                <input id='size' type="number" value={size} onChange={(e) => setSize(e.target.value)} placeholder='Size'/>
                <input id='utilities' type="number" value={utilities} onChange={(e) => setUtilities(e.target.value)} placeholder='Utilities'/>
                <textarea id='remarks' type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder='Remarks (optional)'/>
            </div>
            <div className='btn-container'>
                <button className='text-xsm text-dark' onClick={onAdd}>Add</button>
                <button className='text-xsm text-dark' onClick={(e) => {e.preventDefault(); setShowNewInventory(false)}}>Cancel</button>
            </div>
        </div>
    )
}