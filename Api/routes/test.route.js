import   express  from 'express';
import { shouldLogIn } from '../controller/test.controller.js';
import { shouldLogAdmin } from '../controller/test.controller.js';
const router=express.Router();


router.get("/should-be-login", shouldLogIn);
router.get("/should-be-admin",shouldLogAdmin);

export default router;
