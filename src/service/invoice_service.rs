pub struct InvoiceService;

use hyper::Client;
use serde_json;
use serde_json::builder::ObjectBuilder;
use entity::invoice::Invoice;
use es::search::SearchResult;
use es::create::CreateResult;
use es::id::IdResult;
use std::io::Read;
use dto::ListContext;

impl InvoiceService {

    pub fn create_new_invoice(invoice : &Invoice) -> CreateResult {
        let data = serde_json::to_string(invoice).expect("serialize invoice to string");

        let mut res = Client::new()
            .post("http://192.168.0.79:9200/rustinvoice/invoice?refresh=true")
            .body(&data)
            .send()
            .expect("sending invoice post to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

        let es_res = serde_json::from_str::<CreateResult>(&body).expect("parsing es invoice create");
        es_res
    }

    pub fn update_invoice(uuid : &String, invoice : &Invoice) {
        let data = serde_json::to_string(invoice).expect("serialize invoice to string");

        Client::new()
            .post(&(format!("http://192.168.0.79:9200/rustinvoice/invoice/{}?refresh=true", uuid)).to_string())
            .body(&data)
            .send()
            .expect("sending invoice update to elastic");
    }

    pub fn get_by_id(s : &String) -> IdResult<Invoice> {
        let mut res = Client::new()
            .get(&(format!("http://192.168.0.79:9200/rustinvoice/invoice/{}", s).to_string()))
            .send()
            .expect("sending get to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

        let es_res = serde_json::from_str::<IdResult<Invoice>>(&body).expect("parsing es invoice id result");
        es_res
    }

	fn get_all_invoices_query(context : &ListContext) -> String {

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

    pub fn all_invoices(context : &ListContext) -> SearchResult<Invoice> {

        let mut res = Client::new()
            .post("http://192.168.0.79:9200/rustinvoice/invoice/_search")
            .body(&(Self::get_all_invoices_query(context)))
            .send()
            .expect("sending invoice to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

        serde_json::from_str::<SearchResult<Invoice>>(&body).expect("parsing es invoice result")
    }

    pub fn delete(s: &String) {
        Client::new()
            .delete(&(format!("http://192.168.0.79:9200/rustinvoice/invoice/{}?refresh=true", s).to_string()))
            .send()
            .expect("sending invoice delete to elastic");
    }

}
