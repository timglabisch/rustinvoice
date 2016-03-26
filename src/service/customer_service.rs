pub struct CustomerService;

use hyper::Client;
use entity::customer::Customer;
use serde_json;
use es::search::SearchResult;
use std::io::Read;


impl CustomerService {
    pub fn createNewCustomer(customer : &Customer) {
        let data = serde_json::to_string(customer).expect("serialize customer to string");

        let mut client = Client::new();
        let mut res = client
            .post("http://192.168.0.79:9200/customer/foo")
            .body(&data)
            .send()
            .expect("sending to elastic");

    }

    pub fn allCustomers() -> Vec<Customer> {

        let mut client = Client::new();
        let mut res = client
            .post("http://192.168.0.79:9200/customer/foo/_search")
            .body(&r#"{"query":{"match_all":{}}}"#.to_string())
            .send()
            .expect("sending to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

        let es_res = serde_json::from_str::<SearchResult<Customer>>(&body).expect("parsing es result");
        es_res.getSources()
    }


}
