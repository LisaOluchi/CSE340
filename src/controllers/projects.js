import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { updateProject } from '../models/projects.js';
import { validationResult } from 'express-validator';


const NUMBER_OF_UPCOMING_PROJECTS = 5;

async function showProjectsPage(req, res) {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    res.render('projects', {
        title: 'Upcoming Service Projects',
        projects
    });
}

async function showProjectDetailsPage(req, res) {
    const id = req.params.id;
    const project = await getProjectDetails(id);
    const categories = await getCategoriesByProject(id);
    res.render('project', {
        title: project.title,
        project,
        categories
    });
}

async function showEditProjectForm(req, res) {
    const id = req.params.id;
    const project = await getProjectDetails(id);
    const organizations = await getAllOrganizations();
    
    res.render('edit-project', {
        title: 'Edit Project',
        project,
        organizations
    });
}

async function processEditProjectForm(req, res) {
    const id = req.params.id;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const project = await getProjectDetails(id);
        const organizations = await getAllOrganizations();
        
        return res.render('edit-project', {
            title: 'Edit Project',
            errors: errors.array(),
            project: { ...project, ...req.body }, // Show what they entered
            organizations,
            formData: req.body
        });
    }
    
    const { title, description, location, date, organizationId } = req.body;
    await updateProject(id, { title, description, location, date, organizationId });
    
    req.flash('success', 'Project updated successfully!'); 
    res.redirect(`/project/${id}`);
}

export { showProjectsPage, showProjectDetailsPage, showEditProjectForm, processEditProjectForm };