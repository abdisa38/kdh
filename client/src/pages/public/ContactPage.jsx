import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  ShieldCheck,
} from 'lucide-react';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'Parent',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-school-50 text-school-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-school-100">
          <Building className="w-3.5 h-3.5" />
          <span>Contact Administration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch with Karadibayu Primary School
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          We welcome inquiries from prospective parents, current guardians, educational bureaus, and community partners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Details Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-school-950 text-white rounded-2xl p-7 border border-school-900 shadow-md space-y-6">
            <h2 className="text-lg font-bold tracking-tight border-b border-school-800 pb-3 text-gold-400">
              Campus Office Information
            </h2>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">School Campus:</span>
                  <span>Karadibayu Primary School, Kebele 01, Ethiopia</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Registrar & Administration:</span>
                  <span>+251 91 100 0000 / +251 92 200 0000</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Official Email:</span>
                  <span>info@karadibayu.edu.et</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Working Hours:</span>
                  <span>Monday - Friday: 8:00 AM - 4:30 PM (EAT)</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-school-900/60 rounded-xl border border-school-800 flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official Academic Records & Registration Office</span>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Send an Inquiry or Message
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Our administrative staff will review your message and reply promptly.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">Message Received</h3>
                <p className="text-xs text-emerald-700">
                  Thank you for reaching out to Karadibayu Primary School. We will be in touch with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Abebe Kebede"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+251 9..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Relationship to School
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                  >
                    <option value="Parent">Parent / Guardian</option>
                    <option value="Student">Current Student</option>
                    <option value="Prospective">Prospective Student / Enrollment</option>
                    <option value="Teacher">Teaching Staff Inquiry</option>
                    <option value="Other">General Community Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Message / Inquiry
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Type your message here..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-school-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-school-900 hover:bg-school-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <Send className="w-3.5 h-3.5 text-gold-400" />
                  <span>Submit Message to Office</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
