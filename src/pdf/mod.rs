use std::process::Command;
use xml::writer::{EventWriter, EmitterConfig, XmlEvent, Result};
use std::fs::File;
use std::io::{self, Write};

pub struct PdfGenerator;

impl PdfGenerator {
	
	pub fn new() -> Self {
		PdfGenerator{ }
	}
	
	pub fn createPdf(&self) -> () {
		// java -jar /Users/tim/proj_/java/pdfbox/target/pdfbox-example-1.0-SNAPSHOT-jar-with-dependencies.jar /Users/tim/proj_/java/pdfbox/invoice.xml /tmp/some.pdf
		
		let output = Command::new("bash")
                     .arg("-c")
                     .arg("java -jar /Users/tim/proj_/java/pdfbox/target/pdfbox-example-1.0-SNAPSHOT-jar-with-dependencies.jar /Users/tim/proj_/java/pdfbox/invoice.xml /tmp/some.pdf")
                     .output()
                     .unwrap_or_else(|e| { panic!("failed to execute process: {}", e) });
		
		println!(
			"\n\n{}{}\n\n",
			String::from_utf8_lossy(output.stdout.as_slice()),
			String::from_utf8_lossy(output.stderr.as_slice())
		);
	}

	
	pub fn foo(&self) -> () {
		
		let mut file = File::create("output.xml").unwrap();
		let mut writer = EmitterConfig::new().perform_indent(true).create_writer(&mut file);
		
		writer.write(XmlEvent::start_element("invoice")).unwrap();
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
			
			writer.write(XmlEvent::start_element("items")).unwrap();
				writer.write(XmlEvent::start_element("item").attr("count", "2").attr("price", "2324")).unwrap();
					writer.write(XmlEvent::start_element("description")).unwrap();
						writer.write(XmlEvent::cdata("Description")).unwrap();
					writer.write(XmlEvent::end_element()).unwrap();
				writer.write(XmlEvent::end_element()).unwrap();
			writer.write(XmlEvent::end_element()).unwrap();
			
		writer.write(XmlEvent::end_element()).unwrap();
				
	}
	
}