import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';


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

export { showProjectsPage, showProjectDetailsPage };