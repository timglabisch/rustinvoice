pub struct SuggestService;
use es::search::SearchResult;
use entity::customer::Customer;
use hyper::Client;
use serde_json;
use std::io::Read;


impl SuggestService {

    pub fn getCustomerCompletion(query : &str) -> SearchResult<Customer> {

        let q = format!("{}{}{}", r#"
        {
            "query": {
                "nested": {
                   "path": "address",
                   "query": {
                       "multi_match": {
                          "query": ""#, &(query.to_string()), r#"",
                          "fields": [
                              "address.country.autocomplete",
                              "address.street.autocomplete",
                              "address.street_number.autocomplete",
                              "address.zip.autocomplete",
                              "address.first_name.autocomplete",
                              "address.last_name.autocomplete",
                              "address.company_name.autocomplete"
                          ]
                       }
                   }
                }
            }
        }
        "#).to_string();

        let mut res = Client::new()
            .post("http://192.168.0.79:9200/rustinvoice/customer/_search")
            .body(&q)
            .send()
            .expect("sending invoice to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

        println!("q: {}", q);

        serde_json::from_str::<SearchResult<Customer>>(&body).expect("parsing query result")
    }


}
