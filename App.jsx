// West Point Combatives Tournament Manager
// No imports needed - React and Lucide loaded from CDN

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

// UUID Generator for unique IDs (prepares for cloud/multi-user)
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Get current timestamp (for tracking changes)
const getTimestamp = () => new Date().toISOString();

// Military date format (22 JAN 2025)
const formatMilitaryDate = (year, month, day) => {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(month);
  return `${day} ${months[monthIndex]} ${year}`;
};

// App version (for data migration compatibility)
const APP_VERSION = "2.0.0";
const DATA_VERSION = "2.0";

// Master Recovery Key - NEVER CHANGES - For password recovery
const MASTER_RECOVERY_KEY = "USMA-GTM-2025-MASTER-OVERRIDE";

// Professional Design System - Sharp Military Aesthetic
const getDesignTokens = (darkMode) => ({
  colors: {
    primary: darkMode ? '#1e40af' : '#1e3a8a',      // Deeper navy blue
    primaryHover: darkMode ? '#1e3a8a' : '#172554',
    success: darkMode ? '#15803d' : '#166534',      // Darker green
    successHover: darkMode ? '#166534' : '#14532d',
    warning: darkMode ? '#ca8a04' : '#a16207',      // Darker amber
    warningHover: darkMode ? '#a16207' : '#854d0e',
    danger: darkMode ? '#b91c1c' : '#991b1b',       // Darker red
    dangerHover: darkMode ? '#991b1b' : '#7f1d1d',
    neutral: darkMode ? '#4b5563' : '#374151',      // Darker gray

    bg: darkMode ? '#0f172a' : '#f1f5f9',            // Slightly darker bg
    bgCard: darkMode ? '#1e293b' : '#ffffff',
    bgHover: darkMode ? '#334155' : '#e2e8f0',
    bgInput: darkMode ? '#1e293b' : '#ffffff',
    bgHeader: darkMode ? '#0f172a' : '#0f172a',      // Always dark header

    text: darkMode ? '#f1f5f9' : '#0f172a',
    textMuted: darkMode ? '#94a3b8' : '#475569',
    textInverse: '#ffffff',
    textSubtle: darkMode ? '#64748b' : '#94a3b8',

    border: darkMode ? '#334155' : '#cbd5e1',
    borderLight: darkMode ? '#1e293b' : '#e2e8f0',

    gold: '#eab308',
    silver: '#94a3b8',
    bronze: '#ea580c'
  },

  shadows: {
    sm: darkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.5)' : '0 1px 3px 0 rgba(0, 0, 0, 0.12)',
    md: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.6)' : '0 4px 6px -1px rgba(0, 0, 0, 0.18)',
    lg: darkMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.7)' : '0 10px 15px -3px rgba(0, 0, 0, 0.25)',
    inner: darkMode ? 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)' : 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)'
  },

  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '11px',
      sm: '13px',
      base: '15px',
      lg: '17px',
      xl: '19px',
      '2xl': '22px',
      '3xl': '28px'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em'
    }
  },

  borderRadius: {
    sm: '3px',
    md: '4px',
    lg: '6px',
    xl: '8px',
    full: '9999px'
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px'
  }
});

