function Contact() {
  return (
    <section className="w-full  py-20 px-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
    
    {/* LEFT SIDE - CONTACT INFO */}
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
      <h2 className="text-4xl font-bold mb-4">
        Contact Us
      </h2>

      <p className="text-gray-400 mb-8">
        Have a project idea or want to work together? 
        Send us a message and we&apos;ll get back to you.
      </p>

      <div className="space-y-6">
        
        {/* Email */}
        <div>
          <h3 className="text-lg font-semibold mb-1">Email</h3>
          <p className="text-gray-400">hello@example.com</p>
        </div>

        {/* Phone */}
        <div>
          <h3 className="text-lg font-semibold mb-1">Phone</h3>
          <p className="text-gray-400">+92 300 1234567</p>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-semibold mb-1">Address</h3>
          <p className="text-gray-400">
            Islamabad, Pakistan
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <form className="mt-10 space-y-5">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border border-black/30 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full  border border-black/30 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
        />

        <textarea
          rows="5"
          placeholder="Your Message"
          className="w-full  border border-black/30 rounded-xl px-4 py-3 outline-none focus:border-purple-500 resize-none"
        ></textarea>

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition duration-300"
        >
          Send Message
        </button>
      </form>
    </div>

    {/* RIGHT SIDE - MAP */}
    <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        title="map"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src="https://maps.google.com/maps?q=Islamabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
        className="grayscale contrast-125"
      ></iframe>
    </div>

  </div>
</section>
  )
}

export default Contact
