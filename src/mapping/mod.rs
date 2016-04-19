use hyper::Client;
use hyper::status::StatusCode;
use std::io::Read;

pub struct EsMapping;

impl EsMapping {

    pub fn update_invoice() {
        EsMapping::post("http://192.168.0.79:9200/rustinvoice/_close");
        EsMapping::update(
            "http://192.168.0.79:9200/rustinvoice/_settings",
            r#"
            {
                "analysis" : {
                    "analyzer" : {
                        "basic_autocomplete_analyzer" : {
                            "tokenizer" : "basic_autocomplete_tokenizer"
                        }
                    },
                    "tokenizer" : {
                        "basic_autocomplete_tokenizer" : {
                            "type" : "edgeNGram",
                            "min_gram" : "2",
                            "max_gram" : "20",
                            "token_chars": [ "letter", "digit" ]
                        }
                    }
                }
            }
            "#
        );
        EsMapping::post("http://192.168.0.79:9200/rustinvoice/_open");

        EsMapping::update(
            "http://192.168.0.79:9200/rustinvoice/_mapping/customer",
            r#"
            {
                "properties": {
                    "address": {
                        "type": "nested",
                        "properties": {
                            "country": {
                                "type": "multi_field",
                                "fields" : {
                                    "analyzed" : {"type" : "string", "index" : "analyzed"},
                                    "untouched" : {"type" : "string", "analyzer": "keyword"},
                                    "autocomplete" : {"type" : "string", "analyzer": "basic_autocomplete_analyzer"}
                                }
                            },
                            "street": {
                                "type": "multi_field",
                                "fields" : {
                                    "analyzed" : {"type" : "string", "index" : "analyzed"},
                                    "untouched" : {"type" : "string", "analyzer": "keyword"},
                                    "autocomplete" : {"type" : "string", "analyzer": "basic_autocomplete_analyzer"}
                                }
                            },
                            "street_number": {
                                "type": "multi_field",
                                "fields" : {
                                    "analyzed" : {"type" : "string", "index" : "analyzed"},
                                    "untouched" : {"type" : "string", "analyzer": "keyword"},
                                    "autocomplete" : {"type" : "string", "analyzer": "basic_autocomplete_analyzer"}
                                }
                            },
                            "zip": {
                                "type": "multi_field",
                                "fields" : {
                                    "analyzed" : {"type" : "string", "index" : "analyzed"},
                                    "untouched" : {"type" : "string", "analyzer": "keyword"},
                                    "autocomplete" : {"type" : "string", "analyzer": "basic_autocomplete_analyzer"}
                                }
                            },
                            "first_name": {
                                "type" : "multi_field",
                                "fields" : {
                                    "analyzed" : {"type" : "string", "index" : "analyzed"},
                                    "untouched" : {"type" : "string", "analyzer": "keyword"},
                                    "autocomplete" : {"type" : "string", "analyzer": "basic_autocomplete_analyzer"}
                                }
                            },
                            "last_name": {
                                "type" : "multi_field",
                                "fields" : {
                                    "analyzed" : {"type" : "string", "index" : "analyzed"},
                                    "untouched" : {"type" : "string", "analyzer": "keyword"},
                                    "autocomplete" : {"type" : "string", "analyzer": "basic_autocomplete_analyzer"}
                                }
                            },
                            "company_name": {
                                "type" : "multi_field",
                                "fields" : {
                                    "analyzed" : {"type" : "string", "index" : "analyzed"},
                                    "untouched" : {"type" : "string", "analyzer": "keyword"},
                                    "autocomplete" : {"type" : "string", "analyzer": "basic_autocomplete_analyzer"}
                                }
                            }
                        }
                    }
                }
            }
            "#
        );
    }

    fn post(url : &str) {
        let res = Client::new()
            .post(url)
            .send()
            .expect("could not update mapping.")
        ;
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
