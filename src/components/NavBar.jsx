import './NavBar.css';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import search from '../assets/search.png';
import notification from '../assets/notification.png';
import menu from '../assets/menu.png';

export default function NavBar({page}){
    const [showUl, setShowUl] = useState(false);
    const ulRef = useRef();
    const menuBtnRef = useRef();
    useEffect(() => {
        function handleDocumentClick(e) {
            if (!showUl) return;

            const ulEl = ulRef.current;
            const btnEl = menuBtnRef.current;

            if (ulEl && ulEl.contains(e.target)) return;
            if (btnEl && btnEl.contains(e.target)) return;

            setShowUl(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [showUl]);
    return (
        <nav className='nav-container'>
            <header className='nav-header'>
                <h1 className='text-med text-lg text-dark'>Solace<span className='text-secondary text-bold'>IMS</span></h1>
            </header>
            <ul ref={ulRef} className={showUl ? 'show-ul' : ''}>
                <li className={page === 'home' ? 'text-sm active-tab' : 'text-sm'}><a href='/'>Home</a></li>
                <li className={page === 'new' ? 'text-sm active-tab' : 'text-sm'}><a href='/new'>Create New</a></li>
                <li className='text-sm'><a href='#'>Transactions</a></li>
                <li className='text-sm'><a href='#'>Notifications</a></li>
            </ul>
            <div className={showUl ? 'opaque' : 'hidden opaque'}></div>
            <div className='nav-btns'>
                <button className='bg-secondary text-xsm text-primary notification'><img src={notification} alt="Notification" /></button>
                <button className='bg-secondary text-xsm text-primary search'><img src={search} alt="Search" />Search</button>
            </div>
            <button className='menu-btn' ref={menuBtnRef} onClick={() => setShowUl(prev => !prev)}><img src={menu} alt="Menu Burger" /></button>
        </nav>
    )
}