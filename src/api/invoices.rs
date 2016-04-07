use entity::address::Address;
use entity::invoice::Invoice;
use entity::invoice::InvoiceItem;
use es::search::SearchResult;
use es::search::SearchResultHit;

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct ApiInvoices {
    pub took : i32,
    pub total : i32,
    pub invoices : Vec<ApiInvoice>
}

impl ApiInvoices {

    pub fn new(invoice : &SearchResult<Invoice>) -> ApiInvoices {
        ApiInvoices {
            took: invoice.took,
            total: invoice.hits.total,
            invoices: invoice.hits.hits.iter().map(|s : &SearchResultHit<Invoice>| {
                ApiInvoice {
                    uuid: s._id.clone(),
                    address: s._source.address.clone(),
                    items: s._source.items.iter().map(|item : &InvoiceItem|{
                        ApiInvoiceItem {
                            quantity: item.quantity.clone(),
                            text: item.text.clone(),
                            cost: item.cost.clone()
                        }
                    }).collect()
                }
            }).collect()
        }
    }

}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct ApiInvoice {
    pub uuid : String,
    pub address : Address,
    pub items : Vec<ApiInvoiceItem>
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct ApiInvoiceItem {
    pub quantity : i32,
    pub text : String,
    pub cost : i32
}
