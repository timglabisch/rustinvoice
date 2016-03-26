#![feature(custom_derive, plugin)]
#![plugin(serde_macros)]

extern crate serde;
extern crate serde_json;
#[macro_use] extern crate nickel;
#[macro_use] extern crate hyper;
extern crate unicase;

use std::collections::HashMap;
use nickel::{Nickel, HttpRouter, MediaType};
mod entity;
use entity::customer::Customer;
use hyper::header::{Headers, AccessControlAllowOrigin, AccessControlAllowHeaders};
use unicase::UniCase;
use std::io::Read;
mod service;
use service::customer_service::CustomerService;
mod es;

fn main() {
    let mut server = Nickel::new();

    server.options("**", middleware! { |request, mut response|
        response.headers_mut().set(AccessControlAllowOrigin::Any);
        response.headers_mut().set(AccessControlAllowHeaders(vec![
            UniCase("Content-Type".to_string())
        ]));
        ""
    });

    server.get("/", middleware! { |request, mut response|

        response.headers_mut().set(AccessControlAllowOrigin::Any);

        let mut data = HashMap::new();
        data.insert("name", "user");
        return response.render("src/templates/hello.tpl", &data);
    });

    server.post("/customers", middleware! { |request, mut response|
        response.set(MediaType::Json);
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        let mut x = String::new();
        request.origin.read_to_string(&mut x);

        //let customer = request.json_as::<Customer>().expect("wrong json");
        let customer : Customer = serde_json::from_str(&x).unwrap();

        CustomerService::createNewCustomer(&customer);

        println!("{:?}", customer);

        "[]"
    });

    server.get("/customers", middleware! { |_, mut response|
        response.set(MediaType::Json);
        serde_json::to_string(&CustomerService::allCustomers()).expect("unserialize customers")
    });

    server.get("/customer", middleware! { |_, mut response|
        response.set(MediaType::Json);
        "[]"
    });

    server.get("/customer/:uuid", middleware! { |_, mut response|
        response.set(MediaType::Json);

        let c = Customer::new();
        //let customer_as_json = json::encode(&c);
        //customer_as_json.unwrap()
    });

    server.listen("127.0.0.1:6767");
}
