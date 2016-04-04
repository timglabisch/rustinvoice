use api::customers::ApiCustomer;
use std::convert::From;

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct ApiInvoices {
    pub took : i32,
    pub total : i32,
    pub invoices : Vec<ApiInvoice>
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct ApiInvoice {
    pub customer : ApiCustomer,
    pub items : Vec<ApiInvoiceItem>
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct ApiInvoiceItem {
    pub quantity : i32,
    pub text : String
    pub cost : i32
}
