import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';

const supabase = createClient(
  'https://dtxdszglxxnhjrxonsng.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eGRzemdseHhuaGpyeG9uc25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzc2OTAsImV4cCI6MjA5MjcxMzY5MH0.bXPKPmj4eYq6vkbmBtRK00tbsW3fFLwvOTnqSCOS8OQ'
);

const AppContext = createContext();
const useAppContext = () => useContext(AppContext);

const ROLE_ICONS = {
  duelista: 'https://static.wikia.nocookie.net/valorant/images/f/fd/DuelistClassSymbol.png/revision/latest/scale-to-width-down/25?cb=20200408043920',
  iniciador: 'https://static.wikia.nocookie.net/valorant/images/7/77/InitiatorClassSymbol.png/revision/latest/scale-to-width-down/25?cb=20200408043926',
  controlador: 'https://static.wikia.nocookie.net/valorant/images/0/04/ControllerClassSymbol.png/revision/latest/scale-to-width-down/25?cb=20200408043911',
  sentinela: 'https://static.wikia.nocookie.net/valorant/images/4/43/SentinelClassSymbol.png/revision/latest/scale-to-width-down/25?cb=20200408043934'
};

const MAPS = [
  { id: 'ascent', name: 'Ascent', image: 'https://static.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png/revision/latest/scale-to-width-down/190?cb=20200607180020' },
  { id: 'bind', name: 'Bind', image: 'https://static.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Bind.png/revision/latest/scale-to-width-down/190?cb=20200620202316' },
  { id: 'haven', name: 'Haven', image: 'https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png/revision/latest/scale-to-width-down/190?cb=20200620202335' },
  { id: 'split', name: 'Split', image: 'https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png/revision/latest/scale-to-width-down/190?cb=20230411161807' },
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

const getAgentImage = (n) => { for (const r of Object.values(AGENTS)) { const a = r.find(x => x.name === n); if (a) return a.image; } return null; };
const getMapImage = (n) => { const m = MAPS.find(x => x.name === n); return m ? m.image : null; };

function App() {
  const [session, setSession] = useState(null);
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [playerNames, setPlayerNames] = useState({});
  const [savedCompositions, setSavedCompositions] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('comps');
  const [toast, setToast] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobileMaps, setShowMobileMaps] = useState(false);
  const downloadRef = useRef(null);

  useEffect(() => { const h = () => setIsMobile(window.innerWidth <= 768); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);
  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => setSession(session)); const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s)); return () => subscription.unsubscribe(); }, []);

  const fetchComps = async () => { if (!session) return; const { data } = await supabase.from('compositions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }); if (data) setSavedCompositions(data); };
  const fetchPlayers = async () => { if (!session) return; const { data } = await supabase.from('team_players').select('*').eq('user_id', session.user.id).order('created_at', { ascending: true }); if (data) setTeamPlayers(data); };
  const fetchMatches = async () => { if (!session) return; const { data } = await supabase.from('match_history').select('*').eq('user_id', session.user.id).order('match_date', { ascending: false }); if (data) setMatches(data); };
  useEffect(() => { if (session) { fetchComps(); fetchPlayers(); fetchMatches(); } }, [session]);

  const toastMsg = (m, i = '✅') => { setToast({ message: m, icon: i }); setTimeout(() => setToast(null), 3000); };
  const mapCompCount = (n) => savedCompositions.filter(c => c.map === n).length;

  return (
    <AppContext.Provider value={{ supabase, session, toastMsg, fetchComps, fetchPlayers, fetchMatches, savedCompositions, teamPlayers, setTeamPlayers, matches, isMobile, setShowMobileMaps }}>
      <div className="app">
        {toast && <div className="toast show"><span className="toast-icon">{toast.icon}</span><span className="toast-message">{toast.message}</span></div>}
        {!session ? <AuthScreen /> : (
          <>
            <Header />
            {isMobile && <button className="mobile-map-btn" onClick={() => setShowMobileMaps(true)}>🗺️ {selectedMap ? selectedMap.name : 'Escolher Mapa'}</button>}
            {isMobile && showMobileMaps && <MobileMapsPopup selectedMap={selectedMap} setSelectedMap={setSelectedMap} setShowMobileMaps={setShowMobileMaps} mapCompCount={mapCompCount} setSelectedAgents={setSelectedAgents} setPlayerNames={setPlayerNames} />}
            <div className="main-layout">
              {!isMobile && <MapsSidebar selectedMap={selectedMap} setSelectedMap={setSelectedMap} mapCompCount={mapCompCount} setSelectedAgents={setSelectedAgents} setPlayerNames={setPlayerNames} />}
              <div className="content-area">
                <SelectedAgentsBar selectedMap={selectedMap} selectedAgents={selectedAgents} setSelectedAgents={setSelectedAgents} playerNames={playerNames} setPlayerNames={setPlayerNames} downloadRef={downloadRef} teamPlayers={teamPlayers} />
                {activeTab === 'comps' && <AgentsSection selectedAgents={selectedAgents} setSelectedAgents={setSelectedAgents} />}
                {activeTab === 'players' && <PlayerManagerPanel />}
                {activeTab === 'matches' && <MatchesPanel />}
                {activeTab === 'compsModal' && <CompositionsModal compositions={savedCompositions} setSelectedAgents={setSelectedAgents} setSelectedMap={setSelectedMap} setShowCompositions={() => setActiveTab('comps')} fetchCompositions={fetchComps} setPlayerNames={setPlayerNames} MAPS={MAPS} />}
                {activeTab === 'playersModal' && <PlayerManagerModal setShowPlayerManager={() => setActiveTab('comps')} />}
              </div>
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} savedCompositions={savedCompositions} setSelectedAgents={setSelectedAgents} setSelectedMap={setSelectedMap} setPlayerNames={setPlayerNames} MAPS={MAPS} fetchComps={fetchComps} teamPlayers={teamPlayers} isMobile={isMobile} />
          </>
        )}
        <div ref={downloadRef} className="download-composition"></div>
      </div>
    </AppContext.Provider>
  );
}

