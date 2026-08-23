// ========================================
// SUPABASE CONFIG
// ========================================

const SUPABASE_URL = "https://pzhdivxuwrccqyscsvqa.supabase.co";

const SUPABASE_KEY = "sb_publishable_X-dkmQTQJrdavJm8Jfv7uA_bHSaCRym";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ========================================
// PROFILE
// ========================================

async function loadProfile() {
    const { data, error } = await supabaseClient
        .from("profile")
        .select("*")
        .limit(1)
        .single();

    if (error) {
        console.error("Profile error:", error);
        return;
    }

    document.getElementById("profile-name").textContent =
        data.name || "Utkarsh Kumar";

    document.getElementById("profile-headline").textContent =
        data.headline || "";

    document.getElementById("profile-about").textContent =
        data.about || "";

    document.getElementById("about-text").textContent =
        data.about || "";
}


// ========================================
// EDUCATION
// ========================================

async function loadEducation() {
    const container =
        document.getElementById("education-container");

    const { data, error } = await supabaseClient
        .from("education")
        .select("*")
        .order("start_year", { ascending: false });

    if (error) {
        console.error("Education error:", error);
        container.innerHTML =
            "<p>Education can not be loaded.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML =
            "<p>No education details available.</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach((item) => {
        const card = document.createElement("div");

        card.className = "education-card";

        const years =
            item.start_year || item.end_year
                ? `${item.start_year || ""} - ${item.end_year || "Present"}`
                : "";

        card.innerHTML = `
            <h3>${escapeHTML(item.degree)}</h3>

            <p>
                <strong>
                    ${escapeHTML(item.institution)}
                </strong>
            </p>

            <p>
                ${escapeHTML(item.field)}
            </p>

            <p>
                ${escapeHTML(item.semester)}
                ${years ? ` | ${escapeHTML(years)}` : ""}
            </p>

            <p>
                ${escapeHTML(item.description)}
            </p>
        `;

        container.appendChild(card);
    });
}


// ========================================
// SKILLS
// ========================================

async function loadSkills() {
    const container =
        document.getElementById("skills-container");

    const { data, error } = await supabaseClient
        .from("skills")
        .select("*")
        .order("level", { ascending: false });

    if (error) {
        console.error("Skills error:", error);
        container.innerHTML =
            "<p>Skills can not be loaded.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML =
            "<p>No skills available.</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach((skill) => {
        const level = Math.min(
            100,
            Math.max(0, Number(skill.level) || 0)
        );

        const card = document.createElement("div");

        card.className = "skill-card";

        card.innerHTML = `
            <h3>
                ${escapeHTML(skill.name)}
            </h3>

            <p class="skill-category">
                ${escapeHTML(skill.catagory)}
            </p>

            <div class="skill-bar">
                <div
                    class="skill-progress"
                    style="width: ${level}%"
                ></div>
            </div>

            <small>${level}%</small>
        `;

        container.appendChild(card);
    });
}


// ========================================
// PROJECTS
// ========================================

async function loadProjects() {
    const container =
        document.getElementById("projects-container");

    const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Projects error:", error);
        container.innerHTML =
            "<p>Projects can not be loaded.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML =
            "<p>No projects available.</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach((project) => {
        const card = document.createElement("div");

        card.className = "project-card";

        let imageHTML = "";

        if (project.image_url) {
            imageHTML = `
                <img
                    src="${escapeAttribute(project.image_url)}"
                    alt="${escapeAttribute(project.title)}"
                    style="
                        width: 100%;
                        border-radius: 8px;
                        margin-bottom: 15px;
                    "
                >
            `;
        }

        let linksHTML = "";

        if (project.github_url) {
            linksHTML += `
                <a
                    href="${escapeAttribute(project.github_url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub →
                </a>
            `;
        }

        if (project.live_url) {
            linksHTML += `
                <a
                    href="${escapeAttribute(project.live_url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Live Demo →
                </a>
            `;
        }

        card.innerHTML = `
            ${imageHTML}

            <h3>
                ${escapeHTML(project.title)}
            </h3>

            <p>
                ${escapeHTML(project.description)}
            </p>

            <p class="project-tech">
                ${escapeHTML(project.technologies)}
            </p>

            ${
                linksHTML
                    ? `
                    <div class="project-links">
                        ${linksHTML}
                    </div>
                    `
                    : ""
            }
        `;

        container.appendChild(card);
    });
}


