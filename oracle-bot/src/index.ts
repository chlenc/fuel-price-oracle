import {sleep} from "./utils/utils";
import {Wallet} from "fuels";
import {SEED} from "./config";
import {OracleAbi__factory} from "./contracts";
import axios from "axios";
import BN from "./utils/BN";

// const { log, groupMessage } = new TelegramService();

const CONTRACT_ID =
    "0x44f145b5ab4f3e880f03a14de27289c18f255d1f6f6c8655c4087c2090c2b7a0";

const wallet = new Wallet(
    SEED,
    "https://node-beta-1.fuel.network/graphql"
);
const contract = OracleAbi__factory.connect(CONTRACT_ID, wallet);

(async () => {
    while (true) {
        //todo add another sources
        const {data} = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cdai&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false&precision=18");
        //todo add another coins
        await Promise.all([
            contract.functions.set_price_eth(BN.parseUnits(data.ethereum.usd, 18).toString()),
            contract.functions.set_price_dai(BN.parseUnits(data.dai.usd, 18).toString()),
        ])
        await sleep(10 * 1000);
    }
})();

process.stdout.write("Bot has been started ✅ ");
