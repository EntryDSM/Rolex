import { Router } from "express"
import ListController from "../controller/ListController";

const router = Router();

router.get('/applicants', ListController.getApplicants);

export default router;