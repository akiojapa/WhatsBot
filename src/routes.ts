import { Router } from "express";
import userController from "./controller/userController";
import whatsController from "./controller/whatsController";


const routes = Router()

routes.get('/users', userController.list)
routes.get('/', whatsController.status)

export default routes