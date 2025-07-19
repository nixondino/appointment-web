import { HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contact" className="bg-primary/20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <HeartHandshake className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary-foreground">Serene Appointments</span>
            </div>
            <p className="text-muted-foreground text-center md:text-left">Your health, our priority. Providing seamless healthcare access.</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground">Contact Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>123 Health St, Wellness City, 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>contact@sereneappointments.com</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
             <h3 className="text-lg font-semibold text-primary-foreground">Operating Hours</h3>
             <ul className="space-y-2 text-muted-foreground">
                <li>Monday - Friday: 9:00 AM - 5:00 PM</li>
                <li>Saturday: 10:00 AM - 2:00 PM</li>
                <li>Sunday: Closed</li>
             </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Serene Appointments. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
