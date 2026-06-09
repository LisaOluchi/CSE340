import { createUser, findUserByEmail, verifyPassword } from '../models/users.js';
import { body, validationResult } from 'express-validator';

const registerValidation = [
    body('email')
        .trim()
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email')
        .trim()
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

async function showRegisterPage(req, res) {
    res.render('register', {
        title: 'Register'
    });
}

async function processRegister(req, res) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.render('register', {
            title: 'Register',
            errors: errors.array(),
            formData: req.body
        });
    }
    
    const { email, password } = req.body;
    
    try {
        const user = await createUser(email, password);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        res.render('register', {
            title: 'Register',
            errors: [{ msg: 'Email already registered' }],
            formData: req.body
        });
    }
}

async function showLoginPage(req, res) {
    res.render('login', {
        title: 'Login'
    });
}

async function processLogin(req, res) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.render('login', {
            title: 'Login',
            errors: errors.array(),
            formData: req.body
        });
    }
    
    const { email, password } = req.body;
    
    try {
        const user = await findUserByEmail(email);
        
        if (!user) {
            return res.render('login', {
                title: 'Login',
                errors: [{ msg: 'Email or password incorrect' }],
                formData: req.body
            });
        }
        
        const isValidPassword = await verifyPassword(password, user.password_hash);
        
        if (!isValidPassword) {
            return res.render('login', {
                title: 'Login',
                errors: [{ msg: 'Email or password incorrect' }],
                formData: req.body
            });
        }
        
        // Login successful - store user in session
        req.session.user = {
            user_id: user.user_id,
            email: user.email,
            role_name: user.role_name
        };
        
        req.flash('success', 'Login successful!');
        res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', {
            title: 'Login',
            errors: [{ msg: 'Login failed' }],
            formData: req.body
        });
    }
}

function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/');
    });
}

export { showRegisterPage, processRegister, showLoginPage, processLogin, logout, registerValidation, loginValidation };