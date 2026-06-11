import { getUpcomingProjects, getProjectDetails } from "../models/projects.js";
import { getCategoriesByProject } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";
import { updateProject } from "../models/projects.js";
import { body, validationResult } from "express-validator";
import { createProject } from "../models/projects.js";
import {
  addVolunteer,
  removeVolunteer,
  checkIfVolunteered,
  getUserVolunteerProjects,
} from "../models/projects.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be between 3 and 150 characters"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("date").notEmpty().withMessage("Date is required"),
  body("organizationId").notEmpty().withMessage("Organization is required"),
];

async function showNewProjectForm(req, res) {
  const organizations = await getAllOrganizations();
  res.render("new-project", {
    title: "Add New Project",
    organizations,
  });
}

async function processNewProjectForm(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const organizations = await getAllOrganizations();
    return res.render("new-project", {
      title: "Add New Project",
      errors: errors.array(),
      organizations,
      formData: req.body,
    });
  }

  const { title, description, location, date, organizationId } = req.body;
  await createProject(title, description, location, date, organizationId);

  req.flash("success", "Project created successfully!");
  res.redirect("/projects");
}

async function showProjectsPage(req, res) {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  res.render("projects", {
    title: "Upcoming Service Projects",
    projects,
  });
}

async function showProjectDetailsPage(req, res) {
  const id = req.params.id;
  const project = await getProjectDetails(id);
  const categories = await getCategoriesByProject(id);

  let isVolunteered = false;
  if (req.session && req.session.user) {
    isVolunteered = await checkIfVolunteered(req.session.user.user_id, id);
  }

  res.render("project", {
    title: project.title,
    project,
    categories,
    isVolunteered,
  });
}

async function showEditProjectForm(req, res) {
  const id = req.params.id;
  const project = await getProjectDetails(id);
  const organizations = await getAllOrganizations();

  res.render("edit-project", {
    title: "Edit Project",
    project,
    organizations,
  });
}

async function processEditProjectForm(req, res) {
  const id = req.params.id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const project = await getProjectDetails(id);
    const organizations = await getAllOrganizations();

    return res.render("edit-project", {
      title: "Edit Project",
      errors: errors.array(),
      project: { ...project, ...req.body }, // Show what they entered
      organizations,
      formData: req.body,
    });
  }

  const { title, description, location, date, organizationId } = req.body;
  await updateProject(id, {
    title,
    description,
    location,
    date,
    organizationId,
  });

  req.flash("success", "Project updated successfully!");
  res.redirect(`/project/${id}`);
}

async function volunteerForProject(req, res) {
  const userId = req.session.user.user_id;
  const projectId = req.params.id;

  try {
    await addVolunteer(userId, projectId);
    req.flash("success", "You have volunteered for this project!");
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error volunteering:", error);
    req.flash("error", "Could not volunteer for this project");
    res.redirect(`/project/${projectId}`);
  }
}

async function removeVolunteerFromProject(req, res) {
  const userId = req.session.user.user_id;
  const projectId = req.params.id;

  try {
    await removeVolunteer(userId, projectId);
    req.flash("success", "You have removed yourself from this project");
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error removing volunteer:", error);
    req.flash("error", "Could not remove yourself from this project");
    res.redirect(`/project/${projectId}`);
  }
}

export {
  showProjectsPage,
  showProjectDetailsPage,
  showEditProjectForm,
  processEditProjectForm,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  volunteerForProject,
  removeVolunteerFromProject,
};
