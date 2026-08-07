"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Award,
  Check,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  PartyPopper,
  PhoneCall,
  Play,
  Search,
  Star,
  X,
} from "lucide-react";

import confetti from "canvas-confetti";

import HomePackagesSection from "@/components/HomePackagesSection";
import HomeSeoContentSection from "@/components/HomeSeoContentSection";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { DjTruckArt, VintageCarArt } from "@/components/VehicleArt";
import {
  ABOUT_POINTS,
  CONTACT_DETAILS,
  GALLERY_IMAGES,
  GALLERY_VIDEOS,
  type GalleryVideo,
  TESTIMONIALS,
} from "@/lib/siteContent";
import { SITE_IMAGES } from "@/lib/siteImages";

const CONTACT_ICONS = { PhoneCall, Mail, MapPin, Clock };

const STATS = [
  { icon: PartyPopper, value: 500, suffix: "+", label: "Baraats Organized" },
  { icon: MapPin, value: 6, suffix: "", label: "Cities Covered" },
  { icon: Star, value: 4.9, suffix: "/5", label: "Average Rating" },
  { icon: Award, value: 5, suffix: " Yrs", label: "In Business" },
];

const STEPS = [
  {
    icon: Search,
    title: "Pick a Package",
    text: "Browse Raj Tilak, Rajwada, Maharaja or Signature and shortlist what fits your celebration.",
  },
  {
    icon: PhoneCall,
    title: "Share Your Details",
    text: "Send your name, event, and number - our team calls you back within hours.",
  },
  {
    icon: Palette,
    title: "Customize & Confirm",
    text: "We tailor the truck branding, dhol count, lights and effects to your baraat, then lock the date.",
  },
];

const STATEMENT_WORDS =
  "One truck. Forty dhol beats. A thousand lights. Your entry becomes the story every guest tells for years.".split(
    " "
  );

const ENQUIRY_NAMES = [
  "Priya", "Kunal", "Neha", "Arjun", "Rohan", "Sneha", "Vivek", "Ananya", "Karan", "Divya",
  "Aakash", "Pooja", "Nikhil", "Riya", "Sahil", "Kavya", "Yash", "Isha", "Dev", "Meera",
  "Raj", "Simran", "Aditya", "Tanvi", "Harsh", "Priyanka", "Manav", "Khushi", "Vikram", "Anjali",
  "Parth", "Bhavna", "Rahul", "Nisha", "Aman", "Shreya", "Dhruv", "Payal", "Kartik", "Ritika",
  "Jay", "Komal", "Nirav", "Aarti", "Sagar", "Palak", "Vishal", "Heena", "Mihir", "Foram",
  "Chirag", "Urvi", "Ronak", "Drashti", "Hardik", "Bhumi", "Krunal", "Jinal", "Mitesh", "Kruti",
  "Dhaval", "Vidhi", "Jignesh", "Priti", "Vatsal", "Trisha", "Kishan", "Namrata", "Rushabh", "Aashna",
  "Malav", "Charmi", "Deep", "Hetal", "Nakul", "Rutuja", "Om", "Falguni", "Shivam", "Vaidehi",
  "Tarun", "Zeel", "Manthan", "Sejal", "Bhargav", "Krishna", "Utsav", "Aditi", "Prakash", "Roshni",
  "Vansh", "Diya", "Aryan", "Esha", "Rutvik", "Sanjana", "Devansh", "Mansi", "Yuvraj", "Kinjal",
];

const ENQUIRY_CITIES = [
  "Ahmedabad", "Vadodara", "Surat", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar",
  "Junagadh", "Anand", "Mehsana", "Bharuch", "Navsari", "Valsad", "Vapi",
];

const ENQUIRY_INTERESTS = [
  "Raj Tilak Package", "Rajwada Package", "Maharaja Package", "Signature Package",
  "DJ Truck + Dhol", "Vintage Car Entry", "Safa Styling", "Pyro & Confetti Entry",
];