// ========================================
// CERTIFICATES
// ========================================

async function loadCertificates() {
    const container =
        document.getElementById("certificates-container");

    const { data, error } = await supabaseClient
        .from("certificates")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Certificates error:", error);

        container.innerHTML =
            "<p>Certificates can not be loaded.</p>";

        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML =
            "<p>No certificates available.</p>";

        return;
    }

    container.innerHTML = "";

    data.forEach((certificate) => {
        const card = document.createElement("div");

        card.className = "certificate-card";

        let imageHTML = "";

        if (certificate.certificate_image) {
            imageHTML = `
                <img
                    src="${escapeAttribute(
                        certificate.certificate_image
                    )}"
                    alt="${escapeAttribute(
                        certificate.title
                    )}"
                    style="
                        width: 100%;
                        border-radius: 8px;
                        margin-bottom: 15px;
                    "
                >
            `;
        }

        let issueDate = "";

        if (certificate.issue_date) {
            issueDate = new Date(
                certificate.issue_date
            ).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        }

        card.innerHTML = `
            ${imageHTML}

            <h3>
                ${escapeHTML(certificate.title)}
            </h3>

            <p>
                Issued by:
                <strong>
                    ${escapeHTML(certificate.issuer)}
                </strong>
            </p>

            ${
                issueDate
                    ? `
                    <p>
                        Issued:
                        ${escapeHTML(issueDate)}
                    </p>
                    `
                    : ""
            }

            <p>
                ${escapeHTML(certificate.description)}
            </p>

            ${
                certificate.credential_url
                    ? `
                    <a
                        href="${escapeAttribute(
                            certificate.credential_url
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Verify Certificate →
                    </a>
                    `
                    : ""
            }
        `;

        container.appendChild(card);
    });
}


// ========================================
// CONTACT FORM
// ========================================

async function handleContactForm(event) {
    event.preventDefault();

    const status =
        document.getElementById("form-status");

    const name =
        document
            .getElementById("contact-name")
            .value
            .trim();

    const email =
        document
            .getElementById("contact-email")
            .value
            .trim();

    const subject =
        document
            .getElementById("contact-subject")
            .value
            .trim();

    const message =
        document
            .getElementById("contact-message")
            .value
            .trim();

    if (!name || !email || !message) {
        status.textContent =
            "Please fill all required fields.";

        return;
    }

    status.textContent = "Sending...";

    const { error } = await supabaseClient
        .from("messages")
        .insert([
            {
                name: name,
                email: email,
                subject: subject || null,
                message: message
            }
        ]);

    if (error) {
        console.error("Message error:", error);

        status.textContent =
            "Message send nahi hua.";

        return;
    }

    status.textContent =
        "Message successfully sent!";

    document
        .getElementById("contact-form")
        .reset();
}


// ========================================
// SECURITY HELPERS
// ========================================

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return escapeHTML(value);
}


// ========================================
// INITIALIZE PORTFOLIO
// ========================================

async function initializePortfolio() {

    console.log("Loading portfolio data...");

    await Promise.all([
        loadProfile(),
        loadEducation(),
        loadSkills(),
        loadProjects(),
        loadCertificates()
    ]);

    console.log("Portfolio loading complete!");
}


// ========================================
// CONTACT EVENT
// ========================================

document
    .getElementById("contact-form")
    .addEventListener(
        "submit",
        handleContactForm
    );


// ========================================
// START
// ========================================

initializePortfolio();
