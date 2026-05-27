import { getAllCategories, getCategoryDetails, getProjectsByCategory } from '../models/categories.js';

async function showCategoriesPage(req, res) {
    const categories = await getAllCategories();
    res.render('categories', {
        title: 'Categories',
        categories
    });
}

async function showCategoryDetailsPage(req, res) {
    const id = req.params.id;
    const category = await getCategoryDetails(id);
    const projects = await getProjectsByCategory(id);
    res.render('category', {
        title: category.name,
        category,
        projects
    });
}

export { showCategoriesPage, showCategoryDetailsPage };