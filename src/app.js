import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import adminRoutes from './routes/admin.Routes.js';
import managerRoutes from './routes/manager.routes.js';
import employeeRoutes from './routes/employee.Routes.js';
import authRoutes from './common/auth/auth.routes.js';
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://bhushan-ems-frotend.vercel.app",
    credentials: true,
  }),
);
//rete limiting
app.use(rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 100, // limit each IP to 100 requests per windowMs,
    message: "Too many requests, please try again after 2 minutes"
}))

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);
app.use('/employee', employeeRoutes);

export default app;