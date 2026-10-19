import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator', 'group' ou 'about'
  
  // États Calculateur Rapide
  const [totalAmount, setTotalAmount] = useState('');
  const [peopleCount, setPeopleCount] = useState('2');
  const [tipPercentage, setTipPercentage] = useState('0');

  // États Gestion de Groupe & Dépenses
  const [groupName, setGroupName] = useState('Sortie entre amis');
  const [members, setMembers] = useState(['Alice', 'Bob', 'Charlie']);
  const [newMemberName, setNewMemberName] = useState('');
  const [expenses, setExpenses] = useState([]);
  
  // Formulaire nouvelle dépense
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');

  // Calculs Calculatrice Rapide
  const total = parseFloat(totalAmount) || 0;
  const count = parseInt(peopleCount, 10) || 1;
  const tip = parseFloat(tipPercentage) || 0;
  const totalWithTip = total + (total * (tip / 100));
  const amountPerPerson = (totalWithTip / count).toFixed(2);

  // Actions Groupe
  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMemberName.trim() && !members.includes(newMemberName.trim())) {
      setMembers([...members, newMemberName.trim()]);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (name) => {
    setMembers(members.filter((m) => m !== name));
    setExpenses(expenses.filter((exp) => exp.paidBy !== name));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount || !paidBy) return;

    const newExp = {
      id: Date.now(),
      title: expenseTitle.trim(),
      amount: parseFloat(expenseAmount),
      paidBy: paidBy
    };

    setExpenses([...expenses, newExp]);
    setExpenseTitle('');
    setExpenseAmount('');
  };

  const handleRemoveExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  // Calculs Bilan de Groupe
  const groupTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const costPerMember = members.length > 0 ? groupTotal / members.length : 0;

  const memberBalances = members.map((member) => {
    const paid = expenses
      .filter((exp) => exp.paidBy === member)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return {
      name: member,
      paid: paid,
      balance: paid - costPerMember
    };
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between p-4 font-sans">
      {/* En-tête de l'application */}
      <header className="max-w-md w-full mx-auto bg-white rounded-3xl p-6 shadow-sm mb-4 border border-slate-200 text-center">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tight">Partago</h1>
        <p className="text-xs text-slate-500 mt-1">Partagez vos additions & dépenses en groupe</p>

        {/* Barre d'onglets */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mt-4">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition ${
              activeTab === 'calculator'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Calculateur
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition ${
              activeTab === 'group'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Groupe ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition ${
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
        {/* ONGLET 1 : CALCULATEUR RAPIDE */}
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
                {amountPerPerson} €
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : GESTION DE GROUPE */}
        {activeTab === 'group' && (
          <div className="space-y-6">
            {/* Nom du groupe */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom du groupe</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700"
              />
            </div>

            {/* Membres */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Participants</label>
              <form onSubmit={handleAddMember} className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Ajouter un prénom..."
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold">
                  + Ajouter
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {members.map((member) => (
                  <span
                    key={member}
                    className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-indigo-100"
                  >
                    {member}
                    <button
                      onClick={() => handleRemoveMember(member)}
                      className="ml-2 text-indigo-400 hover:text-red-500 font-bold text-sm"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Formulaire de Dépense */}
            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ajouter une dépense</label>
              <form onSubmit={handleAddExpense} className="space-y-2">
                <input
                  type="text"
                  placeholder="Titre (ex: Restaurant, Taxi...)"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Montant (€)"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <select
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600"
                  >
                    <option value="">Payé par...</option>
                    {members.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={!members.length}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl transition"
                >
                  Enregistrer la dépense
                </button>
              </form>
            </div>

            {/* Bilan du groupe */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Dépensé</span>
                <span className="text-base font-black text-slate-800">{groupTotal.toFixed(2)} €</span>
              </div>

              {members.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Équilibre des comptes</span>
                  {memberBalances.map((b) => (
                    <div key={b.name} className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">{b.name}</span>
                      <span className={`font-bold ${b.balance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {b.balance >= 0 ? `+${b.balance.toFixed(2)} €` : `${b.balance.toFixed(2)} €`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ONGLET 3 : SOUTENIR / À PROPOS */}
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

              {/* BOUTON STRIPE SÉCURISÉ */}
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
