/* Landing page only: keep the first screen exactly one viewport tall and
   run the one-time loss counter with its 0.5 to 1 scale-up. No dependencies. */
(function () {
  "use strict";

  var DURATION = 5000;
  var header = document.querySelector(".landing-top");

  function syncHeaderHeight() {
    if (!header) return;
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }

  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight, { passive: true });
  if (header && "ResizeObserver" in window) {
    new ResizeObserver(syncHeaderHeight).observe(header);
  }

  var loss = document.querySelector(".loss--animated");
  var value = loss && loss.querySelector("[data-loss-count]");
  var amount = loss && loss.querySelector(".loss__amount");
  if (!loss || !value || !amount) return;

  var target = Number(value.getAttribute("data-loss-count")) || 0;
  var formatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

  function render(n, plus) {
    value.textContent = formatter.format(Math.max(0, Math.round(n))) + (plus ? "+" : "");
  }

  if (target <= 0) {
    render(target);
    return;
  }

  render(0);
  amount.style.transform = "scale(0.5)";

  window.requestAnimationFrame(function (ts) {
    var started = ts;

    function tick(now) {
      var progress = Math.min((now - started) / DURATION, 1);
      render(target * progress);
      amount.style.transform = "scale(" + (0.5 + 0.5 * progress) + ")";

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        render(target, true);
        amount.style.transform = "scale(1)";
        amount.style.willChange = "auto";
      }
    }

    window.requestAnimationFrame(tick);
  });
})();
