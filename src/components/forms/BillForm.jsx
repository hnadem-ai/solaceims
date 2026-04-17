import './BillForm.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { callAPI } from '../../api/client';
import CustomDropdown from '../CustomDropdown';
import plus from '../../assets/plus-primary.png';
import del from '../../assets/delete.png';

export default function BillForm({ mode = 'create', data = {}, onSuccess = () => {} }) {

    const [vendor, setVendor] = useState(null);
    const [showVendorDrop, setShowVendorDrop] = useState(false)
    const [vendorText, setVendorText] = useState('');
    const [vendors, setVendors] = useState([]);
    const [head, setHead] = useState(null);
    const [showHeadDrop, setShowHeadDrop] = useState(false)
    const [headText, setHeadText] = useState('');
    const [heads, setHeads] = useState([]);
    const [vendorBillNo, setVendorBillNo] = useState('');
    const [comments, setComments] = useState('');
    const [items, setItems] = useState([]);
    const [showNewItem, setShowNewItem] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0)

    //Item Form States

    const [item, setItem] = useState('');
    const [unit, setUnit] = useState('');
    const [rate, setRate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [amount, setAmount] = useState('');
    const [itemComments, setItemComments] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!data) return;
        if (mode === 'create') return;

        setVendor(data.vendor?._id);
        setVendorText(data.vendor?.name || '');
        setVendorBillNo(data.vendorBillNo || '');
        setComments(data.comments || '');

        // 🔥 FIX: ensure every item has an id
        const normalizedItems = (data.items || []).map((item) => ({
            ...item,
            id: item._id || Date.now() + Math.random(), // fallback if no _id
        }));

        setItems(normalizedItems);

        setTotalAmount(data.totalAmount || 0);
        setHead(data.head?._id);
        setHeadText(data.head?.name || '');
    }, [data]);

    useEffect(() => {
        setAmount(rate * quantity);
    }, [rate, quantity])

    const vendorRef = useRef();
    const headRef = useRef();
    const vendorReqId = useRef(0);
    const headReqId = useRef(0);

    function arrayToDropdownElements(array = []) {
        return array.map((element) => ({
            value: element._id,          // ✅ bank id
            heading: element.name,       // ✅ bank name
            subHeading: element.accNum,  // ✅ account number
        }));
    }

    useEffect(() => {
        function handleDocumentClick(e) {
            if (!showVendorDrop) return;

            const vendorEl = vendorRef.current;

            if (vendorEl && vendorEl.contains(e.target)) return;

            setShowVendorDrop(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showVendorDrop]);

    useEffect(() => {
        function handleDocumentClick(e) {
            if (!showHeadDrop) return;

            const headEl = headRef.current;

            if (headEl && headEl.contains(e.target)) return;

            setShowHeadDrop(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showHeadDrop]);

    useEffect(() => {
        async function fetchVendors() {
            try {
                const res = await callAPI('/api/vendor', {
                    method: 'GET',
                })
                console.log(res.vendors);
                setVendors(res.vendors);
            } catch (err) {
                console.error(err);
            }
        }
        fetchVendors();
    }, []);

    useEffect(() => {
        async function fetchHeads() {
            try {
                const res = await callAPI('/api/head', {
                    method: 'GET',
                })
                console.log(res.heads);
                setHeads(res.heads);
            } catch (err) {
                console.error(err);
            }
        }
        fetchHeads();
    }, []);

    useEffect(() => {
        const q = vendorText.trim();

        if (!q || q.length < 2) {
            setVendors([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const reqId = ++vendorReqId.current;

            try {
                const res = await callAPI(`/api/vendor?q=${encodeURIComponent(q)}`, {
                    method: 'GET',
                });

                if (reqId !== vendorReqId.current) return;

                setVendors(res.vendors || []);
                setShowVendorDrop(true);
            } catch (err) {
                if (reqId !== vendorReqId.current) return;
                console.error(err);
            }
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [vendorText]);

    useEffect(() => {
        const q = headText.trim();

        if (!q || q.length < 2) {
            setHeads([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const reqId = ++headReqId.current;

            try {
                const res = await callAPI(`/api/head?q=${encodeURIComponent(q)}`, {
                    method: 'GET',
                });

                if (reqId !== headReqId.current) return;

                setHeads(res.heads || []);
                setShowHeadDrop(true);
            } catch (err) {
                if (reqId !== headReqId.current) return;
                console.error(err);
            }
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [headText]);

    useEffect(() => {
        setTotalAmount(calculateTotalAmount());
    }, [items]);

    async function onSubmit(e) {
        e.preventDefault();

        if (!vendor || !head || !vendorBillNo) {
            console.log(vendor, head, vendorBillNo);
            return;
        }

        const body = {
            vendor,
            vendorBillNo,
            head,
            comments,
            items,
            totalAmount,
        };

        try {
            let res;

            if (mode === 'edit') {
                // 🔥 UPDATE
                const billId = data._id;

                res = await callAPI(`/api/bill/${billId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body,
                });

            } else {
                // 🔥 CREATE
                res = await callAPI('/api/bill', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body,
                });
            }

            onSuccess(res.bill);
            console.log(res.status);

            // 🔥 optional: reset form or exit edit mode
            if (mode === 'create') {
                // reset form
                setVendor(null);
                setVendorText('');
                setVendorBillNo('');
                setComments('');
                setItems([]);
                setTotalAmount(0);
            }

        } catch (err) {
            console.error(err);
        }
    }

    function calculateTotalAmount() {
        return items.reduce((sum, curr) => sum + (Number(curr.amount) || 0), 0);
    }

    function onAdd(e) {
        e.preventDefault();

        if (!item) {
            document.getElementById('item').style.borderColor = 'red';
            return;
        }
        if (!unit) {
            document.getElementById('unit').style.borderColor = 'red';
            return;
        }
        if (!rate) {
            document.getElementById('rate').style.borderColor = 'red';
            return;
        }
        if (!quantity) {
            document.getElementById('quantity').style.borderColor = 'red';
            return;
        }

        if (!amount) {
            document.getElementById('amount').style.borderColor = 'red';
            return;
        }
        const payload = {
            id: Date.now(),
            item,
            unit,
            rate: Number(rate),
            quantity: Number(quantity),
            amount: Number(amount),
            comments: itemComments,
        }
        setItems(prev => [...prev, payload]);
        setTotalAmount(calculateTotalAmount(items));
        setShowNewItem(false);
        setItem('')
        setUnit('')
        setRate('')
        setQuantity('')
        setAmount('')
        setItemComments('')
    }

    function deleteItem(e, id) {
        e.preventDefault();
        setItems(prev => prev.filter(item => item.id !== id))
    }

    return (
        <form className='bill-form-container' onSubmit={onSubmit}>
            <div className='inputs-container'>
                <div className='input-wrapper'>
                    <input id='vendor' autoComplete='off' ref={vendorRef} placeholder='Vendor' type="text" value={vendorText} onChange={(e) => setVendorText(e.target.value)} onClick={(e) => setShowVendorDrop(vendors.length > 0 ? true : false)} />
                    {showVendorDrop && <CustomDropdown setSelfState={setShowVendorDrop} setState={setVendor} setText={setVendorText} elements={arrayToDropdownElements(vendors)} />}
                </div>
                <input id='vendorBillNo' autoComplete='off' placeholder='Vendor Bill No.' type="text" value={vendorBillNo} onChange={(e) => setVendorBillNo(e.target.value)} />
                <input id='comments' autoComplete='off' type='text' onChange={(e) => setComments(e.target.value)} value={comments} placeholder='Comments (optional)' />
                <div className='input-wrapper'>
                    <input id='head' autoComplete='off' ref={headRef} placeholder='Head' type="text" value={headText} onChange={(e) => setHeadText(e.target.value)} onClick={(e) => setShowHeadDrop(heads.length > 0 ? true : false)} />
                    {showHeadDrop && <CustomDropdown setSelfState={setShowHeadDrop} setState={setHead} setText={setHeadText} elements={arrayToDropdownElements(heads)} />}
                </div>
            </div>
            <div className='items-container'>
                <div className='items-header'>
                    <h1 className='text-med text-bold text-dark'>Item</h1>
                    <button className='text-sm text-primary' onClick={(e) => { e.preventDefault(); setShowNewItem(true) }}><img src={plus} alt='plus' /></button>
                </div>
                <div className='added-items-container'>
                    {
                        items.length === 0 ? (
                            <p className='text-xsm text-dark'>{items.length} Items added</p>
                        ) : items.map((val, index) => {
                            return (
                                <div className='added-item' key={index}>
                                    <p className='text-dark'>Item: <span className='text-secondary text-bold'>{val.item}</span></p>
                                    <p className='text-dark'>Units: <span className='text-secondary text-bold'>{val.unit}</span></p>
                                    <p className='text-dark'>Rate: <span className='text-secondary text-bold'>{val.rate}</span></p>
                                    <p className='text-dark'>Quantity: <span className='text-secondary text-bold'>{val.quantity}</span></p>
                                    <p className='text-dark'>Amount: <span className='text-secondary text-bold'>{val.amount}</span></p>
                                    <p className='text-dark'>Comments: <span className='text-secondary text-bold'>{val.comments ? val.comments : 'None'}</span></p>
                                    <button onClick={(e) => deleteItem(e, val.id)}><img src={del} alt="delete" /></button>
                                </div>
                            )
                        })
                    }
                </div>
                {showNewItem ?
                    (
                        <div className='item-form-container'>
                            <h2 className='text-sm text-dark'>New Item</h2>
                            <div className='input-container'>
                                <input id='item' autoComplete='off' type="text" value={item} onChange={(e) => setItem(e.target.value)} placeholder='Item' />
                                <input id='unit' autoComplete='off' type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder='Unit' />
                                <input id='rate' autoComplete='off' type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder='Rate' />
                                <input id='quantity' autoComplete='off' type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder='Quantity' />
                                <input id='amount' autoComplete='off' type="number" value={quantity * rate === 0 ? 'Amount' : quantity * rate} onChange={(e) => setAmount(e.target.value)} placeholder='Amount' />
                                <textarea id='comments' autoComplete='off' type="text" value={itemComments} onChange={(e) => setItemComments(e.target.value)} placeholder='Comments (optional)' />
                            </div>
                            <div className='btn-container'>
                                <button className='text-xsm text-dark' onClick={onAdd}>Add</button>
                                <button className='text-xsm text-dark' onClick={(e) => { e.preventDefault(); setShowNewItem(false) }}>Cancel</button>
                            </div>
                        </div>
                    ) :
                    <></>
                }
            </div>
            <h1 className='text-sm text-dark'>Total Amount: <span className='text-secondary text-bold'>{calculateTotalAmount()}</span></h1>
            <button className='text-sm text-dark text-thin' type='submit'>Submit</button>
        </form>
    )
}