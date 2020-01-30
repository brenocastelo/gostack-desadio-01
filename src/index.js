const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let requestCounter = 0;

function countRequests(req, res, next) {
  requestCounter++;

  console.log(`Requests: ${requestCounter}`);

  next();
}

server.use(countRequests);

function checkTitleExist(req, res, next) {
  if (!req.body.title) {
    return res.json({ error: 'Title is requires' });
  }

  return next();
}

function checkProjectExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id == id);

  if (!project) {
    return res.json({ error: 'Project does not exist' })
  }

  return next();
}

server.post('/projects', checkTitleExist, (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.listen(3002);

server.put('/projects/:id', checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);
  project.title = title;

  return res.json(projects);
})

server.delete('/projects/:id', checkProjectExist, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id === id);

  projects.splice(projectIndex, 1);

  return res.json(projects);
})

server.post('/projects/:id/tasks', checkProjectExist, checkTitleExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);
  project.tasks.push(title);

  return res.json(projects);
});
