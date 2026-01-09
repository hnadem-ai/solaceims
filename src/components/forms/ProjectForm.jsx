import './ProjectForm.css';
import { useState } from 'react';
import { callAPI } from '../../api/client';

export default function ProjectForm(){
    const [name, setName] = useState('');
    const [detail, setDetail] = useState('');
    const [bank, setBank] = useState(null);
    const [inventory, setInventory] = useState([]);

    async function onSubmit(e) {
        //Make API body here
        if(!name || !bank){
            return;
        }
        const body = {
            name,
            detail,
            bank,
            inventoryCounter: inventory.length,
            inventory,
        };

        //Call API
        try {
            const res = await callApi('/api/project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
                onError: ({status, message, data} = {}) => {
                    return;
                },
            })
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form className='project-form-container'>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </form>
    )
}