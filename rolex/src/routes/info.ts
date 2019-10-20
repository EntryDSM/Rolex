import { Router } from "express"
import InfoController from "../controller/InfoController";
import { checkAdmin } from "../middleware/checkJwt";

const router = Router();

router.get('/application', checkAdmin, InfoController.getApplication);

router.patch('/status', checkAdmin, InfoController.changeStatus);

router.get('/photo', checkAdmin , InfoController.getPhoto);

export default router;