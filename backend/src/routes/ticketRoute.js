import { Router } from "express";
import * as ticketController from "../controllers/ticketController.js";
import upload from "../utils/upload.js";
import { authMiddleware, allowRoles } from "../middlewares/authMiddleware.js";
const ticketRouter = Router()

ticketRouter.get("/my-tickets", authMiddleware, ticketController.getMyTickets);
ticketRouter.post("/", authMiddleware, allowRoles("user"), upload.single("attachments"), ticketController.createTicket);
ticketRouter.get("/", authMiddleware, allowRoles("admin", "staff"),ticketController.getAllTickets);
ticketRouter.get("/:ticketId", authMiddleware, allowRoles("admin", "staff", "user"),ticketController.getTicketById);
ticketRouter.post("/:ticketId/comments", authMiddleware, allowRoles("staff","user"), ticketController.createComment);
ticketRouter.post("/:ticketId/status", authMiddleware, allowRoles("admin", "staff"), ticketController.updateStatus);

export default ticketRouter;