import './VendorForm.css';
import { useState } from 'react';
import { callAPI } from '../../api/client';

export default function VendorForm(){

    const [detail, setDetail] = useState('');
    const [name, setName] = useState('');
    
async function onSubmit(e) {
        if(!name.trim() || !name) {
            document.getElementById('name').style.borderColor = 'red';
            return;
        }

        const body = {
            name,
            detail
        };

        //Call API
        try {
            const res = await callAPI('/api/vendor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
                onError: ({ status, message, data } = {}) => {
                    return;
                },
            })
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <form className='vendor-form-container'>
            <div className='inputs-container'>
                <input id='name' autoComplete='off' type='text' onChange={(e) => setName(e.target.value)} value={name} placeholder='Name of Vendor' />
                <input id='detail' autoComplete='off' type='text' onChange={(e) => setDetail(e.target.value)} value={detail} placeholder='Detail (optional)' />
            </div>
            <button onClick={onSubmit} className='text-sm text-thin text-dark'>Submit</button>
        </form>
    )
}