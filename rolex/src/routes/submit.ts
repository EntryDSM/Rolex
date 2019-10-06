import { Router } from "express"
import SubmitController from "../controller/SubmitController";

const router = Router();

router.delete('/', SubmitController.cancelSubmit);

export default router;