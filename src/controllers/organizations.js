import { getAllOrganizations, getOrganizationDetails, getProjectsByOrganization } from '../models/organizations.js';

async function showOrganizationsPage(req, res) {
    const organizations = await getAllOrganizations();
    res.render('organizations', {
        title: 'Our Partner Organizations',
        organizations
    });
}

async function showOrganizationDetailsPage(req, res) {
    const id = req.params.id;
    const organization = await getOrganizationDetails(id);
    const projects = await getProjectsByOrganization(id);
    res.render('organization', {
        title: organization.name,
        organization,
        projects
    });
}

export { showOrganizationsPage, showOrganizationDetailsPage };