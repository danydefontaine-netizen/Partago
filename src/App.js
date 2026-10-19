import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('welcome'); // 'welcome', 'calculator', 'about'
  const [groupCodeInput, setGroupCodeInput] = useState('');
  const [currentGroup, setCurrentGroup] = useState(null);

  // ÉTATS CALCULATEUR SIMPLE
  const [totalAmount, setTotalAmount] = useState('');
  const [peopleCount, setPeopleCount] = useState('2');
  const [tipPercentage, setTipPercentage] = useState('0');

  // Calculs
  const total = parseFloat(totalAmount) || 0;
  const count = parseInt(peopleCount, 10) || 1;
  const tip = parseFloat(tipPercentage) || 0;
  const totalWithTip = total + (total * (tip / 100));
  const amountPerPerson = (totalWithTip / count).toFixed(2);

  // Générateur de code à 19 chiffres
  const generate19DigitCode = () => {
    let code = '';
    for (let i = 0; i < 19; i++) {
      code += Math.floor(Math.random() * 10).toString();
      if ((i + 1) % 4 === 0 && i !== 18) code += '-';
    }
    return code;
  };

  const handleCreateGroup = () => {
    const newCode = generate19DigitCode();
    setCurrentGroup({ code: newCode, members: [], expenses: [] });
    setActiveTab('group-dashboard');
  };

  const handleJoinGroup = () => {
    if (groupCodeInput.trim().length >= 5) {
      setCurrentGroup({ code: groupCodeInput.trim(), members: [], expenses: [] });
      setActiveTab('group-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-4 font-sans">
      
      {/* En-tête / Barre de Navigation */}
      <header className="max-w-md w-full mx-auto bg-white rounded-3xl p-4 shadow-sm mb-4 border border-slate-100 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => setActiveTab('welcome')}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm">
            P
          </div>
          <span className="font-extrabold text-slate-800 tracking-tight text-lg">Partago</span>
        </div>

        <nav className="flex space-x-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('welcome')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === 'welcome' || activeTab === 'group-dashboard'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Groupe
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === 'calculator'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Calculateur
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === 'about'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Soutenir
          </button>
        </nav>
      </header>

      {/* Contenu principal */}
      <main className="max-w-md w-full mx-auto bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 flex flex-col justify-between">
        
        {/* === ÉCRAN D'ACCUEIL D'ORIGINE === */}
        {activeTab === 'welcome' && (
          <div className="flex flex-col items-center text-center my-auto space-y-6 py-4">
            
            {/* Logo Vert P */}
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 font-black flex items-center justify-center text-4xl shadow-inner">
              P
            </div>

            {/* Titre & Sous-titre */}
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Bienvenue sur Partago
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Créez un nouveau groupe sécurisé ou rejoignez un groupe existant pour synchroniser vos dépenses en temps réel.
              </p>
            </div>

            {/* Bouton Créer un groupe */}
            <div className="w-full space-y-4 pt-2">
              <button
                onClick={handleCreateGroup}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl text-sm transition shadow-lg shadow-emerald-100 flex items-center justify-center space-x-2"
              >
                <span>✨</span>
                <span>Créer un nouveau groupe</span>
              </button>

              {/* Séparateur */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  OU REJOINDRERE
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Formulaire Rejoindre */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Entrer le code du groupe"
                  value={groupCodeInput}
                  onChange={(e) => setGroupCodeInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-center text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 tracking-wide"
                />

                <button
                  onClick={handleJoinGroup}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-2xl text-xs transition flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>🔗</span>
                  <span>Rejoindre le groupe</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === ÉCRAN D'UN GROUPE ACTIF === */}
        {activeTab === 'group-dashboard' && currentGroup && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Code de votre groupe
              </span>
              <p className="text-sm font-mono font-bold text-slate-800 mt-1 select-all">
                {currentGroup.code}
              </p>
            </div>

            <div className="text-center py-6 text-slate-400 text-xs">
              Votre groupe est créé ! Vous pouvez maintenant inviter des membres et partager les dépenses.
            </div>

            <button
              onClick={() => setActiveTab('welcome')}
              className="w-full border border-slate-200 text-slate-600 font-bold py-3 rounded-2xl text-xs hover:bg-slate-50 transition"
            >
              ← Retour à l'accueil
            </button>
          </div>
        )}

        {/* === ONGLET CALCULATEUR === */}
        {activeTab === 'calculator' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Montant total de l'addition (€)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Nombre de personnes
              </label>
              <input
                type="number"
                min="1"
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Pourboire de service (%)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['0', '5', '10', '15'].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setTipPercentage(pct)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      tipPercentage === pct
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center mt-6">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-600">
                Montant par personne
              </span>
              <div className="text-4xl font-black text-emerald-700 mt-1">
                {amountPerPerson} €
              </div>
            </div>
          </div>
        )}

        {/* === ONGLET SOUTENIR / À PROPOS === */}
        {activeTab === 'about' && (
          <div className="space-y-6 text-center my-auto">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800">Vous aimez Partago ?</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Partago est une application entièrement gratuite et sans publicité. Si elle vous est utile au quotidien, vous pouvez soutenir son développement en laissant un petit pourboire !
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">☕</span>
                <div>
                  <h3 className="text-xs font-bold text-slate-700">Offrir un café au développeur</h3>
                  <p className="text-[11px] text-slate-500">Paiement 100% sécurisé via Stripe</p>
                </div>
              </div>

              <a
                href={"https://buy.stripe.com/" + "6oUdR8eKi8en2DgbYDcs800"}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-md shadow-emerald-100 mt-2"
              >
                💖 Laisser un pourboire sur Stripe
              </a>
            </div>

            <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-100">
              <p>Version 1.0.0 — Développé avec soin pour vos sorties entre amis.</p>
            </div>
          </div>
        )}

      </main>

      {/* Pied de page */}
      <footer className="max-w-md w-full mx-auto text-center mt-4 text-[11px] text-slate-400">
        © {new Date().getFullYear()} Partago — Tous droits réservés
      </footer>
    </div>
  );
}