function AuthScreen() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [isSignUp, setIsSignUp] = useState(false); const [loading, setLoading] = useState(false);
  const { supabase, toastMsg } = useAppContext();
  const handle = async (e) => { e.preventDefault(); setLoading(true); try { if (isSignUp) { await supabase.auth.signUp({ email, password }); toastMsg('Conta criada!', '📧'); } else { await supabase.auth.signInWithPassword({ email, password }); toastMsg('Login!', '✅'); } } catch (err) { toastMsg(err.message, '❌'); } finally { setLoading(false); } };
  return (<div className="auth-screen"><div className="auth-box"><div className="logo-container"><div className="logo-icon">V</div><h1>Agent <span>Composition</span></h1></div><h2>{isSignUp ? 'CRIAR CONTA' : 'ENTRAR'}</h2><form onSubmit={handle}><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} /><input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} disabled={loading} /><button type="submit" className="btn-auth" disabled={loading}>{loading ? '...' : isSignUp ? 'CRIAR CONTA' : 'ENTRAR'}</button></form><button onClick={() => setIsSignUp(!isSignUp)} className="toggle-link">{isSignUp ? 'Já tem conta?' : 'Cadastre-se'}</button></div></div>);
}

function Header() {
  const { supabase, toastMsg } = useAppContext();
  return (<header className="header"><div className="header-content"><div className="logo"><div className="logo-icon">V</div><h1>Agent <span>Composition</span></h1></div><button onClick={async () => { await supabase.auth.signOut(); toastMsg('Logout!', '👋'); }} className="btn-logout">SAIR</button></div></header>);
}

function MapsSidebar({ selectedMap, setSelectedMap, mapCompCount, setSelectedAgents, setPlayerNames }) {
  return (
    <aside className="maps-sidebar">
      <h3 className="sidebar-title">MAPAS</h3>
      <div className="sidebar-maps-list">
        {MAPS.map(map => { const cnt = mapCompCount(map.name); return (<div key={map.id} className={`sidebar-map-card ${selectedMap?.name === map.name ? 'active' : ''} ${cnt > 0 ? 'has-comps' : ''}`} onClick={() => { if (selectedMap?.name === map.name) { setSelectedMap(null); setSelectedAgents([]); setPlayerNames({}); } else { setSelectedMap(map); setSelectedAgents([]); setPlayerNames({}); } }}><img className="sidebar-map-image" src={map.image} alt={map.name} /><div className="sidebar-map-info"><span className="sidebar-map-name">{map.name}</span>{cnt > 0 && <span className="map-comp-badge">{cnt}</span>}</div>{cnt > 0 && <span className="map-comp-indicator"></span>}</div>); })}
      </div>
    </aside>
  );
}

