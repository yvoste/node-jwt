exports.allAccess = (req, res) => {
    console.log('all access');
  res.status(200).send("Publichicid Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Simple Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};