import { Router } from "express"
import AdminController from "../controller/AdminController";
import AuthController from '../controller/AuthController';
import { checkRefresh } from '../middleware/checkJwt' 

const router = Router();

router.post("/login", AuthController.login);

router.patch("/refresh", checkRefresh, AuthController.refresh);

router.get("/", AdminController.listAll);

router.post("/", AdminController.newAdmin);

export default router;