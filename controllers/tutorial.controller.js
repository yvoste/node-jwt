const db = require("../models");
const Tutorial = db.tutorials;
const Comment = db.comments;
const Tag = db.tag;
const Op = db.Sequelize.Op;
//const nbTotal = '';
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
const getPagingData = (data, page, limit, nbTotal) => {
  const { count: totalItems, rows: tutorials } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { nbTotal, tutorials, totalPages, currentPage };
};



// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

//Create and Save new Comments
exports.createComment = (req, res) => {
	const id = req.params.id
	if (!id) {
		res.status(400).send({
		  message: "No tutorialId!"
		});
		return;
	  }
	  // Create a Comment
	  const comments = {
		name: req.body.name,
		text: req.body.text,
		tutorialId: id,
	  }
  // Save Comment in the database
  Comment.create(comments)
	.then((comments) => {
		res.send(comments);
	})
	.catch(err => {
	  res.status(500).send({
		message:
		  err.message || "Some error occurred while creating the Comment."
	  });
	});
};

// Create and save new Tag
exports.createTag = (req, res) => {
	if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }
  // Create a Tag
  const tag = {
		name: req.body.name,
  }
  // Save Tag in the database
  Tag.create(tag)
	.then((tag) => {
		res.send(tag);
	})
	.catch(err => {
	  res.status(500).send({
		message:
		  err.message || "Some error occurred while creating the Tag."
	  });
	});
};

// Retrieve all Tutorials from the database with condition Title.

  exports.findByTitle = (req, res) => {
    const title = req.query.title;
   console.log(title);
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    if (!condition) {
      res.status(400).send({
        message: "No titre!"
      });
      return;
      }
    Tutorial.findAll({ 
      where: condition,
      include: [
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "name"]
        }
      ]})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  };
  

  // Retrieve all Tutorials from the database with Pagination.
  exports.findAll = (req, res) => {
    const {page, size} = req.query;
    const {limit, offset} = getPagination(page, size);

    Tutorial.count().then(nbTotal => {
      Tutorial.findAndCountAll({
        include: [
          {
            model: Comment,
            as: "comments",
            attributes: ['id', 'name']
          }
        ],
        where: null, //{published: 1}
        limit, 
        offset,
        })
        .then(data => {
          console.log(data);
          const response = getPagingData(data, page, limit, nbTotal);
          res.send(response);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving tutorials."
          });
        });
      });
  };


// Retrieve all Tutorials from the database.
exports.findAllTag = (req, res) => {
  Tag.findAll({ 
	include: [
		{
			model: Tutorial,
			as: "tutorials",
			attributes: ["id", "title"],
      include: [
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "name"]
        }
      ]
		}
	] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tags."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
	const id = req.params.id;
	if (!id) {
		res.status(400).send({
		  message: "No tutorial Id!"
		});
		return;
  }
  Tutorial.findByPk(id, { 
      include: [
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "name"]
        }
      ],
    }
  )
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Tutorial with id=" + id
    });
  });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Tutorial.update(req.body, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Tutorial was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Tutorial with id=" + id
    });
  });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

exports.deleteOneComment = (req, res) => {
	const id = req.params.id;

	Comment.destroy({
		where: { id: id }
	})
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Comment was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Comment with id=${id}. Maybe Comment was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Comment with id=" + id
      });
    });
}
// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Tutorial.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Retrieve all Comments from the database by tutorial.

exports.findComments = (req, res) => {
  const id = req.query.id;
  const tutorialId = id;
	if (!id) {
		res.status(400).send({
		  message: "No tutorial Id!"
		});
		return;
  }
  console.log(id +'fsdfsdf');    
  Comment.findAll({     
    where: {tutorialId},
    })
    .then(data => {
      console.log(data);      
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving comments."
      });
    });
};
