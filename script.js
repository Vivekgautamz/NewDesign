// Utility: convert hex to rgba
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Apply chosen brand colors across the UI
function applyBrandColors(primary, secondary, accent) {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-secondary', secondary);
    root.style.setProperty('--color-accent', accent);
    root.style.setProperty('--color-primary-light', hexToRgba(primary, 0.12));
    root.style.setProperty('--color-secondary-light', hexToRgba(secondary, 0.06));
}

// Build swatches + header text
function refreshHeader() {
    const nameEl = document.querySelector('.client-name-display');
    const swatchContainer = document.querySelector('.swatches');

    if (nameEl) {
        nameEl.textContent = (nameEl.textContent || '').replace(/\s+/g, ' ').trim();
    }

    if (swatchContainer) {
        swatchContainer.innerHTML = '';
        ['primary-color', 'secondary-color', 'accent-color'].forEach(id => {
            const inp = document.getElementById(id);
            if (inp) {
                const swatch = document.createElement('div');
                swatch.className = 'swatch';
                swatch.style.backgroundColor = inp.value;
                swatchContainer.appendChild(swatch);
            }
        });
    }
}

function wireClientNameField() {
    const nameEl = document.querySelector('.client-name-display');
    if (!nameEl) return;

    nameEl.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nameEl.blur();
        }
    });

    nameEl.addEventListener('blur', () => {
        nameEl.textContent = (nameEl.textContent || '').replace(/\s+/g, ' ').trim();
    });
}

// Checklist helpers
function createChecklistItem(text = 'New Task', checked = false) {
    const li = document.createElement('li');
    li.innerHTML = `
        <label>
            <input type="checkbox" ${checked ? 'checked' : ''}>
            <span class="checklist-text" contenteditable="false">${text}</span>
        </label>
        <button class="checklist-menu">...</button>
        <div class="checklist-dropdown" style="display:none;">
            <button class="edit-item">Edit</button>
            <button class="delete-item">Delete</button>
            <button class="insert-item">Insert Below</button>
        </div>
    `;
    return li;
}

function attachChecklistHandlers(li) {
    const menu = li.querySelector('.checklist-menu');
    const dropdown = li.querySelector('.checklist-dropdown');

    menu?.addEventListener('click', e => {
        e.stopPropagation();
        document.querySelectorAll('.checklist-dropdown').forEach(d => d.style.display = 'none');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    dropdown?.addEventListener('click', e => {
        const action = e.target.classList;
        if (action.contains('edit-item')) {
            const text = li.querySelector('.checklist-text');
            text.contentEditable = true;
            text.focus();
            dropdown.style.display = 'none';
        }
        if (action.contains('delete-item')) {
            li.remove();
        }
        if (action.contains('insert-item')) {
            const newLi = createChecklistItem();
            li.after(newLi);
            attachChecklistHandlers(newLi);
            dropdown.style.display = 'none';
        }
    });

    li.querySelector('.checklist-text')?.addEventListener('blur', e => {
        e.target.contentEditable = false;
    });
}

// Notes
function wireNotes() {
    const notesArea = document.getElementById('notes-area');
    const editBtn = document.getElementById('edit-notes');
    const saveBtn = document.getElementById('save-notes');
    const clearBtn = document.getElementById('delete-notes');
    if (!notesArea || !editBtn || !saveBtn || !clearBtn) return;

    editBtn.addEventListener('click', () => {
        notesArea.disabled = false;
        notesArea.focus();
    });
    saveBtn.addEventListener('click', () => {
        notesArea.disabled = true;
        localStorage.setItem('clientNotes', notesArea.value);
    });
    clearBtn.addEventListener('click', () => {
        notesArea.value = '';
        notesArea.disabled = true;
        localStorage.removeItem('clientNotes');
    });

    const saved = localStorage.getItem('clientNotes');
    if (saved) notesArea.value = saved;
    notesArea.disabled = true;
}

// Document uploads
function wireUploads() {
    const docUpload = document.getElementById('doc-upload');
    const uploadedFiles = document.getElementById('uploaded-files');
    if (!docUpload || !uploadedFiles) return;

    docUpload.addEventListener('change', e => {
        uploadedFiles.innerHTML = '';
        Array.from(e.target.files).forEach(file => {
            const row = document.createElement('div');
            row.textContent = file.name;
            uploadedFiles.appendChild(row);
        });
        simulateUpload();
    });
}

function simulateUpload() {
    const fill = document.querySelector('.progress-fill');
    const text = document.querySelector('.progress-text');
    if (!fill || !text) return;
    let pct = 0;
    const interval = setInterval(() => {
        pct += Math.random() * 22;
        if (pct >= 100) {
            pct = 100;
            clearInterval(interval);
        }
        fill.style.width = `${pct}%`;
        text.textContent = `${Math.floor(pct)}% complete`;
    }, 200);
}

// Color pickers
function wireBrandColors() {
    ['primary-color', 'secondary-color', 'accent-color'].forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener('input', () => {
            const code = document.getElementById(`${id.split('-')[0]}-code`);
            if (code) code.textContent = input.value;
            const primary = document.getElementById('primary-color').value;
            const secondary = document.getElementById('secondary-color').value;
            const accent = document.getElementById('accent-color').value;
            applyBrandColors(primary, secondary, accent);
            refreshHeader();
        });
    });
}

