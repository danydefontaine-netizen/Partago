import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [totalAmount, setTotalAmount] = useState('');
  const [peopleCount, setPeopleCount] = useState('2');
  const [tipPercentage, setTipPercentage] = useState('0');

  const total = parseFloat(totalAmount) || 0;
  const count = parseInt(peopleCount, 10) || 1;
  const tip = parseFloat(tipPercentage) || 0;

  const totalWithTip = total + (total * (tip / 100));
  const amountPerPerson = (totalWithTip / count).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between p-4 font-sans">
      <header className="max-w-md w-full mx-auto bg-white rounded-3xl p-6 shadow-sm mb-4 border border-slate-200 text-center">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tight">Partago</h1>
        <p className="text-xs text-slate-500 mt-1">Partagez vos additions en toute simplicité</p>

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
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'about'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Soutenir / À propos
          </button>
        </div>
      </header>

      <main className="max-w-md w-full mx-auto bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex-1 flex flex-col justify-between">
        {activeTab === 'calculator' ? (
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
        ) : (
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

      <footer className="max-w-md w-full mx-auto text-center mt-4 text-[11px] text-slate-400">
        © {new Date().getFullYear()} Partago — Tous droits réservés
      </footer>
    </div>
  );
}
