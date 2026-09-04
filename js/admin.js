/* =========================================================
   Limos Kahvaltı — Yönetim Paneli
   ========================================================= */
(function () {
  "use strict";

  var loginScreen = document.getElementById("login-screen");
  var panel = document.getElementById("panel");

  async function api(path, options) {
    var opts = Object.assign({ headers: { "Content-Type": "application/json" } }, options || {});
    var res = await fetch(path, opts);
    var data = null;
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) {
      var err = new Error((data && data.error) || "İstek başarısız");
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function showPanel(username) {
    loginScreen.hidden = true;
    panel.hidden = false;
    document.getElementById("panel-username").textContent = username || "";
    loadUsers();
  }

  function showLogin() {
    panel.hidden = true;
    loginScreen.hidden = false;
  }

  /* ---------- Oturum kontrolü ---------- */
  async function checkSession() {
    try {
      var data = await api("/api/me");
      if (data.authenticated) { showPanel(data.username); return; }
    } catch (e) {}
    showLogin();
  }

  /* ---------- Giriş formu ---------- */
  var loginForm = document.getElementById("login-form");
  var loginError = document.getElementById("login-error");
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    loginError.hidden = true;
    var submitBtn = document.getElementById("login-submit");
    submitBtn.disabled = true;
    try {
      var username = document.getElementById("login-username").value.trim();
      var password = document.getElementById("login-password").value;
      var data = await api("/api/login", { method: "POST", body: JSON.stringify({ username: username, password: password }) });
      showPanel(data.username);
      loginForm.reset();
    } catch (err) {
      loginError.textContent = err.message || "Giriş başarısız.";
      loginError.hidden = false;
    } finally {
      submitBtn.disabled = false;
    }
  });

  /* ---------- Çıkış ---------- */
  document.getElementById("logout-btn").addEventListener("click", async function () {
    try { await api("/api/logout", { method: "POST" }); } catch (e) {}
    showLogin();
  });

  /* ---------- Sekme navigasyonu ---------- */
  var navBtns = document.querySelectorAll(".panel-nav-btn");
  navBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      navBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      document.querySelectorAll(".panel-section").forEach(function (s) { s.classList.remove("is-active"); });
      var target = document.getElementById("section-" + btn.getAttribute("data-section"));
      if (target) target.classList.add("is-active");
    });
  });

  /* ---------- QR indir ---------- */
  var qrImg = document.getElementById("qr-img");
  var qrDownload = document.getElementById("qr-download");
  qrImg.addEventListener("load", function () {
    qrDownload.href = qrImg.src;
  });

  /* ---------- Kullanıcılar ---------- */
  var usersTbody = document.getElementById("users-tbody");
  var pwModal = document.getElementById("pw-modal");
  var pwForm = document.getElementById("pw-form");
  var pwModalUsername = document.getElementById("pw-modal-username");
  var pwError = document.getElementById("pw-error");
  var pwEditingId = null;

  function fmtDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString("tr-TR", { year: "numeric", month: "short", day: "numeric" });
    } catch (e) { return ""; }
  }

  async function loadUsers() {
    try {
      var data = await api("/api/admin/users");
      var admins = data.admins || [];
      usersTbody.innerHTML = "";
      admins.forEach(function (a) {
        var tr = document.createElement("tr");

        var tdName = document.createElement("td");
        tdName.textContent = a.username;
        tr.appendChild(tdName);

        var tdDate = document.createElement("td");
        tdDate.textContent = fmtDate(a.createdAt);
        tr.appendChild(tdDate);

        var tdActions = document.createElement("td");
        tdActions.className = "actions";

        var pwBtn = document.createElement("button");
        pwBtn.type = "button";
        pwBtn.className = "btn-line";
        pwBtn.textContent = "Şifre değiştir";
        pwBtn.addEventListener("click", function () { openPwModal(a._id, a.username); });
        tdActions.appendChild(pwBtn);

        var delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn-danger";
        delBtn.textContent = "Sil";
        delBtn.addEventListener("click", function () { deleteUser(a._id, a.username); });
        tdActions.appendChild(delBtn);

        tr.appendChild(tdActions);
        usersTbody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
    }
  }

  var addUserForm = document.getElementById("add-user-form");
  var addUserError = document.getElementById("add-user-error");
  addUserForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    addUserError.hidden = true;
    try {
      var username = document.getElementById("new-username").value.trim();
      var password = document.getElementById("new-password").value;
      await api("/api/admin/users", { method: "POST", body: JSON.stringify({ username: username, password: password }) });
      addUserForm.reset();
      loadUsers();
    } catch (err) {
      addUserError.textContent = err.message || "Eklenemedi.";
      addUserError.hidden = false;
    }
  });

  function openPwModal(id, username) {
    pwEditingId = id;
    pwModalUsername.textContent = username;
    pwError.hidden = true;
    document.getElementById("pw-new").value = "";
    pwModal.hidden = false;
  }
  function closePwModal() { pwModal.hidden = true; pwEditingId = null; }

  document.querySelectorAll("[data-modal-close]").forEach(function (el) {
    el.addEventListener("click", closePwModal);
  });

  pwForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    pwError.hidden = true;
    try {
      var password = document.getElementById("pw-new").value;
      await api("/api/admin/users", { method: "PUT", body: JSON.stringify({ id: pwEditingId, password: password }) });
      closePwModal();
    } catch (err) {
      pwError.textContent = err.message || "Değiştirilemedi.";
      pwError.hidden = false;
    }
  });

  async function deleteUser(id, username) {
    if (!window.confirm('"' + username + '" adlı admini silmek istediğine emin misin?')) return;
    try {
      await api("/api/admin/users", { method: "DELETE", body: JSON.stringify({ id: id }) });
      loadUsers();
    } catch (err) {
      window.alert(err.message || "Silinemedi.");
    }
  }

  checkSession();
})();
