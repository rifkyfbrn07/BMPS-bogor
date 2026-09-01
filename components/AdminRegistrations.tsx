"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { 
  Award,
  Building2, 
  ChevronDown,
  Clock,
  Edit3,
  GraduationCap, 
  Globe, 
  ImagePlus, 
  LayoutDashboard,
  LoaderCircle, 
  LogOut,
  MapPin, 
  MessageCircle, 
  Newspaper,
  Plus,
  Search,
  ShieldCheck, 
  Users,
  X,
} from "lucide-react";
import { 
  InstagramIcon, 
  FacebookIcon, 
  YoutubeIcon, 
  TikTokIcon, 
} from "@/components/SocialIcons";
import { buildWhatsAppLink, schoolLevelLabel } from "@/lib/school-labels";

type Registration = { 
  id: string; 
  registrationNumber: string; 
  name: string; 
  npsn: string; 
  level: string; 
  institutionType?: string | null; 
  foundationName?: string | null; 
  principalName: string; 
  picName: string; 
  picRole: string; 
  email: string; 
  phone: string; 
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  address: string; 
  ward: string; 
  district: string; 
  city: string; 
  province: string; 
  postalCode?: string | null; 
  website?: string | null; 
  registrationUrl?: string | null; 
  googleMapsUrl?: string | null; 
  description?: string | null; 
  vision?: string | null; 
  mission?: string | null; 
  logoUrl?: string | null; 
  schoolPhotoUrl?: string | null; 
  documentUrl?: string | null; 
  programs?: string[] | null; 
  status: string; 
  createdAt: string; 
  reviewedAt?: string | null; 
  reviewerId?: string | null; 
  rejectionReason?: string | null 
};

type SchoolItem = {
  id: string;
  name: string;
  npsn: string;
  slug: string;
  level: string;
  institutionType?: string | null;
  foundationId?: string | null;
  foundation?: { name: string } | null;
  principalName?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  address?: string | null;
  district?: string | null;
  city?: string | null;
  description?: string | null;
  schoolPhotoUrl?: string | null;
  logoUrl?: string | null;
  createdAt: string;
};

type Article = { id: string; title: string; content: string; thumbnailUrl?: string | null; category?: { name: string } | null; status: string; publishedAt?: string | null };
type Program = { id: string; title: string; description: string; thumbnailUrl?: string | null; category: string; status: string };
type Training = { id: string; title: string; description: string; thumbnailUrl?: string | null; location: string; startDate: string; quota: number; speaker: string; status: string };

type Tab = "verifikasi" | "dashboard" | "schools" | "locations" | "articles" | "programs" | "trainings";

