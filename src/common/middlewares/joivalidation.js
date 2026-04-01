export default (schemas) => (req, res, next) => {
    try {
        if (schemas.params) {
            const { error, value } = schemas.params.validate(req.params, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                return res.status(422).json({
                    success: false,
                    message: error.details.map(e => e.message)
                });
            }

            req.params = value;
        }

        if (schemas.body) {
            const { error, value } = schemas.body.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                return res.status(422).json({
                    success: false,
                    message: error.details.map(e => e.message)
                });
            }

            req.body = value;
        }

        if (schemas.query) {
            const { error, value } = schemas.query.validate(req.query, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                return res.status(422).json({
                    success: false,
                    message: error.details.map(e => e.message)
                });
            }

            req.query = value;
        }

        next();
    } catch (err) {
        next(err);
    }
};