import { Router } from "express";

import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublishBlog,
} from "../controllers/blog.controller";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

router.use(
  authenticate,
  authorize("ADMIN")
);

router.get("/", getAllBlogs);

router.get("/:id", getBlogById);

router.post("/", createBlog);

router.put("/:id", updateBlog);

router.delete("/:id", deleteBlog);

router.patch(
  "/:id/publish",
  togglePublishBlog
);

export default router;