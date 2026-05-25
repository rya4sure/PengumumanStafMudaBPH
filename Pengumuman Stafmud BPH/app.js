// Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbyqpSgkeeFN5CXBX1x1OxlgIDK5lEGgF9S8ztCyMIs9F5RIUH5IZbVovnQ-Oioj04F0/exec";

$(document).ready(function() {
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