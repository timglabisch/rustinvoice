pub struct CustomerService;

use hyper::Client;
use entity::customer::Customer;
use serde_json;
use es::search::SearchResult;
use es::id::IdResult;
use es::create::CreateResult;
use std::io::Read;


impl CustomerService {

    pub fn update_customer(uuid : &String, customer : &Customer) {
        let data = serde_json::to_string(customer).expect("serialize customer to string");

        let mut res = Client::new()
            .post(&(format!("http://192.168.0.79:9200/customer/foo/{}", uuid)).to_string())
            .body(&data)
            .send()
            .expect("sending update to elastic");
    }

    pub fn create_new_customer(customer : &Customer) -> CreateResult {
        let data = serde_json::to_string(customer).expect("serialize customer to string");

        let mut res = Client::new()
            .post("http://192.168.0.79:9200/customer/foo")
            .body(&data)
            .send()
            .expect("sending post to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

        let es_res = serde_json::from_str::<CreateResult>(&body).expect("parsing es customer create");
        es_res
    }

    pub fn delete(s: &String) {
        Client::new()
            .delete(&(format!("http://192.168.0.79:9200/customer/foo/{}?refresh=true", s).to_string()))
            .send()
            .expect("sending delete to elastic");
    }

    pub fn get_by_id(s : &String) -> IdResult<Customer> {
        let mut res = Client::new()
            .get(&(format!("http://192.168.0.79:9200/customer/foo/{}", s).to_string()))
            .send()
            .expect("sending get to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

        let es_res = serde_json::from_str::<IdResult<Customer>>(&body).expect("parsing es customer id result");
        es_res
    }

    pub fn all_customers() -> SearchResult<Customer> {

        let mut res = Client::new()
            .post("http://192.168.0.79:9200/customer/foo/_search")
            .body(&r#"{"query":{"match_all":{}}}"#.to_string())
            .send()
            .expect("sending to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

        let es_res = serde_json::from_str::<SearchResult<Customer>>(&body).expect("parsing es result");
        es_res
    }


}
