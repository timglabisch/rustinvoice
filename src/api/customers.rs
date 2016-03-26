use entity::address::Address;
use entity::customer::Customer;
use es::search::SearchResult;
use es::search::SearchResultHit;
use es::id::IdResult;
use std::convert::From;

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct ApiCustomers {
    pub took : i32,
    pub total : i32,
    pub customers : Vec<ApiCustomer>
}

impl ApiCustomers {
    pub fn new(searchResult : &SearchResult<Customer>) -> ApiCustomers {
        ApiCustomers {
            took: searchResult.took,
            total: searchResult.hits.total,
            customers: searchResult.hits.hits.iter().map(|s : &SearchResultHit<Customer>| {
                ApiCustomer {
                    uuid: s._id.clone(),
                    address: s._source.address.clone()
                }
            }).collect()
        }
    }
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct ApiCustomer {
    pub uuid: String,
    pub address: Address
}

impl From<IdResult<Customer>> for ApiCustomer {
    fn from(s : IdResult<Customer>) -> ApiCustomer {
        ApiCustomer {
            uuid: s._id.clone(),
            address: s._source.address.clone()
        }
    }
}
