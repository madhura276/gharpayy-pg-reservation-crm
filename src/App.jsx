import { useEffect, useMemo, useState } from "react";
import { BarChart3, Calendar, Home, LayoutDashboard, Plus, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./index.css";

const statuses = ["New", "Contacted", "Visit Scheduled", "Negotiation", "Booked", "Lost"];
const owners = ["Aisha", "Rohan", "Meera", "Kabir"];
const initialProperties = [
  { id: "P1", name: "Gharpayy Prime HSR", location: "HSR Layout", rent: 12000, totalBeds: 20, availableBeds: 6 },
  { id: "P2", name: "Gharpayy Nest Koramangala", location: "Koramangala", rent: 14500, totalBeds: 18, availableBeds: 4 },
  { id: "P3", name: "Gharpayy Elite Indiranagar", location: "Indiranagar", rent: 18000, totalBeds: 16, availableBeds: 3 }
];

const sampleLeads = [
  { id: "L1", name: "Rahul Sharma", phone: "9876543210", source: "WhatsApp", budget: 12000, location: "HSR Layout", moveInDate: "2026-05-10", status: "New", owner: "Aisha", notes: "Single sharing preferred" },
  { id: "L2", name: "Priya Nair", phone: "9123456780", source: "Instagram", budget: 15000, location: "Koramangala", moveInDate: "2026-05-15", status: "Contacted", owner: "Rohan", notes: "Needs food included" }
];

function load(key, fallback) {
  return JSON.parse(localStorage.getItem(key)) || fallback;
}

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const [leads, setLeads] = useState(() => load("leads", sampleLeads));
  const [visits, setVisits] = useState(() => load("visits", []));
  const [properties, setProperties] = useState(() => load("properties", initialProperties));
  const [reservations, setReservations] = useState(() => load("reservations", []));

  useEffect(() => localStorage.setItem("leads", JSON.stringify(leads)), [leads]);
  useEffect(() => localStorage.setItem("visits", JSON.stringify(visits)), [visits]);
  useEffect(() => localStorage.setItem("properties", JSON.stringify(properties)), [properties]);
  useEffect(() => localStorage.setItem("reservations", JSON.stringify(reservations)), [reservations]);

  const stats = useMemo(() => {
    const booked = leads.filter(l => l.status === "Booked").length;
    return {
      total: leads.length,
      newLeads: leads.filter(l => l.status === "New").length,
      visits: visits.filter(v => v.status === "Scheduled").length,
      booked,
      conversion: leads.length ? Math.round((booked / leads.length) * 100) : 0,
      beds: properties.reduce((sum, p) => sum + Number(p.availableBeds), 0)
    };
  }, [leads, visits, properties]);

  function addLead(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLeads([...leads, {
      id: crypto.randomUUID(), name: f.get("name"), phone: f.get("phone"), source: f.get("source"),
      budget: Number(f.get("budget")), location: f.get("location"), moveInDate: f.get("moveInDate"),
      status: "New", owner: f.get("owner"), notes: f.get("notes")
    }]);
    e.currentTarget.reset();
  }

  function updateLead(id, patch) {
    setLeads(leads.map(l => l.id === id ? { ...l, ...patch } : l));
  }

  function scheduleVisit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const leadId = f.get("leadId");
    setVisits([...visits, {
      id: crypto.randomUUID(), leadId, propertyId: f.get("propertyId"), date: f.get("date"),
      time: f.get("time"), executive: f.get("executive"), status: "Scheduled"
    }]);
    updateLead(leadId, { status: "Visit Scheduled" });
    e.currentTarget.reset();
  }

  function reserveBed(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const leadId = f.get("leadId");
    const propertyId = f.get("propertyId");
    setReservations([...reservations, {
      id: crypto.randomUUID(), leadId, propertyId, bedType: f.get("bedType"),
      amountPaid: Number(f.get("amountPaid")), paymentStatus: f.get("paymentStatus"), bookingStatus: "Reserved"
    }]);
    setProperties(properties.map(p => p.id === propertyId ? { ...p, availableBeds: Math.max(0, p.availableBeds - 1) } : p));
    updateLead(leadId, { status: "Booked" });
    e.currentTarget.reset();
  }

  const chartData = statuses.map(s => ({ name: s, leads: leads.filter(l => l.status === s).length }));

  return (
    <div className="app">
      <aside>
        <h2>Gharpayy Ops</h2>

        {[
          ["Dashboard", LayoutDashboard], ["Leads", Users], ["Pipeline", BarChart3],
          ["Visits", Calendar], ["Properties", Home], ["Reservations", Plus]
        ].map(([item, Icon]) => (
          <button className={page === item ? "active" : ""} onClick={() => setPage(item)} key={item}>
            <Icon size={18} /> {item}
          </button>
        ))}
      </aside>

      <main>
        <header>
          <h1>{page}</h1>
          <p>Manage leads, visits, pipeline, PG availability, and reservations from one workspace.</p>

        </header>

        {page === "Dashboard" && (
          <>
            <section className="stats">
              {[
                ["Total Leads", stats.total], ["New Leads", stats.newLeads], ["Visits Scheduled", stats.visits],
                ["Bookings", stats.booked], ["Conversion", `${stats.conversion}%`], ["Available Beds", stats.beds]
              ].map(([label, value]) => <div className="card" key={label}><span>{label}</span><strong>{value}</strong></div>)}
            </section>
            <section className="panel">
              <h3>Leads by Status</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="leads" fill="#2563eb" /></BarChart>
              </ResponsiveContainer>
            </section>
          </>
        )}

        {page === "Leads" && (
          <>
            <form className="form" onSubmit={addLead}>
              <input name="name" placeholder="Lead name" required />
              <input name="phone" placeholder="Phone" required />
              <input name="source" placeholder="Source" />
              <input name="budget" type="number" placeholder="Budget" />
              <input name="location" placeholder="Preferred location" />
              <input name="moveInDate" type="date" />
              <select name="owner">{owners.map(o => <option key={o}>{o}</option>)}</select>
              <input name="notes" placeholder="Notes" />
              <button>Add Lead</button>
            </form>
            <LeadTable leads={leads} updateLead={updateLead} />
          </>
        )}

        {page === "Pipeline" && (
          <section className="pipeline">
            {statuses.map(status => (
              <div className="column" key={status}>
                <h3>{status}</h3>
                {leads.filter(l => l.status === status).map(l => (
                  <div className="lead-card" key={l.id}>
                    <strong>{l.name}</strong><span>{l.phone}</span><span>{l.location} | Rs {l.budget}</span>
                    <select value={l.status} onChange={e => updateLead(l.id, { status: e.target.value })}>
                      {statuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}

        {page === "Visits" && (
          <>
            <form className="form" onSubmit={scheduleVisit}>
              <select name="leadId">{leads.map(l => <option value={l.id} key={l.id}>{l.name}</option>)}</select>
              <select name="propertyId">{properties.map(p => <option value={p.id} key={p.id}>{p.name}</option>)}</select>
              <input name="date" type="date" required />
              <input name="time" type="time" required />
              <select name="executive">{owners.map(o => <option key={o}>{o}</option>)}</select>
              <button>Schedule Visit</button>
            </form>
            <Table rows={visits.map(v => ({ ...v, lead: leads.find(l => l.id === v.leadId)?.name, property: properties.find(p => p.id === v.propertyId)?.name }))} />
          </>
        )}

        {page === "Properties" && (
  <>
    <section className="grid">
      {properties.map(p => {
        const occupancy = Math.round(((p.totalBeds - p.availableBeds) / p.totalBeds) * 100);

        return (
          <button
            className={`property-card ${selectedPropertyId === p.id ? "selected" : ""}`}
            key={p.id}
            onClick={() => setSelectedPropertyId(p.id)}
          >
            <h3>{p.name}</h3>
            <p>{p.location}</p>
            <strong>Rs {p.rent}/month</strong>
            <p>{p.availableBeds}/{p.totalBeds} beds available</p>
            <div className="progress">
              <span style={{ width: `${occupancy}%` }} />
            </div>
            <small>{occupancy}% occupied</small>
          </button>
        );
      })}
    </section>

    {selectedPropertyId && (
      <section className="panel">
        {(() => {
          const property = properties.find(p => p.id === selectedPropertyId);
          const propertyVisits = visits.filter(v => v.propertyId === selectedPropertyId);
          const propertyReservations = reservations.filter(r => r.propertyId === selectedPropertyId);

          return (
            <>
              <h3>{property.name}</h3>
              <p className="muted">
                {property.location} | Rs {property.rent}/month | {property.availableBeds} beds available
              </p>

              <div className="detail-grid">
                <div>
                  <h4>Scheduled Visits</h4>
                  {propertyVisits.length ? (
                    propertyVisits.map(v => (
                      <p key={v.id}>
                        {leads.find(l => l.id === v.leadId)?.name} - {v.date} at {v.time}
                      </p>
                    ))
                  ) : (
                    <p className="muted">No visits scheduled.</p>
                  )}
                </div>

                <div>
                  <h4>Reservations</h4>
                  {propertyReservations.length ? (
                    propertyReservations.map(r => (
                      <p key={r.id}>
                        {leads.find(l => l.id === r.leadId)?.name} - {r.bedType} - {r.paymentStatus}
                      </p>
                    ))
                  ) : (
                    <p className="muted">No reservations yet.</p>
                  )}
                </div>
              </div>
            </>
          );
        })()}
      </section>
    )}
  </>
)}


        {page === "Reservations" && (
          <>
            <form className="form" onSubmit={reserveBed}>
              <select name="leadId">{leads.map(l => <option value={l.id} key={l.id}>{l.name}</option>)}</select>
              <select name="propertyId">{properties.map(p => <option value={p.id} key={p.id}>{p.name}</option>)}</select>
              <select name="bedType"><option>Single Sharing</option><option>Double Sharing</option><option>Triple Sharing</option></select>
              <input name="amountPaid" type="number" placeholder="Amount paid" />
              <select name="paymentStatus"><option>Pending</option><option>Partial</option><option>Paid</option></select>
              <button>Reserve Bed</button>
            </form>
            <Table rows={reservations.map(r => ({ ...r, lead: leads.find(l => l.id === r.leadId)?.name, property: properties.find(p => p.id === r.propertyId)?.name }))} />
          </>
        )}
      </main>
    </div>
  );
}

function LeadTable({ leads, updateLead }) {
  return <table><thead><tr><th>Name</th><th>Phone</th><th>Location</th><th>Budget</th><th>Status</th><th>Owner</th></tr></thead><tbody>
    {leads.map(l => <tr key={l.id}><td>{l.name}</td><td>{l.phone}</td><td>{l.location}</td><td>Rs {l.budget}</td><td><select value={l.status} onChange={e => updateLead(l.id, { status: e.target.value })}>{statuses.map(s => <option key={s}>{s}</option>)}</select></td><td>{l.owner}</td></tr>)}
  </tbody></table>;
}

function Table({ rows }) {
  if (!rows.length) return <p className="empty">No records yet.</p>;
  const keys = Object.keys(rows[0]).filter(k => !k.endsWith("Id"));
  return <table><thead><tr>{keys.map(k => <th key={k}>{k}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={r.id}>{keys.map(k => <td key={k}>{r[k]}</td>)}</tr>)}</tbody></table>;
}
