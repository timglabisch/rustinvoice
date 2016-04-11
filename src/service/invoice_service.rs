pub struct InvoiceService;

use hyper::Client;
use serde_json;
use entity::invoice::Invoice;
use es::search::SearchResult;
use es::create::CreateResult;
use es::id::IdResult;
use std::io::Read;

impl InvoiceService {

    pub fn create_new_invoice(invoice : &Invoice) -> CreateResult {
        let data = serde_json::to_string(invoice).expect("serialize invoice to string");

        let mut res = Client::new()
            .post("http://192.168.0.79:9200/invoice/foo")
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

        let mut res = Client::new()
            .post(&(format!("http://192.168.0.79:9200/invoice/foo/{}", uuid)).to_string())
            .body(&data)
            .send()
            .expect("sending invoice update to elastic");
    }

    pub fn get_by_id(s : &String) -> IdResult<Invoice> {
        let mut res = Client::new()
            .get(&(format!("http://192.168.0.79:9200/invoice/foo/{}", s).to_string()))
            .send()
            .expect("sending get to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

        let es_res = serde_json::from_str::<IdResult<Invoice>>(&body).expect("parsing es invoice id result");
        es_res
    }

    pub fn all_invoices() -> SearchResult<Invoice> {

        let mut res = Client::new()
            .post("http://192.168.0.79:9200/invoice/foo/_search")
            .body(&r#"{"query":{"match_all":{}}}"#.to_string())
            .send()
            .expect("sending invoice to elastic");

        let mut body = String::new();
        res.read_to_string(&mut body).unwrap();

        serde_json::from_str::<SearchResult<Invoice>>(&body).expect("parsing es invoice result")
    }

    pub fn delete(s: &String) {
        Client::new()
            .delete(&(format!("http://192.168.0.79:9200/invoice/foo/{}?refresh=true", s).to_string()))
            .send()
            .expect("sending invoice delete to elastic");
    }

}
