#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct IdResult<T> where T : Clone {
    pub _index : String,
    pub _type : String,
    pub _id : String,
    pub _version : i32,
    pub found : bool,
    pub _source : T
}
