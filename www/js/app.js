/**
 * Arch-Sec Security Dashboard
 * Main JavaScript Application - Connected to API
 */

// ===== Configuration =====
const API_BASE = '';  // Same origin

// ===== State =====
let dashboardData = {
    riskScore: 0,
    stats: { critical: 0, high: 0, medium: 0, low: 0 },
    issues: [],
    networkNodes: [],
    recentScans: []
};

let availableScripts = [];

// ===== DOM Elements =====
const elements = {
    riskScore: document.getElementById('risk-score'),
    riskLabel: document.getElementById('risk-label'),
    gaugeNeedle: document.querySelector('.gauge-needle'),
    criticalCount: document.getElementById('critical-count'),
    highCount: document.getElementById('high-count'),
    mediumCount: document.getElementById('medium-count'),
    lowCount: document.getElementById('low-count'),
    issuesList: document.getElementById('issues-list'),
    networkMap: document.getElementById('network-map'),
    fullNetworkMap: document.getElementById('full-network-map'),
    scansList: document.getElementById('scans-list'),
    lastScan: document.getElementById('last-scan'),
    runScanBtn: document.getElementById('run-scan'),
    refreshBtn: document.getElementById('refresh-data'),
    scanModal: document.getElementById('scan-modal'),
    closeModalBtn: document.getElementById('close-modal'),
    cancelScanBtn: document.getElementById('cancel-scan'),
    startScanBtn: document.getElementById('start-scan'),
    targetInput: document.getElementById('target-input'),
    scriptCheckboxes: document.getElementById('script-checkboxes'),

    // New Section Elements
    navItems: document.querySelectorAll('.nav-item'),
    sections: document.querySelectorAll('.content-section'),
    fullIssuesList: document.getElementById('full-issues-list'),
    issueSearch: document.getElementById('issue-search'),
    severityFilter: document.getElementById('severity-filter'),
    reportsList: document.getElementById('reports-list'),
    reportViewer: document.getElementById('report-viewer'),
    nodeDetailsPanel: document.getElementById('node-details-panel'),
    nodeContent: document.getElementById('node-content'),
    closePanelBtn: document.querySelector('.close-panel'),
    defaultTargetInput: document.getElementById('settings-default-target'),
    saveSettingsBtn: document.getElementById('save-settings')
};

// ===== API Functions =====
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        return null;
    }
}

async function loadDashboardData() {
    const data = await fetchAPI('/api/results');
    if (data) {
        dashboardData = data;
        updateDashboard();
        renderFullIssues();
        renderReportsList();
    }
}

async function loadScripts() {
    const scripts = await fetchAPI('/api/scripts');
    if (scripts) {
        availableScripts = scripts;
    }
}

async function startScanAPI(target, scripts) {
    return await fetchAPI('/api/scan', {
        method: 'POST',
        body: JSON.stringify({ target, scripts })
    });
}

async function checkScanStatus() {
    return await fetchAPI('/api/scans');
}

// ===== Routing =====
function handleRouting() {
    const hash = window.location.hash.substring(1) || 'dashboard';
    showSection(hash);
}

