pub struct CustomerService;

use hyper::Client;
use entity::customer::Customer;
use serde_json;
use es::search::SearchResult;
use es::id::IdResult;
use es::create::CreateResult;
use std::io::Read;
use dto::ListContext;
use serde_json::builder::ObjectBuilder;


impl CustomerService {

    pub fn update_customer(uuid : &String, customer : &Customer) {
        let data = serde_json::to_string(customer).expect("serialize customer to string");

        Client::new()
            .post(&(format!("http://192.168.0.79:9200/rustinvoice/customer/{}?refresh=true", uuid)).to_string())
            .body(&data)
            .send()
            .expect("sending update to elastic");
    }

    pub fn create_new_customer(customer : &Customer) -> CreateResult {
        let data = serde_json::to_string(customer).expect("serialize customer to string");

        let mut res = Client::new()
            .post("http://192.168.0.79:9200/rustinvoice/customer?refresh=true")
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
            .delete(&(format!("http://192.168.0.79:9200/rustinvoice/customer/{}?refresh=true", s).to_string()))
            .send()
            .expect("sending delete to elastic");
    }

    pub fn get_by_id(s : &String) -> IdResult<Customer> {
        let mut res = Client::new()
            .get(&(format!("http://192.168.0.79:9200/rustinvoice/customer/{}", s).to_string()))
            .send()
            .expect("sending get to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

        let es_res = serde_json::from_str::<IdResult<Customer>>(&body).expect("parsing es customer id result");
        es_res
    }

    fn get_all_customers_query(context : &ListContext) -> String {

        println!("{}, {}", context.query, context.query.len());

        let value = if context.query.len() == 0 {
            ObjectBuilder::new().insert_object("query", |b| {
                b.insert_object("match_all", |b| {
                    b
                })
            })
            .insert("from", context.from)
            .insert("size", context.size)
            .unwrap()
        } else {
            ObjectBuilder::new().insert_object("query", |b| {
                b.insert_object("nested", |b| {
                    b.insert("path", "address")
                     .insert_object("query", |b| {
                         b.insert_object("multi_match", |b| {
                            b.insert("query", &context.query)
                             .insert("fuzziness", 1.1)
                             .insert_array("fields", |b| {
                                b
                                 .push("address.country.analyzed^2")
                                 .push("address.street.analyzed^10")
                                 .push("address.street_number.analyzed^1")
                                 .push("address.zip.analyzed^2")
                                 .push("address.first_name.analyzed^4")
                                 .push("address.last_name.analyzed^10")
                                 .push("address.company_name.analyzed^10")

                                 .push("address.country.autocomplete")
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
            })
            .insert("from", context.from)
            .insert("size", context.size)
            .unwrap()
        };

        serde_json::to_string(&value).unwrap()
    }

    pub fn all_customers(context : ListContext) -> SearchResult<Customer> {

        let query = Self::get_all_customers_query(&context);

        println!("{}", query);

        let mut res = Client::new()
            .post("http://192.168.0.79:9200/rustinvoice/customer/_search")
            .body(&query)
            .send()
            .expect("sending to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

        let es_res = serde_json::from_str::<SearchResult<Customer>>(&body).expect("parsing es result");
        es_res
    }


}
