// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Variables
const openBtn = document.getElementById("open-invite-btn");
const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
let isMusicPlaying = false;

// Initialize GSAP ScrollTrigger Animations for Sections
const animateOnScroll = () => {
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, { scrollTrigger: { trigger: title, start: "top 85%" }, y: 30, opacity: 0, duration: 1 });
    });

    gsap.from(".person.groom", { scrollTrigger: { trigger: ".couple", start: "top 70%" }, x: -50, opacity: 0, duration: 1 });
    gsap.from(".person.bride", { scrollTrigger: { trigger: ".couple", start: "top 70%" }, x: 50, opacity: 0, duration: 1 });

    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: "top 85%" },
            x: item.classList.contains('left') ? -50 : 50,
            opacity: 0, duration: 1, ease: "power2.out"
        });
    });

    gsap.from(".venue-content", { scrollTrigger: { trigger: ".venue", start: "top 80%" }, y: 50, opacity: 0, duration: 1 });
    gsap.from(".rsvp-form", { scrollTrigger: { trigger: ".rsvp", start: "top 80%" }, scale: 0.9, opacity: 0, duration: 1 });
};

animateOnScroll();

// 1. Curtain Opening Cinematic Animation
openBtn.addEventListener("click", () => {
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        gsap.to(musicToggle, { opacity: 1, pointerEvents: "auto", duration: 1 });
    }).catch(err => console.log("Audio play blocked by browser."));

    const tl = gsap.timeline({
        onComplete: () => {
            document.body.style.overflowY = "auto";
            document.body.style.overflowX = "hidden"; // Enforces no horizontal scroll issues
            ScrollTrigger.refresh(); // Refreshes layout measurements safely
        }
    });

    tl.to(".curtain-content", { opacity: 0, scale: 0.8, duration: 0.8, ease: "power2.in" })
      .to(".curtain-left", { x: "-100%", duration: 1.5, ease: "power3.inOut" }, "open")
      .to(".curtain-right", { x: "100%", duration: 1.5, ease: "power3.inOut" }, "open")
      .set(".curtain-container", { display: "none" })
      .from(".hero-date", { y: 30, opacity: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.5")
      .from(".hero-names", { scale: 0.8, opacity: 0, duration: 1.5, ease: "power3.out" }, "-=0.8")
      .from(".hero-location", { y: 20, opacity: 0, duration: 1 }, "-=1");

    startPetals();
});

// 2. Music Play/Pause Toggle
musicToggle.addEventListener("click", () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        bgMusic.play();
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    isMusicPlaying = !isMusicPlaying;
});

// 3. Falling Petals Generator
function startPetals() {
    const container = document.getElementById("petals-container");
    setInterval(() => {
        const petal = document.createElement("div");
        petal.classList.add("petal");
        const size = Math.random() * 10 + 10;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.top = `-20px`;
        const colors =["#ff3b3b", "#d40000", "#ff6b6b", "#8a0303"];
        petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(petal);
        gsap.to(petal, {
            y: window.innerHeight + 50, x: `+=${Math.random() * 100 - 50}`,
            rotation: Math.random() * 360, duration: Math.random() * 3 + 4,
            ease: "none", onComplete: () => petal.remove()
        });
    }, 300);
}

// 4. RSVP FORM SUBMISSION (Using Web3Forms - Guaranteed to work)
const rsvpForm = document.getElementById("rsvp-form");
const rsvpBtn = document.getElementById("rsvp-btn");

if (rsvpForm) {
    rsvpForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Prevent page reload
        
        // Show loading spinner
        const originalText = rsvpBtn.innerHTML;
        rsvpBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        
        // Collect Form Data
        const formData = new FormData(rsvpForm);
        
        // 👉 PASTE YOUR WEB3FORMS ACCESS KEY BELOW 👈
        formData.append("access_key", "853dc5ad-d46a-4558-8fd5-2f96fa8c211f");
        
        // Settings for the email you will receive
        formData.append("subject", "🎉 New Wedding RSVP Received!");
        formData.append("from_name", "Wedding Invitation Website");

        // Send data to Web3Forms API
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                // Success! Change button to green checkmark
                alert("Thank you! Your RSVP has been securely sent to Pavan & Pooja.");
                rsvpForm.reset();
                rsvpBtn.innerHTML = 'RSVP Confirmed <i class="fas fa-check"></i>';
                rsvpBtn.style.pointerEvents = "none";
                rsvpBtn.style.background = "linear-gradient(45deg, #2e7d32, #4caf50)"; 
                rsvpBtn.style.color = "white";
            } else {
                console.log(response);
                alert("Oops! Something went wrong.");
                rsvpBtn.innerHTML = originalText;
            }
        })
        .catch(error => {
            console.log(error);
            alert("Oops! Check your internet connection and try again.");
            rsvpBtn.innerHTML = originalText;
        });
    });
}