import db from './db.js';

async function getAllCategories() {
    const result = await db.query(`
        SELECT category_id, name
        FROM category
        ORDER BY name ASC
    `);
    return result.rows;
}

async function getCategoryDetails(id) {
    const result = await db.query(`
        SELECT category_id, name
        FROM category
        WHERE category_id = $1
    `, [id]);
    return result.rows[0];
}

async function getCategoriesByProject(id) {
    const result = await db.query(`
        SELECT c.category_id, c.name
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
    `, [id]);
    return result.rows;
}

async function getProjectsByCategory(id) {
    const result = await db.query(`
        SELECT sp.project_id, sp.title, sp.date
        FROM service_projects sp
        JOIN project_category pc ON sp.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.date ASC
    `, [id]);
    return result.rows;
}

export { getAllCategories, getCategoryDetails, getCategoriesByProject, getProjectsByCategory };