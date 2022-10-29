import { OracleAbi__factory } from "../src/contracts";
import { SEED } from "../src/config";
import { Wallet } from "fuels";
import axios from "axios";
import BN from "../src/utils/BN";
const CONTRACT_ID =
  "0xd81bc4e4b4d913ae5a9b88cf871fc378327e08bccd740da8dd3daeeb6a4ae039";
const wallet = new Wallet(
  SEED,
  "https://node-beta-1.fuel.network/graphql"
);
const contract = OracleAbi__factory.connect(CONTRACT_ID, wallet);

const decimals = 8

describe("Eth price oracle TEST", () => {
  it("update prices", async () => {
    const {data} = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cdai&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false&precision="+decimals);
    //todo add another coins
    // { upper: BigNumberish; lower: BigNumberish }
    const ethPrice = BN.parseUnits(data.ethereum.usd, decimals)
    const daiPrice = BN.parseUnits(data.dai.usd, decimals)
    await Promise.all([
      contract.functions.set_price_eth({ upper: ethPrice.toString(), lower: 0 }),
      contract.functions.set_price_dai({ upper: daiPrice.toString(), lower: 0 }),
    ])
  });
  it('read', async () => {
    const { value: eth } = await contract.functions.price_eth().get();
    const { value: dai } = await contract.functions.price_dai().get();
    console.log({eth:eth.upper.toString(), dai:dai.upper.toString()})
  })
});
