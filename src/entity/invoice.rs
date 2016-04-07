use entity::address::Address;

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct Invoices {
    pub items : Vec<Invoice>
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct Invoice {
    pub address : Address,
    pub items : Vec<InvoiceItem>
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct InvoiceItem {
    pub quantity : i32,
    pub text : String,
    pub cost : i32
}
