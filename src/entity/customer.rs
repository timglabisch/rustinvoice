use super::address::Address;

#[derive(Serialize, Deserialize, Debug, Clone)]
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
