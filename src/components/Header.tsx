"use client";

import React from 'react';
import Link from 'next/link';
import { HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#doctors', label: 'Doctors' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#appointments', label: 'My Appointments' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="#home" className="mr-6 flex items-center space-x-2">
            <HeartHandshake className="h-6 w-6 text-primary" />
            <span className="font-bold">Serene Appointments</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button asChild>
            <Link href="#doctors">Book Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
