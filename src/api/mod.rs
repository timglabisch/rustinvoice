pub mod customers;

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
