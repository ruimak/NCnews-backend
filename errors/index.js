exports.handle404s = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: err.msg || "ID not found" });
  } else next(err);
};

exports.handleInvalidParams = (err, req, res, next) => {
  if (err.name === "CastError") {
    console.log(err.message);
    res.status(400).send({ msg: err.message });
  } else next(err);
};

exports.handleInvalidBodies = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    res.status(400).send({ msg: err.message });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error.", status: 500 });
};
