#![feature(custom_derive, plugin)]
#![plugin(serde_macros)]


extern crate serde;
extern crate serde_json;
#[macro_use] extern crate nickel;
#[macro_use] extern crate hyper;
extern crate unicase;
extern crate xml;

use std::collections::HashMap;
use nickel::{Nickel, HttpRouter, MediaType, QueryString};
mod entity;
use entity::customer::Customer;
use entity::invoice::Invoice;
use hyper::header::{AccessControlAllowOrigin, AccessControlAllowHeaders, AccessControlAllowMethods};
use unicase::UniCase;
use std::io::Read;
mod service;
use service::customer_service::CustomerService;
use service::invoice_service::InvoiceService;
use service::suggest_service::SuggestService;
mod es;
mod api;
mod dto;
mod mapping;
mod pdf;
use api::customers::ApiCustomers;
use api::customers::ApiCustomer;
use api::invoices::ApiInvoice;
use api::invoices::ApiInvoices;
use api::ApiCreated;
use hyper::method::Method;
use mapping::EsMapping;
use dto::ListContext;
use pdf::PdfGenerator;

fn main() {

    let pdf_generator = PdfGenerator::new();
	pdf_generator.write_invoice_xml(&Invoice::default());
	
	return;
	
	EsMapping::update_invoice();
    

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

    server.get("/", middleware! { |_, response|
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

        println!("{:?}", &x);

        let customer : Customer = serde_json::from_str(&x).expect("could not deserialize customer on put");

        CustomerService::update_customer(
            &request.param("uuid").expect("update without uuid").to_string(),
            &customer
        );

        "[]"
    });

    server.delete("/customers/:uuid", middleware! { |request, mut response|
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        CustomerService::delete(
            &request.param("uuid").expect("delete without uuid").to_string()
        );

        ""
    });

    server.get("/customers", middleware! { |request, mut response|
        response.set(MediaType::Json);
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        let list_context = ListContext::new(
            request.query().get("q").unwrap_or("").to_string(),
            request.query().get("from").unwrap_or("0").to_string().parse::<i32>().unwrap_or(0).clone(),
            request.query().get("size").unwrap_or("10").to_string().parse::<i32>().unwrap_or(0).clone()
        );

        serde_json::to_string(
            &ApiCustomers::new(
                &CustomerService::all_customers(list_context)
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

    server.get("/invoices", middleware! { |request, mut response|
        response.set(MediaType::Json);
        response.headers_mut().set(AccessControlAllowOrigin::Any);

		let list_context = ListContext::new(
            request.query().get("q").unwrap_or("").to_string(),
            request.query().get("from").unwrap_or("0").to_string().parse::<i32>().unwrap_or(0).clone(),
            request.query().get("size").unwrap_or("10").to_string().parse::<i32>().unwrap_or(0).clone()
        );

        serde_json::to_string(
            &ApiInvoices::new(
                &InvoiceService::all_invoices(&list_context)
            )
        ).expect("serialize api invoices")
    });

    server.put("/invoices/:uuid", middleware! { |request, mut response|
        response.set(MediaType::Json);
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        let mut x = String::new();
        request.origin.read_to_string(&mut x).unwrap();

        println!("{:?}", &x);

        let invoice : Invoice = serde_json::from_str(&x).expect("could not deserialize invoice on put");

        InvoiceService::update_invoice(
            &request.param("uuid").expect("update without uuid").to_string(),
            &invoice
        );

        "[]"
    });

    server.post("/invoices", middleware! { |request, mut response|
        response.set(MediaType::Json);
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        let mut x = String::new();
        request.origin.read_to_string(&mut x).unwrap();

        let invoice : Invoice = serde_json::from_str(&x).unwrap();

        let es_created_res = InvoiceService::create_new_invoice(&invoice);

        serde_json::to_string(
            &ApiCreated::new(
                es_created_res._id
            )
        ).expect("serialize invoice created")
    });

    server.get("/invoices/:uuid", middleware! { |request, mut response|
        response.set(MediaType::Json);
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        let api_invoice_id_result = InvoiceService::get_by_id(
            &request.param("uuid").expect("get without uuid").to_string()
        );

        let api_invoice : ApiInvoice = api_invoice_id_result.into();

        serde_json::to_string(&api_invoice).expect("unserialize invoices")
    });

    server.delete("/invoices/:uuid", middleware! { |request, mut response|
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        InvoiceService::delete(
            &request.param("uuid").expect("delete invoice without uuid").to_string()
        );

        ""
    });

    server.get("/suggest", middleware! { |request, mut response|
        response.set(MediaType::Json);
        response.headers_mut().set(AccessControlAllowOrigin::Any);

        serde_json::to_string(
            &ApiCustomers::new(
                &SuggestService::get_customer_completion(
                    &request.query().get("query").expect("query param on suggestion is missing").to_string()
                )
            )
        ).expect("serialize customers")
    });


    server.listen("127.0.0.1:6767");
}
