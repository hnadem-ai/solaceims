import './ProjectForm.css';
import { useState, useEffect, useRef } from 'react';
import { callAPI } from '../../api/client';
import InventoryForm from './InventoryForm';
import CustomDropdown from '../CustomDropdown';

export default function ProjectForm(){
    const [name, setName] = useState('');
    const [detail, setDetail] = useState('');
    const [bank, setBank] = useState(null);
    const [bankText, setBankText] = useState('');
    const [inventory, setInventory] = useState([]);
    const [banks, setBanks] = useState([]);
    const [showBanks, setShowBanks] = useState([]);
    const [showDrop, setShowDrop] = useState(false);
    const [showNewInventory, setShowNewInventory] = useState(false)
    const bankRef = useRef();

    useEffect(() => {
        function handleDocumentClick(e) {
            if (!showDrop) return;

            const bankEl = bankRef.current;

            if (bankEl && bankEl.contains(e.target)) return;

            setShowDrop(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showDrop]);

    useEffect(() => {
        if(!bank) return;
        if(bank === '1') setBankText('Success')
    }, [bank])

    // useEffect(async () => {
    //     try{
    //         const res = await callAPI('/api/bank', {
    //             method: 'GET',
    //         })
    //         setBanks(res.banks);
    //         setShowBanks(res.banks);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }, [])

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
            const res = await callAPI('/api/project', {
                method: 'POST',
                body,
                onError: ({status, message, data} = {}) => {
                    return;
                },
            })
        } catch (err) {
            console.error(err);
        }
    }

    function filterShowBankArray(e){
        e.preventDefault();
        setBankText(e.target.value);
        setShowBanks(prev => prev.filter(currBank => currBank.startsWith(bank, 0)));
    }

    return (
        <form className='project-form-container' onSubmit={onSubmit}>
            <input placeholder='Name' type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <div className='input-wrapper'>
                <input placeholder='Bank' ref={bankRef} type="text" value={bankText} onChange={filterShowBankArray} onClick={(e) => setShowDrop(true)} />
                {showDrop && <CustomDropdown setSelfState={setShowDrop} elements={[{heading: 'MCB', subHeading: 'Khrram Solangi', value: '1'}, {heading: 'MCB', subHeading: 'Khrram Solangi', value: '1'}, {heading: 'MCB', subHeading: 'Khrram Solangi', value: '1'}]} setState={setBank}/>}
            </div>
            <textarea name="detail" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder='Details (optional)'/>
            <div className='inventory-container'>
                <div className='added-inventory'>
                    <h1 className='text-med text-bold text-dark'>Inventory<span className='text-secondary'>:</span></h1>
                </div>
                <InventoryForm setInventory={setInventory} setShowNewInventory={setShowNewInventory}/>
            </div>
            <button type='submit'>Create</button>
        </form>
    )
}