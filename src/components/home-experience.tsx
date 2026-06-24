"use client";

import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Car,
  Check,
  ChevronRight,
  Mail,
  MapPin,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FormEvent, useMemo, useState } from "react";
import { makerCategories, makers, type Maker } from "@/data/makers";
import { db, firebaseReady } from "@/lib/firebase";
import { CircleMark, Wordmark } from "@/components/brand";

const heroImages = [
  ["/media/makers/kd-poratoe/kd-poratoe-3026.jpg", "Zimbabwean patterned textile bags by KD Poratoe"],
  ["/media/makers/kd-poratoe/kd-poratoe-3024.jpg", "Black and white Zimbabwean textile"],
  ["/media/makers/brendas-exquisite-crochets/brendas-exquisite-crochets-3040.jpg", "Crocheted basket by Brendas Exquisite Crochets"],
  ["/media/makers/highlands-trading/highlands-trading-3044.jpg", "Handmade ceramics by Highlands Trading"],
  ["/media/makers/lwiindi-group/lwiindi-group-3035.jpg", "Handwoven Binga basket by Lwiindi Group"],
  ["/media/makers/fineweave/fineweave-3133.jpg", "Woven rugs by Fineweave"],
] as const;

const storyRail = [
  ["/media/makers/fineweave/fineweave-3132.jpg", "Woven textiles"],
  ["/media/makers/highlands-trading/highlands-trading-3043.jpg", "Zimbabwean ceramics"],
  ["/media/makers/kd-poratoe/kd-poratoe-3024.jpg", "Printed Zimbabwean fabric"],
  ["/media/makers/two-zebra/two-zebra-3033.jpg", "Recycled aluminium sculpture"],
  ["/media/makers/glass-precisions/glass-precisions-3047.jpg", "Frosted glassware"],
  ["/media/makers/humble-hides/humble-hides-3131.jpg", "Handmade leather product"],
  ["/media/makers/brendas-exquisite-crochets/brendas-exquisite-crochets-3041.jpg", "Crochet work"],
] as const;

