import { getAllCategories, getCategoryDetails, getProjectsByCategory, createCategory, getCategoryById, updateCategory } from '../models/categories.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

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

async function showNewCategoryForm(req, res) {
    res.render('new-category', {
        title: 'Add New Category'
    });
}

async function processNewCategoryForm(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('new-category', {
            title: 'Add New Category',
            errors: errors.array(),
            formData: req.body
        });
    }

    const { name } = req.body;
    await createCategory(name);

    res.redirect('/categories');
}

async function showEditCategoryForm(req, res) {
    const id = req.params.id;
    const category = await getCategoryById(id);

    res.render('edit-category', {
        title: 'Edit Category',
        category
    });
}

async function processEditCategoryForm(req, res) {
    const id = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const category = await getCategoryById(id);
        return res.render('edit-category', {
            title: 'Edit Category',
            errors: errors.array(),
            category: { ...category, ...req.body },
            formData: req.body
        });
    }

    const { name } = req.body;
    await updateCategory(id, name);

    res.redirect('/categories');
}

export { showCategoriesPage, showCategoryDetailsPage, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation };
