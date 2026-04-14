import './HomeProjectCard.css';

export default function HomeProjectCard({project}){
    return (
        <div className='hpc-container'>
            <h1 className='text-bold text-med text-dark'>{project.name}</h1>
            <p className='text-xsm text-dark'>Bank: {project.bank.name}</p>
            <p className='text-xsm text-dark'>{project.inventory.length} Inventories</p>
        </div>
    )
}