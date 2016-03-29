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
use api::customers::ApiCustomer;
use api::ApiCreated;
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

        let customer : Customer = serde_json::from_str(&x).unwrap();

        let es_created_res = CustomerService::create_new_customer(&customer);

        serde_json::to_string(
            &ApiCreated::new(
                es_created_res._id
            )
        ).expect("serialize customer created")
    });

    server.put("/customers/:uuid", middleware! { |request, mut response|
        response.set(MediaType::Json);
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        let mut x = String::new();
        request.origin.read_to_string(&mut x).unwrap();

        let customer : Customer = serde_json::from_str(&x).unwrap();

        CustomerService::update_customer(
            &request.param("uuid").expect("update without uuid").to_string(),
            &customer
        );

        ""
    });

    server.delete("/customers/:uuid", middleware! { |request, mut response|
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        CustomerService::delete(
            &request.param("uuid").expect("delete without uuid").to_string()
        );

        ""
    });

    server.get("/customers", middleware! { |_, mut response|
        response.set(MediaType::Json);
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        serde_json::to_string(
            &ApiCustomers::new(
                &CustomerService::all_customers()
            )
        ).expect("serialize customers")
    });

    server.get("/customer", middleware! { |_, mut response|
        response.set(MediaType::Json);
        "[]"
    });

    server.get("/customers/:uuid", middleware! { |request, mut response|
        response.set(MediaType::Json);
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        let api_customer_id_result = CustomerService::get_by_id(
            &request.param("uuid").expect("get without uuid").to_string()
        );

        let api_customer : ApiCustomer = api_customer_id_result.into();

        serde_json::to_string(&api_customer).expect("unserialize customers")
    });

    server.listen("127.0.0.1:6767");
}
