#[macro_use] extern crate nickel;
extern crate rustc_serialize;

use std::collections::HashMap;
use nickel::{Nickel, HttpRouter, MediaType};
use rustc_serialize::json;

mod entity;
use entity::customer::Customer;

fn main() {
    let mut server = Nickel::new();

    server.get("/", middleware! { |_, response|
        let mut data = HashMap::new();
        data.insert("name", "user");
        return response.render("src/templates/hello.tpl", &data);
    });

    server.get("/customer", middleware! { |_, mut response|
        response.set(MediaType::Json);
        "[]"
    });

    server.get("/customer/:uuid", middleware! { |_, mut response|
        response.set(MediaType::Json);

        let c = Customer::new();
        let customer_as_json = json::encode(&c);
        customer_as_json.unwrap()
    });

    server.listen("127.0.0.1:6767");
}
