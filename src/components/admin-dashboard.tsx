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

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(firebaseReady && Boolean(auth));
  const [mobileNav, setMobileNav] = useState(false);
  const [makerList, setMakerList] = useState<Maker[]>(seedMakers);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(demoEnquiries);
  const [search, setSearch] = useState("");
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
    if (!queryText) return makerList;
    return makerList.filter((maker) =>
      [maker.brand, maker.makers.join(" "), maker.craft, `stall ${maker.stall}`]
        .join(" ")
        .toLowerCase()
        .includes(queryText),
    );
  }, [makerList, search]);

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
    setMakerList((current) =>
      current.map((maker) => (maker.id === updated.id ? updated : maker)),
    );
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

  return (
    <main className="admin-shell">
      <aside className={`admin-sidebar ${mobileNav ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar__brand">
          <Wordmark />
          <button onClick={() => setMobileNav(false)} aria-label="Close navigation"><X /></button>
        </div>
        <nav>
          {navItems.map(([Icon, label], index) => (
            <button className={index === 0 ? "is-active" : ""} key={label}>
              <Icon size={19} /> {label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__user">
          <div className="admin-avatar">
            {user?.photoURL ? <Image src={user.photoURL} alt="" fill sizes="40px" /> : <span>RM</span>}
          </div>
          <div><strong>{user?.displayName ?? "Rodney Manyepa"}</strong><span>Administrator</span></div>
          <ChevronDown size={16} />
        </div>
        <button className="admin-signout" onClick={handleSignOut}><LogOut size={18} /> Sign out</button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu /></button>
          <div className="admin-topbar__actions">
            {!firebaseReady && <span className="admin-demo-badge">Local demo</span>}
            <button className="admin-icon-button" aria-label="Notifications"><Bell size={19} /></button>
            <button className="admin-profile-button"><span>Admin</span><ChevronDown size={15} /></button>
            <button className="button button--primary" onClick={() => setEditing(seedMakers[0])}><Plus size={18} /> Add maker</button>
          </div>
        </header>

        <div className="admin-content">
          <h1>Circle overview</h1>
          <section className="admin-stats">
            <article><span className="admin-stat-icon admin-stat-icon--red"><Store /></span><div><strong>18</strong><p>Active stalls</p><small>Makers with public profiles</small></div></article>
            <article><span className="admin-stat-icon admin-stat-icon--gold"><Users /></span><div><strong>2</strong><p>Shared spaces</p><small>Available for exhibitions</small></div></article>
            <article><span className="admin-stat-icon admin-stat-icon--green">#</span><div><strong>20</strong><p>Numbered stalls</p><small>Stalls 1–20 in total</small></div></article>
          </section>

          <div className="admin-workspace">
            <section className="admin-panel admin-directory-panel">
              <div className="admin-panel__header"><h2>Maker directory</h2><button aria-label="More options"><MoreHorizontal /></button></div>
              <div className="admin-table-tools">
                <label><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search makers…" /></label>
                <button>All statuses <ChevronDown size={15} /></button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Maker</th><th>Stall</th><th>Category</th><th>Profile</th><th>Media</th><th>Updated</th><th /></tr></thead>
                  <tbody>
                    {filteredMakers.map((maker) => (
                      <tr key={maker.id}>
                        <td><div className="admin-maker"><span className="admin-maker__image">{maker.images[0] ? <Image src={maker.images[0]} alt="" fill sizes="42px" /> : <CircleMark />}</span><span><strong>{maker.brand}</strong><small>{maker.makers.join(" & ")}</small></span></div></td>
                        <td>{maker.stall}</td><td>{maker.category}<br /><small>{maker.craft}</small></td>
                        <td><span className={`admin-status admin-status--${maker.status.toLowerCase().replaceAll(" ", "-")}`}>{maker.status}</span></td>
                        <td>{maker.images.length} {maker.images.length === 1 ? "photo" : "photos"}</td>
                        <td>23 Jun 2026</td>
                        <td><button className="admin-row-action" onClick={() => setEditing(maker)}><MoreHorizontal /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="admin-pagination"><span>1–{filteredMakers.length} of {makerList.length}</span><div><button className="is-active">1</button><button>2</button></div></div>
            </section>

            <aside className="admin-rail">
              <section className="admin-panel admin-enquiries">
                <div className="admin-panel__header"><h2>Recent enquiries</h2><button>View all</button></div>
                <div className="admin-enquiry-list">
                  {enquiries.map((enquiry) => (
                    <article key={enquiry.id}>
                      <span className="admin-enquiry-avatar">{enquiry.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                      <div><div><strong>{enquiry.name}</strong><span className={`admin-mini-status admin-mini-status--${enquiry.status.toLowerCase()}`}>{enquiry.status}</span></div><p>{enquiry.interest}</p></div>
                    </article>
                  ))}
                </div>
              </section>
              <section className="admin-panel admin-composer">
                <div className="admin-panel__header"><h2>Opening update</h2><span>Share with the Circle</span></div>
                <form onSubmit={publishUpdate}>
                  <textarea name="message" defaultValue={"We are officially opening on 01 July 2026 at Borrowdale Race Course in Harare.\n\nWe can’t wait to celebrate Zimbabwean creativity together."} />
                  <div><button className="button button--primary">{updateState === "saving" ? "Publishing…" : updateState === "saved" ? "Published" : "Publish update"}</button></div>
                </form>
              </section>
            </aside>
          </div>
        </div>
      </div>

      {editing && (
        <div className="admin-drawer-shell">
          <button className="admin-drawer-backdrop" onClick={() => setEditing(null)} aria-label="Close editor" />
          <aside className="admin-drawer">
            <header><h2>Edit maker</h2><button onClick={() => setEditing(null)}><X /></button></header>
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
