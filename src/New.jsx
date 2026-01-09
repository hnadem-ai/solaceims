import './New.css';
import { useState } from 'react';
import NavBar from './components/NavBar';
import ProjectForm from './components/forms/projectForm';
import BankForm from './components/forms/BankForm';
import BillForm from './components/forms/BillForm';
import VendorForm from './components/forms/VendorForm';
import SaleForm from './components/forms/SaleForm';
import DebitVoucherForm from './components/forms/DebitVoucherForm';
import CreditReceiptForm from './components/forms/CreditReceiptForm';

export default function New(){
    const [formType, setFormType] = useState('');

    return (
        <div className='new-container'>
            <NavBar page={'new'}/>
            <section className='create-section'>
                <h1 className='text-dark text-lg text-bold'>What do you want to <span className='text-secondary'>Create</span>?</h1>
                <div className='btns-container'>
                    <button className='text-sm' onClick={()=> setFormType('PROJECT')}>Project</button>
                    <button className='text-sm' onClick={()=> setFormType('BANK')}>Bank</button>
                    <button className='text-sm' onClick={()=> setFormType('BILL')}>Bill</button>
                    <button className='text-sm' onClick={()=> setFormType('VENDOR')}>Vendor</button>
                    <button className='text-sm' onClick={()=> setFormType('SALE')}>Sale</button>
                    <button className='text-sm' onClick={()=> setFormType('CREDIT_RECEIPT')}>Credit Receipt</button>
                    <button className='text-sm' onClick={()=> setFormType('DEBIT_VOUCHER')}>Debit Voucher</button>
                </div>
                {
                    formType === 'PROJECT' ? (
                        <ProjectForm />
                    ) : formType === 'BANK' ? (
                        <BankForm />
                    ) : formType === 'BILL' ? (
                        <BillForm />
                    ): formType === 'VENDOR' ? (
                        <VendorForm />
                    ) : formType === 'SALE' ? (
                        <SaleForm />
                    ) : formType === 'DEBIT_VOUCHER' ? (
                        <DebitVoucherForm />
                    )  : formType === 'CREDIT_RECEIPT' ? (
                        <CreditReceiptForm />
                    ) : (
                        <></>
                    )
                }
            </section>
        </div>
    )
}