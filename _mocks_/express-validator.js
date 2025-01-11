module.exports = {
    body: () => ({
      notEmpty: () => ({ withMessage: () => {} }),
      isFloat: () => ({ withMessage: () => {} }),
    }),
    validationResult: () => ({
      isEmpty: () => true,
      array: () => [],
    }),
  };
  