function MobileMapsPopup({ selectedMap, setSelectedMap, setShowMobileMaps, mapCompCount, setSelectedAgents, setPlayerNames }) {
  return (<div className="mobile-maps-overlay" onClick={() => setShowMobileMaps(false)}><div className="mobile-maps-popup" onClick={e => e.stopPropagation()}><div className="mobile-maps-header"><h3>Escolher Mapa</h3><button onClick={() => setShowMobileMaps(false)}>×</button></div><div className="mobile-maps-grid">{MAPS.map(map => { const cnt = mapCompCount(map.name); return (<div key={map.id} className={`mobile-map-card ${selectedMap?.name === map.name ? 'active' : ''}`} onClick={() => { if (selectedMap?.name === map.name) { setSelectedMap(null); setSelectedAgents([]); setPlayerNames({}); } else { setSelectedMap(map); setSelectedAgents([]); setPlayerNames({}); } setShowMobileMaps(false); }}><img src={map.image} alt={map.name} /><span>{map.name}</span>{cnt > 0 && <span className="mobile-map-badge">{cnt}</span>}</div>); })}</div></div></div>);
}

function BottomNav({ activeTab, setActiveTab, savedCompositions, setSelectedAgents, setSelectedMap, setPlayerNames, MAPS, fetchComps, teamPlayers, isMobile }) {
  return (
    <nav className={`bottom-nav ${isMobile ? 'mobile' : 'desktop'}`}>
      <button className={`nav-btn ${activeTab === 'comps' ? 'active' : ''}`} onClick={() => setActiveTab('comps')}>🎯 Agentes</button>
      <button className="nav-btn" onClick={() => setActiveTab('compsModal')}>📂 Composições</button>
      <button className={`nav-btn ${activeTab === 'players' || activeTab === 'playersModal' ? 'active' : ''}`} onClick={() => setActiveTab('players')}>👥 Jogadores</button>
      <button className={`nav-btn ${activeTab === 'matches' ? 'active' : ''}`} onClick={() => setActiveTab('matches')}>📊 Partidas</button>
    </nav>
  );
}

