import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Find a HairsUp Store Near You',
  description: '50+ HairsUp experience centres across India. Book a free in-store consultation with our certified hair specialists.',
};

const STORES = [
  { id: '1', name: 'HairsUp Mumbai Flagship', area: 'Lower Parel', address: 'Ground Floor, Phoenix Palladium, Senapati Bapat Marg, Lower Parel', city: 'Mumbai', state: 'Maharashtra', pincode: '400013', phone: '+91 98765 43210', email: 'mumbai@hairsup.com', hours: 'Mon–Sun: 10 AM – 10 PM', services: ['Wig Fitting', 'Custom Orders', 'Hair Analysis', 'Virtual Try-On Station'], isflagship: true },
  { id: '2', name: 'HairsUp Delhi Select', area: 'Saket', address: 'Level 2, Select Citywalk Mall, Press Enclave Marg, Saket', city: 'New Delhi', state: 'Delhi', pincode: '110017', phone: '+91 98765 43211', email: 'delhi@hairsup.com', hours: 'Mon–Sun: 10 AM – 9:30 PM', services: ['Wig Fitting', 'Custom Orders', 'Hair Analysis'], isflagship: true },
  { id: '3', name: 'HairsUp Bangalore Forum', area: 'Koramangala', address: 'Forum Mall, Hosur Road, Koramangala 5th Block', city: 'Bangalore', state: 'Karnataka', pincode: '560095', phone: '+91 98765 43212', email: 'bangalore@hairsup.com', hours: 'Mon–Sun: 10 AM – 9 PM', services: ['Wig Fitting', 'Custom Orders', 'Hair Analysis', 'Virtual Try-On Station'], isflagship: true },
  { id: '4', name: 'HairsUp Chennai Express', area: 'T. Nagar', address: 'Spencer Plaza Mall, Anna Salai, T. Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600002', phone: '+91 98765 43213', email: 'chennai@hairsup.com', hours: 'Mon–Sun: 10:30 AM – 9 PM', services: ['Wig Fitting', 'Consultations'], isflagship: false },
  { id: '5', name: 'HairsUp Hyderabad Nexus', area: 'Banjara Hills', address: 'Nexus Mall, Road No. 2, Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034', phone: '+91 98765 43214', email: 'hyderabad@hairsup.com', hours: 'Mon–Sun: 10 AM – 9 PM', services: ['Wig Fitting', 'Custom Orders', 'Hair Analysis'], isflagship: false },
  { id: '6', name: 'HairsUp Pune Amanora', area: 'Hadapsar', address: 'Amanora Mall, Hadapsar, Pune', city: 'Pune', state: 'Maharashtra', pincode: '411028', phone: '+91 98765 43215', email: 'pune@hairsup.com', hours: 'Mon–Sun: 10 AM – 9:30 PM', services: ['Wig Fitting', 'Consultations', 'Hair Analysis'], isflagship: false },
  { id: '7', name: 'HairsUp Ahmedabad Alpha', area: 'SG Highway', address: 'Alpha One Mall, SG Highway, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015', phone: '+91 98765 43216', email: 'ahmedabad@hairsup.com', hours: 'Mon–Sun: 10 AM – 9 PM', services: ['Wig Fitting', 'Consultations'], isflagship: false },
  { id: '8', name: 'HairsUp Kolkata South', area: 'South City', address: 'South City Mall, 375 Prince Anwar Shah Road', city: 'Kolkata', state: 'West Bengal', pincode: '700068', phone: '+91 98765 43217', email: 'kolkata@hairsup.com', hours: 'Mon–Sun: 10 AM – 9 PM', services: ['Wig Fitting', 'Custom Orders', 'Hair Analysis'], isflagship: false },
];

const CITIES = ['All Cities', 'Mumbai', 'New Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Kolkata'];

export default function StoresPage() {
  return (
    <div>
      {/* Hero */}
      <div className="page-hero py-14 text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Find a HairsUp Store
          </h1>
          <p className="text-white/75 text-lg mb-6">
            Visit any of our 50+ experience centres for a personalised wig consultation — completely free.
          </p>
          <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> 50+ Cities</span>
            <span>·</span>
            <span>Free Consultations</span>
            <span>·</span>
            <span>Expert Specialists</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* City filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {CITIES.map((city) => (
            <button
              key={city}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${city === 'All Cities' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400'}`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Flagship stores */}
        <div className="mb-10">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">★</span>
            </span>
            Flagship Experience Centres
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {STORES.filter((s) => s.isflagship).map((store) => (
              <div key={store.id} className="card p-6 border-2 border-brand-100 hover:border-brand-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-bold text-gray-900">{store.name}</h3>
                    <p className="text-brand-600 text-xs font-semibold">{store.area}</p>
                  </div>
                  <span className="badge bg-brand-600 text-white text-xs">Flagship</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs">{store.address}, {store.city} — {store.pincode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                    <a href={`tel:${store.phone}`} className="text-xs hover:text-brand-600 transition-colors">{store.phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                    <span className="text-xs">{store.hours}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {store.services.map((s) => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(store.address + ', ' + store.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 btn-primary text-xs py-2"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Get Directions
                  </a>
                  <a href={`tel:${store.phone}`} className="flex items-center justify-center gap-1.5 btn-secondary text-xs py-2 px-3">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other stores */}
        <div>
          <h2 className="text-xl font-display font-bold text-gray-900 mb-5">All Stores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STORES.map((store) => (
              <div key={store.id} className="card p-5 hover:shadow-product-hover transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{store.name}</h3>
                    <p className="text-xs text-gray-500">{store.city}, {store.state}</p>
                  </div>
                  {store.isflagship && <span className="badge bg-brand-100 text-brand-700 text-xs">Flagship</span>}
                </div>
                <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                  <div className="flex items-start gap-1.5"><MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />{store.address.slice(0, 50)}…</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{store.hours.split(':')[0] + '…'}</div>
                  <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" />
                    <a href={`tel:${store.phone}`} className="hover:text-brand-600">{store.phone}</a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(store.address + ', ' + store.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-xs btn-primary py-1.5"
                  >
                    Directions
                  </a>
                  <a href={`mailto:${store.email}`} className="text-xs btn-secondary py-1.5 px-3 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consultation CTA */}
        <div className="mt-12 bg-brand-50 rounded-3xl p-10 text-center border border-brand-100">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Book a Free In-Store Consultation</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Our certified trichologists will assess your hair type, recommend the best wig or hair system,
            and help you with a professional fitting — all completely free.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="tel:+911800hairsup" className="btn-primary flex items-center gap-2">
              <Phone className="w-4 h-4" /> Call to Book
            </a>
            <a href="mailto:hello@hairsup.com" className="btn-secondary flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
