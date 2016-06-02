#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct Address {
    pub country : String,
    pub street : String,
    pub street_number : String,
    pub zip : String,
    pub first_name : String,
    pub last_name : String,
    pub company_name : String
}
