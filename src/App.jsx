import React, { useState, useEffect } from 'react';
import { Download, Upload, Plus, Edit2, Undo, Moon, Sun, UserX, Search, UserMinus, ChevronDown, ChevronUp } from 'lucide-react';
import * as XLSX from 'xlsx';

const WEIGHT_BRACKETS = [
  { name: "150–160", min: 150, max: 160 },
  { name: "161–170", min: 161, max: 170 },
  { name: "171–180", min: 171, max: 180 },
  { name: "181–190", min: 181, max: 190 },
  { name: "191–200", min: 191, max: 200 },
  { name: "201–210", min: 201, max: 210 }
];

const FIRST_NAMES = ["John", "Michael", "David", "James", "Robert", "William", "Joseph", "Daniel"];
const LAST_NAMES = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function GrapplingTournamentApp() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('viewer');
  const [currentRegiment, setCurrentRegiment] = useState('1');
  const [data, setData] = useState({ athletes: [], teams: [], weightClasses: [], tournaments: [] });
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [expandedWeight, setExpandedWeight] = useState(null);
  const [expandedCompletedTournament, setExpandedCompletedTournament] = useState(null);
  const [expandedTournaments, setExpandedTournaments] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [tournamentName, setTournamentName] = useState('');
  const [tournamentWeight, setTournamentWeight] = useState('');
  const [tournamentYear, setTournamentYear] = useState('');
  const [tournamentMonth, setTournamentMonth] = useState('');
  const [tournamentDay, setTournamentDay] = useState('');
  const [tournamentOfficials, setTournamentOfficials] = useState('');
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showAddAthlete, setShowAddAthlete] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newAthleteName, setNewAthleteName] = useState('');
  const [newAthleteWeight, setNewAthleteWeight] = useState('');
  const [newAthleteTeam, setNewAthleteTeam] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [editingAthlete, setEditingAthlete] = useState(null);
  const [editAthleteName, setEditAthleteName] = useState('');
  const [editAthleteWeight, setEditAthleteWeight] = useState('');
  const [lastAction, setLastAction] = useState(null);
  const [showNoShowMenu, setShowNoShowMenu] = useState(null);
  const [showRemoveAthleteMenu, setShowRemoveAthleteMenu] = useState(null);
  const [athleteSearch, setAthleteSearch] = useState('');
  const [seedingMode, setSeedingMode] = useState(null);
  const [seedingAthletes, setSeedingAthletes] = useState([]);

  useEffect(() => {
    const key = `grappling_${currentRegiment}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.athletes.forEach(a => {
        a.stats = a.stats || {};
        a.stats.wins = a.stats.wins || { points: 0, submission: 0 };
        a.stats.losses = a.stats.losses || { points: 0, submission: 0 };
        a.stats.pointsFor = a.stats.pointsFor || 0;
        a.injured = a.injured || false;
      });
      if (!parsed.weightClasses || parsed.weightClasses.length === 0) {
        parsed.weightClasses = WEIGHT_BRACKETS.map(b => ({ name: b.name, athleteIds: [] }));
      }
      setData(parsed);
    } else {
      setData({
        athletes: [],
        teams: [],
        weightClasses: WEIGHT_BRACKETS.map(b => ({ name: b.name, athleteIds: [] })),
        tournaments: []
      });
    }
  }, [currentRegiment]);

  const saveData = (newData) => {
    localStorage.setItem(`grappling_${currentRegiment}`, JSON.stringify(newData));
    setData(newData);
  };

  const toggleInjured = (athleteId) => {
    const newData = { ...data };
    const athlete = newData.athletes.find(a => a.id === athleteId);
    if (athlete) {
      athlete.injured = !athlete.injured;
      saveData(newData);
    }
  };

  const addTeam = () => {
    if (!newTeamName.trim()) return;
    const newData = { ...data };
    newData.teams.push({ name: newTeamName, athleteIds: [] });
    saveData(newData);
    setNewTeamName('');
    setShowAddTeam(false);
  };

  const startEditTeam = (index, name) => {
    setEditingTeam(index);
    setEditTeamName(name);
  };

  const saveEditTeam = (index) => {
    if (!editTeamName.trim()) return;
    const newData = { ...data };
    newData.teams[index].name = editTeamName;
    saveData(newData);
    setEditingTeam(null);
    setEditTeamName('');
  };

  const startEditAthlete = (id, name, weight) => {
    setEditingAthlete(id);
    setEditAthleteName(name);
    setEditAthleteWeight(weight.toString());
  };

  const saveEditAthlete = (id) => {
    if (!editAthleteName.trim() || !editAthleteWeight) return;
    const newWeight = parseInt(editAthleteWeight);
    const newData = { ...data };
    const athlete = newData.athletes.find(a => a.id === id);
    if (!athlete) return;

    const oldWeight = athlete.weight;
    athlete.name = editAthleteName;
    athlete.weight = newWeight;

    if (oldWeight !== newWeight) {
      newData.weightClasses.forEach(wc => {
        wc.athleteIds = wc.athleteIds.filter(aid => aid !== id);
      });
      const bracket = WEIGHT_BRACKETS.find(b => newWeight >= b.min && newWeight <= b.max);
      if (bracket) {
        const wc = newData.weightClasses.find(w => w.name === bracket.name);
        if (wc) wc.athleteIds.push(athlete.id);
      }
    }

    saveData(newData);
    setEditingAthlete(null);
    setEditAthleteName('');
    setEditAthleteWeight('');
  };

  const addAthlete = () => {
    if (!newAthleteName.trim() || !newAthleteWeight || !newAthleteTeam) return;
    const weight = parseInt(newAthleteWeight);
    const newData = { ...data };
    const athlete = {
      id: crypto.randomUUID(),
      name: newAthleteName,
      weight: weight,
      injured: false,
      stats: { wins: { points: 0, submission: 0 }, losses: { points: 0, submission: 0 }, pointsFor: 0 }
    };
    newData.athletes.push(athlete);
    const team = newData.teams.find(t => t.name === newAthleteTeam);
    if (team) team.athleteIds.push(athlete.id);
    const bracket = WEIGHT_BRACKETS.find(b => weight >= b.min && weight <= b.max);
    if (bracket) {
      const wc = newData.weightClasses.find(w => w.name === bracket.name);
      if (wc) wc.athleteIds.push(athlete.id);
    }
    saveData(newData);
    setNewAthleteName('');
    setNewAthleteWeight('');
    setNewAthleteTeam('');
    setShowAddAthlete(false);
  };

  const autoGenerateData = () => {
    if (currentRole !== 'official') return;
    const newData = { athletes: [], teams: [], weightClasses: [], tournaments: [] };
    WEIGHT_BRACKETS.forEach(b => newData.weightClasses.push({ name: b.name, athleteIds: [] }));
    let idx = 0;
    "ABCDEFGHI".split("").forEach(letter => {
      const athleteIds = [];
      for (let i = 0; i < 16; i++) {
        const athlete = {
          id: crypto.randomUUID(),
          name: `${FIRST_NAMES[idx % FIRST_NAMES.length]} ${LAST_NAMES[Math.floor(idx / FIRST_NAMES.length) % LAST_NAMES.length]}`,
          weight: Math.floor((WEIGHT_BRACKETS[idx % WEIGHT_BRACKETS.length].min + WEIGHT_BRACKETS[idx % WEIGHT_BRACKETS.length].max) / 2),
          injured: false,
          stats: { wins: { points: 0, submission: 0 }, losses: { points: 0, submission: 0 }, pointsFor: 0 }
        };
        newData.athletes.push(athlete);
        athleteIds.push(athlete.id);
        newData.weightClasses[idx % WEIGHT_BRACKETS.length].athleteIds.push(athlete.id);
        idx++;
      }
      newData.teams.push({ name: `${letter}${currentRegiment}`, athleteIds });
    });
    saveData(newData);
  };

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const makeMatches = (athleteIds) => {
    const shuffled = shuffle([...athleteIds]);
    if (shuffled.length % 2 === 1) shuffled.push("BYE");
    const matches = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      const a = shuffled[i];
      const b = shuffled[i + 1];
      if (a === "BYE" || b === "BYE") {
        matches.push({ athleteA: a, athleteB: b, winner: a === "BYE" ? b : a, method: "bye" });
      } else {
        matches.push({ athleteA: a, athleteB: b, winner: null, method: null });
      }
    }
    return matches;
  };

  const startSeeding = (weightClassName) => {
    const weightClass = data.weightClasses.find(w => w.name === weightClassName);
    if (!weightClass) return;
    const availableAthletes = weightClass.athleteIds.filter(id => {
      const athlete = data.athletes.find(a => a.id === id);
      return athlete && !athlete.injured;
    });
    setSeedingAthletes([...availableAthletes]);
    setSeedingMode(weightClassName);
  };

  const moveAthleteUp = (index) => {
    if (index === 0) return;
    const newSeeding = [...seedingAthletes];
    [newSeeding[index - 1], newSeeding[index]] = [newSeeding[index], newSeeding[index - 1]];
    setSeedingAthletes(newSeeding);
  };

  const moveAthleteDown = (index) => {
    if (index === seedingAthletes.length - 1) return;
    const newSeeding = [...seedingAthletes];
    [newSeeding[index], newSeeding[index + 1]] = [newSeeding[index + 1], newSeeding[index]];
    setSeedingAthletes(newSeeding);
  };

  const confirmSeeding = () => {
    if (currentRole !== 'official' || !tournamentName || !seedingMode || !tournamentYear || !tournamentMonth || !tournamentDay) return;
    const newData = { ...data };
    newData.tournaments.push({
      name: tournamentName,
      weight: seedingMode,
      date: { year: tournamentYear, month: tournamentMonth, day: tournamentDay },
      officials: tournamentOfficials,
      rounds: [makeMatches(seedingAthletes)],
      done: false,
      champ: null
    });
    saveData(newData);
    setTournamentName('');
    setTournamentWeight('');
    setTournamentYear('');
    setTournamentMonth('');
    setTournamentDay('');
    setTournamentOfficials('');
    setSeedingMode(null);
    setSeedingAthletes([]);
  };

  const createTournament = () => {
    if (currentRole !== 'official' || !tournamentName || !tournamentWeight || !tournamentYear || !tournamentMonth || !tournamentDay) return;
    const weightClass = data.weightClasses.find(w => w.name === tournamentWeight);
    if (!weightClass) return;
    const availableAthletes = weightClass.athleteIds.filter(id => {
      const athlete = data.athletes.find(a => a.id === id);
      return athlete && !athlete.injured;
    });
    const newData = { ...data };
    newData.tournaments.push({
      name: tournamentName,
      weight: tournamentWeight,
      date: { year: tournamentYear, month: tournamentMonth, day: tournamentDay },
      officials: tournamentOfficials,
      rounds: [makeMatches(availableAthletes)],
      done: false,
      champ: null
    });
    saveData(newData);
    setTournamentName('');
    setTournamentWeight('');
    setTournamentYear('');
    setTournamentMonth('');
    setTournamentDay('');
    setTournamentOfficials('');
  };

  const removeAthleteFromTournament = (tournamentIndex, athleteId) => {
    if (currentRole !== 'official') return;
    const newData = JSON.parse(JSON.stringify(data));
    const tournament = newData.tournaments[tournamentIndex];
    const lastRound = tournament.rounds[tournament.rounds.length - 1];

    lastRound.forEach(match => {
      if (!match.winner) {
        if (match.athleteA === athleteId) {
          match.winner = match.athleteB;
          match.method = "walkover";
        } else if (match.athleteB === athleteId) {
          match.winner = match.athleteA;
          match.method = "walkover";
        }
      }
    });

    if (lastRound.every(m => m.winner)) {
      const advancing = lastRound.map(m => m.winner);
      if (advancing.length === 1) {
        tournament.done = true;
        tournament.champ = advancing[0];
      } else {
        tournament.rounds.push(makeMatches(advancing));
      }
    }

    setShowRemoveAthleteMenu(null);
    saveData(newData);
  };

  const decideMatch = (ti, ri, mi, winnerId, method) => {
    if (currentRole !== 'official') return;
    const snapshot = JSON.parse(JSON.stringify(data));
    const newData = JSON.parse(JSON.stringify(data));
    const tournament = newData.tournaments[ti];
    const match = tournament.rounds[ri][mi];
    if (match.winner) return;

    match.winner = winnerId;
    match.method = method;
    const loserId = match.athleteA === winnerId ? match.athleteB : match.athleteA;
    const winner = winnerId === "BYE" ? null : newData.athletes.find(a => a.id === winnerId);
    const loser = loserId === "BYE" ? null : newData.athletes.find(a => a.id === loserId);

    if (winner && loser) {
      winner.stats.wins[method]++;
      loser.stats.losses[method]++;
      if (method === "points" || method === "noshow") winner.stats.pointsFor += 2;
      if (method === "submission") winner.stats.pointsFor += 4;
    }

    if (tournament.rounds[ri].every(m => m.winner)) {
      const advancing = tournament.rounds[ri].map(m => m.winner);
      if (advancing.length === 1) {
        tournament.done = true;
        tournament.champ = advancing[0];
      } else {
        tournament.rounds.push(makeMatches(advancing));
      }
    }

    setLastAction({ type: 'match', snapshot, tournamentIndex: ti, roundIndex: ri, matchIndex: mi });
    setShowNoShowMenu(null);
    saveData(newData);
  };

  const undoLastAction = () => {
    if (!lastAction) return;
    if (lastAction.type === 'match') {
      saveData(lastAction.snapshot);
      setLastAction(null);
    }
  };

  const exportToExcel = () => {
    const athleteData = data.athletes.map(a => {
      const team = data.teams.find(t => t.athleteIds.includes(a.id));
      return {
        Name: a.name,
        Weight: a.weight,
        Team: team?.name || 'N/A',
        'Wins (Points)': a.stats.wins.points,
        'Wins (Submission)': a.stats.wins.submission,
        'Total Points': a.stats.pointsFor,
        Injured: a.injured ? 'Yes' : 'No'
      };
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(athleteData);
    XLSX.utils.book_append_sheet(wb, ws, "Athletes");
    XLSX.writeFile(wb, `grappling_regiment_${currentRegiment}.xlsx`);
  };

  const importFromExcel = (e) => {
    if (currentRole !== 'official') return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const wb = XLSX.read(event.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const imported = XLSX.utils.sheet_to_json(ws);
      const newData = { ...data, athletes: [], teams: [] };
      newData.weightClasses = WEIGHT_BRACKETS.map(b => ({ name: b.name, athleteIds: [] }));
      const teamMap = {};
      imported.forEach(row => {
        const athlete = {
          id: crypto.randomUUID(),
          name: row.Name || 'Unknown',
          weight: row.Weight || 160,
          injured: row.Injured === 'Yes',
          stats: {
            wins: { points: row['Wins (Points)'] || 0, submission: row['Wins (Submission)'] || 0 },
            losses: { points: 0, submission: 0 },
            pointsFor: row['Total Points'] || 0
          }
        };
        newData.athletes.push(athlete);
        const teamName = row.Team || 'Unknown';
        if (!teamMap[teamName]) teamMap[teamName] = { name: teamName, athleteIds: [] };
        teamMap[teamName].athleteIds.push(athlete.id);
        const bracket = WEIGHT_BRACKETS.find(b => athlete.weight >= b.min && athlete.weight <= b.max);
        if (bracket) {
          const wc = newData.weightClasses.find(w => w.name === bracket.name);
          if (wc) wc.athleteIds.push(athlete.id);
        }
      });
      newData.teams = Object.values(teamMap);
      saveData(newData);
    };
    reader.readAsBinaryString(file);
  };

  const teamPoints = data.teams.map(team => ({
    name: team.name,
    points: team.athleteIds.reduce((sum, id) => {
      const athlete = data.athletes.find(a => a.id === id);
      return sum + (athlete?.stats.pointsFor || 0);
    }, 0)
  })).sort((a, b) => b.points - a.points);

  const filteredAthletes = data.athletes.filter(a =>
    a.name.toLowerCase().includes(athleteSearch.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  const activeTournaments = data.tournaments.filter(t => !t.done);
  const completedTournaments = data.tournaments.filter(t => t.done).filter(t => {
    if (!filterYear && !filterMonth && !filterDay) return true;
    if (filterYear && t.date.year !== filterYear) return false;
    if (filterMonth && t.date.month !== filterMonth) return false;
    if (filterDay && t.date.day !== filterDay) return false;
    return true;
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const isOfficial = currentRole === 'official';

  const bgColor = darkMode ? '#1a1a1a' : '#f4f4f4';
  const cardBg = darkMode ? '#2d2d2d' : 'white';
  const textColor = darkMode ? '#e0e0e0' : '#000';
  const headerBg = darkMode ? '#0d0d0d' : '#222';
  const navBg = darkMode ? '#2d2d2d' : '#ddd';
  const borderColor = darkMode ? '#444' : '#ddd';
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: bgColor, width: '100%', margin: 0, color: textColor }}>
      <header style={{ background: headerBg, color: 'white', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Grappling Tournament Manager</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '6px', background: 'transparent', border: '1px solid white', borderRadius: '4px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <select value={currentRegiment} onChange={(e) => setCurrentRegiment(e.target.value)} style={{ padding: '6px', background: cardBg, color: textColor, border: `1px solid ${borderColor}` }}>
            {[1, 2, 3, 4].map(n => <option key={n} value={n}>Regiment {n}</option>)}
          </select>
          <select value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} style={{ padding: '6px', background: cardBg, color: textColor, border: `1px solid ${borderColor}` }}>
            <option value="viewer">Viewer</option>
            <option value="official">Official</option>
          </select>
        </div>
      </header>

      <nav style={{ background: navBg, padding: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['dashboard', 'teams', 'athletes', 'weightclasses', 'tournaments', 'completed'].map(tab => (
          <button key={tab} onClick={() => setCurrentTab(tab)} style={{ padding: '8px 14px', borderRadius: '6px', border: `1px solid ${borderColor}`, cursor: 'pointer', background: currentTab === tab ? '#007bff' : cardBg, color: currentTab === tab ? 'white' : textColor }}>
            {tab === 'weightclasses' ? 'Weight Classes' : tab === 'completed' ? 'Completed Tournaments' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <div style={{ padding: '20px' }}>
        {currentTab === 'dashboard' && (
          <div>
            <h3>Dashboard</h3>
            <div style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Team Points Leaderboard</h4>
              {teamPoints.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>No team data yet</p>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '10px', minHeight: '300px' }}>
                  {teamPoints.map((team, idx) => {
                    const maxPoints = teamPoints[0]?.points || 1;
                    const barHeight = (team.points / maxPoints) * 200;
                    const rank = idx + 1;
                    let color = '#6c757d';
                    if (rank === 1) color = '#ffd700';
                    else if (rank === 2) color = '#c0c0c0';
                    else if (rank === 3) color = '#cd7f32';
                    return (
                      <div key={team.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>{team.points} pts</div>
                        <div style={{ width: '60px', height: `${barHeight}px`, background: color, borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10px', color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                          #{rank}
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', maxWidth: '80px', wordWrap: 'break-word' }}>
                          {team.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div style={{ background: cardBg, borderRadius: '10px', padding: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <h4>Data Management</h4>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button onClick={exportToExcel} style={{ padding: '8px 14px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={16} /> Export to Excel
                </button>
                {isOfficial && (
                  <>
                    <label style={{ padding: '8px 14px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Upload size={16} /> Import from Excel
                      <input type="file" accept=".xlsx,.xls" onChange={importFromExcel} style={{ display: 'none' }} />
                    </label>
                    <button onClick={autoGenerateData} style={{ padding: '8px 14px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                      Generate Test Data
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'teams' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Teams</h3>
              {isOfficial && (
                <button onClick={() => setShowAddTeam(true)} style={{ padding: '8px 14px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} /> Add Team
                </button>
              )}
            </div>

            {showAddTeam && (
              <div style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <h4>Create New Team</h4>
                <input value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="Team name" style={{ padding: '8px', marginRight: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, width: '200px', background: cardBg, color: textColor }} />
                <button onClick={addTeam} style={{ padding: '8px 14px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}>Create</button>
                <button onClick={() => { setShowAddTeam(false); setNewTeamName(''); }} style={{ padding: '8px 14px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            )}

            {isOfficial && (
              <div style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <button onClick={() => setShowAddAthlete(!showAddAthlete)} style={{ padding: '8px 14px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} /> Add Athlete
                </button>
                {showAddAthlete && (
                  <div style={{ marginTop: '15px' }}>
                    <h4>Create New Athlete</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                      <input value={newAthleteName} onChange={(e) => setNewAthleteName(e.target.value)} placeholder="Athlete name" style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }} />
                      <input type="number" value={newAthleteWeight} onChange={(e) => setNewAthleteWeight(e.target.value)} placeholder="Weight (lbs)" style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }} />
                      <select value={newAthleteTeam} onChange={(e) => setNewAthleteTeam(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}>
                        <option value="">Select Team</option>
                        {data.teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                      </select>
                      <div>
                        <button onClick={addAthlete} style={{ padding: '8px 14px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}>Create Athlete</button>
                        <button onClick={() => { setShowAddAthlete(false); setNewAthleteName(''); setNewAthleteWeight(''); setNewAthleteTeam(''); }} style={{ padding: '8px 14px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {data.teams.length === 0 ? <p style={{ color: '#666', fontStyle: 'italic' }}>No teams yet</p> : data.teams.map((team, i) => (
              <div key={i} style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {editingTeam === i ? (
                    <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input value={editTeamName} onChange={(e) => setEditTeamName(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }} />
                      <button onClick={() => saveEditTeam(i)} style={{ padding: '4px 8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Save</button>
                      <button onClick={() => setEditingTeam(null)} style={{ padding: '4px 8px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                    </div>
                  ) : (
                    <div onClick={() => setExpandedTeam(expandedTeam === i ? null : i)} style={{ fontWeight: 'bold', cursor: 'pointer', flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{team.name}</span>
                      <span>{team.athleteIds.length} athletes</span>
                    </div>
                  )}
                  {isOfficial && editingTeam !== i && (
                    <button onClick={() => startEditTeam(i, team.name)} style={{ padding: '4px 8px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px', fontSize: '12px' }}>
                      <Edit2 size={14} />
                    </button>
                  )}
                </div>
                {expandedTeam === i && (
                  <>
                    {isOfficial && (
                      <button onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete team ${team.name}?`)) {
                          const newData = { ...data };
                          newData.teams.splice(i, 1);
                          saveData(newData);
                        }
                      }} style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', fontSize: '12px' }}>
                        Delete Team
                      </button>
                    )}
                    <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                      {team.athleteIds.map(id => {
                        const athlete = data.athletes.find(a => a.id === id);
                        return (
                          <li key={id} style={{ padding: '4px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {editingAthlete === id ? (
                              <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input value={editAthleteName} onChange={(e) => setEditAthleteName(e.target.value)} placeholder="Name" style={{ padding: '4px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }} />
                                <input type="number" value={editAthleteWeight} onChange={(e) => setEditAthleteWeight(e.target.value)} placeholder="Weight" style={{ padding: '4px', borderRadius: '4px', border: `1px solid ${borderColor}`, width: '80px', background: cardBg, color: textColor }} />
                                <button onClick={() => saveEditAthlete(id)} style={{ padding: '4px 8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Save</button>
                                <button onClick={() => setEditingAthlete(null)} style={{ padding: '4px 8px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Cancel</button>
                              </div>
                            ) : (
                              <>
                                <span onClick={() => setSelectedPlayer(athlete)} style={{ cursor: 'pointer', color: '#007bff', flex: 1, textDecoration: athlete?.injured ? 'line-through' : 'none', opacity: athlete?.injured ? 0.6 : 1 }}>
                                  {athlete?.name} {athlete?.injured && '(Injured)'}
                                </span>
                                {isOfficial && (
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button onClick={() => toggleInjured(id)} style={{ padding: '2px 6px', background: athlete?.injured ? '#28a745' : '#ffc107', color: athlete?.injured ? 'white' : 'black', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}>
                                      {athlete?.injured ? 'Clear' : 'Injured'}
                                    </button>
                                    <button onClick={() => startEditAthlete(id, athlete.name, athlete.weight)} style={{ padding: '2px 6px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}>
                                      <Edit2 size={12} />
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {currentTab === 'athletes' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <h3>Athletes</h3>
              <div style={{ position: 'relative', marginTop: '10px' }}>
                <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                <input value={athleteSearch} onChange={(e) => setAthleteSearch(e.target.value)} placeholder="Search athletes by name..." style={{ padding: '8px 8px 8px 40px', borderRadius: '6px', border: `1px solid ${borderColor}`, width: '100%', background: cardBg, color: textColor }} />
              </div>
            </div>
            {filteredAthletes.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No athletes found</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                {filteredAthletes.map(athlete => {
                  const team = data.teams.find(t => t.athleteIds.includes(athlete.id));
                  const totalWins = athlete.stats.wins.points + athlete.stats.wins.submission;
                  const totalLosses = athlete.stats.losses.points + athlete.stats.losses.submission;
                  return (
                    <div key={athlete.id} onClick={() => setSelectedPlayer(athlete)} style={{ background: cardBg, borderRadius: '10px', padding: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', cursor: 'pointer', opacity: athlete.injured ? 0.6 : 1 }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{athlete.name} {athlete.injured && '(Injured)'}</h4>
                      <div style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Team:</strong> {team?.name || 'N/A'}</div>
                      <div style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Weight:</strong> {athlete.weight} lbs</div>
                      <div style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Record:</strong> {totalWins}-{totalLosses}</div>
                      <div style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Points:</strong> {athlete.stats.pointsFor}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px', borderTop: `1px solid ${borderColor}`, paddingTop: '8px' }}>
                        <div>Wins: {athlete.stats.wins.points}P / {athlete.stats.wins.submission}S</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentTab === 'weightclasses' && (
          <div>
            <h3>Weight Classes</h3>
            {data.weightClasses.map((wc, i) => (
              <div key={i} style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <div onClick={() => setExpandedWeight(expandedWeight === i ? null : i)} style={{ fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{wc.name}</span>
                  <span>{wc.athleteIds.length} athletes</span>
                </div>
                {expandedWeight === i && (
                  <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                    {wc.athleteIds.map(id => {
                      const athlete = data.athletes.find(a => a.id === id);
                      return <li key={id} onClick={() => setSelectedPlayer(athlete)} style={{ cursor: 'pointer', padding: '4px 0', color: '#007bff', textDecoration: athlete?.injured ? 'line-through' : 'none', opacity: athlete?.injured ? 0.6 : 1 }}>{athlete?.name} - {athlete?.weight} lbs {athlete?.injured && '(Injured)'}</li>;
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {currentTab === 'tournaments' && (
          <div>
            <h3>Active Tournaments</h3>
            {isOfficial && !seedingMode && (
              <div style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <h4>Create New Tournament</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} placeholder="Tournament name" style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }} />
                  <input value={tournamentOfficials} onChange={(e) => setTournamentOfficials(e.target.value)} placeholder="Officials (comma-separated names)" style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }} />
                  <select value={tournamentWeight} onChange={(e) => setTournamentWeight(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}>
                    <option value="">Select Weight Class</option>
                    {data.weightClasses.map(wc => <option key={wc.name} value={wc.name}>{wc.name}</option>)}
                  </select>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select value={tournamentYear} onChange={(e) => setTournamentYear(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }}>
                      <option value="">Year</option>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select value={tournamentMonth} onChange={(e) => setTournamentMonth(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }}>
                      <option value="">Month</option>
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={tournamentDay} onChange={(e) => setTournamentDay(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }}>
                      <option value="">Day</option>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={createTournament} style={{ padding: '8px 14px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1 }}>Start (Random Seeding)</button>
                    <button onClick={() => tournamentWeight && startSeeding(tournamentWeight)} disabled={!tournamentWeight} style={{ padding: '8px 14px', background: tournamentWeight ? '#17a2b8' : '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: tournamentWeight ? 'pointer' : 'not-allowed', flex: 1 }}>Manual Seeding</button>
                  </div>
                </div>
              </div>
            )}

            {seedingMode && (
              <div style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <h4>Arrange Seeds for {seedingMode}</h4>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>Use arrows to arrange athletes in bracket order</p>
                {seedingAthletes.map((id, idx) => {
                  const athlete = data.athletes.find(a => a.id === id);
                  return (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: darkMode ? '#3d3d3d' : '#f9f9f9', marginBottom: '4px', borderRadius: '4px' }}>
                      <span style={{ fontWeight: 'bold', minWidth: '30px' }}>#{idx + 1}</span>
                      <span style={{ flex: 1 }}>{athlete?.name}</span>
                      <button onClick={() => moveAthleteUp(idx)} disabled={idx === 0} style={{ padding: '4px 8px', background: idx === 0 ? '#6c757d' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>
                        <ChevronUp size={14} />
                      </button>
                      <button onClick={() => moveAthleteDown(idx)} disabled={idx === seedingAthletes.length - 1} style={{ padding: '4px 8px', background: idx === seedingAthletes.length - 1 ? '#6c757d' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: idx === seedingAthletes.length - 1 ? 'not-allowed' : 'pointer' }}>
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  );
                })}
                <div style={{ marginTop: '15px', display: 'flex', gap: '8px' }}>
                  <button onClick={confirmSeeding} style={{ padding: '8px 14px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1 }}>Confirm & Start Tournament</button>
                  <button onClick={() => { setSeedingMode(null); setSeedingAthletes([]); }} style={{ padding: '8px 14px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}

            {activeTournaments.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No active tournaments</p>
            ) : (
              activeTournaments.map((tournament, ti) => {
                const actualIndex = data.tournaments.findIndex(t => t === tournament);
                const isExpanded = expandedTournaments[actualIndex];
                const lastRound = tournament.rounds[tournament.rounds.length - 1];
                const activeAthletes = [];
                lastRound.forEach(match => {
                  if (!match.winner) {
                    if (match.athleteA !== "BYE") activeAthletes.push({ id: match.athleteA, athlete: data.athletes.find(a => a.id === match.athleteA) });
                    if (match.athleteB !== "BYE") activeAthletes.push({ id: match.athleteB, athlete: data.athletes.find(a => a.id === match.athleteB) });
                  }
                });

                return (
                  <div key={actualIndex} style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                    <div onClick={() => setExpandedTournaments(prev => ({ ...prev, [actualIndex]: !prev[actualIndex] }))} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '15px' : '0' }}>
                      <div>
                        <h4 style={{ margin: 0 }}>{tournament.name} — {tournament.weight}</h4>
                        <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>
                          Round {tournament.rounds.length} • {lastRound.filter(m => !m.winner).length} matches pending
                        </p>
                      </div>
                      {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>

                    {isExpanded && (
                      <>
                        <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: `1px solid ${borderColor}` }}>
                          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Date: {tournament.date.month} {tournament.date.day}, {tournament.date.year}</p>
                          {tournament.officials && <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>Officials: {tournament.officials}</p>}
                          {isOfficial && activeAthletes.length > 0 && (
                            <div style={{ marginTop: '10px' }}>
                              <button onClick={() => setShowRemoveAthleteMenu(showRemoveAthleteMenu === actualIndex ? null : actualIndex)} style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <UserMinus size={14} /> Remove Athlete
                              </button>
                              {showRemoveAthleteMenu === actualIndex && (
                                <div style={{ marginTop: '10px', padding: '10px', background: darkMode ? '#3d3d3d' : '#f9f9f9', borderRadius: '4px' }}>
                                  <p style={{ fontSize: '12px', marginBottom: '8px' }}>Select athlete to remove (opponent auto-advances):</p>
                                  {activeAthletes.map(({ id, athlete }) => (
                                    <button key={id} onClick={() => removeAthleteFromTournament(actualIndex, id)} style={{ width: '100%', padding: '6px', marginBottom: '4px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', textAlign: 'left' }}>
                                      {athlete?.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                          {tournament.rounds.map((round, ri) => (
                            <div key={ri} style={{ minWidth: '260px' }}>
                              <strong>Round {ri + 1}</strong>
                              {round.map((match, mi) => {
                                const athleteA = match.athleteA === "BYE" ? { name: "BYE" } : data.athletes.find(a => a.id === match.athleteA);
                                const athleteB = match.athleteB === "BYE" ? { name: "BYE" } : data.athletes.find(a => a.id === match.athleteB);
                                const matchKey = `${actualIndex}-${ri}-${mi}`;
                                const isLastDecision = lastAction && lastAction.tournamentIndex === actualIndex && lastAction.roundIndex === ri && lastAction.matchIndex === mi;
                                return (
                                  <div key={mi} style={{ background: darkMode ? '#3d3d3d' : '#f9f9f9', padding: '10px', marginTop: '10px', borderRadius: '6px', border: `1px solid ${borderColor}` }}>
                                    <div><strong>{athleteA?.name}</strong> vs <strong>{athleteB?.name}</strong></div>
                                    {!match.winner ? (
                                      match.athleteA === "BYE" || match.athleteB === "BYE" ? <em style={{ fontSize: '12px' }}>Auto advance</em> : isOfficial && (
                                        <>
                                          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                              <button onClick={() => decideMatch(actualIndex, ri, mi, match.athleteA, 'points')} style={{ flex: 1, padding: '4px', fontSize: '11px', background: 'white', color: 'black', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>{athleteA?.name} P</button>
                                              <button onClick={() => decideMatch(actualIndex, ri, mi, match.athleteA, 'submission')} style={{ flex: 1, padding: '4px', fontSize: '11px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{athleteA?.name} S</button>
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                              <button onClick={() => decideMatch(actualIndex, ri, mi, match.athleteB, 'points')} style={{ flex: 1, padding: '4px', fontSize: '11px', background: 'white', color: 'black', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>{athleteB?.name} P</button>
                                              <button onClick={() => decideMatch(actualIndex, ri, mi, match.athleteB, 'submission')} style={{ flex: 1, padding: '4px', fontSize: '11px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{athleteB?.name} S</button>
                                            </div>
                                          </div>
                                          <button onClick={() => setShowNoShowMenu(showNoShowMenu === matchKey ? null : matchKey)} style={{ marginTop: '8px', padding: '4px 8px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                            <UserX size={14} /> No Show
                                          </button>
                                          {showNoShowMenu === matchKey && (
                                            <div style={{ marginTop: '8px', padding: '8px', background: darkMode ? '#2d2d2d' : '#f0f0f0', borderRadius: '4px' }}>
                                              <p style={{ fontSize: '11px', marginBottom: '6px' }}>Who didn't show?</p>
                                              <button onClick={() => decideMatch(actualIndex, ri, mi, match.athleteB, 'noshow')} style={{ width: '100%', padding: '6px', marginBottom: '4px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                                                {athleteA?.name} (No Show)
                                              </button>
                                              <button onClick={() => decideMatch(actualIndex, ri, mi, match.athleteA, 'noshow')} style={{ width: '100%', padding: '6px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                                                {athleteB?.name} (No Show)
                                              </button>
                                            </div>
                                          )}
                                        </>
                                      )
                                    ) : (
                                      <>
                                        <div style={{ marginTop: '6px', fontSize: '13px' }}>
                                          <strong>Winner:</strong> {data.athletes.find(a => a.id === match.winner)?.name || 'BYE'} ({match.method === 'noshow' ? 'No Show' : match.method === 'walkover' ? 'Walkover' : match.method})
                                        </div>
                                        {isOfficial && isLastDecision && (
                                          <button onClick={undoLastAction} style={{ marginTop: '8px', padding: '4px 8px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Undo size={12} /> Undo
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {currentTab === 'completed' && (
          <div>
            <h3>Completed Tournaments</h3>
            <div style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <h4>Filter by Date</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }}>
                  <option value="">All Years</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }}>
                  <option value="">All Months</option>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={filterDay} onChange={(e) => setFilterDay(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }}>
                  <option value="">All Days</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <button onClick={() => { setFilterYear(''); setFilterMonth(''); setFilterDay(''); }} style={{ padding: '8px 14px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Clear</button>
              </div>
            </div>
            {completedTournaments.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No completed tournaments</p>
            ) : (
              completedTournaments.map((tournament, ti) => (
                <div key={ti} style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  <div onClick={() => setExpandedCompletedTournament(expandedCompletedTournament === ti ? null : ti)} style={{ cursor: 'pointer' }}>
                    <h4>{tournament.name} — {tournament.weight}</h4>
                    <p style={{ fontSize: '13px', color: '#666' }}>Date: {tournament.date.month} {tournament.date.day}, {tournament.date.year}</p>
                    {tournament.officials && <p style={{ fontSize: '13px', color: '#666' }}>Officials: {tournament.officials}</p>}
                    <div><strong>Champion:</strong> {data.athletes.find(a => a.id === tournament.champ)?.name}</div>
                    <p style={{ fontSize: '12px', color: '#007bff', marginTop: '8px' }}>Click to view full results</p>
                  </div>
                  {expandedCompletedTournament === ti && (
                    <div style={{ marginTop: '15px', borderTop: `1px solid ${borderColor}`, paddingTop: '15px' }}>
                      <h5>Tournament Bracket</h5>
                      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {tournament.rounds.map((round, ri) => (
                          <div key={ri} style={{ minWidth: '260px' }}>
                            <strong>Round {ri + 1}</strong>
                            {round.map((match, mi) => {
                              const athleteA = match.athleteA === "BYE" ? { name: "BYE" } : data.athletes.find(a => a.id === match.athleteA);
                              const athleteB = match.athleteB === "BYE" ? { name: "BYE" } : data.athletes.find(a => a.id === match.athleteB);
                              return (
                                <div key={mi} style={{ background: darkMode ? '#3d3d3d' : '#f9f9f9', padding: '10px', marginTop: '10px', borderRadius: '6px', border: `1px solid ${borderColor}` }}>
                                  <div><strong>{athleteA?.name}</strong> vs <strong>{athleteB?.name}</strong></div>
                                  <div style={{ marginTop: '6px', fontSize: '13px' }}>
                                    <strong>Winner:</strong> {data.athletes.find(a => a.id === match.winner)?.name || 'BYE'} ({match.method === 'noshow' ? 'No Show' : match.method === 'walkover' ? 'Walkover' : match.method})
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedPlayer && (
        <div onClick={() => setSelectedPlayer(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: cardBg, padding: '20px', borderRadius: '10px', width: '320px' }}>
            <h3>{selectedPlayer.name}</h3>
            <p>{data.teams.find(t => t.athleteIds.includes(selectedPlayer.id))?.name} • {selectedPlayer.weight} lbs</p>
            {selectedPlayer.injured && <p style={{ color: '#dc3545', fontWeight: 'bold' }}>INJURED</p>}
            <p>Wins by Points: {selectedPlayer.stats.wins.points}</p>
            <p>Wins by Submission: {selectedPlayer.stats.wins.submission}</p>
            <p>Total Points: {selectedPlayer.stats.pointsFor}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
              <button onClick={() => setSelectedPlayer(null)} style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1 }}>Close</button>
              {isOfficial && (
                <button onClick={() => {
                  if (window.confirm(`Delete ${selectedPlayer.name}?`)) {
                    const newData = { ...data };
                    newData.teams.forEach(t => {
                      t.athleteIds = t.athleteIds.filter(aid => aid !== selectedPlayer.id);
                    });
                    newData.weightClasses.forEach(wc => {
                      wc.athleteIds = wc.athleteIds.filter(aid => aid !== selectedPlayer.id);
                    });
                    newData.athletes = newData.athletes.filter(a => a.id !== selectedPlayer.id);
                    saveData(newData);
                    setSelectedPlayer(null);
                  }
                }} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1 }}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}