
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute(
      "aria-expanded",
      String(!isExpanded)
    );

    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuToggle.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    }
  });
}

/* Email popup: the address is stored encoded (base64) in data-email and only
   decoded on click, so it never appears as plain text in the page source. */
document.querySelectorAll("[data-email]").forEach((trigger) => {
  const address = atob(trigger.dataset.email);

  trigger.addEventListener("click", () => {
    const dialog = document.createElement("dialog");
    dialog.className = "email-dialog";
    dialog.setAttribute("aria-label", "Email address");

    const label = document.createElement("p");
    label.className = "eyebrow";
    label.textContent = "EMAIL";

    const text = document.createElement("p");
    text.className = "email-address";
    text.textContent = address;

    const actions = document.createElement("div");
    actions.className = "link-row";

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "button button-primary";
    copy.textContent = "Copy";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(address);
        copy.textContent = "Copied ✓";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(text);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        copy.textContent = "Press Ctrl+C";
      }
    });

    const mail = document.createElement("a");
    mail.className = "button button-outline";
    mail.href = "mailto:" + address;
    mail.textContent = "Open mail app";

    const close = document.createElement("button");
    close.type = "button";
    close.className = "button button-outline";
    close.textContent = "Close";
    close.addEventListener("click", () => dialog.close());

    actions.append(copy, mail, close);
    dialog.append(label, text, actions);

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => dialog.remove());

    document.body.append(dialog);
    dialog.showModal();
  });
});

/* Team group headcounts: keep each "(n)" in sync with the member cards below it. */
document.querySelectorAll(".group-count").forEach((count) => {
  const grid = count.closest(".group-title").nextElementSibling;
  if (grid) {
    count.textContent = `(${grid.querySelectorAll(".member-card").length})`;
  }
});

/* Publications filter: show one type at a time, hide year sections left empty,
   and renumber what remains. Each item carries data-type="journal|conference|patent". */
const pubFilter = document.querySelector(".pub-filter");

if (pubFilter) {
  const buttons = [...pubFilter.querySelectorAll("button")];
  const items = [...document.querySelectorAll(".publication-item")];
  const yearSections = [...document.querySelectorAll("[data-year]")];

  buttons.forEach((button) => {
    const type = button.dataset.filter;
    const total = type === "all"
      ? items.length
      : items.filter((item) => item.dataset.type === type).length;
    button.querySelector(".filter-count").textContent = total;
  });

  const applyFilter = (type) => {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === type));
    });

    items.forEach((item) => {
      item.hidden = type !== "all" && item.dataset.type !== type;
    });

    yearSections.forEach((section) => {
      const visible = [...section.querySelectorAll(".publication-item:not([hidden])")];
      section.hidden = visible.length === 0;

      visible.forEach((item, index) => {
        item.querySelector(".publication-index").textContent =
          String(index + 1).padStart(2, "0");
      });

      const link = document.querySelector(`.year-index a[href="#${section.id}"]`);
      if (link) link.hidden = section.hidden;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  });

  applyFilter("all");
}

/* News filter: show one category at a time (data-category on each .news-row)
   and renumber the visible rows. */
const newsFilter = document.querySelector(".news-filter");

if (newsFilter) {
  const buttons = [...newsFilter.querySelectorAll("button")];
  const rows = [...document.querySelectorAll(".news-row")];

  buttons.forEach((button) => {
    const category = button.dataset.filter;
    const total = category === "all"
      ? rows.length
      : rows.filter((row) => row.dataset.category === category).length;
    button.querySelector(".filter-count").textContent = total;
  });

  const applyNewsFilter = (category) => {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === category));
    });

    let shown = 0;
    rows.forEach((row) => {
      row.hidden = category !== "all" && row.dataset.category !== category;
      if (!row.hidden) {
        shown += 1;
        row.querySelector(".news-row-index").textContent =
          String(shown).padStart(2, "0");
      }
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyNewsFilter(button.dataset.filter));
  });

  applyNewsFilter("all");
}
