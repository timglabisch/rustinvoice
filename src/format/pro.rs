use std::io;
use std::io::prelude::*;
use std::fs::File;
use cp437::Reader;
use std::io::Bytes;


pub fn convert<T : Read>(bytes : &mut Bytes<T>) {
	let mut r = Reader::new(bytes);
	
	println!("Kurzname {}", r.consume(12)); // Kurzname
	println!("Projekt {}", r.consume(12)); // Projekt
	println!("Zeichen: {}", r.consume(12)); // Zeichen
	println!("Info: {}", r.consume(12)); // I
	println!("Datum {}", r.consume(10));
	println!("Termin {}", r.consume(10));
	
	println!("Fibu-Kto: {}", r.consume(5));
	println!("Skt-Satz: {}", r.consume(5));
	println!("Skt-Tage: {}", r.consume(2));
	println!("Ziel-Tage: {}", r.consume(2));
	
	println!("Mwst-Code: {}", r.consume(1));
	println!("Preis-Code: {}", r.consume(1));
	println!("Projekt-Code: {}", r.consume(1));
	
	println!("Titel: {}", r.consume(40));
	println!("Name1: {}", r.consume(40));
	println!("Name2: {}", r.consume(40));
	println!("Straße: {}", r.consume(40));
	println!("Plz: {}", r.consume(8));
	println!("Ort: {}", r.consume(40));
	
	println!("Info1: {}", r.consume(40));
	println!("Info2: {}", r.consume(40));
	println!("Info3: {}", r.consume(40));
	println!("Info4: {}", r.consume(40));
	
	println!("Projekt ab/Zuschlag: {}", r.consume(5));
	println!("Projekt ab/Zuschlag (Wert): {}", r.consume(8));
	println!("Projektierungskosten ab/Zuschlag: {}", r.consume(5));
	println!("Projektierungskosten ab/Zuschlag (Wert): {}", r.consume(8));
	println!("Sicherheitseinbehalt ab/Zuschlag: {}", r.consume(5));
	println!("Sicherheitseinbehalt ab/Zuschlag (Wert): {}", r.consume(8));
	r.consume(508); // skip
	
	loop {
		
		let textType = r.consume(2);
		
		if textType.trim() == "" {
			break;
		}
		
		println!("TextType: {}", textType);
		println!("Kennung: {}", r.consume(20));
		println!("Text: {}", r.consume(40));
		r.consume(10);
		println!("Einheit: {}", r.consume(4));
		println!("Menge: {}", r.consume(10));
		r.consume(24);
		println!("Preis: {}\n", r.consume(10));
		r.consume(80);
	}
	
	
	
	/*
	for byte in f.bytes() {
	    print!("{}", convert_byte(&byte.unwrap()));
	};
	*/
}