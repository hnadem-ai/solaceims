import './New.css';
import { useState } from 'react';
import NavBar from './components/NavBar';
import ProjectForm from './components/forms/ProjectForm';
import BankForm from './components/forms/BankForm';
import BillForm from './components/forms/BillForm';
import VendorForm from './components/forms/VendorForm';
import SaleForm from './components/forms/SaleForm';
import DebitVoucherForm from './components/forms/DebitVoucherForm';
import CreditReceiptForm from './components/forms/CreditReceiptForm';
import HeadForm from './components/forms/headForm.jsx';

export default function New(){
    const [formType, setFormType] = useState('');

    return (
        <div className='new-container'>
            <title>Create New | SolaceIMS</title>
            <NavBar page={'new'}/>
            <section className='create-section'>
                <h1 className='text-dark text-lg text-bold'>What do you want to <span className='text-secondary text-bold'>Create</span>?</h1>
                <div className='btns-container'>
                    <button className={formType === 'PROJECT' ? 'text-sm text-dark active-create-new-btn' : 'text-sm text-dark'} onClick={()=> setFormType('PROJECT')}>Project</button>
                    <button className={formType === 'BANK' ? 'text-sm active-create-new-btn' : 'text-sm text-dark'} onClick={()=> setFormType('BANK')}>Bank</button>
                    <button className={formType === 'BILL' ? 'text-sm active-create-new-btn' : 'text-sm text-dark'} onClick={()=> setFormType('BILL')}>Bill</button>
                    <button className={formType === 'VENDOR' ? 'text-sm active-create-new-btn' : 'text-sm text-dark'} onClick={()=> setFormType('VENDOR')}>Vendor</button>
                    <button className={formType === 'SALE' ? 'text-sm active-create-new-btn' : 'text-sm text-dark'} onClick={()=> setFormType('SALE')}>Sale</button>
                    <button className={formType === 'CREDIT_RECEIPT' ? 'text-sm active-create-new-btn' : 'text-sm text-dark'} onClick={()=> setFormType('CREDIT_RECEIPT')}>Credit Receipt</button>
                    <button className={formType === 'DEBIT_VOUCHER' ? 'text-sm text-dark active-create-new-btn' : 'text-sm text-dark'} onClick={()=> setFormType('DEBIT_VOUCHER')}>Debit Voucher</button>
                    <button className={formType === 'HEAD' ? 'text-sm active-create-new-btn' : 'text-sm text-dark'} onClick={()=> setFormType('HEAD')}>Head</button>
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
                    ) : formType === 'HEAD' ? (
                        <HeadForm />
                    ) : (
                        <></>
                    )
                }
            </section>
        </div>
    )
}