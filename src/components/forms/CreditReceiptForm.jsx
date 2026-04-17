import './CreditReceiptForm.css';
import { useState, useEffect, useRef } from 'react';
import { callAPI } from '../../api/client';
import CustomDropdown from '../CustomDropdown';

export default function CreditReceiptForm() {

    function arrayToDropdownElementsProjects(array = []) {
        return array.map((element) => ({
            value: element._id,
            heading: element.name,
            subHeading: element.accNum ? element.accNum : '',
        }));
    }

    function arrayToDropdownElementsSales(array = []) {
        return array.map((element) => ({
            value: element._id,
            heading: element.projectName,
            subHeading: `File No: ${element.fileNo}`,
        }));
    }

    function arrayToDropdownElementsBanks(array = []) {
        return array.map((element) => ({
            value: element._id,
            heading: element.name,
            subHeading: element.accNum ? element.accNum : '',
        }));
    }

    function arrayToDropdownElementsCreditor(array = [], arrayType = '') {
        console.log(array)
        return array.map((element) => ({
            value: {
                _id: element._id,
                bankName: arrayType === 'Project' ? element?.bank?.name : ''
            },
            heading: arrayType === 'Sale' ? element.projectName : element.name,
            subHeading: arrayType === 'Sale' ? element.inventory : '',
            valueAdd: arrayType === 'Sale' ? element.name : ''
        }));
    }

    function arrayToDropdownElementsPayInstrument(array = [], arrayType = '') {
        return array.map((element) => ({
            value: element._id,
            heading: arrayType === 'bill' ? element.serialNo : element.name,
            subHeading: element.accNum ? element.accNum : '',
        }));
    }

    const [project, setProject] = useState(null);
    const [showProjectDrop, setShowProjectDrop] = useState(false)
    const [projectText, setProjectText] = useState('');
    const [projects, setProjects] = useState([]);

    const [bank, setBank] = useState(null);
    const [showBankDrop, setShowBankDrop] = useState(false)
    const [bankText, setBankText] = useState('');
    const [banks, setBanks] = useState([]);

    const [creditorConfig, setCreditorConfig] = useState('');
    const [creditor, setCreditor] = useState(null);
    const [showCreditorDrop, setShowCreditorDrop] = useState(false)
    const [creditorText, setCreditorText] = useState('');
    const [creditors, setCreditors] = useState([]);

    const [creditorBank, setCreditorBank] = useState('');

    const [payInstrument, setPayInstrument] = useState('');
    const [showPayInstrumentDrop, setShowPayInstrumentDrop] = useState(false);

    const [chequeStatus, setChequeStatus] = useState('');
    const [showChequeStatusDrop, setShowChequeStatusDrop] = useState(false);

    const [instrumentNo, setInstrumentNo] = useState('');
    const [instrumentDate, setInstrumentDate] = useState('');

    const [amount, setAmount] = useState(0)

    const [date, setDate] = useState('');

    const [comments, setComments] = useState('')

    const projectRef = useRef(null);
    const projectReqId = useRef(0);
    const bankRef = useRef(null);
    const creditorRef = useRef(null);
    const creditorReqId = useRef(0);
    const payInstrumentRef = useRef(null);
    const chequeStatusRef = useRef(null);

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
            if (!showCreditorDrop) return;

            const creditorEl = creditorRef.current;

            if (creditorEl && creditorEl.contains(e.target)) return;

            setShowCreditorDrop(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showCreditorDrop]);

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
            if (!showChequeStatusDrop) return;

            const chequeStatusEl = chequeStatusRef.current;

            if (chequeStatusEl && chequeStatusEl.contains(e.target)) return;

            setShowChequeStatusDrop(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showChequeStatusDrop]);

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
    }, []);

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
        if (!creditorConfig) return
        async function fetchProjects() {
            try {
                const res = await callAPI('/api/project', {
                    method: 'GET',
                })
                console.log(res.projects);
                setCreditors(res.projects);
            } catch (err) {
                console.error(err);
            }
        }

        async function fetchSales() {
            try {
                const res = await callAPI(`/api/project-sales/${project}`, {
                    method: 'GET',
                })
                console.log(res.sales);
                setCreditors(res.sales);
            } catch (err) {
                console.error(err);
            }
        }

        setCreditors([])

        if (creditorConfig === 'Sale' && project) fetchSales();
        if (creditorConfig === 'Project') fetchProjects();
    }, [creditorConfig, project]);

    useEffect(() => {
        if (project) return;
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
                if (err.status === 404) {
                    setProjects([]);
                    return;
                }
                if (reqId !== projectReqId.current) return;
                console.error(err);
            }
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [projectText]);

    useEffect(() => {
        async function fetchSales() {
            if (!project) return
            try {
                const res = await callAPI(`/api/sale/${project}`, {
                    method: 'GET',
                })
                console.log(res.sales);
                setSales(res.sales);
            } catch (err) {
                console.error(err);
            }
        }
        fetchSales();
    }, []);

    useEffect(() => {
        if (!project) return

        const q = creditorText.trim();

        if (!creditorConfig || !q || q.length < 2) {
            setCreditors([]);
            setShowCreditorDrop(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const reqId = ++creditorReqId.current;

            try {
                let endpoint = "";

                if (creditorConfig === "Sale") {
                    endpoint = `/api/sale/${project}?q=${encodeURIComponent(q)}`;
                }

                if (creditorConfig === "Project") {
                    endpoint = `/api/project?q=${encodeURIComponent(q)}`;
                }

                if (!endpoint) return;

                const res = await callAPI(endpoint, { method: "GET" });

                if (reqId !== creditorReqId.current) return;

                const data =
                    creditorConfig === "Sale" ? res.sales : res.projects;

                setCreditors(data || []);
                setShowCreditorDrop(true);
            } catch (err) {
                if (reqId !== creditorReqId.current) return;
                console.error(err);
            }
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [creditorText, creditorConfig]);

    useEffect(() => {
        setCreditor(null);
        setCreditorText('');
        setCreditorBank('');
        setCreditors([]);
    }, [creditorConfig]);

    useEffect(() => {
        if (!creditor) return;
        if (creditorConfig === 'Sale') {
            setCreditorBank('');
        } else {
            setCreditorBank(creditor.bankName);
        }
    }, [creditor]);

    useEffect(() => {
        if (!project) return;
        const projectIntended = projects.find((p) => p._id === project);
        if (!projectIntended) return;
        setBank(projectIntended.bank._id);
        setBankText(projectIntended.bank.name);
    }, [project, projects]);

    const handleChange = (event) => {
        setCreditorConfig(event.target.value);
    };

    async function onSubmit(e) {
        e.preventDefault();

        const setErrBorder = (id, on) => {
            const el = document.getElementById(id);
            if (el) el.style.borderColor = on ? "red" : "rgb(114, 68, 187)";
        };

        let hasError = false;
        if (!project) {
            console.log("❌ Validation Error: project is missing");
            setErrBorder("project", true);
            hasError = true;
        } else {
            setErrBorder("project", false);
        }

        if (!date) {
            console.log("❌ Validation Error: date is missing");
            setErrBorder("date", true);
            hasError = true;
        } else {
            setErrBorder("date", false);
        }

        if (!bank) {
            console.log("❌ Validation Error: bank is missing");
            setErrBorder("bank", true);
            hasError = true;
        } else {
            setErrBorder("bank", false);
        }

        if (!creditor) {
            console.log('creditor:', creditor)
            console.log("❌ Validation Error: creditor is missing");
            setErrBorder("creditor", true);
            hasError = true;
        } else {
            setErrBorder("creditor", false);
        }

        if (creditorConfig !== "Project" && creditorConfig !== "Sale") {
            console.log("❌ Validation Error: invalid creditorConfig →", creditorConfig);
            setErrBorder("creditor", true);
            hasError = true;
        } else {
            setErrBorder("creditor", false);
        }

        if (amount == null || amount === "" || Number(amount) <= 0) {
            console.log("❌ Validation Error: invalid amount →", amount);
            setErrBorder("amount", true);
            hasError = true;
        } else {
            setErrBorder("amount", false);
        }

        if (!payInstrument) {
            console.log("❌ Validation Error: payInstrument is missing");
            setErrBorder("payInstrument", true);
            hasError = true;
        } else {
            setErrBorder("payInstrument", false);
        }
        if (hasError) {
            console.log('has Error!')
            return;
        }

        const isCheque =
            payInstrument === "Cheque" || payInstrument === "Post Dated Cheque";

        const isOnline = payInstrument === "Online Transfer";

        if (isCheque) {
            if (!instrumentNo?.trim()) {
                setErrBorder("instrumentNo", true);
                return;
            } else setErrBorder("instrumentNo", false);

            if (!instrumentDate) {
                setErrBorder("instrumentDate", true);
                return;
            } else setErrBorder("instrumentDate", false);

            if (!chequeStatus) {
                setErrBorder("chequeStatus", true);
                return;
            } else setErrBorder("chequeStatus", false);
        } else {
            setErrBorder("instrumentNo", false);
            setErrBorder("instrumentDate", false);
            setErrBorder("chequeStatus", false);
        }

        if (isOnline) {
            if (!instrumentNo?.trim()) {
                setErrBorder("instrumentNo", true);
                return;
            } else setErrBorder("instrumentNo", false);

            if (!instrumentDate) {
                setErrBorder("instrumentDate", true);
                return;
            } else setErrBorder("instrumentDate", false);
        }

        if (creditorConfig === "Sale") {
            if (!creditorBank?.trim()) {
                setErrBorder("creditorBank", true);
                return;
            } else setErrBorder("creditorBank", false);
        } else {
            setErrBorder("creditorBank", false);
        }

        const body = {
            project,
            date: new Date(date),
            creditor: creditor._id,
            targetModel: creditorConfig,
            creditorBank: creditorBank?.trim() || undefined,
            amount: Number(amount),
            payInstrument,
            chequeStatus: chequeStatus || undefined,
            instrumentNo: instrumentNo?.trim() || undefined,
            instrumentDate: instrumentDate ? new Date(instrumentDate) : undefined,
            bank: bank || undefined,
            comments: comments?.trim() || undefined,
        };

        Object.keys(body).forEach((k) => body[k] === undefined && delete body[k]);

        try {
            const res = await callAPI('/api/credit-receipt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
                onError: ({ status, message, data } = {}) => {
                    console.error("Create credit receipt failed:", status, message, data);
                },
            });

            console.log("Credit receipt created:", res);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form onSubmit={onSubmit} className='credit-receipt-form-container'>
            <div className='inputs-container'>
                <div className='input-wrapper'>
                    <input id='project' autoComplete='off' ref={projectRef} placeholder='Project' type="text" value={projectText} onChange={(e) => setProjectText(e.target.value)} onClick={(e) => setShowProjectDrop(true)} />
                    {projects.length > 0 && showProjectDrop && <CustomDropdown setSelfState={setShowProjectDrop} setState={setProject} setText={setProjectText} elements={arrayToDropdownElementsProjects(projects)} />}
                </div>
                <input id='date' autoComplete='off' type='date' onChange={(e) => setDate(e.target.value)} value={date} placeholder='Date' />
                <div className='input-wrapper'>
                    <input id='Bank' ref={bankRef} autoComplete='off' placeholder='Bank' type="text" value={bankText} onChange={(e) => setBankText(e.target.value)} onClick={(e) => setShowBankDrop(true)} />
                    {banks.length > 0 && showBankDrop && <CustomDropdown setSelfState={setShowBankDrop} setState={setBank} setText={setBankText} elements={arrayToDropdownElementsBanks(banks)} />}
                </div>
            </div>
            <div className='inputs-container'>
                <label className='text-dark'>
                    <input
                        type="radio"
                        name="Sale"
                        value="Sale"
                        checked={creditorConfig === 'Sale'}
                        onChange={handleChange}
                    /> Sale
                </label>
                <label className='text-dark'>
                    <input
                        type="radio"
                        name="Project"
                        value="Project"
                        checked={creditorConfig === 'Project'}
                        onChange={handleChange}
                    /> Project
                </label>
                <div className='input-wrapper'>
                    <input id='creditor' autoComplete='off' ref={creditorRef} placeholder='Creditor' type="text" value={creditorText} onChange={(e) => setCreditorText(e.target.value)} onClick={(e) => setShowCreditorDrop(true)} />
                    {creditorConfig && showCreditorDrop && <CustomDropdown setSelfState={setShowCreditorDrop} setState={setCreditor} setText={setCreditorText} elements={arrayToDropdownElementsCreditor(creditors, creditorConfig)} />}
                </div>
                <input id='creditorBank' autoComplete='off' type='text' onChange={(e) => setCreditorBank(e.target.value)} value={creditorBank} placeholder='Bank of Creditor' disabled={creditorConfig !== 'Sale'} />
            </div>
            <h1 className='text-dark text-med'>Payment Info</h1>
            <div className='inputs-container'>
                <div className='input-wrapper'>
                    <input id='payInstrument' autoComplete='off' ref={payInstrumentRef} placeholder='Pay Instrument' type="text" value={payInstrument} onChange={(e) => setPayInstrument(e.target.value)} onClick={(e) => setShowPayInstrumentDrop(true)} />
                    {showPayInstrumentDrop && <CustomDropdown setSelfState={setShowPayInstrumentDrop} setState={setPayInstrument} setText={() => { return null }} elements={arrayToDropdownElementsPayInstrument([{ name: 'Cash', _id: 'Cash' }, { name: 'Post Dated Cheque', _id: 'Post Dated Cheque' }, { name: 'Online Transfer', _id: 'Online Transfer' }, { name: 'Cheque', _id: 'Cheque' },])} />}
                </div>
                <input id='instrumentNo' autoComplete='off' type='text' onChange={(e) => setInstrumentNo(e.target.value)} value={instrumentNo} placeholder='Instrument No.' disabled={payInstrument === 'Cash' || payInstrument === ''} />
                <input id='instrumentDate' autoComplete='off' type='date' onChange={(e) => setInstrumentDate(e.target.value)} value={instrumentDate} placeholder='Instrument Date' />
            </div>
            <div className='inputs-container'>
                <input style={{ maxWidth: '463px' }} id='amount' autoComplete='off' type='Number' onChange={(e) => setAmount(e.target.value)} value={amount === 0 ? '' : amount} placeholder='Amount' />
                <div className='input-wrapper'>
                    <input id='chequeStatus' autoComplete='off' ref={chequeStatusRef} placeholder='Status of Cheque' type="text" value={chequeStatus} onChange={(e) => setChequeStatus(e.target.value)} onClick={(e) => setShowChequeStatusDrop(true)} disabled={!(payInstrument === 'Cheque' || payInstrument === 'Post Dated Cheque')} />
                    {showChequeStatusDrop && <CustomDropdown setSelfState={setShowChequeStatusDrop} setState={setChequeStatus} setText={() => { return null }} elements={arrayToDropdownElementsPayInstrument([{ name: 'Cash', _id: 'Cash' }, { name: 'Post Dated Cheque', _id: 'Post Dated Cheque' }, { name: 'Online Transfer', _id: 'Online Transfer' }, { name: 'Cheque', _id: 'Cheque' },])} />}
                </div>
                <textarea name="detail" value={comments} onChange={(e) => setComments(e.target.value)} placeholder='Comments (optional)' />
            </div>
            <button className='text-sm text-thin text-dark' type='submit'>Submit</button>
        </form>
    )
}