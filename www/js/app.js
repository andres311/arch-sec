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
    recentScans: [],
    currentEnv: null
};

let availableScripts = [];

// ===== DOM Elements =====
const elements = {
    riskScore: document.getElementById('risk-score'),
    riskLabel: document.getElementById('risk-label'),
    gaugeNeedle: document.querySelector('.gauge-needle'),

    // Stats Cards
    statCardCritical: document.querySelector('.stat-card.critical'),
    statCardHigh: document.querySelector('.stat-card.high'),
    statCardMedium: document.querySelector('.stat-card.medium'),
    statCardLow: document.querySelector('.stat-card.low'),

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
    saveSettingsBtn: document.getElementById('save-settings'),
    envSelect: document.getElementById('env-select'),

    // Discovery Elements
    fastDiscoveryBtn: document.getElementById('fast-discovery'),
    discoveryModal: document.getElementById('discovery-modal'),
    closeDiscoveryModalBtn: document.getElementById('close-discovery-modal'),
    cancelDiscoveryBtn: document.getElementById('cancel-discovery'),
    startDiscoveryBtn: document.getElementById('start-discovery'),
    startDiscoveryBtn: document.getElementById('start-discovery'),
    discoveryTarget: document.getElementById('discovery-target'),
    discoveryDetailed: document.getElementById('discovery-detailed')
};

// ===== API Functions =====
function filterIssuesBySeverity(severity) {
    // Navigate to issues section
    window.location.hash = 'issues';

    // Clear search to avoid conflicting filters
    if (elements.issueSearch) {
        elements.issueSearch.value = '';
    }

    // Set filter
    if (elements.severityFilter) {
        elements.severityFilter.value = severity;
        // Directly update the list
        renderFullIssues();
    }
}

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

async function loadDashboardData(envOverride = null) {
    // Load environment from URL if present, or use override
    const urlParams = new URLSearchParams(window.location.search);
    const env = envOverride || urlParams.get('env');

    // Fetch data with env param
    const endpoint = env ? `/api/results?env=${encodeURIComponent(env)}` : '/api/results';
    const data = await fetchAPI(endpoint);

    if (data) {
        dashboardData = data;
        updateDashboard();
        renderFullIssues();
        renderReportsList();
    }
}

async function loadEnvironments() {
    const envs = await fetchAPI('/api/environments');
    let selectedEnv = null;

    if (envs && elements.envSelect) {
        // Determine selected env
        const urlParams = new URLSearchParams(window.location.search);
        selectedEnv = urlParams.get('env') || (envs.find(e => e.is_current)?.name);

        elements.envSelect.innerHTML = envs.map(env => {
            let className = 'env-option-available';
            let label = env.name;

            if (env.is_current) {
                className = 'env-option-current';
                label += ' (Connected)';
            } else if (env.has_records) {
                className = 'env-option-records';
            }

            const isSelected = selectedEnv === env.name ? 'selected' : '';

            // If no env is selected in URL, default to the first active one
            if (!selectedEnv && env.is_current) {
                selectedEnv = env.name;
            }

            return `<option value="${escapeHtml(env.name)}" class="${className}" ${isSelected}>${escapeHtml(label)}</option>`;
        }).join('');
    }

    // Return the selected environment for use by other functions
    return selectedEnv;
}

async function loadScripts() {
    const scripts = await fetchAPI('/api/scripts');
    if (scripts) {
        availableScripts = scripts;
    }
}

async function startScanAPI(target, scripts, discover, discoveryOnly, detailed = false, environment = null) {
    return await fetchAPI('/api/scan', {
        method: 'POST',
        body: JSON.stringify({ target, scripts, discover, discovery_only: discoveryOnly, detailed, environment })
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
        const issueSeverity = (issue.severity || 'low').toLowerCase();

        const matchesSearch = (issue.title || '').toLowerCase().includes(searchTerm) ||
            (issue.description || '').toLowerCase().includes(searchTerm) ||
            (issue.host || '').toLowerCase().includes(searchTerm);

        const matchesSeverity = severityFilter === 'all' || issueSeverity === severityFilter;
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

        // Tooltip events
        nodeEl.addEventListener('mouseover', (e) => showNodeTooltip(e, node));
        nodeEl.addEventListener('mousemove', (e) => updateTooltipPosition(e));
        nodeEl.addEventListener('mouseout', hideNodeTooltip);

        container.appendChild(nodeEl);
    });
}

