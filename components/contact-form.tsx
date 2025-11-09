const ContactForm = () => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md">
      <form action="">
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <input
              type="text"
              name="name"
              className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full font-light"
              placeholder="Name"
            />
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 mt-2"></p>
            </div>
          </div>
          <div>
            <input
              type="email"
              name="email"
              className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full font-light"
              placeholder="email@example.com"
            />
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 mt-2"></p>
            </div>
          </div>
          <div className="md:col-span-2">
            <input
              type="text"
              name="subject"
              className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full font-light"
              placeholder="Subject"
            />
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 mt-2"></p>
            </div>
          </div>
          <div className="md:col-span-2">
            <textarea
              name="messgae"
              rows={5}
              className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full font-light"
              placeholder="Your Message"
            ></textarea>
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 mt-2"></p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="px-10 py-3 mt-6 text-center font-semibold text-white w-full bg-[#f64e42] rounded-md hover:bg-[#f64e42]/90 cursor-pointer"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
