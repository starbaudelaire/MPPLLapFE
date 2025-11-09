import { Metadata } from "next";
import HeaderSection from "@/components/header-section";
import {
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
} from "react-icons/io5";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact - Sports Field Reservation",
};

const ContactPage = () => {
  return (
    <div>
      <HeaderSection title="Contact Us" />
      <div className="max-w-4xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Hit us up! We’re just one message away from making things happen.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-16 text-center">
          <div>
            <IoMailOutline className="size-10 text-[#f64e42] mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-1">Email</h4>
            <p className="text-gray-600">lapang.in@example.com</p>
          </div>
          <div>
            <IoCallOutline className="size-10 text-[#f64e42] mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-1">Phone Number</h4>
            <p className="text-gray-600">+62 8763 2321 2324</p>
          </div>
          <div>
            <IoLocationOutline className="size-10 text-[#f64e42] mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-1">Address</h4>
            <p className="text-gray-600">Tambak Bayan, Babarsari</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
