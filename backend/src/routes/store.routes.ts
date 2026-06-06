import { Router } from "express";

import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  toggleStoreStatus,
} from "../controllers/store.controller";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

/*
  Admin Only
*/

router.use(
  authenticate,
  authorize("ADMIN")
);

router.get("/", getAllStores);

router.get("/:id", getStoreById);

router.post("/", createStore);

router.put("/:id", updateStore);

router.delete("/:id", deleteStore);

router.patch(
  "/:id/toggle",
  toggleStoreStatus
);

export default router;