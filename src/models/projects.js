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

export { getAllProjects, getUpcomingProjects, getProjectDetails };