export default function AdminRegistrations({
  currentAdmin,
}: {
  currentAdmin?: { id: string; name: string; email: string; role: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("verifikasi");
  
  // Registration States
  const [items, setItems] = useState<Registration[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [accounts, setAccounts] = useState<{ id: string; name: string; email: string }[]>([]);
  
  // CRUD Lists
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);

  // Search and Filter States for Verification Table (Matching Screenshot)
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");

  // UI States
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [adminName, setAdminName] = useState(currentAdmin?.name || "Admin");
  const [adminPassword, setAdminPassword] = useState("");

  // Form States
  const [schoolForm, setSchoolForm] = useState({
    name: "",
    npsn: "",
    level: "SMA",
    institutionType: "SEKOLAH",
    foundationName: "",
    principalName: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    address: "",
    district: "Bogor",
    city: "Bogor",
    description: "",
    schoolPhotoUrl: "",
  });
  const [articleForm, setArticleForm] = useState({ title: "", content: "", categoryName: "Kegiatan", thumbnailUrl: "", status: "PUBLISHED" });
  const [programForm, setProgramForm] = useState({ title: "", description: "", category: "Pendidikan", thumbnailUrl: "", status: "PUBLISHED" });
  const [trainingForm, setTrainingForm] = useState({ title: "", description: "", location: "", startDate: "", quota: 50, speaker: "Pembicara Utama", thumbnailUrl: "", status: "PUBLISHED" });

  const loadData = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      // Always load registrations & schools for metrics
      const resReg = await fetch("/api/admin/registrations");
      const dataReg = await resReg.json();
      if (resReg.ok) setItems(dataReg.data || []);

      const resSchool = await fetch("/api/admin/content/schools");
      const dataSchool = await resSchool.json();
      if (resSchool.ok) setSchools(dataSchool.data || []);

      const resUser = await fetch("/api/admin/users");
      const dataUser = await resUser.json();
      if (resUser.ok) setAccounts(dataUser.data || []);

      if (activeTab === "articles") {
        const res = await fetch("/api/admin/content/articles");
        const data = await res.json();
        if (res.ok) setArticles(data.data || []);
      } else if (activeTab === "programs") {
        const res = await fetch("/api/admin/content/programs");
        const data = await res.json();
        if (res.ok) setPrograms(data.data || []);
      } else if (activeTab === "trainings") {
        const res = await fetch("/api/admin/content/trainings");
        const data = await res.json();
        if (res.ok) setTrainings(data.data || []);
      }
    } catch {
      setMessage("Terjadi kesalahan koneksi saat memuat data.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  // Counts for Metric Cards (Matching Screenshot: "X Tertunda", "Y Diterima")
  const pendingCount = useMemo(() => items.filter((i) => i.status === "PENDING" || i.status === "UNDER_REVIEW").length, [items]);
  const approvedCount = useMemo(() => items.filter((i) => i.status === "APPROVED").length, [items]);

  // Filtered registrations for Verifikasi table
  const filteredRegistrations = useMemo(() => {
    return items.filter((item) => {
      const matchStatus = 
        statusFilter === "ALL" ? true :
        statusFilter === "PENDING" ? (item.status === "PENDING" || item.status === "UNDER_REVIEW") :
        item.status === statusFilter;

      if (!matchStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.picName.toLowerCase().includes(q) ||
        item.npsn.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        (item.foundationName && item.foundationName.toLowerCase().includes(q)) ||
        (item.address && item.address.toLowerCase().includes(q)) ||
        (item.district && item.district.toLowerCase().includes(q))
      );
    });
  }, [items, statusFilter, searchQuery]);

  // Unique Districts for Lokasi tab
  const districts = useMemo(() => {
    const map = new Map<string, { total: number; approved: number }>();
    items.forEach((item) => {
      const dist = item.district || item.city || "Bogor";
      const curr = map.get(dist) || { total: 0, approved: 0 };
      curr.total += 1;
      if (item.status === "APPROVED") curr.approved += 1;
      map.set(dist, curr);
    });
    return Array.from(map.entries()).map(([district, stats]) => ({ district, ...stats }));
  }, [items]);

  async function openRegistration(id: string) {
    setMessage("");
    try {
      const response = await fetch(`/api/admin/registrations/${id}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Detail pendaftaran gagal dimuat.");
      setSelectedRegistration(data.data as Registration);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Detail pendaftaran gagal dimuat.");
    }
  }

  // Deciding school registration
  async function decide(id: string, action: "APPROVE" | "REJECT") {
    if (decisionLoading) return;
    const rejectionReason = action === "REJECT" ? window.prompt("Alasan penolakan (wajib):") : undefined;
    if (action === "REJECT" && !rejectionReason?.trim()) return;
    setDecisionLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(action === "APPROVE" ? { action } : { status: "REJECTED", rejectionReason: rejectionReason?.trim() ?? "" }) 
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message ?? "Keputusan gagal disimpan.");
      setMessage(action === "APPROVE" ? "Pendaftaran berhasil diterima!" : "Pendaftaran berhasil ditolak.");
      setSelectedRegistration(null);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Keputusan gagal disimpan.");
    } finally {
      setDecisionLoading(false);
    }
  }

  // Deciding user account approval
  async function decideAccount(id: string, status: "APPROVED" | "REJECTED") {
    const rejectionReason = status === "REJECTED" ? window.prompt("Alasan penolakan akun (wajib):") : undefined;
    if (status === "REJECTED" && !rejectionReason?.trim()) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rejectionReason })
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.message ?? "Keputusan akun gagal.");
    } else {
      setAccounts((current) => current.filter((account) => account.id !== id));
    }
  }

  // Logout Handler
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  }

  // Save Admin Profile
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: adminName, password: adminPassword || undefined })
      });
      const data = await res.json();
      if (res.ok) {
        setEditProfileOpen(false);
        setMessage("Profil admin berhasil diperbarui!");
      } else {
        setMessage(data.message || "Gagal memperbarui profil.");
      }
    } catch {
      setMessage("Terjadi kesalahan saat memperbarui profil.");
    }
  }

  // Delete resource item (school, article, program, training)
  async function handleDelete(id: string, resource = activeTab) {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini secara permanen?")) return;
    try {
      const res = await fetch(`/api/admin/content/${resource}/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadData();
      } else {
        const data = await res.json();
        setMessage(data.message || "Gagal menghapus data.");
      }
    } catch {
      setMessage("Terjadi kesalahan saat menghapus data.");
    }
  }

  // Upload photo inside admin modal
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads/school-photo", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setSchoolForm((prev) => ({ ...prev, schoolPhotoUrl: data.url }));
      } else {
        setMessage(data.message || "Gagal mengunggah foto sekolah.");
      }
    } catch {
      setMessage("Gagal mengunggah foto.");
    } finally {
      setPhotoUploading(false);
    }
  }

  // Submit create or edit form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = 
      activeTab === "schools" ? schoolForm :
      activeTab === "articles" ? articleForm :
      activeTab === "programs" ? programForm : trainingForm;

    const url = modalMode === "create" ? `/api/admin/content/${activeTab}` : `/api/admin/content/${activeTab}/${editId}`;
    const method = modalMode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setModalOpen(false);
        await loadData();
      } else {
        const data = await res.json();
        setMessage(data.message || "Gagal menyimpan perubahan.");
      }
    } catch {
      setMessage("Terjadi kesalahan koneksi saat menyimpan data.");
    }
  }

  // Open Edit Modal
  function openEdit(item: SchoolItem | Article | Program | Training) {
    setModalMode("edit");
    setEditId(item.id);
    if (activeTab === "schools") {
      const sch = item as SchoolItem;
      setSchoolForm({
        name: sch.name || "",
        npsn: sch.npsn || "",
        level: sch.level || "SMA",
        institutionType: sch.institutionType || "SEKOLAH",
        foundationName: sch.foundation?.name || "",
        principalName: sch.principalName || "",
        phone: sch.phone || "",
        whatsapp: sch.whatsapp || sch.phone || "",
        email: sch.email || "",
        website: sch.website || "",
        instagram: sch.instagram || "",
        facebook: sch.facebook || "",
        youtube: sch.youtube || "",
        tiktok: sch.tiktok || "",
        address: sch.address || "",
        district: sch.district || "Bogor",
        city: sch.city || "Bogor",
        description: sch.description || "",
        schoolPhotoUrl: sch.schoolPhotoUrl || "",
      });
    } else if (activeTab === "articles") {
      const art = item as Article;
      setArticleForm({
        title: art.title,
        content: art.content,
        categoryName: art.category?.name || "Kegiatan",
        thumbnailUrl: art.thumbnailUrl || "",
        status: art.status
      });
    } else if (activeTab === "programs") {
      const prg = item as Program;
      setProgramForm({
        title: prg.title,
        description: prg.description,
        category: prg.category,
        thumbnailUrl: prg.thumbnailUrl || "",
        status: prg.status
      });
    } else if (activeTab === "trainings") {
      const trn = item as Training;
      setTrainingForm({
        title: trn.title,
        description: trn.description,
        location: trn.location,
        startDate: trn.startDate ? trn.startDate.split("T")[0] : "",
        quota: trn.quota,
        speaker: trn.speaker,
        thumbnailUrl: trn.thumbnailUrl || "",
        status: trn.status
      });
    }
    setModalOpen(true);
  }

  // Open Create Modal
  function openCreate() {
    setModalMode("create");
    setEditId(null);
    if (activeTab === "schools") {
      setSchoolForm({
        name: "",
        npsn: "",
        level: "SMA",
        institutionType: "SEKOLAH",
        foundationName: "",
        principalName: "",
        phone: "",
        whatsapp: "",
        email: "",
        website: "",
        instagram: "",
        facebook: "",
        youtube: "",
        tiktok: "",
        address: "",
        district: "Bogor",
        city: "Bogor",
        description: "",
        schoolPhotoUrl: "",
      });
    } else if (activeTab === "articles") {
      setArticleForm({ title: "", content: "", categoryName: "Kegiatan", thumbnailUrl: "", status: "PUBLISHED" });
    } else if (activeTab === "programs") {
      setProgramForm({ title: "", description: "", category: "Pendidikan", thumbnailUrl: "", status: "PUBLISHED" });
    } else if (activeTab === "trainings") {
      setTrainingForm({ title: "", description: "", location: "", startDate: "", quota: 50, speaker: "Pembicara Utama", thumbnailUrl: "", status: "PUBLISHED" });
    }
    setModalOpen(true);
  }

  const formatPhoneNumber = (phone?: string | null) => {
    if (!phone) return "-";
    const clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) return `+62${clean.slice(1)}`;
    if (clean.startsWith("62")) return `+${clean}`;
    return phone;
  };

  const currentTabTitle = 
    activeTab === "verifikasi" ? "Verifikasi" :
    activeTab === "dashboard" ? "Dashboard Admin" :
    activeTab === "schools" ? "Kelola Komunitas & Sekolah" :
    activeTab === "locations" ? "Lokasi & Direktori Wilayah" :
    activeTab === "articles" ? "Kelola Berita" :
    activeTab === "programs" ? "Kelola Program" : "Kelola Pelatihan";

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#f3f6fb] font-sans antialiased text-slate-800">
      {/* ============================================================ */}
      {/* LEFT SIDEBAR (EXACT MATCH WITH SCREENSHOT DESIGN) */}
      {/* ============================================================ */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#0c2866] bg-gradient-to-b from-[#0e2a6d] via-[#0a2158] to-[#07173e] text-white flex flex-col justify-between shrink-0 p-5 md:min-h-screen md:sticky md:top-0 shadow-2xl z-30">
        <div className="space-y-6">
          {/* 1. Admin Profile Card */}
          <div className="space-y-3 pb-2">
            <div className="flex items-center gap-3">
              {/* Colorful M / Sinergi Badge Avatar */}
              <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md shrink-0">
                <svg viewBox="0 0 32 32" className="h-full w-full" fill="none">
                  <circle cx="16" cy="16" r="14" fill="#0d2c74" />
                  <path d="M10 10 L16 18 L22 10 L24 22 L20 22 L18 16 L16 20 L14 16 L12 22 L8 22 Z" fill="#00d2b4" />
                  <circle cx="16" cy="11" r="3" fill="#ff5a43" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white text-base leading-tight truncate">
                  {adminName}
                </h3>
                <p className="text-xs text-blue-200/80 truncate">
                  {currentAdmin?.email || "Admin@gmail.com"}
                </p>
              </div>
            </div>

            {/* Edit Profil & Log Out Buttons Row */}
            <div className="flex items-center gap-2 pt-1">
              <button 
                onClick={() => setEditProfileOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-white/90 hover:bg-white text-[#0c2866] text-xs font-bold py-1.5 px-3 shadow-sm transition active:scale-95"
              >
                <Edit3 className="h-3.5 w-3.5 text-[#0c2866]" />
                Edit Profil
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#e61e38] hover:bg-red-600 text-white text-xs font-bold py-1.5 px-3 shadow-sm transition active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log Out
              </button>
            </div>
          </div>

          {/* 2. Navigation Menu */}
          <nav className="flex flex-col gap-2 pt-2">
            {[
              { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { key: "schools", label: "Kelola Komunitas", icon: Users },
              { key: "verifikasi", label: "Verifikasi", icon: ShieldCheck },
              { key: "locations", label: "Lokasi", icon: MapPin },
              { key: "articles", label: "Kelola Berita", icon: Newspaper },
              { key: "programs", label: "Kelola Program", icon: Award },
              { key: "trainings", label: "Kelola Pelatihan", icon: GraduationCap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as Tab)}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? "bg-white text-[#0c2866] font-bold shadow-lg translate-x-1" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#0c2866]" : "text-white/80"}`} />
                  <span className="truncate">{tab.label}</span>
                  {tab.key === "verifikasi" && pendingCount > 0 && (
                    <span className={`ml-auto text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive ? "bg-[#0c2866] text-white" : "bg-red-500 text-white"
                    }`}>
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 3. Bottom Branding & Back to Website */}
        <div className="space-y-4 pt-6 mt-6 border-t border-white/10">
          {/* Logo SINERGI / BMPS */}
          <div className="flex items-center gap-2.5 px-1">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold p-1">
              <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h18" />
              </svg>
            </div>
            <div>
              <p className="font-extrabold tracking-wider text-sm text-white leading-none">SINERGI</p>
              <p className="text-[10px] text-blue-200/70 font-semibold tracking-widest uppercase mt-0.5">BMPS BOGOR</p>
            </div>
          </div>

          <Link
            href="/"
            className="w-full block text-center rounded-full bg-white hover:bg-blue-50 text-[#0c2866] font-bold text-xs py-2.5 px-4 shadow-md transition hover:scale-[1.02] active:scale-95"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================================ */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
        {/* TOP BLUE HEADER BANNER (MATCHING SCREENSHOT) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1748b6] via-[#123e9e] to-[#0c2b6e] text-white p-6 sm:p-8 shadow-lg">
          {/* Texture & Ambient Lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {currentTabTitle}
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/80 mt-1">
                Portal Manajemen & Verifikasi Lembaga Swasta BMPS Daerah Bogor
              </p>
            </div>

            {/* Quick Action Button for Content Tabs */}
            {(activeTab === "schools" || activeTab === "articles" || activeTab === "programs" || activeTab === "trainings") && (
              <button
                onClick={openCreate}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#0c2866] hover:bg-blue-50 px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md transition hover:scale-105 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Tambah Baru
              </button>
            )}
          </div>
        </div>

        {/* METRIC SUMMARY CARDS (MATCHING SCREENSHOT: "X Tertunda", "Y Diterima") */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Tertunda */}
          <div 
            onClick={() => { setActiveTab("verifikasi"); setStatusFilter("PENDING"); }}
            className="cursor-pointer rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3.5 group hover:border-amber-300"
          >
            <div className="h-10 w-10 rounded-xl bg-slate-100 group-hover:bg-amber-50 flex items-center justify-center text-slate-500 group-hover:text-amber-600 transition">
              <Clock className="h-5 w-5" />
            </div>
            <p className="font-bold text-lg sm:text-xl text-navy-deep">
              {pendingCount} Tertunda
            </p>
          </div>

          {/* Card 2: Diterima */}
          <div 
            onClick={() => { setActiveTab("verifikasi"); setStatusFilter("APPROVED"); }}
            className="cursor-pointer rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3.5 group hover:border-emerald-300"
          >
            <div className="h-10 w-10 rounded-xl bg-slate-100 group-hover:bg-emerald-50 flex items-center justify-center text-slate-500 group-hover:text-emerald-600 transition">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="font-bold text-lg sm:text-xl text-navy-deep">
              {approvedCount} Diterima
            </p>
          </div>

          {/* Card 3: Total Sekolah / Komunitas */}
          <div 
            onClick={() => setActiveTab("schools")}
            className="cursor-pointer rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3.5 group hover:border-blue-300 sm:col-span-2 lg:col-span-1"
          >
            <div className="h-10 w-10 rounded-xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center text-slate-500 group-hover:text-blue-royal transition">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="font-bold text-lg sm:text-xl text-navy-deep">
              {items.length} Total Lembaga
            </p>
          </div>
        </div>

        {/* Global Alert Notification */}
        {message && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/90 p-4 text-sm font-semibold text-navy-deep flex items-center justify-between shadow-sm">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB CONTENT 1: VERIFIKASI (EXACT TABLE FROM SCREENSHOT) */}
        {/* ============================================================ */}
        {activeTab === "verifikasi" && (
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
            {/* Filter & Search Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
              {/* Dropdown Select Status (e.g. Tertunda ▾) */}
              <div className="relative inline-block w-44">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "ALL" | "PENDING" | "APPROVED" | "REJECTED")}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-navy-deep shadow-sm focus:border-blue-royal focus:outline-none cursor-pointer pr-9"
                >
                  <option value="PENDING">Tertunda</option>
                  <option value="APPROVED">Diterima</option>
                  <option value="REJECTED">Ditolak</option>
                  <option value="ALL">Semua Status</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>

              {/* Search Bar (Matching screenshot search bar style) */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama, NPSN, sekolah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-transparent bg-slate-100/90 pl-9 pr-4 py-2 text-sm text-navy-deep placeholder-slate-400 focus:bg-white focus:border-blue-royal focus:outline-none transition"
                />
              </div>
            </div>

            {/* Table (Columns: Nama | Alamat | No Telepon | Komunitas | Action) */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#eef4fc] text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 rounded-tl-xl">Nama</th>
                    <th className="p-4">Alamat</th>
                    <th className="p-4">No Telepon</th>
                    <th className="p-4">Komunitas</th>
                    <th className="p-4 text-center rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                        <LoaderCircle className="h-6 w-6 animate-spin mx-auto text-blue-royal mb-2" />
                        Memuat data pendaftaran...
                      </td>
                    </tr>
                  ) : filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((item) => {
                      const waLink = buildWhatsAppLink(item.whatsapp || item.phone);
                      const formattedPhone = formatPhoneNumber(item.whatsapp || item.phone);
                      const communityName = item.foundationName || item.name;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* 1. Nama PIC / Pendaftar */}
                          <td className="p-4 font-semibold text-navy-deep">
                            <div>
                              <p>{item.picName || item.name}</p>
                              {item.picRole && (
                                <p className="text-xs text-slate-400 font-normal">{item.picRole}</p>
                              )}
                            </div>
                          </td>

                          {/* 2. Alamat */}
                          <td className="p-4 text-slate-600 max-w-[240px]">
                            <p className="line-clamp-2 text-xs leading-relaxed">
                              {item.address || `${item.district}, ${item.city}`}
                            </p>
                          </td>

                          {/* 3. No Telepon / WhatsApp */}
                          <td className="p-4 text-slate-700 whitespace-nowrap text-xs font-medium">
                            {waLink ? (
                              <a 
                                href={waLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                                title="Buka WhatsApp"
                              >
                                <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                                {formattedPhone}
                              </a>
                            ) : (
                              formattedPhone
                            )}
                          </td>

                          {/* 4. Komunitas / Sekolah */}
                          <td className="p-4">
                            <span 
                              onClick={() => openRegistration(item.id)}
                              className="font-bold text-[#0c2866] hover:text-blue-royal cursor-pointer text-xs uppercase tracking-wide block truncate max-w-[200px]"
                              title={item.name}
                            >
                              {item.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate">
                              {communityName !== item.name ? communityName : `NPSN: ${item.npsn}`}
                            </span>
                          </td>

                          {/* 5. Action Buttons (Terima / Tolak / Detail) */}
                          <td className="p-4 text-center whitespace-nowrap">
                            <div className="inline-flex items-center justify-center gap-2">
                              {item.status === "PENDING" || item.status === "UNDER_REVIEW" ? (
                                <>
                                  {/* Terima Button (Green Pill) */}
                                  <button
                                    onClick={() => decide(item.id, "APPROVE")}
                                    disabled={decisionLoading}
                                    className="rounded-full bg-[#009b4d] hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-4 py-1.5 shadow-sm transition disabled:opacity-50"
                                  >
                                    Terima
                                  </button>

                                  {/* Tolak Button (Pink/Red Pill) */}
                                  <button
                                    onClick={() => decide(item.id, "REJECT")}
                                    disabled={decisionLoading}
                                    className="rounded-full bg-[#e6838d] hover:bg-red-600 active:scale-95 text-white font-bold text-xs px-4 py-1.5 shadow-sm transition disabled:opacity-50"
                                  >
                                    Tolak
                                  </button>
                                </>
                              ) : (
                                <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                                  item.status === "APPROVED" 
                                    ? "bg-emerald-100 text-emerald-800" 
                                    : "bg-red-100 text-red-700"
                                }`}>
                                  {item.status === "APPROVED" ? "Diterima" : "Ditolak"}
                                </span>
                              )}

                              {/* View Detail Button */}
                              <button
                                onClick={() => openRegistration(item.id)}
                                className="rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1.5 transition"
                                title="Lihat Detail Lengkap"
                              >
                                Detail
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                        Tidak ada data pendaftaran yang sesuai dengan filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB CONTENT 2: DASHBOARD OVERVIEW */}
        {/* ============================================================ */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendaftaran Masuk</p>
                <p className="text-2xl font-extrabold text-navy-deep mt-1">{items.length}</p>
                <p className="text-xs text-emerald-600 font-semibold mt-2">Total pengajuan masuk</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sekolah Terverifikasi</p>
                <p className="text-2xl font-extrabold text-navy-deep mt-1">{approvedCount}</p>
                <p className="text-xs text-blue-royal font-semibold mt-2">Tampil di direktori publik</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menunggu Keputusan</p>
                <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
                <p className="text-xs text-slate-500 font-semibold mt-2">Perlu ditindaklanjuti</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Akun Pending</p>
                <p className="text-2xl font-extrabold text-navy-deep mt-1">{accounts.length}</p>
                <p className="text-xs text-slate-500 font-semibold mt-2">Menunggu aktivasi</p>
              </div>
            </div>

            {/* Account Approvals Queue */}
            {accounts.length > 0 && (
              <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm">
                <h3 className="font-bold text-navy-deep text-lg mb-4">Akun Sekolah Menunggu Verifikasi</h3>
                <div className="space-y-3">
                  {accounts.map((acc) => (
                    <div key={acc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 gap-3">
                      <div>
                        <p className="font-bold text-navy-deep">{acc.name}</p>
                        <p className="text-xs text-slate-500">{acc.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => decideAccount(acc.id, "APPROVED")} className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 shadow-sm transition">
                          Terima
                        </button>
                        <button onClick={() => decideAccount(acc.id, "REJECTED")} className="rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-1.5 shadow-sm transition">
                          Tolak
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB CONTENT 3: KELOLA SEKOLAH & KOMUNITAS */}
        {/* ============================================================ */}
        {activeTab === "schools" && (
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
              <h2 className="font-bold text-navy-deep text-lg">Direktori Sekolah & Yayasan</h2>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-full bg-[#0c2866] hover:bg-blue-royal text-white text-xs font-bold px-4 py-2 shadow-sm transition"
              >
                <Plus className="h-4 w-4" />
                Tambah Sekolah / Yayasan
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-[#eef4fc] text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 rounded-tl-xl">Sekolah / Yayasan</th>
                    <th className="p-4">NPSN & Jenjang</th>
                    <th className="p-4">Kontak & WhatsApp</th>
                    <th className="p-4">Media Sosial</th>
                    <th className="p-4 text-center rounded-tr-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schools.length > 0 ? (
                    schools.map((item) => {
                      const wa = buildWhatsAppLink(item.whatsapp || item.phone);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 max-w-[280px]">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                                {item.schoolPhotoUrl || item.logoUrl ? (
                                  <Image src={item.schoolPhotoUrl || item.logoUrl || ""} alt={item.name} fill className="object-cover" unoptimized />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                                    <Building2 className="h-6 w-6" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <Link href={`/sekolah/${item.slug}`} target="_blank" className="font-bold text-navy-deep hover:text-blue-royal truncate block">
                                  {item.name}
                                </Link>
                                {item.foundation?.name && (
                                  <p className="text-xs text-slate-500 truncate">Yayasan: {item.foundation.name}</p>
                                )}
                                <p className="text-[11px] text-slate-400 truncate">{item.district || item.city || "Bogor"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-navy-deep text-xs">{item.npsn || "—"}</span>
                            <div className="mt-1">
                              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-royal">
                                {schoolLevelLabel(item.level)}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            {wa ? (
                              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100">
                                <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                                {item.whatsapp || item.phone}
                              </a>
                            ) : item.phone ? (
                              <span className="text-xs text-slate-600">{item.phone}</span>
                            ) : (
                              <span className="text-xs text-slate-400">Belum ada</span>
                            )}
                            {item.email && <p className="text-xs text-slate-500 mt-1 truncate max-w-[140px]">{item.email}</p>}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              {item.instagram && (
                                <a href={item.instagram.startsWith("http") ? item.instagram : `https://instagram.com/${item.instagram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100" title="Instagram">
                                  <InstagramIcon className="h-4 w-4" />
                                </a>
                              )}
                              {item.facebook && (
                                <a href={item.facebook.startsWith("http") ? item.facebook : `https://facebook.com/${item.facebook}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="Facebook">
                                  <FacebookIcon className="h-4 w-4" />
                                </a>
                              )}
                              {item.youtube && (
                                <a href={item.youtube.startsWith("http") ? item.youtube : `https://youtube.com/${item.youtube}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="YouTube">
                                  <YoutubeIcon className="h-4 w-4" />
                                </a>
                              )}
                              {item.tiktok && (
                                <a href={item.tiktok.startsWith("http") ? item.tiktok : `https://tiktok.com/@${item.tiktok.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200" title="TikTok">
                                  <TikTokIcon className="h-4 w-4" />
                                </a>
                              )}
                              {item.website && (
                                <a href={item.website} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-blue-50 text-blue-royal hover:bg-blue-100" title="Website">
                                  <Globe className="h-4 w-4" />
                                </a>
                              )}
                              {!item.instagram && !item.facebook && !item.youtube && !item.tiktok && !item.website && (
                                <span className="text-xs text-slate-400">—</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <button onClick={() => openEdit(item)} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                                Edit
                              </button>
                              <button onClick={() => handleDelete(item.id, "schools")} className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100 transition">
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                        Belum ada data sekolah terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB CONTENT 4: LOKASI & WILAYAH BOGOR */}
        {/* ============================================================ */}
        {activeTab === "locations" && (
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
            <h2 className="font-bold text-navy-deep text-lg">Distribusi Lembaga per Wilayah / Kecamatan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {districts.map((d) => (
                <div key={d.district} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 hover:bg-blue-50/40 transition">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-royal" />
                    <p className="font-bold text-navy-deep">{d.district}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Total Pendaftar: <b>{d.total}</b></span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {d.approved} Terverifikasi
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB CONTENT 5: KELOLA BERITA */}
        {/* ============================================================ */}
        {activeTab === "articles" && (
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="font-bold text-navy-deep text-lg">Kelola Berita & Publikasi</h2>
              <button onClick={openCreate} className="rounded-full bg-[#0c2866] hover:bg-blue-royal text-white text-xs font-bold px-4 py-2 shadow-sm transition flex items-center gap-1.5">
                <Plus className="h-4 w-4" /> Tambah Berita
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-[#eef4fc] text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 rounded-tl-xl">Judul Berita</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center rounded-tr-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.length > 0 ? (
                    articles.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-semibold text-navy-deep max-w-[300px] truncate">{item.title}</td>
                        <td className="p-4 text-xs text-slate-600 font-semibold">{item.category?.name || "Umum"}</td>
                        <td className="p-4">
                          <span className="rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex gap-1.5">
                            <button onClick={() => openEdit(item)} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100">Edit</button>
                            <button onClick={() => handleDelete(item.id, "articles")} className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400 italic">Belum ada berita.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB CONTENT 6: KELOLA PROGRAM */}
        {/* ============================================================ */}
        {activeTab === "programs" && (
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="font-bold text-navy-deep text-lg">Kelola Program BMPS</h2>
              <button onClick={openCreate} className="rounded-full bg-[#0c2866] hover:bg-blue-royal text-white text-xs font-bold px-4 py-2 shadow-sm transition flex items-center gap-1.5">
                <Plus className="h-4 w-4" /> Tambah Program
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-[#eef4fc] text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 rounded-tl-xl">Judul Program</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center rounded-tr-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {programs.length > 0 ? (
                    programs.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-semibold text-navy-deep max-w-[300px] truncate">{item.title}</td>
                        <td className="p-4 text-xs text-slate-600 font-semibold">{item.category}</td>
                        <td className="p-4">
                          <span className="rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex gap-1.5">
                            <button onClick={() => openEdit(item)} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100">Edit</button>
                            <button onClick={() => handleDelete(item.id, "programs")} className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400 italic">Belum ada program.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB CONTENT 7: KELOLA PELATIHAN */}
        {/* ============================================================ */}
        {activeTab === "trainings" && (
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="font-bold text-navy-deep text-lg">Kelola Pelatihan BMPS</h2>
              <button onClick={openCreate} className="rounded-full bg-[#0c2866] hover:bg-blue-royal text-white text-xs font-bold px-4 py-2 shadow-sm transition flex items-center gap-1.5">
                <Plus className="h-4 w-4" /> Tambah Pelatihan
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-[#eef4fc] text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 rounded-tl-xl">Judul Pelatihan</th>
                    <th className="p-4">Lokasi</th>
                    <th className="p-4">Kuota</th>
                    <th className="p-4 text-center rounded-tr-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trainings.length > 0 ? (
                    trainings.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-semibold text-navy-deep max-w-[280px] truncate">{item.title}</td>
                        <td className="p-4 text-xs text-slate-600">{item.location}</td>
                        <td className="p-4 text-xs font-bold text-navy-deep">{item.quota} Peserta</td>
                        <td className="p-4 text-center">
                          <div className="inline-flex gap-1.5">
                            <button onClick={() => openEdit(item)} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100">Edit</button>
                            <button onClick={() => handleDelete(item.id, "trainings")} className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400 italic">Belum ada pelatihan.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL 1: DETAIL PENDAFTARAN (VERIFIKASI) */}
      {/* ============================================================ */}
      {selectedRegistration && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-royal">Detail Pendaftaran</p>
                <h2 className="mt-1 text-2xl font-bold text-navy-deep">{selectedRegistration.name}</h2>
                <p className="mt-1 text-xs text-slate-500">{selectedRegistration.registrationNumber} · {selectedRegistration.status}</p>
              </div>
              <button onClick={() => setSelectedRegistration(null)} disabled={decisionLoading} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 py-5 text-sm sm:grid-cols-2">
              <DetailGroup title="Data Lembaga" values={[
                ["NPSN", selectedRegistration.npsn],
                ["Jenis Lembaga", selectedRegistration.institutionType === "YAYASAN" ? "Yayasan" : "Sekolah"],
                ["Jenjang", selectedRegistration.level],
                ["Nama Yayasan", selectedRegistration.foundationName],
                ["Kepala Sekolah", selectedRegistration.principalName],
                ["Tanggal Daftar", formatDate(selectedRegistration.createdAt)],
                ["Tanggal Review", selectedRegistration.reviewedAt ? formatDate(selectedRegistration.reviewedAt) : null],
              ]} />
              <DetailGroup title="Penanggung Jawab" values={[
                ["Nama PIC", selectedRegistration.picName],
                ["Jabatan", selectedRegistration.picRole],
                ["Email", selectedRegistration.email],
                ["Telepon/WA", selectedRegistration.phone],
              ]} />
              <DetailGroup title="Alamat" values={[
                ["Alamat Lengkap", selectedRegistration.address],
                ["Desa/Kelurahan", selectedRegistration.ward],
                ["Kecamatan", selectedRegistration.district],
                ["Kota/Kabupaten", selectedRegistration.city],
                ["Kode Pos", selectedRegistration.postalCode],
              ]} />
              <DetailGroup title="Kontak & Media Sosial" values={[
                ["Nomor WhatsApp", selectedRegistration.whatsapp || selectedRegistration.phone],
                ["Instagram", selectedRegistration.instagram],
                ["Facebook", selectedRegistration.facebook],
                ["YouTube", selectedRegistration.youtube],
                ["TikTok", selectedRegistration.tiktok],
                ["Website", selectedRegistration.website],
              ]} />
            </div>

            {selectedRegistration.schoolPhotoUrl && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 mb-2">Foto Sekolah</p>
                <div className="relative aspect-[16/9] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <Image src={selectedRegistration.schoolPhotoUrl} alt={`Foto ${selectedRegistration.name}`} fill className="object-cover" unoptimized />
                </div>
              </div>
            )}

            {/* Decision Action Footer */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100 pt-4">
              <button onClick={() => setSelectedRegistration(null)} className="rounded-full border border-slate-200 px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
                Tutup
              </button>
              {(selectedRegistration.status === "PENDING" || selectedRegistration.status === "UNDER_REVIEW") && (
                <>
                  <button onClick={() => decide(selectedRegistration.id, "REJECT")} disabled={decisionLoading} className="rounded-full bg-red-600 hover:bg-red-700 text-white px-5 py-2 text-xs font-bold shadow-sm">
                    Tolak Pendaftaran
                  </button>
                  <button onClick={() => decide(selectedRegistration.id, "APPROVE")} disabled={decisionLoading} className="rounded-full bg-[#009b4d] hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold shadow-sm">
                    Terima & Terbitkan
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: EDIT PROFIL ADMIN */}
      {/* ============================================================ */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-navy-deep text-lg">Edit Profil Administrator</h3>
              <button onClick={() => setEditProfileOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500">Nama Admin</label>
                <input required value={adminName} onChange={(e) => setAdminName(e.target.value)} className="rounded-xl border border-slate-200 p-2.5 text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500">Password Baru (Kosongkan jika tidak diubah)</label>
                <input type="password" placeholder="Minimal 6 karakter" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="rounded-xl border border-slate-200 p-2.5 text-sm" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setEditProfileOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600">Batal</button>
                <button type="submit" className="rounded-full bg-[#0c2866] hover:bg-blue-royal text-white px-5 py-2 text-xs font-bold shadow-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: CRUD DIALOG MODAL (SEKOLAH / BERITA / PROGRAM / PELATIHAN) */}
      {/* ============================================================ */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-navy-deep text-lg">
                {modalMode === "create" ? "Tambah Baru" : "Edit Data"} {activeTab === "schools" ? "Sekolah / Yayasan" : activeTab === "articles" ? "Berita" : activeTab === "programs" ? "Program" : "Pelatihan"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* 1. SCHOOL FORM */}
              {activeTab === "schools" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Nama Sekolah / Yayasan *</label>
                      <input required value={schoolForm.name} onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Contoh: SMA BMPS Bogor" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">NPSN (8 digit) *</label>
                      <input required value={schoolForm.npsn} onChange={(e) => setSchoolForm({ ...schoolForm, npsn: e.target.value.replace(/\D/g, "").slice(0, 8) })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Contoh: 20210001" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Jenjang *</label>
                      <select value={schoolForm.level} onChange={(e) => setSchoolForm({ ...schoolForm, level: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm">
                        {["TK", "SD", "MI", "SMP", "MTs", "SMA", "SMK", "MA", "OTHER"].map((lvl) => (
                          <option key={lvl} value={lvl}>{schoolLevelLabel(lvl)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Jenis Lembaga</label>
                      <select value={schoolForm.institutionType} onChange={(e) => setSchoolForm({ ...schoolForm, institutionType: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm">
                        <option value="SEKOLAH">Sekolah</option>
                        <option value="YAYASAN">Yayasan</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Nama Yayasan</label>
                      <input value={schoolForm.foundationName} onChange={(e) => setSchoolForm({ ...schoolForm, foundationName: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Contoh: Yayasan Al-Ikhlas" />
                    </div>
                  </div>

                  {/* WhatsApp & Telepon */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4 text-emerald-600" />
                      Kontak WhatsApp & Telepon
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">Nomor WhatsApp Resmi (Tombol Chat)</label>
                        <input value={schoolForm.whatsapp} onChange={(e) => setSchoolForm({ ...schoolForm, whatsapp: e.target.value })} className="rounded-xl border border-slate-200 bg-white p-2 text-sm" placeholder="081234567890" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">Nomor Telepon Kantor</label>
                        <input value={schoolForm.phone} onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })} className="rounded-xl border border-slate-200 bg-white p-2 text-sm" placeholder="0251-123456" />
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="rounded-2xl border border-blue-100 bg-slate-50/70 p-3.5 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-navy-deep flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-blue-royal" />
                      Akun Media Sosial & Website
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">Website</label>
                        <input value={schoolForm.website} onChange={(e) => setSchoolForm({ ...schoolForm, website: e.target.value })} className="rounded-xl border border-slate-200 bg-white p-2 text-sm" placeholder="https://..." />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">Instagram (@username atau link)</label>
                        <input value={schoolForm.instagram} onChange={(e) => setSchoolForm({ ...schoolForm, instagram: e.target.value })} className="rounded-xl border border-slate-200 bg-white p-2 text-sm" placeholder="@sekolah_bogor" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">Facebook</label>
                        <input value={schoolForm.facebook} onChange={(e) => setSchoolForm({ ...schoolForm, facebook: e.target.value })} className="rounded-xl border border-slate-200 bg-white p-2 text-sm" placeholder="https://facebook.com/..." />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">YouTube Channel</label>
                        <input value={schoolForm.youtube} onChange={(e) => setSchoolForm({ ...schoolForm, youtube: e.target.value })} className="rounded-xl border border-slate-200 bg-white p-2 text-sm" placeholder="@channelsekolah" />
                      </div>
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-600">TikTok</label>
                        <input value={schoolForm.tiktok} onChange={(e) => setSchoolForm({ ...schoolForm, tiktok: e.target.value })} className="rounded-xl border border-slate-200 bg-white p-2 text-sm" placeholder="@sekolahbogor" />
                      </div>
                    </div>
                  </div>

                  {/* Foto Sekolah */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500">Foto Sekolah / Logo</label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input value={schoolForm.schoolPhotoUrl} onChange={(e) => setSchoolForm({ ...schoolForm, schoolPhotoUrl: e.target.value })} className="flex-1 rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="URL Foto Sekolah atau upload di samping &rarr;" />
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200">
                        {photoUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                        {photoUploading ? "Mengunggah..." : "Pilih File..."}
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} disabled={photoUploading} />
                      </label>
                    </div>
                    {schoolForm.schoolPhotoUrl && (
                      <div className="relative mt-2 h-24 w-36 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        <Image src={schoolForm.schoolPhotoUrl} alt="Preview Foto" fill className="object-cover" unoptimized />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Kecamatan</label>
                      <input value={schoolForm.district} onChange={(e) => setSchoolForm({ ...schoolForm, district: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Contoh: Bogor Tengah" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Kota / Kabupaten</label>
                      <input value={schoolForm.city} onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Contoh: Kota Bogor" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Alamat Lengkap</label>
                    <textarea value={schoolForm.address} onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })} rows={2} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Jl. Raya No..." />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Deskripsi / Profil Singkat</label>
                    <textarea value={schoolForm.description} onChange={(e) => setSchoolForm({ ...schoolForm, description: e.target.value })} rows={3} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Ceritakan profil, keunggulan sekolah..." />
                  </div>
                </>
              )}

              {/* 2. ARTICLE FORM */}
              {activeTab === "articles" && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Judul Berita</label>
                    <input required value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Judul berita..." />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Kategori</label>
                    <select value={articleForm.categoryName} onChange={(e) => setArticleForm({ ...articleForm, categoryName: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm">
                      <option value="Kegiatan">Kegiatan</option>
                      <option value="Pelatihan">Pelatihan</option>
                      <option value="Beasiswa">Beasiswa</option>
                      <option value="Kemitraan">Kemitraan</option>
                      <option value="Organisasi">Organisasi</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">URL Gambar Thumbnail</label>
                    <input value={articleForm.thumbnailUrl} onChange={(e) => setArticleForm({ ...articleForm, thumbnailUrl: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="https://images.unsplash.com/..." />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Isi Konten Berita</label>
                    <textarea required value={articleForm.content} onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })} rows={5} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Ketik isi lengkap berita..." />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Status</label>
                    <select value={articleForm.status} onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm">
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  </div>
                </>
              )}

              {/* 3. PROGRAM FORM */}
              {activeTab === "programs" && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Judul Program</label>
                    <input required value={programForm.title} onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Judul program..." />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Kategori</label>
                    <input required value={programForm.category} onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Pendidikan, Manajemen, dll." />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">URL Gambar Banner</label>
                    <input value={programForm.thumbnailUrl} onChange={(e) => setProgramForm({ ...programForm, thumbnailUrl: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="https://images.unsplash.com/..." />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Deskripsi Program</label>
                    <textarea required value={programForm.description} onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })} rows={5} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Tulis rincian program..." />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Status</label>
                    <select value={programForm.status} onChange={(e) => setProgramForm({ ...programForm, status: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm">
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  </div>
                </>
              )}

              {/* 4. TRAINING FORM */}
              {activeTab === "trainings" && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Judul Pelatihan</label>
                    <input required value={trainingForm.title} onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Judul pelatihan..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Lokasi</label>
                      <input required value={trainingForm.location} onChange={(e) => setTrainingForm({ ...trainingForm, location: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Lokasi kegiatan..." />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Speaker</label>
                      <input required value={trainingForm.speaker} onChange={(e) => setTrainingForm({ ...trainingForm, speaker: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Nama speaker..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Tanggal</label>
                      <input required type="date" value={trainingForm.startDate} onChange={(e) => setTrainingForm({ ...trainingForm, startDate: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Kuota</label>
                      <input required type="number" value={trainingForm.quota} onChange={(e) => setTrainingForm({ ...trainingForm, quota: parseInt(e.target.value) || 50 })} className="rounded-xl border border-slate-200 p-2.5 text-sm" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">URL Gambar</label>
                    <input value={trainingForm.thumbnailUrl} onChange={(e) => setTrainingForm({ ...trainingForm, thumbnailUrl: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="https://..." />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Deskripsi Pelatihan</label>
                    <textarea required value={trainingForm.description} onChange={(e) => setTrainingForm({ ...trainingForm, description: e.target.value })} rows={4} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Tulis rincian pelatihan..." />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Status</label>
                    <select value={trainingForm.status} onChange={(e) => setTrainingForm({ ...trainingForm, status: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm">
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  </div>
                </>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Batal</button>
                <button type="submit" className="rounded-full bg-[#0c2866] hover:bg-blue-royal px-6 py-2.5 text-xs font-bold text-white shadow-sm">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(value: string) { return new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }); }
function DetailGroup({ title, values }: { title: string; values: Array<[string, string | null | undefined]> }) { 
  return (
    <section>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{title}</h3>
      <dl className="space-y-2">
        {values.filter(([, value]) => value).map(([label, value]) => (
          <div key={label}>
            <dt className="text-slate-400 text-xs">{label}</dt>
            <dd className="whitespace-pre-wrap font-semibold text-slate-800 text-sm">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  ); 
}
