import './ProjectForm.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { callAPI } from '../../api/client';
import InventoryForm from './InventoryForm';
import CustomDropdown from '../CustomDropdown';
import plus from '../../assets/plus-primary.png';
import del from '../../assets/delete.png';

export default function ProjectForm({ mode = 'create', data = null, onSuccess = () => {} }) {
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

    const navigate = useNavigate();

    function banksToDropdownElements(banks = []) {
        return banks.map((bank) => ({
            value: bank._id,          // ✅ bank id
            heading: bank.name,       // ✅ bank name
            subHeading: bank.accNum,  // ✅ account number
        }));
    }

    useEffect(() => {
        if (mode === 'edit' && data) {
            console.log('Populating form with data:', data);
            setName(data.name || '');
            setDetail(data.detail || '');
            setBank(data.bank?._id || null);
            setBankText(data.bank?.name || '');
            const normalizedInventory = (data.inventory || []).map((item) => ({
                ...item,
                id: item._id || Date.now() + Math.random(), // 🔥 stable id
            }));
            setInventory(normalizedInventory);
        }
    }, [data?._id]);

    useEffect(() => {
        console.log('Selected bank ID:', bank);
    }, [name]);

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
        const q = bankText.trim();

        if (!q) return;

        const timeoutId = setTimeout(async () => {
            try {
                const res = await callAPI(`/api/bank?q=${encodeURIComponent(q)}`, {
                    method: "GET",
                });

                setBanks(res.banks || []);
                setShowDrop(true);
            } catch (err) {
                console.error(err);
            }
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [bankText]);

    async function onSubmit(e) {
        e.preventDefault();

        if (!name || !bank) return;

        // 🔥 remove frontend-only id before sending
        const cleanedInventory = inventory.map(({ id, ...rest }) => rest);

        const body = {
            name,
            detail,
            bank,
            inventory: cleanedInventory,
        };

        try {
            let res;

            if (mode === 'edit') {
                // 🔥 UPDATE
                const projectId = data._id;

                res = await callAPI(`/api/project/${projectId}`, {
                    method: 'PUT',
                    body,
                });

            } else {
                // 🔥 CREATE
                res = await callAPI('/api/project', {
                    method: 'POST',
                    body,
                });
            }
            onSuccess(res.project);
            console.log(res);

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
                                    <p className='text-dark'>Estimated Val: <span className='text-secondary text-bold'>{val.estimatedValue}</span></p>
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