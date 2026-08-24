"use client";
import { useEffect, useState } from "react";

type Registration = { id: string; registrationNumber: string; name: string; npsn: string; email: string; status: string; createdAt: string; rejectionReason?: string | null };
type Article = { id: string; title: string; content: string; thumbnailUrl?: string | null; category?: { name: string } | null; status: string; publishedAt?: string | null };
type Program = { id: string; title: string; description: string; thumbnailUrl?: string | null; category: string; status: string };
type Training = { id: string; title: string; description: string; thumbnailUrl?: string | null; location: string; startDate: string; quota: number; speaker: string; status: string };

type Tab = "registrations" | "articles" | "programs" | "trainings";

export default function AdminRegistrations() {
  const [activeTab, setActiveTab] = useState<Tab>("registrations");
  
  // Registration States
  const [items, setItems] = useState<Registration[]>([]);
  const [accounts, setAccounts] = useState<{ id: string; name: string; email: string }[]>([]);
  
  // CRUD Lists
  const [articles, setArticles] = useState<Article[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);

  // UI States
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editId, setEditId] = useState<string | null>(null);

  // Form States
  const [articleForm, setArticleForm] = useState({ title: "", content: "", categoryName: "Kegiatan", thumbnailUrl: "", status: "PUBLISHED" });
  const [programForm, setProgramForm] = useState({ title: "", description: "", category: "Pendidikan", thumbnailUrl: "", status: "PUBLISHED" });
  const [trainingForm, setTrainingForm] = useState({ title: "", description: "", location: "", startDate: "", quota: 50, speaker: "Pembicara Utama", thumbnailUrl: "", status: "PUBLISHED" });

  async function loadData() {
    setLoading(true);
    setMessage("");
    try {
      if (activeTab === "registrations") {
        const resReg = await fetch("/api/admin/registrations");
        const dataReg = await resReg.json();
        if (resReg.ok) setItems(dataReg.data || []);
        
        const resUser = await fetch("/api/admin/users");
        const dataUser = await resUser.json();
        if (resUser.ok) setAccounts(dataUser.data || []);
      } else {
        const res = await fetch(`/api/admin/content/${activeTab}`);
        const data = await res.json();
        if (res.ok) {
          if (activeTab === "articles") setArticles(data.data || []);
          if (activeTab === "programs") setPrograms(data.data || []);
          if (activeTab === "trainings") setTrainings(data.data || []);
        } else {
          setMessage(data.message || "Gagal memuat data.");
        }
      }
    } catch {
      setMessage("Terjadi kesalahan koneksi saat memuat data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Deciding school registration
  async function decide(id: string, action: "APPROVE" | "REJECT") {
    const rejectionReason = action === "REJECT" ? window.prompt("Alasan penolakan (wajib):") : undefined;
    if (action === "REJECT" && !rejectionReason?.trim()) return;
    const res = await fetch(`/api/admin/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action === "APPROVE" ? { action } : { status: "REJECTED", rejectionReason })
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.message ?? "Keputusan gagal disimpan.");
    } else {
      await loadData();
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

  // Delete resource item
  async function handleDelete(id: string) {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini secara permanen?")) return;
    try {
      const res = await fetch(`/api/admin/content/${activeTab}/${id}`, { method: "DELETE" });
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

  // Submit create or edit form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = activeTab === "articles" ? articleForm : activeTab === "programs" ? programForm : trainingForm;
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
  function openEdit(item: any) {
    setModalMode("edit");
    setEditId(item.id);
    if (activeTab === "articles") {
      setArticleForm({
        title: item.title,
        content: item.content,
        categoryName: item.category?.name || "Kegiatan",
        thumbnailUrl: item.thumbnailUrl || "",
        status: item.status
      });
    } else if (activeTab === "programs") {
      setProgramForm({
        title: item.title,
        description: item.description,
        category: item.category,
        thumbnailUrl: item.thumbnailUrl || "",
        status: item.status
      });
    } else if (activeTab === "trainings") {
      setTrainingForm({
        title: item.title,
        description: item.description,
        location: item.location,
        startDate: item.startDate ? item.startDate.split("T")[0] : "",
        quota: item.quota,
        speaker: item.speaker,
        thumbnailUrl: item.thumbnailUrl || "",
        status: item.status
      });
    }
    setModalOpen(true);
  }

  // Open Create Modal
  function openCreate() {
    setModalMode("create");
    setEditId(null);
    if (activeTab === "articles") {
      setArticleForm({ title: "", content: "", categoryName: "Kegiatan", thumbnailUrl: "", status: "PUBLISHED" });
    } else if (activeTab === "programs") {
      setProgramForm({ title: "", description: "", category: "Pendidikan", thumbnailUrl: "", status: "PUBLISHED" });
    } else if (activeTab === "trainings") {
      setTrainingForm({ title: "", description: "", location: "", startDate: "", quota: 50, speaker: "Pembicara Utama", thumbnailUrl: "", status: "PUBLISHED" });
    }
    setModalOpen(true);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-royal">Panel Administrator</p>
          <h1 className="mt-1 text-3xl font-extrabold text-navy-deep">Manajemen Portal BMPS</h1>
        </div>
        {activeTab !== "registrations" && (
          <button 
            onClick={openCreate} 
            className="font-display inline-flex h-[44px] items-center justify-center rounded-xl bg-navy px-5 text-sm font-semibold text-white transition hover:bg-blue-royal"
          >
            Tambah Baru
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        {[
          { key: "registrations", label: "Pendaftaran & Akun" },
          { key: "articles", label: "Kelola Berita" },
          { key: "programs", label: "Kelola Program" },
          { key: "trainings", label: "Kelola Pelatihan" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as Tab)}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
              activeTab === tab.key 
                ? "border-blue-royal text-blue-royal" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {message}
        </div>
      )}

      {/* Tab Content Rendering */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 font-semibold">Memuat Data...</div>
      ) : (
        <>
          {/* TAB 1: REGISTRATIONS */}
          {activeTab === "registrations" && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Account Registrations Queue */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-navy-deep">Akun Menunggu Verifikasi</h2>
                <div className="mt-4 space-y-3">
                  {accounts.length ? (
                    accounts.map((account) => (
                      <div key={account.id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between border border-slate-100">
                        <span>
                          <b className="text-navy-deep">{account.name}</b>
                          <br />
                          <small className="text-slate-500">{account.email}</small>
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => decideAccount(account.id, "APPROVED")} className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700">Terima</button>
                          <button onClick={() => decideAccount(account.id, "REJECTED")} className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700">Tolak</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">Tidak ada antrean verifikasi akun saat ini.</p>
                  )}
                </div>
              </div>

              {/* School Registrations Queue */}
              <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                    <tr>
                      <th className="p-4 font-bold">Pendaftar</th>
                      <th className="p-4 font-bold">NPSN</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Tanggal</th>
                      <th className="p-4 font-bold">Keputusan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length ? (
                      items.map((item) => (
                        <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="p-4">
                            <p className="font-semibold text-navy-deep">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.registrationNumber}</p>
                          </td>
                          <td className="p-4 text-slate-600">{item.npsn}</td>
                          <td className="p-4">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              item.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" :
                              item.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                            }`}>{item.status}</span>
                          </td>
                          <td className="p-4 text-slate-500">{new Date(item.createdAt).toLocaleDateString("id-ID")}</td>
                          <td className="p-4">
                            {item.status === "PENDING" || item.status === "UNDER_REVIEW" ? (
                              <div className="flex gap-2">
                                <button onClick={() => decide(item.id, "APPROVE")} className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700">Terima</button>
                                <button onClick={() => decide(item.id, "REJECT")} className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700">Tolak</button>
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-4 text-center text-slate-500 italic" colSpan={5}>Belum ada berkas pendaftaran sekolah terdaftar.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ARTICLES (BERITA) */}
          {activeTab === "articles" && (
            <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-sm animate-fade-in-up">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                  <tr>
                    <th className="p-4 font-bold">Judul Berita</th>
                    <th className="p-4 font-bold">Kategori</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Tanggal Rilis</th>
                    <th className="p-4 font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.length ? (
                    articles.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="p-4 max-w-[280px]">
                          <p className="font-semibold text-navy-deep truncate">{item.title}</p>
                          <p className="text-xs text-slate-500 truncate">{item.content.substring(0, 60)}...</p>
                        </td>
                        <td className="p-4 text-slate-600 font-semibold">{item.category?.name || "Umum"}</td>
                        <td className="p-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            item.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                          }`}>{item.status}</span>
                        </td>
                        <td className="p-4 text-slate-500">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("id-ID") : "—"}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(item)} className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-4 text-center text-slate-500 italic" colSpan={5}>Belum ada berita dibuat.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: PROGRAMS */}
          {activeTab === "programs" && (
            <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-sm animate-fade-in-up">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                  <tr>
                    <th className="p-4 font-bold">Judul Program</th>
                    <th className="p-4 font-bold">Kategori</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.length ? (
                    programs.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="p-4">
                          <p className="font-semibold text-navy-deep">{item.title}</p>
                          <p className="text-xs text-slate-500 max-w-sm truncate">{item.description}</p>
                        </td>
                        <td className="p-4 text-slate-600 font-semibold">{item.category}</td>
                        <td className="p-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            item.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                          }`}>{item.status}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(item)} className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-4 text-center text-slate-500 italic" colSpan={4}>Belum ada program dibuat.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: TRAININGS */}
          {activeTab === "trainings" && (
            <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-sm animate-fade-in-up">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                  <tr>
                    <th className="p-4 font-bold">Judul Pelatihan</th>
                    <th className="p-4 font-bold">Lokasi</th>
                    <th className="p-4 font-bold">Kuota</th>
                    <th className="p-4 font-bold">Tanggal</th>
                    <th className="p-4 font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.length ? (
                    trainings.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="p-4">
                          <p className="font-semibold text-navy-deep">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.speaker}</p>
                        </td>
                        <td className="p-4 text-slate-600">{item.location}</td>
                        <td className="p-4 text-slate-500 font-bold">{item.quota} orang</td>
                        <td className="p-4 text-slate-500">{new Date(item.startDate).toLocaleDateString("id-ID")}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(item)} className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-4 text-center text-slate-500 italic" colSpan={5}>Belum ada pelatihan dibuat.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* CRUD FORM DIALOG MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[85vh] border border-slate-100">
            <h3 className="font-display text-xl font-bold text-navy-deep border-b border-slate-100 pb-3">
              {modalMode === "create" ? "Tambah Baru" : "Edit Item"}
            </h3>
            
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Form Input fields dynamically dependent on active tab */}
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
                    <label className="text-xs font-bold text-slate-500">URL Gambar Thumbnail (Unsplash/Web URL)</label>
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
                    <label className="text-xs font-bold text-slate-500">Deskripsi / Penjelasan Program</label>
                    <textarea required value={programForm.description} onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })} rows={5} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Tulis rincian program..." />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Status</label>
                    <select value={programForm.status} onChange={(e) => setProgramForm({ ...programForm, status: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm">
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived (Closed)</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === "trainings" && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Judul Pelatihan</label>
                    <input required value={trainingForm.title} onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Judul pelatihan..." />
                  </div>
                  <div className="flex grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Lokasi</label>
                      <input required value={trainingForm.location} onChange={(e) => setTrainingForm({ ...trainingForm, location: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Lokasi kegiatan..." />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Speaker / Pembicara</label>
                      <input required value={trainingForm.speaker} onChange={(e) => setTrainingForm({ ...trainingForm, speaker: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="Nama speaker..." />
                    </div>
                  </div>
                  <div className="flex grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Tanggal Pelaksanaan</label>
                      <input required type="date" value={trainingForm.startDate} onChange={(e) => setTrainingForm({ ...trainingForm, startDate: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Kuota Peserta</label>
                      <input required type="number" value={trainingForm.quota} onChange={(e) => setTrainingForm({ ...trainingForm, quota: parseInt(e.target.value) || 50 })} className="rounded-xl border border-slate-200 p-2.5 text-sm" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">URL Gambar Banner</label>
                    <input value={trainingForm.thumbnailUrl} onChange={(e) => setTrainingForm({ ...trainingForm, thumbnailUrl: e.target.value })} className="rounded-xl border border-slate-200 p-2.5 text-sm" placeholder="https://images.unsplash.com/..." />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Deskripsi / Silabus Pelatihan</label>
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
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
                <button type="submit" className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-royal">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
