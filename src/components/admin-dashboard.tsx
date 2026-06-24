"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  FileImage,
  Home,
  LogOut,
  Megaphone,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Store,
  Users,
  X,
} from "lucide-react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { CircleMark, Wordmark } from "@/components/brand";
import { makers as seedMakers, type Maker, type MakerCategory } from "@/data/makers";
import { auth, db, firebaseReady } from "@/lib/firebase";

type Enquiry = {
  id: string;
  name: string;
  email?: string;
  interest: string;
  status: string;
};

type SectionName =
  | "Overview"
  | "Makers"
  | "Media"
  | "Enquiries"
  | "Updates"
  | "Settings";

const demoEnquiries: Enquiry[] = [
  { id: "1", name: "Sarah Chitongo", interest: "Partnership & collaboration for opening day feature", status: "New" },
  { id: "2", name: "Tendai M.", interest: "Interested in exhibiting in a shared space", status: "Open" },
  { id: "3", name: "Lindiwe R.", interest: "Press accreditation request for 01 July", status: "Replied" },
  { id: "4", name: "Julia Moyo", interest: "Vendor application question about shared spaces", status: "Open" },
];

const navItems = [
  [Home, "Overview"],
  [Users, "Makers"],
  [FileImage, "Media"],
  [MessageCircle, "Enquiries"],
  [Megaphone, "Updates"],
  [Settings, "Settings"],
] as const;

