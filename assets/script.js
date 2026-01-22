// -----------------------------
// Theme toggle (persisted) + active nav + year
// -----------------------------
(function initThemeAndNav(){
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  const themeBtn = document.getElementById("themeBtn");
  if (themeBtn){
    themeBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  // Active nav link
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("a.navlink").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("active");
  });

  const yearNow = document.getElementById("yearNow");
  if (yearNow) yearNow.textContent = new Date().getFullYear();
})();

// -----------------------------
// Publications page logic
// Only runs if #pubs exists.
// -----------------------------
(function initPublications(){
  const pubsEl = document.getElementById("pubs");
  if (!pubsEl) return;

  // Curated dataset (extend freely)
  const PUBS = [
    {type:"article", year:2026, authors:"Cielen D.; De Bock K.; Flores L.", title:"Exploring Zero-Shot SLM Ensembles as an Alternative to LLMs for Sentiment Analysis", venue:"Information Fusion", details:"126 Part B (Feb 2026), 103666", linkLabel:"Source", link:"https://www.audencia.com/en/faculte-recherche/corps-professoral/cv-de-bock"},
    {type:"article", year:2025, authors:"Liu Z.; De Bock K.; Zhang L.", title:"Explainable Profit-Driven Hotel Booking Cancellation Prediction based on Heterogeneous Stacking-Based Ensemble Classification", venue:"European Journal of Operational Research", details:"321, 284–301", linkLabel:"Source", link:"https://www.audencia.com/en/faculte-recherche/corps-professoral/cv-de-bock"},
    {type:"article", year:2025, authors:"De Bock K.; Bogaert M.; Du Jardin P.", title:"Ensemble Learning for Operations Research and Business Analytics", venue:"Annals of Operations Research", details:"353 (Oct 2025), 419–448", linkLabel:"Source", link:"https://www.audencia.com/en/faculte-recherche/corps-professoral/cv-de-bock"},
    {type:"article", year:2024, authors:"Mena G.; Coussement K.; De Bock K.; De Caigny A.; Lessmann S.", title:"Exploiting Time-Varying RFM Measures for Customer Churn Prediction with Deep Neural Networks", venue:"Annals of Operations Research", details:"339(1), 765–787", linkLabel:"Source", link:"https://www.audencia.com/en/faculte-recherche/corps-professoral/cv-de-bock"},
    {type:"article", year:2024, authors:"De Bock K.; Coussement K.; De Caigny A.; Słowiński R.; Baesens B.; et al.", title:"Explainable AI for Operational Research: A Defining Framework, Methods, Applications, and a Research Agenda", venue:"European Journal of Operational Research", details:"317(2), 249–272", linkLabel:"Source", link:"https://www.audencia.com/en/faculte-recherche/corps-professoral/cv-de-bock"},
    {type:"article", year:2024, authors:"De Caigny A.; De Bock K.; Verboven S.", title:"Hybrid black-box classification for customer churn prediction with segmented interpretability analysis", venue:"Decision Support Systems", details:"181, 114217", linkLabel:"Source", link:"https://www.audencia.com/en/faculte-recherche/corps-professoral/cv-de-bock"},
    {type:"article", year:2021, authors:"Lessmann S.; Haupt J.; Coussement K.; De Bock K.", title:"Targeting customers for profit: An ensemble learning framework to support marketing decision-making", venue:"Information Sciences", details:"557 (May 2021), 286–301", linkLabel:"Source", link:"https://www.audencia.com/en/faculte-recherche/corps-professoral/cv-de-bock"},
    {type:"book", year:2013, authors:"De Bock K.W.; Coussement K.; Neslin S.", title:"Advanced Database Marketing: Innovative Methodologies and Applications for Managing Customer Relationships", venue:"Routledge", details:"", linkLabel:"Source", link:"https://www.audencia.com/en/faculte-recherche/corps-professoral/cv-de-bock"},
    {type:"chapter", year:2018, authors:"De Bock K.W.; Coussement K.; Cielen D.", title:"An Overview of Multiple Classifier Systems Based on Generalized Additive Models", venue:"Ensemble Classification Methods with Applications in R (Wiley)", details:"", linkLabel:"Source", link:"https://www.audencia.com/en/faculte-recherche/corps-professoral/cv-de-bock"},
    {type:"communication", year:2025, authors:"De Lange S.; Bogaert M.; De Bock K.; Van den Poel D.", title:"The dual quest for interpretability and performance in credit scoring via spline-rule ensembles", venue:"Belgian Operational Research Society", details:"pp. 144–145", linkLabel:"Source", link:"https://www.audencia.com/en/faculte-recherche/corps-professoral/cv-de-bock"},
  ];

  const q = document.getElementById("q");
  const typeSel = document.getElementById("type");
  const yearSel = document.getElementById("year");
  const resetBtn = document.getElementById("reset");
  const pubCount = document.getElementById("pubCount");
  const copyCiteBtn = document.getElementById("copyCite");

  const years = Array.from(new Set(PUBS.map(p => p.year))).sort((a,b)=>b-a);
  years.forEach(y => {
    const opt = document.createElement("option");
    opt.value = String(y);
    opt.textContent = String(y);
    yearSel.appendChild(opt);
  });

  function norm(s){ return (s || "").toLowerCase(); }

  function render(){
    const query = norm(q.value.trim());
    const type = typeSel.value;
    const year = yearSel.value;

    let items = PUBS.slice();

    if (type !== "all") items = items.filter(p => p.type === type);
    if (year !== "all") items = items.filter(p => String(p.year) === year);

    if (query){
      items = items.filter(p => norm(`${p.authors} ${p.title} ${p.venue} ${p.details}`).includes(query));
    }

    items.sort((a,b)=> (b.year - a.year) || a.title.localeCompare(b.title));

    pubsEl.innerHTML = "";
    items.forEach(p => {
      const div = document.createElement("div");
      div.className = "pub";

      const badge = (p.type === "article") ? "Research article"
                  : (p.type === "book") ? "Book"
                  : (p.type === "chapter") ? "Book chapter"
                  : "Communication";

      const linkHtml = (p.link && p.linkLabel)
        ? ` · <a href="${p.link}" target="_blank" rel="noopener">${p.linkLabel}</a>`
        : "";

      div.innerHTML = `
        <div class="meta">
          <small>${p.authors}</small>
          <span class="badge">${badge} · ${p.year}</span>
        </div>
        <h3>${p.title}</h3>
        <p><b>${p.venue}</b>${p.details ? ` · ${p.details}` : ""}${linkHtml}</p>
      `;
      pubsEl.appendChild(div);
    });

    pubCount.textContent = `${items.length} item(s) shown.`;
  }

  q.addEventListener("input", render);
  typeSel.addEventListener("change", render);
  yearSel.addEventListener("change", render);

  resetBtn.addEventListener("click", () => {
    q.value = "";
    typeSel.value = "all";
    yearSel.value = "all";
    render();
  });

  if (copyCiteBtn){
    copyCiteBtn.addEventListener("click", async () => {
      const text = "De Bock, K. W. — Professor of Marketing Analytics & Digital Marketing, Audencia Business School (selected publications).";
      try{
        await navigator.clipboard.writeText(text);
        const old = copyCiteBtn.textContent;
        copyCiteBtn.textContent = "Copied ✓";
        setTimeout(()=> copyCiteBtn.textContent = old, 900);
      }catch(e){
        alert("Clipboard blocked by browser settings.");
      }
    });
  }

  render();
})();