function SelectedAgentsBar({ selectedMap, selectedAgents, setSelectedAgents, playerNames, setPlayerNames, downloadRef, teamPlayers }) {
  const { supabase, session, toastMsg, fetchComps } = useAppContext();
  const [showPp, setShowPp] = useState(false); const [slot, setSlot] = useState(null);
  const tp = teamPlayers || [];
  const save = async () => { if (!selectedMap) { toastMsg('Selecione um mapa!', '🗺️'); return; } if (selectedAgents.length !== 5) { toastMsg('5 agentes!', '⚠️'); return; } const n = prompt('Nome:'); if (!n) return; try { await supabase.from('compositions').insert([{ user_id: session.user.id, name: n, map: selectedMap.name, agents: selectedAgents, player_names: playerNames, tags: [], strategy: '' }]); fetchComps(); toastMsg('Salvo! 💾'); } catch (e) { toastMsg(e.message, '❌'); } };
  const download = async () => { if (!selectedMap || !selectedAgents.length) { toastMsg('Mapa e agentes!', '⚠️'); return; } const mi = getMapImage(selectedMap.name); const el = downloadRef.current; el.innerHTML = `<div style="background:#0f1923;padding:30px;width:750px;font-family:Oswald,sans-serif;color:#ece8e1;"><div style="display:flex;align-items:center;gap:15px;margin-bottom:20px;border-bottom:2px solid #ff4655;padding-bottom:15px;"><div style="width:50px;height:50px;background:#ff4655;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:white;">V</div><h1 style="margin:0;font-size:24px;letter-spacing:2px;text-transform:uppercase;">Agent <span style="color:#ff4655;">Composition</span></h1></div><div style="margin-bottom:20px;"><h2 style="color:#768079;font-size:14px;text-transform:uppercase;letter-spacing:3px;margin-bottom:10px;">Mapa</h2><div style="display:flex;align-items:center;gap:15px;">${mi?`<img src="${mi}" style="width:200px;height:112px;border-radius:8px;object-fit:cover;border:2px solid #ff4655;" crossorigin="anonymous"/>`:''}<p style="font-size:22px;font-weight:700;text-transform:uppercase;margin:0;">${selectedMap.name}</p></div></div><div><h2 style="color:#768079;font-size:14px;text-transform:uppercase;letter-spacing:3px;margin-bottom:15px;">Agentes</h2><div style="display:flex;gap:20px;justify-content:center;">${selectedAgents.map(a=>`<div style="text-align:center;width:100px;"><img src="${getAgentImage(a)}" style="width:70px;height:70px;border-radius:50%;border:3px solid #ff4655;padding:4px;background:#1f2731;display:block;margin:0 auto;" crossorigin="anonymous"/><p style="margin:8px 0 3px;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">${a}</p>${playerNames[a]?`<p style="margin:0;font-size:11px;color:#ff6b77;">${playerNames[a]}</p>`:''}</div>`).join('')}</div></div></div>`; const imgs = el.querySelectorAll('img'); await Promise.all(Array.from(imgs).map(i=>new Promise(r=>{if(i.complete)r();else{i.onload=r;i.onerror=r;}}))); const c = await html2canvas(el,{backgroundColor:'#0f1923',useCORS:true,allowTaint:true,scale:2}); const l=document.createElement('a');l.download=`composition-${selectedMap.name.toLowerCase()}.png`;l.href=c.toDataURL('image/png');l.click();toastMsg('Baixado! 📄'); };
  const clear = () => { setSelectedAgents([]); setPlayerNames({}); toastMsg('Limpo! 🗑️'); };
  const assign = (p) => { if(slot){setPlayerNames({...playerNames,[slot]:p});setShowPp(false);setSlot(null);toastMsg(`${p} → ${slot} ✅`);} };
  const rem = (a) => { const n={...playerNames};delete n[a];setPlayerNames(n); };

  return (
    <div className="selected-agents-bar">
      <div className="selected-agents-slots">
        {[0,1,2,3,4].map(i=>(<div key={i} className={`selected-agent-slot ${selectedAgents[i]?'filled':''}`}>{selectedAgents[i]?(<><img className="selected-agent-img" src={getAgentImage(selectedAgents[i])} alt="" onError={e=>{e.target.src=`https://via.placeholder.com/50/1f2731/768079?text=${selectedAgents[i][0]}`;}}/><span className="selected-agent-name">{selectedAgents[i]}</span>{playerNames[selectedAgents[i]]?(<div className="player-assigned"><span className="player-assigned-name">{playerNames[selectedAgents[i]]}</span><span className="player-remove-btn" onClick={e=>{e.stopPropagation();rem(selectedAgents[i]);}}>×</span></div>):(<button className="btn-assign-player-slot" onClick={e=>{e.stopPropagation();setSlot(selectedAgents[i]);setShowPp(true);}}>+ Jogador</button>)}<span className="slot-remove-btn" onClick={e=>{e.stopPropagation();const a=[...selectedAgents];a.splice(i,1);setSelectedAgents(a);}}>×</span></>):<span className="slot-placeholder">+</span>}</div>))}
      </div>
      <div className="selected-agents-info"><div className="agent-count"><span>{selectedAgents.length}</span>/5</div><div className="selected-agents-actions"><button className="btn btn-primary" onClick={save}>💾 Salvar</button><button className="btn btn-download" onClick={download}>📥 Baixar</button><button className="btn btn-danger" onClick={clear}>🗑️ Limpar</button></div></div>
      {showPp && <PlayerSelectPopup teamPlayers={tp} assign={assign} close={()=>setShowPp(false)} slot={slot} />}
    </div>
  );
}

function PlayerSelectPopup({ teamPlayers, assign, close, slot }) {
  const [name, setName] = useState(''); const { supabase, session, fetchPlayers, toastMsg } = useAppContext();
  const tp = teamPlayers || [];
  const add = async () => { if(!name.trim()){toastMsg('Nome!','⚠️');return;} try{await supabase.from('team_players').insert([{user_id:session.user.id,nickname:name.trim(),riot_id:''}]);assign(name.trim());fetchPlayers();}catch(e){toastMsg(e.message,'❌');} };
  return (<div className="player-popup-overlay" onClick={close}><div className="player-popup" onClick={e=>e.stopPropagation()}><div className="player-popup-header"><h3>Jogador para {slot}</h3><button className="modal-close" onClick={close}>×</button></div><div className="player-popup-body"><div className="add-player-inline"><input type="text" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} onKeyPress={e=>e.key==='Enter'&&add()} autoFocus/><button className="btn btn-primary btn-sm" onClick={add}>Adicionar</button></div>{tp.length>0&&<div className="existing-players"><h4>Cadastrados</h4><div className="player-select-list">{tp.map(p=>(<div key={p.id} className="player-select-item" onClick={()=>assign(p.nickname)}><div className="player-avatar-small">{p.nickname.charAt(0).toUpperCase()}</div><span>{p.nickname}</span><span className="select-arrow">→</span></div>))}</div></div>}</div></div></div>);
}

