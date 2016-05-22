pub struct SuggestService;
use es::search::SearchResult;
use entity::customer::Customer;
use hyper::Client;
use serde_json;
use std::io::Read;
use serde_json::builder::ObjectBuilder;


impl SuggestService {

    pub fn get_customer_completion(query : &str) -> SearchResult<Customer> {

		let q = ObjectBuilder::new().insert_object("query", |b| {
			b.insert_object("nested", |b| {
				b.insert("path", "address")
				 .insert_object("query", |b| {
					b.insert_object("multi_match", |b| {
						b.insert("query", query)
						 .insert_array("fields", |b| {
							b.push("address.country.autocomplete")
							 .push("address.street.autocomplete")
							 .push("address.street_number.autocomplete")
							 .push("address.zip.autocomplete")
							 .push("address.first_name.autocomplete")
							 .push("address.last_name.autocomplete")
							 .push("address.company_name.autocomplete")
						})	
					})	 
				 })
			})	
		}).unwrap();

        let mut res = Client::new()
            .post("http://192.168.0.79:9200/rustinvoice/customer/_search")
            .body(&serde_json::to_string(&q).unwrap())
            .send()
            .expect("sending invoice to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

		println!("{}", body);

        serde_json::from_str::<SearchResult<Customer>>(&body).expect("parsing query result")
    }


}
