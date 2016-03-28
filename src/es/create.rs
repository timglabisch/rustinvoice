#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CreateResult {
    pub _index : String,
    pub _type : String,
    pub _id : String,
    pub _version: i32,
    pub created : bool
}
