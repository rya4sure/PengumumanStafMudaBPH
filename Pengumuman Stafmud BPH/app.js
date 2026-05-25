// Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbyqpSgkeeFN5CXBX1x1OxlgIDK5lEGgF9S8ztCyMIs9F5RIUH5IZbVovnQ-Oioj04F0/exec";

$(document).ready(function() {
    // ==================== COUNTDOWN TIMER ====================
    // Target: 26 Mei 2026, 08:00 WIB (UTC+7)
    const OPEN_TIME = new Date('2026-05-26T08:00:00+07:00').getTime();

    function initCountdown() {
        const now = Date.now();
        if (now >= OPEN_TIME) {
            // Already past open time — remove countdown, show main
            $("#countdown-page").remove();
            $("#main").show();
            $("#nim").focus();
            return;
        }

        // Hide main content while countdown is active
        $("#main").hide();

        // Create floating particles
        createParticles();

        // Start the countdown interval
        updateCountdown(); // initial call
        const countdownInterval = setInterval(function() {
            const remaining = OPEN_TIME - Date.now();

            if (remaining <= 0) {
                clearInterval(countdownInterval);
                // Animate out the countdown page
                $("#countdown-page").addClass("countdown-hidden");
                setTimeout(function() {
                    $("#countdown-page").remove();
                    $("#main").show();
                    $("#nim").focus();
                }, 900);
                return;
            }

            updateCountdown();
        }, 1000);
    }

    function updateCountdown() {
        const remaining = OPEN_TIME - Date.now();
        if (remaining <= 0) return;

        const totalSeconds = Math.floor(remaining / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        animateDigit("cd-hours", String(hours).padStart(2, '0'));
        animateDigit("cd-minutes", String(minutes).padStart(2, '0'));
        animateDigit("cd-seconds", String(seconds).padStart(2, '0'));
    }

    function animateDigit(id, newValue) {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.textContent !== newValue) {
            el.textContent = newValue;
            el.classList.remove("tick");
            // Force reflow to restart animation
            void el.offsetWidth;
            el.classList.add("tick");
        }
    }

    function createParticles() {
        const container = document.getElementById("particles");
        if (!container) return;
        const count = 25;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement("div");
            particle.classList.add("countdown-particle");
            particle.style.left = Math.random() * 100 + "%";
            particle.style.animationDelay = Math.random() * 6 + "s";
            particle.style.animationDuration = (4 + Math.random() * 4) + "s";
            particle.style.width = (2 + Math.random() * 4) + "px";
            particle.style.height = particle.style.width;
            container.appendChild(particle);
        }
    }

    // Initialize countdown check
    initCountdown();

    // ==================== ORIGINAL APP LOGIC ====================
    // Focus on NIM input
    $("#nim").focus();

    // Search button click
    $("#search").on("click", function() {
        searchByNIM();
    });

    // Enter key on input
    $("#nim").keydown(function(e) {
        if (e.which === 13) {
            searchByNIM();
        }
    });

    // Back buttons
    $("#back, #back-notfound").on("click", function() {
        showMain();
    });
});

function searchByNIM() {
    var nim = $("#nim").val().trim();

    if (!nim) {
        showError("Mohon masukkan NIM Anda.");
        return;
    }

    hideError();

    // Show loading state
    $("#search").prop("disabled", true).html("Mencari...");

    $.ajax({
        type: "GET",
        dataType: "json",
        url: API_URL,
        data: { nim: nim },
        success: function(response) {
            $("#search").prop("disabled", false).html("Lihat Hasil");

            if (response.found) {
                showResult(response);
            } else {
                showNotFound(nim);
            }
        },
        error: function(xhr, status, error) {
            $("#search").prop("disabled", false).html("Lihat Hasil");
            console.log("Error: " + status + " - " + error);
            showError("Terjadi kesalahan. Silakan coba lagi.");
        }
    });
}

function generateQRCode(whatsappLink) {
    // Clear previous QR code
    $("#qrcode-container").empty();

    // Generate QR code with WhatsApp link
    var qrText = whatsappLink || "https://wa.me/";

    new QRCode(document.getElementById("qrcode-container"), {
        text: qrText,
        width: 170,
        height: 170,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });
}

function showResult(data) {
    hideMain();
    hideNotFound();

    // Fill in the data
    $("#nim-result").html(data.nim || "-");
    $("#nama-snpmb-result").html(data.nama || "-");
    $("#departemen-result").html(data.departemen || "-");

    // Generate QR Code from WhatsApp link
    generateQRCode(data.whatsapp);

    $("#result").show();
    $("body").scrollTop(0);
}

function showNotFound(nim) {
    hideMain();
    hideResult();
    $("#nim-tidak-ditemukan").html(nim);
    $("#not-found").show();
    $("#not-found").focus();
}

function showMain() {
    hideError();
    hideResult();
    hideNotFound();
    $("#nim").val("");
    $("#main").show();
    $("#nim").focus();
}

function hideMain() {
    $("#main").hide();
}

function hideResult() {
    $("#result").hide();
}

function hideNotFound() {
    $("#not-found").hide();
}

function showError(message) {
    $("#error-msg").html(message);
    $("#error").show();
}

function hideError() {
    $("#error").hide();
}