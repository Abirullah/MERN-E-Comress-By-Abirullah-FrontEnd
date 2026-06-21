import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Add your form submission logic here
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <section className="w-full bg-[#080808] py-20 px-6 border-t border-[#1e1e1e]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4a544] mb-4">
            Get In Touch
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-[#ddd4be]">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-[#d4a544] mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* LEFT SIDE - CONTACT INFO & FORM */}
          <div className="bg-[#0e0e0e] border border-[#1e1e1e] rounded-3xl p-8 md:p-10 hover:border-[#d4a544]/20 transition-all duration-500">
            <h2 className="text-3xl font-bold text-[#ddd4be] mb-3">
              Let's Talk
            </h2>

            <p className="text-[#6b6666] text-sm leading-relaxed mb-10">
              Have a project idea or want to work together? 
              Send us a message and we'll get back to you.
            </p>

            {/* Contact Details */}
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#1e1e1e] group-hover:border-[#d4a544]/30 group-hover:bg-[#d4a544]/5 transition-all duration-300">
                  <Mail size={20} className="text-[#d4a544]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#ddd4be] mb-1">Email</h3>
                  <p className="text-[#6b6666] text-sm">hello@example.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#1e1e1e] group-hover:border-[#d4a544]/30 group-hover:bg-[#d4a544]/5 transition-all duration-300">
                  <Phone size={20} className="text-[#d4a544]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#ddd4be] mb-1">Phone</h3>
                  <p className="text-[#6b6666] text-sm">+92 300 1234567</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#1e1e1e] group-hover:border-[#d4a544]/30 group-hover:bg-[#d4a544]/5 transition-all duration-300">
                  <MapPin size={20} className="text-[#d4a544]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#ddd4be] mb-1">Address</h3>
                  <p className="text-[#6b6666] text-sm">Islamabad, Pakistan</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  required
                  className="w-full rounded-xl border border-[#1e1e1e] bg-[#1a1a1a] px-4 py-3.5 text-sm text-[#ddd4be] outline-none placeholder:text-[#5a5a5a] transition-all duration-200 focus:border-[#d4a544]/50 focus:ring-4 focus:ring-[#d4a544]/5"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                  className="w-full rounded-xl border border-[#1e1e1e] bg-[#1a1a1a] px-4 py-3.5 text-sm text-[#ddd4be] outline-none placeholder:text-[#5a5a5a] transition-all duration-200 focus:border-[#d4a544]/50 focus:ring-4 focus:ring-[#d4a544]/5"
                />
              </div>

              <div>
                <textarea
                  rows="5"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange("message")}
                  required
                  className="w-full rounded-xl border border-[#1e1e1e] bg-[#1a1a1a] px-4 py-3.5 text-sm text-[#ddd4be] outline-none placeholder:text-[#5a5a5a] resize-none transition-all duration-200 focus:border-[#d4a544]/50 focus:ring-4 focus:ring-[#d4a544]/5"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#d4a544] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#080808] transition-all duration-300 hover:bg-[#c19a3e] hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#d4a544]/20 shadow-lg shadow-[#d4a544]/10 hover:shadow-xl hover:shadow-[#d4a544]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT SIDE - MAP */}
          <div className="w-full h-[600px] lg:h-[700px] rounded-3xl overflow-hidden border border-[#1e1e1e] shadow-2xl relative group">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              title="map"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://maps.google.com/maps?q=Islamabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="grayscale contrast-125 brightness-50 group-hover:brightness-75 transition-all duration-500"
            ></iframe>
            
            {/* Overlay Badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#0e0e0e]/95 backdrop-blur-md border border-[#1e1e1e] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d4a544]/10 border border-[#d4a544]/20">
                  <MapPin size={18} className="text-[#d4a544]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#ddd4be]">
                    Our Location
                  </p>
                  <p className="text-[11px] text-[#6b6666] mt-0.5">
                    Islamabad, Pakistan
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Contact;