import './Home.css'
import NavBar from './components/NavBar';
import ProjectCard from './components/HomeProjectCard';
import plus from './assets/plus-primary.png';

export default function Home(){
    return (
        <div className='home-container'>
            <title>Home | SolaceIMS</title>
            <NavBar page={'home'}/>
            <section className='project-section'>
                <div className='header'>
                    <h1 className='text-lg text-bold text-dark'>PROJECTS<span className='text-secondary'>.</span></h1>
                    <button className='text-xsm text-primary'><img src={plus} alt='plus'/>CREATE NEW</button>
                </div>
                <div className='project-cards-container'>
                    <ProjectCard project={{
                        name: 'CS-189',
                        detail: `The default "border" that appears when an input is focused is actually an outline, which is drawn outside the element's border and does not affect the element's dimensions. `,
                        bank: {
                            accNum: 'PK24MUCB0646609971000177',
                            name: 'MCB LTD.',
                            accHolder: 'Khurram Solangi',
                        },
                        inventory: [ {}, {}, {}, {} ],
                    }}/>
                </div>
            </section>
        </div>
    )
}