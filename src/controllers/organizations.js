import {
  getAllOrganizations,
  getOrganizationDetails,
  getProjectsByOrganization,
} from "../models/organizations.js";
import {
  createOrganization,
  updateOrganization,
} from "../models/organizations.js";
import { body, validationResult } from "express-validator";

async function showOrganizationsPage(req, res) {
  const organizations = await getAllOrganizations();
  res.render("organizations", {
    title: "Our Partner Organizations",
    organizations,
  });
}

async function showOrganizationDetailsPage(req, res) {
  const id = req.params.id;
  const organization = await getOrganizationDetails(id);
  const projects = await getProjectsByOrganization(id);
  res.render("organization", {
    title: organization.name,
    organization,
    projects,
  });
}

const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Organization name must be between 3 and 150 characters"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("contact_email").trim().isEmail().withMessage("Valid email is required"),
  body("logo_filename")
    .trim()
    .notEmpty()
    .withMessage("Logo filename is required"),
];

async function showNewOrganizationForm(req, res) {
  res.render("new-organization", {
    title: "Add New Organization",
  });
}

async function processNewOrganizationForm(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("new-organization", {
      title: "Add New Organization",
      errors: errors.array(),
      formData: req.body,
    });
  }

  const { name, description, contact_email, logo_filename } = req.body;
  await createOrganization(name, description, contact_email, logo_filename);

  req.flash("success", "Organization created successfully!");
  res.redirect("/organizations");
}

async function showEditOrganizationForm(req, res) {
  const id = req.params.id;
  const organization = await getOrganizationDetails(id);

  res.render("edit-organization", {
    title: "Edit Organization",
    organization,
  });
}

async function processEditOrganizationForm(req, res) {
  const id = req.params.id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const organization = await getOrganizationDetails(id);
    return res.render("edit-organization", {
      title: "Edit Organization",
      errors: errors.array(),
      organization: { ...organization, ...req.body },
      formData: req.body,
    });
  }

  const { name, description, contact_email, logo_filename } = req.body;
  await updateOrganization(id, {
    name,
    description,
    contact_email,
    logo_filename,
  });

  req.flash("success", "Organization updated successfully!");
  res.redirect("/organizations");
}

export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  organizationValidation,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
};
