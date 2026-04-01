// this midlleware for check if the req.user is admin or not
export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};


export const isManager = (req, res, next) => {
    if (req.user.role !== "manager") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}

export const isEmployee = (req, res, next) => {
    if (req.user.role !== "employee") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}
