use super::address::Address;

#[derive(RustcDecodable, RustcEncodable, Debug)]
pub struct Customer {
    address : Address,
}

impl Customer {
    pub fn new() -> Self {
        Customer {
            address: Address::default()
        }
    }
}
