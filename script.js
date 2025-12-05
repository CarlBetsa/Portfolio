// copia o numero de telefone
document.addEventListener("DOMContentLoaded", () => {
    const phoneLink = document.querySelector(".phone-copy");

    if (!phoneLink) return;

    phoneLink.addEventListener("click", async () => {
        const number = phoneLink.getAttribute("data-phone");

        try {
            await navigator.clipboard.writeText(number);

            const msg = document.createElement("div");
            msg.textContent = "Number Copied!";
            msg.style.position = "fixed";
            msg.style.bottom = "30px";
            msg.style.left = "50%";
            msg.style.transform = "translateX(-50%)";
            msg.style.background = "var(--accent)";
            msg.style.color = "white";
            msg.style.padding = "10px 20px";
            msg.style.borderRadius = "10px";
            msg.style.fontSize = "1rem";
            msg.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
            msg.style.opacity = "0";
            msg.style.transition = "0.3s";

            document.body.appendChild(msg);

            requestAnimationFrame(() => {
                msg.style.opacity = "1";
            });

            setTimeout(() => {
                msg.style.opacity = "0";
                setTimeout(() => msg.remove(), 300);
            }, 2000);

        } catch (err) {
            console.error("Error upon copying", err);
        }
    });
});

// configura a galeria
document.querySelectorAll('.gallery').forEach(gallery => {

    const mainImage = gallery.querySelector('.main-image');
    const mainVideo = gallery.querySelector('.main-video');

    gallery.querySelectorAll('.thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {

            const type = thumb.dataset.type;
            const src = thumb.dataset.src;

            if (type === "image") {
                mainVideo.pause();
                mainVideo.style.display = "none";

                mainImage.src = src;
                mainImage.style.display = "block";
            }

            if (type === "video") {
                mainImage.style.display = "none";

                mainVideo.src = src;
                mainVideo.style.display = "block";
                mainVideo.play();
                mainVideo.muted = false;
            }
        });
    });
});

// lightbox para "zoom"
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.createElement('div'); // container interno
lightbox.appendChild(lightboxContent);

let originalRect = null;

// chama o lightbox
function openLightbox(el, type) {
    const rect = el.getBoundingClientRect();
    originalRect = rect;

    document.body.style.overflow = "hidden"; // impede scroll
    lightbox.style.display = "flex";
    lightboxContent.innerHTML = ""; // limpa o lightbox

    // pausa os outros videos
    document.querySelectorAll('main-video').forEach(v => v.pause());

    if (type === "image") {
        const img = document.createElement('img');
        img.src = el.src;
        img.style.position = "fixed";
        img.style.top = rect.top + "px";
        img.style.left = rect.left + "px";
        img.style.width = rect.width + "px";
        img.style.height = rect.height + "px";
        img.style.transition = "all 0.4s ease";
        img.style.transformOrigin = "top left";

        lightboxContent.appendChild(img);

        // zoom in da imagem
        setTimeout(() => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const maxWidth = viewportWidth * 0.9;
            const maxHeight = viewportHeight * 0.9;

            const aspectRatio = rect.width / rect.height;
            let targetWidth = maxWidth;
            let targetHeight = targetWidth / aspectRatio;

            if (targetHeight > maxHeight) {
                targetHeight = maxHeight;
                targetWidth = targetHeight * aspectRatio;
            }

            const targetTop = (viewportHeight - targetHeight) / 2;
            const targetLeft = (viewportWidth - targetWidth) / 2;

            const scaleX = targetWidth / rect.width;
            const scaleY = targetHeight / rect.height;
            const scale = Math.min(scaleX, scaleY);

            const translateX = targetLeft - rect.left;
            const translateY = targetTop - rect.top;

            img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }, 10);

    } else if (type === "video") {
        const video = document.createElement('video');
        video.src = el.src;
        video.controls = true;
        video.autoplay = true;
        video.muted = el.muted;
        video.style.position = "fixed";
        video.style.top = rect.top + "px";
        video.style.left = rect.left + "px";
        video.style.width = rect.width + "px";
        video.style.height = rect.height + "px";
        video.style.transition = "all 0.4s ease";
        video.style.transformOrigin = "top left";

        lightboxContent.appendChild(video);

        // zoom in do video
        setTimeout(() => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const maxWidth = viewportWidth * 0.9;
            const maxHeight = viewportHeight * 0.9;

            const aspectRatio = rect.width / rect.height;
            let targetWidth = maxWidth;
            let targetHeight = targetWidth / aspectRatio;

            if (targetHeight > maxHeight) {
                targetHeight = maxHeight;
                targetWidth = targetHeight * aspectRatio;
            }

            const targetTop = (viewportHeight - targetHeight) / 2;
            const targetLeft = (viewportWidth - targetWidth) / 2;

            const scaleX = targetWidth / rect.width;
            const scaleY = targetHeight / rect.height;
            const scale = Math.min(scaleX, scaleY);

            const translateX = targetLeft - rect.left;
            const translateY = targetTop - rect.top;

            video.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }, 10);
    }
}

// cria os listeners
document.querySelectorAll('.main-image').forEach(img => {
    img.addEventListener('click', () => openLightbox(img, "image"));
});
document.querySelectorAll('.main-video').forEach(video => {
    video.addEventListener('click', () => openLightbox(video, "video"));
});

// fecha o lightbox
lightbox.addEventListener('click', () => {
    const el = lightboxContent.firstChild;
    if (!el || !originalRect) return;

    el.style.transform = "translate(0px, 0px) scale(1)";
    el.style.top = originalRect.top + "px";
    el.style.left = originalRect.left + "px";
    el.style.width = originalRect.width + "px";
    el.style.height = originalRect.height + "px";

    setTimeout(() => {
        lightbox.style.display = "none";
        lightboxContent.innerHTML = "";
        document.body.style.overflow = ""; // reativa scroll
    }, 400);
});
