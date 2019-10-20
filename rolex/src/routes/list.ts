import { Router } from "express"
import ListController from "../controller/ListController";
import { checkAdmin } from "../middleware/checkJwt";

const router = Router();

router.get('/applicants', checkAdmin, ListController.getApplicants);
router.get('/excel',ListController.makeExcel);

export default router;