function AgentsSection({ selectedAgents, setSelectedAgents }) {
  const clk = (n) => { if(selectedAgents.includes(n)) setSelectedAgents(selectedAgents.filter(a=>a!==n)); else if(selectedAgents.length<5) setSelectedAgents([...selectedAgents,n]); };
  return (<section className="agents-section"><h2 className="section-title">Selecione os Agentes</h2><div className="roles-grid-icons">{Object.entries(AGENTS).map(([role,agents])=>(<div key={role} className="role-column-icons"><div className="role-header-icons"><img className="role-icon-img" src={ROLE_ICONS[role]} alt=""/><h3 className="role-title">{role.charAt(0).toUpperCase()+role.slice(1)}</h3></div><div className="agents-icons-grid">{agents.map(a=>(<div key={a.id} className={`agent-icon-card ${selectedAgents.includes(a.name)?'selected':''}`} onClick={()=>clk(a.name)} title={a.name}><img className="agent-icon-img" src={a.image} alt=""/>{selectedAgents.includes(a.name)&&<span className="agent-icon-check">✓</span>}</div>))}</div></div>))}</div></section>);
}

function PlayerManagerPanel() {
  const { supabase, session, teamPlayers, fetchPlayers, toastMsg } = useAppContext(); const [nick, setNick] = useState(''); const [riotId, setRiotId] = useState(''); const [editingId, setEditingId] = useState(null); const [editNick, setEditNick] = useState(''); const [editRiotId, setEditRiotId] = useState('');
  const tp = teamPlayers || [];
  const add = async () => { if(!nick.trim()){toastMsg('Nick!','⚠️');return;} const fullNick = riotId.trim() ? `${nick.trim()}#${riotId.trim()}` : nick.trim(); try{await supabase.from('team_players').insert([{user_id:session.user.id,nickname:fullNick,riot_id:riotId.trim()||''}]);toastMsg('Adicionado! 👥');setNick('');setRiotId('');fetchPlayers();}catch(e){toastMsg(e.message,'❌');} };
  const del = async (id,nm) => { if(!window.confirm(`Remover "${nm}"?`))return; try{await supabase.from('team_players').delete().eq('id',id);toastMsg('Removido!');fetchPlayers();}catch(e){toastMsg(e.message,'❌');} };
  const startEdit = (p) => { setEditingId(p.id); const parts = p.nickname.split('#'); setEditNick(parts[0]||''); setEditRiotId(parts[1]||p.riot_id||''); };
  const saveEdit = async () => { if(!editNick.trim()){toastMsg('Nick!','⚠️');return;} const fullNick = editRiotId.trim() ? `${editNick.trim()}#${editRiotId.trim()}` : editNick.trim(); try{await supabase.from('team_players').update({nickname:fullNick,riot_id:editRiotId.trim()||''}).eq('id',editingId);toastMsg('Atualizado! ✏️');setEditingId(null);fetchPlayers();}catch(e){toastMsg(e.message,'❌');} };
  return (
    <div className="panel-container"><div className="panel-header"><h2>👥 Gerenciar Jogadores</h2></div>
      <div className="add-player-form"><input type="text" placeholder="Nick" value={nick} onChange={e=>setNick(e.target.value)} onKeyPress={e=>e.key==='Enter'&&add()}/><input type="text" placeholder="TAG" value={riotId} onChange={e=>setRiotId(e.target.value)} onKeyPress={e=>e.key==='Enter'&&add()} style={{maxWidth:'100px'}}/><button className="btn btn-primary" onClick={add}>Enviar</button></div>
      <div className="players-grid">{tp.length===0?<p className="no-data">Nenhum jogador.</p>:tp.map(p=>(editingId===p.id?(<div key={p.id} className="player-card editing"><input type="text" value={editNick} onChange={e=>setEditNick(e.target.value)} className="edit-input"/><input type="text" value={editRiotId} onChange={e=>setEditRiotId(e.target.value)} placeholder="TAG" className="edit-input-tag"/><button className="btn btn-primary btn-sm" onClick={saveEdit}>💾</button><button className="btn btn-secondary btn-sm" onClick={()=>setEditingId(null)}>×</button></div>):(<div key={p.id} className="player-card"><div className="player-avatar">{p.nickname.charAt(0).toUpperCase()}</div><span className="player-nickname">{p.nickname}</span><button className="btn-edit-player" onClick={()=>startEdit(p)}>✏️</button><button className="btn-remove-player" onClick={()=>del(p.id,p.nickname)}>×</button></div>)))}</div></div>
  );
}

