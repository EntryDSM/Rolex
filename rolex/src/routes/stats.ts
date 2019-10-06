import { Router } from "express"
import StatsController from '../controller/StatsContoller';

const router = Router();

router.get('/', StatsController.getApplicants);

export default router;