import './HeadForm.css';
import plus from '../../assets/plus-primary.png';
import del from '../../assets/delete.png';
import { useState } from 'react';
import { callAPI } from '../../api/client';

export default function BankForm() {

    const [name, setName] = useState('');
    const [subHeads, setSubHeads] = useState([]);
    const [showNewSubHead, setShowNewSubHead] = useState(false);
    const [newSubHead, setNewSubHead] = useState('');

    function deleteSubHead(e, id) {
        e.preventDefault();
        setSubHeads(prev => prev.filter(subHead => subHead._id !== id))
    }

    function onSubHeadAdd(e) {
        e.preventDefault();

        if (!newSubHead) {
            document.getElementById('subHead').style.borderColor = 'red';
            return;
        }
        const payload = {
            _id: Date.now(),
            name: newSubHead,
        };
        setSubHeads(prev => [...prev, payload]);
        setNewSubHead(null);
        setShowNewSubHead(false);
    }

    async function onSubmit(e) {
        e.preventDefault();

        try {
            // 🔴 Basic validation
            if (!name || !name.trim()) {
                document.getElementById('name').style.borderColor = 'red';
                return;
            }

            // Optional: validate subHeads (avoid empty ones)
            const hasEmptySubHead = subHeads.some(s => !s.name || !s.name.trim());

            if (hasEmptySubHead) {
                document.getElementById('subHead').style.borderColor = 'red';
                return;
            }

            // 🟢 Prepare payload
            const body = {
                name: name.trim(),
                subHeads: subHeads.map(s => ({
                    name: s.name.trim(),
                })),
            };

            // 🚀 API call
            const res = await callAPI('/api/head', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
                onError: ({ status, message, data } = {}) => {
                    console.error("API Error:", status, message);
                },
            });

            // 🟢 Reset UI after success
            setName('');
            setSubHeads([]);
            setNewSubHead('');
            setShowNewSubHead(false);

            // optional: success feedback
            console.log("Head created:", res);

        } catch (err) {
            console.error("Submit Error:", err);
        }
    }

    return (
        <form className='head-form-container'>
            <div className='inputs-container'>
                <input style={{ maxWidth: '463px' }} id='name' type='text' onChange={(e) => setName(e.target.value)} autoComplete='off' value={name} placeholder='Head Name' />
            </div>
            <div className='sub-heads-container'>
                <div className='sub-heads-header'>
                    <h1 className='text-med text-bold text-dark'>Sub Heads<span className='text-secondary'>:</span></h1>
                    <button className='text-sm text-primary' onClick={(e) => { e.preventDefault(); setShowNewSubHead(true) }}><img src={plus} alt='plus' /></button>
                </div>
                <div className='added-sub-heads-container'>
                    {
                        subHeads.length === 0 ? (
                            <p className='text-dark text-xsm text-thin'>{subHeads.length} Sub Heads added</p>
                        ) : subHeads.map((val, index) => {
                            return (
                                <div style={{ maxWidth: '463px' }} className='added-sub-head' key={index}>
                                    <p><span className='text-sm text-dark text-bold'>{val.name}</span></p>
                                    <button onClick={(e) => deleteSubHead(e, val._id)}><img src={del} alt="delete" /></button>
                                </div>
                            )
                        })
                    }
                </div>
                {showNewSubHead &&
                    <div className='sub-head-form-container'>
                        <h2 className='text-sm text-dark'>New Sub Head:</h2>
                        <div className='input-container'>
                            <input style={{ maxWidth: '463px' }} id='subHead' type='text' onChange={(e) => setNewSubHead(e.target.value)} autoComplete='off' value={newSubHead} placeholder='Sub Head Name' />
                        </div>
                        <div className='btn-container'>
                            <button className='text-xsm text-dark' onClick={onSubHeadAdd}>Add</button>
                            <button className='text-xsm text-dark' onClick={(e) => { e.preventDefault(); setShowNewSubHead(false) }}>Cancel</button>
                        </div>
                    </div>
                }
            </div>
            <button onClick={onSubmit} className='text-sm text-dark text-thin'>Submit</button>
        </form>
    )
}