import { Router } from "express"
import SubmitController from "../controller/SubmitController";
import { checkRoot } from "../middleware/checkJwt"

const router = Router();

router.patch('/', checkRoot, SubmitController.cancelSubmit);

export default router;