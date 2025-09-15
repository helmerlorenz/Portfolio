// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));

// Skills animation
const skillProgress = document.querySelectorAll('.skill-progress');
const skillsSection = document.getElementById('skills');

function showSkills() {
  if (skillsSection.getBoundingClientRect().top < window.innerHeight - 100) {
    skillProgress.forEach(skill => {
      skill.style.width = skill.dataset.progress + '%';
    });
    window.removeEventListener('scroll', showSkills);
  }
}
window.addEventListener('scroll', showSkills);
