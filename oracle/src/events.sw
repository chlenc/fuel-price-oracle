library events;
use std::u128::*;

pub struct PriceUpdateEvent {
    /// Updated price
    price: U128,
}