// Client load/save
function getClientData(key) {
    try {
        const parsed = JSON.parse(localStorage.getItem(key));
        if (!parsed || typeof parsed !== 'object') return null;
        if (typeof parsed.name !== 'string') return null;
        if (!Array.isArray(parsed.checklist)) return null;
        return parsed;
    } catch {
        return null;
    }
}

function updateClientList() {
    const select = document.getElementById('load-client');
    if (!select) return;
    select.innerHTML = '<option value="">Load Client</option>';
    Object.keys(localStorage).sort().forEach(key => {
        if (!getClientData(key)) return;
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = key;
        select.appendChild(opt);
    });
}

function wireClientActions() {
    const saveBtn = document.getElementById('save-client');
    const newBtn = document.getElementById('new-client');
    const loadSelect = document.getElementById('load-client');
    const logoUpload = document.getElementById('logo-upload');

    if (logoUpload) {
        logoUpload.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                const logoDiv = document.getElementById('client-logo');
                logoDiv.style.backgroundImage = `url(${ev.target.result})`;
                logoDiv.style.backgroundSize = 'contain';
                logoDiv.style.backgroundRepeat = 'no-repeat';
                logoDiv.style.backgroundPosition = 'center';
                logoDiv.textContent = '';
                logoDiv.dataset.logoData = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    saveBtn?.addEventListener('click', () => {
        const nameEl = document.querySelector('.client-name-display');
        const name = (nameEl?.textContent || '').replace(/\s+/g, ' ').trim();
        if (!name) {
            alert('Please enter your website/client name.');
            return;
        }
        nameEl.textContent = name;

        const data = {
            name,
            logo: document.getElementById('client-logo').dataset.logoData || '',
            primaryColor: document.getElementById('primary-color').value,
            secondaryColor: document.getElementById('secondary-color').value,
            accentColor: document.getElementById('accent-color').value,
            notes: document.getElementById('notes-area')?.value || '',
            checklist: Array.from(document.querySelectorAll('#checklist-initial input[type="checkbox"]')).map(cb => cb.checked)
        };

        localStorage.setItem(name, JSON.stringify(data));
        updateClientList();
        refreshHeader();
        applyBrandColors(data.primaryColor, data.secondaryColor, data.accentColor);
        alert('Client saved successfully!');
    });

    loadSelect?.addEventListener('change', function () {
        const key = this.value;
        if (!key) return;
        const data = getClientData(key);
        if (!data) return;

        const nameEl = document.querySelector('.client-name-display');
        if (nameEl) nameEl.textContent = data.name;
        const logoDiv = document.getElementById('client-logo');
        if (data.logo) {
            logoDiv.style.backgroundImage = `url(${data.logo})`;
            logoDiv.style.backgroundSize = 'contain';
            logoDiv.style.backgroundRepeat = 'no-repeat';
            logoDiv.style.backgroundPosition = 'center';
            logoDiv.textContent = '';
            logoDiv.dataset.logoData = data.logo;
        } else {
            logoDiv.style.backgroundImage = '';
            logoDiv.textContent = 'Drop logo or click to upload';
            logoDiv.dataset.logoData = '';
        }

        document.getElementById('primary-color').value = data.primaryColor;
        document.getElementById('primary-code').textContent = data.primaryColor;
        document.getElementById('secondary-color').value = data.secondaryColor;
        document.getElementById('secondary-code').textContent = data.secondaryColor;
        document.getElementById('accent-color').value = data.accentColor;
        document.getElementById('accent-code').textContent = data.accentColor;
        document.getElementById('notes-area').value = data.notes;

        const checkboxes = document.querySelectorAll('#checklist-initial input[type="checkbox"]');
        data.checklist.forEach((checked, idx) => { if (checkboxes[idx]) checkboxes[idx].checked = checked; });

        refreshHeader();
        applyBrandColors(data.primaryColor, data.secondaryColor, data.accentColor);
    });

    newBtn?.addEventListener('click', () => window.open(window.location.pathname, '_blank'));
}

// Preview loader + device toggles
function wirePreview() {
    const previewInfo = document.querySelector('.preview-info');
    const previewInput = document.getElementById('preview-url');
    const previewBtn = document.getElementById('load-preview');
    const previewFrame = document.getElementById('preview-frame') || document.getElementById('website-preview');
    const iframeError = document.getElementById('iframe-error');
    const deviceButtons = document.querySelectorAll('.device-buttons button');

    if (!previewFrame) return;

    function showError() { if (iframeError) iframeError.style.display = 'flex'; }
    function hideError() { if (iframeError) iframeError.style.display = 'none'; }

    function loadPreview() {
        let url = previewInput.value.trim();
        hideError();
        if (!url) {
            previewInfo.textContent = 'Enter a valid address to preview.';
            return;
        }
        if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
        previewFrame.src = url;
        previewInfo.textContent = `Previewing ${url}`;
        let loaded = false;
        previewFrame.onload = () => { loaded = true; hideError(); };
        setTimeout(() => { if (!loaded) showError(); }, 2000);
    }

    previewBtn?.addEventListener('click', loadPreview);
    previewInput?.addEventListener('keydown', e => { if (e.key === 'Enter') loadPreview(); });

    deviceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            deviceButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mode = btn.id.replace('-btn', '');
            previewFrame.className = `${mode}-view`;
        });
    });
}

