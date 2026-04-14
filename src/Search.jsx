import './Search.css';
import NavBar from './components/NavBar';
import { useEffect, useState } from 'react';
import { callAPI } from './api/client';

export default function Search() {
    const [searchType, setSearchType] = useState('');
    const [search, setSearch] = useState('');
    const [projects, setProjects] = useState([]);
    const [banks, setBanks] = useState([]);
    const [bills, setBills] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [sales, setSales] = useState([]);
    const [creditReceipts, setCreditReceipts] = useState([]);
    const [debitVouchers, setDebitVouchers] = useState([]);

    const [projectLastId, setProjectLastId] = useState(null);
    const [bankLastId, setBankLastId] = useState(null);
    const [billLastId, setBillLastId] = useState(null);
    const [vendorLastId, setVendorLastId] = useState(null);
    const [saleLastId, setSaleLastId] = useState(null);
    const [creditReceiptLastId, setCreditReceiptLastId] = useState(null);
    const [debitVoucherLastId, setDebitVoucherLastId] = useState(null);

    useEffect(() => {
        setSearch('');
    }, [searchType]);

    async function fetchProjects(customSearch = '') {
        try {
            const q = customSearch.trim();
            const query = q ? `?q=${encodeURIComponent(q)}` : '';

            const res = await callAPI(`/api/project${query}`, {
                method: 'GET',
                onError: ({ message } = {}) => {
                    console.error(message);
                },
            });

            setProjects(res.projects || []);
            setProjectLastId(res.nextLastId || null);
            console.log(res.projects);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchBanks(customSearch = '') {
        try {
            const q = customSearch.trim();
            const query = q ? `?q=${encodeURIComponent(q)}` : '';

            const res = await callAPI(`/api/bank${query}`, {
                method: 'GET',
                onError: ({ message } = {}) => {
                    console.error(message);
                },
            });

            setBanks(res.banks || []);
            setBankLastId(res.nextLastId || null);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchBills(customSearch = '') {
        try {
            const q = customSearch.trim();
            const query = q ? `?q=${encodeURIComponent(q)}` : '';

            const res = await callAPI(`/api/bill${query}`, {
                method: 'GET',
                onError: ({ message } = {}) => {
                    console.error(message);
                },
            });

            setBills(res.bills || []);
            setBillLastId(res.nextLastId || null);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchVendors(customSearch = '') {
        try {
            const q = customSearch.trim();
            const query = q ? `?q=${encodeURIComponent(q)}` : '';

            const res = await callAPI(`/api/vendor${query}`, {
                method: 'GET',
                onError: ({ message } = {}) => {
                    console.error(message);
                },
            });

            setVendors(res.vendors || []);
            setVendorLastId(res.nextLastId || null);
            console.log(res.vendors);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchSales(customSearch = '') {
        try {
            const q = customSearch.trim();
            const query = q ? `?q=${encodeURIComponent(q)}` : '';

            const res = await callAPI(`/api/sale${query}`, {
                method: 'GET',
                onError: ({ message } = {}) => {
                    console.error(message);
                },
            });

            setSales(res.sales || []);
            setSaleLastId(res.nextLastId || null);
            console.log(res.sales);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchCreditReceipts(customSearch = '') {
        try {
            const q = customSearch.trim();
            const query = q ? `?q=${encodeURIComponent(q)}` : '';

            const res = await callAPI(`/api/credit-receipt${query}`, {
                method: 'GET',
                onError: ({ message } = {}) => {
                    console.error(message);
                },
            });

            setCreditReceipts(res.creditReceipts || []);
            setCreditReceiptLastId(res.nextLastId || null);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchDebitVouchers(customSearch = '') {
        try {
            const q = customSearch.trim();
            const query = q ? `?q=${encodeURIComponent(q)}` : '';

            const res = await callAPI(`/api/debit-voucher${query}`, {
                method: 'GET',
                onError: ({ message } = {}) => {
                    console.error(message);
                },
            });

            setDebitVouchers(res.debitVouchers || []);
            setDebitVoucherLastId(res.nextLastId || null);
        } catch (err) {
            console.error(err);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();

            if (searchType === 'Project') fetchProjects(search);
            if (searchType === 'Bank') fetchBanks(search);
            if (searchType === 'Bill') fetchBills(search);
            if (searchType === 'Vendor') fetchVendors(search);
            if (searchType === 'Sale') fetchSales(search);
            if (searchType === 'Credit Receipt') fetchCreditReceipts(search);
            if (searchType === 'Debit Voucher') fetchDebitVouchers(search);
        }
    }

    return (
        <div className="search-container">
            <title>Search | SolaceIMS</title>
            <NavBar page={''} />
            <section className='search-section'>
                <h1 className='text-dark text-lg text-bold'>What do you want to <span className='text-secondary text-bold'>Search</span>?</h1>
                <div className='btns-container'>
                    <button className={searchType === 'Project' ? 'text-sm text-dark active-search-btn' : 'text-sm text-dark'} onClick={() => setSearchType('Project')}>Project</button>
                    <button className={searchType === 'Bank' ? 'text-sm active-search-btn' : 'text-sm text-dark'} onClick={() => setSearchType('Bank')}>Bank</button>
                    <button className={searchType === 'Bill' ? 'text-sm active-search-btn' : 'text-sm text-dark'} onClick={() => setSearchType('Bill')}>Bill</button>
                    <button className={searchType === 'Vendor' ? 'text-sm active-search-btn' : 'text-sm text-dark'} onClick={() => setSearchType('Vendor')}>Vendor</button>
                    <button className={searchType === 'Sale' ? 'text-sm active-search-btn' : 'text-sm text-dark'} onClick={() => setSearchType('Sale')}>Sale</button>
                    <button className={searchType === 'Credit Receipt' ? 'text-sm active-search-btn' : 'text-sm text-dark'} onClick={() => setSearchType('Credit Receipt')}>Credit Receipt</button>
                    <button className={searchType === 'Debit Voucher' ? 'text-sm text-dark active-search-btn' : 'text-sm text-dark'} onClick={() => setSearchType('Debit Voucher')}>Debit Voucher</button>
                </div>
            </section>
            <div className='search-input-container'>
                { searchType !== '' && (
                    <input
                        type="text"
                        placeholder={`Search ${searchType.replace('_', ' ')}s`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                )}
            </div>
            <div className='results-section'>
                {
                    searchType === 'Project' && projects.length > 0 && (
                        <div className='results'>
                            <h2 className='text-lg text-bold text-dark'>Projects</h2>
                            <ul>
                                {projects.map((project) => (
                                    <li className='text-dark text-sm text-reg' key={project._id}>
                                        <p>{project.name}</p>
                                        <p>{project.inventory.length} Inventories</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
                {
                    searchType === 'Bank' && banks.length > 0 && (
                        <div className='results'>
                            <h2 className='text-lg text-bold text-dark'>Banks</h2>
                            <ul>
                                {banks.map((bank) => (
                                    <li className='text-dark text-sm text-reg' key={bank._id}>
                                        <p>{bank.name}</p>
                                        <p>{bank.accNum}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
                {
                    searchType === 'Bill' && bills.length > 0 && (
                        <div className='results'>
                            <h2 className='text-lg text-bold text-dark'>Bills</h2>
                            <ul>
                                {bills.map((bill) => (
                                    <li className='text-dark text-sm text-reg' key={bill._id}>
                                        <p>{bill.serialNo} - {bill.vendor.name} - {bill.items.length} item{bill.items.length !== 1 ? 's' : ''}</p>
                                        <p>{bill.totalAmount}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
                {
                    searchType === 'Vendor' && vendors.length > 0 && (
                        <div className='results'>
                            <h2 className='text-lg text-bold text-dark'>Vendors</h2>
                            <ul>
                                {vendors.map((vendor) => (
                                    <li className='text-dark text-sm text-reg' key={vendor._id}>
                                        <p>{vendor.name}</p>
                                        <p>{vendor.detail}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
                {
                    searchType === 'Sale' && sales.length > 0 && (
                        <div className='results'>
                            <h2 className='text-lg text-bold text-dark'>Sales</h2>
                            <ul>
                                {sales.map((sale) => (
                                    <li className='text-dark text-sm text-reg' key={sale._id}>
                                        <p>{sale.projectName} - {sale.inventory}</p>
                                        <p>{sale.TotalPrice}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
                {
                    searchType === 'Credit Receipt' && creditReceipts.length > 0 && (
                        <div className='results'>
                            <h2 className='text-lg text-bold text-dark'>Credit Receipts</h2>
                            <ul>
                                {creditReceipts.map((receipt) => (
                                    <li className='text-dark text-sm text-reg' key={receipt._id}>
                                        <p>{receipt.serialNo}</p>
                                        <p>{receipt.amount}</p>

                                    </li>
                                ))}
                            </ul>   
                        </div>
                    )
                }
                {
                    searchType === 'Debit Voucher' && debitVouchers.length > 0 && (
                        <div className='results'>
                            <h2 className='text-lg text-bold text-dark'>Debit Vouchers</h2>
                            <ul>
                                {debitVouchers.map((voucher) => (
                                    <li className='text-dark text-sm text-reg' key={voucher._id}>
                                        <p>{voucher.serialNo}</p>
                                        <p>{voucher.amount}</p>
                                    </li>
                                ))}
                            </ul>   
                        </div>
                    )
                }
            </div>
            
        </div>
    );
}