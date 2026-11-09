/**
 * Baseline preferences specimen — interactive reference only.
 * Spring params describe a tension/friction model for documentation parity.
 */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // --- tiny tension/friction spring (mass = 1) ---
  function springTo(opts) {
    const {
      from,
      to,
      tension,
      friction,
      onUpdate,
      onComplete,
      restDelta = 0.001,
      restSpeed = 0.01,
    } = opts;

    let value = from;
    let velocity = 0;
    let frame = 0;
    let last = performance.now();
    let cancelled = false;

    const tick = (now) => {
      if (cancelled) return;
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      const force = -tension * (value - to);
      const damping = -friction * velocity;
      const accel = force + damping;
      velocity += accel * dt;
      value += velocity * dt;

      onUpdate(value);

      if (Math.abs(value - to) < restDelta && Math.abs(velocity) < restSpeed) {
        onUpdate(to);
        onComplete && onComplete();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      onUpdate(to);
      onComplete && onComplete();
      return () => {
        cancelled = true;
      };
    }

    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }

  // --- Hero word entrance ---
  function prepareHero() {
    const title = document.querySelector("[data-hero-title]");
    if (!title) return;
    const words = title.dataset.words.split(" ");
    title.textContent = "";
    words.forEach((word) => {
      const clip = document.createElement("span");
      clip.className = "word-clip";
      clip.style.marginRight = "0.18em";
      const inner = document.createElement("span");
      inner.className = "word-inner";
      inner.textContent = word;
      clip.appendChild(inner);
      title.appendChild(clip);
    });
    requestAnimationFrame(() => title.classList.add("is-ready"));
  }

  // --- Fullscreen nav ---
  const overlay = document.querySelector("[data-nav-overlay]");
  const backdrop = document.querySelector("[data-nav-backdrop]");
  const panel = document.querySelector("[data-nav-panel]");
  const trigger = document.querySelector("[data-nav-open]");
  const closeBtn = document.querySelector("[data-nav-close]");
  const closeIcon = document.querySelector("[data-nav-close-icon]");
  const links = [...document.querySelectorAll("[data-nav-link]")];
  const pageRoot = document.querySelector("[data-page-root]");

  let open = false;
  let mounted = false;
  let generation = 0;
  const cancelers = [];

  function cancelAll() {
    while (cancelers.length) {
      const stop = cancelers.pop();
      stop && stop();
    }
  }

  function track(stop) {
    if (stop) cancelers.push(stop);
  }

  function setLinkStyles(opacity, y) {
    links.forEach((el) => {
      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${y}px)`;
    });
  }

  function getFocusable(container) {
    return [...container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(
      (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
    );
  }

  function onKeydown(e) {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeNav();
      return;
    }
    if (e.key !== "Tab" || !panel) return;
    const focusables = getFocusable(panel);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function mountOverlay() {
    mounted = true;
    overlay.classList.add("is-mounted");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-nav-locked");
    if (pageRoot) pageRoot.inert = true;
    document.addEventListener("keydown", onKeydown);
  }

  function unmountOverlay() {
    mounted = false;
    overlay.classList.remove("is-mounted");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-nav-locked");
    if (pageRoot) pageRoot.inert = false;
    document.removeEventListener("keydown", onKeydown);
    trigger && trigger.focus();
  }

  function openNav() {
    generation += 1;
    const gen = generation;
    cancelAll();

    if (!mounted) mountOverlay();
    open = true;
    trigger && trigger.setAttribute("aria-expanded", "true");

    backdrop.style.opacity = backdrop.style.opacity || "0";
    panel.style.opacity = panel.style.opacity || "0";
    if (!panel.style.transform) panel.style.transform = "translateY(-24px)";
    setLinkStyles(0, 28);

    track(
      springTo({
        from: Number(backdrop.style.opacity) || 0,
        to: 1,
        tension: 260,
        friction: 30,
        onUpdate: (v) => {
          backdrop.style.opacity = String(v);
        },
      })
    );

    const panelFromY = (() => {
      const m = /translateY\((-?\d+(?:\.\d+)?)px\)/.exec(panel.style.transform || "");
      return m ? Number(m[1]) : -24;
    })();

    track(
      springTo({
        from: Number(panel.style.opacity) || 0,
        to: 1,
        tension: 220,
        friction: 28,
        onUpdate: (v) => {
          panel.style.opacity = String(v);
        },
      })
    );
    track(
      springTo({
        from: panelFromY,
        to: 0,
        tension: 220,
        friction: 28,
        onUpdate: (v) => {
          panel.style.transform = `translateY(${v}px)`;
        },
      })
    );

    links.forEach((el, index) => {
      const delay = reduceMotion ? 0 : 120 + index * 70;
      window.setTimeout(() => {
        if (gen !== generation || !open) return;
        const startOpacity = Number(el.style.opacity) || 0;
        track(
          springTo({
            from: startOpacity,
            to: 1,
            tension: 200,
            friction: 26,
            onUpdate: (v) => {
              el.style.opacity = String(v);
            },
          })
        );
        track(
          springTo({
            from: 28,
            to: 0,
            tension: 200,
            friction: 26,
            onUpdate: (v) => {
              el.style.transform = `translateY(${v}px)`;
            },
          })
        );
      }, delay);
    });

    requestAnimationFrame(() => closeBtn && closeBtn.focus());
  }

  function closeNav() {
    if (!mounted) return;
    generation += 1;
    const gen = generation;
    cancelAll();
    open = false;
    trigger && trigger.setAttribute("aria-expanded", "false");

    track(
      springTo({
        from: Number(backdrop.style.opacity) || 1,
        to: 0,
        tension: 240,
        friction: 30,
        onUpdate: (v) => {
          backdrop.style.opacity = String(v);
        },
      })
    );

    let panelDone = false;
    const maybeUnmount = () => {
      if (gen !== generation) return;
      if (panelDone) unmountOverlay();
    };

    track(
      springTo({
        from: Number(panel.style.opacity) || 1,
        to: 0,
        tension: 240,
        friction: 26,
        onUpdate: (v) => {
          panel.style.opacity = String(v);
        },
        onComplete: () => {
          panelDone = true;
          maybeUnmount();
        },
      })
    );
    track(
      springTo({
        from: 0,
        to: -24,
        tension: 240,
        friction: 26,
        onUpdate: (v) => {
          panel.style.transform = `translateY(${v}px)`;
        },
      })
    );

    // Soften links during exit without waiting on them for unmount.
    links.forEach((el) => {
      track(
        springTo({
          from: Number(el.style.opacity) || 1,
          to: 0,
          tension: 240,
          friction: 26,
          onUpdate: (v) => {
            el.style.opacity = String(v);
          },
        })
      );
    });

    if (reduceMotion) {
      panelDone = true;
      maybeUnmount();
    }
  }

  function toggleNav() {
    if (open) closeNav();
    else openNav();
  }

  // Close icon hover spring (desktop only)
  let stopHover;
  if (fineHover && closeIcon && !reduceMotion) {
    closeBtn.addEventListener("pointerenter", () => {
      stopHover && stopHover();
      const current = Number(closeIcon.dataset.rot || 0);
      stopHover = springTo({
        from: current,
        to: 90,
        tension: 300,
        friction: 18,
        onUpdate: (v) => {
          closeIcon.dataset.rot = String(v);
          closeIcon.style.transform = `rotate(${v}deg)`;
        },
      });
    });
    closeBtn.addEventListener("pointerleave", () => {
      stopHover && stopHover();
      const current = Number(closeIcon.dataset.rot || 0);
      stopHover = springTo({
        from: current,
        to: 0,
        tension: 300,
        friction: 18,
        onUpdate: (v) => {
          closeIcon.dataset.rot = String(v);
          closeIcon.style.transform = `rotate(${v}deg)`;
        },
      });
    });
  }

  trigger && trigger.addEventListener("click", toggleNav);
  closeBtn && closeBtn.addEventListener("click", closeNav);
  links.forEach((el) => {
    el.addEventListener("click", () => {
      closeNav();
    });
  });

  // Rapid-toggle stress control for manual testing
  const stress = document.querySelector("[data-nav-stress]");
  if (stress) {
    stress.addEventListener("click", () => {
      let n = 0;
      const id = setInterval(() => {
        toggleNav();
        n += 1;
        if (n >= 6) clearInterval(id);
      }, 120);
    });
  }

  prepareHero();

  // Font load report
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      const report = document.querySelector("[data-font-report]");
      if (!report) return;
      const families = ["Onest", "General Sans", "Instrument Sans", "Manrope"];
      const lines = families.map((f) => {
        const ok = document.fonts.check(`500 16px "${f}"`) || document.fonts.check(`400 16px "${f}"`);
        return `${f}: ${ok ? "loaded" : "fallback"}`;
      });
      report.textContent = lines.join(" · ");
    });
  }
})();
