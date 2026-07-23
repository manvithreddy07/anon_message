'use client';
import { Mail } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay";
import messages from '@/messages.json';
import { Globe3D, GlobeMarker } from "@/components/ui/3d-globe";
import { MessageCircle} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import { GithubIcon } from '@/components/ui/github';
import { LinkedinIcon } from '@/components/ui/linkedin';
import Link from 'next/link';


// Sample markers
const sampleMarkers: GlobeMarker[] = [
  {
    lat: 40.7128,
    lng: -74.006,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "New York",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "London",
  },
  {
    lat: 28.6139,
    lng: 77.209,
    src: "https://assets.aceternity.com/avatars/6.webp",
    label: "New Delhi",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    src: "https://assets.aceternity.com/avatars/3.webp",
    label: "Tokyo",
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    src: "https://assets.aceternity.com/avatars/12.webp",
    label: "Singapore",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Main Content */}
    <main className="relative overflow-hidden bg-linear-to-br from-slate-950 via-gray-900 to-black text-white">
      {/* Background Glow */}
      <div className="absolute left-20 top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute right-20 bottom-20 h-80 w-80 rounded-full bg-blue-600/20 blur-[150px]" />

      <div className="relative z-10 mx-auto grid min-h-screen pt-24 max-w-7xl grid-cols-1 items-center gap-11 px-6 py-12 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="max-w-2xl space-y-8">
          <div>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
              🔒 100% Anonymous Messaging
            </span>
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
              <span className="whitespace-nowrap">
                Dive into the World of
              </span>
              <span className="block bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Anonymous Messages
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-gray-300">
              Send honest thoughts, receive authentic feedback, and connect
              freely while your identity remains completely private.
            </p>
          </div>
          {/* Carousel */}
          <Carousel
            plugins={[
              Autoplay({
                delay: 1800,
              }),
            ]}
            className="w-full max-w-xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                      <div className="rounded-full bg-cyan-500/20 p-3">
                        <Mail className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-gray-200">
                          {message.content}
                        </p>
                        <p className="mt-3 text-xs text-gray-400">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="relative h-162.5 w-162.5 translate-x-20">
            <Globe3D
              className="h-full w-full"
              markers={sampleMarkers}
              config={{
                atmosphereColor: "#38bdf8",
                atmosphereIntensity: 20,
                bumpScale: 6,
                autoRotateSpeed: 1,
              }}
              onMarkerClick={(marker) => {
                console.log(marker.label);
              }}
            />
          </div>
        </div>
      </div>
    </main>

      {/* Footer */}
    <footer className="border-t border-white/10 bg-linear-to-b from-slate-950 to-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 md:flex-row max-h-1.5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">
              Anon<span className="text-cyan-400">Message</span>  
            </h3>
            <p className="text-sm text-gray-400">
              Anonymous Feedback Platform
            </p>
          </div>
        </div>
        {/* Navigation */}
        <div className="flex gap-8 text-xm text-gray-400">
          <Link href="/" className="transition hover:text-cyan-400">
            Home
          </Link>
          <Link href="/sign-in" className="transition hover:text-cyan-400">
            Login
          </Link>
          <Link href="/sign-up" className="transition hover:text-cyan-400">
            Register
          </Link>
        </div>
        {/* Social Icons */}
        <div className="flex gap-8 text-gray-400">
          <Link href="https://github.com/manvithreddy07/anon_message" target="_blank">
            <GithubIcon  className="h-5 w-5 cursor-pointer transition hover:text-cyan-400" />
          </Link>
          <Link href="https://linkedin.com/" target="_blank">
            <LinkedinIcon className="h-5 w-5 cursor-pointer transition hover:text-cyan-400" />
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-gray-500">
        © 2026 AnonMessage. All rights reserved.
      </div>
    </footer>
    </>
  );
}