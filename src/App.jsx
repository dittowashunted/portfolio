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

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top: targetY, behavior: 'auto' })
    return
  }

  const duration = 700
  const start = performance.now()

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1)
    window.scrollTo({
      top: startY + distance * easeInOutCubic(progress),
      behavior: 'auto',
    })
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function useMagnetic(strength = 14) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      el.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`
    }
    const onLeave = () => {
      el.style.transform = 'translate(0, 0)'
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])
  return ref
}

function MagneticLink({ href, children, className }) {
  const ref = useMagnetic()
  return (
    <a
      ref={ref}
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

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState('about')
  const linkRefs = useRef({})
  const highlightRef = useRef(null)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > lastY.current && y > 160)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    )
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const moveHighlight = () => {
      const el = linkRefs.current[active]
      const highlight = highlightRef.current
      if (el && highlight) {
        highlight.style.width = `${el.offsetWidth}px`
        highlight.style.height = `${el.offsetHeight}px`
        highlight.style.transform = `translate(${el.offsetLeft}px, ${el.offsetTop}px)`
        highlight.style.opacity = '1'
      }
    }
    moveHighlight()
    window.addEventListener('resize', moveHighlight)
    return () => window.removeEventListener('resize', moveHighlight)
  }, [active])

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${hidden ? 'navbar-hidden' : ''}`}>
      <span className="brand">{profile.name}.</span>
      <div className="nav-links">
        <span ref={highlightRef} className="nav-highlight" />
        {NAV_ITEMS.map(({ id, label }) => (
          <a
            key={id}
            ref={(node) => {
              linkRefs.current[id] = node
            }}
            href={`#${id}`}
            className={active === id ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault()
              smoothScrollTo(`#${id}`)
            }}
          >
            {label}
          </a>
        ))}
      </div>
      <MagneticLink className="nav-cta" href="#projects">View Work</MagneticLink>
    </nav>
  )
}

function GlowHeadline() {
  const [glowing, setGlowing] = useState(false)
  const ref = useRef(null)
  const timeoutRef = useRef(null)

  const handleClick = () => {
    const hue = Math.floor(Math.random() * 360)
    ref.current?.style.setProperty('--glow-hue', hue)
    setGlowing(false)
    requestAnimationFrame(() => {
      setGlowing(true)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setGlowing(false), 1100)
    })
  }

  return (
    <h1 ref={ref} className={glowing ? 'glow-pulse' : ''} onClick={handleClick}>
      {profile.headlineTop}
      <br />
      <em>{profile.headlineBottom}</em>
    </h1>
  )
}

function GrainOverlay() {
  return <div className="grain-overlay" />
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
      <GrainOverlay />
      <CursorGlow />
      <div className="shape shape-square" />
      <div className="shape shape-circle" />
      <div className="shape shape-pill" />
      <div className="shape shape-diamond" />
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="blob blob-c" />

      <Navbar />

      <header className="hero">
        <div className="hero-inner">
          <span className="badge">
            <span className="badge-dot" /> {profile.status}
          </span>
          <GlowHeadline />
          <p className="subtext">{profile.subtext}</p>
          <div className="cta-row">
            <MagneticLink className="btn-primary" href="#projects">Explore the Work</MagneticLink>
            <MagneticLink className="btn-secondary" href="#about">About Me</MagneticLink>
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
                      <span className="stars-wrap">
                        <span className="stars-empty">★★★★★</span>
                        <span
                          className="stars-filled"
                          style={{ width: `${(skill.stars / 5) * 100}%` }}
                        >
                          ★★★★★
                        </span>
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
