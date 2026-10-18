import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'courses', label: 'Courses', icon: '🛒' },
  { id: 'resto', label: 'Resto/Bar', icon: '🍽️' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'logement', label: 'Logement', icon: '🏠' },
  { id: 'loisirs', label: 'Loisirs', icon: '🎟️' },
  { id: 'autre', label: 'Autre', icon: '📦' }
];

const CURRENCIES = [
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
  { code: 'GBP', symbol: '£' },
  { code: 'CHF', symbol: 'CHF' }
];

export default function App() {
  const [groupCode, setGroupCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [currentGroup, setCurrentGroup] = useState(null);
  
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('Moi');
  const [category, setCategory] = useState('courses');
  const [currency, setCurrency] = useState('€');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Générer un code unique à 19 chiffres
  const generateGroupCode = () => {
    return Math.floor(1000000000000000000 + Math.random() * 9000000000000000000).toString();
  };

  // Charger le groupe enregistré au démarrage
  useEffect(() => {
    const savedGroup = localStorage.getItem('partago_current_group');
    if (savedGroup) {
      setCurrentGroup(savedGroup);
      setGroupCode(savedGroup);
      const localSaved = localStorage.getItem(`partago_group_${savedGroup}`);
      if (localSaved) {
        try { setExpenses(JSON.parse(localSaved)); } catch (e) {}
      }
    }
  }, []);

  const handleCreateGroup = () => {
    const newCode = generateGroupCode();
    setCurrentGroup(newCode);
    setGroupCode(newCode);
    localStorage.setItem('partago_current_group', newCode);
    setExpenses([]);
  };

  const handleJoinGroup = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const cleanCode = inputCode.trim();
    setCurrentGroup(cleanCode);
    setGroupCode(cleanCode);
    localStorage.setItem('partago_current_group', cleanCode);
    const localSaved = localStorage.getItem(`partago_group_${cleanCode}`);
    if (localSaved) {
      try { setExpenses(JSON.parse(localSaved)); } catch (e) {}
    } else {
      setExpenses([]);
    }
    setInputCode('');
  };

  const handleLeaveGroup = () => {
    setCurrentGroup(null);
    setGroupCode('');
    localStorage.removeItem('partago_current_group');
    setExpenses([]);
  };

  const saveExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    localStorage.setItem(`partago_group_${currentGroup}`, JSON.stringify(newExpenses));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!title || !amount || parseFloat(amount) <= 0 || !currentGroup) return;

    const selectedCat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];

    const newExpense = {
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount),
      paidBy: paidBy.trim() || 'Moi',
      category: selectedCat,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    };

    const updated = [newExpense, ...expenses];
    saveExpenses(updated);
    setTitle('');
    setAmount('');
  };

  const handleDelete = (id) => {
    const updated = expenses.filter(exp => exp.id !== id);
    saveExpenses(updated);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(currentGroup);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `Rejoins mon groupe de dépenses Partago avec le code : ${currentGroup}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Calculs
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const balances = expenses.reduce((acc, exp) => {
    acc[exp.paidBy] = (acc[exp.paidBy] || 0) + exp.amount;
    return acc;
  }, {});

  const participants = Object.keys(balances);
  const fairShare = participants.length > 0 ? totalExpenses / participants.length : 0;

  // URL QR Code instantané (via API externe simple)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentGroup || '')}`;

  // ÉCRAN 1 : ACCUEIL
  if (!currentGroup) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6 text-center">
          <div className="inline-block bg-emerald-100 text-emerald-800 p-4 rounded-2xl text-2xl font-black mb-2">
            P
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Bienvenue sur Partago</h1>
          <p className="text-sm text-slate-500">
            Gérez et synchronisez vos dépenses à plusieurs en toute simplicité.
          </p>

          <div className="space-y-4 pt-4">
            <button
              onClick={handleCreateGroup}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-sm"
            >
              ✨ Créer un nouveau groupe
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase font-semibold">ou rejoindre</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleJoinGroup} className="space-y-3">
              <input
                type="text"
                placeholder="Entrer le code à 19 chiffres"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm text-center font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                required
              />
              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-sm"
              >
                🔗 Rejoindre le groupe
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ÉCRAN 2 : GROUPE
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-10">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <span className="bg-emerald-600 text-white font-extrabold px-3 py-1 rounded-xl text-lg">P</span>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-800 block">partago</span>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 font-mono">Code : {currentGroup}</span>
              <button 
                onClick={copyCode}
                className="text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 px-2 py-0.5 rounded font-semibold transition"
              >
                {copied ? '✅ Copié' : '📋 Copier'}
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleLeaveGroup}
          className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 hover:bg-red-100 transition"
        >
          Quitter
        </button>
      </header>

      <main className="flex-1 max-w-lg w-full mx-auto p-4 space-y-5">
        
        {/* Résumé, Choix de Devise & Partage */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Groupe Sécurisé
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-2">Dépenses du groupe</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Total</span>
              <span className="text-2xl font-black text-emerald-600">{totalExpenses.toFixed(2)} {currency}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
            {/* Choix de Devise */}
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-semibold">Devise :</span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg">
                {CURRENCIES.map(c => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.symbol)}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold transition ${
                      currency === c.symbol ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    {c.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Boutons Partage */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowQR(!showQR)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl font-semibold transition"
              >
                📱 QR Code
              </button>
              <button
                onClick={shareWhatsApp}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1.5 rounded-xl font-semibold transition flex items-center space-x-1"
              >
                <span>💬 WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Modal / Affichage du QR Code */}
          {showQR && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3 pt-3">
              <p className="text-xs font-bold text-slate-700">Faites scanner ce QR Code à vos proches :</p>
              <img src={qrCodeUrl} alt="QR Code du groupe" className="mx-auto rounded-xl border border-slate-200 shadow-sm w-36 h-36" />
              <button
                onClick={() => setShowQR(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Fermer
              </button>
            </div>
          )}
        </div>

        {/* Bilan & Calcul Automatique */}
        {expenses.length > 0 && (
          <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
              ⚖️ Équilibre & Calcul Automatique
            </h3>
            <div className="text-xs space-y-1 text-emerald-100">
              <p>Part idéale par personne : <strong className="text-white">{fairShare.toFixed(2)} {currency}</strong></p>
            </div>
            <div className="border-t border-emerald-800 pt-2 space-y-1">
              {Object.entries(balances).map(([person, paid]) => {
                const diff = paid - fairShare;
                return (
                  <div key={person} className="flex justify-between text-xs">
                    <span className="font-medium text-emerald-200">{person} a payé {paid.toFixed(2)} {currency}</span>
                    <span className={diff >= 0 ? "text-emerald-300 font-bold" : "text-amber-300 font-bold"}>
                      {diff >= 0 ? `+${diff.toFixed(2)} ${currency} (Récupère)` : `${diff.toFixed(2)} ${currency} (Doit)`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Formulaire Nouvelle Dépense */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-base font-bold text-slate-800 mb-3">Nouvelle dépense</h3>
          <form onSubmit={handleAddExpense} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Intitulé</label>
              <input
                type="text"
                placeholder="Ex: Courses, Restaurant..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                required
              />
            </div>

            {/* Choix de Catégorie */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Catégorie</label>
              <div className="grid grid-cols-3 gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 border transition ${
                      category === cat.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Montant ({currency})</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Payé par</label>
                <input
                  type="text"
                  placeholder="Nom"
                  value={paidBy}
                  onChange={e => setPaidBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-sm mt-2"
            >
              + Ajouter au groupe
            </button>
          </form>
        </div>

        {/* Historique */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-base font-bold text-slate-800 mb-3">
            Historique ({expenses.length})
          </h3>
          {expenses.length === 0 ? (
            <p className="text-slate-400 text-xs text-center py-6">Aucune dépense dans ce groupe.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {expenses.map(exp => (
                <li key={exp.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl bg-slate-50 p-2 rounded-xl border border-slate-100">
                      {exp.category?.icon || '📦'}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{exp.title}</p>
                      <p className="text-[11px] text-slate-400">Payé par {exp.paidBy} • {exp.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-800 text-sm">{exp.amount.toFixed(2)} {currency}</span>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="text-red-400 hover:text-red-600 p-1 text-xs font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bouton Pourboire */}
        <div className="pt-2">
          <a
            href="https://buy.stripe.com/votre_lien_de_paiement" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition border border-slate-200 shadow-sm"
          >
            ☕ Soutenir le développeur (Laisser un pourboire)
          </a>
        </div>

      </main>
    </div>
  );
}