function showSection(sectionId) {
    // Update active nav item
    elements.navItems.forEach(item => {
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Show section
    elements.sections.forEach(section => {
        if (section.id === `section-${sectionId}`) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Special rendering for specific sections
    if (sectionId === 'network') {
        renderNetworkMap(dashboardData.networkNodes, elements.fullNetworkMap);
    } else if (sectionId === 'reports') {
        renderReportsList();
    }
}

// ===== Dashboard Updates =====
function updateDashboard() {
    updateRiskGauge(dashboardData.riskScore);
    updateStats(dashboardData.stats);
    renderIssuesPreview(dashboardData.issues);
    renderRecentScans(dashboardData.recentScans);
    renderNetworkMap(dashboardData.networkNodes, elements.networkMap);

    if (dashboardData.lastUpdated) {
        elements.lastScan.textContent = formatTime(dashboardData.lastUpdated);
    }
}

// ===== Risk Gauge =====
function updateRiskGauge(score) {
    elements.riskScore.textContent = score;

    let label, color;
    if (score >= 80) {
        label = 'Critical Risk';
        color = '#ef4444';
    } else if (score >= 60) {
        label = 'High Risk';
        color = '#f97316';
    } else if (score >= 40) {
        label = 'Medium Risk';
        color = '#eab308';
    } else if (score >= 20) {
        label = 'Low Risk';
        color = '#3b82f6';
    } else {
        label = 'Minimal Risk';
        color = '#10b981';
    }

    elements.riskLabel.textContent = label;
    elements.riskScore.style.color = color;

    const rotation = -90 + (score / 100) * 180;
    elements.gaugeNeedle.style.transform = `rotate(${rotation}deg)`;
}

// ===== Stats =====
function updateStats(stats) {
    animateCounter(elements.criticalCount, stats.critical || 0);
    animateCounter(elements.highCount, stats.high || 0);
    animateCounter(elements.mediumCount, stats.medium || 0);
    animateCounter(elements.lowCount, stats.low || 0);
}

function animateCounter(element, target) {
    const duration = 1000;
    const currentText = element.textContent;
    const start = parseInt(currentText) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    if (increment === 0) {
        element.textContent = target;
        return;
    }

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// ===== Issues Logic =====
function renderIssuesPreview(issues) {
    if (!issues || issues.length === 0) {
        elements.issuesList.innerHTML = '<div class="no-issues"><p>No issues found.</p></div>';
        return;
    }

    elements.issuesList.innerHTML = issues.slice(0, 5).map(issue => `
        <div class="issue-item ${issue.severity}">
            <div class="issue-severity">${getSeverityIcon(issue.severity)}</div>
            <div class="issue-content">
                <div class="issue-title">${escapeHtml(issue.title)}</div>
                <div class="issue-meta">📍 ${escapeHtml(issue.host)}</div>
            </div>
        </div>
    `).join('');
}

function renderFullIssues() {
    if (!elements.fullIssuesList) return;

    const searchTerm = elements.issueSearch.value.toLowerCase();
    const severityFilter = elements.severityFilter.value;

    const filteredIssues = dashboardData.issues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm) ||
            issue.description.toLowerCase().includes(searchTerm) ||
            issue.host.toLowerCase().includes(searchTerm);
        const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
        return matchesSearch && matchesSeverity;
    });

    if (filteredIssues.length === 0) {
        elements.fullIssuesList.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;">No matching issues found.</td></tr>';
        return;
    }

    elements.fullIssuesList.innerHTML = filteredIssues.map(issue => `
        <tr class="severity-${issue.severity}">
            <td><span class="scan-status-badge ${issue.severity}">${issue.severity.toUpperCase()}</span></td>
            <td>
                <strong>${escapeHtml(issue.title)}</strong>
                <div style="font-size:11px;color:var(--text-muted);">${escapeHtml(issue.description)}</div>
            </td>
            <td>${escapeHtml(issue.host)}</td>
            <td>${escapeHtml(issue.scanner)}</td>
            <td>${formatTime(issue.timestamp)}</td>
        </tr>
    `).join('');
}

function getSeverityIcon(severity) {
    const icons = { critical: '🔴', high: '🟠', medium: '🟡', low: '🔵' };
    return icons[severity] || '⚪';
}

// ===== Network Map =====
function renderNetworkMap(nodes, container) {
    if (!container) return;
    container.innerHTML = '';

    if (!nodes || nodes.length === 0) {
        container.innerHTML = '<div class="no-issues" style="height:100%;"><p>No hosts discovered yet</p></div>';
        return;
    }

    // Create SVG for connections
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;';
    container.appendChild(svg);

    // Filter connections to avoid overlapping or redundant lines
    for (let i = 0; i < nodes.length - 1; i++) {
        const from = nodes[i];
        const to = nodes[i + 1];
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', `${from.x}%`);
        line.setAttribute('y1', `${from.y}%`);
        line.setAttribute('x2', `${to.x}%`);
        line.setAttribute('y2', `${to.y}%`);
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }

    nodes.forEach(node => {
        const nodeEl = document.createElement('div');
        nodeEl.className = `network-node ${node.status || 'safe'}`;
        nodeEl.style.left = `${node.x}%`;
        nodeEl.style.top = `${node.y}%`;
        nodeEl.style.transform = 'translate(-50%, -50%)';

        nodeEl.innerHTML = `
            <div class="node-icon">${node.icon || '💻'}</div>
            <span class="node-label">${escapeHtml(node.label)}</span>
        `;

        nodeEl.addEventListener('click', () => showNodeDetails(node));
        container.appendChild(nodeEl);
    });
}

function showNodeDetails(node) {
    const hostIssues = dashboardData.issues.filter(issue => issue.host === node.label);

    elements.nodeContent.innerHTML = `
        <div class="node-details-header">
            <span style="font-size: 40px; margin-bottom: 10px; display: block;">${node.icon || '💻'}</span>
            <h4>${escapeHtml(node.label)}</h4>
            <span class="scan-status-badge ${node.status}">${node.status.toUpperCase()}</span>
        </div>
        <hr style="opacity: 0.1; margin: 15px 0;">
        <h5>Issues (${hostIssues.length})</h5>
        <div class="node-issues-list">
            ${hostIssues.length > 0
            ? hostIssues.map(i => `
                    <div class="node-issue-item">
                        <span class="dot ${i.severity}"></span>
                        <span>${escapeHtml(i.title)}</span>
                    </div>
                `).join('')
            : '<p style="font-size:12px;color:var(--text-muted)">No vulnerabilities found.</p>'
        }
        </div>
    `;
    elements.nodeDetailsPanel.classList.remove('hidden');
}

// ===== Reports Explorer =====
async function renderReportsList() {
    if (!elements.reportsList) return;

    const reports = await fetchAPI('/api/reports');
    if (!reports) return;

    if (reports.length === 0) {
        elements.reportsList.innerHTML = '<p style="text-align:center;padding:20px;color:var(--text-muted);">No reports found.</p>';
        return;
    }

    elements.reportsList.innerHTML = reports.map(report => `
        <div class="report-item" onclick="viewReport('${report.name}')">
            <span class="report-name">${escapeHtml(report.name)}</span>
            <div class="report-meta">
                <span>${Math.round(report.size / 1024)} KB</span> • 
                <span>${formatTime(report.modified)}</span>
            </div>
        </div>
    `).join('');
}

async function viewReport(reportName) {
    // UI update
    document.querySelectorAll('.report-item').forEach(item => {
        if (item.querySelector('.report-name').textContent === reportName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    elements.reportViewer.innerHTML = '<div class="viewer-placeholder"><p>Loading report content...</p></div>';

    const data = await fetchAPI(`/api/report/${reportName}`);
    if (data && data.content) {
        elements.reportViewer.textContent = data.content;
    } else {
        elements.reportViewer.innerHTML = '<div class="viewer-placeholder"><p>Error loading report content.</p></div>';
    }
}

// Make viewReport globally accessible
window.viewReport = viewReport;

// ===== Recent Scans =====
function renderRecentScans(scans) {
    if (!scans || scans.length === 0) {
        elements.scansList.innerHTML = '<div class="no-scans"><p>No scans yet.</p></div>';
        return;
    }

    elements.scansList.innerHTML = scans.map(scan => `
        <div class="scan-item">
            <div class="scan-info">
                <span class="scan-icon">🔍</span>
                <div class="scan-details">
                    <h4>${escapeHtml(scan.name)}</h4>
                    <p>${escapeHtml(scan.target)} • ${scan.findings || 0} findings</p>
                </div>
            </div>
            <span class="scan-status-badge ${scan.status}">${scan.status}</span>
        </div>
    `).join('');
}

// ===== Modal & Settings =====
function openScanModal() {
    elements.scanModal.classList.add('active');
    renderScriptCheckboxes();
}

function closeScanModal() {
    elements.scanModal.classList.remove('active');
}

function renderScriptCheckboxes() {
    if (availableScripts.length === 0) {
        elements.scriptCheckboxes.innerHTML = '<p>Loading scripts...</p>';
        return;
    }

    elements.scriptCheckboxes.innerHTML = availableScripts.map(script => `
        <label class="script-checkbox">
            <input type="checkbox" value="${script.filename}" checked>
            <span>${script.name.replace(/_/g, ' ')}</span>
        </label>
    `).join('');
}

async function startScan() {
    const target = elements.targetInput.value || elements.defaultTargetInput.value || 'localhost';
    const selectedScripts = [...elements.scriptCheckboxes.querySelectorAll('input:checked')]
        .map(cb => cb.value);

    if (selectedScripts.length === 0) {
        alert('Please select at least one script');
        return;
    }

    closeScanModal();

    // Start scan via API
    const result = await startScanAPI(target, selectedScripts);

    if (result && result.scan_id) {
        await loadDashboardData();
        // Switch to dashboard to see the running scan
        window.location.hash = 'dashboard';
    }
}

// ===== Utility Functions =====
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(timestamp) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Unknown';
    }
}

// ===== Event Listeners =====
elements.runScanBtn?.addEventListener('click', openScanModal);
elements.closeModalBtn?.addEventListener('click', closeScanModal);
elements.cancelScanBtn?.addEventListener('click', closeScanModal);
elements.startScanBtn?.addEventListener('click', startScan);

elements.refreshBtn?.addEventListener('click', async () => {
    elements.refreshBtn.disabled = true;
    elements.refreshBtn.innerHTML = '<span>⏳</span> Loading...';
    await loadDashboardData();
    elements.refreshBtn.disabled = false;
    elements.refreshBtn.innerHTML = '<span>🔄</span> Refresh';
});

elements.scanModal?.addEventListener('click', (e) => {
    if (e.target === elements.scanModal) closeScanModal();
});

// Navigation
elements.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = item.dataset.section;
    });
});

window.addEventListener('hashchange', handleRouting);

// Filters
elements.issueSearch?.addEventListener('input', renderFullIssues);
elements.severityFilter?.addEventListener('change', renderFullIssues);

// Panels
elements.closePanelBtn?.addEventListener('click', () => {
    elements.nodeDetailsPanel.classList.add('hidden');
});

// Settings
elements.saveSettingsBtn?.addEventListener('click', () => {
    alert('Settings saved locally (simulation)');
});

// ===== Initialize =====
async function initializeDashboard() {
    await loadScripts();
    await loadDashboardData();
    handleRouting();

    window.addEventListener('resize', () => {
        const activeSection = window.location.hash.substring(1) || 'dashboard';
        if (activeSection === 'dashboard') {
            renderNetworkMap(dashboardData.networkNodes, elements.networkMap);
        } else if (activeSection === 'network') {
            renderNetworkMap(dashboardData.networkNodes, elements.fullNetworkMap);
        }
    });

    // Auto-refresh every 60 seconds
    setInterval(loadDashboardData, 60000);
}

document.addEventListener('DOMContentLoaded', initializeDashboard);
