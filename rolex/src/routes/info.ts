import { Router } from "express"
import InfoController from "../controller/InfoController";

const router = Router();

router.get('/application', InfoController.getApplication);

router.patch('/status', InfoController.changeStatus);

export default router;