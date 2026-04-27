import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';

// Initialize Supabase client
const supabase = createClient(
  'https://dtxdszglxxnhjrxonsng.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eGRzemdseHhuaGpyeG9uc25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzc2OTAsImV4cCI6MjA5MjcxMzY5MH0.bXPKPmj4eYq6vkbmBtRK00tbsW3fFLwvOTnqSCOS8OQ'
);

// Context
const AppContext = createContext();
const useAppContext = () => useContext(AppContext);

// ============================================
// DADOS
// ============================================
const ROLE_ICONS = {
  duelista: 'https://static.wikia.nocookie.net/valorant/images/f/fd/DuelistClassSymbol.png/revision/latest/scale-to-width-down/25?cb=20200408043920',
  iniciador: 'https://static.wikia.nocookie.net/valorant/images/7/77/InitiatorClassSymbol.png/revision/latest/scale-to-width-down/25?cb=20200408043926',
  controlador: 'https://static.wikia.nocookie.net/valorant/images/0/04/ControllerClassSymbol.png/revision/latest/scale-to-width-down/25?cb=20200408043911',
  sentinela: 'https://static.wikia.nocookie.net/valorant/images/4/43/SentinelClassSymbol.png/revision/latest/scale-to-width-down/25?cb=20200408043934'
};

const MAPS = [
  { id: 'bind', name: 'Bind', image: 'https://static.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Bind.png/revision/latest/scale-to-width-down/190?cb=20200620202316' },
  { id: 'haven', name: 'Haven', image: 'https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png/revision/latest/scale-to-width-down/190?cb=20200620202335' },
  { id: 'split', name: 'Split', image: 'https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png/revision/latest/scale-to-width-down/190?cb=20230411161807' },
  { id: 'ascent', name: 'Ascent', image: 'https://static.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png/revision/latest/scale-to-width-down/190?cb=20200607180020' },
  { id: 'icebox', name: 'Icebox', image: 'https://static.wikia.nocookie.net/valorant/images/1/13/Loading_Screen_Icebox.png/revision/latest/scale-to-width-down/190?cb=20250730171440' },
  { id: 'breeze', name: 'Breeze', image: 'https://static.wikia.nocookie.net/valorant/images/1/10/Loading_Screen_Breeze.png/revision/latest/scale-to-width-down/190?cb=20260106175937' },
  { id: 'fracture', name: 'Fracture', image: 'https://static.wikia.nocookie.net/valorant/images/f/fc/Loading_Screen_Fracture.png/revision/latest/scale-to-width-down/190?cb=20210908143656' },
  { id: 'pearl', name: 'Pearl', image: 'https://static.wikia.nocookie.net/valorant/images/a/af/Loading_Screen_Pearl.png/revision/latest/scale-to-width-down/190?cb=20220622132842' },
  { id: 'lotus', name: 'Lotus', image: 'https://static.wikia.nocookie.net/valorant/images/d/d0/Loading_Screen_Lotus.png/revision/latest/scale-to-width-down/190?cb=20230106163526' },
  { id: 'sunset', name: 'Sunset', image: 'https://static.wikia.nocookie.net/valorant/images/5/5c/Loading_Screen_Sunset.png/revision/latest/scale-to-width-down/190?cb=20230829125442' },
  { id: 'abyss', name: 'Abyss', image: 'https://static.wikia.nocookie.net/valorant/images/6/61/Loading_Screen_Abyss.png/revision/latest/scale-to-width-down/190?cb=20240730145619' },
  { id: 'corrode', name: 'Corrode', image: 'https://static.wikia.nocookie.net/valorant/images/6/6f/Loading_Screen_Corrode.png/revision/latest/scale-to-width-down/190?cb=20250624201813' }
];

