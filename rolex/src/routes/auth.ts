import { Router } from "express"
import AdminController from "../controller/AdminController";
import AuthController from '../controller/AuthController';

const router = Router();

router.post("/login", AuthController.login);

router.get("/", AdminController.listAll);

router.post("/", AdminController.newAdmin);

export default router;