function PlayerManagerModal({ setShowPlayerManager }) {
  const { supabase, session, teamPlayers, fetchPlayers, toastMsg } = useAppContext(); const [nick, setNick] = useState(''); const [riotId, setRiotId] = useState('');
  const tp = teamPlayers || [];
  const add = async () => { if(!nick.trim()){toastMsg('Nick!','⚠️');return;} const fullNick = riotId.trim() ? `${nick.trim()}#${riotId.trim()}` : nick.trim(); try{await supabase.from('team_players').insert([{user_id:session.user.id,nickname:fullNick,riot_id:riotId.trim()||''}]);toastMsg('Adicionado! 👥');setNick('');setRiotId('');fetchPlayers();}catch(e){toastMsg(e.message,'❌');} };
  const del = async (id,nm) => { if(!window.confirm(`Remover "${nm}"?`))return; try{await supabase.from('team_players').delete().eq('id',id);toastMsg('Removido!');fetchPlayers();}catch(e){toastMsg(e.message,'❌');} };
  return (<div className="modal-overlay" onClick={()=>setShowPlayerManager(false)}><div className="modal-content" onClick={e=>e.stopPropagation()}><div className="modal-header"><h2>Gerenciar Jogadores</h2><button className="modal-close" onClick={()=>setShowPlayerManager(false)}>×</button></div><div className="modal-body"><div className="add-player-form"><input type="text" placeholder="Nick" value={nick} onChange={e=>setNick(e.target.value)}/><input type="text" placeholder="TAG" value={riotId} onChange={e=>setRiotId(e.target.value)} style={{maxWidth:'100px'}}/><button className="btn btn-primary btn-sm" onClick={add}>Enviar</button></div><div className="players-grid">{tp.length===0?<p className="no-data">Nenhum.</p>:tp.map(p=>(<div key={p.id} className="player-card"><div className="player-avatar">{p.nickname.charAt(0).toUpperCase()}</div><span className="player-nickname">{p.nickname}</span><button className="btn-remove-player" onClick={()=>del(p.id,p.nickname)}>×</button></div>))}</div></div></div></div>);
}

