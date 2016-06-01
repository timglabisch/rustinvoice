pub struct ByteReader;

use plugin::Plugin;
use nickel::Request;
use typemap::Key;
use std::io::{self, ErrorKind, Read};

impl Key for ByteReader {
    type Value = String;
}

impl<'mw, 'conn, D> Plugin<Request<'mw, 'conn, D>> for ByteReader {
    type Error = io::Error;

    fn eval(req: &mut Request<D>) -> Result<String, io::Error> {
        let mut buf = String::new();
        try!(req.origin.read_to_string(&mut buf));
        Ok(buf)
    }
}