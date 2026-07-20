/**
 * BioIsotope Apple-Style Next.js Storytelling Interactive Showcase
 * Connects the static company website to the 700vh Next.js Apple-like 3D storytelling application.
 */

(function () {
  'use strict';

  const APPLE_STAGES = [
    {
      id: 1,
      num: "01",
      title: "¹³C-CO₂ Carbon Source",
      subtitle: "High-Purity Isotopic Enriched Gas Feeding",
      desc: "Continuous injection of >99% pure Carbon-13 labelled carbon dioxide into our proprietary flat-plate photobioreactor network. Closed-loop gas sparging ensures zero atmospheric dilution and maximum isotopic transfer efficiency into microalgal biomass.",
      metrics: [
        { label: "Isotopic Purity", val: ">99% ¹³C" },
        { label: "Input Gas", val: "Enriched CO₂" },
        { label: "System", val: "Closed-Loop Sparging" }
      ],
      color: "#10B981", // Emerald
      glowClass: "glow-emerald",
      visualType: "gas"
    },
    {
      id: 2,
      num: "02",
      title: "Precision Cultivation",
      subtitle: "Flat-Plate Photobioreactor Growth Dynamics",
      desc: "Our specialized microalgae strain undergoes photosynthetic carbon fixation under precision LED spectra and automated IoT pH/temperature control. Biomass doubles rapidly with complete ¹³C incorporation across all cellular metabolites.",
      metrics: [
        { label: "Incorporation", val: "100% ¹³C Atom" },
        { label: "Biomass Yield", val: "4.5 g/L" },
        { label: "Control", val: "Automated IoT" }
      ],
      color: "#06B6D4", // Cyan
      glowClass: "glow-cyan",
      visualType: "reactor"
    },
    {
      id: 3,
      num: "03",
      title: "Harvest & Hydrodynamics",
      subtitle: "Gentle Separation & Acoustic Cavitation Lysis",
      desc: "Mature ¹³C-enriched algal biomass is harvested via continuous flow centrifugation, followed by acoustic cavitation and enzymatic cell wall disruption. This preserves delicate isotopically labeled intracellular compounds without thermal degradation.",
      metrics: [
        { label: "Recovery Rate", val: "96.4%" },
        { label: "Temp Control", val: "< 25°C" },
        { label: "Lysis Mode", val: "Acoustic Cavitation" }
      ],
      color: "#34D399", // Green
      glowClass: "glow-green",
      visualType: "harvest"
    },
    {
      id: 4,
      num: "04",
      title: "Enzymatic Hydrolysis",
      subtitle: "Targeted Biocatalytic Cleavage & Digestion",
      desc: "Highly specific enzyme cocktails cleave cellular polysaccharides, proteins, and lipids into free monomers. This controlled biocatalytic digestion liberates ¹³C-D-Glucose, ¹³C-Amino Acid mixtures, and labeled fatty acids in high yield.",
      metrics: [
        { label: "Conversion", val: ">94.8%" },
        { label: "Specificity", val: "99.9% Cleavage" },
        { label: "Output", val: "Free Monomers" }
      ],
      color: "#3B82F6", // Blue
      glowClass: "glow-blue",
      visualType: "enzyme"
    },
    {
      id: 5,
      num: "05",
      title: "Compound Separation",
      subtitle: "Preparative HPLC & Cross-Flow Ultrafiltration",
      desc: "Liberated isotopic compounds are isolated and purified using preparative liquid chromatography (prep-HPLC) and multi-stage membrane filtration. Each chemical species is separated with pharmaceutical-grade resolution and purity.",
      metrics: [
        { label: "Chemical Purity", val: ">99.5%" },
        { label: "Resolution", val: "Prep-HPLC" },
        { label: "Endotoxin", val: "Pyrogen-Free" }
      ],
      color: "#14B8A6", // Teal
      glowClass: "glow-teal",
      visualType: "hplc"
    },
    {
      id: 6,
      num: "06",
      title: "NMR QC Validation",
      subtitle: "600 MHz CryoProbe Quantitative Verification",
      desc: "Every production batch undergoes comprehensive structural and isotopic verification using 600 MHz 2D-HSQC, 2D-TOCSY, and quantitative ¹³C-NMR spectroscopy. We guarantee >98% isotopic atom enrichment with full traceability.",
      metrics: [
        { label: "Isotopic Enrichment", val: ">98.5% ¹³C" },
        { label: "Instrument", val: "600 MHz CryoProbe" },
        { label: "Traceability", val: "ISO 17025 QC" }
      ],
      color: "#0EA5E9", // Sky
      glowClass: "glow-sky",
      visualType: "nmr"
    },
    {
      id: 7,
      num: "07",
      title: "Research & Pharma Ready",
      subtitle: "Lyophilization, Inert Packaging & Distribution",
      desc: "Ultra-pure stable isotope compounds are lyophilized into crystalline solids, packaged under inert argon atmosphere in amber cryo-vials, and shipped with complete analytical certificates for metabolic tracing, NMR, and clinical diagnostics.",
      metrics: [
        { label: "Physical Form", val: "Lyophilized Solid" },
        { label: "Atmosphere", val: "Inert Argon" },
        { label: "Shelf Life", val: "> 5 Years Stability" }
      ],
      color: "#F59E0B", // Amber
      glowClass: "glow-amber",
      visualType: "vial"
    }
  ];

  let currentStageIdx = 0;
  let autoPlayTimer = null;
  let isPaused = false;

  function initAppleShowcase() {
    const showcaseEl = document.getElementById('bioisotope-apple-showcase');
    if (!showcaseEl) return;

    const tabsContainer = document.getElementById('apple-stage-tabs');
    const displayContainer = document.getElementById('apple-stage-display');
    const copyBtn = document.getElementById('apple-copy-btn');

    if (!tabsContainer || !displayContainer) return;

    // Render Tabs
    tabsContainer.innerHTML = APPLE_STAGES.map((st, idx) => `
      <button class="apple-stage-tab ${idx === 0 ? 'active' : ''}" data-idx="${idx}" aria-label="Stage ${st.num}: ${st.title}">
        <span class="tab-num">${st.num}</span>
        <span class="tab-label">${st.title.replace('¹³C-CO₂ ', '').replace('¹³C ', '')}</span>
        <div class="tab-progress-bar"><div class="tab-progress-fill"></div></div>
      </button>
    `).join('');

    // Tab Click Event
    const tabButtons = tabsContainer.querySelectorAll('.apple-stage-tab');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-idx') || '0', 10);
        switchStage(idx);
        resetAutoPlay();
      });
    });

    // Hover pause
    showcaseEl.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    showcaseEl.addEventListener('mouseleave', () => {
      isPaused = false;
    });

    // Copy command event
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const cmd = "cd biotech-storytelling && npm run dev";
        navigator.clipboard.writeText(cmd).then(() => {
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = `<span>✓ Copied to Clipboard!</span>`;
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('copied');
          }, 2500);
        }).catch(err => {
          console.error("Failed to copy:", err);
        });
      });
    }

    // Initial render
    renderStageContent(0);
    startAutoPlay();
  }

  function switchStage(idx) {
    if (idx < 0 || idx >= APPLE_STAGES.length) return;
    currentStageIdx = idx;

    // Update active tab
    const tabs = document.querySelectorAll('.apple-stage-tab');
    tabs.forEach((tab, i) => {
      if (i === idx) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    renderStageContent(idx);
  }

  function renderStageContent(idx) {
    const displayContainer = document.getElementById('apple-stage-display');
    if (!displayContainer) return;

    const st = APPLE_STAGES[idx];

    // Build visual animation HTML based on stage type
    let visualHtml = '';
    switch (st.visualType) {
      case 'gas':
        visualHtml = `
          <div class="apple-vis-container vis-gas">
            <div class="vis-ring ring-1" style="border-color: ${st.color}40;"></div>
            <div class="vis-ring ring-2" style="border-color: ${st.color}30;"></div>
            <div class="vis-core" style="background: radial-gradient(circle, ${st.color} 0%, transparent 70%);">
              <span class="vis-formula">¹³C-CO₂</span>
            </div>
            <div class="vis-particle p1" style="background: ${st.color};"></div>
            <div class="vis-particle p2" style="background: ${st.color};"></div>
            <div class="vis-particle p3" style="background: ${st.color};"></div>
          </div>
        `;
        break;
      case 'reactor':
        visualHtml = `
          <div class="apple-vis-container vis-reactor">
            <div class="vis-panel-box" style="border-color: ${st.color}50; box-shadow: 0 0 30px ${st.color}20;">
              <div class="vis-biomass-wave" style="background: linear-gradient(0deg, ${st.color} 0%, transparent 100%);"></div>
              <div class="vis-light-beam" style="background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 80%);"></div>
              <span class="vis-label-badge" style="color: ${st.color}; border-color: ${st.color}40;">Flat-Plate LED Array</span>
            </div>
          </div>
        `;
        break;
      case 'harvest':
        visualHtml = `
          <div class="apple-vis-container vis-harvest">
            <div class="vis-centrifuge" style="border-color: ${st.color};">
              <div class="vis-rotor" style="background: ${st.color};"></div>
            </div>
            <div class="vis-sonic-waves">
              <span class="wave w1" style="border-color: ${st.color};"></span>
              <span class="wave w2" style="border-color: ${st.color};"></span>
              <span class="wave w3" style="border-color: ${st.color};"></span>
            </div>
          </div>
        `;
        break;
      case 'enzyme':
        visualHtml = `
          <div class="apple-vis-container vis-enzyme">
            <div class="vis-substrate" style="border-color: ${st.color}60;">
              <span class="vis-cleavage-line" style="background: ${st.color};"></span>
            </div>
            <div class="vis-enzyme-icon" style="background: ${st.color}; box-shadow: 0 0 25px ${st.color};">
              <span>✂️ Biocatalyst</span>
            </div>
          </div>
        `;
        break;
      case 'hplc':
        visualHtml = `
          <div class="apple-vis-container vis-hplc">
            <div class="vis-column" style="border-color: ${st.color};">
              <div class="vis-band band-1" style="background: ${st.color};"></div>
              <div class="vis-band band-2" style="background: #10B981;"></div>
              <div class="vis-band band-3" style="background: #3B82F6;"></div>
            </div>
            <span class="vis-chrom-label" style="color: ${st.color};">Prep-HPLC Peak >99.5%</span>
          </div>
        `;
        break;
      case 'nmr':
        visualHtml = `
          <div class="apple-vis-container vis-nmr">
            <div class="vis-spectrum">
              <div class="peak p-small" style="background: ${st.color}80;"></div>
              <div class="peak p-main" style="background: ${st.color}; box-shadow: 0 0 20px ${st.color};"></div>
              <div class="peak p-med" style="background: ${st.color}90;"></div>
              <div class="peak p-tiny" style="background: ${st.color}60;"></div>
            </div>
            <span class="vis-nmr-label" style="color: ${st.color}; border-color: ${st.color}40;">600 MHz CryoProbe QC</span>
          </div>
        `;
        break;
      case 'vial':
      default:
        visualHtml = `
          <div class="apple-vis-container vis-vial">
            <div class="vis-cryo-vial" style="border-color: ${st.color}; box-shadow: 0 0 35px ${st.color}30;">
              <div class="vis-vial-cap" style="background: ${st.color};"></div>
              <div class="vis-vial-body">
                <div class="vis-crystals" style="background: ${st.color};"></div>
              </div>
              <span class="vis-vial-tag">99% ¹³C Certified</span>
            </div>
          </div>
        `;
        break;
    }

    displayContainer.style.opacity = '0';
    displayContainer.style.transform = 'translateY(10px)';

    setTimeout(() => {
      displayContainer.innerHTML = `
        <div class="apple-display-left">
          <div class="apple-stage-header-row">
            <span class="apple-stage-badge" style="background: ${st.color}15; color: ${st.color}; border-color: ${st.color}30;">
              STAGE ${st.num} OF 07
            </span>
            <span class="apple-tech-tag">CLOSED-LOOP PROTOCOL</span>
          </div>
          <h3 class="apple-stage-title" style="color: #FFFFFF;">${st.title}</h3>
          <h4 class="apple-stage-subtitle" style="color: ${st.color};">${st.subtitle}</h4>
          <p class="apple-stage-desc">${st.desc}</p>
          
          <div class="apple-metrics-grid">
            ${st.metrics.map(m => `
              <div class="apple-metric-card" style="border-color: ${st.color}25;">
                <span class="metric-val" style="color: ${st.color};">${m.val}</span>
                <span class="metric-lbl">${m.label}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="apple-display-right">
          ${visualHtml}
          <div class="apple-vis-glow" style="background: radial-gradient(circle, ${st.color} 0%, transparent 70%);"></div>
        </div>
      `;
      
      displayContainer.style.opacity = '1';
      displayContainer.style.transform = 'translateY(0)';
    }, 150);
  }

  function startAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      if (!isPaused) {
        const nextIdx = (currentStageIdx + 1) % APPLE_STAGES.length;
        switchStage(nextIdx);
      }
    }, 5000);
  }

  function resetAutoPlay() {
    startAutoPlay();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppleShowcase);
  } else {
    initAppleShowcase();
  }
})();
