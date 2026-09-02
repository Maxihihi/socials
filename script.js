let config = null;

// ========================================
// CONFIG LADEN
// ========================================

async function loadConfig() {
    try {
        const response = await fetch("./config.json?cache=" + Date.now());

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        config = await response.json();

        console.log("✅ Config geladen:", config);

        applyConfig();

    } catch (error) {
        console.error("❌ Config konnte nicht geladen werden:", error);

        document.getElementById("socials").innerHTML = `
            <div class="error">
                Config konnte nicht geladen werden.
            </div>
        `;
    }
}


// ========================================
// CONFIG ANWENDEN
// ========================================

function applyConfig() {

    // SITE
    document.title = config.site.title;

    document.getElementById("name").textContent =
        config.site.name;

    document.getElementById("subtitle").textContent =
        config.site.subtitle;

    document.getElementById("description").textContent =
        config.site.description;

    document.getElementById("footerText").textContent =
        `© ${config.site.year} • Made by ${config.site.name}`;


    // PROFILE
    document.getElementById("profileImage").src =
        config.profile.image;

    
    // SOCIALS
    createSocials();


    // EFFECTS
    if (config.effects.rain === true) {
        startRain();
    }

    if (config.effects.mouseGlow === true) {
        startMouseGlow();
    }

    if (config.effects.card3D === true) {
        startCard3D();
    }

    if (config.effects.cardFloat === true) {
        document
            .getElementById("card")
            .classList.add("floating");
    }

    if (config.effects.hoverPreview === true) {
        startHoverPreview();
    }
}


// ========================================
// SOCIAL BUTTONS
// ========================================

function createSocials() {

    const container =
        document.getElementById("socials");

    container.innerHTML = "";

    if (!Array.isArray(config.socials)) {
        console.error("❌ config.socials ist keine Liste.");
        return;
    }

    config.socials.forEach((social, index) => {

        // enabled: false = ausblenden
        if (social.enabled !== true) {
            return;
        }

        const link =
            document.createElement("a");

        link.className = "social";

        link.href = social.url;

        link.target = "_blank";

        link.rel = "noopener noreferrer";

        link.style.animationDelay =
            `${index * 0.07}s`;


        link.innerHTML = `
            <div class="socialIcon">
                <i class="${escapeHTML(social.icon)}"></i>
            </div>

            <div class="socialText">
                <strong>
                    ${escapeHTML(social.name)}
                </strong>

                <span>
                    ${escapeHTML(social.description)}
                </span>
            </div>

            <i class="fa-solid fa-arrow-up-right-from-square arrow"></i>
        `;


        link.dataset.name =
            social.name || "";

        link.dataset.description =
            social.description || "";

        link.dataset.preview =
            social.preview || "";

        link.dataset.icon =
            social.icon || "";


        container.appendChild(link);
    });
}


// ========================================
// HTML SICHERN
// ========================================

function escapeHTML(text) {

    return String(text ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ========================================
// RAIN
// ========================================

function startRain() {

    const rain =
        document.getElementById("rain");

    rain.innerHTML = "";

    for (let i = 0; i < 90; i++) {

        const drop =
            document.createElement("div");

        drop.className = "rainDrop";

        drop.style.left =
            Math.random() * 100 + "%";

        drop.style.height =
            20 + Math.random() * 35 + "px";

        drop.style.opacity =
            0.1 + Math.random() * 0.45;

        drop.style.animationDuration =
            0.7 + Math.random() * 1.4 + "s";

        drop.style.animationDelay =
            Math.random() * 2 + "s";

        rain.appendChild(drop);
    }
}


// ========================================
// MOUSE GLOW
// ========================================

function startMouseGlow() {

    const glow =
        document.getElementById("mouseGlow");

    document.addEventListener("mousemove", event => {

        glow.style.left =
            `${event.clientX}px`;

        glow.style.top =
            `${event.clientY}px`;
    });
}


// ========================================
// 3D CARD
// ========================================

function startCard3D() {

    const card =
        document.getElementById("card");

    card.addEventListener("mousemove", event => {

        const rect =
            card.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        const rotateY =
            ((x / rect.width) - 0.5) * 9;

        const rotateX =
            ((y / rect.height) - 0.5) * -9;

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-5px)
        `;
    });


    card.addEventListener("mouseleave", () => {

        card.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            translateY(0)
        `;
    });
}


// ========================================
// HOVER PREVIEW
// ========================================

function startHoverPreview() {

    const preview =
        document.getElementById("hoverPreview");

    const title =
        document.getElementById("previewTitle");

    const description =
        document.getElementById("previewDescription");

    const text =
        document.getElementById("previewText");

    const icon =
        document.getElementById("previewIcon");


    document
        .querySelectorAll(".social")
        .forEach(button => {

            button.addEventListener("mouseenter", () => {

                title.textContent =
                    button.dataset.name;

                description.textContent =
                    button.dataset.description;

                text.textContent =
                    button.dataset.preview;

                icon.className =
                    button.dataset.icon;

                preview.classList.add("visible");
            });


            button.addEventListener("mouseleave", () => {

                preview.classList.remove("visible");
            });
        });


    document.addEventListener("mousemove", event => {

        if (!preview.classList.contains("visible")) {
            return;
        }

        let x =
            event.clientX + 20;

        let y =
            event.clientY + 20;


        const width =
            preview.offsetWidth;

        const height =
            preview.offsetHeight;


        if (x + width > window.innerWidth) {
            x =
                event.clientX - width - 20;
        }

        if (y + height > window.innerHeight) {
            y =
                event.clientY - height - 20;
        }


        preview.style.left =
            `${x}px`;

        preview.style.top =
            `${y}px`;
    });
}


// ========================================
// START
// ========================================

loadConfig();