function MatchesPanel() {
  const { supabase, session, matches, fetchMatches, savedCompositions, toastMsg } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [form, setForm] = useState({
    composition_id: '',
    result: 'win',
    our_score: '',
    their_score: '',
    map_name: '',
    match_date: new Date().toISOString().split('T')[0],
    player_kdas: {}
  });

  const comps = savedCompositions || [];
  const mts = matches || [];
  const sel = comps.find(c => c.id === parseInt(form.composition_id));

  useEffect(() => { fetchMatches(); }, []);

  const reset = () => {
    setForm({ composition_id: '', result: 'win', our_score: '', their_score: '', map_name: '', match_date: new Date().toISOString().split('T')[0], player_kdas: {} });
    setEditingId(null);
    setShowForm(false);
  };

  const edit = (m) => {
    setEditingId(m.id);
    setForm({
      composition_id: m.composition_id ? String(m.composition_id) : '',
      result: m.result,
      our_score: String(m.our_score || ''),
      their_score: String(m.their_score || ''),
      map_name: m.map_name || '',
      match_date: m.match_date || '',
      player_kdas: m.player_kdas || {}
    });
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.map_name.trim()) { toastMsg('Preencha o mapa!', '⚠️'); return; }
    const data = {
      composition_id: form.composition_id ? parseInt(form.composition_id) : null,
      result: form.result,
      map_name: form.map_name,
      our_score: parseInt(form.our_score) || 0,
      their_score: parseInt(form.their_score) || 0,
      match_date: form.match_date,
      player_kdas: form.player_kdas
    };
    try {
      if (editingId) {
        await supabase.from('match_history').update(data).eq('id', editingId);
        toastMsg('Atualizada! ✏️');
      } else {
        await supabase.from('match_history').insert([{ ...data, user_id: session.user.id, notes: '' }]);
        toastMsg('Salva! 📊');
      }
      reset();
      fetchMatches();
    } catch (err) { toastMsg(err.message, '❌'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Deletar?')) return;
    try { await supabase.from('match_history').delete().eq('id', id); toastMsg('Deletada!'); fetchMatches(); }
    catch (e) { toastMsg(e.message, '❌'); }
  };

  const setKda = (name, field, val) => {
    setForm(f => ({
      ...f,
      player_kdas: {
        ...f.player_kdas,
        [name]: { ...(f.player_kdas[name] || { kills: '', deaths: '', assists: '' }), [field]: val }
      }
    }));
  };

  const matchView = viewingId ? mts.find(m => m.id === viewingId) : null;
  const viewComp = matchView ? comps.find(c => c.id === matchView.composition_id) : null;

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>📊 Partidas</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { reset(); setShowForm(!showForm); }}>
          {showForm ? 'Cancelar' : '+ Nova Partida'}
        </button>
      </div>

      {showForm && (
        <form className="match-form" onSubmit={save}>
          <h4 style={{ marginBottom: '0.6rem', fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-red)', fontSize: '0.85rem' }}>
            {editingId ? '✏️ Editar' : '🆕 Nova Partida'}
          </h4>
          <div className="form-row">
            <div className="form-group">
              <label>Composição</label>
              <select value={form.composition_id} onChange={e => {
                setForm({ ...form, composition_id: e.target.value });
                const c = comps.find(x => x.id === parseInt(e.target.value));
                if (c) setForm(p => ({ ...p, map_name: c.map }));
              }}>
                <option value="">Selecione</option>
                {comps.map(c => <option key={c.id} value={c.id}>{c.name} ({c.map})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Mapa</label>
              <input type="text" value={form.map_name} onChange={e => setForm({ ...form, map_name: e.target.value })} required placeholder="Ex: Ascent" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Resultado</label>
              <select value={form.result} onChange={e => setForm({ ...form, result: e.target.value })}>
                <option value="win">✅ Vitória</option>
                <option value="loss">❌ Derrota</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nosso Placar</label>
              <input type="number" value={form.our_score} onChange={e => setForm({ ...form, our_score: e.target.value })} placeholder="13" />
            </div>
            <div className="form-group">
              <label>Placar Deles</label>
              <input type="number" value={form.their_score} onChange={e => setForm({ ...form, their_score: e.target.value })} placeholder="8" />
            </div>
            <div className="form-group">
              <label>Data</label>
              <input type="date" value={form.match_date} onChange={e => setForm({ ...form, match_date: e.target.value })} required />
            </div>
          </div>

          {sel && (
            <div className="kda-section">
              <h4>KDA dos Jogadores</h4>
              <div className="kda-grid">
                {sel.agents.map((agent, i) => {
                  const name = sel.player_names?.[agent] || `Player ${i + 1}`;
                  const k = form.player_kdas[name] || { kills: '', deaths: '', assists: '' };
                  return (
                    <div key={i} className="kda-row">
                      <span className="kda-player">
                        <img src={getAgentImage(agent)} alt="" className="kda-agent-img" /> {name} ({agent})
                      </span>
                      <div className="kda-inputs">
                        <input type="number" placeholder="K" value={k.kills} onChange={e => setKda(name, 'kills', e.target.value)} className="kda-input" />
                        <span>/</span>
                        <input type="number" placeholder="D" value={k.deaths} onChange={e => setKda(name, 'deaths', e.target.value)} className="kda-input" />
                        <span>/</span>
                        <input type="number" placeholder="A" value={k.assists} onChange={e => setKda(name, 'assists', e.target.value)} className="kda-input" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-primary">{editingId ? '💾 Atualizar' : '💾 Salvar'}</button>
        </form>
      )}

      <div className="matches-list">
        {mts.length === 0 ? (
          <p className="no-data">Nenhuma partida.</p>
        ) : mts.map(m => {
          const c = comps.find(x => x.id === m.composition_id);
          const ke = m.player_kdas ? Object.entries(m.player_kdas) : [];
          return (
            <div key={m.id} className={`match-card ${m.result}`} onClick={() => setViewingId(m.id)}>
              <div className="match-result-icon">{m.result === 'win' ? '✅' : '❌'}</div>
              <div className="match-info">
                <div className="match-main">
                  <span>🗺️ {m.map_name}</span>
                  <span className="match-score">{m.our_score} - {m.their_score}</span>
                </div>
                <div className="match-comp-name">{c?.name || 'Comp'}</div>
                <div className="match-date">📅 {new Date(m.match_date + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
                {c && <div className="match-agents-row">{c.agents?.map((a, i) => <img key={i} src={getAgentImage(a)} alt={a} className="match-agent-thumb" title={a} />)}</div>}
                {ke.length > 0 && (
                  <div className="match-kda-preview">
                    {ke.slice(0, 3).map(([n, kd], i) => (
                      <span key={i} className="kda-mini">{n}: {kd.kills || 0}/{kd.deaths || 0}/{kd.assists || 0}</span>
                    ))}
                    {ke.length > 3 && <span className="kda-mini">+{ke.length - 3}</span>}
                  </div>
                )}
              </div>
              <div className="match-actions" onClick={e => e.stopPropagation()}>
                <button className="match-action-btn edit" onClick={() => { setViewingId(null); edit(m); }}>✏️</button>
                <button className="match-action-btn delete" onClick={() => remove(m.id)}>🗑️</button>
              </div>
            </div>
          );
        })}
      </div>

      {viewingId && matchView && (
        <div className="modal-overlay" onClick={() => setViewingId(null)} style={{ zIndex: 250 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>{matchView.result === 'win' ? '✅ Vitória' : '❌ Derrota'}</h2>
              <button className="modal-close" onClick={() => setViewingId(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row"><span className="detail-label">Mapa</span><span className="detail-value">🗺️ {matchView.map_name}</span></div>
              <div className="detail-row"><span className="detail-label">Placar</span><span className="detail-value">{matchView.our_score} - {matchView.their_score}</span></div>
              <div className="detail-row"><span className="detail-label">Data</span><span className="detail-value">📅 {new Date(matchView.match_date + 'T00:00:00').toLocaleDateString('pt-BR')}</span></div>
              <div className="detail-row"><span className="detail-label">Composição</span><span className="detail-value">{viewComp?.name || 'N/A'}</span></div>
              {viewComp && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.8rem', fontSize: '0.85rem' }}>Agentes e KDA</h4>
                  <div className="detail-agents">
                    {viewComp.agents.map((agent, i) => {
                      const name = viewComp.player_names?.[agent] || `P${i + 1}`;
                      const kda = matchView.player_kdas?.[name] || {};
                      return (
                        <div key={i} className="detail-agent-card">
                          <img src={getAgentImage(agent)} alt={agent} />
                          <div className="detail-agent-name">{agent}</div>
                          <div className="detail-agent-player">{name}</div>
                          <div className="detail-agent-kda">{kda.kills || 0}/{kda.deaths || 0}/{kda.assists || 0}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => { setViewingId(null); edit(matchView); }}>✏️ Editar</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setViewingId(null)}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompositionsModal({ compositions, setSelectedAgents, setSelectedMap, setShowCompositions, fetchCompositions, setPlayerNames, MAPS }) {
  const { supabase, toastMsg } = useAppContext();
  const comps = compositions || [];
  const load = (c) => { setSelectedAgents(c.agents); setPlayerNames(c.player_names||{}); const m = MAPS.find(x=>x.name===c.map); setSelectedMap(m||{name:c.map}); setShowCompositions(false); toastMsg(`"${c.name}" carregada! 📂`); };
  const del = async (id,nm) => { if(!window.confirm(`Deletar "${nm}"?`))return; try{await supabase.from('compositions').delete().eq('id',id);toastMsg('Deletada! 🗑️');fetchCompositions();}catch(e){toastMsg(e.message,'❌');} };
  return (<div className="modal-overlay" onClick={()=>setShowCompositions(false)}><div className="modal-content" onClick={e=>e.stopPropagation()}><div className="modal-header"><h2>Escolha a Composição</h2><button className="modal-close" onClick={()=>setShowCompositions(false)}>×</button></div><div className="modal-body">{comps.length===0?<p className="no-compositions">Nenhuma.</p>:<div className="compositions-list">{comps.map(c=>(<div key={c.id} className="composition-item"><div className="composition-item-info" onClick={()=>load(c)}><h3>{c.name}</h3><p className="comp-map-name">🗺️ {c.map}</p><div className="comp-agents-preview">{(c.agents||[]).map((a,i)=>(<span key={i} className="comp-agent-tag"><img src={getAgentImage(a)} alt="" className="comp-agent-mini-img"/>{a}{c.player_names?.[a]&&<span className="comp-player-name">({c.player_names[a]})</span>}</span>))}</div></div><button className="btn-delete-comp" onClick={()=>del(c.id,c.name)}>🗑️</button></div>))}</div>}</div></div></div>);
}

export default App;