import { useEffect, useRef } from 'react'
import { profile, links, projects, skills } from './data'
import './App.css'

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
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Work</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="#projects">View Work</a>
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
            <a className="btn-primary" href="#projects">Explore the Work</a>
            <a className="btn-secondary" href="#about">About Me</a>
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
        <Reveal as="section" className="about-section">
          <h2 id="about">About</h2>
          <p>
            I'm {profile.name}. This is where I keep track of what I've made — software,
            designs, edits, whatever I've been into. No pitch, just the work.
          </p>
        </Reveal>

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
          <h2>Find Me Elsewhere</h2>
          <div className="links">
            <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={`mailto:${links.email}`}>Email</a>
            <a href={links.steam} target="_blank" rel="noreferrer">Steam</a>
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
