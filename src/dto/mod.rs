pub struct ListContext {
    pub query : String,
    pub size : i32,
    pub from : i32
}

impl ListContext {
    pub fn new(query : String, from : i32, size : i32) -> ListContext {
        ListContext {
            query: query,
            from: from,
            size: size
        }
    }
}
