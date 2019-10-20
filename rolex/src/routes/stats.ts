import { Router } from "express"
import StatsController from '../controller/StatsController';
import TestController from '../controller/testController';
import { checkAdmin } from "../middleware/checkJwt";

const router = Router();

router.get('/applicants', checkAdmin ,StatsController.getApplicants);
router.get('/all', checkAdmin ,StatsController.getAll);
router.get('/competition', checkAdmin ,StatsController.getCompetition);
router.get('/scores', checkAdmin ,StatsController.getScore);

export default router;