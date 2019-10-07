import { Router } from "express"
import InfoController from "../controller/InfoController";

const router = Router();

router.get('/application', InfoController.getApplication);

export default router;