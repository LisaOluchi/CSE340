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

async function createOrganization(name, description, contact_email, logo_filename) {
    const result = await db.query(
        'INSERT INTO organization (name, description, contact_email, logo_filename) VALUES ($1, $2, $3, $4) RETURNING organization_id',
        [name, description, contact_email, logo_filename]
    );
    return result.rows[0].organization_id;
}

async function updateOrganization(id, { name, description, contact_email, logo_filename }) {
    const result = await db.query(
        'UPDATE organization SET name = $1, description = $2, contact_email = $3, logo_filename = $4 WHERE organization_id = $5 RETURNING *',
        [name, description, contact_email, logo_filename, id]
    );
    
    if (result.rowCount === 0) {
        throw new Error('Organization not found');
    }
    
    return result.rows[0];
}

export { getAllOrganizations, getOrganizationDetails, getProjectsByOrganization, createOrganization, updateOrganization };