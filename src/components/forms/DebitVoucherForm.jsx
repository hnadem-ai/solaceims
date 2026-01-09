import './DebitVoucherForm.css';
import { useState } from 'react';
import { callAPI } from '../../api/client';

export default function DebitVoucherForm(){

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
        <div className='debit-voucher-form-container'>
            
        </div>
    )
}