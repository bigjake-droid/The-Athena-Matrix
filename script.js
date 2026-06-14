/**
 * THE ATHENA MATRIX // UNIFIED CORE ENGINE v1.1.0
 * CASEFORGE SYSTEMS DEVELOPMENT PIPELINE
 * LOCALSTORAGE STATE INTERLOCK
 */

// 1. DEFAULT LIFELINE DATABASE STRUCTURE (Initial Fallback)
const DefaultAthenaState = {
    caseDetails: {
        number: "PENDING",
        jurisdiction: "NOT_SET",
        division: "N/A",
        targetHearingDate: ""
    },
    interlocks: [],
    precedents: [
        {
            citation: "People v. Quintano, 105 P.3d 585 (Colo. 2005)",
            scope: "Fluid Timelines",
            rule: "Charging a broad course of conduct is unconstitutional if it deprives fair notice under an active contract."
        },
        {
            citation: "Kogan v. People, 756 P.2d 945 (Colo. 1988)",
            scope: "Vagueness Cures",
            rule: "A post-trial jury instruction on unanimity cannot retroactively cure a pre-trial Due Process notice violation."
        },
        {
            citation: "People v. District Court, 595 P.2d 1045 (Colo. 1979)",
            scope: "Discovery Dumps",
            rule: "A massive discovery dump does not satisfy notice when internal files directly refute the officer's sworn narrative."
        }
    ]
};

// 2. STATE INITIALIZATION INTERLOCK
let ActiveState = JSON.parse(localStorage.getItem("AthenaMatrixState"));
if (!ActiveState) {
    ActiveState = DefaultAthenaState;
    localStorage.setItem("AthenaMatrixState", JSON.stringify(ActiveState));
}

// 3. RUNTIME LAYER ROUTER
document.addEventListener("DOMContentLoaded", () => {
    // Detect which node the operator is currently running
    if (document.getElementById("sidebarCanvas")) {
        AthenaEngine.initDashboard();
    } else if (document.getElementById("termStream")) {
        AthenaEngine.initCaptureNode();
    }
});

