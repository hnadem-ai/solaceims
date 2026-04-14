import './SaleForm.css';
import { useState, useRef, useEffect } from 'react';
import { callAPI } from '../../api/client';
import CustomDropdown from '../CustomDropdown';
import plus from '../../assets/plus-primary.png';
import del from '../../assets/delete.png';

export default function SaleForm(){

    const [fileNo, setFileNo] = useState('');
    const [inventoryNo, setInventoryNo] = useState('');
    const [size, setSize] = useState(0);
    const [saleType, setSaleType] = useState('');
    const [comments, setComments] = useState('')

    const [name, setName] = useState('');
    const [cnic, setCnic] = useState('');
    const [fatherOrHusbandName, setFatherOrHusbandName] = useState('');
    const [postalAddress, setPostalAddress] = useState('');
    const [residentialAddress, setResidentialAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [email, setEmail] = useState('');
    const [nationality, setNationality] = useState('');
    const [nomineeName, setNomineeName] = useState('');
    const [nomineeCnic, setNomineeCnic] = useState('');
    const [nomineeRelationShip, setNomineeRelationShip] = useState('');
    const [nomineeAddress, setNomineeAddress] = useState('');
    const [unitPrice, setUnitPrice] = useState(0);
    const [utilityCharges, setUtilityCharges] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [westOpen, setWestOpen] = useState(false);
    const [parkFacing, setParkFacing] = useState(false);
    const [corner, setCorner] = useState(false);

    const [showNewInstallment, setShowNewInstallment] = useState(false)
    const [installmentDate, setInstallmentDate] = useState('');
    const [amount, setAmount] = useState(0)
    const [description, setDescription] = useState('');

    const [installments, setInstallments] = useState([]);

    const [project, setProject] = useState(null);
    const [showProjectDrop, setShowProjectDrop] = useState(false)
    const [projectText, setProjectText] = useState('');
    const [projects, setProjects] = useState([]);

    function arrayToDropdownElements(array = [], arrayType = '') {
        return array.map((element) => ({
            value: element._id,          // ✅ bank id
            heading: arrayType === 'bill' ? element.serialNo : element.name,       // ✅ bank name
            subHeading: element.accNum ? element.accNum : '',  // ✅ account number
        }));
    }

    const projectRef = useRef(null);
    const projectReqId = useRef(0);

    useEffect(() => {
        setTotalPrice(Number(unitPrice) + Number(utilityCharges))
    }, [unitPrice, utilityCharges]);

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
        if(project) return;
        // typing invalidates selected project
        setProject(null);

        const q = projectText.trim();

        if (!q || q.length < 2) {
            setProjects([]);          // or keep old list if you prefer
            setShowProjectDrop(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const reqId = ++projectReqId.current;

            try {
                const res = await callAPI(`/api/project?q=${encodeURIComponent(q)}`, {
                    method: "GET",
                });

                // ignore stale responses
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


    async function onSubmit(e) {
        e.preventDefault();

        const setErrBorder = (id, on) => {
            const el = document.getElementById(id);
            if (el) el.style.borderColor = on ? "red" : "";
        };

        const fail = (id, msg) => {
            console.warn("❌ Validation failed:", msg);
            setErrBorder(id, true);
            return true;
        };

        // Clear borders for all fields you validate (optional but nice)
        [
            "project",
            "fileNo",
            "inventory",
            "size",
            "saleType",
            "name",
            "fatherOrHusbandName",
            "residentialAddress",
            "phoneNo",
            "nationality",
            "cnic",
            "nomineeName",
            "nomineeCnic",
            "nomineeRelationship",
            "nomineeAddress",
            "unitPrice",
            "utilityCharges",
        ].forEach((id) => setErrBorder(id, false));

        let hasError = false;

        // ✅ Required: project (ObjectId)
        if (!project) hasError = fail("project", "project is required") || hasError;

        // ✅ Required: fileNo
        if (!fileNo?.trim()) hasError = fail("fileNo", "fileNo is required") || hasError;

        // ✅ Required: inventory (Number)
        const inventoryNum = Number(inventoryNo);
        if (!inventoryNo || Number.isNaN(inventoryNum) || inventoryNum <= 0) {
            hasError = fail("inventory", "inventory must be a valid number > 0") || hasError;
        }

        // ✅ Required: size
        if (!String(size).trim()) hasError = fail("size", "size is required") || hasError;

        // ✅ Required: saleType
        if (!saleType?.trim()) hasError = fail("saleType", "saleType is required") || hasError;

        // ✅ Customer required fields
        if (!name?.trim()) hasError = fail("name", "name is required") || hasError;
        if (!fatherOrHusbandName?.trim()) {
            hasError = fail("fatherOrHusbandName", "fatherOrHusbandName is required") || hasError;
        }
        if (!residentialAddress?.trim()) {
            hasError = fail("residentialAddress", "residentialAddress is required") || hasError;
        }
        if (!phoneNo?.trim()) hasError = fail("phoneNo", "phoneNo is required") || hasError;
        if (!nationality?.trim()) hasError = fail("nationality", "nationality is required") || hasError;
        if (!cnic?.trim()) hasError = fail("cnic", "cnic is required") || hasError;

        // ✅ nominee required fields
        if (!nomineeName?.trim()) hasError = fail("nomineeName", "nomineeName is required") || hasError;
        if (!nomineeCnic?.trim()) hasError = fail("nomineeCnic", "nomineeCnic is required") || hasError;
        if (!nomineeRelationShip?.trim()) {
            hasError = fail("nomineeRelationship", "nomineeRelationship is required") || hasError;
        }
        if (!nomineeAddress?.trim()) hasError = fail("nomineeAddress", "nomineeAddress is required") || hasError;

        // ✅ Pricing required fields
        const unitCostNum = Number(unitPrice);
        const utilityChargesNum = Number(utilityCharges);
        const totalPriceNum = Number(totalPrice);

        if (Number.isNaN(unitCostNum) || unitCostNum <= 0) {
            hasError = fail("unitPrice", "unitPrice must be > 0") || hasError;
        }
        // schema wants utilitycharges REQUIRED (string)
        if (utilityCharges == null || utilityCharges === "" || Number.isNaN(utilityChargesNum)) {
            hasError = fail("utilityCharges", "utilityCharges is required") || hasError;
        }
        if (Number.isNaN(totalPriceNum) || totalPriceNum <= 0) {
            // totalPrice input is disabled; still validate computed value
            console.warn("❌ Validation failed: TotalPrice invalid", totalPrice);
            hasError = true;
        }

        // ✅ Installments schema requires amount for each entry
        // Your UI doesn't capture installment amount currently.
        // If you want to allow submit without installments, keep this rule:
        // - If installments exist, each must include amount.
        if (Array.isArray(installments) && installments.length > 0) {
            const anyMissingAmount = installments.some((i) => i.amount == null || Number(i.amount) <= 0);
            if (anyMissingAmount) {
                console.warn(
                    "❌ Validation failed: Each installment requires a positive amount, but your UI currently does not collect it.",
                    installments
                );
                hasError = true;
            }
        }

        if (hasError) return;

        // ✅ Build body matching schema
        const body = {
            project, // because your dropdown stores _id as value; if it stores object, use project._id
            fileNo: fileNo.trim(),
            inventory: inventoryNum,
            size: String(size).trim(),
            saleType: saleType.trim(),

            name: name.trim(),
            fatherOrHusbandName: fatherOrHusbandName.trim(),
            postalAddress: postalAddress?.trim() || "",
            residentialAddress: residentialAddress.trim(),
            phoneNo: phoneNo.trim(),
            email: email?.trim() || "",
            nationality: nationality.trim(),
            cnic: cnic.trim(),

            nomineeName: nomineeName.trim(),
            nomineeCnic: nomineeCnic.trim(),
            nomineeRelationship: nomineeRelationShip.trim(),
            nomineeAddress: nomineeAddress.trim(),

            unitCost: unitCostNum,
            utilitycharges: String(utilityChargesNum), // matches your schema type (String)
            westOpen: Boolean(westOpen),
            parkFacing: Boolean(parkFacing),
            corner: Boolean(corner),
            TotalPrice: totalPriceNum,

            installments: Array.isArray(installments)
                ? installments.map((i) => ({
                    date: i.date ? new Date(i.date) : undefined,
                    amount: Number(i.amount), // requires UI support
                    description: i.description?.trim() || "",
                }))
                : [],

            comments: "", // add a state if you want comments input
        };

        // remove undefined dates if any
        body.installments = body.installments.filter((i) => i.date);

        try {
            const res = await callAPI("/api/sale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
                onError: ({ status, message, data } = {}) => {
                    console.error("❌ Create sale failed:", { status, message, data });
                },
            });

            console.log("✅ Sale created:", res);

            // optional: reset form here if desired
        } catch (err) {
            console.error(err);
        }
    }

    function onAdd(e) {
        e.preventDefault();

        if (!installmentDate) {
            document.getElementById('date').style.borderColor = 'red';
            return;
        }
        if (!amount) {
            document.getElementById('amount').style.borderColor = 'red';
            return;
        }
        const payload = {
            id: Date.now(),
            date: installmentDate,
            amount,
            description,
        }
        setInstallments(prev => [...prev, payload]);
        setShowNewInstallment(false);
        setInstallmentDate('')
        setDescription('')
    }
    
    function deleteInstallment(e, id) {
        e.preventDefault();
        setInstallments(prev => prev.filter(item => item.id !== id))
    }

    return (
        <form onSubmit={onSubmit} className='sale-form-container'>
            <div className='inputs-container'>
                <div className='input-wrapper'>
                    <input id='project' autoComplete='off' ref={projectRef} placeholder='Project' type="text" value={projectText} onChange={(e) => setProjectText(e.target.value)} onClick={(e) => setShowProjectDrop(true)} />
                    {projects.length > 0 && showProjectDrop && <CustomDropdown setSelfState={setShowProjectDrop} setState={setProject} setText={setProjectText} elements={arrayToDropdownElements(projects)} />}
                </div>
                <input id='fileNo' autoComplete='off' type='text' onChange={(e) => setFileNo(e.target.value)} value={fileNo} placeholder='File No.' />
                <input id='inventory' autoComplete='off' type='text' onChange={(e) => setInventoryNo(e.target.value)} value={inventoryNo} placeholder='Unit No.' />
                <input id='size' autoComplete='off' type='text' onChange={(e) => setSize(e.target.value)} value={size <= 0 ? '' : size} placeholder='Size' />
                <input id='saleType' autoComplete='off' type='text' onChange={(e) => setSaleType(e.target.value)} value={saleType} placeholder='Sale Type' />
            </div>
            <h1 className='text-med text-dark text-bold'>Customer Details:</h1>
            <div className='inputs-container'>
                <input id='name' type='text' onChange={(e) => setName(e.target.value)} value={name} placeholder='Name' />
                <input id='fatherOrHusbandName' type='text' onChange={(e) => setFatherOrHusbandName(e.target.value)} value={fatherOrHusbandName} placeholder="Father or Husband's Name" />
                <input id='postalAddress' type='text' onChange={(e) => setPostalAddress(e.target.value)} value={postalAddress} placeholder='Postal Address' />
                <input id='residentialAddress' type='text' onChange={(e) => setResidentialAddress(e.target.value)} value={residentialAddress} placeholder='Residential Address' />
            </div>
            <div className='inputs-container'>
                <input id='phoneNo' type='text' onChange={(e) => setPhoneNo(e.target.value)} value={phoneNo} placeholder='Phone No.' />
                <input id='email' type='text' onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Email' />
                <input id='nationality' type='text' onChange={(e) => setNationality(e.target.value)} value={nationality} placeholder='Nationality' />
                <input id='cnic' type='text' onChange={(e) => setCnic(e.target.value)} value={cnic} placeholder='CNIC' />
            </div>
            <div className='inputs-container'>
                <input id='nomineeName' type='text' onChange={(e) => setNomineeName(e.target.value)} value={nomineeName} placeholder="Nominee's Name" />
                <input id='nomineeCnic' type='text' onChange={(e) => setNomineeCnic(e.target.value)} value={nomineeCnic} placeholder="Nominee's CNIC" />
                <input id='nomineeRelationship' type='text' onChange={(e) => setNomineeRelationShip(e.target.value)} value={nomineeRelationShip} placeholder="Nominee's Relationship" />
                <input id='nomineeAddress' type='text' onChange={(e) => setNomineeAddress(e.target.value)} value={nomineeAddress} placeholder="Nominee's Address" />
            </div>
            <h1 className='text-med text-dark text-bold'>Unit Details:</h1>
            <div className='inputs-container'>
                <input id='unitPrice' type='number' onChange={(e) => setUnitPrice(e.target.value)} value={unitPrice <= 0 ? '' : unitPrice} placeholder="Unit Price" />
                <input id='utilityCharges' type='number' onChange={(e) => setUtilityCharges(e.target.value)} value={utilityCharges <= 0 ? '' : utilityCharges} placeholder="Utility Charges" />
                <input id='totalPrice' type='number' disabled value={totalPrice <= 0 ? '' : totalPrice} placeholder="Total Price" />
            </div>
            <div className='checkbox-inputs-container'>
                <h1 className='text-sm text-dark'>West Open:</h1>
                <input id='westOpen' type='checkbox' checked={westOpen} onChange={(e) => setWestOpen(e.target.checked)} />
                <h1 className='text-sm text-dark'>Park Facing:</h1>
                <input id='parkFacing' type='checkbox' checked={parkFacing} onChange={(e) => setParkFacing(e.target.checked)}/>
                <h1 className='text-sm text-dark'>Corner:</h1>
                <input id='corner' type='checkbox' checked={corner} onChange={(e) => setCorner(e.target.checked)}/>
            </div>
            <div className='installments-container'>
                <div className='installments-header'>
                    <h1 className='text-med text-bold text-dark'>Installments<span className='text-secondary'>:</span></h1>
                    <button className='text-sm text-primary' onClick={(e) => { e.preventDefault(); setShowNewInstallment(true) }}><img src={plus} alt='plus' /></button>
                </div>
                <div className='added-installments-container'>
                    {
                        installments.length === 0 ? (
                            <p className='text-thin text-dark text-xsm'>{installments.length} Installments added</p>
                        ) : installments.map((val, index) => {
                            return (
                                <div className='added-installment' key={index}>
                                    <p>Date: <span className='text-secondary text-bold'>{val.date}</span></p>
                                    <p>Amount: <span className='text-secondary text-bold'>{val.amount}</span></p>
                                    <p>Description: <span className='text-secondary text-bold'>{val.description ? val.description : 'None'}</span></p>
                                    <button onClick={(e) => deleteInstallment(e, val.id)}><img src={del} alt="delete" /></button>
                                </div>
                            )
                        })
                    }
                </div>
                {showNewInstallment ?
                   (
                        <div className='installment-form-container'>
                            <h2 className='text-sm text-dark'>New Installment</h2>
                            <div className='input-container'>
                                <input id='date' type="date" value={installmentDate} onChange={(e) => setInstallmentDate(e.target.value)} placeholder='Installment Date' />
                                <input id='amount' type='Number' onChange={(e) => setAmount(e.target.value)} value={amount === 0 ? '' : amount} placeholder='Amount' />
                                <textarea id='description' type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Description (optional)' />
                            </div>
                            <div className='btn-container'>
                                <button className='text-xsm text-dark' onClick={onAdd}>Add</button>
                                <button className='text-xsm text-dark' onClick={(e) => { e.preventDefault(); setShowNewInstallment(false) }}>Cancel</button>
                            </div>
                        </div>
                    ) :
                    <></>
                }
            </div>
            <textarea name="detail" value={comments} onChange={(e) => setComments(e.target.value)} placeholder='Comments (optional)'/>
            <button className='text-sm text-thin text-dark' type='submit'>Submit</button>
        </form>
    )
}