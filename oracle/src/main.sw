contract;

dep data_structures;
dep errors;
dep events;
dep interface;

use std::{
    address::Address,
    chain::auth::msg_sender,
    identity::Identity,
    logging::log,
    result::Result,
    revert::require,
};

use data_structures::State;
use errors::AccessError;
use events::PriceUpdateEvent;
use interface::Oracle;
use std::u128::*;

storage {
    priceEth: U128 = ~U128::from(0, 0),
    priceDai: U128 = ~U128::from(0, 0),
}

// TODO treat owner as an identity once https://github.com/FuelLabs/sway/issues/2647 is fixed
impl Oracle for Contract {
    fn owner() -> Identity {
        Identity::Address(~Address::from(owner))
    }

    #[storage(read)]
    fn price_eth() -> U128 {
       return storage.priceEth;
    }
    #[storage(read)]
    fn price_dai() -> U128 {
       return storage.priceDai;
    }

    #[storage(write)]
    fn set_price_eth(priceEth: U128) {
        require(msg_sender().unwrap() == Identity::Address(~Address::from(owner)), AccessError::NotOwner);
        storage.priceEth = priceEth;
        // log(PriceUpdateEvent { price: priceEth.lower });
    }

    #[storage(write)]
    fn set_price_dai(priceDai: U128) {
        require(msg_sender().unwrap() == Identity::Address(~Address::from(owner)), AccessError::NotOwner);
        storage.priceDai = priceDai;
        // log(PriceUpdateEvent { price: priceDai.lower });
    }
}