// Floating left panel toggle
function wireFloatingPanel() {
    const panel = document.getElementById('left-panel');
    const toggle = document.getElementById('left-panel-toggle');
    const backdrop = document.getElementById('panel-backdrop');
    if (!panel || !toggle) return;

    function saveState(open) {
        localStorage.setItem('leftPanelOpen', open ? '1' : '0');
    }

    function setOpen(open) {
        document.body.classList.toggle('panel-open', open);
        document.body.classList.toggle('panel-folded', !open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Hide Panel' : 'Show Panel';
    }

    const saved = localStorage.getItem('leftPanelOpen');
    const openByDefault = saved === null ? true : saved === '1';
    setOpen(openByDefault);

    toggle.addEventListener('click', () => {
        const nextOpen = document.body.classList.contains('panel-folded');
        setOpen(nextOpen);
        saveState(nextOpen);
    });

    backdrop?.addEventListener('click', () => {
        setOpen(false);
        saveState(false);
    });

    window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && document.body.classList.contains('panel-open')) {
            setOpen(false);
            saveState(false);
        }
    });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    wireFloatingPanel();
    wireClientNameField();
    wireNotes();
    wireUploads();
    wireBrandColors();
    wireClientActions();
    wirePreview();

    updateClientList();
    refreshHeader();

    // apply defaults from color pickers
    const primary = document.getElementById('primary-color')?.value || '#0f766e';
    const secondary = document.getElementById('secondary-color')?.value || '#0f172a';
    const accent = document.getElementById('accent-color')?.value || '#f59e0b';
    applyBrandColors(primary, secondary, accent);

    const checklist = document.getElementById('checklist-initial');
    checklist?.querySelectorAll('li').forEach(attachChecklistHandlers);

    document.getElementById('add-checklist-item')?.addEventListener('click', () => {
        const li = createChecklistItem();
        checklist.appendChild(li);
        attachChecklistHandlers(li);
    });
});

