pub mod customers;
pub mod invoices;

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct ApiCreated {
    id: String
}

impl ApiCreated {
    pub fn new(id: String) -> ApiCreated {
        ApiCreated {
            id: id
        }
    }
}
