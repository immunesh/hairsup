import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import userRoutes from "./routes/user.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import reviewRoutes from "./routes/review.routes";
import categoryRoutes from "./routes/category.routes";
import uploadRoutes from "./routes/upload.routes";
import couponRoutes from "./routes/coupon.routes";
import {
  errorHandler,
  notFound,
} from "./middleware/error.middleware";
import blogRoutes from "./routes/blog.routes";
import storeRoutes from "./routes/store.routes";
const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

const allowedOrigins = (
  process.env.FRONTEND_URL ||
  "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          "CORS not allowed by server"
        )
      );
    },
    credentials: true,
  })
);

app.use(compression());

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
});

app.use("/api", limiter);

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    timestamp:
      new Date().toISOString(),
  });
});

/* ---------------- API ROUTES ---------------- */

app.use("/api/auth", authRoutes);

app.use(
  "/api/products",
  productRoutes
);

app.use("/api/cart", cartRoutes);

app.use(
  "/api/orders",
  orderRoutes
);

app.use("/api/users", userRoutes);

app.use(
  "/api/wishlist",
  wishlistRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
);
app.use(
  "/api/coupons",
  couponRoutes
);
/* ---------------- UPLOAD ROUTES ---------------- */

app.use(
  "/uploads",
  express.static("uploads")
);

app.use(
  "/api/upload",
  uploadRoutes
);

app.use(
  "/api/blogs",
  blogRoutes
);
app.use(
  "/api/stores",
  storeRoutes
);
/* ---------------- ERROR HANDLER ---------------- */

app.use(notFound);

app.use(errorHandler);

export default app;