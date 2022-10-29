library interface;

use std::identity::Identity;
use std::u128::*;

abi Oracle {
    fn owner() -> Identity;

    #[storage(read)]
    fn price_eth() -> U128;
    
    #[storage(read)]
    fn price_dai() -> U128;

    #[storage(write)]
    fn set_price_eth(priceEth: U128);

    #[storage(write)]
    fn set_price_dai(priceDai: U128);
}