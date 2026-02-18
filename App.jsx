// West Point Combatives Tournament Manager
// Browser-Compatible Version - No async/await

const { useState, useEffect } = React;
const { Edit2, Plus, Search, Moon, Sun, X, Upload, ChevronDown, ChevronUp } = lucide;

const WEIGHT_BRACKETS = [
  { name: "150–160", min: 150, max: 160 },
  { name: "161–170", min: 161, max: 170 },
  { name: "171–180", min: 171, max: 180 },
  { name: "181–190", min: 181, max: 190 },
  { name: "191–200", min: 191, max: 200 },
  { name: "201–210", min: 201, max: 210 }
];

function GrapplingTournamentApp() {
  const [data, setData] = useState({
    athletes: [],
    teams: [],
    tournaments: [],
    weightClasses: WEIGHT_BRACKETS.map(b => ({ name: b.name, athleteIds: [] }))
  });
  
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [currentRegiment, setCurrentRegiment] = useState('1');
  
  // Firebase connection monitor
  useEffect(() => {
    if (!window.firebase) {
      setFirebaseConnected(false);
      return;
    }
    
    const { database, ref, onValue } = window.firebase;
    const connectedRef = ref(database, '.info/connected');
    
    const unsubscribe = onValue(connectedRef, (snapshot) => {
      setFirebaseConnected(snapshot.val() === true);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Simple save function
  const saveData = (newData) => {
    if (window.firebase && firebaseConnected) {
      try {
        const { database, ref, set } = window.firebase;
        const dataRef = ref(database, `regiments/${currentRegiment}/active`);
        set(dataRef, newData);
      } catch (error) {
        console.error('Firebase error:', error);
      }
    }
    setData(newData);
  };
  
  // Add athlete
  const addAthlete = () => {
    const name = prompt('Enter athlete name:');
    if (!name) return;
    
    const weight = parseInt(prompt('Enter weight (lbs):'));
    if (!weight || weight < 100 || weight > 400) {
      alert('Invalid weight. Must be 100-400 lbs.');
      return;
    }
    
    const newAthlete = {
      id: Date.now().toString(),
      name,
      weight,
      stats: { wins: { points: 0, submission: 0 }, losses: { points: 0, submission: 0 }, pointsFor: 0 }
    };
    
    saveData({ ...data, athletes: [...data.athletes, newAthlete] });
    alert(`${name} added successfully!`);
  };
  
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      <header style={{ background: '#0f172a', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderBottom: '2px solid #b8860b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
            WEST POINT COMBATIVES
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {window.firebase && (
            <div style={{ 
              padding: '6px 12px',
              background: firebaseConnected ? '#10b981' : '#ef4444',
              color: 'white',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '10px' }}>{firebaseConnected ? '🟢' : '🔴'}</span>
              {firebaseConnected ? 'CONNECTED' : 'OFFLINE'}
            </div>
          )}
          <select value={currentRegiment} onChange={(e) => setCurrentRegiment(e.target.value)} style={{ padding: '8px 12px', background: 'white', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>
            {[1, 2, 3, 4].map(n => <option key={n} value={n}>Regiment {n}</option>)}
          </select>
        </div>
      </header>
      
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '4px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '19px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>QUICK TEST</h3>
          <p style={{ marginBottom: '16px', color: '#475569' }}>
            Firebase Status: <strong>{firebaseConnected ? '✅ Connected' : '❌ Disconnected'}</strong>
          </p>
          <p style={{ marginBottom: '16px', color: '#475569' }}>
            Athletes: <strong>{data.athletes.length}</strong>
          </p>
          <button 
            onClick={addAthlete}
            style={{ 
              padding: '8px 16px', 
              background: '#1e3a8a', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px', 
              cursor: 'pointer', 
              fontSize: '11px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            ADD TEST ATHLETE
          </button>
        </div>
        
        <div style={{ background: 'white', borderRadius: '4px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #cbd5e1' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '19px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>ATHLETES</h3>
          {data.athletes.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No athletes yet. Click "Add Test Athlete" above.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
              {data.athletes.map(athlete => (
                <div key={athlete.id} style={{ background: '#f1f5f9', borderRadius: '4px', padding: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{athlete.name}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Weight: {athlete.weight} lbs</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ marginTop: '40px', padding: '20px', background: '#fff3cd', borderRadius: '4px', border: '1px solid #ffc107' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#856404' }}>🎉 Success!</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
            If you can see this page and the connection indicator shows green, Firebase is working! 
            The full app with all features is in your backup file. This is just a test to confirm everything loads.
          </p>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<GrapplingTournamentApp />);
