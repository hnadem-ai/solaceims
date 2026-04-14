import './ProjectForm.css';
import { useState, useEffect, useRef } from 'react';
import { callAPI } from '../../api/client';
import InventoryForm from './InventoryForm';
import CustomDropdown from '../CustomDropdown';
import plus from '../../assets/plus-primary.png';
import del from '../../assets/delete.png';

export default function ProjectForm(){
    const [name, setName] = useState('');
    const [detail, setDetail] = useState('');
    const [bank, setBank] = useState(null);
    const [bankText, setBankText] = useState('');
    const [inventory, setInventory] = useState([]);
    const [banks, setBanks] = useState([]);
    const [showBanks, setShowBanks] = useState([]);
    const [showDrop, setShowDrop] = useState(false);
    const [showNewInventory, setShowNewInventory] = useState(false);
    const bankRef = useRef();

    function banksToDropdownElements(banks = []) {
        return banks.map((bank) => ({
            value: bank._id,          // ✅ bank id
            heading: bank.name,       // ✅ bank name
            subHeading: bank.accNum,  // ✅ account number
        }));
    }


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
    }, [bank])

    useEffect(() => {
        async function fetchBanks(){
            try{
                const res = await callAPI('/api/bank', {
                    method: 'GET',
                })
                console.log(res.banks)
                setBanks(res.banks);
            } catch (err) {
                console.error(err);
            }
        }
        fetchBanks();
    }, []);

    useEffect(() => {
        if(bank) return;
        // If user is editing bank text, the previously selected bank is no longer reliable
        setBank(null);

        const q = bankText.trim();

        // Optional: if empty, either hide dropdown or fetch default list
        if (!q) {
            // If you want to show all banks when empty:
            // setShowDrop(false); // or keep it true
            // setBanks(initialBanks); // if you store them separately
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                // IMPORTANT: assumes your backend supports /api/bank?q=
                const res = await callAPI(`/api/bank?q=${encodeURIComponent(q)}`, {
                    method: "GET",
                });

                // Update dropdown list
                setBanks(res.banks || []);
                setShowDrop(true);
            } catch (err) {
                console.error(err);
            }
        }, 350); // debounce delay (ms) - adjust to taste

        return () => clearTimeout(timeoutId);
    }, [bankText]);


    async function onSubmit(e) {

        if(!name || !bank){
            return;
        }

        //Make API body here

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
        setBankText(e.target.value);
    }

    function deleteInventoryItem(e, id){
        e.preventDefault();
        setInventory(prev => prev.filter(item => item.id !== id))
    }

    return (
        <form className='project-form-container' onSubmit={onSubmit}>
            <div className='project-details'>
                <div>
                    <input placeholder='Name' type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <div className='input-wrapper'>
                        <input placeholder='Bank' ref={bankRef} type="text" value={bankText} onChange={filterShowBankArray} onClick={(e) => setShowDrop(true)} />
                        {showDrop && <CustomDropdown setSelfState={setShowDrop} elements={banksToDropdownElements(banks)} setState={setBank} setText={setBankText}/>}
                    </div>
                </div>
                <textarea name="detail" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder='Details (optional)'/>
            </div>
            <div className='inventory-container'>
                <div className='inventory-header'>
                    <h1 className='text-med text-bold text-dark'>Inventory</h1>
                    <button className='text-sm text-primary' onClick={(e) => {e.preventDefault(); setShowNewInventory(true)}}><img src={plus} alt='plus'/></button>
                </div>
                <div className='added-inventory-container'>
                    {
                        inventory.length === 0 ? (
                            <p className='text-xsm text-dark'>{inventory.length} Inventories added</p>
                        ) : inventory.map((val, index)=> {
                            return (
                                <div className='added-inventory' key={index}>
                                    <p className='text-dark'>Unit No: <span className='text-secondary text-bold'>{val.unitNo}</span></p>
                                    <p className='text-dark'>Floor: <span className='text-secondary text-bold'>{val.floor}</span></p>
                                    <p className='text-dark'>Size: <span className='text-secondary text-bold'>{val.size}</span></p>
                                    <p className='text-dark'>Utilities: <span className='text-secondary text-bold'>{val.utilities}</span></p>
                                    <p className='text-dark'>Remarks: <span className='text-secondary text-bold'>{val.remarks ? val.remarks : 'None'}</span></p>
                                    <button onClick={(e) => deleteInventoryItem(e, val.id)}><img src={del} alt="delete"/></button>
                                </div>
                            )
                        })
                    }
                </div>
                { showNewInventory ? 
                    <InventoryForm setInventory={setInventory} setShowNewInventory={setShowNewInventory}/> : 
                    <></>
                }
            </div>
            <button className='text-sm text-dark text-thin' type='submit'>Submit</button>
        </form>
    )
}