const AGENTS = {
  duelista: [
    { id: 'jett', name: 'Jett', image: 'https://static.wikia.nocookie.net/valorant/images/3/35/Jett_icon.png/revision/latest/scale-to-width-down/75?cb=20230909031447' },
    { id: 'phoenix', name: 'Phoenix', image: 'https://static.wikia.nocookie.net/valorant/images/1/14/Phoenix_icon.png/revision/latest/scale-to-width-down/75?cb=20230606161016' },
    { id: 'reyna', name: 'Reyna', image: 'https://static.wikia.nocookie.net/valorant/images/b/b0/Reyna_icon.png/revision/latest/scale-to-width-down/75?cb=20230606161102' },
    { id: 'raze', name: 'Raze', image: 'https://static.wikia.nocookie.net/valorant/images/9/9c/Raze_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180834' },
    { id: 'yoru', name: 'Yoru', image: 'https://static.wikia.nocookie.net/valorant/images/d/d4/Yoru_icon.png/revision/latest/scale-to-width-down/75?cb=20250318173810' },
    { id: 'neon', name: 'Neon', image: 'https://static.wikia.nocookie.net/valorant/images/d/d0/Neon_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180744' },
    { id: 'iso', name: 'Iso', image: 'https://static.wikia.nocookie.net/valorant/images/b/b7/Iso_icon.png/revision/latest/scale-to-width-down/75?cb=20231031131018' },
    { id: 'waylay', name: 'Waylay', image: 'https://static.wikia.nocookie.net/valorant/images/3/3d/Waylay_icon.png/revision/latest/scale-to-width-down/75?cb=20250304181241' }
  ],
  iniciador: [
    { id: 'sova', name: 'Sova', image: 'https://static.wikia.nocookie.net/valorant/images/4/49/Sova_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180933' },
    { id: 'breach', name: 'Breach', image: 'https://static.wikia.nocookie.net/valorant/images/5/53/Breach_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180542' },
    { id: 'skye', name: 'Skye', image: 'https://static.wikia.nocookie.net/valorant/images/3/33/Skye_icon.png/revision/latest/scale-to-width-down/75?cb=20230606161546' },
    { id: 'kayo', name: 'KAY/O', image: 'https://static.wikia.nocookie.net/valorant/images/f/f0/KAYO_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180711' },
    { id: 'fade', name: 'Fade', image: 'https://static.wikia.nocookie.net/valorant/images/a/a6/Fade_icon.png/revision/latest/scale-to-width-down/75?cb=20230523161332' },
    { id: 'gekko', name: 'Gekko', image: 'https://static.wikia.nocookie.net/valorant/images/6/66/Gekko_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180641' },
    { id: 'tejo', name: 'Tejo', image: 'https://static.wikia.nocookie.net/valorant/images/9/90/Tejo_icon.png/revision/latest/scale-to-width-down/75?cb=20250107192428' }
  ],
  controlador: [
    { id: 'brimstone', name: 'Brimstone', image: 'https://static.wikia.nocookie.net/valorant/images/4/4d/Brimstone_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180558' },
    { id: 'viper', name: 'Viper', image: 'https://static.wikia.nocookie.net/valorant/images/5/5f/Viper_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180950' },
    { id: 'omen', name: 'Omen', image: 'https://static.wikia.nocookie.net/valorant/images/b/b0/Omen_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180801' },
    { id: 'astra', name: 'Astra', image: 'https://static.wikia.nocookie.net/valorant/images/0/08/Astra_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180525' },
    { id: 'harbor', name: 'Harbor', image: 'https://static.wikia.nocookie.net/valorant/images/f/f3/Harbor_icon.png/revision/latest/scale-to-width-down/75?cb=20230523161242' },
    { id: 'clove', name: 'Clove', image: 'https://static.wikia.nocookie.net/valorant/images/3/30/Clove_icon.png/revision/latest/scale-to-width-down/75?cb=20240326163719' }
  ],
  sentinela: [
    { id: 'sage', name: 'Sage', image: 'https://static.wikia.nocookie.net/valorant/images/7/74/Sage_icon.png/revision/latest/scale-to-width-down/75?cb=20260317170200' },
    { id: 'cypher', name: 'Cypher', image: 'https://static.wikia.nocookie.net/valorant/images/8/88/Cypher_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180623' },
    { id: 'killjoy', name: 'Killjoy', image: 'https://static.wikia.nocookie.net/valorant/images/1/15/Killjoy_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180727' },
    { id: 'chamber', name: 'Chamber', image: 'https://static.wikia.nocookie.net/valorant/images/0/09/Chamber_icon.png/revision/latest/scale-to-width-down/75?cb=20230523180616' },
    { id: 'deadlock', name: 'Deadlock', image: 'https://static.wikia.nocookie.net/valorant/images/e/eb/Deadlock_icon.png/revision/latest/scale-to-width-down/75?cb=20230627132804' },
    { id: 'vyse', name: 'Vyse', image: 'https://static.wikia.nocookie.net/valorant/images/2/21/Vyse_icon.png/revision/latest/scale-to-width-down/75?cb=20240827165928' }
  ]
};

// Helper function
const getAgentImage = (agentName) => {
  for (const role of Object.values(AGENTS)) {
    const agent = role.find(a => a.name === agentName);
    if (agent) return agent.image;
  }
  return null;
};