const statusCycle = ["All statuses", "Published", "Needs copy"];
const enquiryStatuses = ["New", "Open", "Replied", "Closed"];
const PAGE_SIZE = 9;

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(firebaseReady && Boolean(auth));
  const [mobileNav, setMobileNav] = useState(false);
  const [section, setSection] = useState<SectionName>("Overview");
  const [makerList, setMakerList] = useState<Maker[]>(seedMakers);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(demoEnquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Maker | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [updateState, setUpdateState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    if (!firebaseReady || !auth) return;
    return onAuthStateChanged(auth, (nextUser) => {
      if (!nextUser) {
        router.replace("/sign-in");
        return;
      }
      setUser(nextUser);
      setLoadingAuth(false);
    });
  }, [router]);

  useEffect(() => {
    if (!firebaseReady || !db || loadingAuth || !user) return;

    async function loadData() {
      try {
        const makerSnapshot = await getDocs(
          query(collection(db!, "makers"), orderBy("stall", "asc")),
        );
        if (!makerSnapshot.empty) {
          setMakerList(
            makerSnapshot.docs.map((item) => ({
              ...(item.data() as Maker),
              id: item.id,
            })),
          );
        }

        const enquirySnapshot = await getDocs(
          query(collection(db!, "enquiries"), orderBy("createdAt", "desc"), limit(6)),
        );
        if (!enquirySnapshot.empty) {
          setEnquiries(
            enquirySnapshot.docs.map((item) => ({
              id: item.id,
              name: String(item.data().name ?? "Website visitor"),
              email: String(item.data().email ?? ""),
              interest: String(item.data().interest ?? "General enquiry"),
              status: String(item.data().status ?? "New"),
            })),
          );
        }
      } catch {
        // The seeded local data remains available while Firestore is being configured.
      }
    }

    loadData();
  }, [loadingAuth, user]);

  const filteredMakers = useMemo(() => {
    const queryText = search.trim().toLowerCase();
    return makerList.filter((maker) => {
      const matchesSearch =
        !queryText ||
        [maker.brand, maker.makers.join(" "), maker.craft, `stall ${maker.stall}`]
          .join(" ")
          .toLowerCase()
          .includes(queryText);
      const matchesStatus =
        statusFilter === "All statuses" || maker.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [makerList, search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredMakers.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pagedMakers = filteredMakers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const mediaItems = useMemo(
    () =>
      makerList.flatMap((maker) =>
        maker.images.map((src, index) => ({
          maker,
          src,
          key: `${maker.id}-${index}`,
        })),
      ),
    [makerList],
  );

  function goToSection(next: SectionName) {
    setSection(next);
    setMobileNav(false);
  }

  function cycleStatusFilter() {
    setPage(1);
    setStatusFilter(
      (current) => statusCycle[(statusCycle.indexOf(current) + 1) % statusCycle.length],
    );
  }

  function cycleEnquiryStatus(id: string) {
    setEnquiries((current) =>
      current.map((enquiry) =>
        enquiry.id === id
          ? {
              ...enquiry,
              status:
                enquiryStatuses[
                  (enquiryStatuses.indexOf(enquiry.status) + 1) % enquiryStatuses.length
                ],
            }
          : enquiry,
      ),
    );
  }

  function startAddMaker() {
    const nextStall = makerList.reduce((max, maker) => Math.max(max, maker.stall), 0) + 1;
    setEditing({
      ...seedMakers[0],
      id: `maker-${Date.now()}`,
      brand: "",
      makers: [""],
      stall: nextStall,
      category: "Home" as MakerCategory,
      craft: "",
      description: "",
      email: [],
      phone: [],
      images: [],
      status: "Needs copy",
    });
  }

  async function saveMaker(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const updated: Maker = {
      ...editing,
      brand: String(form.get("brand") ?? ""),
      makers: [String(form.get("maker") ?? "")],
      stall: Number(form.get("stall") ?? 0),
      category: String(form.get("category") ?? "Home") as MakerCategory,
      craft: String(form.get("craft") ?? ""),
      description: String(form.get("description") ?? ""),
      email: String(form.get("email") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      phone: String(form.get("phone") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      status: form.get("published") ? "Published" : "Needs copy",
    };

    setSaveState("saving");
    if (firebaseReady && db) {
      await setDoc(
        doc(db, "makers", updated.id),
        { ...updated, updatedAt: serverTimestamp() },
        { merge: true },
      );
    }
    setMakerList((current) => {
      const exists = current.some((maker) => maker.id === updated.id);
      return exists
        ? current.map((maker) => (maker.id === updated.id ? updated : maker))
        : [...current, updated];
    });
    setSaveState("saved");
    window.setTimeout(() => {
      setEditing(null);
      setSaveState("idle");
    }, 500);
  }

  async function publishUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = String(form.get("message") ?? "");
    if (!message.trim()) return;
    setUpdateState("saving");
    if (firebaseReady && db) {
      await setDoc(doc(collection(db, "updates")), {
        message,
        status: "published",
        createdAt: serverTimestamp(),
        createdBy: user?.uid ?? "local-demo",
      });
    } else {
      localStorage.setItem("ipi-tombe-latest-update", message);
    }
    setUpdateState("saved");
    window.setTimeout(() => setUpdateState("idle"), 1200);
  }

  async function handleSignOut() {
    if (auth) await signOut(auth);
    router.push("/");
  }

  if (loadingAuth) {
    return (
      <div className="admin-loading">
        <CircleMark />
        <span>Opening the Circle…</span>
      </div>
    );
  }

  const directoryPanel = (
    <section className="admin-panel admin-directory-panel">
      <div className="admin-panel__header">
        <h2>Maker directory</h2>
        <button aria-label="Open makers view" onClick={() => goToSection("Makers")}><MoreHorizontal /></button>
      </div>
      <div className="admin-table-tools">
        <label>
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search makers…"
          />
        </label>
        <button onClick={cycleStatusFilter}>{statusFilter} <ChevronDown size={15} /></button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Maker</th><th>Stall</th><th>Category</th><th>Profile</th><th>Media</th><th>Updated</th><th /></tr></thead>
          <tbody>
            {pagedMakers.map((maker) => (
              <tr key={maker.id}>
                <td><div className="admin-maker"><span className="admin-maker__image">{maker.images[0] ? <Image src={maker.images[0]} alt="" fill sizes="42px" /> : <CircleMark />}</span><span><strong>{maker.brand || "Untitled maker"}</strong><small>{maker.makers.join(" & ")}</small></span></div></td>
                <td>{maker.stall}</td><td>{maker.category}<br /><small>{maker.craft}</small></td>
                <td><span className={`admin-status admin-status--${maker.status.toLowerCase().replaceAll(" ", "-")}`}>{maker.status}</span></td>
                <td>{maker.images.length} {maker.images.length === 1 ? "photo" : "photos"}</td>
                <td>23 Jun 2026</td>
                <td><button className="admin-row-action" aria-label={`Edit ${maker.brand}`} onClick={() => setEditing(maker)}><MoreHorizontal /></button></td>
              </tr>
            ))}
            {pagedMakers.length === 0 && (
              <tr><td colSpan={7} className="admin-table-empty">No makers match your search or filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="admin-pagination">
        <span>
          {filteredMakers.length === 0
            ? "0"
            : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filteredMakers.length)}`}{" "}
          of {filteredMakers.length}
        </span>
        <div>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={pageNumber === safePage ? "is-active" : ""}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  const composerPanel = (
    <section className="admin-panel admin-composer">
      <div className="admin-panel__header"><h2>Opening update</h2><span>Share with the Circle</span></div>
      <form onSubmit={publishUpdate}>
        <textarea name="message" defaultValue={"We are officially opening on 01 July 2026 at Borrowdale Race Course in Harare.\n\nWe can’t wait to celebrate Zimbabwean creativity together."} />
        <div><button className="button button--primary">{updateState === "saving" ? "Publishing…" : updateState === "saved" ? "Published" : "Publish update"}</button></div>
      </form>
    </section>
  );

  const enquiryList = (full: boolean) => (
    <div className="admin-enquiry-list">
      {enquiries.map((enquiry) => (
        <article key={enquiry.id} className="admin-enquiry-item" onClick={() => cycleEnquiryStatus(enquiry.id)} title="Click to change status">
          <span className="admin-enquiry-avatar">{enquiry.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
          <div>
            <div><strong>{enquiry.name}</strong><span className={`admin-mini-status admin-mini-status--${enquiry.status.toLowerCase()}`}>{enquiry.status}</span></div>
            <p>{enquiry.interest}</p>
            {full && enquiry.email && <small className="admin-enquiry-email">{enquiry.email}</small>}
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <main className="admin-shell">
      <aside className={`admin-sidebar ${mobileNav ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar__brand">
          <Wordmark />
          <button onClick={() => setMobileNav(false)} aria-label="Close navigation"><X /></button>
        </div>
        <nav>
          {navItems.map(([Icon, label]) => (
            <button
              className={section === label ? "is-active" : ""}
              key={label}
              onClick={() => goToSection(label)}
            >
              <Icon size={19} /> {label}
            </button>
          ))}
        </nav>
        <button className="admin-sidebar__user" onClick={() => goToSection("Settings")}>
          <div className="admin-avatar">
            {user?.photoURL ? <Image src={user.photoURL} alt="" fill sizes="40px" /> : <span>RM</span>}
          </div>
          <div><strong>{user?.displayName ?? "Rodney Manyepa"}</strong><span>Administrator</span></div>
          <ChevronDown size={16} />
        </button>
        <button className="admin-signout" onClick={handleSignOut}><LogOut size={18} /> Sign out</button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu /></button>
          <div className="admin-topbar__actions">
            {!firebaseReady && <span className="admin-demo-badge">Local demo</span>}
            <button className="admin-icon-button" aria-label="Notifications" onClick={() => goToSection("Enquiries")}><Bell size={19} /></button>
            <button className="admin-profile-button" onClick={() => goToSection("Settings")}><span>Admin</span><ChevronDown size={15} /></button>
            <button className="button button--primary" onClick={startAddMaker}><Plus size={18} /> Add maker</button>
          </div>
        </header>

        <div className="admin-content">
          {section === "Overview" && (
            <>
              <h1>Circle overview</h1>
              <section className="admin-stats">
                <article><span className="admin-stat-icon admin-stat-icon--red"><Store /></span><div><strong>{makerList.length}</strong><p>Active stalls</p><small>Makers with public profiles</small></div></article>
                <article><span className="admin-stat-icon admin-stat-icon--gold"><Users /></span><div><strong>2</strong><p>Shared spaces</p><small>Available for exhibitions</small></div></article>
                <article><span className="admin-stat-icon admin-stat-icon--green">#</span><div><strong>20</strong><p>Numbered stalls</p><small>Stalls 1–20 in total</small></div></article>
              </section>
              <div className="admin-workspace">
                {directoryPanel}
                <aside className="admin-rail">
                  <section className="admin-panel admin-enquiries">
                    <div className="admin-panel__header"><h2>Recent enquiries</h2><button onClick={() => goToSection("Enquiries")}>View all</button></div>
                    {enquiryList(false)}
                  </section>
                  {composerPanel}
                </aside>
              </div>
            </>
          )}

          {section === "Makers" && (
            <>
              <h1>Makers</h1>
              {directoryPanel}
            </>
          )}

          {section === "Media" && (
            <>
              <h1>Media library</h1>
              <section className="admin-panel">
                <div className="admin-panel__header"><h2>All photos</h2><span>{mediaItems.length} {mediaItems.length === 1 ? "photo" : "photos"}</span></div>
                {mediaItems.length === 0 ? (
                  <p className="admin-empty-note">No media uploaded yet.</p>
                ) : (
                  <div className="admin-media-grid">
                    {mediaItems.map(({ maker, src, key }) => (
                      <figure key={key}>
                        <div className="admin-media-thumb"><Image src={src} alt={maker.brand} fill sizes="(max-width: 700px) 33vw, 150px" /></div>
                        <figcaption>{maker.brand}<small>Stall {maker.stall}</small></figcaption>
                      </figure>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {section === "Enquiries" && (
            <>
              <h1>Enquiries</h1>
              <section className="admin-panel">
                <div className="admin-panel__header"><h2>All enquiries</h2><span>{enquiries.length} total</span></div>
                {enquiryList(true)}
              </section>
            </>
          )}

          {section === "Updates" && (
            <>
              <h1>Updates</h1>
              {composerPanel}
            </>
          )}

          {section === "Settings" && (
            <>
              <h1>Settings</h1>
              <div className="admin-settings-grid">
                <div className="admin-setting-card">
                  <h3>Venue</h3>
                  <p>Borrowdale Race Course</p>
                  <p>Harare, Zimbabwe</p>
                  <p>Opening 01 July 2026</p>
                </div>
                <div className="admin-setting-card">
                  <h3>Account</h3>
                  <p>{user?.email ?? user?.displayName ?? "Administrator"}</p>
                  <button className="button button--outline" onClick={handleSignOut}><LogOut size={16} /> Sign out</button>
                </div>
                <div className="admin-setting-card">
                  <h3>Data source</h3>
                  <p>{firebaseReady ? "Connected to Firestore" : "Local demo mode"}</p>
                  <p>{makerList.length} makers loaded</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="admin-drawer-shell">
          <button className="admin-drawer-backdrop" onClick={() => setEditing(null)} aria-label="Close editor" />
          <aside className="admin-drawer">
            <header><h2>{makerList.some((maker) => maker.id === editing.id) ? "Edit maker" : "Add maker"}</h2><button onClick={() => setEditing(null)}><X /></button></header>
            <form onSubmit={saveMaker}>
              <label><span>Brand name *</span><input name="brand" defaultValue={editing.brand} required /></label>
              <label><span>Maker name *</span><input name="maker" defaultValue={editing.makers.join(", ")} required /></label>
              <label><span>Stall *</span><input name="stall" type="number" min="1" max="20" defaultValue={editing.stall} required /></label>
              <label><span>Category *</span><select name="category" defaultValue={editing.category}><option>Art</option><option>Home</option><option>Wear</option><option>Wellbeing</option></select></label>
              <label><span>Craft *</span><input name="craft" defaultValue={editing.craft} required /></label>
              <label><span>Short description *</span><textarea name="description" defaultValue={editing.description} required /></label>
              <label><span>Email</span><input name="email" defaultValue={editing.email.join(", ")} /></label>
              <label><span>Phone</span><input name="phone" defaultValue={editing.phone.join(", ")} /></label>
              <label className="admin-toggle-row"><span><strong>Published</strong><small>When off, this maker will not appear on the public site.</small></span><input name="published" type="checkbox" defaultChecked={editing.status === "Published"} /></label>
              <div className="admin-drawer__actions"><button className="button button--primary" disabled={saveState === "saving"}>{saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Save changes"}</button><button type="button" className="button button--outline" onClick={() => setEditing(null)}>Cancel</button></div>
            </form>
          </aside>
        </div>
      )}
    </main>
  );
}
