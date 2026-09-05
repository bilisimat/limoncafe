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
    // QR görseli oturum açılmadan İSTENMEZ — sayfa yüklenir yüklenmez
    // src atanırsa giriş öncesi 401 döner ve görsel kalıcı olarak kırık kalır.
    var qrImg = document.getElementById("qr-img");
    if (qrImg && !qrImg.src) qrImg.src = "/api/admin/qr";
    loadUsers();
    loadMenu();
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

  /* ---------- Menü: kategoriler + ürünler ---------- */
  var CATS = [];
  var editingCatId = null;
  var editingItemId = null;

  var catTbody = document.getElementById("cat-tbody");
  var addCatForm = document.getElementById("add-cat-form");
  var catFormError = document.getElementById("cat-form-error");

  var itemTbody = document.getElementById("item-tbody");
  var addItemForm = document.getElementById("add-item-form");
  var itemFormError = document.getElementById("item-form-error");
  var itemCatFilter = document.getElementById("item-cat-filter");
  var itemCatSelect = document.getElementById("item-cat");

  function fillCatSelects() {
    [itemCatFilter, itemCatSelect].forEach(function (sel) {
      if (!sel) return;
      var current = sel.value;
      sel.innerHTML = "";
      if (sel === itemCatFilter) {
        var allOpt = document.createElement("option");
        allOpt.value = "";
        allOpt.textContent = "Tümü";
        sel.appendChild(allOpt);
      }
      CATS.forEach(function (c) {
        var opt = document.createElement("option");
        opt.value = c.slug;
        opt.textContent = c.name.tr;
        sel.appendChild(opt);
      });
      if (current) sel.value = current;
    });
  }

  function resetCatForm() {
    editingCatId = null;
    addCatForm.reset();
    addCatForm.querySelector("button[type=submit]").textContent = "Ekle ve çevir";
    catFormError.hidden = true;
  }
  function resetItemForm() {
    editingItemId = null;
    var keepCat = itemCatSelect.value;
    addItemForm.reset();
    itemCatSelect.value = keepCat;
    addItemForm.querySelector("button[type=submit]").textContent = "Ekle ve çevir";
    itemFormError.hidden = true;
  }

  async function loadMenu() {
    try {
      var data = await api("/api/admin/menu/categories");
      CATS = (data.categories || []).sort(function (a, b) { return a.order - b.order; });
      fillCatSelects();
      renderCatTable();
      loadItems();
    } catch (err) {
      console.error(err);
    }
  }

  function renderCatTable() {
    catTbody.innerHTML = "";
    CATS.forEach(function (c) {
      var tr = document.createElement("tr");

      var tdName = document.createElement("td");
      tdName.innerHTML = escapeHtml(c.name.tr) + '<br><span class="cell-sub">' + escapeHtml(c.name.en) + "</span>";
      tr.appendChild(tdName);

      var tdSlug = document.createElement("td");
      tdSlug.textContent = c.slug;
      tr.appendChild(tdSlug);

      var tdActions = document.createElement("td");
      tdActions.className = "actions";

      var editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn-line";
      editBtn.textContent = "Düzenle";
      editBtn.addEventListener("click", function () { startEditCat(c); });
      tdActions.appendChild(editBtn);

      var delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn-danger";
      delBtn.textContent = "Sil";
      delBtn.addEventListener("click", function () { deleteCat(c); });
      tdActions.appendChild(delBtn);

      tr.appendChild(tdActions);
      catTbody.appendChild(tr);
    });
  }

  function startEditCat(c) {
    editingCatId = c._id;
    document.getElementById("cat-name").value = c.name.tr;
    document.getElementById("cat-listdesc").value = c.listDesc.tr;
    document.getElementById("cat-blurb").value = c.blurb.tr;
    document.getElementById("cat-image").value = c.image || "";
    addCatForm.querySelector("button[type=submit]").textContent = "Güncelle ve yeniden çevir";
    addCatForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function deleteCat(c) {
    if (!window.confirm('"' + c.name.tr + '" kategorisini ve içindeki tüm ürünleri silmek istediğine emin misin?')) return;
    try {
      await api("/api/admin/menu/categories/" + c._id, { method: "DELETE" });
      if (editingCatId === c._id) resetCatForm();
      loadMenu();
    } catch (err) {
      window.alert(err.message || "Silinemedi.");
    }
  }

  addCatForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    catFormError.hidden = true;
    var submitBtn = addCatForm.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    var body = {
      name: document.getElementById("cat-name").value.trim(),
      listDesc: document.getElementById("cat-listdesc").value.trim(),
      blurb: document.getElementById("cat-blurb").value.trim(),
      image: document.getElementById("cat-image").value.trim(),
    };
    try {
      if (editingCatId) {
        await api("/api/admin/menu/categories/" + editingCatId, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await api("/api/admin/menu/categories", { method: "POST", body: JSON.stringify(body) });
      }
      resetCatForm();
      loadMenu();
    } catch (err) {
      catFormError.textContent = err.message || "Kaydedilemedi.";
      catFormError.hidden = false;
    } finally {
      submitBtn.disabled = false;
    }
  });

  async function loadItems() {
    try {
      var filter = itemCatFilter.value ? "?category=" + encodeURIComponent(itemCatFilter.value) : "";
      var data = await api("/api/admin/menu/items" + filter);
      renderItemTable(data.items || []);
    } catch (err) {
      console.error(err);
    }
  }
  itemCatFilter.addEventListener("change", loadItems);

  function renderItemTable(items) {
    items.sort(function (a, b) { return a.order - b.order; });
    itemTbody.innerHTML = "";
    items.forEach(function (it) {
      var tr = document.createElement("tr");

      var tdName = document.createElement("td");
      tdName.innerHTML = escapeHtml(it.name.tr) + '<br><span class="cell-sub">' + escapeHtml(it.name.en) + "</span>";
      tr.appendChild(tdName);

      var tdPrice = document.createElement("td");
      tdPrice.textContent = it.price || "—";
      tr.appendChild(tdPrice);

      var tdActions = document.createElement("td");
      tdActions.className = "actions";

      var editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn-line";
      editBtn.textContent = "Düzenle";
      editBtn.addEventListener("click", function () { startEditItem(it); });
      tdActions.appendChild(editBtn);

      var delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn-danger";
      delBtn.textContent = "Sil";
      delBtn.addEventListener("click", function () { deleteItem(it); });
      tdActions.appendChild(delBtn);

      tr.appendChild(tdActions);
      itemTbody.appendChild(tr);
    });
  }

  function startEditItem(it) {
    editingItemId = it._id;
    itemCatSelect.value = it.categorySlug;
    document.getElementById("item-name").value = it.name.tr;
    document.getElementById("item-desc").value = it.desc.tr;
    document.getElementById("item-price").value = it.price || "";
    document.getElementById("item-img").value = it.img || "";
    document.getElementById("item-img-thumb").value = it.imgThumb || "";
    addItemForm.querySelector("button[type=submit]").textContent = "Güncelle ve yeniden çevir";
    addItemForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function deleteItem(it) {
    if (!window.confirm('"' + it.name.tr + '" ürününü silmek istediğine emin misin?')) return;
    try {
      await api("/api/admin/menu/items/" + it._id, { method: "DELETE" });
      if (editingItemId === it._id) resetItemForm();
      loadItems();
    } catch (err) {
      window.alert(err.message || "Silinemedi.");
    }
  }

  addItemForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    itemFormError.hidden = true;
    var submitBtn = addItemForm.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    var body = {
      categorySlug: itemCatSelect.value,
      name: document.getElementById("item-name").value.trim(),
      desc: document.getElementById("item-desc").value.trim(),
      price: document.getElementById("item-price").value.trim(),
      img: document.getElementById("item-img").value.trim(),
      imgThumb: document.getElementById("item-img-thumb").value.trim(),
    };
    try {
      if (editingItemId) {
        await api("/api/admin/menu/items/" + editingItemId, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await api("/api/admin/menu/items", { method: "POST", body: JSON.stringify(body) });
      }
      resetItemForm();
      loadItems();
    } catch (err) {
      itemFormError.textContent = err.message || "Kaydedilemedi.";
      itemFormError.hidden = false;
    } finally {
      submitBtn.disabled = false;
    }
  });

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  checkSession();
})();
