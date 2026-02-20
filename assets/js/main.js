(async function mountNavbar() {
  try {
    const res = await fetch("navbar.html");
    const html = await res.text();
    const mount = document.getElementById("navbar-mount");
    mount.innerHTML = html;

    const toggle = mount.querySelector(".nav__toggle");
    const menu = mount.querySelector("#nav-menu");
    toggle?.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    const current = location.pathname.split("/").pop() || "index.html";
    const tick = setInterval(() => {
      const menuLinks = mount?.querySelectorAll(".nav__menu a");
      if (!menuLinks || menuLinks.length === 0) return;
      clearInterval(tick);
      menuLinks.forEach((a) => {
        const href = a.getAttribute("href") || "";
        const isHome =
          href.startsWith("index.html") && current === "index.html";
        const match = (href && href.endsWith(current)) || isHome;
        if (match) {
          a.classList.add("active");
          a.setAttribute("aria-current", "page");
        }
      });
    }, 40);
  } catch (e) {
    console.log("[v0] gagal memuat navbar:", e);
  }
})();

const roles = [
  "Frontend Developer",
  "UI/UX Design",
  "Web Development",
]; // EDIT: ganti daftar kata di sini
let i = 0,
  j = 0,
  deleting = false;
const el = document.getElementById("typing");

function type() {
  const current = roles[i % roles.length];
  if (!deleting) {
    el.textContent = current.slice(0, ++j);
    if (j === current.length) {
      deleting = true;
      setTimeout(type, 1200);
      return;
    }
  } else {
    el.textContent = current.slice(0, --j);
    if (j === 0) {
      deleting = false;
      i++;
    }
  }
  const speed = deleting ? 40 : 70;
  setTimeout(type, speed);
}
if (el) type();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const obs3D = new IntersectionObserver(
  (ents) =>
    ents.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    }),
  { threshold: 0.2 }
);
document.querySelectorAll(".reveal-3d").forEach((el) => obs3D.observe(el))(
  function progressObserver() {
    const items = document.querySelectorAll(".progress");
    if (!items.length) return;
    // Reset awal
    items.forEach((p) => {
      const bar = p.querySelector(".bar");
      if (bar) {
        bar.style.width = "0%";
      }
    });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const p = e.target;
          const bar = p.querySelector(".bar");
          if (!bar) return;
          if (e.isIntersecting) {
            const level = Math.max(
              0,
              Math.min(100, Number(p.dataset.level || 0))
            );
            requestAnimationFrame(() => {
              bar.style.width = level + "%";
            });
          } else {
            // Kembalikan jika keluar layar (opsional)
            bar.style.width = "0%";
          }
        });
      },
      { threshold: 0.45 }
    );
    items.forEach((p) => obs.observe(p));
  }
)();
(function tabsInit() {
  const tabs = document.querySelectorAll(".tabs .tab");
  if (!tabs.length) return;
  tabs.forEach((btn) =>
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".tabs .tab")
        .forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
      const id = btn.dataset.tab;
      document
        .querySelectorAll(".tab-panel")
        .forEach((p) => p.classList.remove("show"));
      const panel = document.getElementById(`tab-${id}`);
      panel?.classList.add("show");
    })
  );
})();
(function sliderInit() {
  const sliders = document.querySelectorAll("[data-slider]");
  sliders.forEach((s) => {
    const imgs = s.querySelectorAll("img");
    if (!imgs.length) return;
    let idx = 0;
    function show(i) {
      imgs.forEach((im, k) => im.classList.toggle("active", k === i));
    }
    show(idx);
    s.querySelector("[data-prev]")?.addEventListener("click", () => {
      idx = (idx - 1 + imgs.length) % imgs.length;
      show(idx);
    });
    s.querySelector("[data-next]")?.addEventListener("click", () => {
      idx = (idx + 1) % imgs.length;
      show(idx);
    });
  });
})();
(function tiltInit() {
  const cards = document.querySelectorAll("[data-tilt]");
  const max = 10;
  cards.forEach((card) => {
    let rect;
    function onMove(e) {
      rect = rect || card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y - rect.height / 2) / rect.height) * -max;
      const ry = ((x - rect.width / 2) / rect.width) * max;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    }
    function reset() {
      card.style.transform = "";
      rect = undefined;
    }
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", reset);
    card.addEventListener("touchmove", (ev) => {
      const t = ev.touches[0];
      onMove(t);
    });
    card.addEventListener("touchend", reset);
  });
})();
(function contactEnhance() {
  const cform = document.getElementById("contact-form");
  if (cform) {
    cform.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(cform);
      const name = data.get("name");
      const email = data.get("email");
      const message = data.get("message");
      const to = (
        document.querySelector('a[href^="mailto:"]')?.getAttribute("href") ||
        "mailto:you@example.com"
      ).replace("mailto:", "");
      const subject = encodeURIComponent(`[Portfolio] Message from ${name}`);
      const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }

  const listKey = "v0-comments";
  const ul = document.getElementById("comments");
  const count = document.getElementById("c-count");
  function load() {
    try {
      return JSON.parse(localStorage.getItem(listKey) || "[]");
    } catch {
      return [];
    }
  }
  function save(items) {
    localStorage.setItem(listKey, JSON.stringify(items));
  }
  function render() {
    if (!ul) return;
    const items = load();
    ul.innerHTML = "";
    items.forEach((it) => {
      const li = document.createElement("li");
      li.className = "comment";
      li.innerHTML = `
        <img class="comment__avatar" src="${
          it.photo || "assets/images/profile.jpg"
        }" alt="avatar" />
        <div class="comment__body">
          <strong>${it.name}</strong>
          <p>${it.msg}</p>
          <span class="muted small">${new Date(it.ts).toLocaleString()}</span>
        </div>`;
      ul.appendChild(li);
    });
    if (count) count.textContent = String(items.length);
  }
  const cmtForm = document.getElementById("comment-form");
  if (cmtForm) {
    cmtForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(cmtForm);
      const name = String(fd.get("cname") || "").trim();
      const msg = String(fd.get("cmsg") || "").trim();
      let photo = "";
      const file = fd.get("cphoto");
      if (file && file.size) {
        photo = await new Promise((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.readAsDataURL(file);
        });
      }
      const items = load();
      items.unshift({ name, msg, photo, ts: Date.now() });
      save(items);
      cmtForm.reset();
      render();
    });
    render();
  }
})();