function randomEnquiryToast() {
  const name = ENQUIRY_NAMES[Math.floor(Math.random() * ENQUIRY_NAMES.length)];
  const city = ENQUIRY_CITIES[Math.floor(Math.random() * ENQUIRY_CITIES.length)];
  const interest = ENQUIRY_INTERESTS[Math.floor(Math.random() * ENQUIRY_INTERESTS.length)];
  const useMinutes = Math.random() < 0.5;
  const ago = useMinutes
    ? `${Math.floor(Math.random() * 55) + 3} mins ago`
    : `${Math.floor(Math.random() * 5) + 1} hr${Math.random() < 0.5 ? "" : "s"} ago`;
  return { name, city, ago, interest };
}

const WHATSAPP_FLOAT_MESSAGE = encodeURIComponent(
  "Hi PlanMyBaraat, I am planning a baraat and would like to know more about your packages, pricing, and availability."
);

const WHATSAPP_FLOAT_URL = `https://wa.me/919089081111?text=${WHATSAPP_FLOAT_MESSAGE}`;

function CountUp({
  value,
  suffix,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = latest.toFixed(decimals) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, decimals]);

  return <span ref={ref}>0{suffix}</span>;
}

function fireCelebration() {
  confetti({
    particleCount: 70,
    spread: 68,
    origin: { y: 0.75 },
    colors: ["#9F1239", "#D4B06A", "#F8F4EE"],
  });
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[#9F1239]"
    />
  );
}

function WhatsAppFloat() {
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowPreview(true), 10000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      <AnimatePresence>
        {showPreview ? (
          <motion.a
            href={WHATSAPP_FLOAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 24, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.96 }}
            transition={{ duration: 0.45, ease: easeReveal }}
            className="hidden max-w-[220px] rounded-[20px] border border-black/10 bg-[#f8f4ee]/90 px-4 py-3 text-xs font-medium leading-relaxed text-black/70 shadow-[0_20px_45px_rgba(0,0,0,0.08)] backdrop-blur-xl md:block"
          >
            Planning a baraat? Ask us anything 👋
          </motion.a>
        ) : null}
      </AnimatePresence>

      <a
        href={WHATSAPP_FLOAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-300 hover:scale-110"
      >
        <motion.span
          animate={{ scale: [1, 1.7], opacity: [0.45, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[#25D366]"
        />
        <MessageCircle className="relative h-6 w-6 fill-white text-white" />
      </a>
    </div>
  );
}

function RecentlyEnquiredToast() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [item, setItem] = useState(() => randomEnquiryToast());

  useEffect(() => {
    const showTimer = window.setTimeout(() => setVisible(true), 25000);
    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible || dismissed) return;
    const interval = window.setInterval(() => {
      setItem(randomEnquiryToast());
    }, 20000);
    return () => window.clearInterval(interval);
  }, [visible, dismissed]);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block">
      <AnimatePresence mode="wait">
        {visible ? (
          <motion.div
            key={`${item.name}-${item.city}-${item.ago}`}
            initial={{ opacity: 0, x: -28, y: 14 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -18, y: 10 }}
            transition={{ duration: 0.45, ease: easeReveal }}
            className="relative w-[210px] rounded-[16px] border border-black/10 bg-[#f8f4ee]/92 p-3 pr-6 text-black shadow-[0_16px_36px_rgba(0,0,0,0.08)] backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black/70"
            >
              <X className="h-3 w-3" />
            </button>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#9F1239]">
              Recently Enquired
            </span>
            <p className="mt-1.5 text-xs font-semibold leading-snug text-black/80">
              {item.name} from {item.city} enquired {item.ago}
            </p>
            <p className="mt-0.5 text-[10px] text-black/55">{item.interest}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ScrollHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.7], [1, 1.4]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.7], [0, -60]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.35]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.45]);
  const subOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0]);
  const badgeY = useTransform(scrollYProgress, [0, 0.15], [0, -90]);
  const badgeScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.7]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <motion.div style={{ scale: bgScale, opacity: bgOpacity }} className="absolute inset-0">
          <Image
            src={SITE_IMAGES.heroFloral}
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>

        <motion.div
          style={{
            opacity: badgeOpacity,
            y: badgeY,
            scale: badgeScale,
            textShadow: "0 4px 18px rgba(0,0,0,0.45)",
          }}
          className="relative z-10 mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-black/20 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm md:text-[11px]"
        >
          <Award className="h-3.5 w-3.5" />
          <span>Gujarat&apos;s Trusted Baraat Specialists</span>
        </motion.div>

        <motion.h1
          style={{
            scale: titleScale,
            opacity: titleOpacity,
            y: titleY,
            textShadow: "0 10px 30px rgba(0,0,0,0.38), 0 3px 12px rgba(0,0,0,0.45)",
          }}
          className="relative z-10 px-4 text-center font-serif text-5xl font-black leading-[1.05] tracking-wide text-white sm:text-6xl md:text-8xl"
        >
          Your Baraat.
          <br />
          <span className="text-[#f2d9a6]">Royally Reimagined.</span>
        </motion.h1>

        <motion.p
          style={{ opacity: subOpacity, textShadow: "0 4px 18px rgba(0,0,0,0.42)" }}
          className="relative z-10 mx-auto mt-8 max-w-lg px-6 text-center text-sm leading-relaxed text-white md:text-base"
        >
          Double-decker DJ trucks, dhol, pyro, vintage cars and safa teams -
          assembled into four ready-made packages.
        </motion.p>

        <motion.div style={{ opacity: subOpacity }} className="relative z-10 mt-8">
          <a
            href="#packages"
            onClick={fireCelebration}
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#9F1239] px-8 text-xs font-extrabold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#7d0f2d]"
          >
            <MessageCircle className="h-4 w-4" />
            Explore Packages
          </a>
        </motion.div>

        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="mx-auto h-9 w-5 rounded-full border border-white/40"
          >
            <div className="mx-auto mt-1.5 h-2 w-0.5 rounded bg-white/55" />
          </motion.div>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-white/60">
            Scroll
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function HeroLeadFormSection() {
  return (
    <section className="relative bg-[#1c1917] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-xl flex-col items-center">
        <h2 className="text-center font-serif text-2xl font-black tracking-wide text-white sm:text-3xl">
          Plan Your Baraat. Get a Free Quote Instantly.
        </h2>
        <p className="mt-3 text-center text-sm text-white/60">
          Tell us what you need and we&apos;ll reply on WhatsApp within 2 hours.
        </p>
        <div className="mt-8 w-full">
          <LeadCaptureForm variant="hero" />
        </div>
      </div>
    </section>
  );
}

function StatementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.35"],
  });

  return (
    <section ref={ref} className="relative h-[140vh] bg-[#f3eee6]">
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <p className="mx-auto max-w-4xl text-center font-serif text-3xl font-black leading-snug tracking-wide sm:text-4xl md:text-6xl">
          {STATEMENT_WORDS.map((word, i) => (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[i / STATEMENT_WORDS.length, (i + 1) / STATEMENT_WORDS.length]}
            >
              {word}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const highlight = children === "story" || children === "entry";
  return (
    <motion.span
      style={{ opacity }}
      className={`mr-[0.28em] inline-block ${highlight ? "text-[#9F1239]" : "text-black/25"}`}
    >
      {children}
    </motion.span>
  );
}

function ParallaxImage({
  src,
  alt,
  speed = 0.15,
  className = "",
}: {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-[-18%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  );
}

const easeReveal = [0.16, 1, 0.3, 1] as const;

function CharReveal({
  text,
  className = "",
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h2" | "p";
}) {
  const MotionTag = Tag === "h2" ? motion.h2 : motion.p;
  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ visible: { transition: { staggerChildren: 0.028 } } }}
      aria-label={text}
      className={className}
    >
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          variants={{
            hidden: { opacity: 0, y: "0.7em", rotate: 4 },
            visible: {
              opacity: 1,
              y: 0,
              rotate: 0,
              transition: { duration: 0.55, ease: easeReveal },
            },
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </MotionTag>
  );
}

function InkFillLine({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.4"],
  });
  const clipPath = useTransform(scrollYProgress, [0, 1], [
    "inset(0 100% 0 0)",
    "inset(0 0% 0 0)",
  ]);

  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="relative inline-block">
        <p className="font-serif text-3xl font-black leading-tight tracking-wide text-black/15 sm:text-5xl md:text-6xl">
          {text}
        </p>
        <motion.p
          style={{ clipPath }}
          aria-hidden
          className="absolute inset-0 font-serif text-3xl font-black leading-tight tracking-wide text-[#9F1239] sm:text-5xl md:text-6xl"
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
}

export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: easeReveal }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GalleryParallax() {
  const [activeVideo, setActiveVideo] = useState<GalleryVideo | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yLeft = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yRight = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const left = GALLERY_IMAGES.slice(0, 3);
  const right = GALLERY_IMAGES.slice(3, 5);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-4 md:gap-6">
      <motion.div style={{ y: yLeft }} className="space-y-4 md:space-y-6">
        {left.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-[4/5] overflow-hidden border border-black/10"
          >
            <Image
              src={image.src}
              alt={image.label}
              fill
              className="object-cover grayscale-[0.3] saturate-[0.82] transition duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:saturate-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white">
              {image.label}
            </span>
          </div>
        ))}
      </motion.div>

      <motion.div style={{ y: yRight }} className="space-y-4 pt-10 md:space-y-6 md:pt-16">
        {right.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-[4/5] overflow-hidden border border-black/10"
          >
            <Image
              src={image.src}
              alt={image.label}
              fill
              className="object-cover grayscale-[0.3] saturate-[0.82] transition duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:saturate-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white">
              {image.label}
            </span>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setActiveVideo(GALLERY_VIDEOS[0])}
          className="group relative aspect-[4/5] overflow-hidden border border-black/10 bg-[#F7F7F7] text-left"
        >
          <Image
            src={GALLERY_VIDEOS[0].thumb}
            alt={GALLERY_VIDEOS[0].label}
            fill
            className="object-cover opacity-50 grayscale-[0.25] saturate-[0.85] transition duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:saturate-100"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9F1239]"
            >
              <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
            </motion.div>
          </div>
          <span className="absolute right-3 top-3 bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white">
            {GALLERY_VIDEOS[0].duration}
          </span>
          <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white">
            {GALLERY_VIDEOS[0].label}
          </span>
        </button>
      </motion.div>

      {activeVideo ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-[24px] bg-black shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <span className="sr-only">Close video</span>
              <X className="h-4 w-4" />
            </button>
            <video
              key={activeVideo.src}
              src={activeVideo.src}
              poster={activeVideo.thumb}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function VehicleParade() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center 0.55"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 18 });
  const carX = useTransform(smooth, [0, 1], ["-90%", "0%"]);
  const truckX = useTransform(smooth, [0, 1], ["90%", "0%"]);
  const labelOpacity = useTransform(smooth, [0.75, 1], [0, 1]);

  return (
    <section ref={ref} className="overflow-hidden border-b border-black/10 bg-[#F8F4EE] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-1 pb-10 text-center">
          <FadeUp>
            <span className="block text-[9px] font-bold uppercase tracking-widest text-[#9F1239]">
              The Fleet
            </span>
          </FadeUp>
          <CharReveal
            text="They Arrive. Everyone Notices."
            className="font-serif text-2xl font-black tracking-wide text-black md:text-4xl"
          />
        </div>

        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-2 md:gap-6">
          <div>
            <motion.div style={{ x: carX }} className="will-change-transform">
              <VintageCarArt className="mx-auto w-full max-w-md" />
            </motion.div>
            <motion.p
              style={{ opacity: labelOpacity }}
              className="pt-4 text-center text-[10px] font-bold uppercase tracking-widest text-black/50"
            >
              Vintage Car Entry
            </motion.p>
          </div>

          <div>
            <motion.div style={{ x: truckX }} className="will-change-transform">
              <DjTruckArt className="mx-auto w-full max-w-lg" />
            </motion.div>
            <motion.p
              style={{ opacity: labelOpacity }}
              className="pt-4 text-center text-[10px] font-bold uppercase tracking-widest text-black/50"
            >
              Double-Decker DJ Truck
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-20 sm:px-6 lg:px-8">
      <div className="space-y-1 text-center">
        <FadeUp>
            <span className="block text-[9px] font-bold uppercase tracking-widest text-[#9F1239]">
              Simple Process
            </span>
        </FadeUp>
        <CharReveal
          text="How It Works"
          className="font-serif text-2xl font-black tracking-wide text-black md:text-4xl"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: easeReveal }}
            whileHover={{ y: -6 }}
            className="relative rounded-[28px] border border-black/10 bg-white/70 p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
          >
            <span className="absolute -left-2 -top-4 font-serif text-5xl font-black text-black/5">
              0{index + 1}
            </span>
            <div className="relative z-10 mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#9F1239]/20 text-[#9F1239]">
              <step.icon className="h-5 w-5" />
            </div>
            <h3 className="relative z-10 font-serif text-lg font-black text-black">
              {step.title}
            </h3>
            <p className="relative z-10 mt-2 text-xs leading-relaxed text-black/50">
              {step.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CtaBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="relative h-[300px] md:h-[380px]">
        <motion.div style={{ scale }} className="absolute inset-0">
          <Image src={SITE_IMAGES.ctaBanner} alt="Book your baraat celebration" fill className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,12,11,0.78),rgba(16,12,11,0.45),rgba(16,12,11,0.28))]" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <FadeUp className="space-y-2 text-center md:text-left">
              <motion.h2
                initial={{ letterSpacing: "0.3em", opacity: 0 }}
                whileInView={{ letterSpacing: "0.02em", opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.1, ease: easeReveal }}
                className="font-serif text-2xl font-black text-white md:text-4xl"
              >
                Ready to Plan Your Baraat?
              </motion.h2>
              <p className="text-xs text-white/75 md:text-sm">
                Tell us your name, event, and number - we&apos;ll take it from there.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <a
                href="#packages"
                className="mx-auto inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#9F1239] px-8 text-xs font-extrabold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#7d0f2d] md:mx-0"
              >
                <MessageCircle className="h-4 w-4" />
                Enquire Now
              </a>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeClient() {
  return (
    <div className="flex-grow">
      <ScrollProgressBar />
      <WhatsAppFloat />
      <RecentlyEnquiredToast />

      <ScrollHero />

      <HeroLeadFormSection />

      <StatementSection />

      <VehicleParade />

      <section className="border-y border-black/10 bg-white/55">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {STATS.map((stat, index) => (
            <FadeUp
              key={index}
              delay={index * 0.1}
              className="rounded-[24px] border border-black/8 bg-white/75 px-4 py-6 text-center shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#9F1239]/20 text-[#9F1239]">
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="font-serif text-2xl font-black text-black md:text-3xl">
                <CountUp
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={Number.isInteger(stat.value) ? 0 : 1}
                />
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">
                {stat.label}
              </span>
            </FadeUp>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8"
      >
        <FadeUp className="order-2 lg:order-1">
          <ParallaxImage
            src={SITE_IMAGES.goldCrownMoment}
            alt="PlanMyBaraat team at a wedding celebration"
            speed={0.12}
            className="h-[300px] overflow-hidden rounded-[30px] border border-black/10 shadow-[0_24px_60px_rgba(0,0,0,0.06)] sm:h-[380px] lg:h-[440px]"
          />
        </FadeUp>

        <FadeUp delay={0.15} className="order-1 space-y-6 lg:order-2">
          <span className="block text-[9px] font-bold uppercase tracking-widest text-[#9F1239]">
            About Us
          </span>
          <CharReveal
            text="Gujarat's Trusted Name in Baraat Celebrations"
            className="font-serif text-2xl font-black tracking-wide text-black md:text-4xl"
          />
          <p className="text-sm leading-relaxed text-black/60">
            PlanMyBaraat by Ronak brings together everything a groom&apos;s entry
            needs - double-decker DJ trucks, vintage cars, dhol artists, pyro
            effects, and safa teams - under one roof, so families can focus on
            celebrating instead of coordinating five different vendors.
          </p>
          <ul className="space-y-3">
            {ABOUT_POINTS.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: easeReveal }}
                className="flex items-start gap-3 text-xs text-black/70"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9F1239]" />
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>
        </FadeUp>
      </section>

      <StepsSection />

      <InkFillLine text="Four packages. One unforgettable entry." />

      <HomePackagesSection />

      <HomeSeoContentSection />

      <section id="gallery" className="mx-auto max-w-7xl space-y-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-1 text-center">
          <FadeUp>
            <span className="block text-[9px] font-bold uppercase tracking-widest text-[#9F1239]">
              Moments We Love
            </span>
          </FadeUp>
          <CharReveal
            text="From Real Celebrations"
            className="font-serif text-2xl font-black tracking-wide text-black md:text-4xl"
          />
        </div>

        <GalleryParallax />

        <FadeUp className="text-center">
          <a
            href="/gallery"
            className="inline-flex h-12 items-center gap-2.5 rounded-full border border-black/20 px-8 text-xs font-extrabold uppercase tracking-widest text-black transition-all duration-300 hover:border-[#9F1239]/40 hover:text-[#9F1239]"
          >
            View Full Gallery
          </a>
        </FadeUp>
      </section>

      <section id="testimonials" className="mx-auto max-w-7xl space-y-8 px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-1 text-center">
          <FadeUp>
            <span className="block text-[9px] font-bold uppercase tracking-widest text-[#9F1239]">
              What Families Say
            </span>
          </FadeUp>
          <CharReveal
            text="Testimonials"
            className="font-serif text-2xl font-black tracking-wide text-black md:text-4xl"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 48, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.12, ease: easeReveal }}
              className="relative flex flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white/72 p-8 text-center shadow-[0_16px_40px_rgba(0,0,0,0.05)]"
            >
              <div className="mb-4 flex items-center justify-center gap-1 text-[#9F1239]">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="flex-1 font-serif text-xs italic leading-relaxed text-black/80 md:text-sm">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-5 text-[10px] font-bold uppercase tracking-widest text-[#9F1239]">
                {testimonial.name} • {testimonial.place}
              </div>
            </motion.div>
          ))}
        </div>

        <FadeUp className="text-center">
          <a
            href="/testimonials"
            className="inline-flex h-12 items-center gap-2.5 rounded-full border border-black/20 px-8 text-xs font-extrabold uppercase tracking-widest text-black transition-all duration-300 hover:border-[#9F1239]/40 hover:text-[#9F1239]"
          >
            View All Testimonials
          </a>
        </FadeUp>
      </section>

      <section id="contact" className="mx-auto max-w-7xl space-y-10 px-4 py-20 sm:px-6 lg:px-8">
        <FadeUp className="space-y-1 text-center">
          <span className="block text-[9px] font-bold uppercase tracking-widest text-[#9F1239]">
            Get In Touch
          </span>
          <CharReveal
            text="Contact Us"
            className="font-serif text-2xl font-black tracking-wide text-black md:text-4xl"
          />
          <p className="mx-auto max-w-2xl pt-2 text-xs text-black/50 md:text-sm">
            Have a question before you enquire? Reach us directly - we usually reply
            within minutes on WhatsApp.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CONTACT_DETAILS.map((contact, index) => {
            const Icon = CONTACT_ICONS[contact.iconName];
            return (
              <FadeUp
                key={index}
                delay={index * 0.1}
                className="space-y-3 rounded-[24px] border border-black/10 bg-white/72 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.05)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#9F1239]/20 text-[#9F1239]">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-black/40">
                  {contact.label}
                </span>
                {"href" in contact ? (
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs leading-relaxed text-black/80 transition-colors hover:text-[#9F1239]"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <p className="text-xs leading-relaxed text-black/80">{contact.value}</p>
                )}
              </FadeUp>
            );
          })}
        </div>

        <FadeUp className="text-center">
          <a
            href={WHATSAPP_FLOAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#9F1239] px-8 text-xs font-extrabold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#7d0f2d]"
          >
            <MessageCircle className="h-4 w-4" />
            Chat With Us on WhatsApp
          </a>
        </FadeUp>
      </section>

      <CtaBanner />
    </div>
  );
}
