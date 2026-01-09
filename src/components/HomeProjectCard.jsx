import './HomeProjectCard.css';

export default function HomeProjectCard({project}){
    return (
        <div className='hpc-container'>
            <h1 className='text-bold text-med text-primary'>{project.name}</h1>
            <p className='text-xsm text-primary'>Bank: {project.bank.name}</p>
            <p className='text-xsm text-primary'>{project.inventory.length} Inventories</p>
        </div>
    )
}