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
<<<<<<< HEAD
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
=======
            <h1 className="text-lg text-gray-500 mb-3">Contact Us</h1>
            <h1 className="text-5xl font-semibold text-gray-900 mb-4">
              Get in Touch Today
            </h1>
            <p className="text-gray-700 py-5">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat,
              ipsam praesentium a debitis ipsa amet.
            </p>
            <ul className="list-item space-y-6 pt-8">
              <li className="flex gap-5">
                <div className="flex-none bg-gray-300 p-3 shadow-sm rounded-sm">
                  <IoMailOutline className="size-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Email:</h4>
                  <p>email-us@example.com</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="flex-none bg-gray-300 p-3 shadow-sm rounded-sm">
                  <IoCallOutline className="size-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Phone Number:</h4>
                  <p>+999742 8763 2321, +7834 7384 7843</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="flex-none bg-gray-300 p-3 shadow-sm rounded-sm">
                  <IoLocationOutline className="size-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Address :</h4>
                  <p>
                    Jl. Babarsari Jl. Tambak Bayan No.2, Janti, Caturtunggal,
                    Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta
                    55281
                  </p>
                </div>
              </li>
            </ul>
          </div>
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