// ============================================
// MAIN APP
// ============================================
function App() {
  const [session, setSession] = useState(null);
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [playerNames, setPlayerNames] = useState({});
  const [savedCompositions, setSavedCompositions] = useState([]);
  const [showCompositions, setShowCompositions] = useState(false);
  const [toast, setToast] = useState(null);
  const downloadRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const fetchCompositions = async () => {
    if (!session) return;
    const { data } = await supabase
      .from('compositions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (data) setSavedCompositions(data);
  };

  useEffect(() => {
    if (session) {
      fetchCompositions();
    }
  }, [session]);

  const showToast = (message, icon = '✅') => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  // Get compositions count per map
  const getMapCompCount = (mapName) => {
    return savedCompositions.filter(c => c.map === mapName).length;
  };

  return (
    <AppContext.Provider value={{ supabase, session, showToast, fetchCompositions, savedCompositions }}>
      <div className="app">
        {toast && (
          <div className={`toast ${toast ? 'show' : ''}`}>
            <span className="toast-icon">{toast.icon}</span>
            <span className="toast-message">{toast.message}</span>
          </div>
        )}
        
        {!session ? (
          <AuthScreen />
        ) : (
          <>
            <Header />
            <div className="main-layout">
              <MapsSidebar 
                selectedMap={selectedMap} 
                setSelectedMap={setSelectedMap}
                setShowCompositions={setShowCompositions}
                getMapCompCount={getMapCompCount}
                setSelectedAgents={setSelectedAgents}
                setPlayerNames={setPlayerNames}
              />
              <div className="content-area">
                <SelectedAgentsBar 
                  selectedMap={selectedMap}
                  selectedAgents={selectedAgents} 
                  setSelectedAgents={setSelectedAgents}
                  playerNames={playerNames}
                  setPlayerNames={setPlayerNames}
                  downloadRef={downloadRef}
                />
                <AgentsSection 
                  selectedMap={selectedMap} 
                  selectedAgents={selectedAgents} 
                  setSelectedAgents={setSelectedAgents} 
                />
              </div>
            </div>
            
            {showCompositions && (
              <CompositionsModal 
                compositions={savedCompositions}
                setSelectedAgents={setSelectedAgents}
                setSelectedMap={setSelectedMap}
                setShowCompositions={setShowCompositions}
                fetchCompositions={fetchCompositions}
                setPlayerNames={setPlayerNames}
                MAPS={MAPS}
              />
            )}
          </>
        )}
        
        <div ref={downloadRef} className="download-composition"></div>
      </div>
    </AppContext.Provider>
  );
}

// ============================================
// AUTH SCREEN
// ============================================
function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { supabase, showToast } = useAppContext();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showToast('Conta criada! Verifique seu email.', '📧');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast('Login realizado!', '✅');
      }
    } catch (error) {
      showToast(error.message, '❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-box">
        <div className="logo-container">
          <div className="logo-icon">V</div>
          <h1>Agent <span>Composition</span></h1>
          <p>Crie e salve suas composições de time</p>
        </div>
        <h2>{isSignUp ? 'CRIAR CONTA' : 'ENTRAR'}</h2>
        <form onSubmit={handleAuth}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={loading} />
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Carregando...' : isSignUp ? 'CRIAR CONTA' : 'ENTRAR'}
          </button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="toggle-link">
          {isSignUp ? 'Já tem conta? Entre' : 'Não tem conta? Cadastre-se'}
        </button>
      </div>
    </div>
  );
}

// ============================================
// HEADER
// ============================================
function Header() {
  const { supabase, showToast } = useAppContext();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast('Logout realizado!', '👋');
  };
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">V</div>
          <h1>Agent <span>Composition</span></h1>
        </div>
        <button onClick={handleLogout} className="btn-logout">SAIR</button>
      </div>
    </header>
  );
}

