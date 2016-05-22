#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SearchResult<T> where T : Clone {
    pub took : i32,
    pub timed_out : bool,
    pub _shards : SearchResultShards,
    pub hits : SearchResultHits<T>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SearchResultShards {
    pub total : i32,
    pub successful : i32,
    pub failed : i32
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SearchResultHits<T> where T : Clone {
    pub total: i32,
    pub hits: Vec<SearchResultHit<T>>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SearchResultHit<T> where T : Clone {
    pub _index : String,
    pub _type : String,
    pub _id : String,
    pub _score : i32,
    pub _source : T
}
