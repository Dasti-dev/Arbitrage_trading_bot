import axios from 'axios'
import { DepthManager } from './depthManager'
import { cancelOrder, createOrder } from './order';

const solIndMarket = new DepthManager("B-SOL_INR");

const usdtInrMarket = new DepthManager("B-USDT_INR");

const solUsdtMarket = new DepthManager("B-SOL_USDT");

setInterval(async () => {
    console.log(solIndMarket.getRelevantDepth());
    console.log(usdtInrMarket.getRelevantDepth());
    console.log(solUsdtMarket.getRelevantDepth());

    const canGetInr = (await solIndMarket.getRelevantDepth()).lowestAsk - 0.001;
    const canGetUsdt = canGetInr / (await  usdtInrMarket.getRelevantDepth()).lowestAsk;
    const canGetSol = canGetUsdt / (await solUsdtMarket.getRelevantDepth()).lowestAsk;

    const initialInr = (await solIndMarket.getRelevantDepth()).highestBid + 0.001;
    const canGetUsdt2 = 1 *  (await  usdtInrMarket.getRelevantDepth()).highestBid;
    const canGetInr2 = (await  usdtInrMarket.getRelevantDepth()).highestBid * canGetUsdt2;
},2000);

setInterval(async () => {
    const highestBid = (await solIndMarket.getRelevantDepth()).highestBid;
    await createOrder("buy", "XAIINR", (parseFloat(highestBid) + 0.01).toFixed(3), 10, Math.random().toString)
    await new Promise((r) => setTimeout(r,8000));
    await createOrder("sell", "XAIUSDT", Number((parseFloat(highestBid) + 0.01).toFixed(3)), 10, Math.random().toString)
    await cancelOrder("XAIINR");
},20000)