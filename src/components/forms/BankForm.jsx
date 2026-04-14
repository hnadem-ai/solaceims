import './BankForm.css';
import { useState } from 'react';
import { callAPI } from '../../api/client';

export default function BankForm(){

    const [accNum, setAccNum] = useState('');
    const [name, setName] = useState('');
    const [accHolder, setAccHolder] = useState('');

    async function onSubmit(e) {
        if(!accNum.trim() || !accNum) {
            document.getElementById('accNum').style.borderColor = 'red';
            return;
        }
        if(!name.trim() || !name) {
            document.getElementById('name').style.borderColor = 'red';
            return;
        }
        if(!accHolder.trim() || !accHolder) {
            document.getElementById('accHolder').style.borderColor = 'red';
            return;
        }   

        const body = {
            accNum,
            name,
            accHolder,
        };

        //Call API
        try {
            const res = await callAPI('/api/bank', {
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
        <form className='bank-form-container'>
            <div className='inputs-container'>
                <input id='accNum' type='text' onChange={(e) => setAccNum(e.target.value)} value={accNum} placeholder='Account Number'/>
                <input id='name' type='text' onChange={(e) => setName(e.target.value)} value={name} placeholder='Bank Name'/>
                <input id='accHolder' type='text' onChange={(e) => setAccHolder(e.target.value)} value={accHolder} placeholder="Account Holder's Name"/>
            </div>
            <button onClick={onSubmit} className='text-sm text-dark text-thin'>Submit</button>
        </form>
    )
}