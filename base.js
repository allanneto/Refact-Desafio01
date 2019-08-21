const express = require("express");

const server = express();

server.use(express.json()); // Sinalizando para o express que ele deve ler as coisas com JSON.

const projectList = [];
let numOfReq = 0;

// Middleware Request Count

const requestcount = (req, res, next) => {
  numOfReq++;

  console.log(`Request number: ${numOfReq}`);

  return next(); // nao esquecer de colocar a porra do next nos middlewares!!!!
};
// Crie um middleware que será utilizado em todas rotas que recebem o ID do
// projeto nos parâmetros da URL que verifica se o projeto com aquele ID existe.
// Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente;

const checkID = (req, res, next) => {
  const { id } = req.params; // pegando o ID

  const project = projectList.find(p => p.id == id);

  if (!project) {
    res.status(400).json("Id does not Exists");
  }

  return next();
};

server.use(requestcount); // definindo que o server ira utilizar o metodo requestcount em todas as requisicoes

server.post("/projects", (req, res) => {
  const { id, title } = req.body; // desestruturando e pegando os itens id e title do corpo da req.

  const projects = {
    id,
    title,
    tasks: []
  };

  projectList.push(projects);
  res.json(projects);
});

server.get("/projects", (req, res) => {
  res.json(projectList);
});

//PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;

server.put("/projects/:id", checkID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projectList.find(p => p.id == id);

  project.title = title; // nesse caso vai ser so atribuicao de valor ao title que ja foi criado dentro do array

  return res.json(project);
});

// DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;

server.delete("/projects/:id", checkID, (req, res) => {
  const { id } = req.params;

  const project = projectList.findIndex(p => p.id == id); // nesse caso usar o findIndex pq precisa achar o index do Id no array para poder apagar ele

  projectList.splice(project, 1); // usar o project como parametro do splice pois foi atribuido a ele apenas o index do id a ser apagado.

  res.send();
});

// POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas de um projeto específico
// escolhido através do id presente nos parâmetros da rota;

server.post("/projects/:id/tasks", checkID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projectList.find(p => p.id == id);

  project.tasks.push(title);

  res.json(project);
});

server.listen(4000);
