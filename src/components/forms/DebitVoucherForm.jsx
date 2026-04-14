import './DebitVoucherForm.css';
import { useState, useRef, useEffect } from 'react';
import { callAPI } from '../../api/client';
import CustomDropdown from '../CustomDropdown';
import plus from '../../assets/plus-primary.png';
import del from '../../assets/delete.png';

export default function DebitVoucherForm(){
    const [project, setProject] = useState(null);
    const [showProjectDrop, setShowProjectDrop] = useState(false)
    const [projectText, setProjectText] = useState('');
    const [projects, setProjects] = useState([]);

    const [bank, setBank] = useState(null);
    const [showBankDrop, setShowBankDrop] = useState(false)
    const [bankText, setBankText] = useState('');
    const [banks, setBanks] = useState([]);

    const [head, setHead] = useState(null);
    const [showHeadDrop, setShowHeadDrop] = useState(false)
    const [headText, setHeadText] = useState('');
    const [showHeads, setShowHeads] = useState([]);

    const [subHead, setSubHead] = useState(null);
    const [showSubHeadDrop, setShowSubHeadDrop] = useState(false)
    const [subHeadText, setSubHeadText] = useState('');
    const [showSubHeads, setShowSubHeads] = useState([]);

    const [bill, setBill] = useState(null);
    const [showBillDrop, setShowBillDrop] = useState(false)
    const [billText, setBillText] = useState('');
    const [bills, setBills] = useState([]);

    const [paidToConfig, setPaidToConfig] = useState('');
    const [paidTo, setPaidTo] = useState(null);
    const [showPaidToDrop, setShowPaidToDrop] = useState(false)
    const [paidToText, setPaidToText] = useState('');
    const [paidTos, setPaidTos] = useState([]);

    const [date, setDate] = useState('');

    const [payInstrument, setPayInstrument] = useState('');
    const [showPayInstrumentDrop, setShowPayInstrumentDrop] = useState(false);

    const [instrumentNo, setInstrumentNo] = useState('');
    const [instrumentDate, setInstrumentDate] = useState('');

    const [amount, setAmount] = useState(0)

    const [payStatus, setPayStatus] = useState('');
    const [showPayStatusDrop, setShowPayStatusDrop] = useState(false);

    const [showNewHead, setShowNewHead] = useState(false);
    const [addedHeads, setAddedHeads] = useState([]);

    const [showNewSubHead, setShowNewSubHead] = useState(false);
    const [addedSubHeads, setAddedSubHeads] = useState([]);

    function arrayToDropdownElements(array = [], arrayType = '') {
        return array.map((element) => ({
            value: element._id,          // ✅ bank id
            heading: arrayType === 'bill' ? element.serialNo : element.name,       // ✅ bank name
            subHeading: element.accNum ? element.accNum : '',  // ✅ account number
        }));
    }

    const projectRef = useRef(null);
    const paidToRef = useRef(null);
    const payInstrumentRef = useRef(null);
    const bankRef = useRef(null);
    const billRef = useRef(null);
    const payStatusRef = useRef(null);
    const headRef = useRef(null);
    const subHeadRef = useRef(null);
    const projectReqId = useRef(0);
    const billReqId = useRef(0);
    const bankReqId = useRef(0);
    const paidToReqId = useRef(0);
    
    useEffect(() => {
        function handleDocumentClick(e) {
            if (!showProjectDrop) return;

            const projectEl = projectRef.current;

            if (projectEl && projectEl.contains(e.target)) return;

            setShowProjectDrop(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showProjectDrop]);

    useEffect(() => {
        function handleDocumentClick(e) {
            if (!showPaidToDrop) return;

            const paidToEl = paidToRef.current;

            if (paidToEl && paidToEl.contains(e.target)) return;

            setShowPaidToDrop(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showPaidToDrop]);

    useEffect(() => {
        function handleDocumentClick(e) {
            if (!showPayInstrumentDrop) return;

            const payInstrumentEl = payInstrumentRef.current;

            if (payInstrumentEl && payInstrumentEl.contains(e.target)) return;

            setShowPayInstrumentDrop(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showPayInstrumentDrop]);

    useEffect(() => {
        function handleDocumentClick(e) {
            if (!showBankDrop) return;

            const bankEl = bankRef.current;

            if (bankEl && bankEl.contains(e.target)) return;

            setShowBankDrop(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showBankDrop]);

    useEffect(() => {
        function handleDocumentClick(e) {
            if (!showBillDrop) return;

            const billEl = billRef.current;

            if (billEl && billEl.contains(e.target)) return;

            setShowBillDrop(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showBillDrop]);

    useEffect(() => {
        function handleDocumentClick(e) {
            if (!showPayStatusDrop) return;

            const payStatusEl = payStatusRef.current;

            if (payStatusEl && payStatusEl.contains(e.target)) return;

            setShowPayStatusDrop(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showPayStatusDrop]);

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
        function handleDocumentClick(e) {
            if (!showSubHeadDrop) return;

            const subHeadEl = subHeadRef.current;

            if (subHeadEl && subHeadEl.contains(e.target)) return;

            setShowSubHeadDrop(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showSubHeadDrop]);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await callAPI('/api/project', {
                    method: 'GET',
                })
                console.log(res.projects);
                setProjects(res.projects);
            } catch (err) {
                console.error(err);
            }
        }
        fetchProjects();
    }, [])

    useEffect(() => {
        async function fetchBanks() {
            try {
                const res = await callAPI('/api/bank', {
                    method: 'GET',
                })
                console.log(res.banks);
                setBanks(res.banks);
            } catch (err) {
                console.error(err);
            }
        }
        fetchBanks();
    }, []);

    useEffect(() => {
        async function fetchBills() {
            try {
                const res = await callAPI('/api/bill', {
                    method: 'GET',
                })
                console.log(res.banks);
                setBills(res.bills);
            } catch (err) {
                console.error(err);
            }
        }
        fetchBills();
    }, []);

    useEffect(() => {
        async function fetchHeads() {
            try {
                const res = await callAPI('/api/head', {
                    method: 'GET',
                })
                console.log(res.heads);
                setShowHeads(res.heads);
            } catch (err) {
                console.error(err);
            }
        }
        fetchHeads();
    }, []);

    useEffect(() => {
        async function fetchSubHeads() {
            try {
                const res = await callAPI('/api/sub-head', {
                    method: 'GET',
                })
                console.log(res.subHeads);
                setShowSubHeads(res.subHeads);
            } catch (err) {
                console.error(err);
            }
        }
        fetchSubHeads();
    }, [head]);

    useEffect(() => {
        if(!paidToConfig) return
        async function fetchProjects() {
            try {
                const res = await callAPI('/api/project', {
                    method: 'GET',
                })
                console.log(res.projects);
                setPaidTos(res.projects);
            } catch (err) {
                console.error(err);
            }
        }

        async function fetchVendors() {
            try {
                const res = await callAPI('/api/vendor', {
                    method: 'GET',
                })
                console.log(res.vendors);
                setPaidTos(res.vendors);
            } catch (err) {
                console.error(err);
            }
        }
        if (paidToConfig === 'Vendor') fetchVendors();
        if (paidToConfig === 'Project') fetchProjects();
    }, [paidToConfig]);

    useEffect(() => {
        if(project) return;
        setProject(null);

        const q = projectText.trim();

        if (!q || q.length < 2) {
            setProjects([]);
            setShowProjectDrop(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const reqId = ++projectReqId.current;

            try {
                const res = await callAPI(`/api/project?q=${encodeURIComponent(q)}`, {
                    method: "GET",
                });

                if (reqId !== projectReqId.current) return;

                setProjects(res.projects || []);
                setShowProjectDrop(true);
            } catch (err) {
                if (reqId !== projectReqId.current) return;
                console.error(err);
            }
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [projectText]);

    useEffect(() => {
        if(bank) return;

        setBank(null);

        const q = bankText.trim();

        if (!q || q.length < 2) {
            setBanks([]);
            setShowBankDrop(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const reqId = ++bankReqId.current;

            try {
                const res = await callAPI(`/api/bank?q=${encodeURIComponent(q)}`, {
                    method: "GET",
                });

                if (reqId !== bankReqId.current) return;

                setBanks(res.banks || []);
                setShowBankDrop(true);
            } catch (err) {
                if (reqId !== bankReqId.current) return;
                console.error(err);
            }
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [bankText]);

    useEffect(() => {
        if(bill) return;
        setBill(null);

        const q = billText.trim();

        if (!q) {
            setBills([]);
            setShowBillDrop(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const reqId = ++billReqId.current;

            try {
                const res = await callAPI(`/api/bill?q=${encodeURIComponent(q)}`, {
                    method: "GET",
                });

                if (reqId !== billReqId.current) return;

                setBills(res.bills || []);
                setShowBillDrop(true);
            } catch (err) {
                if (reqId !== billReqId.current) return;
                console.error(err);
            }
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [billText]);

    useEffect(() => {
        if(paidTo) return;
        // typing invalidates previous selection
        setPaidTo(null);

        const q = paidToText.trim();

        if (!paidToConfig || !q || q.length < 2) {
            setPaidTos([]);
            setShowPaidToDrop(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const reqId = ++paidToReqId.current;

            try {
                let endpoint = "";

                if (paidToConfig === "Vendor") {
                    endpoint = `/api/vendor?q=${encodeURIComponent(q)}`;
                }

                if (paidToConfig === "Project") {
                    endpoint = `/api/project?q=${encodeURIComponent(q)}`;
                }

                if (!endpoint) return;

                const res = await callAPI(endpoint, { method: "GET" });

                // ignore stale responses
                if (reqId !== paidToReqId.current) return;

                const data =
                    paidToConfig === "Vendor" ? res.vendors : res.projects;

                setPaidTos(data || []);
                setShowPaidToDrop(true);
            } catch (err) {
                if (reqId !== paidToReqId.current) return;
                console.error(err);
            }
        }, 350); // ⏱ debounce delay

        return () => clearTimeout(timeoutId);
    }, [paidToText, paidToConfig]);


    async function onSubmit(e) {
        e.preventDefault();

        // --------- basic UI reset (optional) ----------
        const setErrBorder = (id, on) => {
            const el = document.getElementById(id);
            if (el) el.style.borderColor = on ? "red" : "rgb(114, 68, 187)";
        };

        let hasError = false;

        if (!project) { setErrBorder("project", true); hasError = true; }
        else setErrBorder("project", false);

        if (!date) { setErrBorder("date", true); hasError = true; }
        else setErrBorder("date", false);

        if (!paidTo) { setErrBorder("paidTo", true); hasError = true; }
        else setErrBorder("paidTo", false);

        if (amount == null || amount === "" || Number(amount) <= 0) {
            setErrBorder("amount", true);
            hasError = true;
        } else setErrBorder("amount", false);

        if (!payInstrument) {
            setErrBorder("payInstrument", true);
            hasError = true;
        } else setErrBorder("payInstrument", false);

        if (!payStatus) {
            setErrBorder("payStatus", true);
            hasError = true;
        } else setErrBorder("payStatus", false);

        if (!paidTo) {
            setErrBorder("paidTo", true);
            hasError = true;
        } else setErrBorder("paidTo", false);

        if (paidToConfig !== 'Project' && paidToConfig !== 'Vendor') {
            setErrBorder("paidTo", true);
            hasError = true;
        } else setErrBorder("paidTo", false);

        if (hasError) return;

        // --------- conditional validations ----------
        const isCheque =
            payInstrument === "Cheque" || payInstrument === "Post Dated Cheque";

        const isOnline = payInstrument === "Online Transfer";

        // If cheque -> instrumentNo usually required + instrumentDate recommended
        if (isCheque) {
            if (!instrumentNo?.trim()) {
                setErrBorder("instrumentNo", true);
                return;
            } else setErrBorder("instrumentNo", false);

            if (!instrumentDate) {
                setErrBorder("instrumentDate", true);
                return;
            } else setErrBorder("instrumentDate", false);
            if (!bank) {
                setErrBorder("bank", true);
                return;
            } else setErrBorder("bank", false);
        }

        // If online transfer -> bank usually required
        if (isOnline) {
            if (!bank?._id) {
                setErrBorder("bank", true);
                return;
            } else setErrBorder("bank", false);
        }

        // --------- build body (matches schema) ----------
        const body = {
            project,
            // serialNo is required in schema, but your backend currently does NOT set it.
            // If you plan to set it server-side, remove it from required in schema OR set it in backend.
            // For now, if you have a serialNo state, include it:
            // serialNo,

            date: new Date(date), // ensure Date
            paidTo: paidTo,
            targetModel: paidToConfig, // critical for refPath
            amount: Number(amount),
            payInstrument,
            payStatus,

            // optional:
            instrumentNo: instrumentNo?.trim() || undefined,
            instrumentDate: instrumentDate ? new Date(instrumentDate) : undefined,
            bill: bill,
            bank: bank,

            // arrays (optional)
            heads: Array.isArray(addedHeads) ? addedHeads.map(h => h._id) : undefined,
            subHeads: Array.isArray(addedSubHeads) ? addedSubHeads.map(s => s._id) : undefined,
        };

        // Remove undefined keys (keeps payload clean)
        Object.keys(body).forEach((k) => body[k] === undefined && delete body[k]);

        // --------- call API ----------
        try {
            const res = await callAPI("/api/debit-voucher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
                onError: ({ status, message, data } = {}) => {
                    console.error("Create debit voucher failed:", status, message, data);
                    // show toast if you want
                },
            });

            // success handling (depends on your callAPI return shape)
            // Example:
            // if (res?.success) { ...reset form... }
            console.log("Debit voucher created:", res);
        } catch (err) {
            console.error(err);
        }
    }

    const handleChange = (event) => {
        setPaidToConfig(event.target.value);
    };

    
    function deleteHead(e, id){
        e.preventDefault();
        setAddedHeads(prev => prev.filter(head => head._id !== id))
    }

    function deleteSubHead(e, id){
        e.preventDefault();
        setAddedSubHeads(prev => prev.filter(subHead => subHead._id !== id))
    }

    function onHeadAdd(e) {
        e.preventDefault();

        if (!head) {
            document.getElementById('head').style.borderColor = 'red';
            return;
        }
        const payload = {
            _id: head,
            name: headText,
        };
        setAddedHeads(prev => [...prev, payload]);
        setHead(null);
        setHeadText('');
        setShowNewHead(false);
    }

     function onSubHeadAdd(e) {
        e.preventDefault();

        if (!subHead) {
            document.getElementById('subHead').style.borderColor = 'red';
            return;
        }
        const payload = {
            _id: subHead,
            name: subHeadText,
        };
        setAddedSubHeads(prev => [...prev, payload]);
        setSubHead(null);
        setSubHeadText('');
        setShowNewSubHead(false);
    }

    return (
        <form onSubmit={onSubmit} className='debit-voucher-form-container'>
            <div className='inputs-container'>
                <div className='input-wrapper'>
                    <input id='project' autoComplete='off' ref={projectRef} placeholder='Project' type="text" value={projectText} onChange={(e) => setProjectText(e.target.value)} onClick={(e) => setShowProjectDrop(true)} />
                    {projects.length > 0 && showProjectDrop && <CustomDropdown setSelfState={setShowProjectDrop} setState={setProject} setText={setProjectText} elements={arrayToDropdownElements(projects)} />}
                </div>
                <input id='date' autoComplete='off' type='date' onChange={(e) => setDate(e.target.value)} value={date} placeholder='Date' />
            </div>
            <div className='inputs-container'>
                <label className='text-dark'>
                    <input
                        type="radio"
                        name="Vendor"
                        value="Vendor"
                        checked={paidToConfig === 'Vendor'}
                        onChange={handleChange}
                    /> Vendor
                </label>
                <label className='text-dark'>
                    <input
                        type="radio"
                        name="Project"
                        value="Project"
                        checked={paidToConfig === 'Project'}
                        onChange={handleChange}
                    /> Project
                </label>
                <div className='input-wrapper'>
                    <input id='paidTo' autoComplete='off' ref={paidToRef} placeholder='Paid To' type="text" value={paidToText} onChange={(e) => setPaidToText(e.target.value)} onClick={(e) => setShowPaidToDrop(true)} />
                    {paidToConfig && showPaidToDrop && <CustomDropdown setSelfState={setShowPaidToDrop} setState={setPaidTo} setText={setPaidToText} elements={arrayToDropdownElements(paidTos)} />}
                </div>
            </div>
            <div className='inputs-container'>
                <div className='input-wrapper'>
                    <input id='payInstrument' autoComplete='off' ref={payInstrumentRef} placeholder='Pay Instrument' type="text" value={payInstrument} onChange={(e) => setPayInstrument(e.target.value)} onClick={(e) => setShowPayInstrumentDrop(true)} />
                    {showPayInstrumentDrop && <CustomDropdown setSelfState={setShowPayInstrumentDrop} setState={setPayInstrument} setText={() => {return null}} elements={arrayToDropdownElements([{name: 'Cash', _id: 'Cash'}, {name: 'Post Dated Cheque', _id: 'Post Dated Cheque'}, {name: 'Online Transfer', _id: 'Online Transfer'},{name: 'Cheque', _id: 'Cheque'},])} />}
                </div>
                <input id='instrumentNo' autoComplete='off' type='text' onChange={(e) => setInstrumentNo(e.target.value)} value={instrumentNo} placeholder='Instrument No.' disabled={payInstrument === 'Cash' || payInstrument === ''} />
                <h1 className='text-sm text-bold text-dark'>Instrument Date:</h1>
                <input id='instrumentDate' autoComplete='off' type='date' onChange={(e) => setInstrumentDate(e.target.value)} value={instrumentDate} placeholder='Instrument Date' />
            </div>
            <div className='inputs-container'>
                <div className='input-wrapper'>
                    <input id='bill' ref={billRef} autoComplete='off' placeholder='Bill' type="text" value={billText} onChange={(e) => setBillText(e.target.value)} onClick={(e) => setShowBillDrop(true)} />
                    {bills.length > 0 && showBillDrop && <CustomDropdown setSelfState={setShowBillDrop} setState={setBill} setText={setBillText} elements={arrayToDropdownElements(bills, 'bill')} />}
                </div>
                <div className='input-wrapper'>
                    <input id='Bank' ref={bankRef} autoComplete='off' placeholder='Bank' type="text" value={bankText} onChange={(e) => setBankText(e.target.value)} onClick={(e) => setShowBankDrop(true)} />
                    {banks.length > 0 && showBankDrop && <CustomDropdown setSelfState={setShowBankDrop} setState={setBank} setText={setBankText} elements={arrayToDropdownElements(banks)} />}
                </div>
            </div>
            <div className='inputs-container'>
                <div className='input-wrapper'>
                    <input id='payStatus' autoComplete='off' ref={payStatusRef} placeholder='Pay Status' type="text" value={payStatus} onChange={(e) => setPayStatus(e.target.value)} onClick={(e) => setShowPayStatusDrop(true)} />
                    {showPayStatusDrop && <CustomDropdown setSelfState={setShowPayStatusDrop} setState={setPayStatus} setText={() => {return null}} elements={arrayToDropdownElements([{name: 'Paid', _id: 'Paid'}, {name: 'Unpaid', _id: 'Unpaid'}, {name: 'Due', _id: 'Due'},])} />}
                </div>
            </div>
            <div className='heads-sub-heads-container'>
                <div className='heads-container'>
                    <div className='heads-header'>
                        <h1 className='text-med text-bold text-dark'>Heads<span className='text-secondary'>:</span></h1>
                        <button className='text-sm text-primary' onClick={(e) => { e.preventDefault(); setShowNewHead(true) }}><img src={plus} alt='plus' /></button>
                    </div>
                    <div className='added-heads-container'>
                        {
                            addedHeads.length === 0 ? (
                                <p className='text-dark text-xsm text-thin'>{addedHeads.length} Heads added</p>
                            ) : addedHeads.map((val, index) => {
                                return (
                                    <div className='added-head' key={index}>
                                        <p>Name: <span className='text-sm text-secondary text-bold'>{val.name}</span></p>
                                        <button onClick={(e) => deleteHead(e, val._id)}><img src={del} alt="delete" /></button>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {showNewHead &&
                        <div className='head-form-container'>
                            <h2 className='text-sm text-dark'>New Head:</h2>
                            <div className='input-container'>
                                <div className='input-wrapper'>
                                    <input id='head' ref={headRef} placeholder='Head' type="text" value={headText} onChange={(e) => setHeadText(e.target.value)} onClick={(e) => setShowHeadDrop(true)} />
                                    {showHeads.length > 0 && showHeadDrop && <CustomDropdown setSelfState={setShowHeadDrop} setState={setHead} setText={setHeadText} elements={arrayToDropdownElements(showHeads)} />}
                                </div>
                            </div>
                            <div className='btn-container'>
                                <button className='text-xsm text-dark' onClick={onHeadAdd}>Add</button>
                                <button className='text-xsm text-dark' onClick={(e) => { e.preventDefault(); setShowNewHead(false) }}>Cancel</button>
                            </div>
                        </div>
                    }
                </div>
                <div className='sub-heads-container'>
                    <div className='sub-heads-header'>
                        <h1 className='text-med text-bold text-dark'>Sub Heads<span className='text-secondary'>:</span></h1>
                        <button className='text-sm text-primary' onClick={(e) => { e.preventDefault(); setShowNewSubHead(true) }}><img src={plus} alt='plus' /></button>
                    </div>
                    <div className='added-sub-heads-container'>
                        {
                            addedHeads.length === 0 ? (
                                <p className='text-dark text-xsm text-thin'>{addedSubHeads.length} Sub Heads added</p>
                            ) : addedSubHeads.map((val, index) => {
                                return (
                                    <div className='added-sub-head' key={index}>
                                        <p>Name: <span className='text-sm text-secondary text-bold'>{val.name}</span></p>
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
                                <div className='input-wrapper'>
                                    <input id='subHead' ref={subHeadRef} placeholder='Sub Head' type="text" value={subHeadText} onChange={(e) => setSubHeadText(e.target.value)} onClick={(e) => setShowSubHeadDrop(true)} />
                                    {showSubHeads.length > 0 && head && showSubHeadDrop && <CustomDropdown setSelfState={setShowSubHeadDrop} setState={setSubHead} setText={setSubHeadText} elements={arrayToDropdownElements(showSubHeads)} />}
                                </div>
                            </div>
                            <div className='btn-container'>
                                <button className='text-xsm text-dark' onClick={onSubHeadAdd}>Add</button>
                                <button className='text-xsm text-dark' onClick={(e) => { e.preventDefault(); setShowNewSubHead(false) }}>Cancel</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <button className='text-sm text-dark text-thin' type='submit'>Submit</button>
        </form>
    )
}