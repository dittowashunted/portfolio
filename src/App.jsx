import { useEffect, useRef, useState } from 'react'
import {
  profile,
  stats,
  skills,
  skillLevels,
  tools,
  languages,
  experience,
  contacts,
  projects,
} from './data'
import './App.css'

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function smoothScrollTo(hash) {
  const target = document.querySelector(hash)
  if (!target) return
  const startY = window.scrollY
  const navOffset = 90
  const targetY =
    target.getBoundingClientRect().top + window.scrollY - navOffset
  const distance = targetY - startY
  const duration = 700
  const start = performance.now()

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1)
    window.scrollTo(0, startY + distance * easeInOutCubic(progress))
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function NavLink({ href, children, className }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        smoothScrollTo(href)
      }}
    >
      {children}
    </a>
  )
}

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function Reveal({ as: Tag = 'div', className = '', children }) {
  const ref = useReveal()
  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  )
}

function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      el.style.setProperty('--cursor-x', `${e.clientX}px`)
      el.style.setProperty('--cursor-y', `${e.clientY}px`)
      el.style.opacity = '1'
    }
    const onLeave = () => {
      el.style.opacity = '0'
    }
    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])
  return <div ref={ref} className="cursor-glow" />
}

function Counter({ value, suffix = '', duration = 1400 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.round(eased * value))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

function CopyContact({ contact }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contact.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable, ignore
    }
  }

  return (
    <button type="button" className="contact-card" onClick={handleCopy}>
      <div>
        <span className="contact-label">{contact.label}</span>
        <span className="contact-value">{contact.value}</span>
      </div>
      <span className="contact-arrow">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

function App() {
  return (
    <>
      <CursorGlow />
      <div className="shape shape-square" />
      <div className="shape shape-circle" />
      <div className="shape shape-pill" />
      <div className="shape shape-diamond" />
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="blob blob-c" />

      <nav className="navbar">
        <span className="brand">{profile.name}.</span>
        <div className="nav-links">
          <NavLink href="#about">About</NavLink>
          <NavLink href="#skills">Skills</NavLink>
          <NavLink href="#projects">Work</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </div>
        <NavLink className="nav-cta" href="#projects">View Work</NavLink>
      </nav>

      <header className="hero">
        <div className="hero-inner">
          <span className="badge">
            <span className="badge-dot" /> {profile.status}
          </span>
          <h1>
            {profile.headlineTop}
            <br />
            <em>{profile.headlineBottom}</em>
          </h1>
          <p className="subtext">{profile.subtext}</p>
          <div className="cta-row">
            <NavLink className="btn-primary" href="#projects">Explore the Work</NavLink>
            <NavLink className="btn-secondary" href="#about">About Me</NavLink>
          </div>
        </div>
        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </header>

      <div className="marquee">
        <div className="marquee-track">
          {Array(2).fill(skills).flat().map((skill, i) => (
            <span key={i}>{skill.title}</span>
          ))}
        </div>
      </div>

      <main>
        <section id="about" className="about-section">
          <Reveal as="h2">About</Reveal>
          <div className="about-grid">
            <Reveal className="about-photo">
              <img src={profile.avatar} alt={profile.name} />
              <span className="about-photo-label">{profile.name}</span>
            </Reveal>
            <Reveal className="about-copy">
              {profile.bioLong.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              <p className="about-tagline">{profile.bioShort}</p>
            </Reveal>
          </div>

          <Reveal className="stats-grid">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <span className="stat-value">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="skills" className="skills-section">
          <Reveal as="h2">Skills</Reveal>
          <div className="skills-grid">
            {skills.map((skill, i) => (
              <Reveal className="skill-card" key={skill.title}>
                <span className="skill-index">{String(i + 1).padStart(2, '0')}</span>
                <h3>{skill.title}</h3>
                <p>{skill.description}</p>
                <div className="tags">
                  {skill.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="experience" className="experience-section">
          <Reveal as="h2">Where I've Been</Reveal>
          <div className="experience-grid">
            <div className="timeline">
              {experience.map((item) => (
                <Reveal className="timeline-item" key={item.title}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.place}</p>
                  </div>
                  <span className="timeline-dates">{item.dates}</span>
                </Reveal>
              ))}
            </div>

            <div className="side-panels">
              <Reveal className="side-panel">
                <span className="side-panel-label">Skill Level</span>
                <div className="skill-bars">
                  {skillLevels.map((skill) => (
                    <div className="skill-bar-row" key={skill.title}>
                      <span>{skill.title}</span>
                      <span className="stars">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={i < skill.stars ? 'star-filled' : 'star-empty'}
                          >
                            ★
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal className="side-panel">
                <span className="side-panel-label">Tools I Use</span>
                <div className="tags">
                  {tools.map((tool) => (
                    <span key={tool} className="tag">{tool}</span>
                  ))}
                </div>
              </Reveal>

              <Reveal className="side-panel">
                <span className="side-panel-label">Languages</span>
                <div className="language-list">
                  {languages.map((lang) => (
                    <div className="language-row" key={lang.name}>
                      <span>{lang.name}</span>
                      <span className="language-level">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="projects" className="projects-section">
          <Reveal as="h2">Selected Work</Reveal>
          <div className="project-grid">
            {projects.map((project, i) => (
              <Reveal className="project-card" key={project.title}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="project-card-inner"
                >
                  <span className="project-index">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal as="section" id="contact" className="contact-section">
          <h2>Find Me</h2>
          <div className="contact-grid">
            {contacts.map((contact) =>
              contact.href ? (
                <a
                  className="contact-card"
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                >
                  <div>
                    <span className="contact-label">{contact.label}</span>
                    <span className="contact-value">{contact.value}</span>
                  </div>
                  <span className="contact-arrow">&#8599;</span>
                </a>
              ) : (
                <CopyContact key={contact.label} contact={contact} />
              )
            )}
          </div>
        </Reveal>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} {profile.name}</p>
      </footer>
    </>
  )
}

export default App
