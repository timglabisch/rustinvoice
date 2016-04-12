use hyper::Client;
use hyper::status::StatusCode;
use std::io::Read;

pub struct EsMapping;

impl EsMapping {

    pub fn update_invoice() {
        EsMapping::update(
            "http://192.168.0.79:9200/rustinvoice/_mapping/customer",
            r#"
            {
                "properties": {
                    "address": {
                        "type": "nested",
                        "properties": {
                            "country": {
                                "type": "string",
                                "analyzer": "keyword"
                            },
                            "street": {
                                "type": "string",
                                "analyzer": "keyword"
                            },
                            "street_number": {
                                "type": "string",
                                "analyzer": "keyword"
                            },
                            "zip": {
                                "type": "string",
                                "analyzer": "keyword"
                            },
                            "first_name": {
                                "type" : "multi_field",
                                "fields" : {
                                    "analyzed" : {"type" : "string", "index" : "analyzed"},
                                    "untouched" : {"type" : "string", "analyzer": "keyword"}
                                }
                            },
                            "last_name": {
                                "type" : "multi_field",
                                "fields" : {
                                    "analyzed" : {"type" : "string", "index" : "analyzed"},
                                    "untouched" : {"type" : "string", "analyzer": "keyword"}
                                }
                            },
                            "company_name": {
                                "type" : "multi_field",
                                "fields" : {
                                    "analyzed" : {"type" : "string", "index" : "analyzed"},
                                    "untouched" : {"type" : "string", "analyzer": "keyword"}
                                }
                            }
                        }
                    }
                }
            }
            "#
        );
    }

    fn update(url : &str, mapping : &str) -> bool {

        let mut res = Client::new()
            .put(url)
            .body(mapping)
            .send()
            .expect("could not update mapping.")
        ;

        return match res.status {
            StatusCode::Ok => true,
            _ => {
                let mut body = String::new();
                res.read_to_string(&mut body).unwrap();
                println!("Error on updating Mapping:\nurl: {}\n{}\n{}\n\n", url, res.status, body);
                false
            }
        }
    }

}
