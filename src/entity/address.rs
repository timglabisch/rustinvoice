#[derive(RustcDecodable, RustcEncodable, Default)]
pub struct Address {
    country : String,
    street : String,
    street_number : String,
    zip : String,
    first_name : String,
    last_name : String,
    company_name : String
}