// 4. MAIN OPERATIONAL ENGINE
const AthenaEngine = {
    
    // --- DASHBOARD SUBSYSTEM ---
    initDashboard: function() {
        console.log("[SYS_INIT] Running Dashboard Terminal View...");
        this.renderHeaders();
        this.renderInterlocks();
        this.renderPrecedents();
        this.startCountdown();
        this.initPodiumMode();
    },

    renderHeaders: function() {
        const headerTitle = document.querySelector(".sys-title span");
        const clockDiv = document.querySelector(".sys-status div:last-child");
        
        if (ActiveState.caseDetails.number !== "PENDING") {
            headerTitle.textContent = `CASE NO: ${ActiveState.caseDetails.number} // Venue: ${ActiveState.caseDetails.jurisdiction} // Div: ${ActiveState.caseDetails.division}`;
        }
    },

    renderInterlocks: function() {
        const panel = document.querySelector(".panel.panel-active");
        if (!panel) return;

        panel.innerHTML = '<div class="panel-title">Active Verification Matrix</div>';

        if (ActiveState.interlocks.length === 0) {
            panel.innerHTML += `
                <div style="color: #64748b; font-size: 0.9rem; text-align: center; margin-top: 40px; border: 1px dashed #27272a; padding: 20px;">
                    [SYSTEM ALERT] No active validation links found. Deploy capture.html to ingest discovery data.
                </div>`;
            return;
        }

        ActiveState.interlocks.forEach(item => {
            const row = document.createElement("div");
            row.className = "interlock-row";
            row.style.borderLeft = "3px solid #dc143c";
            row.innerHTML = `
                <div class="data-segment">
                    <div class="segment-label">Legal Dismissal Ground (Omnibus)</div>
                    <strong>${item.section}</strong><br>
                    <span style="color: #cbd5e1;">${item.groundText}</span>
                </div>
                <div class="data-segment" style="border-left: 1px dashed #27272a; padding-left: 15px;">
                    <div class="segment-label">Unassailable Digital Receipt (Supplemental)</div>
                    <span style="color: #ffffff; background-color: #991b1b; padding: 2px 6px; font-size: 0.7rem; font-weight: bold; border-radius: 2px;">${item.exhibit}</span>
                    <strong style="color: #ffffff; font-size: 0.8rem; display: block; margin-top: 4px;">${item.source}</strong>
                    <span style="color: #94a3b8; font-size: 0.8rem;">${item.receiptText}</span>
                </div>
            `;
            panel.appendChild(row);
        });
    },

    renderPrecedents: function() {
        const panel = document.querySelector(".panel:not(.panel-active)");
        if (!panel) return;

        panel.innerHTML = '<div class="panel-title">Sniper Precedent Logs</div>';

        ActiveState.precedents.forEach(cite => {
            const card = document.createElement("div");
            card.className = "sniper-card";
            card.innerHTML = `
                <div style="color: #dc143c; font-size: 0.7rem; font-weight: bold; margin-bottom: 2px; text-transform: uppercase;">Target: ${cite.scope}</div>
                <div class="sniper-citation">⚖️ ${cite.citation}</div>
                <div class="sniper-rule">${cite.rule}</div>
            `;
            panel.appendChild(card);
        });
    },

    startCountdown: function() {
        const clockDiv = document.querySelector(".sys-status div:last-child");
        if (!clockDiv || !ActiveState.caseDetails.targetHearingDate) return;

        const targetTime = new Date(ActiveState.caseDetails.targetHearingDate).getTime();

        setInterval(() => {
            const difference = targetTime - new Date().getTime();
            if (difference <= 0) {
                clockDiv.innerHTML = `<span style="color: #dc143c; font-weight: bold;">HEARING ACTIVE</span>`;
                return;
            }
            const d = Math.floor(difference / 86400000);
            const h = Math.floor((difference % 86400000) / 3600000);
            const m = Math.floor((difference % 3600000) / 60000);
            const s = Math.floor((difference % 60000) / 1000);
            clockDiv.innerHTML = `T-MINUS: <span style="color:#ffffff; font-weight:bold;">${d}d ${h}h ${m}m ${s}s</span>`;
        }, 1000);
    },

    initPodiumMode: function() {
        window.addEventListener("keydown", (e) => {
            if (e.code === "Space" && e.target === document.body) {
                e.preventDefault();
                document.body.classList.toggle("podium-engaged");
                const grid = document.querySelector(".grid-container");
                grid.style.gridTemplateColumns = document.body.classList.contains("podium-engaged") ? "1fr" : "2fr 1fr";
            }
        });
    },

    // --- CAPTURE SUBSYSTEM ---
    initCaptureNode: function() {
        console.log("[SYS_INIT] Running Data Ingestion Subsystem...");
        
        // Auto-populate parameter fields if data exists
        if(ActiveState.caseDetails.number !== "PENDING") {
            document.getElementById("caseNum").value = ActiveState.caseDetails.number;
            document.getElementById("jurisdiction").value = ActiveState.caseDetails.jurisdiction;
            document.getElementById("division").value = ActiveState.caseDetails.division;
            document.getElementById("hearingDate").value = ActiveState.caseDetails.targetHearingDate;
        }
    },

    commitParameters: function() {
        ActiveState.caseDetails.number = document.getElementById("caseNum").value || "PENDING";
        ActiveState.caseDetails.jurisdiction = document.getElementById("jurisdiction").value || "NOT_SET";
        ActiveState.caseDetails.division = document.getElementById("division").value || "N/A";
        ActiveState.caseDetails.targetHearingDate = document.getElementById("hearingDate").value || "";
        
        localStorage.setItem("AthenaMatrixState", JSON.stringify(ActiveState));
        this.logToTerminal("[UPDATE] Global Case Parameters locked into browser state storage.");
    },

    commitInterlock: function() {
        const section = document.getElementById("motionSec").value;
        const groundText = document.getElementById("motionText").value;
        const exhibit = document.getElementById("exhibitTag").value;
        const source = document.getElementById("receiptSource").value;
        const receiptText = document.getElementById("receiptText").value;

        if (!section || !exhibit) {
            this.logToTerminal("[ERROR] Structural commit aborted: Section and Exhibit fields are mandatory mapping coordinates.");
            return;
        }

        // Push packet to storage array
        ActiveState.interlocks.push({ section, groundText, exhibit, source, receiptText });
        localStorage.setItem("AthenaMatrixState", JSON.stringify(ActiveState));

        this.logToTerminal(`[LOCKED] Programmatic dependency established: Linked ${section} directly to ${exhibit}.`);
        
        // Clear inputs for clean operational cycle
        ["motionSec", "motionText", "exhibitTag", "receiptSource", "receiptText"].forEach(id => {
            document.getElementById(id).value = "";
        });
    },

    logToTerminal: function(msg) {
        const stream = document.getElementById("termStream");
        if (stream) {
            stream.innerHTML += `<br><span style="color:#ffffff;">${msg}</span>`;
            stream.scrollTop = stream.scrollHeight;
        }
    }
};
