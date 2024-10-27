import { Router } from "express";
import { createUser, createStockSymbol } from "../controller/create";
import { getOrderbook, getUserOrderbook } from "../controller/orderbook";
import { getINRBalance, getStockBalance, getUserINRBalance, getUserStockBalance } from "../controller/balance";
import { reset } from "../controller/reset";
import { onramp } from "../controller/onramp";
import { buyToken, sellToken } from "../controller/order";
import { mintToken } from "../controller/mint";

const router: Router = Router();

router.post("/user/create/:userId", createUser);
router.post("/symbol/create/:stockSymbol", createStockSymbol);
router.get("/orderbook", getOrderbook);
router.get("/balance/inr", getINRBalance);
router.get("/balance/stock", getStockBalance);
router.post("/reset", reset);
router.get("/balance/inr/:userId", getUserINRBalance);
router.post("/onramp/inr", onramp);
router.get("/balance/stock/:userId", getUserStockBalance);
router.post("/order/buy", buyToken);
router.post("/order/sell", sellToken);
router.get("/orderbook/:stockSymbol", getUserOrderbook);
router.post("/trade/mint", mintToken);

export default router;