function showNodeTooltip(e, node) {
    let tooltip = document.getElementById('network-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'network-tooltip';
        tooltip.className = 'network-tooltip';
        document.body.appendChild(tooltip);
    }

    // Format ports
    let portsHtml = '';
    if (node.ports && node.ports.length > 0) {
        const displayPorts = node.ports.slice(0, 5);
        portsHtml = `
            <div class="tooltip-section">
                <span class="tooltip-label">Open Ports:</span>
                <div class="tooltip-ports">
                    ${displayPorts.map(p => `<span class="port-tag">${p}</span>`).join('')}
                    ${node.ports.length > 5 ? `<span class="port-more">+${node.ports.length - 5} more</span>` : ''}
                </div>
            </div>
        `;
    }

    // Risk score approximation based on status
    const riskScore = {
        'critical': 90,
        'high': 75,
        'medium': 50,
        'low': 25,
        'safe': 0
    }[node.status] || 0;

    // Determine risk color class
    const riskClass = node.status || 'safe';

    tooltip.innerHTML = `
        <div class="tooltip-header ${riskClass}">
            <span class="tooltip-icon">${node.icon || '💻'}</span>
            <div>
                <div class="tooltip-title">${escapeHtml(node.label)}</div>
                <div class="tooltip-subtitle">${node.status.toUpperCase()} Risk</div>
            </div>
            <div class="tooltip-score">${riskScore}</div>
        </div>
        <div class="tooltip-body">
            <div class="tooltip-row">
                <span class="tooltip-label">OS:</span>
                <span class="tooltip-value">${escapeHtml(node.os || 'Unknown')}</span>
            </div>
            ${portsHtml}
        </div>
    `;

    tooltip.style.display = 'block';
    updateTooltipPosition(e);
}

function updateTooltipPosition(e) {
    const tooltip = document.getElementById('network-tooltip');
    if (tooltip) {
        const x = e.clientX + 15;
        const y = e.clientY + 15;

        // Prevent going off screen
        const rect = tooltip.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 10;
        const maxY = window.innerHeight - rect.height - 10;

        tooltip.style.left = `${Math.min(x, maxX)}px`;
        tooltip.style.top = `${Math.min(y, maxY)}px`;
    }
}

