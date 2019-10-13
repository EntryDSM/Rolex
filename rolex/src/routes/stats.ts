import { Router } from "express"
import StatsController from '../controller/StatsController';
import TestController from '../controller/testController';

const router = Router();

router.get('/applicants', StatsController.getApplicants);
router.get('/all', StatsController.getAll);
router.get('/competition', StatsController.getCompetition);
router.get('/scores', StatsController.getScore);

export default router;