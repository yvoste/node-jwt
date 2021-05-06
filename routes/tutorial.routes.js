module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", tutorials.create);
  
   // Create a new Tag
   router.post("/tag/", tutorials.createTag);

  // Create a new Comments
  router.post("/:id", tutorials.createComment); 

  

  // Retrieve all Tutorials
  router.get("/", tutorials.findAll);

   // Retrieve all Tags
   router.get("/tit", tutorials.findByTitle);

  // Retrieve all Tags
  router.get("/tag", tutorials.findAllTag);

  // Retrieve all published Tutorials
  router.get("/published", tutorials.findAllPublished);

  // Retrieve all published Tutorials
  router.get("/comments", tutorials.findComments);

  // Retrieve a single Tutorial with id
  router.get("/:id", tutorials.findOne);

  



  // Update a Tutorial with id
  router.put("/:id", tutorials.update);

 

  // Delete all Tutorials 
  router.delete("/", tutorials.deleteAll);
  
   // Delete one comment
  router.delete("/com/:id", tutorials.deleteOneComment);

   // Delete a Tutorial with id
   router.delete("/:id", tutorials.delete);

  app.use('/api/tutorials', router);
};