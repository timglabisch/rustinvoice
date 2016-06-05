use std::process::Command;
use xml::writer::{EventWriter, EmitterConfig, XmlEvent};
use std::fs::File;
use std::io::Write;
use entity::address::Address;
use entity::invoice::{Invoice, InvoiceItem};

pub struct PdfGenerator;

impl PdfGenerator {
	
	pub fn new() -> Self {
		PdfGenerator {}
	}
	
	fn create_pdf(&self, uuid : &str, invoice : &Invoice) -> () {
		
		let output = Command::new("bash")
                     .arg("-c")
                     .arg(
                     	&format!(
                     		"java -jar /Users/tim/proj_/java/pdfbox/target/pdfbox-example-1.0-SNAPSHOT-jar-with-dependencies.jar {} {}",
	                     	&format!("/tmp/rustinvoice_invoice_{}.xml", uuid),
	                     	&format!("/tmp/rustinvoice_invoice_{}.pdf", uuid)
                     	)
                     )
                     .output()
                     .unwrap_or_else(|e| { panic!("failed to execute process: {}", e) });
		
		println!(
			"\n\n{}{}\n\n",
			String::from_utf8_lossy(output.stdout.as_slice()),
			String::from_utf8_lossy(output.stderr.as_slice())
		);
	}
	
	fn write_style(&self, writer : &mut EventWriter<&mut File>) -> () {
		writer.write(XmlEvent::start_element("style")).unwrap();
			writer.write(XmlEvent::start_element("overlays")).unwrap();
				writer.write(XmlEvent::start_element("overlay").attr("identifier", "first").attr("file", "overlay_example.pdf")).unwrap();
				writer.write(XmlEvent::end_element()).unwrap();
				writer.write(XmlEvent::start_element("overlay").attr("page", "2").attr("file", "overlay_example.pdf")).unwrap();
				writer.write(XmlEvent::end_element()).unwrap();
				writer.write(XmlEvent::start_element("overlay").attr("page", "3").attr("file", "overlay_example.pdf")).unwrap();
				writer.write(XmlEvent::end_element()).unwrap();
			writer.write(XmlEvent::end_element()).unwrap();
		writer.write(XmlEvent::end_element()).unwrap();
	}
	
	fn write_address(&self, address: &Address, writer : &mut EventWriter<&mut File>) -> () {
		writer.write(XmlEvent::start_element("address")).unwrap();
			writer.write(XmlEvent::start_element("headlines")).unwrap();
				writer.write(XmlEvent::start_element("headline")).unwrap();
					writer.write(XmlEvent::cdata("Firma")).unwrap();
				writer.write(XmlEvent::end_element()).unwrap();
			writer.write(XmlEvent::end_element()).unwrap();
			
			writer.write(XmlEvent::start_element("contents")).unwrap();
				writer.write(XmlEvent::start_element("content")).unwrap();
					writer.write(XmlEvent::cdata("Content!")).unwrap();
				writer.write(XmlEvent::end_element()).unwrap();
			writer.write(XmlEvent::end_element()).unwrap();
		writer.write(XmlEvent::end_element()).unwrap();
	}
	
	fn write_project_information(&self, invoice : &Invoice, writer : &mut EventWriter<&mut File>) -> () {
		writer.write(XmlEvent::start_element("project_information")).unwrap();
			writer.write(XmlEvent::start_element("project_nr")).unwrap();
				writer.write(XmlEvent::cdata("ProjektNR")).unwrap();
			writer.write(XmlEvent::end_element()).unwrap();
			
			writer.write(XmlEvent::start_element("invoice_nr")).unwrap();
				writer.write(XmlEvent::cdata("RechnungsNR")).unwrap();
			writer.write(XmlEvent::end_element()).unwrap();
			
			writer.write(XmlEvent::start_element("date")).unwrap();
				writer.write(XmlEvent::cdata("10.11.1990")).unwrap();
			writer.write(XmlEvent::end_element()).unwrap();
		writer.write(XmlEvent::end_element()).unwrap();
	}
	
	fn write_invoice_item(&self, item : &InvoiceItem, writer : &mut EventWriter<&mut File>) -> () {
		
		if &item.text == "" {
			return;
		}
		
		writer.write(XmlEvent::start_element("item").attr("count", &item.quantity.to_string()).attr("price", &item.cost.to_string())).unwrap();
			writer.write(XmlEvent::start_element("description")).unwrap();
				writer.write(XmlEvent::cdata(&item.text)).unwrap();
			writer.write(XmlEvent::end_element()).unwrap();
		writer.write(XmlEvent::end_element()).unwrap();
	}
	
	pub fn write_invoice_xml(&self, uuid : &str, invoice : &Invoice) -> () {
		
		{
			let mut file = File::create(
				&format!("/tmp/rustinvoice_invoice_{}.xml", uuid)
			).unwrap();
			let mut writer = EmitterConfig::new().perform_indent(true).create_writer(&mut file);
			
			writer.write(XmlEvent::start_element("invoice")).unwrap();
				
				self.write_style(&mut writer);
				self.write_address(&invoice.address, &mut writer);
				self.write_project_information(&invoice, &mut writer);
				
				writer.write(XmlEvent::start_element("items")).unwrap();
					for item in &invoice.items {
						self.write_invoice_item(item, &mut writer);
					}
				writer.write(XmlEvent::end_element()).unwrap();
				
			writer.write(XmlEvent::end_element()).unwrap();
		}
		
		self.create_pdf(uuid, invoice);
	}
	
}