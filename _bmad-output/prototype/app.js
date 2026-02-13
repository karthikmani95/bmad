/**
 * NotDFC Bank Digital Claims Management
 * Prototype Logic
 */

const App = {
    state: {
        currentView: 'dashboard',
        claims: [
            { id: 'CLM-88210', type: 'Card', status: 'In Progress', date: '2026-02-05', transaction: 'Amazon Prime', amount: 14.99 },
            { id: 'CLM-88452', type: 'Non-Card', status: 'Approved', date: '2026-02-08', transaction: 'Utility Bill - PECO', amount: 125.40 },
            { id: 'CLM-89001', type: 'Card', status: 'Open', date: '2026-02-10', transaction: 'Starbucks Coffee', amount: 5.75 },
            { id: 'CLM-87123', type: 'Card', status: 'Rejected', date: '2026-01-28', transaction: 'Delta Air Lines', amount: 450.00 },
        ],
        transactions: [
            { id: 'TXN-001', date: '2026-02-10', vendor: 'Starbucks Coffee', amount: 5.75, status: 'Settled', type: 'Card' },
            { id: 'TXN-002', date: '2026-02-09', vendor: 'Whole Foods', amount: 82.34, status: 'Settled', type: 'Card' },
            { id: 'TXN-003', date: '2026-02-09', vendor: 'Apple Store', amount: 1299.00, status: 'Pending', type: 'Card' },
            { id: 'TXN-004', date: '2026-02-08', vendor: 'Netflix Sub', amount: 19.99, status: 'Settled', type: 'Card' },
            { id: 'TXN-005', date: '2026-02-07', vendor: 'Uber Trip', amount: 24.50, status: 'Settled', type: 'Card' },
            { id: 'TXN-006', date: '2026-02-06', vendor: 'Rent Payment', amount: 2100.00, status: 'Settled', type: 'Non-Card' },
            { id: 'TXN-007', date: '2026-02-05', vendor: 'Amazon Prime', amount: 14.99, status: 'Settled', type: 'Card' },
        ],
        wizard: {
            step: 1,
            data: {
                type: '',
                transactionId: '',
                reason: '',
                files: []
            }
        }
    },

    init() {
        this.bindEvents();
        this.renderView('dashboard');
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    },

    bindEvents() {
        // Sidebar Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                if (view) this.navigateTo(view);
            });
        });

        // Mobile Sidebar Toggle
        const sidebar = document.getElementById('sidebar');
        document.getElementById('menuToggle').addEventListener('click', () => {
            sidebar.classList.add('open');
        });
        document.getElementById('mobileClose').addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    },

    navigateTo(view) {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-view="${view}"]`);
        if (activeNav) activeNav.classList.add('active');
        
        this.state.currentView = view;
        document.getElementById('sidebar').classList.remove('open');
        this.renderView(view);
    },

    renderView(view) {
        const container = document.getElementById('viewContainer');
        container.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';

        setTimeout(() => {
            switch(view) {
                case 'dashboard':
                    this.renderDashboard(container);
                    break;
                case 'my-claims':
                    this.renderMyClaims(container);
                    break;
                case 'create-claim':
                    this.renderCreateClaim(container);
                    break;
                default:
                    container.innerHTML = `<h2>Coming Soon: ${view}</h2>`;
            }
        }, 300);
    },

    renderDashboard(container) {
        const inProgress = this.state.claims.filter(c => c.status === 'In Progress').length;
        const approved = this.state.claims.filter(c => c.status === 'Approved').length;
        
        container.innerHTML = `
            <div class="view-header">
                <h1 class="page-title">Welcome back, Karthik</h1>
                <p class="subtitle">Here's an overview of your active claims.</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon icon-blue"><i class="fas fa-file-invoice"></i></div>
                    <div class="stat-info">
                        <span class="stat-value">${this.state.claims.length}</span>
                        <span class="stat-label">Total Claims</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon icon-orange"><i class="fas fa-clock"></i></div>
                    <div class="stat-info">
                        <span class="stat-value">${inProgress}</span>
                        <span class="stat-label">In Progress</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon icon-green"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-info">
                        <span class="stat-value">${approved}</span>
                        <span class="stat-label">Resolved</span>
                    </div>
                </div>
            </div>

            <div class="section-card">
                <div class="section-header">
                    <h2>Recent Claims</h2>
                    <button class="text-link" onclick="App.navigateTo('my-claims')">View All</button>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Claim ID</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.state.claims.slice(0, 3).map(claim => `
                                <tr>
                                    <td><strong>${claim.id}</strong></td>
                                    <td>${claim.transaction}</td>
                                    <td>${claim.date}</td>
                                    <td><span class="status-badge status-${claim.status.toLowerCase().replace(' ', '-')}">${claim.status}</span></td>
                                    <td><button class="btn-icon"><i class="fas fa-eye"></i></button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="cta-banner">
                <div class="cta-content">
                    <h3>Dispute a new transaction?</h3>
                    <p>It only takes 2 minutes to submit a claim for review.</p>
                </div>
                <button class="btn btn-primary" onclick="App.navigateTo('create-claim')">
                    <i class="fas fa-plus"></i> New Claim
                </button>
            </div>
        `;
    },

    renderMyClaims(container) {
        container.innerHTML = `
            <div class="view-header">
                <h1 class="page-title">My Claims</h1>
                <p class="subtitle">Management and history of all your transaction disputes.</p>
            </div>

            <div class="filter-bar">
                <div class="search-input">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Search by Claim ID or Transaction...">
                </div>
                <select class="filter-select">
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="approved">Approved</option>
                </select>
            </div>

            <div class="claims-list-grid">
                ${this.state.claims.map(claim => `
                    <div class="claim-card">
                        <div class="claim-card-header">
                            <span class="claim-id">${claim.id}</span>
                            <span class="status-badge status-${claim.status.toLowerCase().replace(' ', '-')}">${claim.status}</span>
                        </div>
                        <div class="claim-card-body">
                            <h3>${claim.transaction}</h3>
                            <div class="detail-row">
                                <span class="label">Date:</span>
                                <span>${claim.date}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Amount:</span>
                                <strong>$${claim.amount.toFixed(2)}</strong>
                            </div>
                        </div>
                        <div class="claim-card-footer">
                            <button class="btn btn-outline small" onclick="alert('View Details for ${claim.id}')">Details</button>
                            ${(claim.status === 'Open' || claim.status === 'In Progress') ? 
                              `<button class="btn btn-ghost small text-danger" onclick="App.cancelClaim('${claim.id}')">Cancel</button>` : 
                              ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    cancelClaim(id) {
        if(confirm(`Are you sure you want to cancel claim ${id}? This is a soft-delete; the record will remain viewable as 'Cancelled'.`)) {
            const claim = this.state.claims.find(c => c.id === id);
            if (claim) {
                claim.status = 'Cancelled';
                this.renderMyClaims(document.getElementById('viewContainer'));
            }
        }
    },

    renderCreateClaim(container) {
        this.state.wizard.step = 1;
        this.renderWizardStep(container);
    },

    renderWizardStep(container) {
        const step = this.state.wizard.step;
        
        container.innerHTML = `
            <div class="wizard-header">
                <h1 class="page-title">Create New Claim</h1>
                <div class="wizard-stepper">
                    <div class="step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}">1</div>
                    <div class="step-line"></div>
                    <div class="step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}">2</div>
                    <div class="step-line"></div>
                    <div class="step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}">3</div>
                    <div class="step-line"></div>
                    <div class="step ${step >= 4 ? 'active' : ''}">4</div>
                </div>
            </div>

            <div class="wizard-content" id="wizardContent">
                ${this.getWizardStepHTML(step)}
            </div>
        `;

        if (step === 2) this.bindTransactionFilters();
    },

    getWizardStepHTML(step) {
        switch(step) {
            case 1:
                return `
                    <div class="step-form">
                        <h2>Select Dispute Type</h2>
                        <p class="step-instruction">What kind of transaction would you like to dispute today?</p>
                        
                        <div class="option-grid">
                            <div class="option-card ${this.state.wizard.data.type === 'Card' ? 'selected' : ''}" onclick="App.selectWizardType('Card')">
                                <div class="option-icon"><i class="fas fa-credit-card"></i></div>
                                <h3>Card Transaction</h3>
                                <p>Charges on your NotDFC Debit or Credit card.</p>
                            </div>
                            <div class="option-card ${this.state.wizard.data.type === 'Non-Card' ? 'selected' : ''}" onclick="App.selectWizardType('Non-Card')">
                                <div class="option-icon"><i class="fas fa-university"></i></div>
                                <h3>Non-Card Dispute</h3>
                                <p>Bank transfers, bill payments, or direct debits.</p>
                            </div>
                        </div>

                        <div class="wizard-actions">
                            <div></div>
                            <button class="btn btn-primary" ${!this.state.wizard.data.type ? 'disabled' : ''} onclick="App.nextStep()">Next <i class="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
                `;
            case 2:
                const filtered = this.state.transactions.filter(t => t.type === this.state.wizard.data.type);
                return `
                    <div class="step-form">
                        <h2>Select Transaction</h2>
                        <p class="step-instruction">Select the settled transaction you'd like to dispute.</p>
                        
                        <div class="filter-bar">
                            <div class="search-input">
                                <i class="fas fa-search"></i>
                                <input type="text" id="txnSearch" placeholder="Search biller, amount, or ID...">
                            </div>
                            <input type="date" id="dateFilter" class="filter-select">
                        </div>

                        <div class="txn-infinite-list" id="txnList">
                            ${this.renderTxnCards(filtered)}
                        </div>

                        <div class="wizard-actions">
                            <button class="btn btn-outline" onclick="App.prevStep()"><i class="fas fa-arrow-left"></i> Back</button>
                            <button class="btn btn-primary" id="txnNext" ${!this.state.wizard.data.transactionId ? 'disabled' : ''} onclick="App.nextStep()">Next <i class="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
                `;
            case 3:
                return `
                    <div class="step-form">
                        <h2>Dispute Details</h2>
                        <p class="step-instruction">Provide more information about why you are disputing this charge.</p>
                        
                        <div class="form-group">
                            <label>Dispute Reason</label>
                            <textarea id="reasonText" placeholder="Please describe the issue in detail...">${this.state.wizard.data.reason}</textarea>
                        </div>

                        <div class="form-group">
                            <label>Supporting Documents (Optional)</label>
                            <div class="file-drop-zone" onclick="document.getElementById('fileInput').click()">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>Click to upload evidence (PDF, JPG, PNG)</span>
                                <input type="file" id="fileInput" hidden multiple onchange="App.handleFiles(this.files)">
                            </div>
                            <div id="fileList" class="file-list">
                                ${this.state.wizard.data.files.map(f => `
                                    <div class="file-item">
                                        <i class="fas fa-file"></i>
                                        <span>${f}</span>
                                        <button class="text-danger" onclick="App.removeFile('${f}')"><i class="fas fa-times"></i></button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="wizard-actions">
                            <button class="btn btn-outline" onclick="App.prevStep()"><i class="fas fa-arrow-left"></i> Back</button>
                            <button class="btn btn-primary" onclick="App.saveDetailsAndNext()">Next <i class="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
                `;
            case 4:
                const txn = this.state.transactions.find(t => t.id === this.state.wizard.data.transactionId);
                return `
                    <div class="step-form">
                        <h2>Review & Submit</h2>
                        <p class="step-instruction">Please confirm the details below before submitting your claim.</p>
                        
                        <div class="review-card">
                            <div class="review-section">
                                <label>Transaction</label>
                                <p><strong>${txn.vendor}</strong> ($${txn.amount.toFixed(2)})</p>
                                <span>${txn.date} | ${txn.id}</span>
                            </div>
                            <div class="review-section">
                                <label>Dispute Reason</label>
                                <p>${this.state.wizard.data.reason}</p>
                            </div>
                            <div class="review-section">
                                <label>Attachments</label>
                                <p>${this.state.wizard.data.files.length > 0 ? this.state.wizard.data.files.join(', ') : 'No documents attached'}</p>
                            </div>
                        </div>

                        <div class="alert alert-info">
                            <i class="fas fa-info-circle"></i>
                            By submitting, you agree to our dispute resolution terms.
                        </div>

                        <div class="wizard-actions">
                            <button class="btn btn-outline" onclick="App.prevStep()"><i class="fas fa-arrow-left"></i> Back</button>
                            <button class="btn btn-success" onclick="App.submitClaim()"><i class="fas fa-paper-plane"></i> Submit Claim</button>
                        </div>
                    </div>
                `;
        }
    },

    selectWizardType(type) {
        this.state.wizard.data.type = type;
        this.renderWizardStep(document.getElementById('viewContainer'));
    },

    selectTransaction(id) {
        this.state.wizard.data.transactionId = id;
        document.querySelectorAll('.txn-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.txn-card[data-id="${id}"]`).classList.add('selected');
        document.getElementById('txnNext').disabled = false;
    },

    renderTxnCards(list) {
        if (list.length === 0) return '<p class="no-data">No settled transactions found matching your criteria.</p>';
        
        return list.map(t => `
            <div class="txn-card ${t.status !== 'Settled' ? 'disabled' : ''} ${this.state.wizard.data.transactionId === t.id ? 'selected' : ''}" 
                 data-id="${t.id}"
                 onclick="${t.status === 'Settled' ? `App.selectTransaction('${t.id}')` : ''}">
                <div class="txn-main">
                    <span class="txn-vendor">${t.vendor}</span>
                    <span class="txn-amount">$${t.amount.toFixed(2)}</span>
                </div>
                <div class="txn-meta">
                    <span>${t.date} | ${t.id}</span>
                    <span class="status-tag ${t.status.toLowerCase()}">${t.status}</span>
                </div>
            </div>
        `).join('');
    },

    bindTransactionFilters() {
        const searchInput = document.getElementById('txnSearch');
        const dateInput = document.getElementById('dateFilter');
        
        const filter = () => {
            const query = searchInput.value.toLowerCase();
            const dateVal = dateInput.value;
            const filtered = this.state.transactions.filter(t => {
                const matchesType = t.type === this.state.wizard.data.type;
                const matchesQuery = t.vendor.toLowerCase().includes(query) || t.id.toLowerCase().includes(query) || t.amount.toString().includes(query);
                const matchesDate = !dateVal || t.date === dateVal;
                return matchesType && matchesQuery && matchesDate;
            });
            document.getElementById('txnList').innerHTML = this.renderTxnCards(filtered);
        };

        searchInput.addEventListener('input', filter);
        dateInput.addEventListener('change', filter);
    },

    handleFiles(files) {
        const fileNames = Array.from(files).map(f => f.name);
        this.state.wizard.data.files = [...this.state.wizard.data.files, ...fileNames];
        this.renderWizardStep(document.getElementById('viewContainer'));
    },

    removeFile(name) {
        this.state.wizard.data.files = this.state.wizard.data.files.filter(f => f !== name);
        this.renderWizardStep(document.getElementById('viewContainer'));
    },

    saveDetailsAndNext() {
        this.state.wizard.data.reason = document.getElementById('reasonText').value;
        this.nextStep();
    },

    nextStep() {
        this.state.wizard.step++;
        this.renderWizardStep(document.getElementById('viewContainer'));
    },

    prevStep() {
        this.state.wizard.step--;
        this.renderWizardStep(document.getElementById('viewContainer'));
    },

    submitClaim() {
        const newId = 'CLM-' + Math.floor(10000 + Math.random() * 90000);
        const txn = this.state.transactions.find(t => t.id === this.state.wizard.data.transactionId);
        
        this.state.claims.unshift({
            id: newId,
            type: this.state.wizard.data.type,
            status: 'Open',
            date: new Date().toISOString().split('T')[0],
            transaction: txn.vendor,
            amount: txn.amount
        });

        const container = document.getElementById('viewContainer');
        container.innerHTML = `
            <div class="success-view">
                <div class="success-icon"><i class="fas fa-check-double"></i></div>
                <h1>Claim Submitted Successfully!</h1>
                <p>Your claim ID is <strong>${newId}</strong>. We've sent a confirmation email to your registered address.</p>
                <div class="success-actions">
                    <button class="btn btn-primary" onclick="App.navigateTo('dashboard')">Back to Dashboard</button>
                    <button class="btn btn-outline" onclick="App.navigateTo('my-claims')">View My Claims</button>
                </div>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
