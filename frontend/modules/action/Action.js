import Reflux from "reflux";

export default Reflux.createActions([
    "on",
    "off",
    "create_customer",
    "updated_customer",
    "created_customer",
    "created_customer_failed",
    "require_customers",
    "delete_customer",
    "deleted_customer",
    "load_customer",
    "update_customer",

    "create_invoice",
    "updated_invoice",
    "created_invoice",
    "created_invoice_failed",
    "require_invoices",
    "delete_invoice",
    "deleted_invoice",
    "load_invoice",
    "update_invoice",

    "require_file_upload",

    "autocomplete_customer"
]);
