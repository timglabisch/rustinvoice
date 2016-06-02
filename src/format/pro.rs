use std::io;
use std::io::prelude::*;
use std::fs::File;
use cp437::Reader;
use std::io::Bytes;
use entity::invoice::{Invoice, InvoiceItem};
use entity::address::Address;

#[derive(Default)]
pub struct ProFile {
	
	pub kurzname : String,
	pub projekt : String,
	pub zeichen : String,
	pub info : String,
	pub datum : String,
	pub termin : String,
	
	pub fibu_kto : String,
	pub skt_satz : String,
	pub skt_tage : String,
	pub ziel_tage : String,
	
	pub mwst_code : String,
	pub preis_code : String,
	pub project_code : String,
	
	pub title : String,
	pub name1 : String,
	pub name2 : String,
	pub street : String,
	pub zip : String,
	pub region : String,
	
	pub info1 : String,
	pub info2 : String,
	pub info3 : String,
	pub info4 : String,
	
	pub project_ab_zuschlag : String,
	pub project_ab_zuschlag_wert : String,
	
	pub projectierungskosten_ab_zuschlag : String,
	pub projectierungskosten_ab_zuschlag_wert : String,
	
	pub sicherheitsbehalt_ab_zuschlag : String,
	pub sicherheitsbehalt_ab_zuschlag_wert : String,
	
	pub items : Vec<ProFileItem>
	
}

#[derive(Default)]
pub struct ProFileItem {
	
	pub block_type : String,
	pub kennung : String,
	pub text : String,
	pub einheit : String,
	pub menge : String,
	pub preis : String
	
}

impl ProFile {
	pub fn to_invoice(&self) -> Invoice {
		
		Invoice {
			short_name : self.kurzname.clone(),
			project : self.projekt.clone(),
			shortcut : self.zeichen.clone(),
			info : self.info.clone(),
			date : self.datum.clone(),
			description : self.info1.clone(),
	
		    address : Address {
		    	// title
			    country : self.region.clone(),
			    street : self.street.clone(),
			    street_number : "".to_string(),
			    zip : self.zip.clone(),
			    first_name : self.name1.clone(),
			    last_name : self.name2.clone(),
			    company_name : "".to_string()
		    },
		    
		    items : self.items.iter().map(|item| {
			    InvoiceItem {
			    
				    quantity : 1,
					
					text : item.text.clone(),
					
					cost : 1
			    
			    }
		    }).collect()
		}
		
	}
}

pub fn convert<T : Read>(bytes : &mut Bytes<T>) -> ProFile {
	let mut r = Reader::new(bytes);
	
	let mut pro = ProFile::default();
	
	pro.kurzname = r.consume(12).trim().to_string();
	pro.projekt = r.consume(12).trim().to_string();
	pro.zeichen = r.consume(12).trim().to_string();
	pro.info = r.consume(12).trim().to_string();
	pro.datum = r.consume(10).trim().to_string();
	pro.termin = r.consume(10).trim().to_string();
	
	pro.fibu_kto = r.consume(5).trim().to_string();
	pro.skt_satz = r.consume(5).trim().to_string();
	pro.skt_tage = r.consume(2).trim().to_string();
	pro.ziel_tage = r.consume(2).trim().to_string();
	
	pro.mwst_code = r.consume(1).trim().to_string();
	pro.preis_code = r.consume(1).trim().to_string();
	pro.project_code = r.consume(1).trim().to_string();
	
	pro.title = r.consume(40).trim().to_string();
	pro.name1 = r.consume(40).trim().to_string();
	pro.name2 = r.consume(40).trim().to_string();
	pro.street = r.consume(40).trim().to_string();
	pro.zip = r.consume(8).trim().to_string();
	pro.region = r.consume(40).trim().to_string();
	
	pro.info1 = r.consume(40).trim().to_string();
	pro.info2 = r.consume(40).trim().to_string();
	pro.info3 = r.consume(40).trim().to_string();
	pro.info4 = r.consume(40).trim().to_string();
	
	pro.project_ab_zuschlag = r.consume(5).trim().to_string();
	pro.project_ab_zuschlag_wert = r.consume(8).trim().to_string();
	
	pro.projectierungskosten_ab_zuschlag = r.consume(5).trim().to_string();
	pro.projectierungskosten_ab_zuschlag_wert = r.consume(8).trim().to_string();
	
	pro.sicherheitsbehalt_ab_zuschlag = r.consume(5).trim().to_string();
	pro.sicherheitsbehalt_ab_zuschlag_wert = r.consume(8).trim().to_string();
	
	r.consume(508); // skip
	
	loop {
		
		let textType = r.consume(2);
		
		if textType.trim() == "" {
			break;
		}
		
		let mut pro_file_item = ProFileItem::default();
		pro_file_item.block_type = textType.trim().to_string();
		pro_file_item.kennung = r.consume(20).trim().to_string();
		pro_file_item.text = r.consume(40).trim().to_string();
		
		r.consume(10);
		pro_file_item.einheit = r.consume(4).trim().to_string();
		pro_file_item.menge = r.consume(10).trim().to_string();
		r.consume(24);
		pro_file_item.preis = r.consume(10).trim().to_string();
		r.consume(80);
		
		pro.items.push(pro_file_item);
	};
	
	pro
	
}