import { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import { callAPI } from '../../api/client';
import './ProjectView.css';
import ProjectForm from '../forms/ProjectForm.jsx';

export default function ProjectView(){
    const [project, setProject] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        async function fetchProject(){
            const projectId = window.location.pathname.split('/project/')[1];
            const res = await callAPI(`/api/project/${projectId}`, {
                method: 'GET',
                onError: ({ status, message, data } = {}) => {
                    console.error(`Error fetching project: ${message}`);
                }
            });
            setProject(res.project);
            setEditData(res.project);
            console.log(res.project);
        }
        fetchProject();
    },[]);

    useEffect(() => {
        setEditData(project);
    }, [project]);

    return (
        <div className='project-view-container'>
            <NavBar active='project' />
            {isEditing ? (
                <div className='project-edit-wrapper'>
                    <h1 className='text-med text-dark'>Edit Project: <span className='text-bold text-secondary'>{project?.name}</span></h1>
                    <ProjectForm mode='edit' data={editData} onSuccess={(p) => {setProject(p); setIsEditing(false)}}/>
                </div>
            ) : (
                <div className='project-view-wrapper'>
                    <h1 className='text-med text-dark'>Project: <span className='text-bold text-secondary'>{project?.name}</span></h1>
                    <h1 className='text-med text-dark'>Bank: <span className='text-bold text-secondary'>{project?.bank?.name || 'No bank associated'}</span></h1>
                    <h1 className='text-med text-dark'>Inventories:</h1>
                    <div className='inventories-container'>
                        {project?.inventory?.length === 0 && <p className='text-dark text-reg'>No inventories added to this project yet.</p>}
                        {project?.inventory?.map((inventoryItem, index) => (
                            <div key={index} className='inventory-item'>
                                <p className='text-dark'>Unit No: <span className='text-secondary text-bold'>{inventoryItem.unitNo}</span></p>
                                <p className='text-dark'>Floor: <span className='text-secondary text-bold'>{inventoryItem.floor}</span></p>
                                <p className='text-dark'>Size: <span className='text-secondary text-bold'>{inventoryItem.size}</span></p>
                                <p className='text-dark'>Utilities: <span className='text-secondary text-bold'>{inventoryItem.utilities}</span></p>
                                <p className='text-dark'>Estimated Value: <span className='text-secondary text-bold'>{inventoryItem.estimatedValue}</span></p>
                                {inventoryItem.remarks && <p className='text-dark'>Remarks: <span className='text-secondary text-bold'>{inventoryItem.remarks}</span></p>}
                            </div>
                        ))}
                    </div>
                    <h1 className='text-med text-dark'>Detail: <span className='text-bold text-secondary'>{project?.detail || 'No detail available'}</span></h1>
                    <button className='text-sm text-dark bg-secondary' onClick={() => setIsEditing(true)}>Edit Project</button>
                </div>
            )}
        </div>
    )
}