function MakerImage({
  maker,
  sizes,
  priority = false,
}: {
  maker: Maker;
  sizes: string;
  priority?: boolean;
}) {
  const src = maker.images[0];

  if (!src) {
    return (
      <div className={`maker-fallback maker-fallback--${maker.category.toLowerCase()}`}>
        <CircleMark />
        <span>{maker.brand}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${maker.brand} — ${maker.craft}`}
      className={maker.id === "once-upon-a-time" ? "object-contain" : undefined}
      fill
      sizes={sizes}
      priority={priority}
    />
  );
}

export default function HomeExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<(typeof makerCategories)[number]>("All");
  const [selectedMaker, setSelectedMaker] = useState<Maker | null>(null);
  const [formState, setFormState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const filteredMakers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return makers.filter((maker) => {
      const categoryMatch = category === "All" || maker.category === category;
      const searchMatch =
        !query ||
        [
          maker.brand,
          maker.makers.join(" "),
          maker.craft,
          maker.description,
          `stall ${maker.stall}`,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  const displayMakers = useMemo(() => {
    if (category !== "All" || search.trim()) return filteredMakers;
    const featured = filteredMakers.find((maker) => maker.id === "back-to-earth");
    if (!featured) return filteredMakers;
    const remaining = filteredMakers.filter((maker) => maker.id !== featured.id);
    return [...remaining.slice(0, 4), featured, ...remaining.slice(4)];
  }, [category, filteredMakers, search]);

  function scrollTo(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitUpdates(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("submitting");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      interest: String(form.get("interest") ?? "Opening updates"),
      source: "homepage",
      status: "new",
    };

    try {
      if (firebaseReady && db) {
        await addDoc(collection(db, "enquiries"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      } else {
        localStorage.setItem(
          "ipi-tombe-last-enquiry",
          JSON.stringify({ ...payload, createdAt: new Date().toISOString() }),
        );
      }
      setFormState("success");
      event.currentTarget.reset();
    } catch {
      setFormState("error");
    }
  }

  return (
    <>
      <header className="site-header">
        <a className="site-header__brand" href="#top" aria-label="Ipi Tombe Circle home">
          <Wordmark compact />
        </a>
        <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}>
          <button onClick={() => scrollTo("discover")}>Discover</button>
          <button onClick={() => scrollTo("circle")}>The Circle</button>
          <button onClick={() => scrollTo("visit")}>Visit</button>
          <button onClick={() => scrollTo("journal")}>Journal</button>
          <button className="button button--primary site-nav__cta" onClick={() => scrollTo("discover")}>
            Explore the makers <ArrowRight size={17} />
          </button>
        </nav>
        <button
          className="menu-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <CircleMark className="hero-copy__circle" />
            <h1>
              Made by hand.
              <br />
              Held in community.
            </h1>
            <p>A living circle of Zimbabwean artists, artisans, creators and crafters.</p>
            <div className="hero-copy__stroke" />
            <strong>Opening 01 July 2026 · Borrowdale Race Course, Harare</strong>
            <button className="button button--primary" onClick={() => scrollTo("discover")}>
              Explore the makers <ArrowRight size={18} />
            </button>
          </div>
          <div className="hero-mosaic" aria-label="A selection of work by the Circle">
            {heroImages.map(([src, alt], index) => (
              <div className={`hero-mosaic__item hero-mosaic__item--${index + 1}`} key={src}>
                <Image src={src} alt={alt} fill sizes="(max-width: 800px) 50vw, 24vw" priority={index < 4} />
              </div>
            ))}
          </div>
        </section>

        <section className="circle-story" id="circle">
          <div className="circle-story__copy">
            <Sparkles className="circle-story__icon" />
            <div>
              <h2>A circle that creates more</h2>
              <div className="section-stroke" />
              <p>Ipi Tombe Circle is a new destination and platform celebrating the creativity, skill and spirit of Zimbabwean makers.</p>
              <p>It is a place to discover beautiful handmade work, meet the people behind it and take home pieces with meaning.</p>
              <p>When we buy local, we build futures. When we gather, we grow together.</p>
              <button className="text-link" onClick={() => scrollTo("discover")}>
                Meet the Circle <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="circle-story__image">
            <Image
              src="/media/makers/kudzie-mobile-art-gallery/kudzie-mobile-art-gallery-3092.jpg"
              alt="Zimbabwean artworks displayed by a local maker"
              fill
              sizes="(max-width: 800px) 100vw, 52vw"
            />
            <div className="circle-story__image-note">
              <span>18 maker stalls</span>
              <span>2 evolving shared spaces</span>
            </div>
          </div>
        </section>

        <section className="makers-section" id="discover">
          <div className="makers-heading">
            <div>
              <h2>Meet the <em>Circle</em></h2>
              <p>Eighteen stalls. One shared belief in the power of making.</p>
            </div>
            <div className="makers-tools">
              <label className="search-control">
                <Search size={20} />
                <span className="sr-only">Search makers or craft</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search makers or craft" />
              </label>
              <div className="category-tabs" aria-label="Filter makers by category">
                {makerCategories.map((item) => (
                  <button key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="shared-space-note">
            <CircleMark />
            <span>Stalls 5 &amp; 6 are shared exhibition spaces for revolving artists.</span>
          </div>

          <div className="maker-directory">
            {displayMakers.length > 0 ? (
              displayMakers.map((maker, index) => (
                <article
                  className={`maker-card ${
                    maker.id === "back-to-earth" && category === "All" && !search.trim()
                      ? "maker-card--feature"
                      : ""
                  }`}
                  key={maker.id}
                >
                  <button className="maker-card__image" onClick={() => setSelectedMaker(maker)} aria-label={`View ${maker.brand}`}>
                    <MakerImage
                      maker={maker}
                      sizes={maker.id === "back-to-earth" ? "(max-width: 900px) 100vw, 40vw" : "(max-width: 700px) 50vw, 20vw"}
                      priority={index < 4}
                    />
                  </button>
                  <div className="maker-card__content">
                    <span className="maker-card__stall">Stall {maker.stall}</span>
                    <h3>{maker.brand}</h3>
                    <span className="maker-card__category">{maker.category}</span>
                    <p>{maker.craft}</p>
                    {maker.id === "back-to-earth" && (
                      <>
                        <strong>{maker.makers[0]}</strong>
                        <p className="maker-card__description">{maker.description}</p>
                      </>
                    )}
                    <button className="text-link" onClick={() => setSelectedMaker(maker)}>
                      View maker <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <CircleMark />
                <h3>No makers found—yet.</h3>
                <p>Try a different name, craft or category.</p>
                <button className="text-link" onClick={() => { setSearch(""); setCategory("All"); }}>
                  Clear filters <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="visit-section" id="visit">
          <div className="visit-copy">
            <CircleMark />
            <h2>Come into<br />the Circle</h2>
            <div className="section-stroke" />
            <h3>Opening Wednesday, 01 July 2026</h3>
            <strong>Borrowdale Race Course, Harare</strong>
            <p>A beautiful indoor space for handmade Zimbabwean ware.</p>
            <div className="visit-actions">
              <a className="button button--primary" href="https://www.google.com/maps/search/?api=1&query=Borrowdale+Race+Course+Harare" target="_blank" rel="noreferrer">
                Plan your visit <ArrowRight size={18} />
              </a>
              <button className="button button--outline" onClick={() => document.getElementById("updates-email")?.focus()}>
                Get opening updates <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="visit-map">
            <div className="visit-map__roads" aria-hidden="true">
              <span className="road road--one" /><span className="road road--two" /><span className="road road--three" />
              <span className="road road--four" /><span className="road road--five" />
            </div>
            <div className="visit-map__site"><MapPin /><strong>Borrowdale Race Course</strong></div>
            <div className="visit-details">
              <div><MapPin /><p><strong>Where</strong>Borrowdale Race Course,<br />Harare, Zimbabwe</p></div>
              <div><Car /><p><strong>Getting there</strong>Accessible from Borrowdale Road and Dandaro Road.</p></div>
              <div><Sparkles /><p><strong>What to expect</strong>An inspiring indoor showcase of local craft, art and design.</p></div>
            </div>
          </div>
        </section>

        <section className="made-here" id="journal">
          <div className="made-here__copy">
            <h2>Made here.<br />Made to last.</h2>
            <div className="section-stroke section-stroke--gold" />
            <p>Discover objects with a story, meet the hands behind them, and keep Zimbabwean creativity in motion.</p>
          </div>
          <div className="made-here__rail">
            {storyRail.map(([src, alt]) => (
              <div className="made-here__image" key={src}><Image src={src} alt={alt} fill sizes="18vw" /></div>
            ))}
          </div>
        </section>

        <section className="updates-section">
          <div>
            <CalendarDays />
            <h2>Be there at the beginning.</h2>
            <p>Join the opening list for news from the Circle, new maker stories and exhibition announcements.</p>
          </div>
          <form className="updates-form" onSubmit={submitUpdates}>
            <label><span>Name</span><input name="name" required autoComplete="name" placeholder="Your name" /></label>
            <label><span>Email</span><input id="updates-email" name="email" required type="email" autoComplete="email" placeholder="you@example.com" /></label>
            <label>
              <span>I&apos;m interested in</span>
              <select name="interest" defaultValue="Opening updates">
                <option>Opening updates</option><option>Buying from makers</option>
                <option>Exhibiting at the Circle</option><option>Press & partnerships</option>
              </select>
            </label>
            <button className="button button--light" type="submit" disabled={formState === "submitting"}>
              {formState === "submitting" ? "Joining…" : "Join the Circle"} {formState === "success" ? <Check size={18} /> : <ArrowRight size={18} />}
            </button>
            {formState === "success" && <p className="form-message form-message--success">You&apos;re in. We&apos;ll keep you close to the Circle.</p>}
            {formState === "error" && <p className="form-message">Something slipped. Please try again.</p>}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__brand"><Wordmark /><p>Zimbabwean creativity, gathered.</p></div>
        <div className="site-footer__links">
          <button onClick={() => scrollTo("discover")}>Discover</button><button onClick={() => scrollTo("circle")}>The Circle</button>
          <button onClick={() => scrollTo("visit")}>Visit</button><button onClick={() => scrollTo("journal")}>Journal</button>
        </div>
        <div className="site-footer__admin">
          <a href="/sign-in">Circle admin <ChevronRight size={16} /></a><span>© 2026 Ipi Tombe Circle</span>
        </div>
      </footer>

      {selectedMaker && (
        <div className="modal-shell" role="dialog" aria-modal="true">
          <button className="modal-shell__backdrop" aria-label="Close maker profile" onClick={() => setSelectedMaker(null)} />
          <article className="maker-modal">
            <button className="maker-modal__close" onClick={() => setSelectedMaker(null)} aria-label="Close maker profile"><X /></button>
            <div className="maker-modal__gallery">
              {(selectedMaker.images.length ? selectedMaker.images.slice(0, 3) : ["fallback"]).map((image, index) => (
                <div className="maker-modal__image" key={image}>
                  {image === "fallback" ? (
                    <div className={`maker-fallback maker-fallback--${selectedMaker.category.toLowerCase()}`}><CircleMark /><span>{selectedMaker.brand}</span></div>
                  ) : (
                    <Image src={image} alt={`${selectedMaker.brand} work ${index + 1}`} fill sizes="(max-width: 700px) 90vw, 24vw" />
                  )}
                </div>
              ))}
            </div>
            <div className="maker-modal__content">
              <span className="maker-card__stall">Stall {selectedMaker.stall}</span>
              <h2>{selectedMaker.brand}</h2>
              <p className="maker-modal__makers">{selectedMaker.makers.join(" · ")}</p>
              <span className="maker-card__category">{selectedMaker.category}</span>
              <h3>{selectedMaker.craft}</h3><p>{selectedMaker.description}</p>
              <div className="maker-modal__contacts">
                {selectedMaker.email.map((email) => <a href={`mailto:${email}`} key={email}><Mail size={17} /> {email}</a>)}
                {selectedMaker.phone.map((phone) => <a href={`tel:${phone.replace(/\s/g, "")}`} key={phone}><span className="contact-dot" /> {phone}</a>)}
              </div>
            </div>
          </article>
        </div>
      )}
    </>
  );
}