// ============================================
// MAPS SIDEBAR (ESQUERDA) - MAPAS MAIORES
// ============================================
function MapsSidebar({ selectedMap, setSelectedMap, setShowCompositions, getMapCompCount, setSelectedAgents, setPlayerNames }) {
  return (
    <aside className="maps-sidebar">
      <h3 className="sidebar-title">MAPAS</h3>
      <div className="sidebar-maps-list">
        {MAPS.map(map => {
          const compCount = getMapCompCount(map.name);
          return (
            <div
              key={map.id}
              className={`sidebar-map-card ${selectedMap?.name === map.name ? 'active' : ''} ${compCount > 0 ? 'has-comps' : ''}`}
              onClick={() => {
                if (selectedMap?.name === map.name) {
                  setSelectedMap(null);
                  setSelectedAgents([]);
                  setPlayerNames({});
                } else {
                  setSelectedMap(map);
                  setSelectedAgents([]);
                  setPlayerNames({});
                }
              }}
            >
              <img className="sidebar-map-image" src={map.image} alt={map.name} />
              <div className="sidebar-map-info">
                <span className="sidebar-map-name">{map.name}</span>
                {compCount > 0 && (
                  <span className="map-comp-badge">{compCount} comp{compCount > 1 ? 's' : ''}</span>
                )}
              </div>
              {compCount > 0 && <span className="map-comp-indicator"></span>}
            </div>
          );
        })}
      </div>
      <button 
        className="btn-compositions"
        onClick={() => setShowCompositions(true)}
      >
        📂 Escolha a Composição
      </button>
    </aside>
  );
}

