pub struct ListContext {
    pub query : String,
    pub page : i32
}

impl ListContext {
    pub fn new(query : String, page : i32) -> ListContext {
        ListContext {
            query: query,
            page: page
        }
    }
}