export default function GrapplingTournamentApp() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('viewer');
  const [currentRegiment, setCurrentRegiment] = useState('1');
  const [currentSeason, setCurrentSeason] = useState('active');
  const [seasonName, setSeasonName] = useState('');
  const [archivedSeasons, setArchivedSeasons] = useState([]);
  const [viewingArchivedSeason, setViewingArchivedSeason] = useState(false);
  const [showSeasonManager, setShowSeasonManager] = useState(false);
  const [coachPassword, setCoachPassword] = useState('');
  const [coachTeam, setCoachTeam] = useState('');
  const [showCoachTeamSelector, setShowCoachTeamSelector] = useState(false);
  const [showRoleBanner, setShowRoleBanner] = useState(true);
  const [showMasterKeyInfo, setShowMasterKeyInfo] = useState(false);
  const [showOfficialNamePrompt, setShowOfficialNamePrompt] = useState(false);
  const [officialName, setOfficialName] = useState('');
  const [tournamentFilter, setTournamentFilter] = useState('all'); // 'all' or 'mine'

  // Loading and notification states
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success', 'error', 'info'
  const [showToast, setShowToast] = useState(false);

  // Undo functionality
  const [undoStack, setUndoStack] = useState([]);

  // Backup tracking
  const [lastBackupDate, setLastBackupDate] = useState(null);

  // Stats view toggle
  const [statsView, setStatsView] = useState('season'); // 'season' or 'lifetime'

  // Session persistence - roles stay active until explicitly logged out or password changed
  const [roleSession, setRoleSession] = useState({
    isAuthenticated: false,
    role: 'viewer',
    team: null, // for coaches
    officialName: null, // for officials
    authenticatedAt: null
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [officialPassword, setOfficialPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [editingPasswords, setEditingPasswords] = useState(false);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newOfficialPassword, setNewOfficialPassword] = useState('');
  const [newCoachPassword, setNewCoachPassword] = useState('');
  const [regimentName, setRegimentName] = useState('');
  const [editingRegimentName, setEditingRegimentName] = useState(false);
  const [dashboardImages, setDashboardImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
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
  const [newAthleteIsCoach, setNewAthleteIsCoach] = useState(false);
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [editingAthlete, setEditingAthlete] = useState(null);
  const [editAthleteName, setEditAthleteName] = useState('');
  const [editAthleteWeight, setEditAthleteWeight] = useState('');
  const [editAthleteIsCoach, setEditAthleteIsCoach] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [showNoShowMenu, setShowNoShowMenu] = useState(null);
  const [showRemoveAthleteMenu, setShowRemoveAthleteMenu] = useState(null);
  const [athleteSearch, setAthleteSearch] = useState('');
  const [seedingMode, setSeedingMode] = useState(null);
  const [seedingAthletes, setSeedingAthletes] = useState([]);
  const [showAddWeightClass, setShowAddWeightClass] = useState(false);
  const [newWeightClassName, setNewWeightClassName] = useState('');
  const [editingWeightClass, setEditingWeightClass] = useState(null);
  const [editWeightClassName, setEditWeightClassName] = useState('');
  const [announcements, setAnnouncements] = useState('');
  const [editingAnnouncements, setEditingAnnouncements] = useState(false);
  const [analyticsFilter, setAnalyticsFilter] = useState({ type: 'team', id: '', startDate: '', endDate: '' });
  const [showPositionScoring, setShowPositionScoring] = useState(null);
  const [positionPoints, setPositionPoints] = useState({ sideMount: 0, topMount: 0, backMount: 0 });
  const [matchNotes, setMatchNotes] = useState('');
  const [showMatchNotes, setShowMatchNotes] = useState(null);

  useEffect(() => {
    const seasonKey = currentSeason === 'active'
      ? `grappling_${currentRegiment}`
      : `grappling_${currentRegiment}_archived_${currentSeason}`;

    // Load archived seasons list
    const archivedListKey = `grappling_${currentRegiment}_archived_list`;

    // Load persistent role session
    const sessionKey = `grappling_${currentRegiment}_session`;

    setViewingArchivedSeason(currentSeason !== 'active');

    // Firebase real-time listener
    if (window.firebase) {
      const { database, ref, onValue } = window.firebase;

      // Listen to data changes
      const path = currentSeason === 'active'
        ? `regiments/${currentRegiment}/active`
        : `regiments/${currentRegiment}/archived/${currentSeason}`;
      const dataRef = ref(database, path);

      const unsubscribe = onValue(dataRef, (snapshot) => {
        const firebaseData = snapshot.val();

        if (firebaseData) {
          // Process Firebase data
          firebaseData.athletes.forEach(a => {
            a.stats = a.stats || {};
            a.stats.wins = a.stats.wins || { points: 0, submission: 0 };
            a.stats.losses = a.stats.losses || { points: 0, submission: 0 };
            a.stats.pointsFor = a.stats.pointsFor || 0;
            a.injured = a.injured || false;
            a.isCoach = a.isCoach || false;
          });
          if (!firebaseData.weightClasses || firebaseData.weightClasses.length === 0) {
            firebaseData.weightClasses = WEIGHT_BRACKETS.map(b => ({ name: b.name, athleteIds: [] }));
          }
          setData(firebaseData);
          setAnnouncements(firebaseData.announcements || '');
          setAdminPassword(firebaseData.adminPassword || '');
          setOfficialPassword(firebaseData.officialPassword || '');
          setCoachPassword(firebaseData.coachPassword || '');
          setRegimentName(firebaseData.regimentName || `Regiment ${currentRegiment}`);
          setDashboardImages(firebaseData.dashboardImages || []);
          setSeasonName(firebaseData.seasonName || generateSeasonName());
        } else {
          // No data in Firebase, try localStorage fallback
          const stored = localStorage.getItem(seasonKey);
          if (stored) {
            const parsed = JSON.parse(stored);
            parsed.athletes.forEach(a => {
              a.stats = a.stats || {};
              a.stats.wins = a.stats.wins || { points: 0, submission: 0 };
              a.stats.losses = a.stats.losses || { points: 0, submission: 0 };
              a.stats.pointsFor = a.stats.pointsFor || 0;
              a.injured = a.injured || false;
              a.isCoach = a.isCoach || false;
            });
            if (!parsed.weightClasses || parsed.weightClasses.length === 0) {
              parsed.weightClasses = WEIGHT_BRACKETS.map(b => ({ name: b.name, athleteIds: [] }));
            }
            setData(parsed);
            setAnnouncements(parsed.announcements || '');
            setAdminPassword(parsed.adminPassword || '');
            setOfficialPassword(parsed.officialPassword || '');
            setCoachPassword(parsed.coachPassword || '');
            setRegimentName(parsed.regimentName || `Regiment ${currentRegiment}`);
            setDashboardImages(parsed.dashboardImages || []);
            setSeasonName(parsed.seasonName || generateSeasonName());
          } else {
            // Initialize empty
            const newSeasonName = generateSeasonName();
            setData({
              athletes: [],
              teams: [],
              weightClasses: WEIGHT_BRACKETS.map(b => ({ name: b.name, athleteIds: [] })),
              tournaments: [],
              announcements: ''
            });
            setAnnouncements('');
            setAdminPassword('');
            setOfficialPassword('');
            setCoachPassword('');
            setRegimentName(`Regiment ${currentRegiment}`);
            setDashboardImages([]);
            setSeasonName(newSeasonName);
          }
        }
      });

      // Load archived seasons list from Firebase
      const archivedRef = ref(database, `regiments/${currentRegiment}/archivedList`);
      const unsubscribeArchived = onValue(archivedRef, (snapshot) => {
        const list = snapshot.val();
        if (list) {
          setArchivedSeasons(list);
        } else {
          // Fallback to localStorage
          const archivedList = localStorage.getItem(archivedListKey);
          if (archivedList) {
            setArchivedSeasons(JSON.parse(archivedList));
          } else {
            setArchivedSeasons([]);
          }
        }
      });

      // Load session (still from localStorage for security)
      const storedSession = localStorage.getItem(sessionKey);
      if (storedSession) {
        const session = JSON.parse(storedSession);
        setRoleSession(session);
        if (session.isAuthenticated && session.role !== 'viewer') {
          setCurrentRole(session.role);
          if (session.team) {
            setCoachTeam(session.team);
          }
          if (session.officialName) {
            setOfficialName(session.officialName);
          }
        }
      }

      // Cleanup listeners
      return () => {
        unsubscribe();
        unsubscribeArchived();
      };
    } else {
      // Fallback to localStorage if Firebase not available
      const stored = localStorage.getItem(seasonKey);
      const archivedList = localStorage.getItem(archivedListKey);
      if (archivedList) {
        setArchivedSeasons(JSON.parse(archivedList));
      } else {
        setArchivedSeasons([]);
      }

      const storedSession = localStorage.getItem(sessionKey);
      if (storedSession) {
        const session = JSON.parse(storedSession);
        setRoleSession(session);
        if (session.isAuthenticated && session.role !== 'viewer') {
          setCurrentRole(session.role);
          if (session.team) {
            setCoachTeam(session.team);
          }
          if (session.officialName) {
            setOfficialName(session.officialName);
          }
        }
      }

      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.athletes.forEach(a => {
          a.stats = a.stats || {};
          a.stats.wins = a.stats.wins || { points: 0, submission: 0 };
          a.stats.losses = a.stats.losses || { points: 0, submission: 0 };
          a.stats.pointsFor = a.stats.pointsFor || 0;
          a.injured = a.injured || false;
          a.isCoach = a.isCoach || false;
        });
        if (!parsed.weightClasses || parsed.weightClasses.length === 0) {
          parsed.weightClasses = WEIGHT_BRACKETS.map(b => ({ name: b.name, athleteIds: [] }));
        }
        setData(parsed);
        setAnnouncements(parsed.announcements || '');
        setAdminPassword(parsed.adminPassword || '');
        setOfficialPassword(parsed.officialPassword || '');
        setCoachPassword(parsed.coachPassword || '');
        setRegimentName(parsed.regimentName || `Regiment ${currentRegiment}`);
        setDashboardImages(parsed.dashboardImages || []);
        setSeasonName(parsed.seasonName || generateSeasonName());
      } else {
        const newSeasonName = generateSeasonName();
        setData({
          athletes: [],
          teams: [],
          weightClasses: WEIGHT_BRACKETS.map(b => ({ name: b.name, athleteIds: [] })),
          tournaments: [],
          announcements: ''
        });
        setAnnouncements('');
        setAdminPassword('');
        setOfficialPassword('');
        setCoachPassword('');
        setRegimentName(`Regiment ${currentRegiment}`);
        setDashboardImages([]);
        setSeasonName(newSeasonName);
      }
    }
  }, [currentRegiment, currentSeason]);

  // Auto-rotate slideshow
  useEffect(() => {
    if (dashboardImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % dashboardImages.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(timer);
    }
  }, [dashboardImages.length]);

  const generateSeasonName = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const yearShort = year.toString().slice(-2);

    // Jan-May = Spring, Jun-Aug = Summer, Sep-Dec = Fall
    let semester;
    if (month >= 0 && month <= 4) semester = 'Spring';
    else if (month >= 5 && month <= 7) semester = 'Summer';
    else semester = 'Fall';

    return `${semester} ${yearShort}`;
  };

  const archiveCurrentSeason = (customName) => {
    if (!customName || customName.trim() === '') {
      alert('Please enter a season name');
      return;
    }

    // Save current data as archived season
    const archiveKey = `grappling_${currentRegiment}_archived_${customName.replace(/\s+/g, '_')}`;
    const dataToArchive = {
      ...data,
      announcements,
      adminPassword,
      officialPassword,
      regimentName,
      dashboardImages,
      seasonName: customName,
      archivedDate: new Date().toISOString()
    };
    localStorage.setItem(archiveKey, JSON.stringify(dataToArchive));

    // Update archived seasons list
    const archivedListKey = `grappling_${currentRegiment}_archived_list`;
    let archived = archivedSeasons.filter(s => s.name !== customName); // Remove if exists
    archived.unshift({ name: customName, key: customName.replace(/\s+/g, '_'), date: new Date().toISOString() });

    // Keep only 5 most recent
    if (archived.length > 5) {
      const removed = archived.splice(5);
      // Delete old archived seasons from localStorage
      removed.forEach(season => {
        localStorage.removeItem(`grappling_${currentRegiment}_archived_${season.key}`);
      });
    }

    localStorage.setItem(archivedListKey, JSON.stringify(archived));
    setArchivedSeasons(archived);

    // Clear current season data
    const newSeasonName = generateSeasonName();
    const freshData = {
      athletes: [],
      teams: [],
      weightClasses: WEIGHT_BRACKETS.map(b => ({ name: b.name, athleteIds: [] })),
      tournaments: [],
      announcements: '',
      adminPassword,
      officialPassword,
      regimentName,
      dashboardImages: [],
      seasonName: newSeasonName
    };

    localStorage.setItem(`grappling_${currentRegiment}`, JSON.stringify(freshData));
    setCurrentSeason('active');
    setData({
      athletes: [],
      teams: [],
      weightClasses: WEIGHT_BRACKETS.map(b => ({ name: b.name, athleteIds: [] })),
      tournaments: []
    });
    setAnnouncements('');
    setDashboardImages([]);
    setSeasonName(newSeasonName);

    alert(`Season "${customName}" archived successfully! Starting fresh season: ${newSeasonName}`);
  };

  // Save role session (persists until logout or password change)
  const saveRoleSession = (role, team = null, officialName = null) => {
    const session = {
      isAuthenticated: true,
      role: role,
      team: team,
      officialName: officialName,
      authenticatedAt: getTimestamp()
    };
    setRoleSession(session);
    const sessionKey = `grappling_${currentRegiment}_session`;
    localStorage.setItem(sessionKey, JSON.stringify(session));
  };

  // Logout (clear session)
  const logout = () => {
    const session = {
      isAuthenticated: false,
      role: 'viewer',
      team: null,
      officialName: null,
      authenticatedAt: null
    };
    setRoleSession(session);
    setCurrentRole('viewer');
    setCoachTeam('');
    setOfficialName('');
    const sessionKey = `grappling_${currentRegiment}_session`;
    localStorage.removeItem(sessionKey);
  };

  // Clear session when passwords change (invalidates all sessions)
  const invalidateAllSessions = () => {
    for (let i = 1; i <= 4; i++) {
      const sessionKey = `grappling_${i}_session`;
      localStorage.removeItem(sessionKey);
    }
    if (currentRole !== 'viewer') {
      logout();
    }
  };

  // Toast notification helper
  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Download full backup (all regiments, all seasons)
  const downloadFullBackup = () => {
    const backup = {
      version: APP_VERSION,
      dataVersion: DATA_VERSION,
      exportDate: new Date().toISOString(),
      regiments: {}
    };

    // Export all 4 regiments
    for (let i = 1; i <= 4; i++) {
      const regimentData = {
        active: null,
        archived: []
      };

      // Get active season
      const activeKey = `grappling_${i}`;
      const activeData = localStorage.getItem(activeKey);
      if (activeData) {
        regimentData.active = JSON.parse(activeData);
      }

      // Get archived seasons
      const archivedListKey = `grappling_${i}_archived_list`;
      const archivedList = localStorage.getItem(archivedListKey);
      if (archivedList) {
        const seasons = JSON.parse(archivedList);
        seasons.forEach(season => {
          const seasonKey = `grappling_${i}_archived_${season.key}`;
          const seasonData = localStorage.getItem(seasonKey);
          if (seasonData) {
            regimentData.archived.push({
              seasonInfo: season,
              data: JSON.parse(seasonData)
            });
          }
        });
      }

      // Get session data
      const sessionKey = `grappling_${i}_session`;
      const sessionData = localStorage.getItem(sessionKey);
      if (sessionData) {
        regimentData.session = JSON.parse(sessionData);
      }

      backup.regiments[i] = regimentData;
    }

    // Create downloadable file
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().split('T')[0];
    a.download = `GTM_FULL_BACKUP_${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Update last backup date
    localStorage.setItem('lastBackupDate', new Date().toISOString());
    setLastBackupDate(new Date());

    showToastNotification('Full backup downloaded successfully!', 'success');
  };

  // Restore from backup file
  const restoreFromBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        // Validate backup format
        if (!backup.regiments || !backup.version) {
          showToastNotification('Invalid backup file format', 'error');
          return;
        }

        if (!window.confirm(`This will restore data from backup created on ${new Date(backup.exportDate).toLocaleDateString()}. Current data will be overwritten. Continue?`)) {
          return;
        }

        // Restore all regiments
        Object.keys(backup.regiments).forEach(regimentNum => {
          const regimentData = backup.regiments[regimentNum];

          // Restore active season
          if (regimentData.active) {
            localStorage.setItem(`grappling_${regimentNum}`, JSON.stringify(regimentData.active));
          }

          // Restore archived seasons
          if (regimentData.archived && regimentData.archived.length > 0) {
            const seasonsList = regimentData.archived.map(s => s.seasonInfo);
            localStorage.setItem(`grappling_${regimentNum}_archived_list`, JSON.stringify(seasonsList));

            regimentData.archived.forEach(archivedSeason => {
              const seasonKey = `grappling_${regimentNum}_archived_${archivedSeason.seasonInfo.key}`;
              localStorage.setItem(seasonKey, JSON.stringify(archivedSeason.data));
            });
          }

          // Restore session
          if (regimentData.session) {
            localStorage.setItem(`grappling_${regimentNum}_session`, JSON.stringify(regimentData.session));
          }
        });

        showToastNotification('Backup restored successfully! Refreshing...', 'success');
        setTimeout(() => window.location.reload(), 1500);

      } catch (error) {
        console.error('Restore error:', error);
        showToastNotification('Failed to restore backup: ' + error.message, 'error');
      }
    };
    reader.readAsText(file);

    // Clear file input
    event.target.value = '';
  };

  // Check last backup date on load
  useEffect(() => {
    const lastBackup = localStorage.getItem('lastBackupDate');
    if (lastBackup) {
      setLastBackupDate(new Date(lastBackup));
    }
  }, []);

  // Firebase connection status monitor
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

  // Show backup reminder if needed
  useEffect(() => {
    if (!lastBackupDate) return;

    const daysSinceBackup = (Date.now() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24);

    // Remind weekly
    if (daysSinceBackup >= 7 && currentRole === 'admin') {
      const timer = setTimeout(() => {
        showToastNotification(`⚠️ Last backup: ${Math.floor(daysSinceBackup)} days ago. Backup recommended!`, 'info');
      }, 3000); // Show 3 seconds after load

      return () => clearTimeout(timer);
    }
  }, [lastBackupDate, currentRole]);

  // Add action to undo stack (keep last 10 actions)
  const addToUndoStack = (action) => {
    setUndoStack(prev => [...prev.slice(-9), { ...action, timestamp: Date.now() }]);
  };

  // Undo last action
  const undoLastAction = () => {
    if (undoStack.length === 0) {
      showToastNotification('Nothing to undo', 'info');
      return;
    }

    const lastAction = undoStack[undoStack.length - 1];
    const timeSince = Date.now() - lastAction.timestamp;

    // Only allow undo within 5 minutes
    if (timeSince > 300000) {
      showToastNotification('Action too old to undo (5 min limit)', 'error');
      return;
    }

    // Restore previous state
    if (lastAction.type === 'matchResult') {
      const newData = JSON.parse(JSON.stringify(data));
      const tournament = newData.tournaments[lastAction.tournamentIndex];
      const round = tournament.rounds[lastAction.roundIndex];
      const match = round[lastAction.matchIndex];

      // Clear match result
      match.winner = null;
      match.method = null;
      match.score = null;
      match.positionPoints = null;
      match.notes = null;

      // Restore athlete stats
      if (lastAction.previousStats) {
        const winnerAthlete = newData.athletes.find(a => a.id === lastAction.winnerId);
        const loserAthlete = newData.athletes.find(a => a.id === lastAction.loserId);
        if (winnerAthlete) winnerAthlete.stats = lastAction.previousStats.winner;
        if (loserAthlete) loserAthlete.stats = lastAction.previousStats.loser;
      }

      saveData(newData);
      setUndoStack(prev => prev.slice(0, -1));
      showToastNotification('Match result undone', 'success');
    }
  };

  // Generate comprehensive help/instructions document
  const generateHelpDocument = () => {
    const helpContent = `
╔════════════════════════════════════════════════════════════════════════════╗
║                      WEST POINT COMBATIVES                             ║
║                      USER GUIDE & INSTRUCTIONS                         ║
║                          Version ${APP_VERSION}                                        ║
╚════════════════════════════════════════════════════════════════════════════╝

Created by: CDT Natas Coats '27 A3
Last Updated: ${new Date().toLocaleDateString()}

════════════════════════════════════════════════════════════════════════════
TABLE OF CONTENTS
════════════════════════════════════════════════════════════════════════════

1. Getting Started
2. User Roles & Permissions
3. Managing Teams & Athletes
4. Running Tournaments
5. Viewing Statistics
6. Administrative Functions
7. Password Recovery
8. Data Management
9. Troubleshooting
10. Contact & Support

════════════════════════════════════════════════════════════════════════════
1. GETTING STARTED
════════════════════════════════════════════════════════════════════════════

ACCESSING THE APP:
  • Open the application in any modern web browser
  • Chrome, Firefox, Safari, or Edge recommended
  • Works on desktop, tablet, and mobile devices

SELECTING YOUR REGIMENT:
  • Use the "Regiment" dropdown in the top-right header
  • Choose from Regiment 1, 2, 3, or 4
  • Each regiment has independent data

UNDERSTANDING SEASONS:
  • Each regiment has an active season plus up to 5 archived seasons
  • Seasons are typically semester-based (Fall, Spring, Summer)
  • Use "Season" dropdown to view archived seasons (read-only)
  • Admins can archive current season and start fresh

════════════════════════════════════════════════════════════════════════════
2. USER ROLES & PERMISSIONS
════════════════════════════════════════════════════════════════════════════

VIEWER (Default - No Password):
  ✓ View all tournaments, brackets, and statistics
  ✓ Search for athletes
  ✓ View team standings
  ✓ Print brackets
  ✗ Cannot edit or create anything

COACH (Password Protected):
  ✓ All Viewer permissions
  ✓ Edit their assigned team name
  ✓ Edit athletes on their team (names, weights)
  ✓ Mark athletes as injured/healed
  ✗ Cannot create tournaments
  ✗ Cannot edit other teams
  
  HOW TO LOGIN AS COACH:
  1. Select "Coach" from role dropdown
  2. Enter coach password (if set)
  3. Select your team from dropdown
  4. Click "Login as Coach"
  5. Your session persists until logout

OFFICIAL (Password Protected):
  ✓ All Viewer permissions
  ✓ Create and manage tournaments
  ✓ Edit all teams and athletes
  ✓ Manage weight classes
  ✓ Enter match results
  ✗ Cannot access Admin panel
  
  HOW TO LOGIN AS OFFICIAL:
  1. Select "Official" from role dropdown
  2. Enter official password (if set)
  3. Enter your name (e.g., "CDT Smith")
  4. Click "Login as Official"
  5. Your name will be attached to tournaments you create
  6. Filter tournaments: "All" or "My Tournaments"

ADMIN (Password Protected):
  ✓ Full system access
  ✓ All Official permissions
  ✓ Change passwords
  ✓ Manage slideshow
  ✓ Archive seasons
  ✓ Import/export data
  ✓ Access Master Recovery Key
  
  HOW TO LOGIN AS ADMIN:
  1. Select "Admin" from role dropdown
  2. Enter admin password
  3. Admin tab becomes available

LOGGING OUT:
  • Click the red "🚪 Logout" button in header
  • Returns you to Viewer role
  • Clears your session

════════════════════════════════════════════════════════════════════════════
3. MANAGING TEAMS & ATHLETES
════════════════════════════════════════════════════════════════════════════

CREATING TEAMS (Officials/Admins):
  1. Go to "Teams" tab
  2. Click "Add Team" button
  3. Enter team name (e.g., "Alpha Company", "Bravo Company")
  4. Click "Create Team"

ADDING ATHLETES (Officials/Admins):
  METHOD 1 - Manual Entry:
  1. Go to "Athletes" tab
  2. Click "Add Athlete" button
  3. Enter: Name, Team, Weight, Role (Player/Coach)
  4. Click "Create Athlete"
  
  METHOD 2 - Excel Import:
  1. Go to Admin tab
  2. Click "Download Import Template"
  3. Fill in Excel file with athlete data
  4. Click "Import from Excel"
  5. Select your completed file
  6. Athletes automatically created

EDITING ATHLETES:
  • Click pencil icon next to athlete name
  • Modify name, weight, or coach status
  • Click "Save" to confirm changes

MANAGING INJURIES:
  • Click injury icon next to athlete name
  • Injured athletes marked with ⚠️
  • Injured athletes excluded from tournaments
  • Click again to mark as healed

WEIGHT CLASSES:
  • Athletes automatically assigned to weight classes
  • Based on their recorded weight
  • Standard brackets: 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 285+

════════════════════════════════════════════════════════════════════════════
4. RUNNING TOURNAMENTS
════════════════════════════════════════════════════════════════════════════

CREATING A TOURNAMENT (Officials Only):
  1. Go to "Tournaments" tab
  2. Fill in tournament details:
     - Tournament Name (e.g., "Fall Championship")
     - Officials (comma-separated names)
     - Weight Class (from dropdown)
     - Date (Year, Month, Day)
  3. Choose seeding method:
     - "Start (Random Seeding)" - Athletes randomly placed
     - "Manual Seeding" - Arrange athletes yourself
  4. Tournament created and appears in active list
  5. Your name automatically attached as "Managed by"

MANUAL SEEDING:
  1. After selecting weight class, click "Manual Seeding"
  2. Use up/down arrows to arrange athletes
  3. Top seed = #1, bottom seed = last position
  4. Click "Confirm & Start Tournament"
  5. Bracket generated with your seeding

ENTERING MATCH RESULTS:
  1. Click on active tournament to expand
  2. Each match shows two athletes
  3. Click athlete's name to declare winner
  4. Enter:
     - Win Method (Points/Submission/No Show)
     - Score (if Points)
     - Position Points (if applicable)
     - Match Notes (optional)
  5. Click "Submit Result"
  6. Bracket automatically advances
  
TRACKING PROGRESS:
  • Tournament card shows "Round X • Y matches pending"
  • Green = completed matches
  • Yellow = pending matches
  • Automatically advances to next round when round completes

COMPLETING TOURNAMENTS:
  • Finals winner automatically declared champion
  • Tournament marked "done"
  • Moves to "Completed Tournaments" tab
  • Champion displayed with 🏆

REMOVING ATHLETES MID-TOURNAMENT:
  1. Expand active tournament
  2. Click "Remove Athlete" button
  3. Select athlete to remove
  4. Opponent automatically gets walkover win
  5. Bracket continues

FILTERING TOURNAMENTS (Officials):
  • "All Tournaments" - See every active tournament
  • "My Tournaments" - See only tournaments you created
  • Counter shows how many are yours

════════════════════════════════════════════════════════════════════════════
5. VIEWING STATISTICS
════════════════════════════════════════════════════════════════════════════

DASHBOARD:
  • Quick stats overview
  • Team points leaderboard (visual bar chart)
  • Top 5 athletes by points
  • Active tournament progress cards
  • Official announcements
  • Slideshow (if configured)

ANALYTICS TAB:
  • Filter by Year, Month, Day
  • View all match results in table format
  • See wins/losses by method
  • Position points tracking
  • Match notes display

TEAM STANDINGS:
  • Teams tab shows total points per team
  • Click team to expand roster
  • See all athletes on team
  • Individual athlete stats

ATHLETE PROFILES:
  • Click athlete name anywhere
  • Full stats: Wins, Losses, Points
  • Breakdown by method (Points/Submission)
  • Complete match history
  • Current status (Active/Injured)

COMPLETED TOURNAMENTS:
  • Filter by date (Year, Month, Day)
  • View full bracket history
  • See championship results
  • Print historical brackets

════════════════════════════════════════════════════════════════════════════
6. ADMINISTRATIVE FUNCTIONS
════════════════════════════════════════════════════════════════════════════

PASSWORD MANAGEMENT (Admin Only):
  1. Go to Admin tab
  2. Scroll to "Password Management"
  3. Click "Edit" to change passwords
  4. Set passwords for Coach, Official, Admin roles
  5. Leave blank to remove password protection
  6. Click "Save Passwords"
  7. NOTE: All active sessions logged out when passwords change

MASTER RECOVERY KEY:
  • Permanent password: ${MASTER_RECOVERY_KEY}
  • NEVER changes
  • Works for ALL roles (Coach, Official, Admin)
  • Use for password recovery
  • Store securely with official documents
  • Pass to successor during handoff
  
  Actions Available:
  • Copy Key - Copies to clipboard
  • View Full Info - See detailed instructions
  • Print Recovery Sheet - Generate printable document

REGIMENT SETTINGS:
  • Customize regiment name (default: "Regiment 1")
  • Name appears throughout interface

DASHBOARD SLIDESHOW:
  • Upload images with captions
  • Auto-rotates every 5 seconds
  • Displays on dashboard (450px tall)
  • Navigation arrows and dot indicators
  • Delete images as needed

SEASON MANAGEMENT:
  • View current season info (teams, athletes, tournaments)
  • Rename current season
  • Archive current season:
    - Saves all data to archive
    - Starts fresh season
    - Keeps up to 5 archived seasons
    - Oldest auto-deleted when 6th created
  • View archived seasons (read-only)
  • Delete archived seasons
  • Switch between seasons via header dropdown

DATA MANAGEMENT:
  1. Export to Excel:
     - Downloads current athletes roster
     - Includes: Name, Team, Weight, Role
  
  2. Download Import Template:
     - Pre-formatted Excel template
     - Fill and import to add athletes
  
  3. Import from Excel:
     - Upload completed template
     - Athletes auto-created
     - Teams auto-created if needed
  
  4. Generate Test Data:
     - Creates sample teams and athletes
     - Useful for testing
  
  5. Clear All Data:
     - Deletes everything (teams, athletes, tournaments)
     - DOUBLE CONFIRMATION required
     - Cannot be undone

════════════════════════════════════════════════════════════════════════════
7. PASSWORD RECOVERY
════════════════════════════════════════════════════════════════════════════

IF PASSWORDS ARE LOST:

Option 1 - Use Master Recovery Key:
  1. Try to login as Admin/Official/Coach
  2. Click "Forgot password? Use Master Recovery Key"
  3. Enter: ${MASTER_RECOVERY_KEY}
  4. Gain admin access
  5. Reset passwords in Admin panel

Option 2 - Check Physical Records:
  • Look for printed recovery sheet
  • Should be stored with unit documents
  • Contains all passwords and master key

Option 3 - Contact Previous Admin:
  • They may have password information
  • Can provide master recovery key

AFTER RECOVERY:
  1. Login using master key
  2. Go to Admin tab > Password Management
  3. Set new passwords for all roles
  4. Print new recovery sheet
  5. Store securely

════════════════════════════════════════════════════════════════════════════
8. DATA MANAGEMENT
════════════════════════════════════════════════════════════════════════════

DATA STORAGE:
  • Current: Browser localStorage (local computer only)
  • Future: Cloud database (when deployed online)
  • Each regiment stored independently
  • Seasons stored separately

BACKING UP DATA:
  1. Go to Admin tab
  2. Click "Export to Excel"
  3. Save file to safe location
  4. Optional: Save to shared drive
  5. Recommended: Weekly backups

RESTORING DATA:
  1. Go to Admin tab
  2. Click "Import from Excel"
  3. Select backup file
  4. Data restored

CLEARING BROWSER DATA:
  ⚠️ WARNING: Clearing browser cache/data deletes everything!
  • Always export before clearing browser
  • Keep backup files on shared drive
  • Regular exports prevent data loss

SEASON TRANSITIONS:
  1. At end of semester, archive current season
  2. Exports automatically saved
  3. New season starts fresh
  4. Old seasons remain viewable (read-only)

════════════════════════════════════════════════════════════════════════════
9. TROUBLESHOOTING
════════════════════════════════════════════════════════════════════════════

PROBLEM: Can't login as Official/Coach/Admin
SOLUTION:
  • Verify password is correct
  • Try master recovery key: ${MASTER_RECOVERY_KEY}
  • Check if passwords were set (Admin may not have set them)
  • Clear browser cache and try again

PROBLEM: Athletes not appearing in tournament
SOLUTION:
  • Check if athlete is marked injured (⚠️)
  • Verify athlete weight matches selected weight class
  • Ensure athlete exists before creating tournament

PROBLEM: Can't see my data
SOLUTION:
  • Check correct regiment selected (top-right dropdown)
  • Check viewing correct season (not archived)
  • Verify not in incognito/private browsing mode

PROBLEM: Tournament not advancing
SOLUTION:
  • Ensure ALL matches in current round completed
  • Check for matches with no winner selected
  • Look for yellow "pending" indicators

PROBLEM: Lost all data
SOLUTION:
  • Check if browser cache was cleared
  • Look for Excel export backups
  • Check shared drive for backups
  • If no backup: must start fresh

PROBLEM: Bracket looks wrong
SOLUTION:
  • Ensure athletes properly seeded
  • Check if athlete was removed mid-tournament
  • Verify no duplicate athletes in bracket

PROBLEM: Can't print bracket
SOLUTION:
  • Ensure pop-ups are allowed in browser
  • Click "Print Bracket" button again
  • Try different browser
  • Check printer settings

PROBLEM: Multiple officials editing same tournament
SOLUTION:
  • Use "My Tournaments" filter
  • Each official creates their own tournaments
  • Official name shows who manages each tournament
  • Coordinate with other officials

════════════════════════════════════════════════════════════════════════════
10. SUCCESSION PLANNING & HANDOFF
════════════════════════════════════════════════════════════════════════════

PREPARING FOR HANDOFF:

1. EXPORT CURRENT DATA:
   • Admin tab > Export to Excel
   • Save to shared drive
   • Include current date in filename

2. PRINT RECOVERY SHEET:
   • Admin tab > Master Recovery Key section
   • Click "Print Recovery Sheet"
   • Store with official documents

3. DOCUMENT CURRENT STATE:
   • Note: Current season name
   • Note: Active tournaments
   • Note: Any ongoing issues
   • Note: Contact info (if applicable)

4. BRIEF SUCCESSOR:
   • Show them this guide
   • Demonstrate key functions
   • Provide passwords (or master key)
   • Show where backups stored

INFORMATION TO PASS ON:
  ✓ Master Recovery Key: ${MASTER_RECOVERY_KEY}
  ✓ Current passwords (or they can reset)
  ✓ Location of backup files
  ✓ This instruction document
  ✓ Any unit-specific procedures

NEW ADMIN CHECKLIST:
  □ Receive master recovery key
  □ Login using master key or current password
  □ Reset all passwords (optional)
  □ Print new recovery sheet
  □ Export current data as backup
  □ Review active season data
  □ Test creating a tournament
  □ Familiarize with all tabs
  □ Read this entire guide

════════════════════════════════════════════════════════════════════════════
QUICK REFERENCE
════════════════════════════════════════════════════════════════════════════

MASTER RECOVERY KEY: ${MASTER_RECOVERY_KEY}

ROLE PASSWORDS:
  Coach Password: ${coachPassword ? '(Set - see Admin)' : '(Not set)'}
  Official Password: ${officialPassword ? '(Set - see Admin)' : '(Not set)'}
  Admin Password: ${adminPassword ? '(Set - see Admin)' : '(Not set)'}

KEY SHORTCUTS:
  • Search Athletes: Type in search box (Athletes tab)
  • Quick Login: Password + Enter key
  • Expand Tournament: Click tournament card
  • Declare Winner: Click athlete name in match
  • Logout: Red button in top-right header

COMMON WORKFLOWS:

Add New Athlete:
  Athletes tab > Add Athlete > Fill form > Create

Create Tournament:
  Tournaments tab > Fill details > Choose seeding > Start

Enter Match Result:
  Tournaments tab > Expand tournament > Click winner > Enter details

Archive Season:
  Admin tab > Season Management > Archive Current Season

View Statistics:
  Analytics tab > Set filters > View results

════════════════════════════════════════════════════════════════════════════
ADDITIONAL RESOURCES
════════════════════════════════════════════════════════════════════════════

For questions, issues, or suggestions:
  • Contact: CDT Natas Coats '27 A3 (creator)
  • Check unit procedures for specific workflows
  • Refer to this guide for standard operations

App Information:
  Version: ${APP_VERSION}
  Data Version: ${DATA_VERSION}
  Created: 2025
  Infrastructure: Multi-User Ready (Cloud-Ready)

════════════════════════════════════════════════════════════════════════════
END OF USER GUIDE
════════════════════════════════════════════════════════════════════════════

This document can be printed or saved for reference.
Last Generated: ${new Date().toLocaleString()}
`;

    return helpContent;
  };

  const saveData = (newData) => {
    const seasonKey = currentSeason === 'active'
      ? `grappling_${currentRegiment}`
      : `grappling_${currentRegiment}_archived_${currentSeason}`;

    const dataToSave = {
      ...newData,
      announcements,
      adminPassword,
      officialPassword,
      coachPassword,
      regimentName,
      dashboardImages,
      seasonName
    };

    // Save to Firebase if available
    if (window.firebase) {
      try {
        const { database, ref, set } = window.firebase;
        const path = currentSeason === 'active'
          ? `regiments/${currentRegiment}/active`
          : `regiments/${currentRegiment}/archived/${currentSeason}`;
        const dataRef = ref(database, path);
        set(dataRef, dataToSave); // No await
      } catch (error) {
        console.error('Firebase save error:', error);
        // Fallback to localStorage
        localStorage.setItem(seasonKey, JSON.stringify(dataToSave));
      }
    } else {
      // Fallback to localStorage if Firebase not available
      localStorage.setItem(seasonKey, JSON.stringify(dataToSave));
    }

    setData(newData);
  };

  const saveAnnouncements = (text) => {
    setAnnouncements(text);
    const dataToSave = { ...data, announcements: text };

    // Save to Firebase if available
    if (window.firebase) {
      try {
        const { database, ref, set } = window.firebase;
        const dataRef = ref(database, `regiments/${currentRegiment}/active`);
        set(dataRef, dataToSave); // No await
      } catch (error) {
        console.error('Firebase save error:', error);
        localStorage.setItem(`grappling_${currentRegiment}`, JSON.stringify(dataToSave));
      }
    } else {
      localStorage.setItem(`grappling_${currentRegiment}`, JSON.stringify(dataToSave));
    }
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
    if (!newTeamName || newTeamName.trim() === '') {
      showToastNotification('Team name is required', 'error');
      return;
    }

    // Check for duplicate
    const duplicate = data.teams.find(t => t.name.toLowerCase() === newTeamName.trim().toLowerCase());
    if (duplicate) {
      showToastNotification('A team with this name already exists', 'error');
      return;
    }

    const newData = { ...data };
    newData.teams.push({ name: newTeamName.trim(), athleteIds: [] });
    saveData(newData);
    setNewTeamName('');
    setShowAddTeam(false);
    showToastNotification(`Team "${newTeamName.trim()}" created successfully!`, 'success');
  };

  const addWeightClass = () => {
    if (!newWeightClassName.trim()) return;
    const newData = { ...data };
    newData.weightClasses.push({ name: newWeightClassName, athleteIds: [] });
    saveData(newData);
    setNewWeightClassName('');
    setShowAddWeightClass(false);
  };

  const startEditWeightClass = (index, name) => {
    setEditingWeightClass(index);
    setEditWeightClassName(name);
  };

  const saveEditWeightClass = (index) => {
    if (!editWeightClassName.trim()) return;
    const newData = { ...data };
    newData.weightClasses[index].name = editWeightClassName;
    saveData(newData);
    setEditingWeightClass(null);
    setEditWeightClassName('');
  };

  const deleteWeightClass = (index) => {
    if (!window.confirm('Delete this weight class? Athletes will not be deleted, only removed from this class.')) return;
    const newData = { ...data };
    newData.weightClasses.splice(index, 1);
    saveData(newData);
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

  const startEditAthlete = (id, name, weight, isCoach) => {
    setEditingAthlete(id);
    setEditAthleteName(name);
    setEditAthleteWeight(weight.toString());
    setEditAthleteIsCoach(isCoach || false);
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
    athlete.isCoach = editAthleteIsCoach;

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
    setEditAthleteIsCoach(false);
  };

  const addAthlete = () => {
    // Data validation
    if (!newAthleteName || newAthleteName.trim() === '') {
      showToastNotification('Athlete name is required', 'error');
      return;
    }

    if (!newAthleteWeight || newAthleteWeight.trim() === '') {
      showToastNotification('Weight is required', 'error');
      return;
    }

    if (!newAthleteTeam) {
      showToastNotification('Please select a team', 'error');
      return;
    }

    const weight = parseInt(newAthleteWeight);
    if (isNaN(weight) || weight < 100 || weight > 400) {
      showToastNotification('Invalid weight (must be 100-400 lbs)', 'error');
      return;
    }

    // Check for duplicate name
    const duplicate = data.athletes.find(a => a.name.toLowerCase() === newAthleteName.trim().toLowerCase());
    if (duplicate) {
      showToastNotification('An athlete with this name already exists', 'error');
      return;
    }

    setLoading(true);

    const newData = { ...data };
    const athlete = {
      id: crypto.randomUUID(),
      name: newAthleteName.trim(),
      weight: weight,
      injured: false,
      isCoach: newAthleteIsCoach,
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
    setNewAthleteIsCoach(false);
    setShowAddAthlete(false);

    setLoading(false);
    showToastNotification(`Athlete "${athlete.name}" added successfully!`, 'success');
  };

  const autoGenerateData = () => {
    if (currentRole !== 'official' && currentRole !== 'admin') {
      showToastNotification('Only officials and admins can generate test data', 'error');
      return;
    }

    if (!window.confirm('This will replace ALL current data with test data. Are you sure?')) {
      return;
    }

    setLoading(true);

    const newData = { athletes: [], teams: [], weightClasses: [], tournaments: [] };
    WEIGHT_BRACKETS.forEach(b => newData.weightClasses.push({ name: b.name, athleteIds: [] }));
    let idx = 0;
    "ABCDEFGHI".split("").forEach(letter => {
      const athleteIds = [];

      // Create coach first
      const coachWeight = Math.floor((WEIGHT_BRACKETS[idx % WEIGHT_BRACKETS.length].min + WEIGHT_BRACKETS[idx % WEIGHT_BRACKETS.length].max) / 2);
      const coach = {
        id: crypto.randomUUID(),
        name: `${FIRST_NAMES[idx % FIRST_NAMES.length]} ${LAST_NAMES[Math.floor(idx / FIRST_NAMES.length) % LAST_NAMES.length]}`,
        weight: coachWeight,
        injured: false,
        isCoach: true,
        stats: { wins: { points: 0, submission: 0 }, losses: { points: 0, submission: 0 }, pointsFor: 0 }
      };
      newData.athletes.push(coach);
      athleteIds.push(coach.id);
      newData.weightClasses[idx % WEIGHT_BRACKETS.length].athleteIds.push(coach.id);
      idx++;

      // Create 15 regular players
      for (let i = 0; i < 15; i++) {
        const athlete = {
          id: crypto.randomUUID(),
          name: `${FIRST_NAMES[idx % FIRST_NAMES.length]} ${LAST_NAMES[Math.floor(idx / FIRST_NAMES.length) % LAST_NAMES.length]}`,
          weight: Math.floor((WEIGHT_BRACKETS[idx % WEIGHT_BRACKETS.length].min + WEIGHT_BRACKETS[idx % WEIGHT_BRACKETS.length].max) / 2),
          injured: false,
          isCoach: false,
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

    setLoading(false);
    showToastNotification('Test data generated successfully! 9 teams with 16 athletes each created.', 'success');
  };

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const makeMatches = (athleteIds, tournament = null) => {
    const shuffled = shuffle([...athleteIds]);

    // If odd number, we need a bye - assign to highest scorer in THIS tournament
    if (shuffled.length % 2 === 1) {
      if (tournament) {
        // Calculate points earned in THIS tournament for each athlete
        const tournamentPoints = {};
        shuffled.forEach(id => { tournamentPoints[id] = 0; });

        tournament.rounds.forEach(round => {
          round.forEach(match => {
            if (match.winner && match.winner !== "BYE") {
              const points = match.method === 'points' || match.method === 'noshow' ? 2 :
                match.method === 'submission' ? 4 : 0;
              if (tournamentPoints[match.winner] !== undefined) {
                tournamentPoints[match.winner] += points;
              }
            }
          });
        });

        // Find athlete with highest tournament points
        let highestScorer = shuffled[0];
        let highestScore = tournamentPoints[highestScorer] || 0;

        shuffled.forEach(id => {
          if ((tournamentPoints[id] || 0) > highestScore) {
            highestScore = tournamentPoints[id] || 0;
            highestScorer = id;
          }
        });

        // Move highest scorer to front, they get the bye
        const filtered = shuffled.filter(id => id !== highestScorer);
        filtered.unshift(highestScorer);
        shuffled.length = 0;
        shuffled.push(...filtered);
      }

      shuffled.push("BYE");
    }

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
    // Data validation
    if (currentRole !== 'official') {
      showToastNotification('Only officials can create tournaments', 'error');
      return;
    }

    if (!tournamentName || tournamentName.trim() === '') {
      showToastNotification('Tournament name is required', 'error');
      return;
    }

    if (!tournamentWeight) {
      showToastNotification('Please select a weight class', 'error');
      return;
    }

    if (!tournamentYear || !tournamentMonth || !tournamentDay) {
      showToastNotification('Please enter a complete date', 'error');
      return;
    }

    // Validate year
    const year = parseInt(tournamentYear);
    if (isNaN(year) || year < 2020 || year > 2100) {
      showToastNotification('Invalid year (must be 2020-2100)', 'error');
      return;
    }

    // Validate day
    const day = parseInt(tournamentDay);
    if (isNaN(day) || day < 1 || day > 31) {
      showToastNotification('Invalid day (must be 1-31)', 'error');
      return;
    }

    const weightClass = data.weightClasses.find(w => w.name === tournamentWeight);
    if (!weightClass) {
      showToastNotification('Weight class not found', 'error');
      return;
    }

    const availableAthletes = weightClass.athleteIds.filter(id => {
      const athlete = data.athletes.find(a => a.id === id);
      return athlete && !athlete.injured;
    });

    if (availableAthletes.length < 2) {
      showToastNotification(`Not enough athletes in ${tournamentWeight} (need at least 2, have ${availableAthletes.length})`, 'error');
      return;
    }

    setLoading(true);

    const newData = { ...data };
    newData.tournaments.push({
      id: generateUUID(), // Unique tournament ID for multi-user
      name: tournamentName.trim(),
      weight: tournamentWeight,
      date: { year: tournamentYear, month: tournamentMonth, day: tournamentDay },
      officials: tournamentOfficials.trim(),
      createdBy: officialName || 'Unknown Official', // Track who created it
      managedBy: officialName || 'Unknown Official', // Track who's managing it
      createdAt: getTimestamp(),
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

    setLoading(false);
    showToastNotification(`Tournament "${tournamentName.trim()}" created successfully!`, 'success');
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
        tournament.rounds.push(makeMatches(advancing, tournament));
      }
    }

    setShowRemoveAthleteMenu(null);
    saveData(newData);
  };

  const decideMatch = (ti, ri, mi, winnerId, method, positionScore = 0, notes = '') => {
    if (currentRole !== 'official') return;
    const snapshot = JSON.parse(JSON.stringify(data));
    const newData = JSON.parse(JSON.stringify(data));
    const tournament = newData.tournaments[ti];
    const match = tournament.rounds[ri][mi];
    if (match.winner) return;

    // Save previous stats for undo
    const winner = winnerId === "BYE" ? null : newData.athletes.find(a => a.id === winnerId);
    const loserId = match.athleteA === winnerId ? match.athleteB : match.athleteA;
    const loser = loserId === "BYE" ? null : newData.athletes.find(a => a.id === loserId);

    const previousStats = {
      winner: winner ? JSON.parse(JSON.stringify(winner.stats)) : null,
      loser: loser ? JSON.parse(JSON.stringify(loser.stats)) : null
    };

    match.winner = winnerId;
    match.method = method;
    match.positionPoints = positionScore;
    match.notes = notes;

    if (winner && loser) {
      winner.stats.wins[method]++;
      loser.stats.losses[method]++;
      if (method === "points" || method === "noshow") {
        winner.stats.pointsFor += (2 + positionScore);
      }
      if (method === "submission") winner.stats.pointsFor += 4;
    }

    if (tournament.rounds[ri].every(m => m.winner)) {
      const advancing = tournament.rounds[ri].map(m => m.winner);
      if (advancing.length === 1) {
        tournament.done = true;
        tournament.champ = advancing[0];
      } else {
        tournament.rounds.push(makeMatches(advancing, tournament));
      }
    }

    setLastAction({ type: 'match', snapshot, tournamentIndex: ti, roundIndex: ri, matchIndex: mi });

    // Add to undo stack
    addToUndoStack({
      type: 'matchResult',
      tournamentIndex: ti,
      roundIndex: ri,
      matchIndex: mi,
      winnerId: winnerId,
      loserId: loserId,
      previousStats: previousStats
    });

    setShowNoShowMenu(null);
    setShowPositionScoring(null);
    setShowMatchNotes(null);
    setPositionPoints({ sideMount: 0, topMount: 0, backMount: 0 });
    setMatchNotes('');
    saveData(newData);

    // Show confirmation
    const winnerName = winner ? winner.name : 'BYE';
    showToastNotification(`Match result saved: ${winnerName} wins by ${method}`, 'success');
  };

  const printTeamRoster = (teamName) => {
    const team = data.teams.find(t => t.name === teamName);
    if (!team) return;

    const athletes = team.athleteIds.map(id => data.athletes.find(a => a.id === id)).filter(Boolean);
    athletes.sort((a, b) => a.weight - b.weight);

    const printWindow = window.open('', '_blank');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${teamName} - Team Roster</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { text-align: center; margin-bottom: 10px; }
          .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 10px; text-align: left; }
          th { background: #f0f0f0; font-weight: bold; }
          .coach { background: #fff3cd; font-weight: bold; }
          .stats { font-size: 12px; color: #666; }
          .injured { color: #dc3545; font-weight: bold; }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>${teamName} - Team Roster</h1>
        <div class="subtitle">${regimentName} • ${seasonName}</div>
        <div class="subtitle">Total Athletes: ${athletes.length} (${athletes.filter(a => a.isCoach).length} coach${athletes.filter(a => a.isCoach).length !== 1 ? 'es' : ''})</div>
        
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Weight (lbs)</th>
              <th>Role</th>
              <th>Record</th>
              <th>Points</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${athletes.map((athlete, idx) => `
              <tr class="${athlete.isCoach ? 'coach' : ''}">
                <td>${idx + 1}</td>
                <td>${athlete.name}</td>
                <td>${athlete.weight}</td>
                <td>${athlete.isCoach ? 'COACH' : 'Player'}</td>
                <td class="stats">${athlete.stats.wins.points + athlete.stats.wins.submission}-${athlete.stats.losses.points + athlete.stats.losses.submission}</td>
                <td class="stats">${athlete.stats.pointsFor}</td>
                <td>${athlete.injured ? '<span class="injured">INJURED</span>' : 'Active'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 40px; font-size: 12px; color: #666;">
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>West Point Combatives v${APP_VERSION}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  // Get lifetime stats for an athlete across all seasons
  const getLifetimeStats = (athleteName) => {
    const lifetimeStats = {
      wins: { points: 0, submission: 0 },
      losses: { points: 0, submission: 0 },
      pointsFor: 0,
      seasonsActive: []
    };

    // Check active season
    const activeKey = `grappling_${currentRegiment}`;
    const activeData = localStorage.getItem(activeKey);
    if (activeData) {
      const parsed = JSON.parse(activeData);
      const athlete = parsed.athletes?.find(a => a.name === athleteName);
      if (athlete) {
        lifetimeStats.wins.points += athlete.stats?.wins?.points || 0;
        lifetimeStats.wins.submission += athlete.stats?.wins?.submission || 0;
        lifetimeStats.losses.points += athlete.stats?.losses?.points || 0;
        lifetimeStats.losses.submission += athlete.stats?.losses?.submission || 0;
        lifetimeStats.pointsFor += athlete.stats?.pointsFor || 0;
        lifetimeStats.seasonsActive.push(parsed.seasonName || 'Active Season');
      }
    }

    // Check archived seasons
    const archivedListKey = `grappling_${currentRegiment}_archived_list`;
    const archivedList = localStorage.getItem(archivedListKey);
    if (archivedList) {
      const seasons = JSON.parse(archivedList);
      seasons.forEach(season => {
        const seasonKey = `grappling_${currentRegiment}_archived_${season.key}`;
        const seasonData = localStorage.getItem(seasonKey);
        if (seasonData) {
          const parsed = JSON.parse(seasonData);
          const athlete = parsed.athletes?.find(a => a.name === athleteName);
          if (athlete) {
            lifetimeStats.wins.points += athlete.stats?.wins?.points || 0;
            lifetimeStats.wins.submission += athlete.stats?.wins?.submission || 0;
            lifetimeStats.losses.points += athlete.stats?.losses?.points || 0;
            lifetimeStats.losses.submission += athlete.stats?.losses?.submission || 0;
            lifetimeStats.pointsFor += athlete.stats?.pointsFor || 0;
            lifetimeStats.seasonsActive.push(season.name);
          }
        }
      });
    }

    return lifetimeStats;
  };

  const printSeasonSummary = () => {
    const printWindow = window.open('', '_blank');

    const topAthletes = [...data.athletes]
      .sort((a, b) => b.stats.pointsFor - a.stats.pointsFor)
      .slice(0, 10);

    const teamStandings = data.teams.map(team => {
      const athleteIds = team.athleteIds || [];
      const totalPoints = athleteIds.reduce((sum, id) => {
        const athlete = data.athletes.find(a => a.id === id);
        return sum + (athlete?.stats?.pointsFor || 0);
      }, 0);
      return { name: team.name, points: totalPoints, athleteCount: athleteIds.length };
    }).sort((a, b) => b.points - a.points);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Season Summary - ${seasonName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { text-align: center; margin-bottom: 10px; }
          .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
          .section { margin-top: 30px; page-break-inside: avoid; }
          h2 { border-bottom: 2px solid #000; padding-bottom: 5px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
          .stat-box { border: 2px solid #000; padding: 15px; text-align: center; }
          .stat-number { font-size: 36px; font-weight: bold; color: #007bff; }
          .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background: #f0f0f0; font-weight: bold; }
          .rank-1 { background: #ffd700; }
          .rank-2 { background: #c0c0c0; }
          .rank-3 { background: #cd7f32; }
          @media print {
            body { padding: 20px; }
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
          }
        </style>
      </head>
      <body>
        <h1>Season Summary Report</h1>
        <div class="subtitle">${regimentName} • ${seasonName}</div>
        
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-number">${data.teams.length}</div>
            <div class="stat-label">Teams</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${data.athletes.length}</div>
            <div class="stat-label">Athletes</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${data.tournaments.filter(t => t.done).length}</div>
            <div class="stat-label">Completed Tournaments</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${data.tournaments.filter(t => !t.done).length}</div>
            <div class="stat-label">Active Tournaments</div>
          </div>
        </div>
        
        <div class="section">
          <h2>Team Standings</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Athletes</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              ${teamStandings.map((team, idx) => `
                <tr class="${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : ''}">
                  <td>${idx + 1}</td>
                  <td>${team.name}</td>
                  <td>${team.athleteCount}</td>
                  <td>${team.points}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Top 10 Athletes</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Team</th>
                <th>Record</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              ${topAthletes.map((athlete, idx) => {
      const team = data.teams.find(t => t.athleteIds.includes(athlete.id));
      return `
                  <tr class="${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : ''}">
                    <td>${idx + 1}</td>
                    <td>${athlete.name}${athlete.isCoach ? ' (Coach)' : ''}</td>
                    <td>${team?.name || 'N/A'}</td>
                    <td>${athlete.stats.wins.points + athlete.stats.wins.submission}-${athlete.stats.losses.points + athlete.stats.losses.submission}</td>
                    <td>${athlete.stats.pointsFor}</td>
                  </tr>
                `;
    }).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Tournament Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Tournament</th>
                <th>Weight Class</th>
                <th>Date</th>
                <th>Champion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.tournaments.map(t => {
      const champ = data.athletes.find(a => a.id === t.champ);
      return `
                  <tr>
                    <td>${t.name}</td>
                    <td>${t.weight}</td>
                    <td>${t.date.month} ${t.date.day}, ${t.date.year}</td>
                    <td>${champ ? champ.name : t.done ? 'TBD' : '-'}</td>
                    <td>${t.done ? 'Complete' : 'In Progress'}</td>
                  </tr>
                `;
    }).join('')}
            </tbody>
          </table>
        </div>
        
        <div style="margin-top: 40px; font-size: 12px; color: #666; page-break-before: avoid;">
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>West Point Combatives v${APP_VERSION} • Created by CDT Natas Coats '27 A3</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const printBracket = (tournamentIndex) => {
    const tournament = data.tournaments[tournamentIndex];
    const printWindow = window.open('', '_blank');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${tournament.name} - Bracket</title>
        <style>
          @media print {
            @page { margin: 0.5in; }
            body { margin: 0; }
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: white;
            color: black;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 32px;
          }
          .header .info {
            font-size: 14px;
            color: #666;
          }
          .rounds-container {
            display: flex;
            gap: 40px;
            justify-content: center;
            overflow-x: auto;
          }
          .round {
            min-width: 220px;
          }
          .round-title {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
            padding: 8px;
            background: #f0f0f0;
            border: 2px solid #000;
          }
          .match {
            border: 2px solid #000;
            margin-bottom: 20px;
            padding: 10px;
            background: white;
            page-break-inside: avoid;
          }
          .athlete {
            padding: 8px;
            border-bottom: 1px solid #ccc;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
          }
          .athlete:last-child {
            border-bottom: none;
          }
          .athlete.winner {
            font-weight: bold;
            background: #f0f0f0;
          }
          .match-result {
            margin-top: 8px;
            padding: 6px;
            background: #f9f9f9;
            font-size: 12px;
            border-top: 1px solid #ddd;
          }
          .winner-badge {
            background: #28a745;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 2px solid #000;
            padding-top: 15px;
          }
          .champion-box {
            margin-top: 30px;
            padding: 20px;
            border: 3px solid #ffd700;
            background: #fffef0;
            text-align: center;
          }
          .champion-box h2 {
            margin: 0 0 10px 0;
            color: #ffd700;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
          }
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          @media print {
            .print-btn { display: none; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">🖨️ Print Bracket</button>
        
        <div class="header">
          <h1>${tournament.name}</h1>
          <div class="info">
            <strong>Weight Class:</strong> ${tournament.weight} | 
            <strong>Date:</strong> ${tournament.date.month} ${tournament.date.day}, ${tournament.date.year}
            ${tournament.officials ? ` | <strong>Officials:</strong> ${tournament.officials}` : ''}
          </div>
        </div>
        
        <div class="rounds-container">
          ${tournament.rounds.map((round, ri) => `
            <div class="round">
              <div class="round-title">Round ${ri + 1}</div>
              ${round.map((match, mi) => {
      const athleteA = match.athleteA === "BYE" ? { name: "BYE" } : data.athletes.find(a => a.id === match.athleteA);
      const athleteB = match.athleteB === "BYE" ? { name: "BYE" } : data.athletes.find(a => a.id === match.athleteB);
      const winner = match.winner ? data.athletes.find(a => a.id === match.winner) : null;

      return `
                  <div class="match">
                    <div class="athlete ${match.winner === match.athleteA ? 'winner' : ''}">
                      <span>${athleteA?.name || 'Unknown'}</span>
                      ${match.winner === match.athleteA ? '<span class="winner-badge">WIN</span>' : ''}
                    </div>
                    <div class="athlete ${match.winner === match.athleteB ? 'winner' : ''}">
                      <span>${athleteB?.name || 'Unknown'}</span>
                      ${match.winner === match.athleteB ? '<span class="winner-badge">WIN</span>' : ''}
                    </div>
                    ${match.winner ? `
                      <div class="match-result">
                        <strong>Result:</strong> ${match.method === 'noshow' ? 'No Show' : match.method === 'walkover' ? 'Walkover' : match.method === 'submission' ? 'Submission' : 'Points'}
                        ${match.positionPoints > 0 ? ` (+${match.positionPoints} position pts)` : ''}
                        ${match.notes ? `<br><em>Notes: ${match.notes}</em>` : ''}
                      </div>
                    ` : ''}
                  </div>
                `;
    }).join('')}
            </div>
          `).join('')}
        </div>
        
        ${tournament.done && tournament.champ ? `
          <div class="champion-box">
            <h2>🏆 CHAMPION 🏆</h2>
            <div style="font-size: 24px; font-weight: bold; margin-top: 10px;">
              ${data.athletes.find(a => a.id === tournament.champ)?.name || 'Unknown'}
            </div>
          </div>
        ` : ''}
        
        <div class="footer">
          <strong>${regimentName}</strong> - West Point Combatives<br>
          Printed: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Athletes Sheet
    const athleteData = data.athletes.map(a => {
      const team = data.teams.find(t => t.athleteIds.includes(a.id));
      const totalWins = a.stats.wins.points + a.stats.wins.submission;
      const totalLosses = a.stats.losses.points + a.stats.losses.submission;
      return {
        Name: a.name,
        Team: team?.name || 'N/A',
        Weight: a.weight,
        Role: a.isCoach ? 'Coach' : 'Player',
        'Wins (Points)': a.stats.wins.points,
        'Wins (Submission)': a.stats.wins.submission,
        'Total Wins': totalWins,
        'Losses (Points)': a.stats.losses.points,
        'Losses (Submission)': a.stats.losses.submission,
        'Total Losses': totalLosses,
        'Win Rate': totalWins + totalLosses > 0 ? `${Math.round((totalWins / (totalWins + totalLosses)) * 100)}%` : '0%',
        'Total Points': a.stats.pointsFor,
        Injured: a.injured ? 'Yes' : 'No'
      };
    });
    const wsAthletes = XLSX.utils.json_to_sheet(athleteData);

    // Set column widths
    wsAthletes['!cols'] = [
      { wch: 20 }, // Name
      { wch: 15 }, // Team
      { wch: 10 }, // Weight
      { wch: 10 }, // Role
      { wch: 15 }, // Wins (Points)
      { wch: 18 }, // Wins (Submission)
      { wch: 12 }, // Total Wins
      { wch: 16 }, // Losses (Points)
      { wch: 20 }, // Losses (Submission)
      { wch: 14 }, // Total Losses
      { wch: 10 }, // Win Rate
      { wch: 12 }, // Total Points
      { wch: 10 }  // Injured
    ];
    XLSX.utils.book_append_sheet(wb, wsAthletes, "Athletes");

    // Teams Sheet
    const teamData = data.teams.map(t => {
      const points = t.athleteIds.reduce((sum, id) => {
        const athlete = data.athletes.find(a => a.id === id);
        return sum + (athlete?.stats.pointsFor || 0);
      }, 0);
      const coaches = t.athleteIds.filter(id => {
        const athlete = data.athletes.find(a => a.id === id);
        return athlete?.isCoach;
      }).length;
      const injured = t.athleteIds.filter(id => {
        const athlete = data.athletes.find(a => a.id === id);
        return athlete?.injured;
      }).length;
      return {
        'Team Name': t.name,
        'Total Athletes': t.athleteIds.length,
        'Coaches': coaches,
        'Players': t.athleteIds.length - coaches,
        'Injured': injured,
        'Total Points': points,
        'Avg Points per Athlete': t.athleteIds.length > 0 ? Math.round(points / t.athleteIds.length) : 0
      };
    });
    const wsTeams = XLSX.utils.json_to_sheet(teamData);
    wsTeams['!cols'] = [
      { wch: 20 }, // Team Name
      { wch: 15 }, // Total Athletes
      { wch: 10 }, // Coaches
      { wch: 10 }, // Players
      { wch: 10 }, // Injured
      { wch: 12 }, // Total Points
      { wch: 20 }  // Avg Points
    ];
    XLSX.utils.book_append_sheet(wb, wsTeams, "Teams");

    // Weight Classes Sheet
    const weightData = data.weightClasses.map(wc => ({
      'Weight Class': wc.name,
      'Total Athletes': wc.athleteIds.length,
      'Available (Not Injured)': wc.athleteIds.filter(id => {
        const athlete = data.athletes.find(a => a.id === id);
        return athlete && !athlete.injured;
      }).length
    }));
    const wsWeights = XLSX.utils.json_to_sheet(weightData);
    wsWeights['!cols'] = [
      { wch: 20 }, // Weight Class
      { wch: 15 }, // Total Athletes
      { wch: 20 }  // Available
    ];
    XLSX.utils.book_append_sheet(wb, wsWeights, "Weight Classes");

    // Tournaments Sheet
    const tournamentData = data.tournaments.map(t => ({
      'Tournament Name': t.name,
      'Weight Class': t.weight,
      'Date': `${t.date.month} ${t.date.day}, ${t.date.year}`,
      'Officials': t.officials || 'N/A',
      'Status': t.done ? 'Completed' : 'Active',
      'Champion': t.champ ? data.athletes.find(a => a.id === t.champ)?.name || 'Unknown' : 'TBD',
      'Total Rounds': t.rounds.length
    }));
    const wsTournaments = XLSX.utils.json_to_sheet(tournamentData);
    wsTournaments['!cols'] = [
      { wch: 25 }, // Tournament Name
      { wch: 15 }, // Weight Class
      { wch: 20 }, // Date
      { wch: 20 }, // Officials
      { wch: 12 }, // Status
      { wch: 20 }, // Champion
      { wch: 12 }  // Total Rounds
    ];
    XLSX.utils.book_append_sheet(wb, wsTournaments, "Tournaments");

    // Summary/Overview Sheet
    const summaryData = [
      { 'Category': 'Total Teams', 'Count': data.teams.length },
      { 'Category': 'Total Athletes', 'Count': data.athletes.length },
      { 'Category': 'Total Coaches', 'Count': data.athletes.filter(a => a.isCoach).length },
      { 'Category': 'Total Players', 'Count': data.athletes.filter(a => !a.isCoach).length },
      { 'Category': 'Injured Athletes', 'Count': data.athletes.filter(a => a.injured).length },
      { 'Category': 'Active Tournaments', 'Count': data.tournaments.filter(t => !t.done).length },
      { 'Category': 'Completed Tournaments', 'Count': data.tournaments.filter(t => t.done).length },
      { 'Category': 'Weight Classes', 'Count': data.weightClasses.length }
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 25 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    XLSX.writeFile(wb, `Regiment_${currentRegiment}_Complete_Export.xlsx`);
  };

  const exportImportTemplate = () => {
    const wb = XLSX.utils.book_new();

    // Simple template with only essential fields for import
    const templateData = [
      {
        Name: 'John Doe',
        Team: 'Alpha Company',
        Weight: 175,
        Role: 'Player'
      },
      {
        Name: 'Jane Smith',
        Team: 'Alpha Company',
        Weight: 165,
        Role: 'Coach'
      },
      {
        Name: 'Mike Johnson',
        Team: 'Bravo Company',
        Weight: 180,
        Role: 'Player'
      },
      {
        Name: '',
        Team: '',
        Weight: '',
        Role: 'Player'
      },
      {
        Name: '',
        Team: '',
        Weight: '',
        Role: 'Player'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    ws['!cols'] = [
      { wch: 25 }, // Name
      { wch: 20 }, // Team
      { wch: 10 }, // Weight
      { wch: 10 }  // Role
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Athletes");

    // Add simple instructions sheet
    const instructions = [
      { '': 'QUICK START GUIDE', '__EMPTY': '' },
      { '': '', '__EMPTY': '' },
      { '': 'Fill in the Athletes sheet with your roster:', '__EMPTY': '' },
      { '': '', '__EMPTY': '' },
      { 'Column': 'Name', 'Required': 'YES', 'Description': 'Full name of the athlete', 'Example': 'John Doe' },
      { 'Column': 'Team', 'Required': 'YES', 'Description': 'Team name (will be created automatically)', 'Example': 'Alpha Company' },
      { 'Column': 'Weight', 'Required': 'YES', 'Description': 'Weight in pounds (must be 150-210)', 'Example': '175' },
      { 'Column': 'Role', 'Required': 'NO', 'Description': 'Either "Player" or "Coach" (defaults to Player)', 'Example': 'Player' },
      { '': '', '__EMPTY': '' },
      { '': 'NOTES:', '__EMPTY': '' },
      { '': '• All stats (wins, losses, points) start at 0', '__EMPTY': '' },
      { '': '• All athletes start as not injured', '__EMPTY': '' },
      { '': '• You can edit everything in the app after import', '__EMPTY': '' },
      { '': '• Teams are automatically created if they don\'t exist', '__EMPTY': '' },
      { '': '• Athletes are automatically assigned to weight classes', '__EMPTY': '' },
      { '': '', '__EMPTY': '' },
      { '': 'AFTER IMPORT:', '__EMPTY': '' },
      { '': '• Use the Teams tab to manage injuries', '__EMPTY': '' },
      { '': '• Use the Athletes tab to edit names and weights', '__EMPTY': '' },
      { '': '• Stats are tracked automatically through tournaments', '__EMPTY': '' },
      { '': '• Export anytime to get full detailed stats', '__EMPTY': '' },
      { '': '', '__EMPTY': '' },
      { '': 'TIPS:', '__EMPTY': '' },
      { '': '• You can import the same file multiple times', '__EMPTY': '' },
      { '': '• Duplicate names will create separate athletes', '__EMPTY': '' },
      { '': '• Weight must be within 150-210 lbs range', '__EMPTY': '' },
      { '': '• Leave Role blank to default to "Player"', '__EMPTY': '' }
    ];

    const wsInstructions = XLSX.utils.json_to_sheet(instructions, { skipHeader: true });
    wsInstructions['!cols'] = [
      { wch: 12 },
      { wch: 12 },
      { wch: 50 },
      { wch: 20 }
    ];

    XLSX.utils.book_append_sheet(wb, wsInstructions, "Instructions");

    XLSX.writeFile(wb, `Simple_Import_Template_Regiment_${currentRegiment}.xlsx`);
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
          isCoach: row.Role === 'Coach',
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

  const isOfficial = currentRole === 'official' && !viewingArchivedSeason;
  const isCoach = currentRole === 'coach' && !viewingArchivedSeason;

  // Get design tokens based on dark mode
  const theme = getDesignTokens(darkMode);
  const { colors, shadows, typography, borderRadius: radius, spacing } = theme;

  // Legacy variable mapping for compatibility (MUST be before style helpers that use them)
  const bgColor = colors.bg;
  const cardBg = colors.bgCard;
  const textColor = colors.text;
  const headerBg = colors.bgHeader;
  const navBg = darkMode ? '#1e293b' : '#e2e8f0';
  const borderColor = colors.border;

  // Reusable style helpers
  const getButtonStyle = (variant = 'primary', size = 'md') => {
    const base = {
      border: 'none',
      borderRadius: radius.sm,  // Sharper corners
      cursor: 'pointer',
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      transition: 'all 0.15s',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: shadows.sm,
      textTransform: 'uppercase',  // All caps for military look
      letterSpacing: typography.letterSpacing.wide,
      fontSize: typography.fontSize.xs  // Slightly smaller, bolder
    };

    const sizes = {
      sm: { padding: '6px 12px' },
      md: { padding: '8px 16px' },
      lg: { padding: '10px 20px' }
    };

    const variants = {
      primary: { background: colors.primary, color: colors.textInverse },
      success: { background: colors.success, color: colors.textInverse },
      danger: { background: colors.danger, color: colors.textInverse },
      warning: { background: colors.warning, color: colors.textInverse },
      secondary: { background: colors.neutral, color: colors.textInverse },
      outline: { background: 'transparent', color: textColor, border: `1px solid ${borderColor}`, boxShadow: 'none' }
    };

    return { ...base, ...sizes[size], ...variants[variant] };
  };

  const inputStyles = {
    base: {
      padding: '10px 12px',
      borderRadius: radius.md,
      border: `1px solid ${borderColor}`,
      background: colors.bgInput,
      color: textColor,
      fontSize: typography.fontSize.sm,
      transition: 'border-color 0.2s',
      fontFamily: typography.fontFamily,
      width: '100%'
    }
  };

  const cardStyles = {
    base: {
      background: cardBg,
      borderRadius: radius.md,  // Sharper
      padding: '20px',
      boxShadow: shadows.md,
      border: `1px solid ${borderColor}`
    },
    compact: {
      background: cardBg,
      borderRadius: radius.md,  // Sharper
      padding: '15px',
      boxShadow: shadows.sm,
      border: `1px solid ${borderColor}`
    }
  };

  const badgeStyles = (type = 'default') => {
    const base = {
      padding: '4px 10px',
      borderRadius: radius.sm,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      textTransform: 'uppercase',
      letterSpacing: typography.letterSpacing.wide,
      border: '1px solid transparent'
    };

    const types = {
      default: { background: colors.neutral + '30', color: colors.neutral, borderColor: colors.neutral },
      success: { background: colors.success + '20', color: colors.success, borderColor: colors.success },
      danger: { background: colors.danger + '20', color: colors.danger, borderColor: colors.danger },
      warning: { background: colors.warning + '20', color: colors.warning, borderColor: colors.warning },
      info: { background: colors.primary + '20', color: colors.primary, borderColor: colors.primary },
      gold: { background: '#b8860b30', color: '#b8860b', borderColor: '#b8860b' },
      silver: { background: colors.silver + '30', color: colors.silver, borderColor: colors.silver },
      bronze: { background: colors.bronze + '30', color: colors.bronze, borderColor: colors.bronze }
    };

    return { ...base, ...types[type] };
  };

  // Get tournament status badge
  const getTournamentStatus = (tournament) => {
    if (tournament.done) return { text: 'COMPLETE', type: 'success', icon: '✓' };
    if (tournament.rounds[0].some(m => m.winner)) return { text: 'IN PROGRESS', type: 'warning', icon: '⚔️' };
    return { text: 'NOT STARTED', type: 'default', icon: '○' };
  };

  // Heading styles for consistency
  const headingStyles = {
    h3: {
      textTransform: 'uppercase',
      letterSpacing: typography.letterSpacing.wide,
      fontWeight: typography.fontWeight.extrabold,
      fontSize: typography.fontSize.xl
    },
    h4: {
      textTransform: 'uppercase',
      letterSpacing: typography.letterSpacing.wide,
      fontWeight: typography.fontWeight.bold,
      fontSize: typography.fontSize.lg
    }
  };

  return (
    <div style={{ fontFamily: typography.fontFamily, minHeight: '100vh', background: bgColor, width: '100%', margin: 0, color: textColor }}>
      <header style={{ background: headerBg, color: colors.textInverse, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: shadows.md, borderBottom: '2px solid #b8860b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src="data:image/png;base64,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"
            alt="West Point Crest"
            style={{ height: '45px', width: 'auto' }}
          />
          <h2 style={{ margin: 0, fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.extrabold, letterSpacing: typography.letterSpacing.wide, textTransform: 'uppercase' }}>
            WEST POINT COMBATIVES
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {window.firebase && (
            <div style={{
              padding: '6px 12px',
              background: firebaseConnected ? '#10b981' : '#ef4444',
              color: 'white',
              borderRadius: radius.sm,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.bold,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: shadows.sm
            }}>
              <span style={{ fontSize: '10px' }}>{firebaseConnected ? '🟢' : '🔴'}</span>
              {firebaseConnected ? 'CONNECTED' : 'OFFLINE'}
            </div>
          )}
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', border: `1px solid rgba(255,255,255,0.2)`, borderRadius: radius.md, cursor: 'pointer', color: colors.textInverse, display: 'flex', alignItems: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <select value={currentRegiment} onChange={(e) => { setCurrentRegiment(e.target.value); setCurrentSeason('active'); }} style={{ padding: '8px 12px', background: colors.bgCard, color: textColor, border: `1px solid ${borderColor}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, cursor: 'pointer' }}>
            {[1, 2, 3, 4].map(n => <option key={n} value={n}>Regiment {n}</option>)}
          </select>
          <select
            value={currentSeason}
            onChange={(e) => setCurrentSeason(e.target.value)}
            style={{ padding: '8px 12px', background: currentSeason === 'active' ? colors.bgCard : colors.warningHover, color: textColor, border: `1px solid ${borderColor}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, cursor: 'pointer' }}
          >
            <option value="active">{seasonName || 'Current Season'} ✓</option>
            {archivedSeasons.map(season => (
              <option key={season.key} value={season.key}>
                {season.name} (Archived)
              </option>
            ))}
          </select>
          {currentRole === 'admin' && (
            <button onClick={() => setShowSeasonManager(true)} style={{ padding: '8px 16px', background: colors.warning, color: colors.textInverse, border: 'none', borderRadius: radius.md, cursor: 'pointer', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, boxShadow: shadows.sm, transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = colors.warningHover} onMouseOut={(e) => e.currentTarget.style.background = colors.warning}>
              Seasons
            </button>
          )}
          {currentRole !== 'viewer' && (
            <button onClick={logout} style={{ padding: '8px 16px', background: colors.danger, color: colors.textInverse, border: 'none', borderRadius: radius.md, cursor: 'pointer', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, boxShadow: shadows.sm, transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = colors.dangerHover} onMouseOut={(e) => e.currentTarget.style.background = colors.danger} title="Logout">
              🚪 Logout
            </button>
          )}
          <select
            value={currentRole}
            onChange={(e) => {
              const newRole = e.target.value;
              setShowRoleBanner(true); // Show banner when role changes
              if (newRole === 'coach' && coachPassword) {
                setShowCoachTeamSelector(true);
                setPasswordInput('');
                setPasswordError('');
              } else if (newRole === 'official' && officialPassword) {
                setShowOfficialNamePrompt(true);
                setPasswordInput('');
                setPasswordError('');
              } else if (newRole === 'admin' && adminPassword) {
                setShowPasswordPrompt('admin');
                setPasswordInput('');
                setPasswordError('');
              } else {
                setCurrentRole(newRole);
              }
            }}
            style={{ padding: '8px 12px', background: colors.bgCard, color: textColor, border: `1px solid ${borderColor}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, cursor: 'pointer' }}
          >
            <option value="viewer">Viewer</option>
            <option value="coach">Coach {coachPassword && '🔒'}</option>
            <option value="official">Official {officialPassword && '🔒'}</option>
            <option value="admin">Admin {adminPassword && '🔒'}</option>
          </select>
        </div>
      </header>

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: toastType === 'success' ? colors.success : toastType === 'error' ? colors.danger : colors.primary,
          color: colors.textInverse,
          padding: '12px 20px',
          borderRadius: radius.md,
          boxShadow: shadows.lg,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold
        }}>
          <span>{toastType === 'success' ? '✓' : toastType === 'error' ? '✕' : 'ℹ'}</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Undo Button (floating) */}
      {isOfficial && undoStack.length > 0 && (
        <button
          onClick={undoLastAction}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: colors.warning,
            color: colors.textInverse,
            padding: '12px 20px',
            borderRadius: radius.full,
            border: 'none',
            boxShadow: shadows.lg,
            cursor: 'pointer',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.bold,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Undo last match result (within 5 min)"
        >
          ↶ Undo Last Action
        </button>
      )}

      {viewingArchivedSeason && (
        <div style={{ background: '#fffacd', border: '2px solid #ffc107', padding: '12px 20px', textAlign: 'center', fontWeight: 'bold', color: '#856404' }}>
          📚 Viewing Archived Season: {archivedSeasons.find(s => s.key === currentSeason)?.name} - READ ONLY
          <button onClick={() => setCurrentSeason('active')} style={{ marginLeft: '15px', padding: '4px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
            Return to Current Season
          </button>
        </div>
      )}

      {showRoleBanner && currentRole !== 'viewer' && (
        <div style={{ background: currentRole === 'coach' ? '#e7f3ff' : currentRole === 'official' ? '#d4edda' : '#fff3cd', border: `2px solid ${currentRole === 'coach' ? '#007bff' : currentRole === 'official' ? '#28a745' : '#ffc107'}`, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', color: currentRole === 'coach' ? '#004085' : currentRole === 'official' ? '#155724' : '#856404' }}>
          <span>
            {currentRole === 'coach' && `👔 Logged in as Coach - Managing: ${coachTeam}`}
            {currentRole === 'official' && `⚙️ Logged in as Official${officialName ? ` - ${officialName}` : ''}`}
            {currentRole === 'admin' && `🔑 Logged in as Admin - Full Control`}
          </span>
          <button onClick={() => setShowRoleBanner(false)} style={{ padding: '4px 12px', background: 'rgba(0,0,0,0.1)', color: 'inherit', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
            Dismiss
          </button>
        </div>
      )}

      <nav style={{ background: navBg, padding: '12px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: `1px solid ${borderColor}` }}>
        {['dashboard', 'teams', 'athletes', 'weightclasses', 'analytics', 'tournaments', 'completed', ...(currentRole === 'admin' ? ['admin'] : [])].map(tab => (
          <button key={tab} onClick={() => setCurrentTab(tab)} style={{ padding: '8px 16px', borderRadius: radius.sm, border: 'none', cursor: 'pointer', background: currentTab === tab ? colors.primary : 'transparent', color: currentTab === tab ? colors.textInverse : textColor, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, transition: 'all 0.15s', boxShadow: currentTab === tab ? shadows.md : 'none', textTransform: 'uppercase', letterSpacing: typography.letterSpacing.wide, borderBottom: currentTab === tab ? `3px solid ${colors.primary}` : '3px solid transparent' }} onMouseOver={(e) => { if (currentTab !== tab) e.currentTarget.style.background = colors.bgHover }} onMouseOut={(e) => { if (currentTab !== tab) e.currentTarget.style.background = 'transparent' }}>
            {tab === 'weightclasses' ? 'Weight Classes' : tab === 'completed' ? 'Completed Tournaments' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <div style={{ padding: '20px' }}>
        {currentTab === 'dashboard' && (
          <div>
            <h3>Dashboard</h3>

            {/* Three Column Layout: Announcements | Slideshow | Top Performers */}
            <div style={{ display: 'grid', gridTemplateColumns: dashboardImages.length > 0 ? '300px 1fr 300px' : '1fr', gap: '20px', marginBottom: '20px', alignItems: 'start' }}>

              {/* Left Column - Announcements */}
              {dashboardImages.length > 0 && (
                <div style={{ background: '#fff3cd', border: '2px solid #ffc107', borderRadius: '10px', padding: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', height: '450px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: '#856404', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                      📢 Announcements
                    </h4>
                    {isOfficial && !editingAnnouncements && (
                      <button onClick={() => setEditingAnnouncements(true)} style={{ padding: '4px 10px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                        Edit
                      </button>
                    )}
                  </div>
                  {editingAnnouncements ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <textarea
                        value={announcements}
                        onChange={(e) => setAnnouncements(e.target.value)}
                        placeholder="Enter announcements..."
                        style={{ flex: 1, width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ffc107', fontSize: '13px', fontFamily: 'inherit', resize: 'none' }}
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button onClick={() => { saveAnnouncements(announcements); setEditingAnnouncements(false); }} style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                          Save
                        </button>
                        <button onClick={() => { setAnnouncements(data.announcements || ''); setEditingAnnouncements(false); }} style={{ padding: '6px 12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#856404', fontSize: '13px', whiteSpace: 'pre-wrap', flex: 1, overflow: 'auto' }}>
                      {announcements || 'No announcements at this time.'}
                    </div>
                  )}
                </div>
              )}

              {/* Center Column - Dashboard Slideshow */}
              {dashboardImages.length > 0 && (
                <div style={{ background: cardBg, borderRadius: '10px', padding: '0', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative', height: '450px' }}>
                  <img
                    src={dashboardImages[currentSlide % dashboardImages.length].url}
                    alt={dashboardImages[currentSlide % dashboardImages.length].caption}
                    style={{ width: '100%', height: '450px', objectFit: 'contain', background: darkMode ? '#1a1a1a' : '#f0f0f0', padding: '20px' }}
                  />
                  {dashboardImages[currentSlide % dashboardImages.length].caption && (
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))', color: 'white', padding: '30px 20px 15px 20px', fontSize: '18px', fontWeight: 'bold', borderRadius: '8px', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                      {dashboardImages[currentSlide % dashboardImages.length].caption}
                    </div>
                  )}
                  {dashboardImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentSlide((currentSlide - 1 + dashboardImages.length) % dashboardImages.length)}
                        style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.8)'}
                        onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.6)'}
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setCurrentSlide((currentSlide + 1) % dashboardImages.length)}
                        style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.8)'}
                        onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.6)'}
                      >
                        ›
                      </button>
                      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                        {dashboardImages.map((_, idx) => (
                          <div
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            style={{ width: '12px', height: '12px', borderRadius: '50%', background: idx === currentSlide % dashboardImages.length ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.3)' }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Right Column - Top 5 Performers */}
              {dashboardImages.length > 0 && (
                <div style={{ background: cardBg, borderRadius: '10px', padding: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', height: '450px', display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>🏆 Top 5 Athletes</h4>
                  {data.athletes.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic', fontSize: '13px' }}>No athlete data yet</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'auto', flex: 1 }}>
                      {[...data.athletes].sort((a, b) => b.stats.pointsFor - a.stats.pointsFor).slice(0, 5).map((athlete, idx) => {
                        const team = data.teams.find(t => t.athleteIds.includes(athlete.id));
                        let badgeColor = '#6c757d';
                        if (idx === 0) badgeColor = '#ffd700';
                        else if (idx === 1) badgeColor = '#c0c0c0';
                        else if (idx === 2) badgeColor = '#cd7f32';

                        return (
                          <div key={athlete.id} style={{ background: darkMode ? '#3d3d3d' : '#f9f9f9', padding: '12px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ background: badgeColor, color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                                  {idx + 1}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{athlete.name}</div>
                                  <div style={{ fontSize: '11px', color: '#666' }}>{team?.name || 'No Team'}</div>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#007bff' }}>{athlete.stats.pointsFor}</div>
                                <div style={{ fontSize: '10px', color: '#666' }}>points</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Fallback - Show announcements full width if no images */}
              {dashboardImages.length === 0 && (
                <div style={{ background: '#fff3cd', border: '2px solid #ffc107', borderRadius: '10px', padding: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: '#856404', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      📢 Official Announcements
                    </h4>
                    {isOfficial && !editingAnnouncements && (
                      <button onClick={() => setEditingAnnouncements(true)} style={{ padding: '6px 12px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                        Edit
                      </button>
                    )}
                  </div>
                  {editingAnnouncements ? (
                    <div>
                      <textarea
                        value={announcements}
                        onChange={(e) => setAnnouncements(e.target.value)}
                        placeholder="Enter announcements here... (e.g., Next tournament: Thursday 1800hrs)"
                        style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '6px', border: '1px solid #ffc107', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button onClick={() => { saveAnnouncements(announcements); setEditingAnnouncements(false); }} style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                          Save
                        </button>
                        <button onClick={() => { setAnnouncements(data.announcements || ''); setEditingAnnouncements(false); }} style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#856404', fontSize: '14px', whiteSpace: 'pre-wrap', minHeight: '50px' }}>
                      {announcements || 'No announcements at this time.'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Active Tournament Progress Cards */}
            {data.tournaments.filter(t => !t.done).length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4>Active Tournaments</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                  {data.tournaments.filter(t => !t.done).map((tournament, idx) => {
                    const totalMatches = tournament.rounds.reduce((sum, round) => sum + round.length, 0);
                    const completedMatches = tournament.rounds.reduce((sum, round) => sum + round.filter(m => m.winner).length, 0);
                    const completionPercent = totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0;
                    const lastRound = tournament.rounds[tournament.rounds.length - 1];
                    const pendingMatches = lastRound.filter(m => !m.winner).length;

                    return (
                      <div key={idx} style={{ background: cardBg, borderRadius: '10px', padding: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', border: `2px solid #007bff` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                          <div>
                            <h5 style={{ margin: '0 0 5px 0', color: '#007bff' }}>{tournament.name}</h5>
                            <div style={{ fontSize: '13px', color: '#666' }}>Weight: {tournament.weight}</div>
                            <div style={{ fontSize: '13px', color: '#666' }}>Round {tournament.rounds.length}</div>
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                            {completionPercent}%
                          </div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span>Progress</span>
                            <span>{completedMatches} / {totalMatches} matches</span>
                          </div>
                          <div style={{ background: darkMode ? '#444' : '#e0e0e0', borderRadius: '10px', height: '20px', overflow: 'hidden' }}>
                            <div style={{ background: '#007bff', height: '100%', width: `${completionPercent}%`, transition: 'width 0.3s' }}></div>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: pendingMatches > 0 ? '#ffc107' : '#28a745', fontWeight: 'bold' }}>
                          {pendingMatches > 0 ? `${pendingMatches} matches pending` : 'Round complete!'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stats Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.lg, marginBottom: spacing['2xl'] }}>
              <div style={{ ...cardStyles.base, textAlign: 'center', borderLeft: `4px solid ${colors.primary}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏆</div>
                <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.extrabold, color: colors.primary }}>{data.teams.length}</div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.textMuted, marginTop: spacing.sm, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: typography.letterSpacing.wide }}>TEAMS</div>
              </div>
              <div style={{ ...cardStyles.base, textAlign: 'center', borderLeft: `4px solid ${colors.success}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>⚔️</div>
                <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.extrabold, color: colors.success }}>{data.athletes.length}</div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.textMuted, marginTop: spacing.sm, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: typography.letterSpacing.wide }}>ATHLETES</div>
              </div>
              <div style={{ ...cardStyles.base, textAlign: 'center', borderLeft: `4px solid #b8860b`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎖️</div>
                <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.extrabold, color: '#b8860b' }}>{data.athletes.filter(a => a.isCoach).length}</div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.textMuted, marginTop: spacing.sm, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: typography.letterSpacing.wide }}>COACHES</div>
              </div>
              <div style={{ ...cardStyles.base, textAlign: 'center', borderLeft: `4px solid ${colors.warning}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>🛡️</div>
                <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.extrabold, color: colors.warning }}>{data.tournaments.filter(t => !t.done).length}</div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.textMuted, marginTop: spacing.sm, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: typography.letterSpacing.wide }}>ACTIVE</div>
              </div>
              <div style={{ ...cardStyles.base, textAlign: 'center', borderLeft: `4px solid ${colors.neutral}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>✓</div>
                <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.extrabold, color: colors.neutral }}>{data.tournaments.filter(t => t.done).length}</div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.textMuted, marginTop: spacing.sm, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: typography.letterSpacing.wide }}>COMPLETED</div>
              </div>
              <div style={{ ...cardStyles.base, textAlign: 'center', borderLeft: `4px solid ${colors.danger}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏥</div>
                <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.extrabold, color: colors.danger }}>{data.athletes.filter(a => a.injured).length}</div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.textMuted, marginTop: spacing.sm, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: typography.letterSpacing.wide }}>INJURED</div>
              </div>
            </div>

            <div style={{ ...cardStyles.base, marginBottom: spacing.lg }}>
              <h4 style={{ textAlign: 'center', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: typography.letterSpacing.wide, fontWeight: typography.fontWeight.extrabold }}>TEAM POINTS LEADERBOARD</h4>
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
                        <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', maxWidth: '80px', wordWrap: 'break-word' }}>
                          {team.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>


            {currentRole === 'admin' && (
              <div style={{ background: cardBg, borderRadius: '10px', padding: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', border: '2px solid #007bff' }}>
                <h4>💡 Admin Tip</h4>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                  Go to the <strong>Admin tab</strong> to manage data import/export, slideshow images, passwords, and more!
                </p>
              </div>
            )}
          </div>
        )}

        {currentTab === 'teams' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
              <h3 style={{ ...headingStyles.h3, margin: 0 }}>TEAMS</h3>
              {isOfficial && (
                <button onClick={() => setShowAddTeam(true)} style={getButtonStyle('primary')}>
                  <Plus size={16} /> Add Team
                </button>
              )}
            </div>

            {showAddTeam && (
              <div style={{ ...cardStyles.base, marginBottom: spacing.lg }}>
                <h4 style={{ marginTop: 0, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>Create New Team</h4>
                <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
                  <input value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="Team name" style={{ ...inputStyles.base, flex: 1 }} />
                  <button onClick={addTeam} style={getButtonStyle('success')}>Create</button>
                  <button onClick={() => { setShowAddTeam(false); setNewTeamName(''); }} style={getButtonStyle('secondary')}>Cancel</button>
                </div>
              </div>
            )}

            {isOfficial && (
              <div style={{ ...cardStyles.base, marginBottom: spacing.lg }}>
                <button onClick={() => setShowAddAthlete(!showAddAthlete)} style={getButtonStyle('primary')}>
                  <Plus size={16} /> Add Athlete
                </button>
                {showAddAthlete && (
                  <div style={{ marginTop: spacing.lg }}>
                    <h4 style={{ marginTop: 0, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>Create New Athlete</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                      <input value={newAthleteName} onChange={(e) => setNewAthleteName(e.target.value)} placeholder="Athlete name" style={inputStyles.base} />
                      <input type="number" value={newAthleteWeight} onChange={(e) => setNewAthleteWeight(e.target.value)} placeholder="Weight (lbs)" style={inputStyles.base} />
                      <select value={newAthleteTeam} onChange={(e) => setNewAthleteTeam(e.target.value)} style={inputStyles.base}>
                        <option value="">Select Team</option>
                        {data.teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                      </select>
                      <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, padding: spacing.md, background: colors.bgHover, borderRadius: radius.md, cursor: 'pointer' }}>
                        <input type="checkbox" checked={newAthleteIsCoach} onChange={(e) => setNewAthleteIsCoach(e.target.checked)} />
                        <span style={{ fontSize: typography.fontSize.sm }}>This athlete is a coach</span>
                      </label>
                      <div style={{ display: 'flex', gap: spacing.md }}>
                        <button onClick={addAthlete} style={getButtonStyle('success')}>Create Athlete</button>
                        <button onClick={() => { setShowAddAthlete(false); setNewAthleteName(''); setNewAthleteWeight(''); setNewAthleteTeam(''); setNewAthleteIsCoach(false); }} style={getButtonStyle('secondary')}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {data.teams.length === 0 ? <p style={{ color: '#666', fontStyle: 'italic' }}>No teams yet</p> : data.teams.filter(team => {
              // Coaches can only see their team
              if (isCoach) return team.name === coachTeam;
              // Others see all teams
              return true;
            }).map((team, i) => {
              const actualIndex = data.teams.indexOf(team);
              return (
                <div key={i} style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {editingTeam === actualIndex ? (
                      <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input value={editTeamName} onChange={(e) => setEditTeamName(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }} />
                        <button onClick={() => saveEditTeam(actualIndex)} style={{ padding: '4px 8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Save</button>
                        <button onClick={() => setEditingTeam(null)} style={{ padding: '4px 8px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                      </div>
                    ) : (
                      <div onClick={() => setExpandedTeam(expandedTeam === actualIndex ? null : actualIndex)} style={{ fontWeight: 'bold', cursor: 'pointer', flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                        <span>{team.name} ({teamPoints.find(tp => tp.name === team.name)?.points || 0} pts)</span>
                        <span>{team.athleteIds.length} athletes</span>
                      </div>
                    )}
                    {(isOfficial || isCoach) && editingTeam !== actualIndex && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            printTeamRoster(team.name);
                          }}
                          style={{ padding: '4px 8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Print Team Roster"
                        >
                          🖨️ Print
                        </button>
                        <button onClick={() => startEditTeam(actualIndex, team.name)} style={{ padding: '4px 8px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px', fontSize: '12px' }}>
                          <Edit2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                  {expandedTeam === actualIndex && (
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
                      <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                        {team.athleteIds.map(id => {
                          const athlete = data.athletes.find(a => a.id === id);
                          return (
                            <div key={id} style={{ padding: '8px', background: darkMode ? '#3d3d3d' : '#f9f9f9', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                              {editingAthlete === id ? (
                                <div style={{ flex: 1, display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <input value={editAthleteName} onChange={(e) => setEditAthleteName(e.target.value)} placeholder="Name" style={{ padding: '4px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: '1 1 120px', background: cardBg, color: textColor, fontSize: '11px' }} />
                                  <input type="number" value={editAthleteWeight} onChange={(e) => setEditAthleteWeight(e.target.value)} placeholder="Weight" style={{ padding: '4px', borderRadius: '4px', border: `1px solid ${borderColor}`, width: '60px', background: cardBg, color: textColor, fontSize: '11px' }} />
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px' }}>
                                    <input type="checkbox" checked={editAthleteIsCoach} onChange={(e) => setEditAthleteIsCoach(e.target.checked)} />
                                    Coach
                                  </label>
                                  <button onClick={() => saveEditAthlete(id)} style={{ padding: '4px 6px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>Save</button>
                                  <button onClick={() => setEditingAthlete(null)} style={{ padding: '4px 6px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>Cancel</button>
                                </div>
                              ) : (
                                <>
                                  <span onClick={() => setSelectedPlayer(athlete)} style={{ cursor: 'pointer', color: '#007bff', textDecoration: athlete?.injured ? 'line-through' : 'none', opacity: athlete?.injured ? 0.6 : 1, fontSize: '13px', flex: 1 }}>
                                    {athlete?.name} {athlete?.isCoach ? '👔' : ''} {athlete?.injured && '🤕'}
                                  </span>
                                  {(isOfficial || isCoach) && (
                                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                      <button onClick={() => toggleInjured(id)} style={{ padding: '2px 6px', background: athlete?.injured ? '#28a745' : '#ffc107', color: athlete?.injured ? 'white' : 'black', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}>
                                        {athlete?.injured ? 'Heal' : 'Injure'}
                                      </button>
                                      <button onClick={() => startEditAthlete(id, athlete.name, athlete.weight, athlete.isCoach)} style={{ padding: '2px 6px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}>
                                        <Edit2 size={12} />
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {currentTab === 'athletes' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ ...headingStyles.h3, margin: 0 }}>ATHLETES</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setStatsView('season')}
                    style={{
                      padding: '6px 12px',
                      background: statsView === 'season' ? colors.primary : 'transparent',
                      color: statsView === 'season' ? colors.textInverse : textColor,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: statsView === 'season' ? 'bold' : 'normal'
                    }}
                  >
                    Season Stats
                  </button>
                  <button
                    onClick={() => setStatsView('lifetime')}
                    style={{
                      padding: '6px 12px',
                      background: statsView === 'lifetime' ? colors.primary : 'transparent',
                      color: statsView === 'lifetime' ? colors.textInverse : textColor,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: statsView === 'lifetime' ? 'bold' : 'normal'
                    }}
                  >
                    Lifetime Stats
                  </button>
                </div>
              </div>
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

                  // Get stats based on view mode
                  const stats = statsView === 'lifetime' ? getLifetimeStats(athlete.name) : athlete.stats;
                  const totalWins = stats.wins.points + stats.wins.submission;
                  const totalLosses = stats.losses.points + stats.losses.submission;

                  return (
                    <div key={athlete.id} onClick={() => setSelectedPlayer(athlete)} style={{ background: cardBg, borderRadius: '10px', padding: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', cursor: 'pointer', opacity: athlete.injured ? 0.6 : 1, position: 'relative' }}>
                      {statsView === 'lifetime' && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: colors.primary, color: colors.textInverse, padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                          LIFETIME
                        </div>
                      )}
                      <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{athlete.name} {athlete.isCoach && '(Coach)'} {athlete.injured && '(Injured)'}</h4>
                      <div style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Team:</strong> {team?.name || 'N/A'}</div>
                      <div style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Weight:</strong> {athlete.weight} lbs</div>
                      <div style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Record:</strong> {totalWins}-{totalLosses}</div>
                      <div style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Points:</strong> {stats.pointsFor}</div>
                      {statsView === 'lifetime' && stats.seasonsActive && (
                        <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '8px' }}>
                          <strong>Seasons:</strong> {stats.seasonsActive.length}
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px', borderTop: `1px solid ${borderColor}`, paddingTop: '8px' }}>
                        <div>Wins: {stats.wins.points}P / {stats.wins.submission}S</div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Weight Classes</h3>
              {isOfficial && (
                <button onClick={() => setShowAddWeightClass(true)} style={{ padding: '8px 14px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} /> Add Weight Class
                </button>
              )}
            </div>

            {showAddWeightClass && (
              <div style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <h4>Create New Weight Class</h4>
                <input value={newWeightClassName} onChange={(e) => setNewWeightClassName(e.target.value)} placeholder="Weight class name (e.g., 150-160 or Lightweight)" style={{ padding: '8px', marginRight: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, width: '250px', background: cardBg, color: textColor }} />
                <button onClick={addWeightClass} style={{ padding: '8px 14px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}>Create</button>
                <button onClick={() => { setShowAddWeightClass(false); setNewWeightClassName(''); }} style={{ padding: '8px 14px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            )}

            {data.weightClasses.map((wc, i) => (
              <div key={i} style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  {editingWeightClass === i ? (
                    <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input value={editWeightClassName} onChange={(e) => setEditWeightClassName(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }} />
                      <button onClick={() => saveEditWeightClass(i)} style={{ padding: '4px 8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Save</button>
                      <button onClick={() => setEditingWeightClass(null)} style={{ padding: '4px 8px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <div onClick={() => setExpandedWeight(expandedWeight === i ? null : i)} style={{ fontWeight: 'bold', cursor: 'pointer', flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                        <span>{wc.name}</span>
                        <span>{wc.athleteIds.length} athletes</span>
                      </div>
                      {isOfficial && (
                        <div style={{ display: 'flex', gap: '8px', marginLeft: '10px' }}>
                          <button onClick={() => startEditWeightClass(i, wc.name)} style={{ padding: '4px 8px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => deleteWeightClass(i)} style={{ padding: '4px 8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {expandedWeight === i && (
                  <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                    {wc.athleteIds.length === 0 ? (
                      <li style={{ color: '#666', fontStyle: 'italic' }}>No athletes in this weight class</li>
                    ) : (
                      wc.athleteIds.map(id => {
                        const athlete = data.athletes.find(a => a.id === id);
                        return <li key={id} onClick={() => setSelectedPlayer(athlete)} style={{ cursor: 'pointer', padding: '4px 0', color: '#007bff', textDecoration: athlete?.injured ? 'line-through' : 'none', opacity: athlete?.injured ? 0.6 : 1 }}>{athlete?.name} - {athlete?.weight} lbs {athlete?.isCoach ? '(Coach)' : ''} {athlete?.injured && '(Injured)'}</li>;
                      })
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {currentTab === 'tournaments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ ...headingStyles.h3, margin: 0 }}>ACTIVE TOURNAMENTS</h3>
              {isOfficial && officialName && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: colors.textMuted }}>Show:</span>
                  <button
                    onClick={() => setTournamentFilter('all')}
                    style={{
                      padding: '6px 12px',
                      background: tournamentFilter === 'all' ? colors.primary : 'transparent',
                      color: tournamentFilter === 'all' ? colors.textInverse : textColor,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    All Tournaments
                  </button>
                  <button
                    onClick={() => setTournamentFilter('mine')}
                    style={{
                      padding: '6px 12px',
                      background: tournamentFilter === 'mine' ? colors.primary : 'transparent',
                      color: tournamentFilter === 'mine' ? colors.textInverse : textColor,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    My Tournaments ({activeTournaments.filter(t => t.managedBy === officialName).length})
                  </button>
                </div>
              )}
            </div>
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
                    <input type="number" value={tournamentYear} onChange={(e) => setTournamentYear(e.target.value)} placeholder="Year (e.g., 2025)" style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }} />
                    <input value={tournamentMonth} onChange={(e) => setTournamentMonth(e.target.value)} placeholder="Month (e.g., January)" style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }} />
                    <input type="number" value={tournamentDay} onChange={(e) => setTournamentDay(e.target.value)} placeholder="Day (1-31)" min="1" max="31" style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${borderColor}`, flex: 1, background: cardBg, color: textColor }} />
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

            {activeTournaments.filter(tournament => {
              // Apply tournament filter for officials
              if (tournamentFilter === 'mine' && isOfficial && officialName) {
                return tournament.managedBy === officialName;
              }
              return true;
            }).length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                {tournamentFilter === 'mine' ? 'No tournaments managed by you' : 'No active tournaments'}
              </p>
            ) : (
              activeTournaments.filter(tournament => {
                if (tournamentFilter === 'mine' && isOfficial && officialName) {
                  return tournament.managedBy === officialName;
                }
                return true;
              }).map((tournament, ti) => {
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
                  <div key={actualIndex} style={{ background: cardBg, borderRadius: radius.md, padding: '15px', marginBottom: '15px', boxShadow: shadows.md, border: `1px solid ${borderColor}`, position: 'relative' }}>
                    <div onClick={() => setExpandedTournaments(prev => ({ ...prev, [actualIndex]: !prev[actualIndex] }))} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '15px' : '0' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <h4 style={{ ...headingStyles.h4, margin: 0 }}>{tournament.name} — {tournament.weight}</h4>
                          {(() => {
                            const status = getTournamentStatus(tournament);
                            return (
                              <span style={badgeStyles(status.type)}>
                                {status.icon} {status.text}
                              </span>
                            );
                          })()}
                        </div>
                        <p style={{ fontSize: typography.fontSize.xs, color: colors.textMuted, margin: 0 }}>
                          Round {tournament.rounds.length} • {lastRound.filter(m => !m.winner).length} matches pending
                        </p>
                      </div>
                      {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>

                    {isExpanded && (
                      <>
                        <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: `1px solid ${borderColor}` }}>
                          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Date: {formatMilitaryDate(tournament.date.year, tournament.date.month, tournament.date.day)}</p>
                          {tournament.officials && <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>Officials: {tournament.officials}</p>}
                          {tournament.managedBy && (
                            <p style={{ fontSize: '13px', color: '#007bff', fontWeight: 'bold', margin: '5px 0 0 0' }}>
                              ⚙️ Managed by: {tournament.managedBy}
                            </p>
                          )}

                          {/* Print Bracket Button */}
                          <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => printBracket(actualIndex)}
                              style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              🖨️ Print Bracket
                            </button>
                            {isOfficial && activeAthletes.length > 0 && (
                              <button onClick={() => setShowRemoveAthleteMenu(showRemoveAthleteMenu === actualIndex ? null : actualIndex)} style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <UserMinus size={14} /> Remove Athlete
                              </button>
                            )}
                          </div>

                          {isOfficial && activeAthletes.length > 0 && showRemoveAthleteMenu === actualIndex && (
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
                                          {/* Quick Decision Buttons */}
                                          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                              <button onClick={() => setShowPositionScoring(showPositionScoring === matchKey ? null : `${matchKey}-A-points`)} style={{ flex: 1, padding: '4px', fontSize: '11px', background: showPositionScoring === `${matchKey}-A-points` ? '#28a745' : 'white', color: showPositionScoring === `${matchKey}-A-points` ? 'white' : 'black', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>{athleteA?.name} P</button>
                                              <button onClick={() => decideMatch(actualIndex, ri, mi, match.athleteA, 'submission', 0, matchNotes)} style={{ flex: 1, padding: '4px', fontSize: '11px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{athleteA?.name} S</button>
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                              <button onClick={() => setShowPositionScoring(showPositionScoring === matchKey ? null : `${matchKey}-B-points`)} style={{ flex: 1, padding: '4px', fontSize: '11px', background: showPositionScoring === `${matchKey}-B-points` ? '#28a745' : 'white', color: showPositionScoring === `${matchKey}-B-points` ? 'white' : 'black', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>{athleteB?.name} P</button>
                                              <button onClick={() => decideMatch(actualIndex, ri, mi, match.athleteB, 'submission', 0, matchNotes)} style={{ flex: 1, padding: '4px', fontSize: '11px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{athleteB?.name} S</button>
                                            </div>
                                          </div>

                                          {/* Position Scoring Menu */}
                                          {(showPositionScoring === `${matchKey}-A-points` || showPositionScoring === `${matchKey}-B-points`) && (
                                            <div style={{ marginTop: '8px', padding: '10px', background: darkMode ? '#2d2d2d' : '#f0f0f0', borderRadius: '6px', border: '2px solid #28a745' }}>
                                              <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#28a745' }}>Position Points</p>
                                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                  <span style={{ fontSize: '11px' }}>Side Mount (+2):</span>
                                                  <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button onClick={() => setPositionPoints(prev => ({ ...prev, sideMount: Math.max(0, prev.sideMount - 1) }))} style={{ padding: '2px 8px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>-</button>
                                                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{positionPoints.sideMount}</span>
                                                    <button onClick={() => setPositionPoints(prev => ({ ...prev, sideMount: prev.sideMount + 1 }))} style={{ padding: '2px 8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>+</button>
                                                  </div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                  <span style={{ fontSize: '11px' }}>Top Mount (+4):</span>
                                                  <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button onClick={() => setPositionPoints(prev => ({ ...prev, topMount: Math.max(0, prev.topMount - 1) }))} style={{ padding: '2px 8px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>-</button>
                                                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{positionPoints.topMount}</span>
                                                    <button onClick={() => setPositionPoints(prev => ({ ...prev, topMount: prev.topMount + 1 }))} style={{ padding: '2px 8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>+</button>
                                                  </div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                  <span style={{ fontSize: '11px' }}>Back Mount (+4):</span>
                                                  <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button onClick={() => setPositionPoints(prev => ({ ...prev, backMount: Math.max(0, prev.backMount - 1) }))} style={{ padding: '2px 8px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>-</button>
                                                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{positionPoints.backMount}</span>
                                                    <button onClick={() => setPositionPoints(prev => ({ ...prev, backMount: prev.backMount + 1 }))} style={{ padding: '2px 8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>+</button>
                                                  </div>
                                                </div>
                                              </div>
                                              <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '8px', marginTop: '8px' }}>
                                                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                                                  Total Position Points: {positionPoints.sideMount * 2 + positionPoints.topMount * 4 + positionPoints.backMount * 4}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                                                  Final Score: {2 + positionPoints.sideMount * 2 + positionPoints.topMount * 4 + positionPoints.backMount * 4} points
                                                </div>
                                                <button
                                                  onClick={() => {
                                                    const totalPositionPoints = positionPoints.sideMount * 2 + positionPoints.topMount * 4 + positionPoints.backMount * 4;
                                                    const winnerId = showPositionScoring === `${matchKey}-A-points` ? match.athleteA : match.athleteB;
                                                    decideMatch(actualIndex, ri, mi, winnerId, 'points', totalPositionPoints, matchNotes);
                                                  }}
                                                  style={{ width: '100%', padding: '6px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                                >
                                                  Confirm Win by Points
                                                </button>
                                              </div>
                                            </div>
                                          )}

                                          {/* Match Notes */}
                                          <div style={{ marginTop: '8px' }}>
                                            <button onClick={() => setShowMatchNotes(showMatchNotes === matchKey ? null : matchKey)} style={{ width: '100%', padding: '4px 8px', background: darkMode ? '#444' : '#e0e0e0', color: textColor, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                                              {showMatchNotes === matchKey ? '✓ Notes' : '+ Add Notes'}
                                            </button>
                                            {showMatchNotes === matchKey && (
                                              <textarea
                                                value={matchNotes}
                                                onChange={(e) => setMatchNotes(e.target.value)}
                                                placeholder="Match notes (optional)..."
                                                style={{ width: '100%', marginTop: '4px', padding: '6px', borderRadius: '4px', border: `1px solid ${borderColor}`, fontSize: '11px', minHeight: '50px', background: cardBg, color: textColor, resize: 'vertical' }}
                                              />
                                            )}
                                          </div>

                                          {/* No Show Button */}
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
                                          {match.positionPoints > 0 && <span style={{ color: '#28a745', fontWeight: 'bold' }}> +{match.positionPoints} position pts</span>}
                                        </div>
                                        {match.notes && (
                                          <div style={{ marginTop: '4px', fontSize: '11px', color: '#666', fontStyle: 'italic', padding: '4px', background: darkMode ? '#3d3d3d' : '#f9f9f9', borderRadius: '4px' }}>
                                            📝 {match.notes}
                                          </div>
                                        )}
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
                    <p style={{ fontSize: '13px', color: '#666' }}>Date: {formatMilitaryDate(tournament.date.year, tournament.date.month, tournament.date.day)}</p>
                    {tournament.officials && <p style={{ fontSize: '13px', color: '#666' }}>Officials: {tournament.officials}</p>}
                    {tournament.managedBy && (
                      <p style={{ fontSize: '13px', color: '#007bff', fontWeight: 'bold' }}>
                        ⚙️ Managed by: {tournament.managedBy}
                      </p>
                    )}
                    <div><strong>Champion:</strong> {data.athletes.find(a => a.id === tournament.champ)?.name}</div>
                    <p style={{ fontSize: '12px', color: '#007bff', marginTop: '8px' }}>Click to view full results</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); printBracket(data.tournaments.indexOf(tournament)); }}
                    style={{ marginTop: '10px', padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    🖨️ Print Bracket
                  </button>
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

        {currentTab === 'analytics' && (
          <div>
            <h3>Analytics</h3>

            {/* Filters */}
            <div style={{ background: cardBg, borderRadius: '10px', padding: '15px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <h4>Filters</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>View Type:</label>
                  <select
                    value={analyticsFilter.type}
                    onChange={(e) => setAnalyticsFilter({ ...analyticsFilter, type: e.target.value, id: '' })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}
                  >
                    <option value="team">Team</option>
                    <option value="athlete">Athlete</option>
                    <option value="all">All Athletes</option>
                  </select>
                </div>

                {analyticsFilter.type === 'team' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Select Team:</label>
                    <select
                      value={analyticsFilter.id}
                      onChange={(e) => setAnalyticsFilter({ ...analyticsFilter, id: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}
                    >
                      <option value="">-- Select Team --</option>
                      {data.teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>
                )}

                {analyticsFilter.type === 'athlete' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Select Athlete:</label>
                    <select
                      value={analyticsFilter.id}
                      onChange={(e) => setAnalyticsFilter({ ...analyticsFilter, id: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}
                    >
                      <option value="">-- Select Athlete --</option>
                      {data.athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Start Date:</label>
                  <input
                    type="date"
                    value={analyticsFilter.startDate}
                    onChange={(e) => setAnalyticsFilter({ ...analyticsFilter, startDate: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>End Date:</label>
                  <input
                    type="date"
                    value={analyticsFilter.endDate}
                    onChange={(e) => setAnalyticsFilter({ ...analyticsFilter, endDate: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}
                  />
                </div>
              </div>
              <button
                onClick={() => setAnalyticsFilter({ type: 'team', id: '', startDate: '', endDate: '' })}
                style={{ marginTop: '15px', padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Clear Filters
              </button>
            </div>

            {/* Analytics Display */}
            {(() => {
              // Filter tournaments by date range
              const filteredTournaments = data.tournaments.filter(t => {
                if (!t.done) return false; // Only completed tournaments

                if (analyticsFilter.startDate || analyticsFilter.endDate) {
                  const tournamentDate = new Date(`${t.date.year}-${MONTHS.indexOf(t.date.month) + 1}-${t.date.day}`);

                  if (analyticsFilter.startDate) {
                    const startDate = new Date(analyticsFilter.startDate);
                    if (tournamentDate < startDate) return false;
                  }

                  if (analyticsFilter.endDate) {
                    const endDate = new Date(analyticsFilter.endDate);
                    if (tournamentDate > endDate) return false;
                  }
                }

                return true;
              });

              // Calculate stats based on filter type
              let statsData = [];

              if (analyticsFilter.type === 'team' && analyticsFilter.id) {
                const team = data.teams.find(t => t.name === analyticsFilter.id);
                if (team) {
                  team.athleteIds.forEach(athleteId => {
                    const athlete = data.athletes.find(a => a.id === athleteId);
                    if (athlete) {
                      statsData.push({
                        name: athlete.name,
                        points: athlete.stats.pointsFor,
                        wins: athlete.stats.wins.points + athlete.stats.wins.submission,
                        losses: athlete.stats.losses.points + athlete.stats.losses.submission,
                        winsByPoints: athlete.stats.wins.points,
                        winsBySubmission: athlete.stats.wins.submission
                      });
                    }
                  });
                }
              } else if (analyticsFilter.type === 'athlete' && analyticsFilter.id) {
                const athlete = data.athletes.find(a => a.id === analyticsFilter.id);
                if (athlete) {
                  // Show tournament-by-tournament breakdown
                  filteredTournaments.forEach(tournament => {
                    let tournamentPoints = 0;
                    let tournamentWins = 0;
                    let tournamentLosses = 0;

                    tournament.rounds.forEach(round => {
                      round.forEach(match => {
                        if (match.winner === athlete.id) {
                          tournamentWins++;
                          if (match.method === 'points' || match.method === 'noshow') tournamentPoints += 2;
                          else if (match.method === 'submission') tournamentPoints += 4;
                        } else if ((match.athleteA === athlete.id || match.athleteB === athlete.id) && match.winner && match.winner !== 'BYE') {
                          tournamentLosses++;
                        }
                      });
                    });

                    if (tournamentWins > 0 || tournamentLosses > 0) {
                      statsData.push({
                        name: `${tournament.name} (${tournament.date.month} ${tournament.date.day})`,
                        points: tournamentPoints,
                        wins: tournamentWins,
                        losses: tournamentLosses
                      });
                    }
                  });
                }
              } else if (analyticsFilter.type === 'all') {
                data.athletes.forEach(athlete => {
                  statsData.push({
                    name: athlete.name,
                    team: data.teams.find(t => t.athleteIds.includes(athlete.id))?.name || 'N/A',
                    points: athlete.stats.pointsFor,
                    wins: athlete.stats.wins.points + athlete.stats.wins.submission,
                    losses: athlete.stats.losses.points + athlete.stats.losses.submission
                  });
                });
                statsData.sort((a, b) => b.points - a.points);
              }

              return (
                <div>
                  {statsData.length === 0 ? (
                    <div style={{ background: cardBg, borderRadius: '10px', padding: '40px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                      <p style={{ fontSize: '18px', color: '#666' }}>No data available for selected filters</p>
                      <p style={{ fontSize: '14px', color: '#999' }}>Try selecting a team or athlete, or adjusting the date range</p>
                    </div>
                  ) : (
                    <>
                      {/* Bar Chart */}
                      <div style={{ background: cardBg, borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                        <h4>Points Comparison</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                          {statsData.map((item, idx) => {
                            const maxPoints = Math.max(...statsData.map(d => d.points), 1);
                            const percentage = (item.points / maxPoints) * 100;
                            return (
                              <div key={idx}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                                  <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                                  <span style={{ color: '#007bff' }}>{item.points} pts</span>
                                </div>
                                <div style={{ background: darkMode ? '#444' : '#e0e0e0', borderRadius: '10px', height: '24px', overflow: 'hidden' }}>
                                  <div style={{ background: '#007bff', height: '100%', width: `${percentage}%`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px', color: 'white', fontSize: '11px', fontWeight: 'bold', transition: 'width 0.3s' }}>
                                    {percentage > 15 && `${item.points} pts`}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stats Table */}
                      <div style={{ background: cardBg, borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                        <h4>Detailed Statistics</h4>
                        <div style={{ overflowX: 'auto', marginTop: '15px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Name</th>
                                {analyticsFilter.type === 'all' && <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Team</th>}
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Points</th>
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Wins</th>
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Losses</th>
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Win Rate</th>
                                {analyticsFilter.type === 'team' && analyticsFilter.id && (
                                  <>
                                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Wins (Pts)</th>
                                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Wins (Sub)</th>
                                  </>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {statsData.map((item, idx) => {
                                const totalMatches = item.wins + item.losses;
                                const winRate = totalMatches > 0 ? Math.round((item.wins / totalMatches) * 100) : 0;
                                return (
                                  <tr key={idx} style={{ borderBottom: `1px solid ${borderColor}` }}>
                                    <td style={{ padding: '12px' }}>{item.name}</td>
                                    {analyticsFilter.type === 'all' && <td style={{ padding: '12px' }}>{item.team}</td>}
                                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#007bff' }}>{item.points}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{item.wins}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{item.losses}</td>
                                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: winRate >= 50 ? '#28a745' : '#dc3545' }}>
                                      {winRate}%
                                    </td>
                                    {analyticsFilter.type === 'team' && analyticsFilter.id && (
                                      <>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>{item.winsByPoints || 0}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>{item.winsBySubmission || 0}</td>
                                      </>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {currentTab === 'admin' && currentRole === 'admin' && (
          <div>
            <h3>Admin Panel</h3>

            {/* Season Management */}
            <div style={{ background: cardBg, borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', border: '2px solid #007bff' }}>
              <h4>📅 Season Management</h4>

              <div style={{ background: darkMode ? '#3d3d3d' : '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <strong>Current Season:</strong> {seasonName}
                  </div>
                  <button
                    onClick={() => {
                      const newName = prompt('Edit season name:', seasonName);
                      if (newName && newName.trim()) {
                        const trimmedName = newName.trim();
                        setSeasonName(trimmedName);
                        // Save with new name immediately
                        const dataToSave = {
                          ...data,
                          announcements,
                          adminPassword,
                          officialPassword,
                          coachPassword,
                          regimentName,
                          dashboardImages,
                          seasonName: trimmedName // Use new name directly, not state
                        };
                        const seasonKey = currentSeason === 'active'
                          ? `grappling_${currentRegiment}`
                          : `grappling_${currentRegiment}_archived_${currentSeason}`;
                        localStorage.setItem(seasonKey, JSON.stringify(dataToSave));
                        showToastNotification(`Season renamed to "${trimmedName}"`, 'success');
                      }
                    }}
                    style={{ padding: '4px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Edit Name
                  </button>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                  <div>Teams: {data.teams.length}</div>
                  <div>Athletes: {data.athletes.length}</div>
                  <div>Tournaments: {data.tournaments.length} ({data.tournaments.filter(t => !t.done).length} active, {data.tournaments.filter(t => t.done).length} completed)</div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (data.athletes.length === 0 && data.tournaments.length === 0) {
                    alert('Current season is empty. Add some data before archiving.');
                    return;
                  }
                  const archiveName = prompt('Enter name for archived season:', seasonName);
                  if (archiveName) {
                    archiveCurrentSeason(archiveName.trim());
                  }
                }}
                style={{ width: '100%', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}
              >
                📦 Archive Current Season & Start Fresh
              </button>

              {archivedSeasons.length > 0 && (
                <div>
                  <h5 style={{ marginTop: '20px', marginBottom: '10px' }}>Archived Seasons ({archivedSeasons.length}/5)</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {archivedSeasons.map(season => (
                      <div key={season.key} style={{ background: darkMode ? '#3d3d3d' : '#f9f9f9', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{season.name}</strong>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            Archived: {new Date(season.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setCurrentSeason(season.key)}
                            style={{ padding: '6px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete archived season "${season.name}"? This cannot be undone.`)) {
                                localStorage.removeItem(`grappling_${currentRegiment}_archived_${season.key}`);
                                const newArchived = archivedSeasons.filter(s => s.key !== season.key);
                                setArchivedSeasons(newArchived);
                                localStorage.setItem(`grappling_${currentRegiment}_archived_list`, JSON.stringify(newArchived));
                              }
                            }}
                            style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Master Recovery Key */}
            <div style={{ background: cardBg, borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', border: '2px solid #dc3545' }}>
              <h4>🔑 Master Recovery Key</h4>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                The Master Recovery Key is a permanent, unchangeable password that can access all roles. Use this for password recovery or succession planning.
              </p>

              <div style={{ background: darkMode ? '#3d3d3d' : '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '2px solid #ffc107' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Master Recovery Key:</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace', color: '#007bff', letterSpacing: '1px', marginBottom: '10px' }}>
                  {MASTER_RECOVERY_KEY}
                </div>
                <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.5' }}>
                  <strong>⚠️ Store this securely:</strong> Write it down, keep with official documents, pass to your successor
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(MASTER_RECOVERY_KEY);
                    alert('Master Recovery Key copied to clipboard!');
                  }}
                  style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  📋 Copy Key
                </button>
                <button
                  onClick={() => setShowMasterKeyInfo(true)}
                  style={{ padding: '8px 16px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  ℹ️ View Full Info
                </button>
                <button
                  onClick={() => {
                    const printContent = `
                      GRAPPLING TOURNAMENT MANAGER
                      MASTER RECOVERY KEY
                      
                      Regiment: ${currentRegiment}
                      Generated: ${new Date().toLocaleDateString()}
                      
                      MASTER RECOVERY KEY:
                      ${MASTER_RECOVERY_KEY}
                      
                      INSTRUCTIONS:
                      1. This key NEVER changes
                      2. Can be used instead of any role password
                      3. Store with official unit documents
                      4. Pass to your successor
                      5. Use for password recovery
                      
                      SECURITY NOTE:
                      Anyone with this key has full admin access.
                      Keep it secure but accessible for continuity.
                    `;
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Master Recovery Key</title>
                          <style>
                            body { font-family: monospace; padding: 40px; white-space: pre-wrap; }
                            @media print { button { display: none; } }
                          </style>
                        </head>
                        <body>
                          <button onclick="window.print()">Print</button>
                          ${printContent}
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                  }}
                  style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  🖨️ Print Recovery Sheet
                </button>
              </div>
            </div>

            {/* Password Management */}
            <div style={{ background: cardBg, borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <h4>🔐 Password Management</h4>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>Set passwords to protect Coach, Official, and Admin roles</p>

              {!editingPasswords ? (
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Coach Password:</strong> {coachPassword ? '••••••••' : 'Not set'}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Official Password:</strong> {officialPassword ? '••••••••' : 'Not set'}
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Admin Password:</strong> {adminPassword ? '••••••••' : 'Not set'}
                  </div>
                  <button onClick={() => setEditingPasswords(true)} style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    Change Passwords
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Coach Password:</label>
                    <input
                      type="password"
                      value={newCoachPassword}
                      onChange={(e) => setNewCoachPassword(e.target.value)}
                      placeholder="Leave blank to remove password"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Official Password:</label>
                    <input
                      type="password"
                      value={newOfficialPassword}
                      onChange={(e) => setNewOfficialPassword(e.target.value)}
                      placeholder="Leave blank to remove password"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Admin Password:</label>
                    <input
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Leave blank to remove password"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => {
                        setCoachPassword(newCoachPassword);
                        setOfficialPassword(newOfficialPassword);
                        setAdminPassword(newAdminPassword);
                        saveData(data);
                        invalidateAllSessions(); // Logout all users when passwords change
                        setEditingPasswords(false);
                        setNewCoachPassword('');
                        setNewOfficialPassword('');
                        setNewAdminPassword('');
                        alert('Passwords updated! All active sessions have been logged out for security.');
                      }}
                      style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Save Passwords
                    </button>
                    <button
                      onClick={() => {
                        setEditingPasswords(false);
                        setNewCoachPassword('');
                        setNewOfficialPassword('');
                        setNewAdminPassword('');
                      }}
                      style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Regiment Settings */}
            <div style={{ background: cardBg, borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <h4>⚙️ Regiment Settings</h4>
              {!editingRegimentName ? (
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Regiment Name:</strong> {regimentName}
                  </div>
                  <button onClick={() => setEditingRegimentName(true)} style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    Edit Name
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    value={regimentName}
                    onChange={(e) => setRegimentName(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => {
                        saveData(data);
                        setEditingRegimentName(false);
                      }}
                      style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setRegimentName(data.regimentName || `Regiment ${currentRegiment}`);
                        setEditingRegimentName(false);
                      }}
                      style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard Slideshow */}
            <div style={{ background: cardBg, borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <h4>📸 Dashboard Slideshow</h4>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>Add images to display on the dashboard</p>

              {dashboardImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                  {dashboardImages.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', border: `2px solid ${borderColor}`, borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={img.url} alt={img.caption} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                      <button
                        onClick={() => {
                          const newImages = dashboardImages.filter((_, i) => i !== idx);
                          setDashboardImages(newImages);
                          saveData(data);
                        }}
                        style={{ position: 'absolute', top: '5px', right: '5px', padding: '4px 8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                      >
                        ×
                      </button>
                      <div style={{ padding: '5px', fontSize: '11px', background: 'rgba(0,0,0,0.7)', color: 'white' }}>
                        {img.caption || 'No caption'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const caption = prompt('Enter caption for this image (optional):') || '';
                        const newImages = [...dashboardImages, { url: event.target.result, caption }];
                        setDashboardImages(newImages);
                        saveData(data);
                      };
                      reader.readAsDataURL(file);
                    }
                    e.target.value = '';
                  }}
                  style={{ display: 'none' }}
                  id="imageUpload"
                />
                <label htmlFor="imageUpload" style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'inline-block' }}>
                  + Add Image
                </label>
              </div>
            </div>

            {/* Backup & Restore */}
            <div style={{ background: cardBg, borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', marginBottom: '15px', border: '2px solid #28a745' }}>
              <h4>💾 Backup & Restore</h4>
              <div style={{ background: '#d4edda', padding: '12px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px', color: '#155724', border: '1px solid #c3e6cb' }}>
                <strong>Recommended:</strong> Download a full backup weekly. Backups include all 4 regiments and all archived seasons.
                {lastBackupDate && (
                  <div style={{ marginTop: '4px' }}>
                    Last backup: {lastBackupDate.toLocaleDateString()} ({Math.floor((Date.now() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24))} days ago)
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={downloadFullBackup}
                  style={{ padding: '8px 14px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
                >
                  ⬇️ Download Full Backup
                </button>
                <label style={{ padding: '8px 14px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⬆️ Restore from Backup
                  <input type="file" accept=".json" onChange={restoreFromBackup} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* Data Management */}
            <div style={{ background: cardBg, borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <h4>📋 Data Management</h4>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={printSeasonSummary}
                  style={{ padding: '8px 14px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  🖨️ Print Season Summary
                </button>
                <button
                  onClick={() => {
                    const helpDoc = generateHelpDocument();
                    const blob = new Blob([helpDoc], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `GTM_User_Guide_Regiment${currentRegiment}_${new Date().toISOString().split('T')[0]}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  style={{ padding: '8px 14px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  📖 Export Help/Instructions
                </button>
                <button onClick={exportToExcel} style={{ padding: '8px 14px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={16} /> Export to Excel
                </button>
                <button onClick={exportImportTemplate} style={{ padding: '8px 14px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={16} /> Download Import Template
                </button>
                <label style={{ padding: '8px 14px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Upload size={16} /> Import from Excel
                  <input type="file" accept=".xlsx,.xls" onChange={importFromExcel} style={{ display: 'none' }} />
                </label>
                <button onClick={autoGenerateData} style={{ padding: '8px 14px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Generate Test Data
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('⚠️ WARNING: This will delete ALL data for this regiment (teams, athletes, tournaments, everything). This cannot be undone. Are you absolutely sure?')) {
                      if (window.confirm('This is your final warning. Delete everything?')) {
                        localStorage.removeItem(`grappling_${currentRegiment}`);
                        window.location.reload();
                      }
                    }
                  }}
                  style={{ padding: '8px 14px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  🗑️ Clear All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Season Manager Modal */}
      {showSeasonManager && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: cardBg, padding: '30px', borderRadius: '10px', width: '500px', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <h3 style={{ marginTop: 0 }}>📅 Season Manager - Regiment {currentRegiment}</h3>

            <div style={{ background: '#e7f3ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #007bff' }}>
              <strong>Current Season: {seasonName}</strong>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                {data.teams.length} teams • {data.athletes.length} athletes • {data.tournaments.length} tournaments
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  onClick={() => {
                    const newName = prompt('Edit season name:', seasonName);
                    if (newName && newName.trim()) {
                      const trimmedName = newName.trim();
                      setSeasonName(trimmedName);
                      // Save with new name immediately
                      const dataToSave = {
                        ...data,
                        announcements,
                        adminPassword,
                        officialPassword,
                        coachPassword,
                        regimentName,
                        dashboardImages,
                        seasonName: trimmedName // Use new name directly, not state
                      };
                      const seasonKey = currentSeason === 'active'
                        ? `grappling_${currentRegiment}`
                        : `grappling_${currentRegiment}_archived_${currentSeason}`;
                      localStorage.setItem(seasonKey, JSON.stringify(dataToSave));
                      showToastNotification(`Season renamed to "${trimmedName}"`, 'success');
                    }
                  }}
                  style={{ padding: '6px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Rename
                </button>
                <button
                  onClick={() => {
                    if (data.athletes.length === 0 && data.tournaments.length === 0) {
                      alert('Current season is empty. Add some data before archiving.');
                      return;
                    }
                    const archiveName = prompt('Enter name for archived season:', seasonName);
                    if (archiveName) {
                      archiveCurrentSeason(archiveName.trim());
                      setShowSeasonManager(false);
                    }
                  }}
                  style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Archive & Start Fresh
                </button>
              </div>
            </div>

            {archivedSeasons.length > 0 && (
              <div>
                <h4>Archived Seasons ({archivedSeasons.length}/5)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {archivedSeasons.map(season => (
                    <div key={season.key} style={{ background: darkMode ? '#3d3d3d' : '#f9f9f9', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{season.name}</strong>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            Archived: {new Date(season.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setCurrentSeason(season.key);
                              setShowSeasonManager(false);
                            }}
                            style={{ padding: '6px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${season.name}"? This cannot be undone.`)) {
                                localStorage.removeItem(`grappling_${currentRegiment}_archived_${season.key}`);
                                const newArchived = archivedSeasons.filter(s => s.key !== season.key);
                                setArchivedSeasons(newArchived);
                                localStorage.setItem(`grappling_${currentRegiment}_archived_list`, JSON.stringify(newArchived));
                              }
                            }}
                            style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowSeasonManager(false)}
              style={{ marginTop: '20px', width: '100%', padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Official Name Prompt Modal */}
      {showOfficialNamePrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: cardBg, padding: '30px', borderRadius: '10px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <h3 style={{ marginTop: 0 }}>⚙️ Official Login</h3>

            {officialPassword && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Enter Official Password:</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Enter password"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${passwordError ? '#dc3545' : borderColor}`, background: cardBg, color: textColor, marginBottom: '10px' }}
                />
                {passwordError && (
                  <div style={{ color: '#dc3545', fontSize: '13px', marginBottom: '10px' }}>
                    {passwordError}
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Enter Your Name:</label>
              <input
                type="text"
                value={officialName}
                onChange={(e) => setOfficialName(e.target.value)}
                placeholder="e.g., CDT Smith, Official Jones"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && officialName.trim()) {
                    if (officialPassword && passwordInput !== officialPassword && passwordInput !== MASTER_RECOVERY_KEY) {
                      setPasswordError('Incorrect password');
                    } else {
                      setCurrentRole('official');
                      saveRoleSession('official', null, officialName.trim());
                      setShowRoleBanner(true);
                      setShowOfficialNamePrompt(false);
                      setPasswordInput('');
                      setPasswordError('');
                    }
                  }
                }}
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Your name will be attached to tournaments you create
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  if (!officialName.trim()) {
                    alert('Please enter your name');
                    return;
                  }
                  if (officialPassword && passwordInput !== officialPassword && passwordInput !== MASTER_RECOVERY_KEY) {
                    setPasswordError('Incorrect password');
                    return;
                  }
                  setCurrentRole('official');
                  saveRoleSession('official', null, officialName.trim());
                  setShowRoleBanner(true);
                  setShowOfficialNamePrompt(false);
                  setPasswordInput('');
                  setPasswordError('');
                }}
                style={{ flex: 1, padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Login as Official
              </button>
              <button
                onClick={() => {
                  setShowOfficialNamePrompt(false);
                  setOfficialName('');
                  setPasswordInput('');
                  setPasswordError('');
                }}
                style={{ flex: 1, padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coach Team Selector Modal */}
      {showCoachTeamSelector && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: cardBg, padding: '30px', borderRadius: '10px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <h3 style={{ marginTop: 0 }}>🔒 Coach Login</h3>

            {coachPassword && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Enter Coach Password:</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError('');
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && (passwordInput === coachPassword || passwordInput === MASTER_RECOVERY_KEY) && coachTeam) {
                      setCurrentRole('coach');
                      saveRoleSession('coach', coachTeam);
                      setShowRoleBanner(true);
                      setShowCoachTeamSelector(false);
                      setPasswordInput('');
                      setPasswordError('');
                    } else if (e.key === 'Enter' && passwordInput !== coachPassword && passwordInput !== MASTER_RECOVERY_KEY) {
                      setPasswordError('Incorrect password');
                    } else if (e.key === 'Enter' && !coachTeam) {
                      setPasswordError('Please select a team first');
                    }
                  }}
                  placeholder="Enter password"
                  autoFocus
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${passwordError ? '#dc3545' : borderColor}`, background: cardBg, color: textColor }}
                />
                {passwordError && (
                  <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                    {passwordError}
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Select Your Team:</label>
              <select
                value={coachTeam}
                onChange={(e) => {
                  setCoachTeam(e.target.value);
                  setPasswordError('');
                }}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }}
              >
                <option value="">-- Select Team --</option>
                {data.teams.map(team => (
                  <option key={team.name} value={team.name}>{team.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  if (!coachTeam) {
                    setPasswordError('Please select a team');
                    return;
                  }
                  if (coachPassword && passwordInput !== coachPassword && passwordInput !== MASTER_RECOVERY_KEY) {
                    setPasswordError('Incorrect password');
                    return;
                  }
                  setCurrentRole('coach');
                  saveRoleSession('coach', coachTeam);
                  setShowRoleBanner(true);
                  setShowCoachTeamSelector(false);
                  setPasswordInput('');
                  setPasswordError('');
                }}
                style={{ flex: 1, padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Login as Coach
              </button>
              <button
                onClick={() => {
                  setShowCoachTeamSelector(false);
                  setCoachTeam('');
                  setPasswordInput('');
                  setPasswordError('');
                }}
                style={{ flex: 1, padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: cardBg, padding: '30px', borderRadius: '10px', width: '350px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <h3 style={{ marginTop: 0 }}>🔒 Enter Password</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
              {showPasswordPrompt === 'admin' ? 'Admin' : 'Official'} role requires a password
            </p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError('');
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const correctPassword = showPasswordPrompt === 'admin' ? adminPassword : officialPassword;
                  if (passwordInput === correctPassword || passwordInput === MASTER_RECOVERY_KEY) {
                    setCurrentRole(showPasswordPrompt);
                    saveRoleSession(showPasswordPrompt);
                    setShowRoleBanner(true);
                    setShowPasswordPrompt(false);
                    setPasswordInput('');
                    setPasswordError('');
                  } else {
                    setPasswordError('Incorrect password');
                  }
                }
              }}
              placeholder="Enter password"
              autoFocus
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${passwordError ? '#dc3545' : borderColor}`, background: cardBg, color: textColor, marginBottom: '10px' }}
            />
            {passwordError && (
              <div style={{ color: '#dc3545', fontSize: '13px', marginBottom: '10px' }}>
                {passwordError}
              </div>
            )}
            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setShowMasterKeyInfo(true);
                  setPasswordInput('');
                  setPasswordError('');
                }}
                style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
              >
                Forgot password? Use Master Recovery Key
              </button>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  const correctPassword = showPasswordPrompt === 'admin' ? adminPassword : officialPassword;
                  if (passwordInput === correctPassword || passwordInput === MASTER_RECOVERY_KEY) {
                    setCurrentRole(showPasswordPrompt);
                    saveRoleSession(showPasswordPrompt);
                    setShowRoleBanner(true);
                    setShowPasswordPrompt(false);
                    setPasswordInput('');
                    setPasswordError('');
                  } else {
                    setPasswordError('Incorrect password');
                  }
                }}
                style={{ flex: 1, padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Unlock
              </button>
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setPasswordInput('');
                  setPasswordError('');
                }}
                style={{ flex: 1, padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Master Key Info Modal */}
      {showMasterKeyInfo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: cardBg, padding: '30px', borderRadius: '10px', width: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <h3 style={{ marginTop: 0, color: '#dc3545' }}>🔑 Master Recovery Key</h3>

            <div style={{ background: darkMode ? '#3d3d3d' : '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #ffc107' }}>
              <p style={{ fontSize: '14px', marginBottom: '15px', color: colors.textMuted }}>
                The Master Recovery Key is a permanent password that can always access all roles, even if regular passwords are lost.
              </p>

              <div style={{ background: darkMode ? '#1a1a1a' : '#fff', padding: '15px', borderRadius: '6px', border: '2px solid #007bff', marginBottom: '15px' }}>
                <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '5px' }}>Master Recovery Key:</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'monospace', color: '#007bff', letterSpacing: '1px' }}>
                  {MASTER_RECOVERY_KEY}
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#666' }}>
                <strong>⚠️ Important:</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>This key NEVER changes</li>
                  <li>Write it down and store securely</li>
                  <li>Keep with unit's official documents</li>
                  <li>Pass to your successor</li>
                  <li>Can be used to reset all passwords</li>
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(MASTER_RECOVERY_KEY);
                  alert('Master Recovery Key copied to clipboard!');
                }}
                style={{ flex: 1, padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                📋 Copy Key
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                style={{ flex: 1, padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🖨️ Print
              </button>
              <button
                onClick={() => setShowMasterKeyInfo(false)}
                style={{ flex: 1, padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPlayer && (
        <div onClick={() => setSelectedPlayer(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10001 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: cardBg, padding: '20px', borderRadius: '10px', width: '400px', maxHeight: '80vh', overflow: 'auto' }}>
            <h3>{selectedPlayer.name}</h3>
            <p>{data.teams.find(t => t.athleteIds.includes(selectedPlayer.id))?.name} • {selectedPlayer.weight} lbs</p>
            {selectedPlayer.isCoach && <p style={{ color: '#007bff', fontWeight: 'bold' }}>COACH</p>}
            {selectedPlayer.injured && <p style={{ color: '#dc3545', fontWeight: 'bold' }}>INJURED</p>}

            <div style={{ marginTop: '15px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                <button
                  onClick={() => setStatsView('season')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: statsView === 'season' ? colors.primary : colors.bgHover,
                    color: statsView === 'season' ? colors.textInverse : textColor,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: statsView === 'season' ? 'bold' : 'normal'
                  }}
                >
                  Season Stats
                </button>
                <button
                  onClick={() => setStatsView('lifetime')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: statsView === 'lifetime' ? colors.primary : colors.bgHover,
                    color: statsView === 'lifetime' ? colors.textInverse : textColor,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: statsView === 'lifetime' ? 'bold' : 'normal'
                  }}
                >
                  Lifetime Stats
                </button>
              </div>

              {statsView === 'season' ? (
                <div>
                  <p><strong>Wins by Points:</strong> {selectedPlayer.stats.wins.points}</p>
                  <p><strong>Wins by Submission:</strong> {selectedPlayer.stats.wins.submission}</p>
                  <p><strong>Losses by Points:</strong> {selectedPlayer.stats.losses.points}</p>
                  <p><strong>Losses by Submission:</strong> {selectedPlayer.stats.losses.submission}</p>
                  <p><strong>Total Points:</strong> {selectedPlayer.stats.pointsFor}</p>
                  <p><strong>Record:</strong> {selectedPlayer.stats.wins.points + selectedPlayer.stats.wins.submission}-{selectedPlayer.stats.losses.points + selectedPlayer.stats.losses.submission}</p>
                </div>
              ) : (() => {
                const lifetimeStats = getLifetimeStats(selectedPlayer.name);
                return (
                  <div>
                    <p><strong>Wins by Points:</strong> {lifetimeStats.wins.points}</p>
                    <p><strong>Wins by Submission:</strong> {lifetimeStats.wins.submission}</p>
                    <p><strong>Losses by Points:</strong> {lifetimeStats.losses.points}</p>
                    <p><strong>Losses by Submission:</strong> {lifetimeStats.losses.submission}</p>
                    <p><strong>Total Points:</strong> {lifetimeStats.pointsFor}</p>
                    <p><strong>Record:</strong> {lifetimeStats.wins.points + lifetimeStats.wins.submission}-{lifetimeStats.losses.points + lifetimeStats.losses.submission}</p>
                    <p><strong>Seasons Active:</strong> {lifetimeStats.seasonsActive.length}</p>
                    <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '10px', padding: '10px', background: colors.bgHover, borderRadius: '6px' }}>
                      <strong>Seasons:</strong><br />
                      {lifetimeStats.seasonsActive.join(', ')}
                    </div>
                  </div>
                );
              })()}
            </div>

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

      {/* Footer with version and infrastructure info */}
      <footer style={{ marginTop: '40px', padding: '20px', background: darkMode ? '#1e293b' : '#f1f5f9', borderTop: `1px solid ${borderColor}`, textAlign: 'center', fontSize: '12px', color: colors.textMuted }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>West Point Combatives</strong> v{APP_VERSION} | Data v{DATA_VERSION}
        </div>
        <div style={{ fontSize: '11px', color: colors.textSubtle, marginBottom: '8px' }}>
          {roleSession.isAuthenticated && roleSession.role !== 'viewer' && (
            <span style={{ marginRight: '12px' }}>
              🔐 Logged in as <strong>{roleSession.role.charAt(0).toUpperCase() + roleSession.role.slice(1)}</strong>
              {roleSession.authenticatedAt && ` (${new Date(roleSession.authenticatedAt).toLocaleDateString()})`}
            </span>
          )}
          <span style={{ marginRight: '12px' }}>📦 Infrastructure: Multi-User Ready</span>
          <span>💾 Storage: Local (Cloud-Ready)</span>
        </div>
        <div style={{ fontSize: '10px', color: colors.textSubtle, fontStyle: 'italic' }}>
          Created by CDT Natas Coats '27 A3
        </div>
      </footer>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<GrapplingTournamentApp />);