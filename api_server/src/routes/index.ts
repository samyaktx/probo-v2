import { Router } from "express";
import {
  buyToken,
  createStockSymbol,
  createUser,
  getUserBalance,
  getUserStockBalance,
  getINRBalance,
  getOrderbook,
  getStockBalance,
  mintToken,
  onramp,
  reset,
  sellToken,
  getUserOrderbook,
} from "../controller";

const router: Router = Router();

router.post("/user/create/:userId", createUser);
router.post("/symbol/create/:stockSymbol", createStockSymbol);
router.get("/orderbook", getOrderbook);
router.get("/balances/inr", getINRBalance);
router.get("/balances/stock", getStockBalance);
router.post("/reset", reset);
router.get("/balance/inr/:userId", getUserBalance);
router.post("/onramp/inr", onramp);
router.get("/balance/stock/:userId", getUserStockBalance);
router.post("/order/buy", buyToken);
router.post("/order/sell", sellToken);
router.get("/orderbook/:stockSymbol", getUserOrderbook);
router.post("/trade/mint", mintToken);

export default router;
