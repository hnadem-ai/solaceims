import './BillView.css';
import { use, useEffect, useState } from 'react';
import NavBar from '../NavBar';
import { callAPI } from '../../api/client';
import BillForm from '../forms/BillForm';

export default function BillView() {
    const [bill, setBill] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        async function fetchBill() {
            const billId = window.location.pathname.split('/bill/')[1];
            const res = await callAPI(`/api/bill/${billId}`, {
                method: 'GET',
                onError: ({ status, message, data } = {}) => {
                    console.error(`Error fetching bill: ${message}`);
                }
            });
            setBill(res.bill);
            setEditData(res.bill);
            console.log(res.bill);
        }
        fetchBill();
    }, []);

    useEffect(() => {
        setEditData(bill); 
    }, [bill]);

    return (
        <div className='bill-view-container'>
            <NavBar active='bill' />
            {isEditing ? (
                <div className='bill-edit-wrapper'>
                    <h1 className='text-med text-dark'>Edit Bill: <span className='text-bold text-secondary'>{bill?.serialNo}</span></h1>
                    <BillForm mode='edit' data={editData} onSuccess={(b) => {setBill(b); setIsEditing(false);}} />
                </div>
            ) : (
                <div className='bill-view-wrapper'>
                    <h1 className='text-med text-dark'>Bill: <span className='text-bold text-secondary'>{bill?.serialNo}</span></h1>
                    <h1 className='text-med text-dark'>Vendor: <span className='text-bold text-secondary'>{bill?.vendor?.name}</span></h1>
                    <h1 className='text-med text-dark'>Vendor Bill No: <span className='text-bold text-secondary'>{bill?.vendorBillNo}</span></h1>
                    <h1 className='text-med text-dark'>Head: <span className='text-bold text-secondary'>{bill?.head?.name}</span></h1>
                    <h1 className='text-med text-dark'>Items:</h1>
                    <div className='items-container'>
                        {bill?.items?.length === 0 && <p className='text-dark text-reg'>No items added to this bill yet.</p>}
                        {bill?.items?.map((item, index) => (
                            <div key={index} className='item'>
                                <p className='text-dark'>Name: <span className='text-secondary text-bold'>{item.item}</span></p>
                                <p className='text-dark'>Unit: <span className='text-secondary text-bold'>{item.unit}</span></p>
                                <p className='text-dark'>Quantity: <span className='text-secondary text-bold'>{item.quantity}</span></p>
                                <p className='text-dark'>Rate: <span className='text-secondary text-bold'>{item.rate}</span></p>
                                <p className='text-dark'>Amount: <span className='text-secondary text-bold'>{item.amount}</span></p>
                                {item.remarks && <p className='text-dark'>Remarks: <span className='text-secondary text-bold'>{item.remarks}</span></p>}
                            </div>
                        ))}
                    </div>
                    <h1 className='text-med text-dark'>Total Amount: <span className='text-bold text-secondary'>{bill?.totalAmount}</span></h1>
                    { bill?.comments && (
                        <h1 className='text-med text-dark'>Comments: <span className='text-bold text-secondary'>{bill.comments}</span></h1>
                    )}
                    <button
                        className='text-sm text-dark bg-secondary'
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Bill
                    </button>
                </div>
            )}
        </div>
    );
}