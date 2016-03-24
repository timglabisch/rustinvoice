use super::address::Address;

#[derive(RustcDecodable, RustcEncodable)]
pub struct Customer {
    invoice_address : Address,
}

impl Customer {
    pub fn new() -> Self {
        Customer {
            invoice_address: Address::default()
        }
    }
}
