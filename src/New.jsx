import './New.css';
import NavBar from './components/NavBar';

export default function New(){
    return (
        <div className='new-container'>
            <NavBar page={'new'}/>
            <h1 className='text-dark text-bold'>Hello World</h1>
        </div>
    )
}