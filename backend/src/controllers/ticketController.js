import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

export async function getMyTickets(req, res) {
  try {
    const loggedInUserId = req.user.id;

    const myTickets = await prisma.ticket.findMany({
      where: {
        submittedById: loggedInUserId,
      },
      include: {
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    successResponse(res, "ดึงข้อมูล Ticket สำเร็จ", myTickets);
  } catch (error) {
    errorResponse(res, "เกิดข้อผิดพลาด: " + error.message, 500);
  }
}

export async function createTicket(req, res) {
  try {
    const { title, description, type, urgency, status } = req.body;
    const submittedById = req.user.id;
    const file = req.file;

    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        type,
        urgency,
        status,
        submittedById,
      },
    });

    if (file) {
      await prisma.attachment.create({
        data: {
          filePath: "/uploads/" + file.filename,
          fileType: file.mimetype,
          ticketId: newTicket.id,
          userId: submittedById,
        },
      });
    }

    await prisma.notification.create({
      data: {
        message: `ตั๋วใหม่ถูกสร้างขึ้น: ${newTicket.title}`,
        ticketId: newTicket.id,
        userId: submittedById,
      },
    });
    successResponse(res, "สร้างตั๋วสำเร็จ", newTicket);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
}

// ฟังก์ชัน getTicketById ที่อัปเดตแล้ว
export async function getTicketById(req, res) {
  try {
    const { ticketId } = req.params;
    const { role, id } = req.user;
    const userRole = role.toLowerCase();

    // (สร้าง include object ที่ถูกต้องไว้ใช้ซ้ำ)
    const includeQuery = {
      attachments: true,
      comments: {
        include: {
          author: true, // (นี่คือส่วนที่จำเป็นสำหรับหน้า Details)
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    }; // (เช็คทั้ง "admin" และ "staff")

    if (userRole === "staff" || userRole === "admin") {
      const ticket = await prisma.ticket.findUnique({
        where: { id: parseInt(ticketId) },
        include: includeQuery, // (ใช้ include ที่ถูกต้อง)
      });
      if (!ticket) return errorResponse(res, "ไม่พบตั๋วที่ระบุ", 404);
      return successResponse(res, "ดึงตั๋วสำเร็จ", ticket);
    } // (นี่คือ "else" สำหรับ "USER")

    const ticket = await prisma.ticket.findFirst({
      // (ใช้ findFirst)
      where: {
        id: parseInt(ticketId),
        submittedById: id, // (เช็คว่าเป็นเจ้าของ Ticket)
      },
      include: includeQuery, // (ใช้ include ที่ถูกต้อง)
    });

    if (!ticket)
      return errorResponse(
        res,
        "ไม่พบตั๋วที่ระบุ หรือคุณไม่มีสิทธิ์เข้าถึง",
        404
      );
    successResponse(res, "ดึงตั๋วสำเร็จ", ticket);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
}


export async function getAllTickets(req, res) {
  try {
    const tickets = await prisma.ticket.findMany({
      // (เพิ่ม) เรียงลำดับ + include author ให้ Staff/Admin
      orderBy: { createdAt: "desc" },
      include: {
        submittedBy: {
          select: { name: true, email: true },
        },
      },
    });
    successResponse(res, "ดึงตั๋วทั้งหมดสำเร็จ", tickets);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
}


export async function createComment(req, res) {
  try {
    const { body } = req.body;
    const { ticketId } = req.params;
    const userId = req.user.id;
    const newComment = await prisma.comment.create({
      data: {
        body,
        authorId: userId,
        ticketId: parseInt(ticketId),
      },
    });
    successResponse(res, "สร้างคอมเมนต์สำเร็จ", newComment);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
}

export async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const { ticketId } = req.params; // 1) validate input

    if (!status) return errorResponse(res, "ต้องระบุสถานะใหม่", 400); // 2) Ensure ticket exists

    const oldTicket = await prisma.ticket.findUnique({
      where: { id: parseInt(ticketId) },
    });

    if (!oldTicket) return errorResponse(res, "ไม่พบตั๋วที่ระบุ", 404); // 3) ensure req.user.id exists

    if (!req.user || !req.user.id) {
      return errorResponse(res, "Unauthorized: ไม่พบข้อมูลผู้ใช้ใน token", 401);
    } // 4) อัปเดตสถานะตั๋ว

    const updatedTicket = await prisma.ticket.update({
      where: { id: parseInt(ticketId) },
      data: { status },
    }); // 5) บันทึกประวัติ

    await prisma.statusHistory.create({
      data: {
        oldStatus: oldTicket.status,
        newStatus: status,
        changedAt: new Date(),
        ticketId: parseInt(ticketId),
        userId: req.user.id,
      },
    });
    successResponse(res, "อัปเดตสถานะตั๋วสำเร็จ", updatedTicket);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
}
