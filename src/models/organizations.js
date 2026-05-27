import db from './db.js';

async function getAllOrganizations() {
    const result = await db.query(`
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization
        ORDER BY name ASC
    `);
    return result.rows;
}

async function getOrganizationDetails(id) {
    const result = await db.query(`
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization
        WHERE organization_id = $1
    `, [id]);
    return result.rows[0];
}

async function getProjectsByOrganization(id) {
    const result = await db.query(`
        SELECT project_id, title, date
        FROM service_projects
        WHERE organization_id = $1
        ORDER BY date ASC
    `, [id]);
    return result.rows;
}

export { getAllOrganizations, getOrganizationDetails, getProjectsByOrganization };