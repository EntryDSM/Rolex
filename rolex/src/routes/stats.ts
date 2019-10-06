import { Router } from "express"
import StatsController from '../controller/StatsContoller';

const router = Router();

router.get('/applicants', StatsController.getApplicants);
router.get('/all', StatsController.getAll);

export default router;