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
use hyper::header::{AccessControlAllowOrigin, AccessControlAllowHeaders, AccessControlAllowMethods};
use unicase::UniCase;
use std::io::Read;
mod service;
use service::customer_service::CustomerService;
mod es;
mod api;
use api::customers::ApiCustomers;
use hyper::method::Method;


fn main() {
    let mut server = Nickel::new();

    server.options("**", middleware! { |_, mut response|
        response.headers_mut().set(AccessControlAllowOrigin::Any);
        response.headers_mut().set(AccessControlAllowHeaders(vec![
            UniCase("Content-Type".to_string())
        ]));
        response.headers_mut().set(AccessControlAllowHeaders(vec![
            UniCase("Content-Type".to_string())
        ]));
        response.headers_mut().set(AccessControlAllowMethods(vec![
            Method::Get,
            Method::Post,
            Method::Delete,
            Method::Put
        ]));

        ""
    });

    server.get("/", middleware! { |_, mut response|

        response.headers_mut().set(AccessControlAllowOrigin::Any);

        let mut data = HashMap::new();
        data.insert("name", "user");
        return response.render("src/templates/hello.tpl", &data);
    });

    server.post("/customers", middleware! { |request, mut response|
        response.set(MediaType::Json);
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        let mut x = String::new();
        request.origin.read_to_string(&mut x).unwrap();

        //let customer = request.json_as::<Customer>().expect("wrong json");
        let customer : Customer = serde_json::from_str(&x).unwrap();

        CustomerService::create_new_customer(&customer);

        println!("{:?}", customer);

        "[]"
    });

    server.get("/customers", middleware! { |_, mut response|
        response.set(MediaType::Json);
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        serde_json::to_string(
            &ApiCustomers::new(
                &CustomerService::all_customers()
            )
        ).expect("unserialize customers")
    });

    server.get("/customer", middleware! { |_, mut response|
        response.set(MediaType::Json);
        "[]"
    });

    server.get("/customer/:uuid", middleware! { |_, mut response|
        response.set(MediaType::Json);

        //let c = Customer::new();
        //let customer_as_json = json::encode(&c);
        //customer_as_json.unwrap()
    });

    server.listen("127.0.0.1:6767");
}
