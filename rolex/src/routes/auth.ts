import { Router } from "express"
import AuthController from '../controller/AuthController';
import { checkRefresh } from '../middleware/checkJwt' 

const router = Router();

router.post("/login", AuthController.login);

router.patch("/refresh", checkRefresh, AuthController.refresh);

export default router;