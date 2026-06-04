import db from './db.js';

async function getAllProjects() {
    const result = await db.query(`
        SELECT 
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.date,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o ON sp.organization_id = o.organization_id
        ORDER BY sp.date ASC
    `);
    return result.rows;
}

async function getUpcomingProjects(number_of_projects) {
    const result = await db.query(`
        SELECT 
            sp.project_id,
            sp.title,
            sp.description,
            sp.date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE sp.date >= CURRENT_DATE
        ORDER BY sp.date ASC
        LIMIT $1
    `, [number_of_projects]);
    return result.rows;
}

async function getProjectDetails(id) {
    const result = await db.query(`
        SELECT 
            sp.project_id,
            sp.title,
            sp.description,
            sp.date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1
    `, [id]);
    return result.rows[0];
}

async function updateProject(id, { title, description, location, date, organizationId }) {
    const result = await db.query(
        `UPDATE service_projects 
         SET title = $1, description = $2, location = $3, date = $4, organization_id = $5 
         WHERE project_id = $6
         RETURNING *`,  
        [title, description, location, date, organizationId, id]
    );
    
    if (result.rowCount === 0) {
        throw new Error('Project not found');
    }
    
    return result.rows[0];
}

export { getAllProjects, getUpcomingProjects, getProjectDetails, updateProject };