// ============================================
// SELECTED AGENTS BAR (TOPO)
// ============================================
function SelectedAgentsBar({ selectedMap, selectedAgents, setSelectedAgents, playerNames, setPlayerNames, downloadRef }) {
  const { supabase, session, showToast, fetchCompositions } = useAppContext();
  const [editingSlot, setEditingSlot] = useState(null);

  const saveComposition = async () => {
    if (!selectedMap) {
      showToast('Selecione um mapa primeiro!', '🗺️');
      return;
    }
    if (selectedAgents.length !== 5) {
      showToast('Selecione exatamente 5 agentes!', '⚠️');
      return;
    }
    const name = prompt('Nome da composição:');
    if (!name) return;
    try {
      const { error } = await supabase.from('compositions').insert([{
        user_id: session.user.id,
        name: name,
        map: selectedMap.name,
        agents: selectedAgents,
        player_names: playerNames,
        tags: [],
        strategy: ''
      }]);
      if (error) throw error;
      await fetchCompositions();
      showToast('Composição salva! 💾');
    } catch (error) {
      showToast(error.message, '❌');
    }
  };

  const downloadComposition = async () => {
    if (!selectedMap || selectedAgents.length === 0) {
      showToast('Selecione mapa e agentes primeiro!', '⚠️');
      return;
    }

    const downloadEl = downloadRef.current;
    downloadEl.innerHTML = `
      <div style="background: #0f1923; padding: 30px; width: 700px; font-family: 'Oswald', sans-serif; color: #ece8e1;">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; border-bottom: 2px solid #ff4655; padding-bottom: 15px;">
          <div style="width: 50px; height: 50px; background: #ff4655; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: white;">V</div>
          <div>
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Agent <span style="color: #ff4655;">Composition</span></h1>
          </div>
        </div>
        <div style="margin-bottom: 15px;">
          <h2 style="color: #768079; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 5px;">Mapa</h2>
          <p style="font-size: 22px; font-weight: 700; text-transform: uppercase; margin: 0;">${selectedMap.name}</p>
        </div>
        <div>
          <h2 style="color: #768079; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 15px;">Agentes</h2>
          <div style="display: flex; gap: 15px; justify-content: center;">
            ${selectedAgents.map(agent => `
              <div style="text-align: center;">
                <img src="${getAgentImage(agent)}" alt="${agent}" style="width: 70px; height: 70px; border-radius: 50%; border: 3px solid #ff4655; padding: 4px; background: #1f2731;" />
                <p style="margin: 8px 0 3px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">${agent}</p>
                ${playerNames[agent] ? `<p style="margin: 0; font-size: 10px; color: #768079;">${playerNames[agent]}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const canvas = await html2canvas(downloadEl, { backgroundColor: '#0f1923' });
    const link = document.createElement('a');
    link.download = `composition-${selectedMap.name.toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Composição baixada! 📄');
  };

  const clearComposition = () => {
    setSelectedAgents([]);
    setPlayerNames({});
    showToast('Composição limpa! 🗑️');
  };

  return (
    <div className="selected-agents-bar">
      <div className="selected-agents-slots">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className={`selected-agent-slot ${selectedAgents[i] ? 'filled' : ''}`}>
            {selectedAgents[i] ? (
              <>
                <img 
                  className="selected-agent-img" 
                  src={getAgentImage(selectedAgents[i])} 
                  alt={selectedAgents[i]}
                  onError={(e) => { e.target.src = `https://via.placeholder.com/40/1f2731/768079?text=${selectedAgents[i][0]}`; }}
                />
                <span className="selected-agent-name">{selectedAgents[i]}</span>
                
                {/* Player name input */}
                {editingSlot === i ? (
                  <input
                    className="player-name-input"
                    type="text"
                    placeholder="Player"
                    value={playerNames[selectedAgents[i]] || ''}
                    onChange={(e) => setPlayerNames({...playerNames, [selectedAgents[i]]: e.target.value})}
                    onBlur={() => setEditingSlot(null)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingSlot(null)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span 
                    className="player-name-display"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSlot(i);
                    }}
                  >
                    {playerNames[selectedAgents[i]] || 'Player'}
                  </span>
                )}
                
                <span className="slot-remove-btn" onClick={(e) => {
                  e.stopPropagation();
                  const newAgents = [...selectedAgents];
                  newAgents.splice(i, 1);
                  setSelectedAgents(newAgents);
                }}>×</span>
              </>
            ) : (
              <span className="slot-placeholder">+</span>
            )}
          </div>
        ))}
      </div>
      
      <div className="selected-agents-info">
        <div className="agent-count">
          <span>{selectedAgents.length}</span>/5
        </div>
        <div className="selected-agents-actions">
          <button className="btn btn-primary" onClick={saveComposition}>
            💾 Salvar
          </button>
          <button className="btn btn-download" onClick={downloadComposition}>
            📥 Baixar Comp
          </button>
          <button className="btn btn-danger" onClick={clearComposition}>
            🗑️ Limpar
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// AGENTS SECTION - CLASSES EM COLUNA
// ============================================
function AgentsSection({ selectedMap, selectedAgents, setSelectedAgents }) {
  const handleAgentClick = (agentName) => {
    if (selectedAgents.includes(agentName)) {
      setSelectedAgents(selectedAgents.filter(a => a !== agentName));
    } else if (selectedAgents.length < 5) {
      setSelectedAgents([...selectedAgents, agentName]);
    }
  };

  return (
    <section className="agents-section">
      <h2 className="section-title">Selecione os Agentes</h2>

      <div className="roles-grid">
        {Object.entries(AGENTS).map(([role, agents]) => (
          <div key={role} className="role-column">
            <div className="role-header">
              <img className="role-icon-img" src={ROLE_ICONS[role]} alt={role} />
              <h3 className="role-title">{role.charAt(0).toUpperCase() + role.slice(1)}</h3>
            </div>
            <div className="agents-list">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  className={`agent-card ${selectedAgents.includes(agent.name) ? 'selected' : ''} ${selectedAgents.length >= 5 && !selectedAgents.includes(agent.name) ? 'disabled' : ''}`}
                  onClick={() => handleAgentClick(agent.name)}
                >
                  <img className="agent-image" src={agent.image} alt={agent.name} />
                  <span className="agent-name">{agent.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// COMPOSITIONS MODAL
// ============================================
function CompositionsModal({ compositions, setSelectedAgents, setSelectedMap, setShowCompositions, fetchCompositions, setPlayerNames, MAPS }) {
  const { supabase, session, showToast } = useAppContext();

  const loadComposition = (comp) => {
    setSelectedAgents(comp.agents);
    setPlayerNames(comp.player_names || {});
    const mapObj = MAPS.find(m => m.name === comp.map);
    setSelectedMap(mapObj || { name: comp.map });
    setShowCompositions(false);
    showToast(`Composição "${comp.name}" carregada! 📂`);
  };

  const deleteComposition = async (id, name) => {
    if (!window.confirm(`Deletar composição "${name}"?`)) return;
    try {
      const { error } = await supabase.from('compositions').delete().eq('id', id);
      if (error) throw error;
      showToast('Composição deletada! 🗑️');
      fetchCompositions();
    } catch (error) {
      showToast(error.message, '❌');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowCompositions(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Escolha a Composição</h2>
          <button className="modal-close" onClick={() => setShowCompositions(false)}>×</button>
        </div>
        <div className="modal-body">
          {compositions.length === 0 ? (
            <p className="no-compositions">Nenhuma composição salva ainda.</p>
          ) : (
            <div className="compositions-list">
              {compositions.map(comp => (
                <div key={comp.id} className="composition-item">
                  <div className="composition-item-info" onClick={() => loadComposition(comp)}>
                    <h3>{comp.name}</h3>
                    <p className="comp-map-name">🗺️ {comp.map}</p>
                    <div className="comp-agents-preview">
                      {comp.agents?.map((agent, i) => (
                        <span key={i} className="comp-agent-tag">
                          <img src={getAgentImage(agent)} alt={agent} className="comp-agent-mini-img" />
                          {agent}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="btn-delete-comp"
                    onClick={() => deleteComposition(comp.id, comp.name)}
                    title="Deletar composição"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;