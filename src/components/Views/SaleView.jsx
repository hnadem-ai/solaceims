import './SaleView.css';
import { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import { callAPI } from '../../api/client';
import SaleForm from '../forms/SaleForm.jsx';

export default function SaleView(){
    const [sale, setSale] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        async function fetchSale(){
            const saleId = window.location.pathname.split('/sale/')[1]; 

            const res = await callAPI(`/api/sale/${saleId}`, {
                method: 'GET',
                onError: ({ message }) => {
                    console.error(`Error fetching sale: ${message}`);
                }
            });

            setSale(res.sale);
            setEditData(res.sale);
        }

        fetchSale();
    }, []);

    useEffect(() => {
        setEditData(sale);
    }, [sale]);

    return (
        <div className='sale-view-container'>
            <NavBar active='sale' />

            {isEditing ? (
                <div className='sale-edit-wrapper'>
                    <h1 className='text-med text-dark'>
                        Edit Sale: <span className='text-bold text-secondary'>{sale?.fileNo}</span>
                    </h1>

                    <SaleForm mode='edit' data={editData} onSuccess={(s) => {setSale(s); setIsEditing(false);}} />
                </div>
            ) : (
                <div className='sale-view-wrapper'>
                    <h1 className='text-med text-dark'>
                        File No: <span className='text-bold text-secondary'>{sale?.fileNo}</span>
                    </h1>

                    <h1 className='text-med text-dark'>
                        Project: <span className='text-bold text-secondary'>{sale?.projectName}</span>
                    </h1>

                    <h1 className='text-med text-dark'>
                        Customer: <span className='text-bold text-secondary'>{sale?.name}</span>
                    </h1>

                    <h1 className='text-med text-dark'>
                        CNIC: <span className='text-bold text-secondary'>{sale?.cnic}</span>
                    </h1>

                    <h1 className='text-med text-dark'>
                        Phone: <span className='text-bold text-secondary'>{sale?.phoneNo}</span>
                    </h1>

                    <h1 className='text-med text-dark'>
                        Unit: <span className='text-bold text-secondary'>{sale?.inventory}</span>
                    </h1>

                    <h1 className='text-med text-dark'>
                        Size: <span className='text-bold text-secondary'>{sale?.size}</span>
                    </h1>

                    <h1 className='text-med text-dark'>
                        Total Price: <span className='text-bold text-secondary'>{sale?.TotalPrice}</span>
                    </h1>

                    {/* Installments */}
                    <h1 className='text-med text-dark'>Installments:</h1>

                    <div className='installments-container'>
                        {sale?.installments?.length === 0 ? (
                            <p className='text-dark'>No installments</p>
                        ) : sale?.installments?.map((inst, index) => (
                            <div key={index} className='item'>
                                <p className='text-dark'>Date: <span className='text-secondary'>{new Date(inst.date).toLocaleDateString()}</span></p>
                                <p className='text-dark'>Amount: <span className='text-secondary'>{inst.amount}</span></p>
                                <p className='text-dark'>Description: <span className='text-secondary'>{inst.description || 'None'}</span></p>
                            </div>
                        ))}
                    </div>

                    <button
                        className='text-sm text-dark bg-secondary'
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Sale
                    </button>
                </div>
            )}
        </div>
    );
}