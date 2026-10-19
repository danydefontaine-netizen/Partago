import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator', 'group', 'about'

  // --- ÉTATS CALCULATEUR SIMPLE ---
  const [totalAmount, setTotalAmount] = useState('');
  const [peopleCount, setPeopleCount] = useState('2');
  const [tipPercentage, setTipPercentage] = useState('0');

  // Calculs simples
  const total = parseFloat(totalAmount) || 0;
  const count = parseInt(peopleCount, 10) || 1;
  const tip = parseFloat(tipPercentage) || 0;
  const totalWithTip = total + (total * (tip / 100));
  const amountPerPerson = (totalWithTip / count).toFixed(2);

  // --- ÉTATS GESTION DE GROUPE & DÉPENSES ---
  const [groupCode, setGroupCode] = useState('4829-1058-3920-5819-012'); // Code à 19 chiffres
  const [currency, setCurrency] = useState('€');
  const [members, setMembers] = useState(['Alex', 'Sam', 'Julie']);
  const [newMember, setNewMember] = useState('');
  
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Restaurant', amount: 45.0, paidBy: 'Alex', category: 'Nourriture' },
    { id: 2, title: 'Courses', amount: 30.0, paidBy: 'Sam', category: 'Courses' }
  ]);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expPaidBy, setExpPaidBy] = useState('Alex');
  const [expCategory, setExpCategory] = useState('Nourriture');

  const categories = ['Nourriture', 'Transport', 'Logement', 'Loisirs', 'Autre'];

  // Actions Groupe
  const handleAddMember = () => {
    if (newMember.trim() && !members.includes(newMember.trim())) {
      setMembers([...members, newMember.trim()]);
      setNewMember('');
    }
  };

  const handleRemoveMember = (name) => {
    setMembers(members.filter((m) => m !== name));
    setExpenses(expenses.filter((e) => e.paidBy !== name));
  };

  const handleAddExpense = () => {
    if (expTitle.trim() && expAmount) {
      const newExp = {
        id: Date.now(),
        title: expTitle.trim(),
        amount: parseFloat(expAmount),
        paidBy: expPaidBy || members[0],
        category: expCategory
      };
      setExpenses([...expenses, newExp]);
      setExpTitle('');
      setExpAmount('');
    }
  };

  // Calculs du Groupe
  const groupTotal = expenses.reduce((sum, item) => sum + item.amount, 0);
  const groupPerPerson = members.length > 0 ? (groupTotal / members.length).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between p-4 font-sans">
      {/* En-tête */}
      <header className="max-w-md w-full mx-auto bg-white rounded-3xl p-6 shadow-sm mb-4 border border-slate-200 text-center">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tight">Partago</h1>
        <p className="text-xs text-slate-500 mt-1">Gestion de dépenses collaborative</p>

        {/* Barre de navigation par onglets */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mt-4">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'calculator'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Calculateur
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'group'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Groupe
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'about'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Soutenir
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-md w-full mx-auto bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex-1 flex flex-col justify-between">
        
        {/* === ONGLET 1 : CALCULATEUR RAPIDE === */}
        {activeTab === 'calculator' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Montant total de l'addition ({currency})
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center mt-6">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
                Montant par personne
              </span>
              <div className="text-4xl font-black text-indigo-600 mt-1">
                {amountPerPerson} {currency}
              </div>
            </div>
          </div>
        )}

        {/* === ONGLET 2 : GESTION DE GROUPE COLLABORATIF === */}
        {activeTab === 'group' && (
          <div className="space-y-6">
            {/* Code de synchronisation */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Code de synchronisation (19 chiffres)
              </span>
              <p className="text-xs font-mono font-bold text-indigo-600 mt-0.5 tracking-wider">
                {groupCode}
              </p>
            </div>

            {/* Gestion de la Devise */}
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600">Devise du groupe</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1 text-xs font-bold text-indigo-600 focus:outline-none"
              >
                <option value="€">EUR (€)</option>
                <option value="$">USD ($)</option>
                <option value="£">GBP (£)</option>
                <option value="CHF">CHF</option>
              </select>
            </div>

            {/* Liste des membres */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600">
                Membres du groupe ({members.length})
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ajouter un prénom..."
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
                <button
                  onClick={handleAddMember}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {members.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {m}
                    <button
                      onClick={() => handleRemoveMember(m)}
                      className="text-indigo-400 hover:text-red-500 ml-1 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Formulaire de dépense */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-600">
                Ajouter une dépense
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Intitulé"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
                <input
                  type="number"
                  placeholder={`Montant (${currency})`}
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={expPaidBy}
                  onChange={(e) => setExpPaidBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m} value={m}>
                      Payé par {m}
                    </option>
                  ))}
                </select>

                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddExpense}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                + Ajouter la dépense
              </button>
            </div>

            {/* Liste des dépenses & Récapitulatif */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-700">Dépenses enregistrées</h3>
                <span className="text-xs font-bold text-indigo-600">
                  Total : {groupTotal.toFixed(2)} {currency}
                </span>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {expenses.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center py-2">
                    Aucune dépense pour le moment.
                  </p>
                ) : (
                  expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{exp.title}</span>
                        <div className="flex gap-2 items-center text-[10px] text-slate-500 mt-0.5">
                          <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                            {exp.category}
                          </span>
                          <span>Par : {exp.paidBy}</span>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-800">
                        {exp.amount.toFixed(2)} {currency}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center mt-2">
                <span className="text-[11px] uppercase font-bold text-indigo-400">
                  Moyenne par membre ({members.length})
                </span>
                <div className="text-2xl font-black text-indigo-600 mt-0.5">
                  {groupPerPerson} {currency}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === ONGLET 3 : SOUTENIR / À PROPOS === */}
        {activeTab === 'about' && (
          <div className="space-y-6 text-center">
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
                className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-md shadow-indigo-100 mt-2"
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
