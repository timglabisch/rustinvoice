use super::address::Address;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Customer {
    pub address : Address,
}
