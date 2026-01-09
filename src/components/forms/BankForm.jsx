import './BankForm.css';
import { useState } from 'react';
import { callAPI } from '../../api/client';

export default function BankForm(){

    async function onSubmit(e) {
        //Make API body here
        const body = {};

        //Call API
        try {
            const res = await callApi('/api/project', {
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
        <div className='Bank-form-container'>
            
        </div>
    )
}