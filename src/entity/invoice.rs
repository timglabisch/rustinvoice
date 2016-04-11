use entity::address::Address;
use std::default::Default;
use serde;

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct Invoices {
    pub items : Vec<Invoice>
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct Invoice {
    pub address : Address,
    pub items : Vec<InvoiceItem>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct InvoiceItem {
    #[serde(default)]
    pub quantity : i32,
    #[serde(default)]
    pub text : String,
    #[serde(default)]
    pub cost : i32
}

impl Default for InvoiceItem {

    fn default() -> Self {
        InvoiceItem {
            quantity: 1,
            text: String::new(),
            cost: 0
        }
    }

}