function hideNodeTooltip() {
    const tooltip = document.getElementById('network-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
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

    // Use current env from dashboard data or URL
    const urlParams = new URLSearchParams(window.location.search);
    const env = urlParams.get('env');
    const endpoint = env ? `/api/reports?env=${encodeURIComponent(env)}` : '/api/reports';

    const reports = await fetchAPI(endpoint);
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


// ===== Active Scans =====
async function updateActiveScans() {
    const scans = await fetchAPI('/api/scans');
    if (!scans) return;

    renderActiveScans(scans);
}

function renderActiveScans(scans) {
    let activeScansCard = document.getElementById('active-scans-container');

    // Create container if it doesn't exist (insert before recent scans)
    if (!activeScansCard) {
        const scansCard = document.querySelector('.scans-card');
        if (scansCard) {
            const newCard = document.createElement('div');
            newCard.id = 'active-scans-container';  // Add ID so we can find it later
            newCard.className = 'card active-scans-card';
            newCard.style.marginBottom = '20px';
            newCard.innerHTML = `
                <h2 class="card-title">Active Scans</h2>
                <div class="active-scans-list" id="active-scans-list"></div>
            `;
            scansCard.parentNode.insertBefore(newCard, scansCard);
            activeScansCard = newCard;
        }
    }

    if (!activeScansCard) return;

    const listElement = document.getElementById('active-scans-list');
    if (!listElement) return;

    const runningScans = scans.filter(s => s.status === 'running');

    if (runningScans.length === 0) {
        // Hide the entire card when no scans are running
        activeScansCard.style.display = 'none';
        return;
    }

    // Show the card when there are running scans
    activeScansCard.style.display = '';

    listElement.innerHTML = runningScans.map(scan => {
        const completed = scan.completed || 0;
        const total = scan.total || 1;
        const progress = Math.round((completed / total) * 100);

        // Generate steps details
        let stepsHtml = '';
        if (scan.script_details && scan.script_details.length > 0) {
            stepsHtml = `<div class="scan-steps" style="margin-top:10px;background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;max-height:150px;overflow-y:auto;">
                ${scan.script_details.map(script => `
                    <div class="scan-step-item" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;font-size:0.85em;">
                        <span style="color:${getStepColor(script.status)}">
                            ${getStepIcon(script.status)} ${script.name}
                        </span>
                        <span style="opacity:0.7;font-size:0.8em;text-transform:capitalize;">${script.status}</span>
                    </div>
                `).join('')}
             </div>`;
        }

        return `
        <div class="active-scan-item" style="border:1px solid var(--border-color);border-radius:8px;padding:15px;margin-bottom:10px;background:rgba(255,255,255,0.02);">
            <div class="scan-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <div>
                    <h4 style="margin:0;font-size:1em;">Target: <span style="color:var(--primary-color);">${escapeHtml(scan.target)}</span></h4>
                    <span style="font-size:0.8em;opacity:0.7;">Started: ${formatTime(scan.started)}</span>
                </div>
                <div class="scan-badge running">Running</div>
            </div>
            
            <div class="progress-bar-container" style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;margin:10px 0;overflow:hidden;">
                <div class="progress-bar" style="width:${progress}%;height:100%;background:var(--primary-color);transition:width 0.3s ease;"></div>
            </div>
            <div style="text-align:right;font-size:0.8em;margin-bottom:10px;">${completed}/${total} scripts completed</div>
            
            ${stepsHtml}
        </div>
    `}).join('');
}

function getStepIcon(status) {
    if (status === 'completed') return '✅';
    if (status === 'running') return '⏳';
    if (status === 'failed') return '❌';
    return '⚪';
}

function getStepColor(status) {
    if (status === 'completed') return '#10b981';
    if (status === 'running') return '#f59e0b';
    if (status === 'failed') return '#ef4444';
    return 'inherit';
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

    // Get selected environment
    const environment = elements.envSelect ? elements.envSelect.value : null;

    // Start scan via API
    const result = await startScanAPI(target, selectedScripts, false, false, false, environment);

    if (result && result.scan_id) {
        await loadDashboardData();
        // Switch to dashboard to see the running scan
        window.location.hash = 'dashboard';
    }
}

// ===== Discovery Functions =====
function openDiscoveryModal() {
    elements.discoveryModal.classList.add('active');
    if (elements.discoveryTarget) {
        elements.discoveryTarget.value = elements.defaultTargetInput.value || '';
    }
    if (elements.discoveryDetailed) {
        elements.discoveryDetailed.checked = false;
    }
}

function closeDiscoveryModal() {
    elements.discoveryModal.classList.remove('active');
}

async function startDiscoveryTask() {
    const target = elements.discoveryTarget.value || elements.defaultTargetInput.value || 'localhost';
    const detailed = elements.discoveryDetailed ? elements.discoveryDetailed.checked : false;
    const environment = elements.envSelect ? elements.envSelect.value : null;

    closeDiscoveryModal();

    // Start discovery via API (no scripts, discover=false, discoveryOnly=true, detailed=detailed, environment=environment)
    const result = await startScanAPI(target, [], false, true, detailed, environment);

    if (result && result.scan_id) {
        await loadDashboardData();
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

// Stats Card Click Handlers
elements.statCardCritical?.addEventListener('click', () => filterIssuesBySeverity('critical'));
elements.statCardHigh?.addEventListener('click', () => filterIssuesBySeverity('high'));
elements.statCardMedium?.addEventListener('click', () => filterIssuesBySeverity('medium'));
elements.statCardLow?.addEventListener('click', () => filterIssuesBySeverity('low'));

// Settings
elements.saveSettingsBtn?.addEventListener('click', () => {
    alert('Settings saved locally (simulation)');
});

elements.regenerateJsonBtn = document.getElementById('regenerate-json');
elements.regenerateJsonBtn?.addEventListener('click', async () => {
    const btn = elements.regenerateJsonBtn;
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> Regenerating...';

    // Get current env
    const urlParams = new URLSearchParams(window.location.search);
    const env = urlParams.get('env');
    const endpoint = env ? `/api/regenerate_json?env=${encodeURIComponent(env)}` : '/api/regenerate_json';

    try {
        const response = await fetchAPI(endpoint, { method: 'POST' });
        if (response && response.status === 'success') {
            alert('Success: scan_results.json has been regenerated with current data.');
            // Reload data to reflect changes if any
            await loadDashboardData();
        } else {
            alert('Error: Failed to regenerate JSON data.');
        }
    } catch (e) {
        console.error(e);
        alert('Error: Request failed.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
});

// Environment Switch
elements.envSelect?.addEventListener('change', (e) => {
    const env = e.target.value;
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('env', env);
    window.location.href = newUrl.toString();
});

// Discovery Listeners
elements.fastDiscoveryBtn?.addEventListener('click', openDiscoveryModal);
elements.closeDiscoveryModalBtn?.addEventListener('click', closeDiscoveryModal);
elements.cancelDiscoveryBtn?.addEventListener('click', closeDiscoveryModal);
elements.startDiscoveryBtn?.addEventListener('click', startDiscoveryTask);

// ===== Initialize =====
async function initializeDashboard() {
    await loadScripts();
    const currentEnv = await loadEnvironments(); // Load environments first and get current env
    await loadDashboardData(currentEnv); // Pass the current env to ensure consistent data
    handleRouting();

    window.addEventListener('resize', () => {
        const activeSection = window.location.hash.substring(1) || 'dashboard';
        if (activeSection === 'dashboard') {
            renderNetworkMap(dashboardData.networkNodes, elements.networkMap);
        } else if (activeSection === 'network') {
            renderNetworkMap(dashboardData.networkNodes, elements.fullNetworkMap);
        }
    });

    // Auto-refresh every 5 seconds for active scans (more frequent)
    setInterval(updateActiveScans, 5000);
    // Refresh full dashboard data every 60 seconds
    setInterval(loadDashboardData, 60000);

    // Initial load
    updateActiveScans();
}

document.addEventListener('DOMContentLoaded', initializeDashboard);
